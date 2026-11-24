// The old town plan under the city in the ink look: the plan of Freiburg of 1875, from the city's own series of
// scanned and georeferenced historical town plans ("Historische Stadtpläne", FreiGIS).
//   node tools/plan.mjs   -> sources/plan/1875.jpg   (the piece of the plan over our area, downloaded once)
//                            public/plan/1875.webp   (the same in grey: 255 is bare paper, 0 is solid ink)
//                            public/plan/1875.json   (the rectangle it covers, in world metres, and its credit)
// What the city's metadata record says of it (https://geodaten.freiburg.de/geonetwork, record
// d5acf557-9f28-436e-8da3-6e25a5d9910f): a black-and-white plan without a legend, of the city in 1875 with about
// 32,000 inhabitants; on the sheet, "bearbeitet von C. Bolia, Lithograph, Kaiserstrasse N° 108. Preis: 1 Mark";
// scale 1:6,000; scanned and georeferenced by the city's survey office; contact for the original: Museen Freiburg
// (Augustinermuseum). Licence: Datenlizenz Deutschland – Namensnennung – Version 2.0, to be credited as
// "Datengrundlage: Stadt Freiburg, www.freiburg.de".
// The piece asked for is the terrain's rectangle (the city's area and its margin, public/data/terrain.json), in
// plain latitude and longitude — the same flat projection as src/geo.js, so the picture lies on the ground as it is.
// One request to the city's map service (WMS). The scan holds about half a metre per pixel; more would be blur.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { toLatLon } from '../src/geo.js';

const YEAR = 1875, WIDTH = 4096;
const WMS = 'https://geoportal.freiburg.de/wms/verma_stadtplan_hist/verma_stadtplan_hist', USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';

const t = JSON.parse(readFileSync('public/data/terrain.json', 'utf8'));
const x0 = t.x0, z0 = t.z0, W = (t.width - 1) * t.step, H = (t.height - 1) * t.step;
const [north, west] = toLatLon(x0, z0), [south, east] = toLatLon(x0 + W, z0 + H);
const height = Math.round((WIDTH * H) / W);

const source = `sources/plan/${YEAR}.jpg`;
if (!existsSync(source)) {
  mkdirSync('sources/plan', { recursive: true });
  // (WMS 1.3.0 with EPSG:4326: the box is south, west, north, east)
  const url = `${WMS}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=stadtplan_${YEAR}&STYLES=&CRS=EPSG:4326&BBOX=${south.toFixed(7)},${west.toFixed(7)},${north.toFixed(7)},${east.toFixed(7)}&WIDTH=${WIDTH}&HEIGHT=${height}&FORMAT=image/jpeg`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok || !String(res.headers.get('content-type')).startsWith('image/')) { console.error(`${url}: HTTP ${res.status} ${res.headers.get('content-type')}`); process.exit(1); }
  writeFileSync(source, Buffer.from(await res.arrayBuffer()));
  console.log('downloaded', source);
}

// to grey, and stretched so that the paper of the scan is white and its ink black (the viewer brings its own paper
// and ink): the paper is the tone most of the sheet has, the ink the darkest hundredth
const grey = await sharp(source).greyscale().raw().toBuffer({ resolveWithObject: true });
const hist = new Array(256).fill(0);
for (const v of grey.data) hist[v]++;
const at = (share) => { let n = 0; for (let v = 0; v < 256; v++) { n += hist[v]; if (n >= share * grey.data.length) return v; } return 255; };
const ink = at(0.01), paper = at(0.6);
if (paper - ink < 40) { console.error(`the scan has no contrast (ink ${ink}, paper ${paper}): is the picture empty?`); process.exit(1); }
const a = 255 / (paper - ink);
mkdirSync('public/plan', { recursive: true });
await sharp(grey.data, { raw: grey.info }).linear(a, -ink * a).webp({ quality: 82 }).toFile(`public/plan/${YEAR}.webp`);
writeFileSync(`public/plan/${YEAR}.json`, `${JSON.stringify({
  year: YEAR, src: `plan/${YEAR}.webp`, area: [x0, z0, W, H], width: grey.info.width, height: grey.info.height,
  title: 'Historischer Stadtplan von Freiburg i. Br. – Jahr 1875', author: 'C. Bolia, lithographer', scale: '1:6,000',
  credit: 'Datengrundlage: Stadt Freiburg, www.freiburg.de', licence: 'Datenlizenz Deutschland – Namensnennung – Version 2.0', licenceUrl: 'https://www.govdata.de/dl-de/by-2-0',
  page: 'https://geodaten.freiburg.de/geonetwork/srv/ger/catalog.search#/metadata/d5acf557-9f28-436e-8da3-6e25a5d9910f',
}, null, 1)}\n`);
console.log(`public/plan/${YEAR}.webp ${grey.info.width}×${grey.info.height} (scan: ink ${ink}, paper ${paper}); ${(W / grey.info.width).toFixed(2)} m per pixel`);
