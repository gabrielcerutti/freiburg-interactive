// The trees: the ones OpenStreetMap maps in the old town (natural=tree, and tree rows: see tools/city.mjs), and the
// woods OSM maps as areas (landuse=forest, natural=wood — the Schlossberg), filled with trees. As two instanced
// meshes, crowns and trunks, standing on the terrain.
// Data: where the mapped trees stand, and their `height` / `diameter_crown` when OSM has them; where the woods are.
// ASSUMED: the size of trees OSM does not measure (9 to 13 m, the crown about 0.6 as wide); the lumpy shape of a crown; every tree inside a wood
// (OSM maps the wood, not its trees: one every 80 m² or so, at random but always the same); the shades of green.
import * as THREE from 'three';
import { lookMaterial } from './look.js';
import { KIND } from './buildings.js';
import { FLAT } from './terrain.js';

const GREENS = ['#5f8a3e', '#6e9a47', '#517a38', '#7aa550', '#5a8444'].map((c) => new THREE.Color(c));
const WOODS = new Set(['forest', 'wood']), PER_TREE = 80, MAX_WOOD_TREES = 40_000;

const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };

/** trees scattered over OSM's woods, on a jittered grid so they never clump */
function woodTrees(green, extent) {
  const out = [], step = Math.sqrt(PER_TREE);
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (const a of green) {
    if (!WOODS.has(a.kind)) continue;
    const [outer, ...holes] = a.rings;
    const xs = outer.map((p) => p[0]), zs = outer.map((p) => p[1]);
    // (OSM's woods run on into the Black Forest: only the part over the terrain is filled)
    const [ex0, ez0, ex1, ez1] = extent ?? [-Infinity, -Infinity, Infinity, Infinity];
    for (let x = Math.max(ex0, Math.min(...xs)); x < Math.min(ex1, Math.max(...xs)); x += step) for (let z = Math.max(ez0, Math.min(...zs)); z < Math.min(ez1, Math.max(...zs)); z += step) {
      const px = x + (rnd() - 0.5) * step * 0.9, pz = z + (rnd() - 0.5) * step * 0.9;
      if (inside(outer, px, pz) && !holes.some((h) => inside(h, px, pz))) out.push([px, pz, null, null]);
      if (out.length >= MAX_WOOD_TREES) return out;
    }
  }
  return out;
}

export function buildTrees(data, terrain = FLAT) {
  const wood = woodTrees(data.green, terrain.extent);
  const group = new THREE.Group(); group.name = 'trees';
  group.add(...instanced(data.trees, terrain, 2, 0), ...instanced(wood, terrain, 1, 1e5));
  return { group, count: data.trees.length + wood.length, inWoods: wood.length };
}

/**
 * A crown: a ball pushed in and out into lumps and flattened underneath, so its outline is leafy, not round.
 * Its normals stay those of the ball: the light falls on it softly and the shader breaks it into clumps of tone.
 */
function crownGeometry(detail, seed) {
  const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3();
  const bump = (x, y, z) => Math.sin(x * 3.1 + seed) * Math.sin(y * 2.7 + seed * 1.7) * Math.sin(z * 3.3 + seed * 0.6) + 0.5 * Math.sin(x * 6.3 + y * 5.1 + seed) * Math.sin(z * 5.7 + y * 4.3);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    n.setXYZ(i, v.x, v.y, v.z);
    const r = 1 + 0.2 * bump(v.x, v.y, v.z), squash = v.y < -0.35 ? 0.55 : 1; // (flatter underneath)
    p.setXYZ(i, v.x * r, v.y * r * squash, v.z * r);
  }
  g.setAttribute('aFacade', new THREE.Float32BufferAttribute(new Array(p.count).fill([0, 0, 0, KIND.FOLIAGE]).flat(), 4));
  g.computeBoundingSphere();
  return g;
}

/** crowns and trunks for a list of trees; `detail` 2 for the mapped trees, 1 (fewer faces) for the woods */
function instanced(trees, terrain, detail, seed) {
  const rand = (i, k) => { const x = Math.sin((i + seed) * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const crowns = new THREE.InstancedMesh(crownGeometry(detail, seed % 7), lookMaterial({ vertexColors: false }), trees.length);
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.26, 1, 5).translate(0, 0.5, 0), lookMaterial({ vertexColors: false }), trees.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), trunk = new THREE.Color('#5d4a38');
  trees.forEach(([x, z, h, d], i) => {
    const H = h ?? 9 + rand(i, 1) * 4, R = (d ?? H * 0.62) / 2, crownBase = H * 0.3, y = terrain.heightAt(x, z);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand(i, 2) * 6.3);
    m.compose(p.set(x, y + crownBase + (H - crownBase) * 0.5, z), q, s.set(R, (H - crownBase) / 2, R)); crowns.setMatrixAt(i, m);
    crowns.setColorAt(i, GREENS[Math.floor(rand(i, 3) * GREENS.length)]);
    m.compose(p.set(x, y - 0.5, z), q, s.set(1, crownBase + 1.2, 1)); trunks.setMatrixAt(i, m); trunks.setColorAt(i, trunk);
  });
  for (const t of [crowns, trunks]) { t.castShadow = true; t.receiveShadow = true; t.instanceMatrix.needsUpdate = true; t.computeBoundingSphere(); }
  return [crowns, trunks];
}
