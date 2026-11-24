// From the raw OpenStreetMap download (sources/osm/, made by tools/osm.mjs) to the compact city the viewer loads:
//   node tools/city.mjs   -> public/data/city.json
// Everything is converted to local metres (src/geo.js) and rounded to centimetres.
//
// What goes in:
//   buildings  every building outline, or its building:parts when it has them (the "Simple 3D Buildings" rule:
//              if a building is split into parts, the parts are drawn and the outline is not). Heights and roofs
//              are copied as OSM gives them; whatever is missing is filled in later by src/buildings.js, which
//              marks it as an assumption.
//   places     buildings that belong to a hand-made place (src/places/) are tagged with that place's key, so the
//              generic city leaves them out and the place decides what to do with them.
//   ground     streets, squares, railways/tram, water (including the Bächle) and green areas, for the ground map.
// Data © OpenStreetMap contributors, ODbL.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { toWorld } from '../src/geo.js';
import { PLACE_OSM } from '../src/places/osm-ids.js';

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
    outlineRings.push({ id: `${e.type[0]}${e.id}`, outer: rings[0] });
    const place = placeOf.get(`${e.type[0]}${e.id}`);
    if (place) placeOutlines.push({ place, outer: rings[0] });
    // does any part sit inside this outline? then the parts stand in for it
    const outer = rings[0];
    const hasParts = partPolys.some((p) => inside(outer, ...p.c));
    if (hasParts) { skippedOutlines++; continue; }
    add(e, rings, place);
  }
}
for (const p of partPolys) {
  const owner = placeOutlines.find((o) => inside(o.outer, ...p.c));
  add(p.e, p.rings, owner?.place);
  // the outline the part belongs to: all the parts of one building stand on the same ground (src/city.js)
  const outline = outlineRings.find((o) => inside(o.outer, ...p.c));
  if (outline) buildings[buildings.length - 1].group = outline.id;
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
const green = read('green').flatMap((e) => polygons(e).map((rings) => ({ kind: e.tags.leisure ?? e.tags.landuse ?? e.tags.natural, rings })));

mkdirSync('public/data', { recursive: true });
const out = { source: '© OpenStreetMap contributors, ODbL', buildings, streets, squares, rail, waterLines, waterAreas, green, trees };
const json = JSON.stringify(out);
writeFileSync('public/data/city.json', json);
const byPlace = {}; for (const b of buildings) if (b.place) byPlace[b.place] = (byPlace[b.place] ?? 0) + 1;
console.log(`buildings ${buildings.length} (outlines replaced by their parts: ${skippedOutlines}), places ${JSON.stringify(byPlace)}`);
console.log(`streets ${streets.length}, squares ${squares.length}, rail ${rail.length}, water ${waterLines.length} lines + ${waterAreas.length} areas, green ${green.length}, trees ${trees.length}`);
console.log(`public/data/city.json: ${(json.length / 1e6).toFixed(2)} MB`);
