// Which buildings stood at each stop of the timeline, which lay in ruins, and which buildings that are gone today
// stood where the plans show a built-up block and today's city has nothing. Nobody records a year of construction
// for every house of Freiburg (OpenStreetMap has one for about 2 % of them), so all of this is READ OFF THE OLD
// PLANS: an inference, not a record, and the viewer says so.
//   node tools/ages.mjs [--debug]  -> public/data/ages.json:
//       { stops, buildings, counts, ruins, lostCounts,
//         standing: { <building>: "10111201" },     one character per stop: 0 not there, 1 standing, 2 in ruins
//                                                   (buildings standing at every stop are left out; a building is
//                                                    its outline — `group ?? id` in city.json)
//         lost: [{ ring: [[x, z], …], when }] }     the buildings that are gone: a footprint cut out of the plans
//                                                   (world metres) and the same kind of string
//     --debug also writes shots/ages-<plan>.jpg (what was read as built, in red; drawn as a building of its own, in
//     dark red; as destroyed, in blue), shots/ages.png (the footprints by first stop) and shots/lost.jpg (the
//     plan of 1920 as read, with today's buildings in blue and the lost ones in yellow)
// How a plan is read: every plan marks what is built on in its own way. Those of 1838 and 1875 hatch it; those of
// 1903, 1944 and 1955 tint whole blocks orange, yards and gardens included; that of 1920 tints the old town's blocks
// grey and, outside it, draws every house (grey) in its garden (green). All draw the public buildings darker, each
// with its own shape. The scan is blurred a little (the hatching and the lettering melt into a tone) and each pixel
// is called built or open by its colour; a building counts as built on a plan when half its footprint or more is.
// The thresholds below were set by eye on the --debug pictures.
// A town plan draws its streets wider than they are, so its blocks come out a few metres short: for the buildings,
// the colour plans are read generously (built within REACH metres counts as built).
// The rules (all of them assumptions):
//   * 1875 … 1944: a building stands from the first plan on which its ground is built on. Where a plan tints whole
//     blocks this only says "this block was built on", and a house rebuilt since still counts as old.
//   * the plan of 1920 draws house by house: what it leaves open was not there in 1920, nor before.
//   * 1838: the plan of 1838 draws gardens, ramparts and slopes as densely as houses, so its tone alone cannot be
//     trusted: a building stands in 1838 if its ground reads as built on BOTH the plan of 1838 and that of 1875.
//     Where the sheet of 1838 does not reach, nothing is shown standing.
//   * November 1944: in ruins if it stood and half its footprint or more is black on the damage map of the raid of
//     27 November 1944 (legend: "schwere bis Totalschäden (unbewohnbar)").
//   * 1955: what stood after the raid still stands, unless its block is drawn hatched (legend: "Zerstörte
//     Baublöcke"); what did not stands again if its block is drawn as built. The ruins are taken as cleared.
//   * 1981 and today: everything stands (the plan of 1981 is too small in scale to read house by house).
//   * a year in OpenStreetMap (start_date) overrides the reading: not standing before it, standing from it on until
//     the war. For the 70 or so buildings that have one.
//   * the hand-made landmarks are not in the list: each stands from the year it says (PLACE.since, src/places/) or,
//     if it says none, at every stop (their cards tell their history).
// The lost buildings (assumptions, every one but where they stood): wherever the plan of 1920 draws a building and
// none of today's buildings stood there in 1920, something else did.
//   * a public building, drawn on its own (brown: a barracks, a hospital, the old station), is taken whole;
//   * so is a house outside the old town, which that plan draws one by one;
//   * of a solid block of the old town, only a strip along the street is taken (DEPTH metres deep): the plan tints
//     the block's yards like its houses, and a row of houses on the street is the likeliest thing that stood there;
//   * strips and scraps narrower than about 7 m are dropped (the plans and today's map never fit to the metre);
//   * what is left is cut into pieces the size of a house, and a piece that is nearly a rectangle is made one;
//   * a piece counts only if the plan of 1903 or that of 1944 tints its ground as built too (the plan of 1920 draws
//     river banks, paths and flower beds with strokes that read as grey as well);
//   * each piece stands at the stops where the plan shows its ground built on and no building of today covers it,
//     is in ruins in November 1944 if the damage map is black there, stands in 1955 only if it came through the
//     raid and the plan of 1955 still draws it, and is gone by 1981.
// So: where they stood is read off a plan; their outlines are the plan's, roughly; their height, roofs and colours
// are made up in the viewer (src/city.js). Buildings put up after 1920 and gone since are missing altogether.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { PLACES } from '../src/places/index.js';

const STOPS = ['1838', '1875', '1903', '1920', '1944', 'bomben', '1955', '1981'], YEAR = [1838, 1875, 1903, 1920, 1944, 1944.9, 1955, 1981];
const DEPTH = 13;      // metres: how deep the row of lost houses along a street is taken to be
const NARROW = 3.4;    // metres: lost ground narrower than twice this is dropped
const HOUSE = [9, 14]; // metres: the width of a lost house along its row (each row picks one in between)
const lum = (r, g, b) => 0.3 * r + 0.59 * g + 0.11 * b;
// each returns 1 built (a tinted block), 4 built (a building drawn on its own, darker), 2 destroyed (the damage
// map's black, 1955's hatched blocks), 0 open, from the blurred colour
const BLUR = { 1838: 7, 1875: 7, 1920: 1.5, 1955: 8 }; // (pixels; 4 for the others: the hatched plans need more to melt into a tone, and 1920, drawn house by house, hardly any)
const READ = {
  1838: (r, g, b) => (lum(r, g, b) < 105 ? 4 : lum(r, g, b) < 177 ? 1 : 0),
  1875: (r, g, b) => (lum(r, g, b) < 128 ? 4 : lum(r, g, b) < 176 ? 1 : 0),
  1903: (r, g, b) => (r - b > 86 ? (g < 132 ? 4 : 1) : 0),
  // (1920: grey is a building, brown a public one; the gardens are green, the streets yellow, the lines near black)
  1920: (r, g, b) => { const l = lum(r, g, b); return r - b >= 62 && r - g >= 30 && l < 160 ? 4 : r - b <= 54 && g - r < 15 && l >= 138 && l <= 182 ? 1 : 0; },
  1944: (r, g, b) => (r - b > 68 && r > 150 ? (g < 122 ? 4 : 1) : 0),
  bomben: (r, g, b) => (lum(r, g, b) < 92 ? 2 : b - r > 18 ? 1 : 0),
  1955: (r, g, b) => (r - b > 95 ? (g < 125 ? 4 : 1) : r - b > 76 ? 2 : 0), // (the hatching, blurred, is half way between the tint and the paper)
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
const keys = [...groups.keys()];

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

// ---------------------------------------------------------------------------------------------- the plans, read
// cls[k][pixel]: 0 open, 1 a built-up block, 2 destroyed, 3 beyond the sheet, 4 a building drawn on its own
const cls = [], tone = [];
let w = 0, h = 0;
for (const key of STOPS.slice(0, 7)) {
  const src = `sources/plan/${key}.jpg`;
  if (!existsSync(src)) { console.error(`${src} is missing: run "npm run plan" first`); process.exit(1); }
  const { data, info } = await sharp(src).blur(BLUR[key] ?? 4).raw().toBuffer({ resolveWithObject: true });
  if (w && (info.width !== w || info.height !== h)) { console.error(`${src}: not the size of the other plans`); process.exit(1); }
  w = info.width; h = info.height;
  const alpha = await sharp(`sources/plan/${key}-cover.png`).ensureAlpha().extractChannel(3).resize(w, h, { fit: 'fill' }).raw().toBuffer();
  const c = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) c[i] = alpha[i] < 128 ? 3 : READ[key](data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  cls.push(c); if (debug) tone.push(data);
  console.log('read', key);
}
const N = w * h, kx = w / W, kz = h / H, M2 = 1 / (kx * kz); // (M2: square metres per pixel)
const built = (k, p) => cls[k][p] === 1 || cls[k][p] === 4;

// ------------------------------------------------------------------------------------------------ the grid's tools
/** the distance (in pixels, capped) from every pixel to the nearest one where `on` is set (Felzenszwalb & Huttenlocher) */
function distance(on) {
  const INF = 1e12, d = new Float32Array(N), n = Math.max(w, h), f = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1), out = new Float64Array(n);
  const pass = (len) => {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s;
      for (;;) { const p = v[k]; s = (f[q] + q * q - (f[p] + p * p)) / (2 * q - 2 * p); if (s <= z[k] && k > 0) k--; else break; }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) { while (z[k + 1] < q) k++; const p = v[k]; out[q] = (q - p) * (q - p) + f[p]; }
  };
  for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = on[y * w + x] ? 0 : INF; pass(h); for (let y = 0; y < h; y++) d[y * w + x] = out[y]; }
  for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = d[y * w + x]; pass(w); for (let x = 0; x < w; x++) d[y * w + x] = Math.sqrt(out[x]); }
  return d;
}
const not = (m) => { const o = new Uint8Array(N); for (let p = 0; p < N; p++) o[p] = m[p] ? 0 : 1; return o; };
const grow = (m, r) => { const d = distance(m), o = new Uint8Array(N); for (let p = 0; p < N; p++) o[p] = d[p] <= r ? 1 : 0; return o; };
const shrink = (m, r) => not(grow(not(m), r));
const open = (m, r) => grow(shrink(m, r), r);   // (drops what is narrower than 2 r)
const close = (m, r) => shrink(grow(m, r), r);  // (fills gaps narrower than 2 r)
/** labels the connected pieces of a grid of labels (same label, touching by a side); returns the labels and their sizes */
function pieces(of) {
  const lab = new Int32Array(N).fill(-1), size = [], stack = new Int32Array(N);
  for (let p0 = 0; p0 < N; p0++) {
    if (of[p0] < 0 || lab[p0] >= 0) continue;
    const id = size.length, v = of[p0]; let n = 0, top = 0;
    stack[top++] = p0; lab[p0] = id;
    while (top) {
      const p = stack[--top], x = p % w; n++;
      if (x > 0 && lab[p - 1] < 0 && of[p - 1] === v) { lab[p - 1] = id; stack[top++] = p - 1; }
      if (x < w - 1 && lab[p + 1] < 0 && of[p + 1] === v) { lab[p + 1] = id; stack[top++] = p + 1; }
      if (p >= w && lab[p - w] < 0 && of[p - w] === v) { lab[p - w] = id; stack[top++] = p - w; }
      if (p < N - w && lab[p + w] < 0 && of[p + w] === v) { lab[p + w] = id; stack[top++] = p + w; }
    }
    size.push(n);
  }
  return { lab, size };
}

// The plan of 1920 outlines every house with a dark line, and a line is not grey: closed up, so a house is whole
// (and a row of houses is one strip, as on the other plans).
{
  const drawn = new Uint8Array(N); for (let p = 0; p < N; p++) drawn[p] = built(3, p) ? 1 : 0;
  const whole = close(drawn, 1.6 * kx);
  for (let p = 0; p < N; p++) if (whole[p] && cls[3][p] === 0) cls[3][p] = 1;
}

// A town plan draws its streets wider than they are (there has to be room for their names), so its blocks are a few
// metres short on every side and a house on the street reads half "open". For telling whether a building stood, the
// colour plans are therefore read generously: built within REACH metres counts as built, and black on the damage
// map within a little less counts as black. (Not the hatched plans of 1838 and 1875: their gardens would spread.)
const REACH = 5, read = cls.map((c) => c);
for (const k of [2, 3, 4]) {
  const on = new Uint8Array(N); for (let p = 0; p < N; p++) on[p] = built(k, p) ? 1 : 0;
  const d = distance(on), c = Uint8Array.from(cls[k]);
  for (let p = 0; p < N; p++) if (c[p] === 0 && d[p] <= REACH * kx) c[p] = 1;
  read[k] = c;
}
{
  const on = new Uint8Array(N); for (let p = 0; p < N; p++) on[p] = cls[5][p] === 2 ? 1 : 0;
  const d = distance(on), c = Uint8Array.from(cls[5]);
  for (let p = 0; p < N; p++) if (c[p] < 2 && d[p] <= (REACH - 1) * kx) c[p] = 2;
  read[5] = c;
}

// ----------------------------------------------------------------------------------- today's buildings, on the grid
// owner[pixel]: which building of today covers it (−1 none, −2 a hand-made place: those always stand)
const owner = new Int32Array(N).fill(-1);
/** fills the pixels inside a footprint (its rings, even-odd) with a value */
function paint(rings, value) {
  const px = rings.map((r) => r.map(([x, z]) => [(x - x0) * kx, (z - z0) * kz]));
  let az = 1e9, bz = -1e9;
  for (const [, y] of px[0]) { az = Math.min(az, y); bz = Math.max(bz, y); }
  for (let y = Math.max(0, Math.floor(az)); y <= Math.min(h - 1, Math.ceil(bz)); y++) {
    const xs = [], yc = y + 0.5;
    for (const r of px) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if ((yi > yc) !== (yj > yc)) xs.push(((xj - xi) * (yc - yi)) / (yj - yi) + xi);
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.max(0, Math.round(xs[i])); x < Math.min(w, Math.round(xs[i + 1])); x++) owner[y * w + x] = value;
  }
}
keys.forEach((k, gi) => { for (const rings of groups.get(k).rings) paint(rings, gi); });
// (a place that says since when it stands — PLACE.since — and was not there in 1920 leaves its ground free: what the
// plan of 1920 draws there is a lost building like any other)
const since = new Map(PLACES.map((p) => [p.PLACE.key, p.PLACE.since ?? -Infinity]));
for (const b of city.buildings) if ((b.place && since.get(b.place) <= 1920) || (!b.place && claimed.has(b.group ?? b.id))) paint(b.rings, -2);

// what each plan shows under each building: how much of its footprint is built on, destroyed, beyond the sheet
const seen = new Float64Array(keys.length * 7 * 5), area = new Float64Array(keys.length);
for (let p = 0; p < N; p++) { const gi = owner[p]; if (gi < 0) continue; area[gi]++; for (let k = 0; k < 7; k++) seen[(gi * 7 + k) * 5 + read[k][p]]++; }
const frac = (gi, k) => { const a = area[gi] || 1, o = (gi * 7 + k) * 5; return { built: (seen[o + 1] + seen[o + 4]) / a, gone: seen[o + 2] / a, unknown: seen[o + 3] / a }; };

// --------------------------------------------------------------------------------------- the rules, for the buildings
const standing = {}, counts = STOPS.map(() => 0), ruins = STOPS.map(() => 0), first = [], state = [];
keys.forEach((k, gi) => {
  const f = STOPS.slice(0, 7).map((_, i) => frac(gi, i)), s = STOPS.map(() => true);
  let from = -1;
  for (let i = 1; i < 5; i++) if (f[i].built >= 0.5) { from = i; break; }
  for (let i = 1; i < 5; i++) s[i] = from >= 0 && i >= from;
  s[0] = from === 1 && f[0].built >= 0.5;
  const year = [...groups.get(k).ids].map((id) => dated.get(id)).find((y) => y);
  // (the plan of 1920 draws house by house: what it leaves open was not there in 1920, nor before)
  if (f[3].unknown < 0.5 && f[3].built < 0.5) for (let i = 0; i < 5; i++) s[i] = i === 4 && f[4].built >= 0.5;
  if (year) for (let i = 0; i < STOPS.length; i++) { if (YEAR[i] < year) s[i] = false; else if (i < 5 && f[i].unknown < 0.5) s[i] = true; }
  const ruined = s[4] && f[5].gone >= 0.5;
  s[5] = s[4] && !ruined;
  s[6] = ((s[5] && f[6].gone < 0.5) || f[6].built >= 0.5) && !(year > 1955);
  s[7] = !(year > 1981);
  const text = s.map((v, i) => (v ? 1 : i === 5 && ruined ? 2 : 0)).join('');
  first.push(s.indexOf(true)); state.push(text);
  s.forEach((v, i) => { if (v) counts[i]++; }); if (ruined) ruins[5]++;
  if (text !== '11111111') standing[k] = text;
});
// (the plans reach beyond the city this viewer shows: out there nothing is known about today, so nothing is "lost")
let bx0 = Infinity, bz0 = Infinity, bx1 = -Infinity, bz1 = -Infinity;
for (const b of city.buildings) for (const [x, z] of b.rings[0]) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); bz0 = Math.min(bz0, z); bz1 = Math.max(bz1, z); }
const inCity = (p) => { const x = x0 + ((p % w) + 0.5) / kx, z = z0 + (Math.floor(p / w) + 0.5) / kz; return x > bx0 && x < bx1 && z > bz0 && z < bz1; };
/** is this pixel under a building of today that is there (standing or in ruins) at stop s? */
const covered = (p, s) => owner[p] === -2 || (owner[p] >= 0 && state[owner[p]][s] !== '0');

// ------------------------------------------------------------------------------------------- the lost buildings
// ground that the plan of 1920 draws as a building and where no building of
// today stood in 1920; of a solid block, only the strip along the street
const drawn = new Uint8Array(N), brown = new Uint8Array(N);
for (let p = 0; p < N; p++) { drawn[p] = built(3, p) ? 1 : 0; brown[p] = cls[3][p] === 4 ? 1 : 0; }
const solid = drawn, toOpen = distance(not(solid));
const whole = open(brown, 2.2 * kx); // (the public buildings, drawn each with its own shape, are taken whole)
const keep = new Uint8Array(N);
for (let p = 0; p < N; p++) keep[p] = solid[p] && cls[3][p] !== 3 && !covered(p, 3) && inCity(p) && (whole[p] || toOpen[p] <= DEPTH * kx) ? 1 : 0;
const kept = open(keep, NARROW * kx);
const land = new Int32Array(N); for (let p = 0; p < N; p++) land[p] = kept[p] ? 0 : -1;
const plots = pieces(land);

// cut every plot into pieces the size of a house, along the long side of the rectangle around it
const hull = (pts) => {
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (const q of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = pts.length - 1; i >= 0; i--) { const q = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};
const ends = plots.size.map(() => []); // (the first and last pixel of each plot on each row: enough for its hull)
for (let y = 0; y < h; y++) {
  const lo = new Map(), hi = new Map();
  for (let x = 0; x < w; x++) { const id = plots.lab[y * w + x]; if (id < 0) continue; if (!lo.has(id)) lo.set(id, x); hi.set(id, x); }
  for (const [id, x] of lo) ends[id].push([x, y], [hi.get(id) + 1, y + 1]);
}
const axes = plots.size.map((n, id) => {
  if (n * M2 < 60) return null; // (too small to be a house)
  const hl = hull(ends[id]); let best = null;
  for (let i = 0; i < hl.length; i++) {
    const a = hl[i], b = hl[(i + 1) % hl.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1e-6) continue;
    const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], v = [-u[1], u[0]];
    let s0 = Infinity, s1 = -Infinity, t0 = Infinity, t1 = -Infinity;
    for (const q of hl) { const s = q[0] * u[0] + q[1] * u[1], t = q[0] * v[0] + q[1] * v[1]; s0 = Math.min(s0, s); s1 = Math.max(s1, s); t0 = Math.min(t0, t); t1 = Math.max(t1, t); }
    if (!best || (s1 - s0) * (t1 - t0) < best.A) best = { A: (s1 - s0) * (t1 - t0), u, v, s0, t0, long: s1 - s0 >= t1 - t0 };
  }
  if (!best) return null;
  const rnd = ((id * 2654435761) >>> 0) / 4294967296, house = (HOUSE[0] + (HOUSE[1] - HOUSE[0]) * rnd) * kx, deep = (DEPTH + 2) * kx;
  return { ...best, ds: best.long ? house : deep, dt: best.long ? deep : house };
});
let cells = new Int32Array(N).fill(-1);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const p = y * w + x, id = plots.lab[p], a = id < 0 ? null : axes[id]; if (!a) continue;
  const i = Math.floor(((x + 0.5) * a.u[0] + (y + 0.5) * a.u[1] - a.s0) / a.ds), j = Math.floor(((x + 0.5) * a.v[0] + (y + 0.5) * a.v[1] - a.t0) / a.dt);
  cells[p] = id * 4096 + (i & 63) * 64 + (j & 63);
}
// a scrap left over by the cutting goes to the neighbour it shares the longest side with (twice over)
for (let round = 0; round < 2; round++) {
  const { lab, size } = pieces(cells), side = new Map(), plotOf = new Int32Array(size.length);
  for (let p = 0; p < N; p++) {
    const a = lab[p]; if (a < 0) continue; plotOf[a] = plots.lab[p];
    for (const q of [p + 1, p + w]) { if (q >= N || (q === p + 1 && q % w === 0)) continue; const b = lab[q]; if (b < 0 || b === a || plots.lab[q] !== plots.lab[p]) continue; const key = Math.min(a, b) * 1e7 + Math.max(a, b); side.set(key, (side.get(key) ?? 0) + 1); }
  }
  const to = size.map((_, i) => i), best = size.map(() => 0);
  for (const [key, n] of side) {
    const a = Math.floor(key / 1e7), b = key % 1e7;
    for (const [small, other] of [[a, b], [b, a]]) if (size[small] * M2 < 45 && size[other] > size[small] && n > best[small]) { best[small] = n; to[small] = other; }
  }
  const root = (i) => { let n = 0; while (to[i] !== i && n++ < 8) i = to[i]; return i; };
  const next = new Int32Array(N).fill(-1);
  for (let p = 0; p < N; p++) if (lab[p] >= 0) next[p] = root(lab[p]);
  cells = next;
}
const houses = pieces(cells);

// what each plan shows under each piece, and whether a building of today covers it at each stop
const hs = new Float64Array(houses.size.length * 7 * 5), hc = new Float64Array(houses.size.length * 8), start = new Int32Array(houses.size.length).fill(-1);
for (let p = 0; p < N; p++) {
  const id = houses.lab[p]; if (id < 0) continue;
  if (start[id] < 0) start[id] = p;
  for (let k = 0; k < 7; k++) hs[(id * 7 + k) * 5 + read[k][p]]++;
  for (let s = 0; s < 8; s++) if (covered(p, s)) hc[id * 8 + s]++;
}
/** the outline of a piece, walked along the edges of its pixels with the piece on the right; then straightened */
function outline(id) {
  const inside = (x, y) => x >= 0 && y >= 0 && x < w && y < h && houses.lab[y * w + x] === id;
  const sx = start[id] % w, sy = Math.floor(start[id] / w), DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
  let x = sx, y = sy, d = 0, guard = 0; const pts = [[x, y]];
  do {
    x += DX[d]; y += DY[d];
    const right = d === 0 ? inside(x, y) : d === 1 ? inside(x - 1, y) : d === 2 ? inside(x - 1, y - 1) : inside(x, y - 1);
    const left = d === 0 ? inside(x, y - 1) : d === 1 ? inside(x, y) : d === 2 ? inside(x - 1, y) : inside(x - 1, y - 1);
    const nd = !right ? (d + 1) % 4 : left ? (d + 3) % 4 : d;
    if (nd !== d) pts.push([x, y]);
    d = nd;
  } while (!(x === sx && y === sy && d === 0) && guard++ < 1e6);
  pts.pop();
  // Douglas–Peucker on the closed line: cut it at its two farthest corners, straighten each half
  const far = (a) => { let best = 0, at = 0; pts.forEach((q, i) => { const dd = (q[0] - a[0]) ** 2 + (q[1] - a[1]) ** 2; if (dd > best) { best = dd; at = i; } }); return at; };
  const i0 = far(pts[0]), i1 = far(pts[i0]), TOL = 1.7;
  const simplify = (line) => {
    const keepIt = new Uint8Array(line.length); keepIt[0] = keepIt[line.length - 1] = 1;
    const todo = [[0, line.length - 1]];
    while (todo.length) {
      const [a, b] = todo.pop(), [ax, ay] = line[a], [bx, by] = line[b], l = Math.hypot(bx - ax, by - ay) || 1; let worst = 0, at = -1;
      for (let i = a + 1; i < b; i++) { const dist = Math.abs((bx - ax) * (line[i][1] - ay) - (by - ay) * (line[i][0] - ax)) / l; if (dist > worst) { worst = dist; at = i; } }
      if (worst > TOL) { keepIt[at] = 1; todo.push([a, at], [at, b]); }
    }
    return line.filter((_, i) => keepIt[i]);
  };
  const [a, b] = i0 < i1 ? [i0, i1] : [i1, i0];
  const ring = [...simplify(pts.slice(a, b + 1)).slice(0, -1), ...simplify([...pts.slice(b), ...pts.slice(0, a + 1)]).slice(0, -1)];
  return ring.map(([px, py]) => [Math.round((x0 + px / kx) * 10) / 10, Math.round((z0 + py / kz) * 10) / 10]);
}
const ringArea = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return Math.abs(a / 2); };
/** a piece that nearly fills the rectangle around it becomes that rectangle (at the piece's area): a house has corners */
function squared(ring) {
  const hl = hull(ring.map((q) => [...q])); let best = null;
  for (let i = 0; i < hl.length; i++) {
    const a = hl[i], b = hl[(i + 1) % hl.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1e-6) continue;
    const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], v = [-u[1], u[0]];
    let s0 = Infinity, s1 = -Infinity, t0 = Infinity, t1 = -Infinity;
    for (const q of hl) { const s = q[0] * u[0] + q[1] * u[1], t = q[0] * v[0] + q[1] * v[1]; s0 = Math.min(s0, s); s1 = Math.max(s1, s); t0 = Math.min(t0, t); t1 = Math.max(t1, t); }
    if (!best || (s1 - s0) * (t1 - t0) < best.A) best = { A: (s1 - s0) * (t1 - t0), u, v, s0, s1, t0, t1 };
  }
  const fill = best ? ringArea(ring) / best.A : 0;
  if (fill < 0.7) return ring;
  const k = Math.sqrt(fill), { u, v } = best, sc = (best.s0 + best.s1) / 2, tc = (best.t0 + best.t1) / 2, hs2 = ((best.s1 - best.s0) / 2) * k, ht = ((best.t1 - best.t0) / 2) * k;
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const ss = sc + a * hs2, tt = tc + b * ht; return [Math.round((u[0] * ss + v[0] * tt) * 10) / 10, Math.round((u[1] * ss + v[1] * tt) * 10) / 10]; });
}
const lost = [], lostCounts = STOPS.map(() => 0);
houses.size.forEach((n, id) => {
  if (n * M2 < 40) return;
  const f = (k, c) => hs[(id * 7 + k) * 5 + c] / n, isBuilt = (k) => f(k, 1) + f(k, 4) >= 0.5, free = (s) => hc[id * 8 + s] / n < 0.5;
  const s = STOPS.map(() => 0);
  for (let i = 1; i < 5; i++) s[i] = isBuilt(i) && free(i) ? 1 : 0;
  s[0] = s[1] && isBuilt(0) && free(0) ? 1 : 0;
  s[5] = s[4] && free(5) ? (f(5, 2) >= 0.5 ? 2 : 1) : 0;
  s[6] = s[5] === 1 && isBuilt(6) && f(6, 2) < 0.5 && free(6) ? 1 : 0;
  // (the banks of the river, the paths of the Schlossberg and the beds of the parks are drawn with dots and strokes
  // that read as grey too: a lost building has to be on ground that the plan of 1903 or that of 1944 tints as built)
  if (!s[2] && !s[4]) return;
  let ring = outline(id);
  if (ring.length < 3 || ringArea(ring) < 35) return;
  ring = squared(ring);
  s.forEach((v, i) => { if (v === 1) lostCounts[i]++; else if (v === 2) ruins[i]++; });
  lost.push({ ring, when: s.join('') });
});

writeFileSync('public/data/ages.json', `${JSON.stringify({ stops: STOPS, buildings: keys.length, counts, ruins, lostCounts, standing, lost })}\n`);
console.log(`${keys.length} buildings (${dated.size} OSM elements with a year), ${lost.length} lost ones; at each stop: standing, lost but drawn, in ruins`);
STOPS.forEach((k, i) => console.log(`  ${k.padEnd(7)} ${String(counts[i]).padStart(5)} ${String(lostCounts[i]).padStart(5)} ${String(ruins[i]).padStart(5)}`));

if (debug) {
  mkdirSync('shots', { recursive: true });
  for (let k = 0; k < 7; k++) {
    const out = Buffer.alloc(N * 3), data = tone[k];
    for (let i = 0; i < N; i++) { const c = cls[k][i], t = c === 1 ? [255, 40, 40] : c === 4 ? [120, 0, 0] : c === 2 ? [40, 60, 255] : c === 3 ? [255, 255, 255] : null; for (let j = 0; j < 3; j++) out[i * 3 + j] = t ? (data[i * 3 + j] + t[j]) / 2 : data[i * 3 + j]; }
    await sharp(out, { raw: { width: w, height: h, channels: 3 } }).extract({ left: 1100, top: 700, width: 2000, height: 1900 }).resize(1500).jpeg({ quality: 80 }).toFile(`shots/ages-${STOPS[k]}.jpg`);
  }
  const S = 0.7, wpx = Math.round(W * S), hpx = Math.round(H * S), tint = ['#3b2f2f', '#8a5a3c', '#c98b4a', '#e3c36a', '#9ab86a', '#888', '#5aa0c8', '#b070c0'];
  const d = (rings) => rings.map((r) => 'M' + r.map(([x, z]) => `${((x - x0) * S).toFixed(1)},${((z - z0) * S).toFixed(1)}`).join('L') + 'Z').join('');
  const paths = keys.map((k, gi) => `<path d="${groups.get(k).rings.map(d).join('')}" fill="${first[gi] < 0 ? '#f0f' : tint[first[gi]]}" stroke="${state[gi][5] === '2' ? '#000' : 'none'}" stroke-width="0.8"/>`).join('');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${wpx}" height="${hpx}"><rect width="100%" height="100%" fill="#f4eee0"/>${paths}</svg>`)).png().toFile('shots/ages.png');
  // the lost buildings over the plan of 1920 as it was read (built: red): today's buildings outlined in blue, the lost
  // ones in yellow (in ruins in November 1944: black edge)
  const K = w / W, e = (rings) => rings.map((r) => 'M' + r.map(([x, z]) => `${((x - x0) * K).toFixed(1)},${((z - z0) * K).toFixed(1)}`).join('L') + 'Z').join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${keys.map((k) => `<path d="${groups.get(k).rings.map(e).join('')}" fill="#4060c0" fill-opacity="0.18" stroke="#2040a0" stroke-width="1.5"/>`).join('')}${lost.map((l) => `<path d="${e([l.ring])}" fill="#f0d000" fill-opacity="0.6" stroke="${l.when[5] === '2' ? '#000' : '#fff'}" stroke-width="1.5"/>`).join('')}</svg>`;
  const base = Buffer.alloc(N * 3);
  for (let i = 0; i < N; i++) { const c = cls[3][i], t = c === 1 ? [255, 40, 40] : c === 4 ? [120, 0, 0] : null; for (let j = 0; j < 3; j++) base[i * 3 + j] = t ? (tone[3][i * 3 + j] * 2 + t[j]) / 3 : tone[3][i * 3 + j]; }
  await sharp(base, { raw: { width: w, height: h, channels: 3 } }).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 82 }).toFile('shots/lost.jpg');
}
