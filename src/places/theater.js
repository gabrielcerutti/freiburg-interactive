// The Theater Freiburg (the municipal theatre, «Stadttheater»), on Bertoldstraße at the Platz der Alten Synagoge,
// as it stands today: the curved front of 1910 without the show gable taken down in 1962, the glazed top storey under
// its cone roof, and the stage tower behind.
//
// How it is made:
//   - The outlines are OpenStreetMap's. The theatre's outline (way 113767229) has nine building:parts: the front
//     block (way 948495713, 4 levels), drawn with the six piers OSM maps on its curved front; the top storey (way
//     948495712, 5 levels); the stage tower (way 948495714, 9 levels); and the rear (ways 948495708–11, 948495715
//     and 948495716). Four more outlines stand against the front block and are drawn with it: the low south wing
//     with the entrance of the «Kleines Haus» (way 254048365; the photo of 2018 below shows the lettering «KLEINES
//     HAUS» on it), and the raised terraces beside the corner blocks, to the south (way 254048364) and to the north
//     (ways 113767224 and 113767228, tagged building=government). The photos of 2012 and 2025 below show steps,
//     parapets and planting there and no house, so they are drawn as terraces.
//   - OSM gives levels, no heights in metres, and no source found gives a height. The front is 42 m wide in OSM;
//     measured against that width in the photos, its wall is about 18.5 m high. So a level is taken as 4.6 m, which
//     puts the top storey at 23 m and the tower's ridge at 41.4 m, about where the photos have them. ASSUMED.
//   - Made by hand on the front, after the photos (all on Wikimedia Commons): five round-headed doors, five tall
//     round-headed windows over them with a balcony each, six statues in front of the piers («Theater Freiburg -
//     panoramio», Mister No, 2016; «Freiburg-Theater-02-2009-gje», Gerd Eichmann, 2009), the steps and the two
//     pillars with figures beside them, the relief on the south corner block, and a porch against each flank
//     («Freiburg-Theater-12-2012-gje», Gerd Eichmann, 2012, for the south; the photo of 2025 for the north).
//   - The roofs, after «Theater Freiburg i. Br. (2025)» (JoachimKohler-HB, one of the place's photos) and «Theater
//     (Freiburg im Breisgau) jm61235» (joergens.mi, 2018): a cone of dark red-brown tiles over the round end, a
//     red-brown box between it and the tower, and a hipped roof on the tower over a green band. The city's board
//     on the building («Stadttheater, Infotafel in Freiburg», Andreas Schwarzkopf, 2021) draws the same front: five
//     bays, the cone, and the tower's roof with a ridge across.
//   - The colours are read off those photos: yellow-beige sandstone, darker on the rusticated ground floor.
//
// Where the sources do not agree: the Wikipedias and OSM's architect tag write Heinrich Seeling, the city's board
// «H. Seling». The German Wikipedia says the raids of November 1944 left the theatre «massiv beschädigt», the board
// says «1944 weitgehend zerstört». The card gives both.
//
// What is not the theatre:
//   - OSM's way 980609944 is the upper floors of the cinema building behind the theatre (outline way 18615012,
//     roof:shape flat), but its middle falls inside the theatre's outline, so tools/city.mjs hands it to this place.
//     It is drawn as OSM has it, plain and white (as in «CinemaxX Freiburg - panoramio», Mister No, 2016), so that
//     the cinema keeps its upper floors.
//   - The «Geschäftshaus am Theater» (way 274830901, start_date 1997), the glazed building against the north flank
//     in the photo of 2025, is left to the generic city.
//
// The ground: a place stands on the lowest ground under its parts (src/main.js). The theatre stands on a rise (the
// former bastion), and in the viewer's terrain the foot of the front lies 3.6 m above that lowest point when the
// cinema's part is among the parts, 2.1 m when it is not (measured on public/data/terrain.*). The terrace in front
// of the doors is put 2 m above that, and every wall goes down to the lowest ground.
//
// ASSUMED: every height (see above); the size of the doors, windows and balconies, and the windows of the flanks;
// the columns and the glass of the top storey; the pitch of the cone, the size of the box behind it; the height of
// the tower's eaves, the length of its ridge and the recesses on its faces; the steps, the terrace and the pillars
// beside them; the statues as plain figures; the height and the openings of the south wing; the height and the
// parapets of the side terraces. The rear — the backstage (ways 948495708–11), the part to the north of the stage
// (way 948495715) and the low part to the south-west (way 948495716) — is drawn from OSM's outlines, levels and roof
// shapes alone, plain, the levels counted from the street behind, taken as 4 m lower than the terrace: no photo
// found shows it.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { LEVEL, orientedBox, shrunk } from '../buildings.js';

export const PLACE = {
  key: 'theater',
  name: 'Theater Freiburg',
  localName: 'Freiburg Theatre',
  kind: 'building',
  built: { from: 1905, to: 1910, rebuilt: 1949 }, // de.wikipedia: «ab 1905 … erbaut», opened 8 October 1910, reopened December 1949
  since: 1910, // de.wikipedia: «Das Gebäude wurde am 8. Oktober 1910 … eröffnet»; the city's board: «1905–10 … errichtet»
  // The sources’ words differ («massiv beschädigt», «weitgehend zerstört», «fast völlig zerstört»); the photo settles
  // it: the roof behind the front block is gone. The curved front and its show gable stood.
  war: { state: 'ruin', rebuilt: 1949, source: 'The city’s board on the building: «1944 weitgehend zerstört. Wiederaufbau in vereinfachter Form 1949»; German Wikipedia, «Freiburg im Breisgau»: «1944 fast völlig zerstört», and «Theater Freiburg»: «massiv beschädigt», reopened «Im Dezember 1949»; Willy Pragher’s photo «Zerstörtes Stadttheater» (1944–1948): the roof stripped to its trusses and fallen in' },
  coordinates: [47.995571, 7.845171], // de.wikipedia «Theater Freiburg», the article's coordinates (en.wikipedia: 47.995556, 7.845278, 8 m away)
  osm: 'w113767229',
  sources: [
    'German Wikipedia, «Theater Freiburg»: coordinates (47.995571 N, 7.845171 E); at the corner of Bertoldstraße and Platz der Alten Synagoge; three stages under one roof, among them the Kleines Haus; built from 1905 under mayor Otto Winterer and town architect Rudolf Thoma to plans of the Berlin architect Heinrich Seeling, on the site of the bastion «Dauphin» of Vauban’s fortifications, «im neobarocken Stil»; the sculpture modelled in plaster by Hermann Feuerhahn and carried out by six sculptors («in Gips modelliert und von sechs Freiburger Bildhauern ausgeführt»); opened on 8 October 1910 with Schiller’s «Wallensteins Lager» and the «Festwiese» from Wagner’s «Meistersinger von Nürnberg»; hit on the south side in the air raid of 14 April 1917; «massiv beschädigt» in the raids of November 1944; rebuilt «nur vereinfacht» and reopened in December 1949 with the «Meistersinger»; in 1962 a rehearsal stage built under the roof and the «Jugendstil-Schaugiebel», which had survived, removed; rebuilt and modernised 1996–1998, with an annex on the west side used by the Cinemaxx cinemas',
    'English Wikipedia, «Theater Freiburg»: coordinates (47.995556 N, 7.845278 E); «a Neo-Baroque building with Art Nouveau decorative elements»; the same dates',
    'The city’s information board on the building, in a photo on Wikimedia Commons («Stadttheater, Infotafel in Freiburg», Andreas Schwarzkopf, 2021, CC BY-SA 4.0): «1905–10 von H. Seling auf der ehem. Bastion „Dauphin“ errichtet. 1939 umgestaltet. 1944 weitgehend zerstört. Wiederaufbau in vereinfachter Form 1949. Entfernung des Schaugiebels 1962. 1996–98 umfassende Sanierung.»; its drawing of the front: five bays, the cone roof, the stage tower with a hipped roof',
    'Wikimedia Commons, «Hoffmann theater 01» (postcard by Heinrich Hoffmann, about 1910, public domain) and «Stadttheater freiburg 1960» (Willy Pragher, 1960, CC BY 3.0 de): the show gable over the front, and on the postcard a dome over the stage',
    'Wikimedia Commons, «Theater Freiburg i. Br. (2025)» (JoachimKohler-HB, CC BY-SA 4.0), «Theater (Freiburg im Breisgau) jm61235» (joergens.mi, 2018, CC BY-SA 3.0), «Theater Freiburg - panoramio» (Mister No, 2016, CC BY 3.0), «Freiburg-Theater-02-2009-gje» and «Freiburg-Theater-12-2012-gje» (Gerd Eichmann, CC BY-SA 4.0): the shapes of the front, the flanks, the roofs and the tower, the colours, the lettering «KLEINES HAUS» on the south wing',
    'Wikimedia Commons, «Zerstörtes Stadttheater Freiburg» (Willy Pragher, dated there 1944 to 1948, Staatsarchiv Freiburg W 134 Nr. 017621, CC BY 3.0 de): the front and one side — the roof behind the front block stripped to its trusses and fallen in, a breach in the side wall, rubble at its foot; the curved front with its show gable standing',
    'German Wikipedia, «Freiburg im Breisgau»: the theatre «wurde 1944 fast völlig zerstört und nach dem Zweiten Weltkrieg wieder aufgebaut»; «Operation Tigerfish» (the air raid of 27 November 1944): the Stadttheater in its list of the buildings that «fielen dem Angriff zum Opfer»; the city’s damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): most of the footprint is black',
    'OpenStreetMap, way 113767229 (name, «architect: Heinrich Seeling, Berlin») and its building:parts, ways 948495708–948495716: footprints, the six piers of the curved front, levels (4 for the front block, 5 for the top storey, 9 for the stage tower) and roof shapes; way 254048365: the footprint of the south wing; ways 254048364, 113767224 and 113767228: the footprints of the terraces beside the front block; way 980609944 (upper floors of the cinema next door) and way 18615012 (its outline, roof:shape flat)',
  ],
  assumptions: [
    'every height: OpenStreetMap gives levels only, taken as 4.6 m each because that makes the front wall about 18.5 m, which is what the photos give against the 42 m width of the front',
    'the height of the stage tower’s eaves (35.8 m above the terrace), the length of its ridge and its windows',
    'the pitch of the cone roof and the size of the red-brown box between it and the tower',
    'the size of the doors, windows and balconies of the front; the number, size and place of the windows of the flanks',
    'the columns and the glass of the top storey',
    'the terrace, the steps and the two pillars beside them; the statues, drawn as plain figures',
    'the height of the south wing (6 m above the terrace) and its openings',
    'the terraces beside the corner blocks: that they are terraces level with the front one (the photos show steps, parapets and planting there, OpenStreetMap maps them as buildings), and their parapets',
    'the whole rear (the backstage, the part north of the stage, the low part to the south-west): OpenStreetMap’s outlines, levels and roof shapes, the levels counted from a street taken as 4 m lower than the terrace; the height of its two roofs; its colours and windows',
    'the cinema’s upper floors behind the theatre are OpenStreetMap’s part, lowered to sit on the two storeys it maps under them',
  ],
  card: {
    title: 'Theater Freiburg',
    years: '1905 – 1910 · rebuilt 1949',
    text: [
      'The municipal theatre was built from 1905 to plans by the Berlin architect Heinrich Seeling, on the site of the «Dauphin» bastion of Vauban’s fortifications. It opened on 8 October 1910 with Schiller’s «Wallensteins Lager» and the «Festwiese» from Wagner’s «Meistersinger».',
      'The building was neo-Baroque with Art Nouveau ornament. Hermann Feuerhahn modelled its sculpture in plaster and six sculptors carried it out. A curved show gable stood over the front; a postcard of about 1910 shows a dome over the stage.',
      'An air raid hit the south side on 14 April 1917. The raids of November 1944 left the theatre «massiv beschädigt», says the German Wikipedia; the city’s board on the building says «weitgehend zerstört». A photograph by Willy Pragher, taken between 1944 and 1948, shows the roof behind the front block stripped to its trusses and fallen in, and a breach in the side wall; the curved front still stands. It was rebuilt in a simpler form and reopened in December 1949 with the «Meistersinger».',
      'In 1962 a rehearsal stage was built under the roof and the show gable, which had survived the war, was taken down. From 1996 to 1998 the house was renovated, and an annex with cinemas was added on the west side.',
      'The model shows the theatre as it stands today. The outlines and the number of storeys are OpenStreetMap’s; no source gives a height, so every height is a guess read off photographs (about 18 metres to the main cornice, about 41 to the top of the stage tower). The windows, the statues, the steps and the whole rear of the building are guesses too.',
    ],
  },
};

const MAIN = 'w948495713', ATTIC = 'w948495712', TOWER = 'w948495714', WING = 'w254048365', CINEMA = 'w980609944';
const BACK = ['w948495709', 'w948495710', 'w948495711', 'w948495716'], BACK_ROOF = 'w948495708', NORTH = 'w948495715';
const TERRACES = ['w254048364', 'w113767224', 'w113767228'];

const STOREY = 4.6;  // ASSUMED: metres per OSM level (see the top of the file)
const BACK_DROP = 4; // ASSUMED: how far the street behind lies under the terrace

const STONE = '#c8ab7c', STONE_DARK = '#b3966a', STONE_LIGHT = '#d8c097', FIGURE = '#b7ab95', RELIEF = '#b09468', RECESS = '#6f5d43';
const ROOF = '#6e4439', LINK = '#8a4338', COPPER = '#7fa392', FLAT = '#9c968a', PAVING = '#b9ad98', STEP = '#c6bba7';
const GLASS = '#56626a', FRAME = '#e6e1d3', PLASTER = '#c5c1b8', CINEMA_WHITE = '#e7e4dc', DARK = 'OPENING';

export function build(kit, parts) {
  const byId = (id) => parts.find((b) => b.id === id);
  const main = byId(MAIN), attic = byId(ATTIC), tower = byId(TOWER), wing = byId(WING), cinema = byId(CINEMA);
  if (!main || !attic || !tower) throw new Error('Theater: OSM parts missing from city.json');

  // the frame: origin in the middle of the stage tower, x along the building towards the front (east), z to the south
  const tb = orientedBox(tower.rings[0]), ab = orientedBox(attic.rings[0]), O = tb.c;
  const fwd = (ab.c[0] - O[0]) * ab.u[0] + (ab.c[1] - O[1]) * ab.u[1] > 0 ? 1 : -1;
  const u = [ab.u[0] * fwd, ab.u[1] * fwd], v = [-u[1], u[0]], angle = Math.atan2(-u[1], u[0]);
  const S = kit.frame({ x: O[0], z: O[1], angle }), P = kit.frame({ x: O[0], z: O[1], angle, kind: KIND.PLAIN });
  const loc = ([x, z]) => [(x - O[0]) * u[0] + (z - O[1]) * u[1], (x - O[0]) * v[0] + (z - O[1]) * v[1]];
  const local = (b) => b.rings[0].map(loc), grown = (ring, d) => shrunk([ring], -d)[0];
  const mainL = local(main), atticL = local(attic), towerL = local(tower);

  // heights: G is the terrace in front of the doors, above the lowest ground under the parts (see the top of the file)
  const G = cinema ? 5.6 : 4.1, y = (h) => G + h;
  const MAIN_H = main.levels * STOREY, ATTIC_H = attic.levels * STOREY, RIDGE = tower.levels * STOREY, EAVES = RIDGE - 5.6;

  // roofs: tiles, in the frame's metres
  const base = new THREE.Matrix4().makeTranslation(O[0], 0, O[1]).multiply(new THREE.Matrix4().makeRotationY(angle));
  const TILES = [1e4, -1e4, 0.4, KIND.TILES], tile = new THREE.Color(ROOF); // (no ridge or eaves shading: the shader measures those from the ground)
  const world = (p) => { const w = new THREE.Vector3(p[0], p[1], p[2]).applyMatrix4(base); return [w.x, w.y, w.z]; };
  const slope = (...pts) => { for (let i = 1; i < pts.length - 1; i++) kit.mesher.tri(world(pts[0]), world(pts[i]), world(pts[i + 1]), tile, [0, 1, 0], TILES); };
  /** a flat cover over an outline, at height h */
  const cover = (ring, h, colour) => P.put(new THREE.ShapeGeometry(new THREE.Shape(ring.map(([x, z]) => new THREE.Vector2(x, -z)))).rotateX(-Math.PI / 2).translate(0, h, 0), colour);
  /** a dark opening w × h on a wall, its foot centred on x, h0, z, looking `out` (0 = +x, π/2 = +z); round-headed if `arch` */
  const opening = (w, h, x, h0, z, out, arch = false, colour = DARK) => {
    P.panel(w, h, x, h0, z, -out, colour);
    if (arch) P.put(new THREE.CircleGeometry(w / 2, 10, 0, Math.PI).rotateY(Math.PI / 2 - out).translate(x, h0 + h, z), colour);
  };
  /** where an outline's north (side −1) or south (+1) face is, at x */
  const faceAt = (ring, x, side) => {
    let best = null;
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length]; if (p[0] === q[0] || (p[0] - x) * (q[0] - x) > 0) continue;
      const z = p[1] + ((q[1] - p[1]) * (x - p[0])) / (q[0] - p[0]); if (best == null || side * z > side * best) best = z;
    }
    return best;
  };
  const span = (pts, k) => { const a = pts.map((p) => p[k]); return [Math.min(...a), Math.max(...a)]; };

  // the round end: its middle and radius from the top storey's outline (a half circle, within 0.4 m)
  const [az0, az1] = span(atticL.filter((p) => p[0] > 15), 1), cz = (az0 + az1) / 2, rIn = (az1 - az0) / 2, cx = span(atticL, 0)[1] - rIn;
  const xf = Math.max(...mainL.filter((p) => Math.abs(p[1] - cz) > 14).map((p) => p[0])); // the face of the corner blocks
  const BASE_OUT = 0.2;

  // the curved front as OSM draws it: five straight walls between six piers (the curve is flatter in the middle than a
  // circle). The walls are the long straight runs of the outline in front of the corner blocks.
  const bays = [];
  {
    const n = mainL.length, start = mainL.indexOf(mainL.reduce((a, b) => (b[0] < a[0] ? b : a))), runs = [];
    let run = null;
    for (let k = 0; k < n; k++) {
      const p = mainL[(start + k) % n], q = mainL[(start + k + 1) % n], dir = Math.atan2(q[1] - p[1], q[0] - p[0]);
      const front = p[0] > xf + 0.2 && q[0] > xf + 0.2, same = run && Math.abs(Math.atan2(Math.sin(dir - run.dir), Math.cos(dir - run.dir))) < 0.2;
      if (front && same) run.b = q; else { if (run) runs.push(run); run = front ? { a: p, b: q, dir } : null; }
    }
    if (run) runs.push(run);
    for (let { a, b } of runs) {
      if (a[1] > b[1]) [a, b] = [b, a];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]); if (len < 2.6) continue;
      const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const s = t[1] * (mid[0] - cx) - t[0] * (mid[1] - cz) > 0 ? 1 : -1, nrm = [s * t[1], -s * t[0]]; // (pointing out of the building)
      bays.push({ a, b, len, t, nrm, out: Math.atan2(nrm[1], nrm[0]), turn: Math.atan2(-t[1], t[0]), at: (d, along = 0) => [mid[0] + nrm[0] * d + t[0] * along, mid[1] + nrm[1] * d + t[1] * along] });
    }
    bays.sort((p, q) => p.a[1] - q.a[1]);
    if (bays.length !== 5) throw new Error(`Theater: expected five walls on the curved front of the OSM outline, found ${bays.length}`);
  }

  // 1. the front block: the wall, the rusticated ground floor, the cornice, the flat roof around the top storey
  S.prism(mainL, 0, y(MAIN_H), STONE);
  S.prism(grown(mainL, BASE_OUT), 0, y(6.6), STONE_DARK);
  S.prism(grown(mainL, 0.4), y(MAIN_H - 0.9), y(MAIN_H), STONE_LIGHT);
  cover(mainL, y(MAIN_H) + 0.05, FLAT);

  // 2. the curved front: a door, a tall window and a balcony in each bay
  for (const bay of bays) {
    const w = Math.min(3.3, bay.len - 0.1);
    const [dx, dz] = bay.at(BASE_OUT + 0.1); opening(w - 0.4, 3.45, dx, y(0.05), dz, bay.out, true);         // the door
    const [wx, wz] = bay.at(0.1); opening(w, 5.9, wx, y(8), wz, bay.out, true);                              // the window
    for (const along of [-0.55, 0.55]) { const [x, z] = bay.at(0.16, along); P.box(0.14, 7.2, 0.1, x, y(8), z, FRAME, bay.turn); }
    for (const h of [10.4, 13.8]) { const [x, z] = bay.at(0.16); P.box(w, 0.14, 0.1, x, y(h), z, FRAME, bay.turn); }
    const [bx, bz] = bay.at(0.7); S.box(bay.len + 0.3, 0.35, 1.4, bx, y(7), bz, STONE_LIGHT, bay.turn);      // the balcony
    const [rx, rz] = bay.at(1.3); S.box(bay.len + 0.3, 1, 0.22, rx, y(7.35), rz, STONE_LIGHT, bay.turn);
  }
  // a statue in front of each of the six piers: the four between the bays and the two at the ends
  const piers = [{ c: [bays[0].a[0] - bays[0].t[0] * 0.8, bays[0].a[1] - bays[0].t[1] * 0.8], nrm: bays[0].nrm }];
  for (let i = 0; i < 4; i++) {
    const p = bays[i], q = bays[i + 1], m = [p.nrm[0] + q.nrm[0], p.nrm[1] + q.nrm[1]], l = Math.hypot(m[0], m[1]);
    piers.push({ c: [(p.b[0] + q.a[0]) / 2, (p.b[1] + q.a[1]) / 2], nrm: [m[0] / l, m[1] / l] });
  }
  piers.push({ c: [bays[4].b[0] + bays[4].t[0] * 0.8, bays[4].b[1] + bays[4].t[1] * 0.8], nrm: bays[4].nrm });
  for (const { c, nrm } of piers) {
    const x = c[0] + nrm[0] * 1.45, z = c[1] + nrm[1] * 1.45;
    S.box(1, 0.45, 0.9, x, y(7.75), z, STONE_LIGHT, Math.atan2(nrm[0], nrm[1]));
    S.cylinder(0.42, 2.3, x, y(8.2), z, FIGURE, 6, 0.28);
    S.cylinder(0.2, 0.42, x, y(10.5), z, FIGURE, 6);
  }
  // the corner blocks beside the curve: a ledge and a small window each, and the relief on the south one
  for (const side of [-1, 1]) {
    const zc = cz + side * 16;
    S.box(0.5, 0.35, 4.4, xf + 0.25, y(7), zc, STONE_LIGHT);
    opening(1.3, 1.5, xf + BASE_OUT + 0.08, y(1.6), zc, 0);
    if (side > 0) P.panel(4.4, 1.9, xf + 0.08, y(12.4), zc, 0, RELIEF);
  }

  // 3. the terrace, the steps down to the square and the two pillars with figures beside them
  const xt = span(mainL, 0)[1] + 5.6;
  P.box(xt - 45, G, 45, (xt + 45) / 2, 0, cz, PAVING);
  for (let k = 1; G - 0.3 * k > 0.2; k++) P.box(0.8, G - 0.3 * k, 25, xt + 0.8 * (k - 0.5), 0, cz, STEP); // (they go on under the ground)
  for (const side of [-1, 1]) {
    const px = xt + 1.3, pz = cz + side * 13.8;
    P.box(2.6, G, 2.6, px, 0, pz, PAVING);
    S.cylinder(1, 4.4, px, G, pz, FIGURE, 4, 0.8, Math.PI / 4);
    S.box(2, 0.45, 2, px, y(4.4), pz, FIGURE);
    S.cylinder(0.75, 1.3, px, y(4.85), pz, FIGURE, 6, 0.45);
  }

  // the raised terraces beside the front block (outlines of their own in OSM): level with the terrace, a step lower so
  // that the two do not flicker, with a parapet on their outer sides
  for (const b of parts.filter((p) => TERRACES.includes(p.id))) {
    const ring = local(b), [x0, x1] = span(ring, 0), [z0, z1] = span(ring, 1), side = (z0 + z1) / 2 > cz ? 1 : -1;
    S.prism(ring, 0, G - 0.15, STONE_DARK); cover(ring, G - 0.12, PAVING);
    if (x1 - x0 > 6) {
      S.box(x1 - x0, 0.9, 0.3, (x0 + x1) / 2, G - 0.15, side > 0 ? z1 - 0.15 : z0 + 0.15, STONE_LIGHT);
      S.box(0.3, 0.9, (z1 - z0) * 0.45, x1 - 0.15, G - 0.15, side > 0 ? z1 - (z1 - z0) * 0.225 : z0 + (z1 - z0) * 0.225, STONE_LIGHT);
    }
  }

  // 4. the flanks: three rows of windows, a porch against each corner block, tall round-headed windows on the side wings
  for (const side of [-1, 1]) {
    const out = (side * Math.PI) / 2, face = (x) => faceAt(mainL, x, side);
    const lowTo = side > 0 && wing ? span(local(wing), 0)[1] + 1 : -Infinity; // (the south wing stands in front of the ground floor)
    for (const x of [20.5, 24.7, 28.9, 33.1, 37.6, 41.9, 46.5, 49.85, 53.2]) {
      const z = face(x); if (z == null) continue;
      if (x > lowTo && (x < 35 || x > 45)) opening(1.5, 2.6, x, y(1.2), z + side * (BASE_OUT + 0.08), out);
      opening(1.5, 4.6, x, y(7.2), z + side * 0.08, out);
      opening(1.5, 2, x, y(13.8), z + side * 0.08, out);
    }
    const zp = face(39.8);
    if (zp != null) { // the porch: three openings to the side, one at each end, a balustrade on top
      S.box(8.6, y(5), 3.4, 39.8, 0, zp + side * 1.7, STONE_DARK);
      for (const dx of [-2.8, 0, 2.8]) opening(1.7, 3.6, 39.8 + dx, y(0.5), zp + side * 3.48, out);
      for (const end of [-1, 1]) opening(1.7, 3.6, 39.8 + end * 4.38, y(0.5), zp + side * 1.7, end > 0 ? 0 : Math.PI);
      S.box(8.8, 0.9, 0.25, 39.8, y(5), zp + side * 3.3, STONE_LIGHT);
    }
    const mid = side < 0 ? 3.85 : 2.8; // (the side wing beside the stage: its free face)
    for (const dx of [-4.6, 0, 4.6]) { const z = face(mid + dx); if (z != null) opening(2, 5.5, mid + dx, y(6.8), z + side * 0.08, out, true); }
  }

  // 5. the top storey: glass between pale posts, a pale band on top, the cone over the round end
  const [tx0, tx1] = span(towerL, 0), [tz0, tz1] = span(towerL, 1), txm = (tx0 + tx1) / 2, tzm = (tz0 + tz1) / 2;
  P.prism(atticL, y(MAIN_H), y(ATTIC_H - 0.5), GLASS);
  P.prism(grown(atticL, 1), y(ATTIC_H - 0.5), y(ATTIC_H), FRAME);
  cover(grown(atticL, 0.7), y(ATTIC_H) + 0.05, FLAT);
  const posts = grown(atticL, 0.12);
  posts.forEach((p, i) => {
    const q = posts[(i + 1) % posts.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.max(1, Math.round(len / 3.3));
    for (let k = 0; k < n; k++) {
      const x = p[0] + ((q[0] - p[0]) * k) / n, z = p[1] + ((q[1] - p[1]) * k) / n;
      if (x > tx0 - 0.6 && x < tx1 + 0.6 && z > tz0 - 0.6 && z < tz1 + 0.6) continue; // (against the tower)
      P.box(0.5, ATTIC_H - 0.5 - MAIN_H, 0.5, x, y(MAIN_H), z, FRAME, Math.atan2(-(q[1] - p[1]), q[0] - p[0]));
    }
  });
  const coneH = 9.4, coneR = rIn + 1;
  kit.mesher.geometry(new THREE.ConeGeometry(coneR, coneH, 40, 1, true).translate(cx, y(ATTIC_H) + coneH / 2, cz), tile, base, TILES);
  P.box(cx - 13 - tx1, 4.4, 14.5, (cx - 13 + tx1) / 2, y(ATTIC_H), cz, LINK); // the box between the cone and the tower

  // 6. the stage tower: a green band under a hipped roof with its ridge across the building
  S.prism(towerL, 0, y(EAVES - 0.9), STONE);
  P.box(tx1 - tx0 + 1.6, 0.9, tz1 - tz0 + 1.6, txm, y(EAVES - 0.9), tzm, COPPER);
  const e = y(EAVES), r = y(RIDGE), A = [tx0 - 0.8, e, tz0 - 0.8], B = [tx1 + 0.8, e, tz0 - 0.8], C = [tx1 + 0.8, e, tz1 + 0.8], D = [tx0 - 0.8, e, tz1 + 0.8];
  const R0 = [txm, r, tzm - 5.5], R1 = [txm, r, tzm + 5.5];
  slope(A, D, R1, R0); slope(B, C, R1, R0); slope(A, B, R0); slope(D, C, R1);
  for (const k of [-2, -1, 0, 1, 2]) { // tall narrow recesses under the band, on every face
    const h0 = y(EAVES - 8.6), slit = (x, z, out) => opening(0.8, 6.8, x, h0, z, out, false, RECESS);
    slit(tx1 + 0.08, tzm + k * 3.6, 0); slit(tx0 - 0.08, tzm + k * 3.6, Math.PI); slit(txm + k * 3.4, tz1 + 0.08, Math.PI / 2); slit(txm + k * 3.4, tz0 - 0.08, -Math.PI / 2);
  }

  // 7. the south wing with the entrance of the Kleines Haus: a low block with a flat roof
  if (wing) {
    const wl = local(wing), [wx0, wx1] = span(wl, 0), top = y(6);
    S.prism(wl, 0, top, STONE); cover(wl, top + 0.05, FLAT);
    for (let i = 0; i < 5; i++) { const x = wx0 + ((wx1 - wx0 - 4) * (i + 0.5)) / 5, z = faceAt(wl, x, 1); if (z != null) opening(2.2, 3, x, y(1), z + 0.08, Math.PI / 2); }
  }

  // 8. the rear, from OSM's outlines, levels and roof shapes (the levels counted from the street behind): the backstage
  // and the gabled roof OSM maps over it from its fifth level up, the part north of the stage (hipped, «roof:levels 0»:
  // a low roof) and the low part to the south-west
  const rearTop = (levels) => y(levels * STOREY - BACK_DROP);
  const plain = (b, extra) => ({ ...b, levels: null, roofLevels: null, height: rearTop(b.levels), roofShape: 'flat', colour: PLASTER, roofColour: FLAT, ...extra });
  kit.osm(parts.filter((b) => BACK.includes(b.id)).map((b) => plain(b)));
  const roofPart = byId(BACK_ROOF), north = byId(NORTH);
  if (roofPart) kit.osm([plain(roofPart, { minHeight: rearTop(roofPart.levels - 1) - 0.4, roofShape: 'gabled', roofHeight: STOREY - 0.6, roofColour: 'grey' })]);
  if (north) kit.osm([plain(north, { height: rearTop(north.levels) + 1.5, roofShape: 'hipped', roofHeight: 1.5, roofColour: 'grey' })]);

  // 9. the upper floors of the cinema next door (not the theatre's: see the top of the file), on the two storeys OSM maps under them
  if (cinema) kit.osm([{ ...cinema, minLevel: null, minHeight: 2 * LEVEL - 0.2, roofShape: 'flat', colour: CINEMA_WHITE, roofColour: FLAT }]);

  return { anchor: S.toWorld(cx - 14, cz), top: y(RIDGE) };
}
