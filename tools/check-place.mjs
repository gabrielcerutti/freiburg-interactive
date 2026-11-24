// Checks a hand-made place against what it says about itself (its PLACE, in src/places/<key>.js):
//   npm run check -- muenster
// - it builds without errors, in Node, from public/data/city.json;
// - its size is within budget (25,000 vertices for a building, 90,000 for a group: src/kit.js);
// - its coordinates (from a source other than OSM) fall within 90 m of the OSM footprint it draws on;
// - if it lists `checks`: the built height, the longest span of the footprint and the size of one OSM part agree
//   with the sourced figures (within 1 m, 1 % and 10 %).
import { readFileSync } from 'node:fs';
import { toWorld } from '../src/geo.js';
import { startPlace, BUDGET } from '../src/kit.js';
import { orientedBox } from '../src/buildings.js';
import { PLACES } from '../src/places/index.js';

const key = process.argv[2];
const place = PLACES.find((p) => p.PLACE.key === key);
if (!place) { console.error(`no place "${key}". Known: ${PLACES.map((p) => p.PLACE.key).join(', ')}`); process.exit(1); }
const { PLACE } = place;
const city = JSON.parse(readFileSync('public/data/city.json', 'utf8'));
const parts = city.buildings.filter((b) => b.place === key);

const results = [];
const check = (name, ok, detail) => results.push({ name, ok, detail });

let kit;
try { kit = startPlace(); place.build(kit, parts, city); check('builds', true, `${parts.length} OSM parts`); }
catch (e) { check('builds', false, e.message); }

if (kit) {
  const n = kit.mesher.vertices, max = BUDGET[PLACE.kind] ?? BUDGET.building;
  check('budget', n <= max, `${n.toLocaleString('en')} of ${max.toLocaleString('en')} vertices`);

  const pts = parts.flatMap((b) => b.rings[0]);
  if (PLACE.coordinates && pts.length) {
    const [x, z] = toWorld(...PLACE.coordinates);
    const nearest = Math.min(...pts.map((p) => Math.hypot(p[0] - x, p[1] - z)));
    const inside = parts.some((b) => insidePoly(b.rings[0], x, z));
    check('location', inside || nearest <= 90, inside ? 'the coordinates fall inside the footprint' : `${nearest.toFixed(1)} m from the footprint`);
  }
  if (PLACE.checks?.height) {
    const pos = kit.mesher.pos; let top = 0; for (let i = 1; i < pos.length; i += 3) top = Math.max(top, pos[i]);
    check('height', Math.abs(top - PLACE.checks.height) <= 1, `built ${top.toFixed(1)} m, source ${PLACE.checks.height} m`);
  }
  if (PLACE.checks?.footprint) {
    const { part, size } = PLACE.checks.footprint, b = parts.find((p) => p.id === part);
    if (!b) check('footprint', false, `part ${part} not found`);
    else {
      const box = orientedBox(b.rings[0]), got = [2 * box.hw, 2 * box.hl], want = size.slice().sort((x, y) => x - y);
      const ok = got.every((g, i) => Math.abs(g - want[i]) / want[i] <= 0.1);
      check('footprint', ok, `OSM part ${got.map((g) => g.toFixed(1)).join(' × ')} m, source ${want.join(' × ')} m`);
    }
  }
  if (PLACE.checks?.length && pts.length) {
    let L = 0; for (const a of pts) for (const b of pts) L = Math.max(L, Math.hypot(a[0] - b[0], a[1] - b[1]));
    check('length', Math.abs(L - PLACE.checks.length) / PLACE.checks.length <= 0.01, `footprint ${L.toFixed(2)} m, source ${PLACE.checks.length} m`);
  }
}
for (const f of ['sources', 'assumptions']) check(f, Array.isArray(PLACE[f]) && PLACE[f].length > 0, `${PLACE[f]?.length ?? 0} listed`);

console.log(`\n${PLACE.name} (${key})\n`);
for (const r of results) console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.name.padEnd(12)} ${r.detail}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);

function insidePoly(ring, x, z) { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; }
