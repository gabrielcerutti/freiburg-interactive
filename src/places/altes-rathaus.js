// The Altes Rathaus (Old Town Hall), on Rathausplatz.
//
// How it is made:
//   - The volumes are OpenStreetMap's 5 building:parts of the building (way 23226923), with their levels and roof
//     shapes, drawn by src/buildings.js. The front on the square is the east wall of the main part (way 551268493):
//     it is found from the parts, not written down — from the corner on Turmstraße (the southernmost point of the
//     outline) past the corner of the gabled part (way 551177733) to the north corner (the easternmost point).
//   - Made by hand on that wall, after the two Wikipedias and photographs on Wikimedia Commons (listed in `sources`):
//       · the shaped gable over the south end of the front, with its clock «gekrönt vom Doppeladler», the six coats
//         of arms the German page places («unten links der Bindenschild des Hauses Österreich und rechts das Wappen
//         Freiburgs», «in der Mitte links … das sogenannte Lerchenwappen», «das Wappen des Elsass in der Mitte
//         rechts», «rechts oben … der rote Adler der Zähringer, daneben der Löwe der Grafen von Urach») and the two
//         bells in an iron frame on top (the photos);
//       · the three entrances («Das Erdgeschoss hat drei Eingänge»): on the far left the arch of the former passage
//         to the courtyard, today the main entrance, between green columns; next to it a small doorway; and further
//         right the main portal of 1558, where «zwei Löwen halten das Stadtwappen von Freiburg und den Bindenschild
//         von Österreich»;
//       · the two stepped gables that close the long roof (the photos);
//       · the ground floor of the front, drawn plain with the five windows the photos show between the entrances
//         (the shader would otherwise paint shop fronts and doors there, as on any house).
//   - Colours: the walls are «in einem einheitlichen Sandsteinrot verputzt» (de), «plastered uniformly in sandstone
//     red» (en); OSM says building:colour darkred. The shade is read off the photos, like the green and gold of the
//     portals and the colours of the arms. OSM's roof:colour is maroon: drawn as the dark brown tiles of the photos.
//   - Not drawn: the «schwarzgold» window frames (the windows are painted on by the shader, as on every other
//     building), the lions and the date of the portal of 1558, the gilt edges of the gable, the ironwork of the bells.
//
// The width of the gable: OSM's gabled part is 7.2 m wide on the square and stops 1.3 m short of the corner on
// Turmstraße; the photo of 2025 by JoachimKohler-HB shows the gable reaching that corner. The model follows the
// photo: the gable spans the wall from the corner to the end of OSM's part, 8.6 m.
//
// ASSUMED: the heights (OSM gives levels, not metres: 3.1 m per level and 2.6 m per roof level, src/buildings.js);
// the painted windows of the upper floors and of the other sides; the outline and the height of the shaped gable
// (read off the photos by eye: 0.85 of its width) and where the clock, the eagle and the arms sit on it; the size of
// the three entrances and of the five ground-floor windows and where they stand along the wall; the exact shades;
// the number of steps in the stepped gables, and that they look the same towards the courtyard.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { resolve } from '../buildings.js';

export const PLACE = {
  key: 'altes-rathaus',
  name: 'Altes Rathaus',
  localName: 'Old Town Hall',
  kind: 'building',
  built: { from: 1557, to: 1559, rebuilt: [1949, 1954] }, // de: «Das Gebäude von 1557/1559»; «Wiederaufbau 1949 bis 1954»
  coordinates: [47.996256, 7.8493], // de.wikipedia «Rathaus (Freiburg im Breisgau)», infobox for the Altes Rathaus
  osm: 'w23226923',
  sources: [
    'German Wikipedia, «Rathaus (Freiburg im Breisgau)»: coordinates (47.996256 N, 7.8493 E); in 1557 the council commissioned master builder Dietrich Neeb and master mason Barthlin Ress; the building of 1557/1559; extended in 1561 and 1600; three entrances on the ground floor: the main portal of 1558 on the right, with two lions holding the arms of Freiburg and of Austria, and on the far left the arch of the former passage to the courtyard, today the main entrance; over that arch a clock crowned by the double-headed eagle; six coats of arms on the gable and where each one is; burned out completely in the air raid of 1944; rebuilt 1949 to 1954 with modern materials, extended 1953 to 1958 by three wings towards Gauchstraße; plastered in sandstone red, the window frames black and gold, the portals coloured',
    'English Wikipedia, «Freiburg im Breisgau Town Hall»: the same history; «plastered uniformly in sandstone red»',
    'Wikimedia Commons, «Altes Rathaus (Freiburg im Breisgau) 4610» (joergens.mi, 2011, CC BY-SA 3.0) and «Freiburg-Altes Rathaus-02-2007-gje» (Gerd Eichmann, 2007, CC BY-SA 4.0): the whole front — the gable on the left, the three entrances, the two stepped gables, the colours',
    'Wikimedia Commons, «Altes Rathaus (Freiburg im Breisgau) 3802» (joergens.mi, 2011, CC BY-SA 3.0): the gable from the front — its outline, the clock, the eagle, the six arms and the two bells',
    'Wikimedia Commons, «(Neues, links und) Altes Rathaus in Freiburg i. Br. (2025)» (JoachimKohler-HB, CC BY-SA 4.0): the gable reaches the corner on Turmstraße',
    'Wikimedia Commons, «Freiburg Altes Rathaus 01» (Andreas Praefcke, 2015, CC BY 4.0; one of the place’s photos) and «Altes Rathaus (Freiburg im Breisgau) 3832» (joergens.mi, 2011, CC BY-SA 3.0): the arch of today’s main entrance and the portal of 1558, their parts and colours',
    'OpenStreetMap, way 23226923 and its 5 building:parts: footprint, levels, roof shapes and colours',
  ],
  assumptions: [
    'the heights: OSM gives the number of storeys, not metres',
    'the windows of the upper floors and of the other sides, painted on as on every other building',
    'the outline and height of the shaped gable, and where the clock, the eagle and the six coats of arms sit on it (read off photos by eye)',
    'the width of the shaped gable: as wide as the wall from the corner on Turmstraße to the end of OSM’s gabled part, which is narrower',
    'the size of the three entrances and of the five ground-floor windows, and where they stand along the front',
    'the shades of the red, of the roof, of the green and gold portals and of the arms',
    'the number of steps in the two stepped gables, and that they are the same on the courtyard side',
  ],
  card: {
    title: 'Altes Rathaus',
    years: '1557 – 1559 · rebuilt 1949 – 1954',
    text: [
      'In 1557 the council commissioned the master builder Dietrich Neeb and the master mason Barthlin Ress; the town hall was built in 1557–59 and extended in 1561 and 1600.',
      'It is plastered in a uniform sandstone red. Over the arch of its passage is a clock crowned by the double-headed eagle of the Holy Roman Empire.',
      'In the air raid of 1944 it burned out completely, and its interior was lost. It was rebuilt in 1949–54 with modern materials.',
      'The volumes are OpenStreetMap’s; the heights come from its storey counts. The gable with its clock, eagle and six coats of arms, the three entrances, the windows between them and the stepped gables are placed by eye from photographs: their size, their exact position and their shades are guesses. The black and gold window frames are not drawn.',
    ],
  },
};

const MAIN = 'w551268493', BAY = 'w551177733';
// The ground. src/main.js stands a whole place on the lowest ground under its parts, less 0.3 m, and a place is not told
// about the terrain. Along this front the square lies higher than that foot — by 1.45 m at the corner on Turmstraße,
// 1.25 m where the gable ends and 0.65 m at the north corner (public/data/terrain.*) — so what stands on the square
// (the entrances, the ground-floor windows) is put on that ground: on the foot it would be half buried.
// PAINTED: how high above the foot the shader's ground floor of shop fronts reaches on this wall (it counts from the
// Münster's ground, 1.13 m above this foot).
const GROUND = { south: 1.45, bend: 1.25, north: 0.65 }, PAINTED = 3.75;
const RED = '#ad4631', ROOF = '#65453d', GREEN = '#8d9a7a', GOLD = '#d1a83a', WOOD = '#5a3626', STEP = '#9a948a', BRONZE = '#3f3a36';
const ARMS = { red: '#b3261e', white: '#f3efe6', blue: '#2f5f9a' };
// the shaped gable, one half of it: [how far from the middle (1 = the corner), how high (1 = the tip)], from the foot up
const GABLE = [[1, 0], [1, 0.14], [0.88, 0.14], [0.88, 0.29], [0.86, 0.33], [0.8, 0.37], [0.72, 0.39], [0.675, 0.395], [0.675, 0.46], [0.575, 0.46],
  [0.57, 0.56], [0.55, 0.61], [0.5, 0.65], [0.43, 0.675], [0.37, 0.68], [0.37, 0.745], [0.27, 0.745], [0.265, 0.82], [0.25, 0.87], [0.18, 0.917], [0.07, 0.955], [0, 1]];
// the double-headed eagle, one half of its outline, in a box 1.6 wide and 1.8 high: tail, claw, wing, head
const EAGLE = [[0, 0], [0.18, 0.05], [0.12, 0.35], [0.45, 0.3], [0.4, 0.42], [0.2, 0.5], [0.75, 0.55], [0.8, 0.9], [0.7, 1.35], [0.5, 1.2], [0.38, 1.3], [0.42, 1.55], [0.28, 1.72], [0.12, 1.62], [0.08, 1.45], [0, 1.4]];

export function build(kit, parts) {
  const main = parts.find((b) => b.id === MAIN), bay = parts.find((b) => b.id === BAY);
  if (!main || !bay) throw new Error('Altes Rathaus: OSM parts missing from city.json');
  kit.osm(parts.map((b) => ({ ...b, colour: RED, roofColour: b.roofColour === 'maroon' ? ROOF : b.roofColour })));

  // the front on the square: from the corner on Turmstraße (S) past the end of the gabled part (J) to the north corner (N)
  const ring = main.rings[0], inside = mid(ring), roof = resolve(main), Y = roof.wallTop;
  const S = ring.reduce((p, q) => (q[1] > p[1] ? q : p)), N = ring.reduce((p, q) => (q[0] > p[0] ? q : p));
  const J = bay.rings[0].slice().sort((p, q) => q[0] - p[0]).slice(0, 2).sort((p, q) => p[1] - q[1])[0];

  // 1. the shaped gable over the south end, standing a little proud of the wall
  const B = wallFrame(kit, S, J, inside), F = B.F, W = B.len, H = 0.85 * W, front = 0.25, at = (h) => Y + h * H;
  const half = GABLE.map(([f, h]) => [(f * W) / 2, at(h)]);
  slab(F, [[-W / 2, Y - 0.3], [W / 2, Y - 0.3], ...half, ...half.slice(0, -1).reverse().map(([x, y]) => [-x, y])], 0.5, front - 0.5, RED);
  for (const [w, h] of [[W + 0.3, -0.045], [0.68 * W + 0.2, 0.31], [0.37 * W + 0.2, 0.6]]) F.box(w, 0.26, 0.74, 0, at(h), front - 0.25, RED); // its three cornices
  for (const [f, h, r] of [[0.94, 0.18, 0.037], [0.32, 0.78, 0.03]]) for (const side of [-1, 1]) { // the scrolls
    F.put(new THREE.CylinderGeometry(r * H, r * H, 0.6, 14).rotateX(Math.PI / 2).translate((side * f * W) / 2, at(h), front - 0.25), RED);
  }
  for (const side of [-1, 1]) { // the two windows under the clock
    F.box(0.166 * W, 0.145 * H, 0.1, side * 0.125 * W, at(0.125), front, 'OPENING');
    F.box(0.07, 0.145 * H, 0.14, side * 0.125 * W, at(0.125), front, GOLD);
  }
  clock(F, 0, at(0.477), front + 0.03, 0.1 * W, { marks: GOLD, hands: GOLD });
  // the eagle, with its shield and its crown
  const e = (0.25 * H) / 1.8, bird = EAGLE.map(([x, y]) => [x * e, y * e]);
  flat(F, [...bird, ...bird.slice(1, -1).reverse().map(([x, y]) => [-x, y])], 0, at(0.645), front + 0.03, 'IRON');
  shield(F, 0, at(0.645) + 0.62 * e, front + 0.05, 0.62 * e, ARMS.white, { quarters: ARMS.red });
  F.box(0.4 * e, 0.24 * e, 0.06, 0, at(0.9), front + 0.02, GOLD);
  // the six coats of arms: Austria and Freiburg at the foot, the Habsburg lands and Alsace in the middle, Urach and Zähringen on top
  const s = 0.06 * W, z = front + 0.03;
  shield(F, (-0.93 * W) / 2, at(0.035), z, s, ARMS.red, { fess: ARMS.white });
  shield(F, (0.93 * W) / 2, at(0.035), z, s, ARMS.white, { cross: ARMS.red });
  shield(F, (-0.6 * W) / 2, at(0.35), z, s, ARMS.blue, { figure: GOLD });
  shield(F, (0.6 * W) / 2, at(0.35), z, s, ARMS.red, { bend: GOLD });
  shield(F, (-0.285 * W) / 2, at(0.65), z, s * 0.9, ARMS.white, { figure: ARMS.red });
  shield(F, (0.285 * W) / 2, at(0.65), z, s * 0.9, ARMS.white, { figure: ARMS.red });
  // the two bells on top, in their iron frame
  const tip = at(1);
  for (const side of [-1, 1]) { F.beam([side * 0.45, tip - 0.6, 0], [side * 0.36, tip + 1.6, 0], 0.07, 'IRON'); F.beam([side * 0.36, tip + 1.6, 0], [0, tip + 2.2, 0], 0.07, 'IRON'); }
  F.beam([0, tip - 0.1, 0], [0, tip + 2.5, 0], 0.05, 'IRON');
  F.cylinder(0.27, 0.4, 0, tip + 0.4, 0, BRONZE, 10, 0.12); F.cylinder(0.21, 0.32, 0, tip + 1.15, 0, BRONZE, 10, 0.1);

  // 2. today's main entrance, under the gable: the arch of the former passage between two green columns
  const M = wallFrame(kit, J, N, inside), G = M.F, L = M.len;
  const groundF = (x) => GROUND.bend + (GROUND.south - GROUND.bend) * (0.5 - x / W), groundG = (x) => GROUND.bend + (GROUND.north - GROUND.bend) * (0.5 + x / L);
  const px = 0.9, PW = 4.4, g = groundF(px), arch = { x: px, width: 3.1, spring: g + 1.4, crown: g + 2.7 };
  F.box(arch.width, 2.7, 0.2, px, g, 0.02, 'OPENING');
  slab(F, archOutline(px - PW / 2 + 0.2, px + PW / 2 - 0.2, g, g + 3.1, [arch]), 0.3, -0.05, GREEN);
  archBand(F, arch, 0.14, 0.27, GOLD);
  for (const side of [-1, 1]) {
    const x = px + side * 1.95;
    F.box(0.6, 1.5, 0.5, x, g, 0.3, GREEN); F.box(0.36, 0.85, 0.04, x, g + 0.35, 0.56, GOLD); // the pedestal
    F.cylinder(0.17, 1.4, x, g + 1.5, 0.36, GREEN, 10, 0.14); F.box(0.42, 0.22, 0.42, x, g + 2.88, 0.36, GOLD); // the column and its capital
  }
  F.box(PW + 0.1, 0.1, 0.62, px, g + 3.1, 0.3, GOLD); F.box(PW, 0.5, 0.55, px, g + 3.2, 0.27, GREEN); // the entablature
  F.box(PW + 0.3, 0.12, 0.75, px, g + 3.7, 0.33, GOLD); F.box(PW + 0.1, 0.12, 0.7, px, g + 3.82, 0.3, GREEN);
  shield(F, px - 1.45, g + 2.4, 0.28, 0.5, ARMS.red, { fess: ARMS.white }); shield(F, px + 1.45, g + 2.4, 0.28, 0.5, ARMS.white, { cross: ARMS.red });

  // 3. the long wing: the small doorway next to the gable, and the main portal of 1558
  const dx = -L / 2 + 0.85, dg = groundG(dx);
  G.box(1.0, 2.0, 0.16, dx, dg, 0.02, 'OPENING');
  for (const side of [-1, 1]) { G.box(0.08, 2.0, 0.12, dx + side * 0.54, dg, 0.06, GOLD); G.beam([dx + side * 0.58, dg + 2.0, 0.08], [dx, dg + 2.4, 0.08], 0.08, GOLD); }
  const qx = -L / 2 + 0.58 * L, q = groundG(qx), door = { x: qx, width: 1.5, spring: q + 2.05, crown: q + 2.35 };
  G.box(2.7, 0.25, 0.9, qx, q, 0.45, STEP);
  G.box(door.width, 2.35, 0.16, qx, q, 0.02, WOOD);
  slab(G, archOutline(qx - 1.2, qx + 1.2, q, q + 2.7, [door]), 0.25, -0.03, GREEN);
  archBand(G, door, 0.12, 0.24, GOLD);
  for (const side of [-1, 1]) G.box(0.2, 1.2, 0.04, qx + side * 0.98, q + 0.7, 0.23, GOLD);
  G.box(2.6, 0.08, 0.4, qx, q + 2.7, 0.15, GOLD); G.box(2.4, 0.7, 0.3, qx, q + 2.78, 0.1, GREEN); G.box(2.6, 0.1, 0.42, qx, q + 3.48, 0.16, GOLD);
  shield(G, qx - 0.21, q + 2.93, 0.27, 0.36, ARMS.red, { fess: ARMS.white }); shield(G, qx + 0.21, q + 2.93, 0.27, 0.36, ARMS.white, { cross: ARMS.red });
  for (const side of [-1, 1]) G.box(0.42, 0.42, 0.04, qx + side * 0.75, q + 2.9, 0.26, GOLD); // (where the two lions are)
  // the ground floor of the front, plain — the shader would paint shop fronts and doors on it — with its five windows
  F.box(W, PAINTED, 0.08, 0, 0, 0, RED); G.box(L, PAINTED, 0.08, 0, 0, 0, RED);
  for (const k of [0.16, 0.33, 0.46, 0.78, 0.9]) {
    const x = -L / 2 + k * L, y = groundG(x) + 1.15;
    G.box(1.5, 1.3, 0.06, x, y, 0.05, 'OPENING'); G.box(0.07, 1.3, 0.08, x, y, 0.06, GOLD); G.box(1.5, 0.06, 0.08, x, y + 0.6, 0.06, GOLD);
  }

  // 4. the stepped gables that close the long roof, at the gable's side and at the north end
  const { c, u, v, hw } = roof.box, steps = 9, rise = roof.roofH / steps;
  const sOf = (p) => (p[0] - c[0]) * u[0] + (p[1] - c[1]) * u[1], tOf = (p) => (p[0] - c[0]) * v[0] + (p[1] - c[1]) * v[1];
  const towards = Math.sign(sOf(N) - sOf(J));
  for (const [p, dir] of [[J, towards], [N, -towards]]) {
    const s0 = sOf(p) + dir * 0.4, ts = []; // (a little inside the wing; then how far the building reaches to each side there)
    ring.forEach((a, i) => { const b = ring[(i + 1) % ring.length], sa = sOf(a) - s0, sb = sOf(b) - s0; if (sa * sb < 0) ts.push(tOf(a) + ((tOf(b) - tOf(a)) * sa) / (sa - sb)); });
    if (ts.length < 2) continue;
    const t0 = Math.min(...ts), t1 = Math.max(...ts);
    const C = kit.frame({ x: c[0] + u[0] * s0, z: c[1] + u[1] * s0, angle: Math.atan2(-v[1], v[0]), kind: KIND.PLAIN });
    for (let k = 0; k < steps; k++) {
      const reach = hw * (1 - k / steps), a = Math.max(-reach, t0), b = Math.min(reach, t1);
      if (b - a > 0.3) C.box(b - a, rise + 0.35, 0.5, (a + b) / 2, Y + k * rise, 0, RED);
    }
  }

  return { anchor: centreTop(parts).anchor, top: tip + 2.5 };
}

// ------------------------------------------------------------- what the two town halls share (see neues-rathaus.js)
/** the middle of a ring */
export function mid(ring) { return [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length]; }

/** the label goes over the middle of the parts, above the tallest */
export function centreTop(parts) {
  const top = Math.max(...parts.map((b) => resolve(b).wallTop + resolve(b).roofH));
  return { anchor: mid(parts.flatMap((b) => b.rings[0])), top };
}

/**
 * A frame laid on a wall, from its two ends `a` and `b` (world metres) and any point `inside` the building: the
 * origin at the wall's middle, x to the right of someone who faces the wall, y up, z out of the wall.
 * Returns the kit's frame `F`, the wall's length, and `x(p)`, `z(p)`: a world point in the frame's metres.
 */
export function wallFrame(kit, a, b, inside, kind = KIND.PLAIN) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let u = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  if (-u[1] * (c[0] - inside[0]) + u[0] * (c[1] - inside[1]) < 0) u = [-u[0], -u[1]]; // (the frame's +z is (−uz, ux): away from the building)
  const F = kit.frame({ x: c[0], z: c[1], angle: Math.atan2(-u[1], u[0]), kind });
  return { F, len, x: (p) => (p[0] - c[0]) * u[0] + (p[1] - c[1]) * u[1], z: (p) => -(p[0] - c[0]) * u[1] + (p[1] - c[1]) * u[0] };
}

/** a wall with any outline, [[x, y], …] in a wall frame, `t` thick, its back at z */
export function slab(F, pts, t, z, colour) {
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  F.put(new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 }).translate(0, 0, z), colour);
}

/** a flat figure with any outline, lying on a wall: [[x, y], …] from its own origin, put at x, y, z */
export function flat(F, pts, x, y, z, colour) {
  F.put(new THREE.ShapeGeometry(new THREE.Shape(pts.map(([a, b]) => new THREE.Vector2(a, b)))).translate(x, y, z), colour);
}

/**
 * The outline of a wall from x0 to x1 and y0 to y1 with arches cut into its foot: `arches` = [{ x, width, spring,
 * crown }], each a piece of a circle through its two springings and its crown (round when crown − spring is half
 * the width, flatter when less).
 */
export function archOutline(x0, x1, y0, y1, arches) {
  const pts = [[x0, y0]];
  for (const { x, width, spring, crown } of [...arches].sort((p, q) => p.x - q.x)) {
    const { R, a0 } = arc(width, spring, crown), n = 8;
    pts.push([x - width / 2, y0]);
    for (let i = 0; i <= n; i++) { const a = -a0 + (2 * a0 * i) / n; pts.push([x + R * Math.sin(a), crown - R + R * Math.cos(a)]); }
    pts.push([x + width / 2, y0]);
  }
  pts.push([x1, y0], [x1, y1], [x0, y1]);
  return pts;
}
const arc = (width, spring, crown) => { const hw = width / 2, rise = Math.min(crown - spring, hw), R = (hw * hw + rise * rise) / (2 * rise); return { R, a0: Math.asin(Math.min(1, hw / R)) }; };

/** the band of stones around an arch (same numbers as archOutline), `band` wide, lying at z */
export function archBand(F, { x, width, spring, crown }, band, z, colour) {
  const { R, a0 } = arc(width, spring, crown);
  F.put(new THREE.RingGeometry(R, R + band, 14, 1, Math.PI / 2 - a0, 2 * a0).translate(x, crown - R, z), colour);
}

/** a clock lying on a wall at x, y, z: a dial (`face`, with a `centre` of another colour), two rings and twelve marks, two hands */
export function clock(F, x, y, z, r, { face, centre, marks, hands }) {
  const lay = (g, dz, colour) => F.put(g.translate(x, y, z + dz), colour);
  if (face) lay(new THREE.CircleGeometry(r, 24), 0, face);
  if (centre) lay(new THREE.CircleGeometry(r * 0.64, 24), 0.02, centre);
  if (marks) {
    lay(new THREE.RingGeometry(r * 0.94, r, 24), 0.04, marks); lay(new THREE.RingGeometry(r * 0.6, r * 0.65, 24), 0.04, marks);
    for (let k = 0; k < 12; k++) lay(new THREE.PlaneGeometry(r * 0.06, r * 0.2).translate(0, r * 0.79, 0).rotateZ((k * Math.PI) / 6), 0.04, marks);
  }
  lay(new THREE.PlaneGeometry(r * 0.07, r * 0.8).translate(0, r * 0.36, 0).rotateZ(-Math.PI / 3), 0.06, hands);
  lay(new THREE.PlaneGeometry(r * 0.1, r * 0.5).translate(0, r * 0.21, 0).rotateZ(Math.PI / 3), 0.06, hands);
}

/**
 * A coat of arms lying on a wall, its point at x, y, z, `s` wide: a shield of one colour with, at most, one charge —
 * `fess` (a band across), `cross`, `bend` (a band from the top left), `quarters` (two of its four quarters) or
 * `figure` (a patch where an animal is). The colour of the charge is the value.
 */
export function shield(F, x, y, z, s, field, charge = {}) {
  flat(F, [[-0.5, 1.1], [-0.5, 0.45], [0, 0], [0.5, 0.45], [0.5, 1.1]].map(([a, b]) => [a * s, b * s]), x, y, z, field);
  const bar = (w, h, cx, cy, turn, colour) => F.put(new THREE.PlaneGeometry(w * s, h * s).rotateZ(turn).translate(x + cx * s, y + cy * s, z + 0.02), colour);
  if (charge.fess) bar(1, 0.3, 0, 0.7, 0, charge.fess);
  if (charge.cross) { bar(1, 0.2, 0, 0.72, 0, charge.cross); bar(0.2, 0.92, 0, 0.64, 0, charge.cross); }
  if (charge.bend) bar(0.85, 0.2, 0, 0.66, -Math.PI / 4, charge.bend);
  if (charge.quarters) { bar(0.5, 0.42, -0.25, 0.89, 0, charge.quarters); bar(0.32, 0.3, 0.17, 0.5, 0, charge.quarters); }
  if (charge.figure) bar(0.44, 0.5, 0, 0.68, 0, charge.figure);
}
