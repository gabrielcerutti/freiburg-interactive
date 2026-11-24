// The generic city: every OSM building in city.json that no hand-made place has claimed, standing on the terrain.
// All the parts of one building (its `group`, tools/city.mjs) stand on the same ground: the lowest under any of
// them, so none floats and they stay stacked as OSM maps them.
// The buildings are sorted into a few meshes by WHEN they stand: `ages` (public/data/ages.json, tools/ages.mjs) says,
// for each stop of the timeline, whether a building stood — read off the old plans, an inference and not a record.
// `showStop(i)` shows the buildings of stop i and hides the rest; `showStop(-1)` shows them all (today).
import * as THREE from 'three';
import { Mesher, addBuilding } from './buildings.js';
import { FLAT } from './terrain.js';

export function buildCity(data, material, terrain = FLAT, ages = null) {
  const assumed = {}, ground = new Map(), meshers = new Map();
  for (const b of data.buildings) {
    const key = b.group ?? b.id, h = terrain.lowest(b.rings[0]) - 0.3; // (a little into the ground: no gap under the walls)
    ground.set(key, Math.min(ground.get(key) ?? Infinity, h));
  }
  let n = 0, vertices = 0;
  for (const b of data.buildings) {
    if (b.place) continue;
    const key = b.group ?? b.id, when = ages?.standing[key] ?? ''; // ('' : standing at every stop)
    if (!meshers.has(when)) meshers.set(when, new Mesher());
    const r = addBuilding(meshers.get(when), b, { lift: ground.get(key), chimneys: !b.group && b.type !== 'part' }); n++;
    for (const a of r.assumed) assumed[a] = (assumed[a] ?? 0) + 1;
  }
  const group = new THREE.Group(); group.name = 'city';
  const meshes = [...meshers].map(([when, m]) => {
    const mesh = new THREE.Mesh(m.toGeometry(), material);
    mesh.castShadow = mesh.receiveShadow = true; mesh.userData.when = when;
    vertices += m.vertices; group.add(mesh);
    return mesh;
  });
  const showStop = (i) => { for (const mesh of meshes) mesh.visible = i < 0 || mesh.userData.when === '' || mesh.userData.when[i] === '1'; };
  return { group, meshes, showStop, stats: { buildings: n, vertices, assumed } };
}
