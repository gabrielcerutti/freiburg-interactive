// From the raw OpenStreetMap download (sources/osm/, made by tools/osm.mjs) to the compact city the viewer loads:
//   node tools/city.mjs   -> public/data/city.json
// Everything is converted to local metres (src/geo.js) and rounded to centimetres.
//
// What goes in:
//   buildings  every building outline, or its building:parts when it has them (the "Simple 3D Buildings" rule:
//              if a building is split into parts, the parts are drawn and the outline is not). Heights and roofs
//              are copied as OSM gives them; whatever is missing is filled in later by src/buildings.js, which
//              marks it as an assumption.
//              Where OSM maps two solids with walls in the same plane, facing the same way and overlapping (a part
//              drawn inside a bigger part, mostly), the lower one gets an `inset` of a few centimetres: drawn a hair
//              smaller, it no longer fights the other for the same pixels (they flickered).
//   places     buildings that belong to a hand-made place (src/places/) are tagged with that place's key, so the
//              generic city leaves them out and the place decides what to do with them.
//   ground     streets, squares, railways/tram, water (including the Bächle) and green areas, for the ground map.
// Data © OpenStreetMap contributors, ODbL.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { toWorld } from '../src/geo.js';
import { PLACE_OSM } from '../src/places/osm-ids.js';
import { resolve } from '../src/buildings.js';

const read = (name) => JSON.parse(readFileSync(`sources/osm/${name}.json`, 'utf8')).elements;
const cm = (v) => Math.round(v * 100) / 100;
const toXZ = (geom) => geom.map((p) => toWorld(p.lat, p.lon).map(cm));

// ------------------------------------------------------------------------------------------------- geometry helpers
const area = (ring) => { let a = 0; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]); return a / 2; };
const closeOff = (ring) => { const a = ring[0], b = ring[ring.length - 1]; return a[0] === b[0] && a[1] === b[1] ? ring.slice(0, -1) : ring; };
const centroid = (ring) => { let x = 0, z = 0; for (const p of ring) { x += p[0]; z += p[1]; } return [x / ring.length, z / ring.length]; };
const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };

/** Joins the member ways of a multipolygon into closed rings (members can be split and reversed). */
function stitch(ways) {
  const open = ways.map((w) => w.slice()), rings = [];
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  while (open.length) {
    let ring = open.shift();
    for (let guard = 0; !same(ring[0], ring[ring.length - 1]) && guard < 1000; guard++) {
      const end = ring[ring.length - 1];
      const i = open.findIndex((w) => same(w[0], end) || same(w[w.length - 1], end));
      if (i < 0) break; // (a broken relation: keep what we have)
      const w = open.splice(i, 1)[0];
      ring = ring.concat((same(w[0], end) ? w : w.reverse()).slice(1));
    }
    if (ring.length >= 4) rings.push(closeOff(ring));
  }
  return rings;
}

/** An OSM element -> list of polygons, each [outer, ...holes]; outer counter-clockwise, holes clockwise (in x, z). */
function polygons(e) {
  let outers, inners = [];
  if (e.type === 'way') {
    if (!e.geometry || e.geometry.length < 4) return [];
    outers = [closeOff(toXZ(e.geometry))];
  } else {
    const members = (e.members ?? []).filter((m) => m.type === 'way' && m.geometry);
    outers = stitch(members.filter((m) => m.role !== 'inner').map((m) => toXZ(m.geometry)));
    inners = stitch(members.filter((m) => m.role === 'inner').map((m) => toXZ(m.geometry)));
  }
  const orient = (r, ccw) => ((area(r) > 0) === ccw ? r : r.slice().reverse());
  return outers.filter((o) => o.length >= 3).map((o) => {
    const holes = inners.filter((h) => inside(o, ...h[0]));
    return [orient(o, true), ...holes.map((h) => orient(h, false))];
  });
}

const num = (v) => { if (v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };

// ------------------------------------------------------------------------------------------------------- buildings
const outlines = read('buildings'), parts = read('parts');
const partPolys = parts.flatMap((e) => polygons(e).map((rings) => ({ e, rings, c: centroid(rings[0]) })));

// which hand-made place owns which OSM outline (src/places/osm-ids.js)
const placeOf = new Map();
for (const [key, ids] of Object.entries(PLACE_OSM)) for (const id of ids) placeOf.set(id, key);
const placeOutlines = [];

const buildings = [];
const add = (e, rings, place) => {
  const t = e.tags ?? {};
  buildings.push({
    id: `${e.type[0]}${e.id}`,
    rings,
    ...(place && { place }),
    ...(t.name && { name: t.name }),
    type: t.building ?? (t['building:part'] ? 'part' : 'yes'),
    height: num(t.height),
    minHeight: num(t.min_height),
    levels: num(t['building:levels']),
    minLevel: num(t['building:min_level']),
    roofShape: t['roof:shape'] ?? null,
    roofHeight: num(t['roof:height']),
    roofLevels: num(t['roof:levels']),
    roofOrientation: t['roof:orientation'] ?? null,
    colour: t['building:colour'] ?? null,
    roofColour: t['roof:colour'] ?? null,
  });
};

let skippedOutlines = 0;
const outlineRings = [];
for (const e of outlines) {
  for (const rings of polygons(e)) {
    const place = placeOf.get(`${e.type[0]}${e.id}`);
    outlineRings.push({ id: `${e.type[0]}${e.id}`, outer: rings[0], size: Math.abs(area(rings[0])), place, tags: e.tags ?? {} });
    if (place) placeOutlines.push({ place, outer: rings[0] });
    // does any part sit inside this outline? then the parts stand in for it
    const outer = rings[0];
    const hasParts = partPolys.some((p) => inside(outer, ...p.c));
    if (hasParts) { skippedOutlines++; continue; }
    add(e, rings, place);
  }
}
for (const p of partPolys) {
  // the outline the part belongs to: the one most of it lies in (outlines overlap here and there — the upper floors
  // of the cinema reach over the theatre's — so its middle alone can fall in the neighbour's), the smaller one if
  // two hold as much of it. All the parts of one building stand on the same ground (src/city.js), and a hand-made
  // place gets the parts of its outlines.
  const probes = [p.c, ...p.rings[0].map(([x, z]) => [x + (p.c[0] - x) * 0.15, z + (p.c[1] - z) * 0.15])];
  const outline = outlineRings.map((o) => ({ o, n: probes.filter((q) => inside(o.outer, ...q)).length })).filter((c) => c.n > probes.length / 3)
    // (a relation and its outer way are the same outline twice: the one a place names wins)
    .sort((a, b) => b.n - a.n || Math.round(a.o.size) - Math.round(b.o.size) || (b.o.place ? 1 : 0) - (a.o.place ? 1 : 0))[0]?.o;
  add(p.e, p.rings, outline?.place);
  const b = buildings[buildings.length - 1];
  if (!outline) continue;
  b.group = outline.id;
  // A part that says nothing about its own height or roof takes its building's (OSM's rule is that a part stands on
  // its own tags; but a part mapped bare inside a building tagged "5 levels, flat" is that, and not the three-storey
  // gabled house src/buildings.js would otherwise assume).
  const t = outline.tags;
  if (b.height == null && b.levels == null) { b.height = num(t.height); b.levels = num(t['building:levels']); }
  if (!b.roofShape) { b.roofShape = t['roof:shape'] ?? null; if (b.roofShape && b.roofHeight == null && b.roofLevels == null) { b.roofHeight = num(t['roof:height']); b.roofLevels = num(t['roof:levels']); } }
  b.colour ??= t['building:colour'] ?? null; b.roofColour ??= t['roof:colour'] ?? null;
}

// Walls in the same plane: the lower solid of each pair (the smaller, if they are as tall) steps in by 5 cm, and
// further if the one it lost to has stepped in itself.
{
  const signed = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };
  const info = buildings.map((b) => {
    const r = resolve(b), xs = b.rings[0].map((p) => p[0]), zs = b.rings[0].map((p) => p[1]);
    const edges = b.rings.flatMap((ring, k) => { const sign = Math.sign(signed(ring)) * (k === 0 ? 1 : -1); return ring.map((p, i) => { const q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1; return { p, q, n: [(dz / l) * sign, (-dx / l) * sign] }; }); });
    return { b, lo: r.minH, top: r.wallTop, size: Math.abs(signed(b.rings[0])), box: [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)], edges };
  });
  const lost = []; // [loser, winner]
  for (let i = 0; i < info.length; i++) for (let j = i + 1; j < info.length; j++) {
    const A = info[i], B = info[j];
    if (A.box[0] > B.box[2] || B.box[0] > A.box[2] || A.box[1] > B.box[3] || B.box[1] > A.box[3]) continue;
    if (Math.min(A.top, B.top) - Math.max(A.lo, B.lo) < 0.5) continue; // (their walls do not meet in height)
    let shared = 0;
    for (const e of A.edges) for (const f of B.edges) {
      if (e.n[0] * f.n[0] + e.n[1] * f.n[1] < 0.999) continue;                                       // facing the same way
      if (Math.abs((f.p[0] - e.p[0]) * e.n[0] + (f.p[1] - e.p[1]) * e.n[1]) > 0.03) continue;        // in the same plane
      const along = (pt) => (pt[0] - e.p[0]) * -e.n[1] + (pt[1] - e.p[1]) * e.n[0];
      shared += Math.max(0, Math.min(Math.max(along(e.p), along(e.q)), Math.max(along(f.p), along(f.q))) - Math.max(Math.min(along(e.p), along(e.q)), Math.min(along(f.p), along(f.q))));
    }
    if (shared > 0.3) lost.push(A.top < B.top - 0.01 || (Math.abs(A.top - B.top) <= 0.01 && A.size < B.size) ? [A.b, B.b] : [B.b, A.b]);
  }
  for (let round = 0; round < 6; round++) for (const [loser, winner] of lost) loser.inset = Math.max(loser.inset ?? 0, cm((winner.inset ?? 0) + 0.05));
  console.log(`walls in the same plane: ${lost.length} pairs, ${buildings.filter((b) => b.inset).length} buildings stepped in`);
}

// ---------------------------------------------------------------------------------------------------------- ground
const WIDTH = { // metres, for drawing; OSM's `width` wins when it is there (an assumption otherwise)
  primary: 12, secondary: 10, tertiary: 9, unclassified: 7, residential: 7, living_street: 6, pedestrian: 6,
  service: 4, footway: 2.5, path: 2, cycleway: 2.5, steps: 2.5, track: 3, primary_link: 8, secondary_link: 8, tertiary_link: 7,
};
const lines = (e) => (e.geometry ? toXZ(e.geometry) : []);
const isArea = (e) => e.tags?.area === 'yes' && e.geometry && e.geometry.length >= 4;

const streets = [], squares = [];
for (const e of read('streets')) {
  const k = e.tags?.highway;
  if (!WIDTH[k] || (e.tags.tunnel && e.tags.tunnel !== 'building_passage' && e.tags.tunnel !== 'no')) continue;
  if (isArea(e)) { squares.push({ kind: k, ring: closeOff(lines(e)) }); continue; }
  streets.push({ kind: k, width: num(e.tags.width) ?? WIDTH[k], pts: lines(e), ...(e.tags.tunnel === 'building_passage' && { passage: true }) });
}
// (what runs underground is not drawn: tunnels, and below, culverted streams)
const underground = (e) => e.tags?.tunnel && e.tags.tunnel !== 'building_passage' && e.tags.tunnel !== 'no';
const rail = read('rail').filter((e) => e.geometry && !underground(e)).map((e) => ({ kind: e.tags.railway, gauge: (num(e.tags.gauge) ?? 1435) / 1000, pts: lines(e) }));

const WATER_W = { river: 20, canal: 3, stream: 2, ditch: 0.6, drain: 0.6 }; // (the Bächle are ditches/drains, about half a metre wide)
const waterLines = [], waterAreas = [];
for (const e of read('water')) {
  const k = e.tags?.waterway;
  if (e.tags?.natural === 'water' || k === 'riverbank') { for (const rings of polygons(e)) waterAreas.push(rings); continue; }
  if (WATER_W[k] && e.geometry && !underground(e)) waterLines.push({ kind: k, width: num(e.tags.width) ?? WATER_W[k], pts: lines(e) });
}
// trees: each mapped tree where OSM has it; a tree row gets a tree every 8 m along it (ASSUMED spacing: OSM maps
// the row, not each tree). Height and crown diameter from `height` / `diameter_crown` when given.
const trees = [];
for (const e of read('trees')) {
  const h = num(e.tags?.height), d = num(e.tags?.diameter_crown);
  if (e.type === 'node') { trees.push([...toWorld(e.lat, e.lon).map(cm), h, d]); continue; }
  const pts = lines(e);
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]], l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(l / 8));
    for (let k = i === 0 ? 0 : 1; k <= n; k++) trees.push([cm(a[0] + ((b[0] - a[0]) * k) / n), cm(a[1] + ((b[1] - a[1]) * k) / n), h, d]);
  }
}
// (the vineyards have a layer of their own, which also brings the ones mapped as relations; a vineyard that is in
// both is taken once)
const seen = new Set(), greens = [...read('vineyards'), ...read('green')].filter((e) => { const k = e.type + e.id; if (seen.has(k)) return false; seen.add(k); return true; });
const green = greens.flatMap((e) => polygons(e).map((rings) => ({ kind: e.tags.leisure ?? e.tags.landuse ?? e.tags.natural, rings })));

mkdirSync('public/data', { recursive: true });
const out = { source: '© OpenStreetMap contributors, ODbL', buildings, streets, squares, rail, waterLines, waterAreas, green, trees };
const json = JSON.stringify(out);
writeFileSync('public/data/city.json', json);
const byPlace = {}; for (const b of buildings) if (b.place) byPlace[b.place] = (byPlace[b.place] ?? 0) + 1;
console.log(`buildings ${buildings.length} (outlines replaced by their parts: ${skippedOutlines}), places ${JSON.stringify(byPlace)}`);
console.log(`streets ${streets.length}, squares ${squares.length}, rail ${rail.length}, water ${waterLines.length} lines + ${waterAreas.length} areas, green ${green.length}, trees ${trees.length}`);
console.log(`public/data/city.json: ${(json.length / 1e6).toFixed(2)} MB`);
