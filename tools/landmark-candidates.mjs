// Writes LANDMARKS.md: the places that could become hand-made landmarks, neighbourhood by neighbourhood, to be done
// little by little.   node tools/landmark-candidates.mjs [--refresh]
// The list is OpenStreetMap's, not ours: every building or historic feature of Freiburg that has a name and a
// Wikidata item (so there is something written about it to start from), sorted into the city's districts by where
// it lies. Nothing in it is checked: a candidate is a place to research, with the rules of CONTRIBUTING.md.
// Two requests to the Overpass API, one at a time, 2.6 s apart (kept in sources/osm/candidates-*.json; --refresh
// asks again). What is written by hand in LANDMARKS.md between the two «by hand» marks is kept.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { BOUNDS } from '../src/geo.js';
import { PLACE_OSM } from '../src/places/osm-ids.js';

const ENDPOINT = 'https://overpass-api.de/api/interpreter', USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';
const CITY = '47.90,7.66,48.08,7.94'; // (south, west, north, east: Freiburg and its villages)
const QUERIES = {
  places: `[out:json][timeout:120][bbox:${CITY}];(way["building"]["name"]["wikidata"];relation["building"]["name"]["wikidata"];nwr["historic"]["name"]["wikidata"];nwr["tourism"="attraction"]["name"]["wikidata"];nwr["man_made"~"^(tower|water_tower|reservoir_covered|bridge)$"]["name"]["wikidata"];);out center tags;`,
  districts: `[out:json][timeout:120][bbox:${CITY}];area["wikidata"="Q2833"]->.town;relation["boundary"="administrative"]["admin_level"~"^(9|10)$"](area.town);out geom;`,
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync('sources/osm', { recursive: true });
const data = {};
let first = true;
for (const [name, query] of Object.entries(QUERIES)) {
  const file = `sources/osm/candidates-${name}.json`;
  if (!existsSync(file) || process.argv.includes('--refresh')) {
    if (!first) await wait(2600);
    first = false;
    let text;
    for (let attempt = 1; ; attempt++) {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(query) });
      if (res.ok) { text = await res.text(); break; }
      if (attempt === 5) { console.error(`${name}: HTTP ${res.status}, giving up`); process.exit(1); }
      await wait(attempt * 15_000);
    }
    JSON.parse(text); writeFileSync(file, text);
  }
  data[name] = JSON.parse(readFileSync(file, 'utf8')).elements;
  console.log(`${name}: ${data[name].length} elements`);
}

// the districts: each one's outer rings (lon, lat), the smallest first, so that a quarter wins over the district it is in
const ringsOf = (rel) => {
  const ways = (rel.members ?? []).filter((m) => m.type === 'way' && m.geometry && m.role !== 'inner').map((m) => m.geometry.map((p) => [p.lon, p.lat]));
  const rings = [];
  while (ways.length) { // (stitch the ways end to end)
    const ring = ways.shift();
    for (let grown = true; grown && (ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1]);) {
      grown = false;
      for (let i = 0; i < ways.length; i++) {
        const w = ways[i], end = ring.at(-1), same = (a, b) => a[0] === b[0] && a[1] === b[1];
        if (same(w[0], end)) ring.push(...w.slice(1)); else if (same(w.at(-1), end)) ring.push(...w.slice(0, -1).reverse()); else continue;
        ways.splice(i, 1); grown = true; break;
      }
    }
    rings.push(ring);
  }
  return rings;
};
const area = (r) => Math.abs(r.reduce((s, p, i) => s + p[0] * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * p[1], 0) / 2);
const inside = (r, x, y) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) if (r[i][1] > y !== r[j][1] > y && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c; return c; };
const districts = data.districts.filter((d) => d.tags?.name).map((d) => { const rings = ringsOf(d); return { name: d.tags.name, level: Number(d.tags.admin_level), rings, size: rings.reduce((s, r) => s + area(r), 0) }; });
const at = (lon, lat, level) => districts.filter((d) => d.level === level && d.rings.some((r) => inside(r, lon, lat))).sort((a, b) => a.size - b.size)[0]?.name;

const done = new Map(Object.entries(PLACE_OSM).flatMap(([key, ids]) => ids.map((id) => [id, key])));
const TOWERS = new Set(['tower', 'water_tower', 'reservoir_covered', 'bridge']);
const KIND = (t) => (t.historic && t.historic !== 'yes' ? t.historic : null) ?? (t.amenity === 'place_of_worship' ? 'church' : null) ?? (t.building && t.building !== 'yes' ? t.building : null) ?? (TOWERS.has(t.man_made) ? t.man_made : null) ?? t.tourism ?? t.amenity ?? 'building';
const groups = new Map(), seen = new Set();
for (const e of data.places) {
  const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon, t = e.tags ?? {};
  // (memorial stones and plaques — the Stolpersteine above all, each the name of a person — are not places to model)
  if (t.historic === 'memorial' || t.memorial) continue;
  if (lat == null || seen.has(t.wikidata)) continue; // (one line per Wikidata item: a place mapped twice is one place)
  seen.add(t.wikidata);
  const district = at(lon, lat, 9), quarter = at(lon, lat, 10);
  if (!district && !quarter) continue; // (outside the town)
  const id = e.type[0] + e.id, title = district && quarter && quarter !== district ? `${district} — ${quarter}` : district ?? quarter;
  const mapped = lat > BOUNDS.south && lat < BOUNDS.north && lon > BOUNDS.west && lon < BOUNDS.east;
  if (!groups.has(title)) groups.set(title, []);
  groups.get(title).push({ name: t.name, kind: KIND(t), id, type: e.type, wikidata: t.wikidata, year: t.start_date ?? '', mapped, key: done.get(id) });
}

const HAND = ['<!-- by hand: from here -->', '<!-- by hand: to here -->'];
let kept = `${HAND[0]}\n## Asked for, or noticed along the way\n\nPlaces someone asked for, or that turned up while working, that the list below does not have (no Wikidata item, not\na building, not in OpenStreetMap). One line each: what, where, who asked.\n\n- (none yet)\n${HAND[1]}`;
if (existsSync('LANDMARKS.md')) { const old = readFileSync('LANDMARKS.md', 'utf8'), a = old.indexOf(HAND[0]), b = old.indexOf(HAND[1]); if (a >= 0 && b > a) kept = old.slice(a, b + HAND[1].length); }
const order = [...groups.keys()].sort((a, b) => (groups.get(b).some((p) => p.mapped) - groups.get(a).some((p) => p.mapped)) || a.localeCompare(b, 'de'));
let total = 0, made = 0;
const body = order.map((title) => {
  const list = groups.get(title).sort((a, b) => b.mapped - a.mapped || a.name.localeCompare(b.name, 'de'));
  total += list.length; made += list.filter((p) => p.key).length;
  const some = list.some((p) => p.mapped), all = list.every((p) => p.mapped);
  return `### ${title}\n\n${all ? 'On the map.' : some ? 'Partly on the map.' : 'Not on the map yet.'}\n\n| | Place | What | Year in OSM | OpenStreetMap | Wikidata |\n|---|---|---|---|---|---|\n`
    + list.map((p) => `| ${p.key ? '✅' : p.mapped ? '⬜' : '·'} | ${p.name.replace(/\|/g, '/')}${p.key ? ` (\`${p.key}\`)` : ''} | ${p.kind} | ${p.year} | [${p.id}](https://www.openstreetmap.org/${p.type}/${p.id.slice(1)}) | [${p.wikidata}](https://www.wikidata.org/wiki/${p.wikidata}) |`).join('\n');
}).join('\n\n');
writeFileSync('LANDMARKS.md', `# Landmarks to make, neighbourhood by neighbourhood

The map grows first; landmarks follow little by little. This is the list to pick from: ${total} places in ${order.length}
districts, ${made} of them made.

✅ made (with its key in \`src/places/\`) · ⬜ on the map, not made · «·» not on the map yet

**What this list is, and is not.** It is written by \`node tools/landmark-candidates.mjs\` from OpenStreetMap: every
building or historic feature of Freiburg with a name and a Wikidata item (memorial stones and plaques left out), sorted into the city's districts by where
it lies. A Wikidata item means something is written about the place — a start for the research, no more. Nothing
here is checked: the names, kinds and years are OpenStreetMap's as tagged, and a year in particular is to be
verified, not copied. To make one, follow \`.claude/skills/add-landmark/SKILL.md\` and the rules of
\`CONTRIBUTING.md\` (nothing invented; the right building at every year). Places made by hand that OpenStreetMap
maps without a Wikidata item, or not as a building, do not show here even when they are made (the
Schlossbergturm, the Kastaniengarten, the brewery, the stations that are gone).

Run the tool again after making a landmark or moving the map's edge: the marks follow. What is written between
the two «by hand» marks below is kept.

${kept}

## By district

${body}
`);
console.log(`LANDMARKS.md: ${total} places in ${order.length} districts, ${made} made`);
