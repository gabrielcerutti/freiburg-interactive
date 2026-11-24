// The kit for hand-made places (src/places/). A place builds itself out of simple solids — boxes, prisms, cylinders,
// pyramids, beams — in its own frame, in metres:
//   x  along the place's main axis (for a church, from the west front towards the choir)
//   z  to the right of x
//   y  up, from the ground
// Everything a place adds lands in one Mesher (src/buildings.js), so the whole place is a single mesh, and its size is
// counted: a single building must stay under 25,000 vertices, a group (a square, a block) under 90,000.
import * as THREE from 'three';
import { Mesher, addBuilding, KIND } from './buildings.js';

export { KIND };
export const BUDGET = { building: 25_000, group: 90_000 };

/** Named colours a place can use (or any CSS colour string). */
export const COLOURS = {
  SANDSTONE: '#c98f78', // red sandstone, weathered
  SANDSTONE_DARK: '#a8715f',
  OPENING: '#2a221f', // windows, doors and see-through tracery, drawn dark
  SLATE: '#5d6066',
  TILE: '#a5553a',
  COPPER: '#6f9c8a',
  IRON: '#221f1d',
  WHITE: '#f3efe6',
};

const colourOf = (c) => new THREE.Color().setStyle(COLOURS[c] ?? c);

/**
 * A place's frame: origin at (x, z) in world metres, its x axis turned `angle` radians from world east
 * (positive turns towards north). Returns the solids, all in the place's own metres.
 */
export function frame(mesher, { x: ox, z: oz, angle = 0, kind = KIND.STONE }) {
  const base = new THREE.Matrix4().makeTranslation(ox, 0, oz).multiply(new THREE.Matrix4().makeRotationY(angle));
  // (what the shader paints: dressed stone by default; dark colours — openings, iron — stay plain)
  const put = (geometry, colour, local = new THREE.Matrix4()) => {
    const c = colourOf(colour), k = c.r + c.g + c.b < 0.25 ? KIND.PLAIN : kind;
    mesher.geometry(geometry, c, base.clone().multiply(local), [0, 0, 0, k]);
    geometry.dispose();
  };
  const at = (x, y, z, rotY = 0) => new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(rotY));

  return {
    /** to world metres */
    toWorld(x, z) { const v = new THREE.Vector3(x, 0, z).applyMatrix4(base); return [v.x, v.z]; },
    /** any geometry, already in the place's metres */
    put,
    /** a box w (along x) × h × d (along z), standing on y, centred on x, z */
    box(w, h, d, x, y, z, colour, rotY = 0) { put(new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0), colour, at(x, y, z, rotY)); },
    /** a cylinder (or a cone frustum, with rTop) of `sides` faces, standing on y */
    cylinder(r, h, x, y, z, colour, sides = 8, rTop = r, rotY = 0) { put(new THREE.CylinderGeometry(rTop, r, h, sides, 1, rTop === 0).translate(0, h / 2, 0), colour, at(x, y, z, rotY)); },
    /** a pyramid of `sides` faces (4 = square), r to its corners */
    pyramid(r, h, x, y, z, colour, sides = 4, rotY = 0) { put(new THREE.ConeGeometry(r, h, sides, 1).translate(0, h / 2, 0), colour, at(x, y, z, rotY)); },
    /** a floor plan [[x, z], …] raised from y0 to y1 */
    prism(pts, y0, y1, colour) {
      const s = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
      put(new THREE.ExtrudeGeometry(s, { depth: y1 - y0, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, y0, 0), colour);
    },
    /** a square-section bar from point a to point b ([x, y, z] each), `t` thick: ribs, struts, tracery */
    beam(a, b, t, colour) {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B); if (len < 1e-6) return;
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
      const m = new THREE.Matrix4().compose(A.clone().add(B).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1));
      put(new THREE.BoxGeometry(t, len, t), colour, m);
    },
    /**
     * A block L (along x) × W (along z) × H with an archway running through it along x: `width` wide, its sides
     * straight up to `spring`, then an arch to `crown` (pointed when crown − spring > width / 2, round when equal),
     * `offset` metres off the middle towards +z. For gate towers and covered passages.
     */
    passage(L, W, H, x, y, z, colour, { width, spring, crown, offset = 0 }, rotY = 0) {
      const u0 = -offset, hw = width / 2, rise = crown - spring, R = (hw * hw + rise * rise) / width, N = 8;
      const arch = []; // (the opening, left springing to apex to right springing, in u = −z and v = y)
      const cL = u0 - hw + R, aL = Math.atan2(rise, -(R - hw));
      for (let i = 0; i <= N; i++) { const t = Math.PI + ((aL - Math.PI) * i) / N; arch.push([cL + R * Math.cos(t), spring + R * Math.sin(t)]); }
      for (let i = N - 1; i >= 0; i--) { const [u, v] = arch[i]; arch.push([2 * u0 - u, v]); }
      const pts = [[-W / 2, 0], [u0 - hw, 0], ...arch, [u0 + hw, 0], [W / 2, 0], [W / 2, H], [-W / 2, H]];
      const s = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u, v)));
      const g = new THREE.ExtrudeGeometry(s, { depth: L, bevelEnabled: false, curveSegments: 1 }).translate(0, 0, -L / 2).rotateY(Math.PI / 2);
      put(g, colour, at(x, y, z, rotY));
    },
    /**
     * A wall L long (along x) × H high × t thick (along z), standing on y, centred on x, z, with arched openings cut
     * into its foot: `arches` = [{ along, width, spring, crown }] (`along` the wall, from its middle). For arcades.
     */
    archedWall(L, H, t, x, y, z, colour, arches, rotY = 0) {
      const pts = [[-L / 2, 0]];
      for (const { along: c, width, spring, crown } of [...arches].sort((a, b) => a.along - b.along)) {
        const hw = width / 2, rise = crown - spring, R = (hw * hw + rise * rise) / width, N = 7, cL = c - hw + R, aL = Math.atan2(rise, -(R - hw));
        const left = []; for (let i = 0; i <= N; i++) { const a = Math.PI + ((aL - Math.PI) * i) / N; left.push([cL + R * Math.cos(a), spring + R * Math.sin(a)]); }
        pts.push([c - hw, 0], ...left, ...left.slice(0, -1).reverse().map(([u, v]) => [2 * c - u, v]), [c + hw, 0]);
      }
      pts.push([L / 2, 0], [L / 2, H], [-L / 2, H]);
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u, v))), { depth: t, bevelEnabled: false, curveSegments: 1 }).translate(0, 0, -t / 2);
      put(g, colour, at(x, y, z, rotY));
    },
    /** a solid of revolution: the profile [[r, y], …] (y from 0 up) turned around the vertical through x, z, from y */
    lathe(profile, y, colour, sides = 12, x = 0, z = 0) { put(new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), sides), colour, at(x, y, z)); },
    /** a flat panel w × h facing `normalAngle` (0 = +x), its bottom edge centred on x, y, z */
    panel(w, h, x, y, z, normalAngle, colour) { put(new THREE.PlaneGeometry(w, h).rotateY(normalAngle + Math.PI / 2).translate(0, h / 2, 0), colour, at(x, y, z)); },
  };
}

/** A new place builder: a Mesher plus helpers to add OSM buildings (world coordinates) and to finish the mesh. */
export function startPlace() {
  const mesher = new Mesher();
  return {
    mesher,
    frame: (o) => frame(mesher, o),
    /** draws OSM buildings from city.json as they are (see src/buildings.js for the assumptions); `{ walls: KIND.STONE }`
     *  for stone buildings whose windows should not be painted on */
    osm(buildings, options) { for (const b of buildings) addBuilding(mesher, b, options); },
  };
}
