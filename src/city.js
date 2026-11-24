// The generic city: every OSM building in city.json that no hand-made place has claimed, as one mesh, standing on the
// terrain. All the parts of one building (its `group`, tools/city.mjs) stand on the same ground: the lowest under
// any of them, so none floats and they stay stacked as OSM maps them.
import * as THREE from 'three';
import { Mesher, addBuilding } from './buildings.js';
import { FLAT } from './terrain.js';

export function buildCity(data, material, terrain = FLAT) {
  const m = new Mesher(), assumed = {}, ground = new Map();
  for (const b of data.buildings) {
    const key = b.group ?? b.id, h = terrain.lowest(b.rings[0]) - 0.3; // (a little into the ground: no gap under the walls)
    ground.set(key, Math.min(ground.get(key) ?? Infinity, h));
  }
  let n = 0;
  for (const b of data.buildings) {
    if (b.place) continue;
    const r = addBuilding(m, b, { lift: ground.get(b.group ?? b.id), chimneys: !b.group && b.type !== 'part' }); n++;
    for (const a of r.assumed) assumed[a] = (assumed[a] ?? 0) + 1;
  }
  const mesh = new THREE.Mesh(m.toGeometry(), material);
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.name = 'city';
  return { mesh, stats: { buildings: n, vertices: m.vertices, assumed } };
}
