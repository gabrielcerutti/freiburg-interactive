// The Wasserschlössle: the drinking-water reservoir of the city's waterworks on the slope of the Sternwald, above
// the Wiehre, built in 1895–1896 behind a front that looks like a small castle with three round towers.
//
// Where it is: OpenStreetMap has it as one outline (relation 18949359, «Wasserschlössle», man_made=reservoir_covered,
// start_date=1896, capacity=3800): the front building, about 15.3 m wide and 7.5 m deep, with the round of the middle
// tower standing 0.7 m out of its front, and behind it the covered reservoir, about 45 by 22 m, which reaches 26 m
// past the front building on its south-west side and 4 m on the other. The front looks north-west, to the town. The
// German Wikipedia's coordinates (47.983527 N, 7.860139 E) fall inside the outline, at the middle tower. All of it is
// inside the map (its east corner is 113 m short of the map's east edge).
//
// How it is made (x along the front, towards the north-east; z into the hill; read off OSM's outline):
//   - The front building: a block on OSM's rectangle. On it, by hand, what the photos on Wikimedia Commons show
//     («Wasserschlösschen (Freiburg) 8971» and «… 8981», joergens.mi, 2011, from the front and from the side): pale
//     sandstone ashlar above, grey rusticated blocks below and as piers and corners; a middle bay with a large round
//     arch — in it the city's arms, the words «Wasserwerk Freiburg», «1895» and «1896», and a niche with a fountain —
//     and on each side a round-headed iron door with a round window above it; a parapet with battlements.
//   - The three towers: round, on corbels, the middle one tall (OSM maps its round: 1.5 m in radius) and one small
//     turret over each side bay, each with a wider crown of battlements and slit windows.
//   - The reservoir: OSM's outline, as a level lawn at the height of the front building's roof — «Wasserschlössle
//     oben» (Uwe Barghaan, 2009), taken from the hill side, shows the towers standing on that lawn, a low
//     battlemented wall between them, a door in the back of the middle tower, and red sandstone vents on the grass
//     (a row of five on one side, one more on the other).
//   - Its banks: the city's plans of 1944 and 1955 (public/plan/) draw the reservoir as an earthwork with hachured
//     banks beside the front building, and the photo of 2011 shows a steep planted slope beside the front. So the lawn
//     ends in grass banks that run down into the viewer's ground on every side.
//
// The ground: the viewer lifts a place to the lowest ground under its OSM outline, which is here the foot of the
// middle tower (0 in this file is 0.3 m below it). The viewer's terrain is coarse and knows neither the levelled
// forecourt nor the cut into the hill: under the outline it climbs 7 m, evenly, from the front to the back. So the
// front building stands with its foot on the ground at its front (0.5 m here, on a plinth that goes down below it),
// its back is in the hill, and the banks of the lawn are 9 m high beside the front and 2 m high at the back. The
// forecourt is not drawn.
//
// The trees: the viewer scatters trees over OSM's woods (src/trees.js). OSM cuts a clearing out of the Sternwald
// around the reservoir (a meadow), so no tree stands inside the outline; the nearest one stands 3.5 m east of the
// reservoir's east side (world 549.1, 1343.7), in the bank drawn there.
//
// The war: nothing is said. The pages read say nothing about the raid of 27 November 1944 at the reservoir, which lies
// 1.4 km south-east of the Münster. The city's damage map (the viewer's «Nov 1944» plan) reaches the spot and draws
// the earthwork without a black or blue mark; that is not taken for a statement, so there is no `war` field.
//
// ASSUMED: every height (no source gives one: they are read off the photo of the front, scaled by the 15.3 m of OSM's
// outline — the roof 9 m above the foot, the battlements to 10.2 m, the side turrets to 13.6 m, the middle tower to
// 18.4 m); the size of the turrets (OSM maps only the middle tower) and where exactly the side ones stand; the size and
// place of every door, window, slit and block of grey stone; that the front bay stands 0.35 m forward; the sides of
// the front building, drawn like its front; that the lawn is level over the whole of OSM's outline; the banks, their
// slope and how far down they go; the number and the places of the vents (ten are drawn, in two rows); the colours.
// The fences on the terrace, the steps at the doors and the fountain's lion head are not drawn.

import * as THREE from 'three';
import { KIND } from '../kit.js';

export const PLACE = {
  key: 'wasserschloessle',
  name: 'Wasserschlössle',
  localName: 'Reservoir of the city waterworks in the Sternwald',
  kind: 'building',
  built: { from: 1895, to: 1896 }, // de.wikipedia: «Die Anlage entstand zwischen 1895 und 1896»; on the front itself: «1895», «1896»
  since: 1896, // (the year it was finished: same sources, and OSM's start_date=1896 — not there at the stop of 1875, standing from 1903 on)
  // (no `war`: no source read says what the raid of 27 November 1944 did here; see the top of the file)
  coordinates: [47.983527, 7.860139], // de.wikipedia «Freiburger Wasserschlössle», the article's coordinates: inside OSM's outline, at the middle tower
  osm: 'r18949359',
  sources: [
    'German Wikipedia, «Freiburger Wasserschlössle»: coordinates (47.983527 N, 7.860139 E); «liegt im Sternwald oberhalb des Stadtteils Wiehre. Es ist ein Wasserhochbehälter mit markanter Frontseite im Stil eines Schlosses», «teilweise in den Berghang eingebaut», run by the city’s water supplier (bnNETZE); «Die Anlage entstand zwischen 1895 und 1896»; «Die schlossartige Fassade aus Sandsteinquadern und Betonwerkstein sollte die Wertschätzung gegenüber dem Trinkwasser zum Ausdruck bringen. Vorbild für die Gestaltung war dabei das Freiburger Stadtsiegel aus dem Jahr 1245»; «Gebaut wurde das Wasserschlössle durch das Freiburger Unternehmen Brenzinger & Cie.»; the water comes by its own fall from the waterworks at Ebnet (1872 to 1876) to the reservoir at 314 m above sea level and goes on to the houses without pumps; the chamber «hat ein Fassungsvermögen von 3800 m³, ist 45 m lang, 33 m tief und 6 m hoch»; «Die östliche Stadt wurde über das Wasserschlössle mehr als 100 Jahre lang zentral mit Wasser versorgt»; a second reservoir built in 2001, 600 m away and 42 m higher, holding 6000 m³; the infobox: «Betriebszustand: In Betrieb»',
    'German Wikipedia, «Brenzinger & Cie.»: among the firm’s works, «Freiburger Wasserschlössle im Sternwald (1895/1896)»',
    'Hans Sigmund, «Wasserschlössle im Sternwald – Blick auf die Stadt», Badische Zeitung, 30 October 2006, as reproduced on freiburg-schwarzwald.de (page «Wasserschlössle Sternwald Freiburg-Wiehre»): the city «begann 1895 mit dem Bau eines weiteren Hochbehälters am Sternwaldeck (Glümerhöhe)»; «Diese neue Wasserkammer ist 45 Meter lang, 33 Meter tief sowie 6 Meter hoch und fasst 3600 Kubikmeter. Noch heute wird von hier der gesamte Freiburger Osten mit Trinkwasser versorgt. Vor den Speicher baute man nach den Plänen des Hochbauamtes eine mittelalterliche Burgfassade aus hellen Sandsteinquadern. Sie ist mit ihren drei Türmen, den krönenden Zinnen und Torbögen einem alten Stadtsiegel aus dem Jahre 1245 nachempfunden»; the fountain with a bronze lion’s head in the middle niche; a small museum inside; the feast of 9 July 1898 «auf die Plattform des Wasserwerkes», when beer ran from the fountain; the trees that grew over the view after the Second World War, cleared for the centenary',
    'Badische Zeitung, 28 July 2006, on the same page: «Im Jahr 1996 wurde das Wasserschlössle-Fest erstmals veranstaltet»; «Die große Wasserkammer im Innern ist 33 Meter tief, sechs Meter hoch und 46 Meter lang und fasst insgesamt 3800 Kubikmeter Wasser»',
    'OpenStreetMap, relation 18949359 («Wasserschlössle», alt_name=Wasserschloss, building=yes, man_made=reservoir_covered, content=drinking_water, capacity=3800, start_date=1896): the outline of the front building, of the middle tower’s round and of the reservoir behind. No heights. The landuse around it: a meadow cut out of the wood',
    'Wikimedia Commons, «Wasserschlösschen (Freiburg) 8971» (joergens.mi, 2011, CC BY-SA 3.0): the front, square on — the three towers on their corbels, the battlements, the arch with the arms, «Wasserwerk Freiburg», «1895», «1896», the fountain niche, the two doors and the two round windows, the pale and the grey stone. Every height is measured on it',
    'Wikimedia Commons, «Wasserschlösschen (Freiburg) 8981» (joergens.mi, 2011, CC BY-SA 3.0): the front from the side — the depth of the front building, the battlements along its side, the planted slope beside it',
    'Wikimedia Commons, «Wasserschlössle oben» (Uwe Barghaan, 2009, CC BY 3.0): from the hill side — the lawn over the reservoir at the foot of the towers, the low battlemented wall, the door in the middle tower, the red sandstone vents',
    'City of Freiburg, historical plans (the viewer’s plans): 1903, the outline with the words «Hoch-Reservoir»; 1920, «Wasserschlösschen»; 1944 and 1955, the reservoir as an earthwork with hachured banks; the damage map of the air raid of 27 November 1944 reaches the spot and shows no black or blue mark there',
  ],
  assumptions: [
    'every height: the roof of the front building (9 metres above its foot), the battlements, the side turrets (13.6 metres) and the middle tower (18.4 metres) — read off a photograph of the front, scaled by the 15.3 metres of the OpenStreetMap outline',
    'the size of the side turrets and where exactly they stand (OpenStreetMap maps only the round of the middle tower)',
    'the size and place of every door, window and slit, of the arch, and of the bands, piers and corners of grey stone',
    'the sides of the front building, drawn like its front',
    'the lawn over the reservoir: level, at the height of the front building’s roof, over the whole OpenStreetMap outline',
    'the grass banks around it, their slope and how far down they go; the level forecourt in front is not drawn',
    'the ground: the viewer’s terrain is coarse on the hill and climbs evenly under the building, so the front building stands on a plinth and its back is in the slope',
    'the vents on the lawn: ten are drawn, in two rows; a photo shows a row of five and one more',
    'the colours; the fences on the terrace, the steps at the doors and the lion’s head of the fountain are left out',
  ],
  card: {
    title: 'Wasserschlössle',
    years: '1895 – 1896',
    text: [
      'The «little water castle» is a drinking-water reservoir. The city’s waterworks built it in 1895 and 1896 into the slope of the Sternwald, above the Wiehre. The front carries the words «Wasserwerk Freiburg» and both years.',
      'The water chamber lies behind the front, partly in the hill. Water from the waterworks at Ebnet, which lies higher, runs to it by its own fall, at 314 metres above sea level, and on to the houses without pumps. The sources agree that the chamber is 33 metres deep and 6 metres high. They give its length as 45 or 46 metres, and its content as 3,800 or 3,600 cubic metres.',
      'In front of the chamber stands a castle front of pale sandstone, with three towers, battlements and round arches. It follows the city’s seal of 1245, the one on the old manhole covers of the town. A newspaper article of 2006 says the city’s building office drew the plans; the Freiburg firm Brenzinger & Cie. built it. A fountain stands in the middle niche. On 9 July 1898 the city held a feast on the terrace for the university, and beer ran from it.',
      'It supplied the east of the town for more than a hundred years. In 2001 a second reservoir was built 600 metres away and 42 metres higher, because the pressure in the Wiehre was no longer enough. The German Wikipedia lists the Wasserschlössle as still in operation, run by the city’s water supplier. A feast has been held here every summer since the centenary in 1996.',
      'The outline is OpenStreetMap’s. No source gives a height: the towers, the front and its openings are read off photographs. The lawn over the reservoir, its grass banks and the vents on it are guesses, and the level forecourt is not drawn, because the viewer’s ground is coarse on this slope.',
    ],
  },
};

// OSM's outline (https://www.openstreetmap.org/relation/18949359)
const OUTLINE = 'r18949359';
// the frame of the front building: its origin at the west corner of the front, x along the front (north-east), z into
// the hill (south-east); read off OSM's outline, whose front runs 32° north of east
const ORIGIN = [520.5, 1341.44], ANGLE = (32.14 * Math.PI) / 180;
const WIDTH = 15.34, DEPTH = 7.5;                 // the front building (OSM)
const TOWER = { x: 7.76, z: 0.82, r: 1.5 };       // the middle tower: the round OSM maps on the front
// heights in metres — ALL ASSUMED (see the top of the file); 0 is 0.3 m under the lowest ground under OSM's outline
const FOOT = 0.5, PLINTH = -1.5;                  // the foot of the front, and how far down its plinth goes
const ROOF = FOOT + 9.05;                         // the roof of the front building, and the lawn over the reservoir
const LOWER = 5.4, PIER = 8.2;                    // the grey lower storey and the grey piers, above the foot
const BAY = { x0: 3.82, x1: 11.52, out: 0.35 };   // the middle bay
const SIDE = 2.0, TURRET = { z: 0.2, r: 0.9 };    // the side doors, windows and turrets: this far in from each end
const BANK = { slope: 1.1, foot: -1.5 };          // the grass banks: how steep, and down to where (below the viewer's ground)
const BUFF = '#d9cba9', PALE = '#e6dcc2', GREY = '#b4b2ab', GRASS = '#8fae5e', BANKS = '#98b765', RED = '#a25f4f', DARK = 'OPENING';

export function build(kit, parts) {
  const outline = parts.find((b) => b.id === OUTLINE);
  if (!outline) throw new Error('Wasserschlössle: OSM outline missing from city.json');

  const S = kit.frame({ x: ORIGIN[0], z: ORIGIN[1], angle: ANGLE, kind: KIND.STONE }); // stone: courses and joints
  const P = kit.frame({ x: ORIGIN[0], z: ORIGIN[1], angle: ANGLE, kind: KIND.PLAIN });  // plain: grass, iron, openings
  const cos = Math.cos(ANGLE), sin = Math.sin(ANGLE);
  const local = ([wx, wz]) => [(wx - ORIGIN[0]) * cos - (wz - ORIGIN[1]) * sin, (wx - ORIGIN[0]) * sin + (wz - ORIGIN[1]) * cos];
  /** a disc standing upright in the front (its axis along z): round windows */
  const disc = (F, r, x, y, z, colour, depth = 0.1) => F.put(new THREE.CylinderGeometry(r, r, depth, 18).rotateX(Math.PI / 2), colour, new THREE.Matrix4().makeTranslation(x, y, z));
  /** a round-headed panel standing in the front: `w` wide, straight up to `spring`, then a half circle; its face at z */
  const arched = (F, w, x, y0, spring, z, colour, depth = 0.12) => {
    const s = new THREE.Shape(); s.moveTo(-w / 2, y0); s.lineTo(w / 2, y0); s.lineTo(w / 2, spring); s.absarc(0, spring, w / 2, 0, Math.PI, false); s.lineTo(-w / 2, y0);
    F.put(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 8 }), colour, new THREE.Matrix4().makeTranslation(x, 0, z));
  };
  /** a ring of battlements on a round tower: `n` blocks around (x, z) at radius r, standing on y */
  const crown = (n, r, w, h, d, x, y, z) => { for (let i = 0; i < n; i++) { const a = ((i + 0.5) / n) * Math.PI * 2; S.box(w, h, d, x + Math.sin(a) * r, y, z - Math.cos(a) * r, BUFF, -a); } };
  /** a slit window on a round tower, `turn` radians round from the front */
  const slit = (x, z, r, turn, y, h = 0.9) => P.box(0.24, h, 0.14, x + Math.sin(turn) * r, y, z - Math.cos(turn) * r, DARK, -turn);

  // ------------------------------------------------------------------------------------------ 1. the front building
  S.box(WIDTH + 0.3, FOOT + 0.35 - PLINTH, DEPTH + 0.3, WIDTH / 2, PLINTH, DEPTH / 2 - 0.15, GREY);      // the plinth, down into the ground
  S.box(WIDTH, ROOF - FOOT, DEPTH, WIDTH / 2, FOOT, DEPTH / 2, BUFF);                                     // the block
  S.box(BAY.x1 - BAY.x0, ROOF - FOOT, BAY.out + 0.2, (BAY.x0 + BAY.x1) / 2, FOOT, -BAY.out / 2 + 0.1, BUFF); // the middle bay, standing forward
  // grey rusticated stone: the lower storey of the side bays and of the sides, the corners, the piers of the middle bay
  for (const x of [BAY.x0 / 2, WIDTH - BAY.x0 / 2]) S.box(BAY.x0, LOWER, 0.3, x, FOOT, -0.03, GREY);
  for (const x of [0, WIDTH]) S.box(0.3, LOWER, DEPTH, x, FOOT, DEPTH / 2, GREY);
  for (const x of [0.4, WIDTH - 0.4]) S.box(0.95, PIER, 0.45, x, FOOT, -0.05, GREY);
  for (const x of [BAY.x0 + 0.5, BAY.x1 - 0.5]) S.box(1.0, PIER, 0.3, x, FOOT, -BAY.out - 0.1, GREY);
  for (const x of [BAY.x0 + 1.4, BAY.x1 - 1.4]) S.box(0.9, LOWER, 0.2, x, FOOT, -BAY.out - 0.06, GREY);     // beside the niche
  // the large arch of the middle bay: a ring of grey stones around a pale field with the city's arms (a red cross on white)
  arched(S, 5.4, TOWER.x, FOOT + LOWER, FOOT + LOWER + 0.1, -BAY.out - 0.14, GREY, 0.16);
  arched(S, 3.9, TOWER.x, FOOT + LOWER, FOOT + LOWER + 0.1, -BAY.out - 0.2, PALE, 0.1);
  P.box(0.8, 0.95, 0.08, TOWER.x, FOOT + LOWER + 0.45, -BAY.out - 0.24, '#f2eee4');
  P.box(0.8, 0.2, 0.06, TOWER.x, FOOT + LOWER + 0.85, -BAY.out - 0.27, '#b3382e'); P.box(0.2, 0.95, 0.06, TOWER.x, FOOT + LOWER + 0.45, -BAY.out - 0.27, '#b3382e');
  // under it the band with the words, and the niche with the fountain (drawn dark, with its basin in front)
  S.box(3.9, 0.6, 0.1, TOWER.x, FOOT + LOWER - 0.6, -BAY.out - 0.05, PALE);
  arched(P, 1.5, TOWER.x, FOOT + 1.0, FOOT + 3.5, -BAY.out - 0.06, DARK, 0.1);
  S.box(0.4, 1.0, 0.4, TOWER.x, FOOT, -BAY.out - 0.45, PALE); S.cylinder(0.3, 0.3, TOWER.x, FOOT + 1.0, -BAY.out - 0.45, PALE, 10, 0.62);
  // the two iron doors, round-headed, and the round window above each
  for (const x of [SIDE, WIDTH - SIDE]) {
    arched(P, 1.35, x, FOOT + 0.4, FOOT + 3.3, -0.24, DARK, 0.1);
    disc(S, 0.8, x, FOOT + 7.0, -0.04, PALE, 0.12); disc(P, 0.48, x, FOOT + 7.0, -0.08, DARK, 0.1);
  }
  // the cornice and the battlements: along the front and the two sides
  S.box(WIDTH + 0.5, 0.3, DEPTH + 0.75, WIDTH / 2, ROOF - 0.3, DEPTH / 2 - 0.375, PALE);
  S.box(WIDTH + 0.3, 0.55, 0.4, WIDTH / 2, ROOF, -0.4, BUFF);
  for (const x of [-0.05, WIDTH + 0.05]) S.box(0.4, 0.55, DEPTH + 0.2, x, ROOF, DEPTH / 2 - 0.3, BUFF);
  for (let i = 0; i < 13; i++) {
    const x = ((i + 0.5) / 13) * (WIDTH + 0.3) - 0.15;
    if (Math.abs(x - TOWER.x) < TOWER.r + 0.5 || Math.abs(x - SIDE) < TURRET.r + 0.35 || Math.abs(x - (WIDTH - SIDE)) < TURRET.r + 0.35) continue; // (a tower stands there)
    S.box(0.7, 0.6, 0.4, x, ROOF + 0.55, -0.4, BUFF);
  }
  for (const x of [-0.05, WIDTH + 0.05]) for (let i = 0; i < 6; i++) S.box(0.4, 0.6, 0.7, x, ROOF + 0.55, 0.55 + i * 1.2, BUFF);
  P.box(WIDTH - 0.5, 0.06, DEPTH - 0.4, WIDTH / 2, ROOF, DEPTH / 2 + 0.1, GRASS); // grass up to the battlements (the photo from the hill side)

  // ------------------------------------------------------------------------------------------------ 2. the towers
  // the middle tower: a corbel under it, the shaft with two string courses, a wider crown with battlements
  const top = ROOF + 7.2;
  S.cylinder(0.45, ROOF + 0.2 - (FOOT + 7.85), TOWER.x, FOOT + 7.85, TOWER.z, PALE, 16, TOWER.r + 0.22);
  S.cylinder(TOWER.r, top - ROOF, TOWER.x, ROOF, TOWER.z, BUFF, 16);
  for (const y of [ROOF + 0.2, ROOF + 3.4]) S.cylinder(TOWER.r + 0.1, 0.22, TOWER.x, y, TOWER.z, PALE, 16);
  S.cylinder(TOWER.r, 0.5, TOWER.x, top, TOWER.z, PALE, 16, TOWER.r + 0.4);
  S.cylinder(TOWER.r + 0.4, 0.8, TOWER.x, top + 0.5, TOWER.z, BUFF, 16);
  crown(8, TOWER.r + 0.2, 0.8, 0.8, 0.4, TOWER.x, top + 1.3, TOWER.z);
  slit(TOWER.x, TOWER.z, TOWER.r, -0.6, ROOF + 1.6); slit(TOWER.x, TOWER.z, TOWER.r, 0, ROOF + 3.9); slit(TOWER.x, TOWER.z, TOWER.r, 0.6, ROOF + 2.3); slit(TOWER.x, TOWER.z, TOWER.r, 0, ROOF + 5.9);
  P.box(0.95, 2.0, 0.14, TOWER.x, ROOF, TOWER.z + TOWER.r, DARK); // its door, on the side of the lawn
  // the two side turrets, the same but smaller
  for (const x of [SIDE, WIDTH - SIDE]) {
    const t = ROOF + 3.3;
    S.cylinder(0.2, ROOF + 0.15 - (FOOT + 7.9), x, FOOT + 7.9, TURRET.z, PALE, 12, TURRET.r + 0.12);
    S.cylinder(TURRET.r, t - ROOF, x, ROOF, TURRET.z, BUFF, 12);
    S.cylinder(TURRET.r + 0.07, 0.18, x, ROOF + 0.15, TURRET.z, PALE, 12);
    S.cylinder(TURRET.r, 0.3, x, t, TURRET.z, PALE, 12, TURRET.r + 0.22);
    S.cylinder(TURRET.r + 0.22, 0.45, x, t + 0.3, TURRET.z, BUFF, 12);
    crown(6, TURRET.r + 0.08, 0.5, 0.5, 0.28, x, t + 0.75, TURRET.z);
    slit(x, TURRET.z, TURRET.r, 0, ROOF + 1.7, 0.7);
  }

  // ---------------------------------------------------------------------------------------------- 3. the reservoir
  // The part of OSM's outline behind the front building, as a level lawn; around it grass banks that run down into the
  // ground (ASSUMED), except where the front building stands against it.
  const ring = outline.rings[0], lawn = ring.map(local).filter(([, z]) => z > DEPTH - 2.5);
  if (lawn.length < 4) throw new Error('Wasserschlössle: OSM’s outline no longer has the reservoir behind the front building');
  P.prism(lawn, ROOF - 0.4, ROOF, GRASS);
  const grass = new THREE.Color(BANKS), run = (ROOF - BANK.foot) / BANK.slope, n = lawn.length;
  const area = lawn.reduce((t, p, i) => { const q = lawn[(i + 1) % n]; return t + p[0] * q[1] - q[0] * p[1]; }, 0), side = area > 0 ? 1 : -1;
  const out = (i) => { const p = lawn[i], q = lawn[(i + 1) % n], l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(side * (q[1] - p[1])) / l, (-side * (q[0] - p[0])) / l]; }; // (the way edge i looks, away from the lawn)
  const hidden = (i) => { const p = lawn[i], q = lawn[(i + 1) % n]; return [p, q].every(([x, z]) => x > -0.5 && x < WIDTH + 0.5 && z < DEPTH + 1); }; // (the edge the front building stands against)
  const world = (x, y, z) => { const [wx, wz] = P.toWorld(x, z); return [wx, y, wz]; };
  const face = (a, b, c, [nx, nz]) => kit.mesher.tri(a, b, c, grass, [nx * cos + nz * sin, 0.4, -nx * sin + nz * cos], [0, 0, 0, KIND.PLAIN]);
  const down = ([x, z], [nx, nz]) => world(x + nx * run, BANK.foot, z + nz * run);
  for (let i = 0; i < n; i++) {
    const p = lawn[i], q = lawn[(i + 1) % n], o = out(i), before = (i + n - 1) % n, after = (i + 1) % n;
    if (hidden(i)) continue;
    const a = world(p[0], ROOF, p[1]), b = world(q[0], ROOF, q[1]);
    face(a, b, down(q, o), o); face(a, down(q, o), down(p, o), o);
    // round the corner to the next bank, in three steps; or, against the front building, close the end of the bank
    if (hidden(after)) face(b, down(q, o), world(q[0], BANK.foot, q[1]), [q[0] - p[0], q[1] - p[1]]);
    else { const o2 = out(after), a0 = Math.atan2(o[1], o[0]); let turn = Math.atan2(o2[1], o2[0]) - a0; while (turn > Math.PI) turn -= 2 * Math.PI; while (turn < -Math.PI) turn += 2 * Math.PI;
      for (let k = 0; k < 3; k++) { const d0 = [Math.cos(a0 + (turn * k) / 3), Math.sin(a0 + (turn * k) / 3)], d1 = [Math.cos(a0 + (turn * (k + 1)) / 3), Math.sin(a0 + (turn * (k + 1)) / 3)]; face(b, down(q, d0), down(q, d1), d0); } }
    if (hidden(before)) face(a, down(p, o), world(p[0], BANK.foot, p[1]), [p[0] - q[0], p[1] - q[1]]);
  }
  // the vents on the lawn: short round posts of red sandstone with a cap (ASSUMED: two rows of five)
  for (const x of [-19, 14]) for (let i = 0; i < 5; i++) { const z = 11.5 + i * 3.8; S.cylinder(0.4, 0.95, x, ROOF, z, RED, 10); S.cylinder(0.52, 0.2, x, ROOF + 0.95, z, RED, 10); }

  return { anchor: P.toWorld(TOWER.x, TOWER.z), top: top + 2.1 };
}
