// The old town plans under the city, one for each stop of the timeline: pieces of the city's own series of scanned
// and georeferenced historical town plans ("Historische Stadtpläne", FreiGIS; 20 plans from 1838 to 2020, of which
// the PLANS below are taken).
//   node tools/plan.mjs   -> sources/plan/<key>.jpg, <key>-cover.png  (downloaded once: the piece of the plan over
//                                                                      our area, and a small picture of where the
//                                                                      sheet reaches)
//                            public/plan/<key>.webp   (the piece as scanned; see-through where the sheet ends)
//                            public/plan/plans.json   (the list: each plan's rectangle in world metres, its tones
//                                                      of ink and paper, what it is, and its credit)
// What is said of each plan comes from its metadata record in the city's catalogue (`record`, at
// https://geodaten.freiburg.de/geonetwork): the year, the kind of map, the scale. Licence of all of them:
// Datenlizenz Deutschland – Namensnennung – Version 2.0, credited as "Datengrundlage: Stadt Freiburg, www.freiburg.de".
// The piece asked for is the terrain's rectangle (the city's area and its margin, public/data/terrain.json), in
// plain latitude and longitude — the same flat projection as src/geo.js, so the picture lies on the ground as it is.
// Two requests per plan to the city's map service (WMS), one at a time, 2.6 s apart.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { toLatLon } from '../src/geo.js';

const PLANS = [
  { key: '1838', label: '1838', record: '0bd1576d-da47-4cbf-8031-e580a921379c', note: 'Black-and-white plan, 1:10,000. The sheet does not reach every corner of the area.' },
  { key: '1875', label: '1875', record: 'd5acf557-9f28-436e-8da3-6e25a5d9910f', note: 'Black-and-white plan, 1:6,000, lithographed by C. Bolia. The city had about 32,000 inhabitants.' },
  { key: '1903', label: '1903', record: '23248e1d-2790-4e96-8444-a46113b0c9a5', note: 'Colour plan, 1:6,500.' },
  { key: '1920', label: '1920', record: 'd1b49ad0-5d3d-478b-b946-a9e228ef2d53', note: 'Colour plan, 1:6,000.' },
  { key: '1944', label: '1944', record: '16f7271f-beae-4120-9d8c-5fdcecd4d092', note: 'Colour plan, 1:10,000, with the street names of those years.' },
  { key: 'bomben', label: 'Nov 1944', record: 'cc209de5-1151-4632-a72d-e5dee8f7596d', note: 'Damage map after the air raid of 27 November 1944, 1:10,000: black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable.' },
  { key: '1955', label: '1955', record: 'da91cc61-79b1-4f39-8ce1-8dfd35a616b2', note: 'Official colour plan, 1:10,000.' },
  { key: '1981', label: '1981', record: '84731cbd-226a-4e66-b2ab-3f72812e085a', note: 'Official city map, 1:16,000.' },
];
const WIDTH = 4096, COVER = 512;
const WMS = 'https://geoportal.freiburg.de/wms/verma_stadtplan_hist/verma_stadtplan_hist', USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';
const CATALOGUE = 'https://geodaten.freiburg.de/geonetwork/srv/ger/catalog.search#/metadata/';

const t = JSON.parse(readFileSync('public/data/terrain.json', 'utf8'));
const x0 = t.x0, z0 = t.z0, W = (t.width - 1) * t.step, H = (t.height - 1) * t.step;
const [north, west] = toLatLon(x0, z0), [south, east] = toLatLon(x0 + W, z0 + H);
const box = [south, west, north, east].map((v) => v.toFixed(7)).join(','); // (WMS 1.3.0 with EPSG:4326: south, west, north, east)

mkdirSync('sources/plan', { recursive: true }); mkdirSync('public/plan', { recursive: true });
let last = 0;
async function download(file, query, box) {
  if (existsSync(file)) return;
  const wait = last + 2600 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  const url = `${WMS}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&STYLES=&CRS=EPSG:4326&BBOX=${box}&${query}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  last = Date.now();
  if (!res.ok || !String(res.headers.get('content-type')).startsWith('image/')) { console.error(`${url}: HTTP ${res.status} ${res.headers.get('content-type')}`); process.exit(1); }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('downloaded', file);
}

// The piece is asked for in bands from north to south, none taller than 2048 pixels (a map service does not hand out
// pictures of any size), and put together here. The downloads carry the area in their name (its south and north edge),
// so that a piece of another area is never taken for this one; what the other tools read is the piece put together,
// sources/plan/<key>.jpg and <key>-cover.png.
const height = Math.round((WIDTH * H) / W), BANDS = Math.ceil(height / 2048), tag = `${south.toFixed(4)}-${north.toFixed(4)}`;
const rows = Array.from({ length: BANDS + 1 }, (_, i) => Math.round((height * i) / BANDS));
const list = [];
for (const p of PLANS) {
  const source = `sources/plan/${p.key}.jpg`, cover = `sources/plan/${p.key}-cover.png`, bands = [];
  for (let i = 0; i < BANDS; i++) {
    const n = north - ((north - south) * rows[i]) / height, s = north - ((north - south) * rows[i + 1]) / height, file = `sources/plan/${p.key}-${tag}-${i}.jpg`;
    await download(file, `LAYERS=stadtplan_${p.key}&WIDTH=${WIDTH}&HEIGHT=${rows[i + 1] - rows[i]}&FORMAT=image/jpeg`, [s, west, n, east].map((v) => v.toFixed(7)).join(','));
    bands.push({ input: file, left: 0, top: rows[i] });
  }
  await sharp({ create: { width: WIDTH, height, channels: 3, background: '#fff' } }).composite(bands).jpeg({ quality: 92 }).toFile(source);
  const coverOf = `sources/plan/${p.key}-${tag}-cover.png`;
  await download(coverOf, `LAYERS=stadtplan_${p.key}&WIDTH=${COVER}&HEIGHT=${Math.round((COVER * H) / W)}&FORMAT=image/png&TRANSPARENT=true`, box);
  writeFileSync(cover, readFileSync(coverOf));

  // where the sheet reaches: the small picture's transparency, enlarged (smoothly) to the size of the piece
  const alpha = await sharp(cover).ensureAlpha().extractChannel(3).resize(WIDTH, height, { fit: 'fill', kernel: 'cubic' }).raw().toBuffer();
  let covered = 0; for (let i = 0; i < alpha.length; i += 97) if (alpha[i] > 127) covered++;
  const share = covered / Math.ceil(alpha.length / 97);
  // the scan's tones of ink and of paper (for the ink look, which draws the plan with its own ink on its own paper):
  // the darkest hundredth and the lightest twentieth of what the sheet covers, as grey from 0 to 1
  const grey = await sharp(source).greyscale().raw().toBuffer();
  const hist = new Array(256).fill(0); let n = 0;
  for (let i = 0; i < grey.length; i++) if (alpha[i] > 127) { hist[grey[i]]++; n++; }
  const at = (q) => { let s = 0; for (let v = 0; v < 256; v++) { s += hist[v]; if (s >= q * n) return v; } return 255; };
  const ink = at(0.01), paper = at(0.95);
  if (paper - ink < 40) { console.error(`${p.key}: the scan has no contrast (ink ${ink}, paper ${paper}): is the picture empty?`); process.exit(1); }

  const out = `public/plan/${p.key}.webp`;
  await sharp(source).removeAlpha().joinChannel(alpha, { raw: { width: WIDTH, height, channels: 1 } }).webp({ quality: 74, alphaQuality: 60 }).toFile(out);
  list.push({
    key: p.key, label: p.label, src: `plan/${p.key}.webp`, area: [x0, z0, W, H], levels: [+(ink / 255).toFixed(3), +(paper / 255).toFixed(3)],
    covers: +share.toFixed(2), note: p.note, page: p.record ? CATALOGUE + p.record : null,
  });
  console.log(`${out}: covers ${(share * 100).toFixed(0)} % of the area; ink ${ink}, paper ${paper}`);
}
writeFileSync('public/plan/plans.json', `${JSON.stringify({
  credit: 'Datengrundlage: Stadt Freiburg, www.freiburg.de', licence: 'Datenlizenz Deutschland – Namensnennung – Version 2.0', licenceUrl: 'https://www.govdata.de/dl-de/by-2-0',
  metresPerPixel: +(W / WIDTH).toFixed(2), plans: list,
}, null, 1)}\n`);
