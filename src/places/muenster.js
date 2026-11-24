// Freiburg Minster (Münster Unserer Lieben Frau).
//
// How it is made:
//   - The body of the church — nave, aisles, transept, choir, chapels, the two Hahnentürme, the square base of the
//     west tower and its star gallery — is OpenStreetMap's 3D mapping of the building: 34 `building:part`s with their
//     own heights, roof shapes and colours (https://www.openstreetmap.org/way/110404213 and the parts inside it),
//     drawn by src/buildings.js. That is data, not a guess.
//   - The top of the west tower, from 37 m up, is made by hand: OSM has it as a single part (way 100424612) with
//     min_height 37, height 116 and a 46 m pyramidal roof, so the octagonal storey runs from 37 to 70 m and the spire
//     from 70 to 116 m. The eight corners of the octagon are that part's own corners.
//   - What the tower top looks like follows the description on the English Wikipedia page: "nearly square at the
//     base, and at its centre is the dodecagonal star gallery. Above this gallery, the tower is octagonal and tapered,
//     and above this, is the spire." The German page calls the spire the earliest Gothic tracery spire
//     ("der frühesten Maßwerkturmhelm der Gotik"), so it is drawn open: ribs, rings and tracery, with sky behind.
//
// ASSUMED (not measured, not from a source): the number and thickness of the ribs, rings and tracery bars and their
// pattern; the tall windows of the octagon with two mullions; the gables over its windows and the pinnacles on its
// corners; where the spire's point ends (115 m) and the finial above it. The colours are OSM's (`building:colour`
// #EFC392, `roof:colour` #A96341); the openings are drawn dark.

export const PLACE = {
  key: 'muenster',
  name: 'Freiburg Minster',
  localName: 'Münster Unserer Lieben Frau',
  kind: 'building', // (budget: 25,000 vertices)
  built: { from: 1200, to: 1513 }, // de.wikipedia: "Sie wurde von etwa 1200 bis 1513 erbaut." (the start is approximate)
  coordinates: [47.99556, 7.85306], // en.wikipedia "Freiburg Minster", infobox (independent of the OSM outline)
  osm: 'w110404213',
  checks: {
    height: 116, // en.wikipedia and de.wikipedia ("den 116 Meter hohen Turm"); OSM height=116
    length: 125.83, // de.wikipedia: "Das Münster hat eine Gesamtlänge von 125,83 m."
  },
  sources: [
    'English Wikipedia, «Freiburg Minster»: coordinates (47.99556 N, 7.85306 E); the 116 m tower; tower completed 1330; how the tower is built up (square base, dodecagonal star gallery, octagon, spire)',
    'German Wikipedia, «Freiburger Münster»: built from about 1200 to 1513; tower finished around 1330; choir foundation stone 24 March 1354, choir consecrated 5 December 1513; total length 125.83 m; the earliest Gothic tracery spire',
    'OpenStreetMap, way 110404213 and the 35 building:parts inside it: footprint, heights, roof shapes and colours of the whole church; one of them, way 100424612, is the octagon and spire (37–116 m, roof height 46 m)',
  ],
  assumptions: [
    'the pattern and thickness of the spire’s ribs, rings and tracery',
    'the octagon’s windows, mullions, gables and corner pinnacles',
    'the finial at the top',
  ],
  card: {
    title: 'Freiburg Minster',
    years: 'about 1200 – 1513',
    text: [
      'Building started around 1200 and went on for three centuries. The west tower was finished around 1330: 116 metres, nearly square at the base, then a twelve-sided star gallery, an octagon, and the spire.',
      'The spire is open tracery, said to be the earliest of the Gothic period. The new choir was begun in 1354 and consecrated on 5 December 1513. The church is 125.83 metres long.',
      'The body of the church is OpenStreetMap’s 3D model of it. The top of the tower is drawn by hand: the pattern of its tracery, the windows and the pinnacles are simplified guesses.',
    ],
  },
};

import { KIND } from '../kit.js';

const SPIRE_PART = 'w100424612', NAVE_PART = 'w146295722';
const STONE = '#efc392', DARK = 'OPENING'; // (OSM building:colour of the Münster parts)

/** Builds the Münster. `kit` comes from startPlace() (src/kit.js); `parts` are its buildings from city.json. */
export function build(kit, parts) {
  const spire = parts.find((b) => b.id === SPIRE_PART), nave = parts.find((b) => b.id === NAVE_PART);
  if (!spire || !nave) throw new Error('Münster: the OSM parts for the spire or the nave are missing from city.json');

  // 1. the body of the church, from OSM, without the tower top (which is made by hand below)
  kit.osm(parts.filter((b) => b !== spire), { walls: KIND.STONE });

  // 2. the frame: origin at the centre of the octagon, x along the church from west to east
  const ring = spire.rings[0];
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length, cz = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const [a, b] = longestEdge(nave.rings[0]);
  let ux = b[0] - a[0], uz = b[1] - a[1]; if (ux < 0) { ux = -ux; uz = -uz; } // (pointing east, towards the choir)
  const T = kit.frame({ x: cx, z: cz, angle: Math.atan2(-uz, ux) });
  const cos = Math.cos(Math.atan2(-uz, ux)), sin = Math.sin(Math.atan2(-uz, ux));
  const local = ([x, z]) => { const dx = x - cx, dz = z - cz; return [dx * cos - dz * sin, dx * sin + dz * cos]; };
  const corners = ring.map(local); // the octagon's eight corners, from OSM, in the frame
  if (corners.length !== 8) throw new Error(`Münster: expected an octagon, OSM has ${corners.length} corners`);

  const Y0 = spire.minHeight, YTOP = spire.height, Y1 = YTOP - spire.roofHeight; // 37, 116, 70
  const APEX = YTOP - 1; // ASSUMED: the stone point ends a metre below the top; the finial fills the rest
  const atR = (k, s) => [corners[k][0] * s, corners[k][1] * s]; // corner k, scaled towards the centre
  const faceAngle = (p, q) => Math.atan2(-(q[1] - p[1]), q[0] - p[0]);

  // 3. the octagonal storey: corner piers with pinnacles, and between them tall openings with two mullions and a gable
  for (let k = 0; k < 8; k++) {
    const p = corners[k], q = corners[(k + 1) % 8], len = Math.hypot(q[0] - p[0], q[1] - p[1]), rot = faceAngle(p, q);
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], mIn = [m[0] * 0.9, m[1] * 0.9];
    T.box(1.5, Y1 - Y0, 1.5, p[0], Y0, p[1], STONE, rot); // pier
    T.pyramid(0.9, 6, p[0], Y1, p[1], STONE, 4, rot); // pinnacle
    T.box(len, 3, 0.9, m[0], Y0, m[1], STONE, rot); // sill
    T.box(len, 2.5, 0.9, m[0], Y1 - 2.5, m[1], STONE, rot); // band under the spire
    T.box(len - 1.5, Y1 - Y0 - 5.5, 0.3, mIn[0], Y0 + 3, mIn[1], DARK, rot); // the opening, set back
    for (const s of [1 / 3, 2 / 3]) { const x = p[0] + (q[0] - p[0]) * s, z = p[1] + (q[1] - p[1]) * s; T.box(0.35, Y1 - Y0 - 5.5, 0.35, x, Y0 + 3, z, STONE, rot); }
    // the gable over the opening: two bars rising to a point
    const top = [m[0] * 1.02, Y1 + 4.5, m[1] * 1.02];
    T.beam([p[0], Y1 - 2.5, p[1]], top, 0.45, STONE); T.beam([q[0], Y1 - 2.5, q[1]], top, 0.45, STONE);
  }

  // 4. the spire: eight ribs to the point, rings every few metres, and an X of tracery in every panel
  const R0 = 0.92, BANDS = 10;
  const at = (k, y) => { const s = R0 * (1 - (y - Y1) / (APEX - Y1)); const [x, z] = atR(k % 8, s); return [x, y, z]; };
  for (let k = 0; k < 8; k++) T.beam(at(k, Y1), [0, APEX, 0], 0.75, STONE);
  for (let i = 0; i <= BANDS; i++) {
    const y = Y1 + ((APEX - Y1) * i) / (BANDS + 2); // (the last rings stop short of the point, where the ribs meet)
    const yn = Y1 + ((APEX - Y1) * (i + 1)) / (BANDS + 2);
    for (let k = 0; k < 8; k++) {
      T.beam(at(k, y), at(k + 1, y), 0.4, STONE);
      if (i < BANDS) { T.beam(at(k, y), at(k + 1, yn), 0.22, STONE); T.beam(at(k + 1, y), at(k, yn), 0.22, STONE); }
    }
  }
  // the finial
  T.cylinder(0.5, 0.6, 0, APEX - 0.6, 0, STONE, 8); T.cylinder(0.12, YTOP - APEX, 0, APEX, 0, STONE, 6);

  return { anchor: T.toWorld(0, 0), top: YTOP };
}

function longestEdge(ring) {
  let best = null, L = -1;
  for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length], l = Math.hypot(q[0] - p[0], q[1] - p[1]); if (l > L) { L = l; best = [p, q]; } }
  return best;
}
