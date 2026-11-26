// The generic city: every OSM building in city.json that no hand-made place has claimed, standing on the terrain.
// All the parts of one building (its `group`, tools/city.mjs) stand on the same ground: the lowest under any of
// them, so none floats and they stay stacked as OSM maps them.
// The city follows the timeline. `ages` (public/data/ages.json, tools/ages.mjs) says, for each stop, whether a
// building stood, lay in ruins or was not there — read off the old plans, an inference and not a record — and lists
// the buildings that are gone today. So there are three meshes:
//   city    today's buildings, each at the stops where it stood;
//   ruins   what was left of those the raid of November 1944 destroyed (src/buildings.js, addRuin), at that stop;
//   lost    the buildings that are gone: plain houses on footprints cut out of the plan of 1920. ASSUMED, all of
//           them but where they stood: three floors, a tiled roof, the colours — and in ruins like the others.
// Each of the three is cut into tiles of TILE metres (a building goes to the tile its first corner is in), so that
// only the part of the city in view is drawn — and its shadows only where the sun's view reaches: the city can
// grow without every frame paying for all of it.
// Every vertex carries the ground under its building and its stops (`aWhen`: one bit per stop, bit 8 for today),
// and the shader raises and lowers each building as the timeline moves (src/look.js). Each mesh also hands over
// its outlines (`userData.edges`: the segments and the same two numbers for each), which rise with it.
import * as THREE from 'three';
import { Mesher, addBuilding, addRuin, orientedBox } from './buildings.js';
import { FLAT } from './terrain.js';

export const TODAY = 8;
const TILE = 384;
const ALWAYS = 511;
/** the stops at which a building is in a given state ('1' standing, '2' in ruins), as bits; `today`: and now */
const bits = (when, state, today) => { let n = today ? 1 << TODAY : 0; for (let i = 0; i < when.length; i++) if (when[i] === state) n |= 1 << i; return n; };

/**
 * `materials`: { solid, open, depth } — the look for the buildings, the same drawn from both sides for the ruins
 * (their walls are a single skin) and the one for the shadows (src/look.js: lookMaterial({ rise }), riseDepthMaterial).
 */
export function buildCity(data, materials, terrain = FLAT, ages = null) {
  const assumed = {}, ground = new Map();
  for (const b of data.buildings) {
    const key = b.group ?? b.id, h = terrain.lowest(b.rings[0]) - 0.3; // (a little into the ground: no gap under the walls)
    ground.set(key, Math.min(ground.get(key) ?? Infinity, h));
  }
  const part = (name) => ({ name, m: new Mesher(), spans: [], stops: 0 }), tiles = new Map();
  /** the three parts of the tile a building stands in */
  const tileOf = (b) => {
    const [x, z] = b.rings[0][0], key = `${Math.floor(x / TILE)},${Math.floor(z / TILE)}`;
    if (!tiles.has(key)) tiles.set(key, { city: part('city'), ruins: part('ruins'), lost: part('lost') });
    return tiles.get(key);
  };
  /** adds one thing to a mesh, remembering which of its vertices are this building's and when it stands */
  const put = (part, lift, stops, add) => {
    if (!stops) return;
    const from = part.m.vertices, lines = part.m.seg.length;
    part.m.when = [lift, stops]; add(part.m);
    if (part.m.vertices > from) { part.spans.push([from, part.m.vertices, lift, stops, lines, part.m.seg.length]); part.stops |= stops; }
  };
  let n = 0;
  for (const b of data.buildings) {
    if (b.place) continue;
    const key = b.group ?? b.id, when = ages?.standing[key], lift = ground.get(key), parts = tileOf(b);
    put(parts.city, lift, when ? bits(when, '1', true) : ALWAYS, (m) => {
      const r = addBuilding(m, b, { lift, chimneys: !b.group && b.type !== 'part' }); n++;
      for (const a of r.assumed) assumed[a] = (assumed[a] ?? 0) + 1;
    });
    if (when) put(parts.ruins, lift, bits(when, '2', false), (m) => addRuin(m, b, { lift }));
  }
  (ages?.lost ?? []).forEach((l, i) => {
    const box = orientedBox(l.ring), lift = terrain.lowest(l.ring) - 0.3;
    const b = { id: `lost${i}`, rings: [l.ring], type: 'yes', levels: 3, roofShape: box.hl < box.hw * 1.35 ? 'hipped' : 'gabled' }, parts = tileOf(b);
    put(parts.lost, lift, bits(l.when, '1', false), (m) => addBuilding(m, b, { lift, chimneys: true }));
    put(parts.ruins, lift, bits(l.when, '2', false), (m) => addRuin(m, b, { lift }));
  });

  const group = new THREE.Group(); group.name = 'city';
  let vertices = 0; const sizes = {};
  const meshes = [...tiles.values()].flatMap((t) => Object.values(t)).filter((p) => p.m.vertices).map((p) => {
    const name = p.name, mesh = new THREE.Mesh(p.m.toGeometry(), name === 'ruins' ? materials.open : materials.solid);
    mesh.customDepthMaterial = materials.depth; mesh.castShadow = mesh.receiveShadow = true; mesh.name = name;
    // (drawn only when in view. The shader only ever lowers a building — it sinks, or is put away far below — so the
    // sphere around the buildings as they stand always holds what is drawn of them)
    mesh.geometry.computeBoundingSphere();
    mesh.userData.edges = edgesOf(mesh.geometry, p.spans, p.m.seg); mesh.userData.stops = p.stops;
    vertices += p.m.vertices; group.add(mesh);
    const s = (sizes[name] ??= { vertices: 0, edges: 0 }); s.vertices += p.m.vertices; s.edges += mesh.userData.edges.whens.length / 2;
    return mesh;
  });
  /** a mesh is only drawn while one of its buildings stands: at the stop the timeline comes from, or the one it goes to */
  const showStops = (from, to) => { for (const mesh of meshes) mesh.visible = Boolean(mesh.userData.stops & ((1 << from) | (1 << to))); };
  return { group, meshes, showStops, stats: { tiles: tiles.size, meshes: meshes.length, buildings: n, lost: ages?.lost?.length ?? 0, vertices, sizes, assumed } };
}

/**
 * The outlines of every building of a mesh, each with its building's ground and stops: the lines the building named
 * itself (the ruins do), or else its edges (where two faces meet at more than 28°).
 */
function edgesOf(geometry, spans, named) {
  const pos = geometry.attributes.position.array, segs = [], whens = [];
  for (const [from, to, lift, stops, l0, l1] of spans) {
    if (l1 > l0) { for (let i = l0; i < l1; i += 6) { for (let j = 0; j < 6; j++) segs.push(named[i + j]); whens.push(lift, stops); } continue; }
    const one = new THREE.BufferGeometry();
    one.setAttribute('position', new THREE.BufferAttribute(pos.subarray(from * 3, to * 3), 3));
    const e = new THREE.EdgesGeometry(one, 28), p = e.attributes.position.array;
    for (let i = 0; i < p.length; i += 6) { segs.push(p[i], p[i + 1], p[i + 2], p[i + 3], p[i + 4], p[i + 5]); whens.push(lift, stops); }
    e.dispose(); one.dispose();
  }
  return { positions: new Float32Array(segs), whens: new Float32Array(whens) };
}
