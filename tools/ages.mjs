// Which buildings stood at each stop of the timeline. Nobody records a year of construction for every house of
// Freiburg (OpenStreetMap has one for about 2 % of them), so this is READ OFF THE OLD PLANS: an inference, not a
// record, and the viewer says so.
//   node tools/ages.mjs [--debug]  -> public/data/ages.json: { stops, standing: { <building>: "10110111" }, counts }
//                                     (one character per stop, 1 = standing; buildings standing at every stop are
//                                      left out; a building is its outline — `group ?? id` in city.json)
//                                     --debug also writes shots/ages-<plan>.jpg (what was read as built, in red;
//                                     as destroyed, in blue) and shots/ages.png (the footprints by first stop)
// How a plan is read: every plan tints the blocks that are built on, each in its own way (hatching in 1838 and
// 1875, orange in 1903, 1944 and 1955, grey in 1920). The scan is blurred a little (the hatching and the lettering
// melt into a tone) and each pixel is called built or open by that tone; a building counts as built on a plan when
// half its footprint or more is. The thresholds below were set by eye on the --debug pictures.
// The rules (all of them assumptions):
//   * 1875 … 1944: a building stands from the first plan on which its ground is built on. The plans tint whole
//     blocks, not houses: "this block was built on", and a house rebuilt since still counts as old.
//   * 1838: the plan of 1838 draws gardens, ramparts and slopes as densely as houses, so its tone alone cannot be
//     trusted: a building stands in 1838 if its ground reads as built on BOTH the plan of 1838 and that of 1875.
//     Where the sheet of 1838 does not reach, nothing is shown standing.
//   * November 1944: gone if half its footprint or more is black on the damage map of the raid of 27 November 1944
//     (legend: "schwere bis Totalschäden (unbewohnbar)").
//   * 1955: what stood after the raid still stands, unless its block is drawn hatched (legend: "Zerstörte
//     Baublöcke"); what did not stands again if its block is drawn as built.
//   * 1981 and today: everything stands (the plan of 1981 is too small in scale to read house by house).
//   * a year in OpenStreetMap (start_date) overrides the reading: not standing before it, standing from it on until
//     the war. For the 70 or so buildings that have one.
//   * the six hand-made landmarks are not in the list: they stand at every stop (their cards tell their history).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const STOPS = ['1838', '1875', '1903', '1920', '1944', 'bomben', '1955', '1981'], YEAR = [1838, 1875, 1903, 1920, 1944, 1944.9, 1955, 1981];
const lum = (r, g, b) => 0.3 * r + 0.59 * g + 0.11 * b;
// each returns 1 built, 2 destroyed (the damage map's black, 1955's hatched blocks), 0 open, from the blurred colour
const BLUR = { 1838: 7, 1875: 7, 1955: 8 }; // (pixels; 4 for the others: the hatched plans need more to melt into a tone)
const READ = {
  1838: (r, g, b) => (lum(r, g, b) < 177 ? 1 : 0),
  1875: (r, g, b) => (lum(r, g, b) < 176 ? 1 : 0),
  1903: (r, g, b) => (r - b > 86 ? 1 : 0),
  1920: (r, g, b) => (lum(r, g, b) < 160 && r - b < 75 ? 1 : r - b >= 75 && lum(r, g, b) < 150 ? 1 : 0),
  1944: (r, g, b) => (r - b > 68 && r > 150 ? 1 : 0),
  bomben: (r, g, b) => (lum(r, g, b) < 92 ? 2 : b - r > 18 ? 1 : 0),
  1955: (r, g, b) => (r - b > 95 ? 1 : r - b > 76 ? 2 : 0), // (the hatching, blurred, is half way between the tint and the paper)
};
const debug = process.argv.includes('--debug');
const city = JSON.parse(readFileSync('public/data/city.json', 'utf8'));
const plans = JSON.parse(readFileSync('public/plan/plans.json', 'utf8')).plans;
const [x0, z0, W, H] = plans[0].area;

// the buildings, by outline; the hand-made places are left out
const groups = new Map();
for (const b of city.buildings) {
  if (b.place) continue;
  const key = b.group ?? b.id;
  if (!groups.has(key)) groups.set(key, { rings: [], ids: new Set([key]) });
  groups.get(key).rings.push(b.rings); groups.get(key).ids.add(b.id);
}
const claimed = new Set(city.buildings.filter((b) => b.place).map((b) => b.group ?? b.id));
for (const k of claimed) groups.delete(k);

// a year from OpenStreetMap, where there is one ("1460", "vor 1460", "1956 / 1989", "1900-07-28": the first year)
const dated = new Map();
for (const layer of ['buildings', 'parts']) {
  const file = `sources/osm/${layer}.json`;
  if (!existsSync(file)) continue;
  for (const e of JSON.parse(readFileSync(file, 'utf8')).elements) {
    const m = /\b(1[0-9]{3}|20[0-9]{2})\b/.exec(e.tags?.start_date ?? '');
    if (m) dated.set(`${e.type[0]}${e.id}`, Number(m[1]));
  }
}

// read every plan under every footprint
const frac = new Map([...groups.keys()].map((k) => [k, {}]));
for (const key of STOPS.slice(0, 7)) {
  const src = `sources/plan/${key}.jpg`;
  if (!existsSync(src)) { console.error(`${src} is missing: run "npm run plan" first`); process.exit(1); }
  const { data, info } = await sharp(src).blur(BLUR[key] ?? 4).raw().toBuffer({ resolveWithObject: true });
  const alpha = await sharp(`sources/plan/${key}-cover.png`).ensureAlpha().extractChannel(3).resize(info.width, info.height, { fit: 'fill' }).raw().toBuffer();
  const w = info.width, h = info.height, kx = w / W, kz = h / H, cls = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) cls[i] = alpha[i] < 128 ? 3 : READ[key](data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  for (const [k, g] of groups) {
    const n = [0, 0, 0, 0];
    for (const rings of g.rings) {
      const px = rings.map((r) => r.map(([x, z]) => [(x - x0) * kx, (z - z0) * kz]));
      let ax = 1e9, az = 1e9, bx = -1e9, bz = -1e9;
      for (const [x, z] of px[0]) { ax = Math.min(ax, x); bx = Math.max(bx, x); az = Math.min(az, z); bz = Math.max(bz, z); }
      for (let y = Math.max(0, Math.floor(az)); y <= Math.min(h - 1, Math.ceil(bz)); y++) for (let x = Math.max(0, Math.floor(ax)); x <= Math.min(w - 1, Math.ceil(bx)); x++) {
        let inside = false;
        for (const r of px) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
          const [xi, yi] = r[i], [xj, yj] = r[j];
          if ((yi > y + 0.5) !== (yj > y + 0.5) && x + 0.5 < ((xj - xi) * (y + 0.5 - yi)) / (yj - yi) + xi) inside = !inside;
        }
        if (inside) n[cls[y * w + x]]++;
      }
    }
    const all = n[0] + n[1] + n[2] + n[3] || 1;
    frac.get(k)[key] = { built: n[1] / all, gone: n[2] / all, unknown: n[3] / all };
  }
  if (debug) {
    mkdirSync('shots', { recursive: true });
    const out = Buffer.alloc(w * h * 3);
    for (let i = 0; i < w * h; i++) { const c = cls[i], t = c === 1 ? [255, 40, 40] : c === 2 ? [40, 60, 255] : c === 3 ? [255, 255, 255] : null; for (let j = 0; j < 3; j++) out[i * 3 + j] = t ? (data[i * 3 + j] + t[j]) / 2 : data[i * 3 + j]; }
    await sharp(out, { raw: { width: w, height: h, channels: 3 } }).extract({ left: 1100, top: 700, width: 2000, height: 1900 }).resize(1500).jpeg({ quality: 80 }).toFile(`shots/ages-${key}.jpg`);
  }
  console.log('read', key);
}

// the rules
const standing = {}, counts = STOPS.map(() => 0), first = new Map();
for (const [k, f] of frac) {
  const s = STOPS.map(() => true);
  let from = -1;
  for (let i = 1; i < 5; i++) if (f[STOPS[i]].built >= 0.5) { from = i; break; }
  for (let i = 1; i < 5; i++) s[i] = from >= 0 && i >= from;
  s[0] = from === 1 && f['1838'].built >= 0.5;
  const year = [...groups.get(k).ids].map((id) => dated.get(id)).find((y) => y);
  if (year) for (let i = 0; i < STOPS.length; i++) { if (YEAR[i] < year) s[i] = false; else if (i < 5 && f[STOPS[i]].unknown < 0.5) s[i] = true; }
  s[5] = s[4] && f.bomben.gone < 0.5;
  s[6] = ((s[5] && f['1955'].gone < 0.5) || f['1955'].built >= 0.5) && !(year > 1955);
  s[7] = !(year > 1981);
  first.set(k, s.indexOf(true));
  s.forEach((v, i) => { if (v) counts[i]++; });
  if (s.includes(false)) standing[k] = s.map((v) => (v ? 1 : 0)).join('');
}
writeFileSync('public/data/ages.json', `${JSON.stringify({ stops: STOPS, buildings: groups.size, counts, standing })}\n`);
console.log(`${groups.size} buildings (${dated.size} OSM elements with a year); standing at each stop:`);
STOPS.forEach((k, i) => console.log(`  ${k.padEnd(7)} ${counts[i]}`));

if (debug) {
  const S = 0.7, wpx = Math.round(W * S), hpx = Math.round(H * S), tone = ['#3b2f2f', '#8a5a3c', '#c98b4a', '#e3c36a', '#9ab86a', '#888', '#5aa0c8', '#b070c0'];
  const paths = [...groups].map(([k, g]) => { const i = first.get(k); const d = g.rings.map((rs) => rs.map((r) => 'M' + r.map(([x, z]) => `${((x - x0) * S).toFixed(1)},${((z - z0) * S).toFixed(1)}`).join('L') + 'Z').join('')).join(''); return `<path d="${d}" fill="${i < 0 ? '#f0f' : tone[i]}" stroke="${(standing[k] ?? '11111111')[5] === '0' ? '#000' : 'none'}" stroke-width="0.8"/>`; }).join('');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${wpx}" height="${hpx}"><rect width="100%" height="100%" fill="#f4eee0"/>${paths}</svg>`)).png().toFile('shots/ages.png');
}
