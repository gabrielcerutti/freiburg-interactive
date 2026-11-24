// A town-gate tower, shared by the Martinstor and the Schwabentor: the tower's OSM part as a solid with an archway
// cut through it, lined up with the street OSM maps through the gate (tunnel=building_passage), the part's own
// roof from OSM on top, and rows of windows.
//
// Data: the footprint, the height and the roof (the OSM part), and where and in which direction the street goes
// through (the OSM passage). The caller passes what is assumed: the archway's size, the windows, the colours.

import * as THREE from 'three';
import { KIND } from '../kit.js';

/** The OSM street that runs through this footprint (a `passage: true` street whose middle point lies inside it). */
export function passageThrough(streets, ring) {
  for (const s of streets) {
    if (!s.passage || s.pts.length < 2) continue;
    for (let i = 0; i < s.pts.length - 1; i++) {
      const m = [(s.pts[i][0] + s.pts[i + 1][0]) / 2, (s.pts[i][1] + s.pts[i + 1][1]) / 2];
      if (inside(ring, m[0], m[1])) return [s.pts[i], s.pts[i + 1]];
    }
  }
  return null;
}

/**
 * Builds the tower. `body`: its OSM part; `line`: the passage ([a, b] in world metres); `arch`: { width, spring,
 * crown, pointed }; `windows`: { rows: [heights], perFace, w, h }; `wall`, `roof`: colours; `quoins`: the colour of
 * the corner stones, if it has them; `clock`: { y, r } for a clock on each of the two street faces.
 * Returns the frame (x along the passage, origin at the middle of the footprint), the wall top and the footprint size.
 */
export function gateTower(kit, { body, line, arch, windows, wall, roof, quoins, clock }) {
  const [a, b] = line, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], v = [-u[1], u[0]]; // (v is the frame's +z, see src/kit.js)
  const ring = body.rings[0], S = ring.map((p) => p[0] * u[0] + p[1] * u[1]), T_ = ring.map((p) => p[0] * v[0] + p[1] * v[1]);
  const s0 = Math.min(...S), s1 = Math.max(...S), t0 = Math.min(...T_), t1 = Math.max(...T_);
  const sc = (s0 + s1) / 2, tc = (t0 + t1) / 2, L = s1 - s0, W = t1 - t0;
  const centre = [u[0] * sc + v[0] * tc, u[1] * sc + v[1] * tc];
  const offset = (a[0] + b[0]) / 2 * v[0] + (a[1] + b[1]) / 2 * v[1] - tc; // (how far the passage runs off the middle)
  const T = kit.frame({ x: centre[0], z: centre[1], angle: Math.atan2(-u[1], u[0]) });

  const wallTop = body.height - (body.roofHeight ?? 0);
  T.passage(L, W, wallTop, 0, 0, 0, wall, { ...arch, offset });
  // the roof, as OSM has it, on a sliver of wall at the top of the tower
  kit.osm([{ ...body, id: body.id + '-roof', minHeight: wallTop - 0.1, colour: wall, roofColour: roof }], { walls: KIND.STONE });

  // windows: dark panels just proud of each face; on the two archway faces only above the arch
  const { rows, perFace, w, h } = windows, P = 0.06;
  const faces = [[L / 2 + P, 0, W, Math.PI / 2], [-L / 2 - P, 0, W, Math.PI / 2], [0, W / 2 + P, L, 0], [0, -W / 2 - P, L, 0]];
  for (const [fx, fz, span, rot] of faces) {
    for (const y of rows) {
      if (fz === 0 && y < arch.crown + 1) continue;
      for (let i = 0; i < perFace; i++) {
        const k = (i + 1) / (perFace + 1) - 0.5, x = fz === 0 ? fx : k * span, z = fz === 0 ? k * span : fz;
        T.box(w, h, 0.12, x, y, z, 'OPENING', rot);
      }
    }
  }
  // corner stones, standing a little proud of the plaster
  if (quoins) for (const sx of [-1, 1]) for (const sz of [-1, 1]) T.box(1.25, wallTop, 1.25, sx * (L / 2 - 0.57), 0, sz * (W / 2 - 0.57), quoins);
  // a clock on each street face: a dark rim, a white face and two hands
  if (clock) for (const side of [-1, 1]) {
    const turn = (g, out) => g.rotateY((side * Math.PI) / 2).translate(side * (L / 2 + out), clock.y, 0);
    T.put(turn(new THREE.CircleGeometry(clock.r + 0.18, 24), 0.07), 'IRON');
    T.put(turn(new THREE.CircleGeometry(clock.r, 24), 0.1), 'WHITE');
    T.put(turn(new THREE.PlaneGeometry(0.14, clock.r * 0.8).translate(0, clock.r * 0.36, 0), 0.13), 'IRON');
    T.put(turn(new THREE.PlaneGeometry(clock.r * 0.55, 0.14).translate(clock.r * 0.24, 0, 0), 0.13), 'IRON');
  }
  return { T, wallTop, size: [L, W] };
}

function inside(ring, x, z) { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; }
