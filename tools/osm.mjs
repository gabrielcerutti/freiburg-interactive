// Downloads today's city from OpenStreetMap (Overpass API) inside BOUNDS (src/geo.js):
// buildings, building parts, streets, railways/tram, water, green areas and trees.
//   node tools/osm.mjs            -> sources/osm/<layer>.json   (raw Overpass answers)
// A layer that is already on disk is not downloaded again (delete the file to refresh it).
// Data © OpenStreetMap contributors, ODbL (https://www.openstreetmap.org/copyright).
//
// Manners: one request at a time, at least 2.5 s apart, with a generic User-Agent and no personal data.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { BOUNDS } from '../src/geo.js';

const ENDPOINT = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';
const OUT = 'sources/osm';
const bbox = `${BOUNDS.south},${BOUNDS.west},${BOUNDS.north},${BOUNDS.east}`;

const LAYERS = {
  buildings: '(way["building"];relation["building"];);',
  parts: '(way["building:part"];relation["building:part"];);',
  streets: 'way["highway"];',
  rail: 'way["railway"~"^(rail|tram|light_rail)$"];',
  water: '(way["waterway"];way["natural"="water"];relation["natural"="water"];);',
  trees: '(node["natural"="tree"];way["natural"="tree_row"];);',
  green: '(way["leisure"~"^(park|garden|playground)$"];way["landuse"~"^(grass|forest|meadow|cemetery|vineyard)$"];way["natural"~"^(wood|scrub)$"];relation["leisure"="park"];relation["landuse"~"^(grass|forest)$"];);',
};

mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let first = true;
for (const [name, filter] of Object.entries(LAYERS)) {
  const file = `${OUT}/${name}.json`;
  if (existsSync(file)) { console.log(`${name}: already on disk`); continue; }
  if (!first) await wait(2600);
  first = false;
  const query = `[out:json][timeout:120][bbox:${bbox}];${filter}out geom;`;
  let text;
  // The public server is often busy (429/502/504): try a few times, waiting longer each time.
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query),
    });
    if (res.ok) { text = await res.text(); break; }
    if (attempt === 5) { console.error(`${name}: HTTP ${res.status}, giving up`); process.exit(1); }
    console.log(`${name}: HTTP ${res.status}, retrying in ${attempt * 15} s`);
    await wait(attempt * 15_000);
  }
  const n = JSON.parse(text).elements?.length ?? 0; // (fails loudly if the answer is not JSON)
  writeFileSync(file, text);
  console.log(`${name}: ${n} elements, ${(text.length / 1e6).toFixed(1)} MB`);
}
