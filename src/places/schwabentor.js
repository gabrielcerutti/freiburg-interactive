// The Schwabentor (Swabian Gate), at Oberlinden / Schwabentorplatz, as it has been since 1954.
//
// How it is made:
//   - The tower is OpenStreetMap's main part of the gate (way 321226541: height 42 m, a pyramidal roof 7 m high),
//     drawn as a solid with a pointed archway cut through it along the street OSM maps through the gate
//     (way 41455470, tunnel=building_passage). The German Wikipedia: "zählt über der spitzbogigen Toröffnung drei
//     Geschosse" — a pointed opening with three storeys above it — so there are three rows of windows.
//   - The roof is the "simpler tented roof" of 1954 (English Wikipedia; German: "ein schlichteres, dem ursprünglichen
//     Zustand ähnelndes Zeltdach"): OSM's pyramidal roof on that part.
//   - The bell turret with its onion dome (English Wikipedia, 1954) is made by hand on OSM's part for it (way
//     321226538: from 40 to 48 m, roof:shape onion, roof 5 m high).
//   - The smaller part on the town side (way 321226542, 13 m, pyramidal roof) is OSM's as it is.
//
// The height is not known: neither Wikipedia gives it (the English one says only that in 1901 it "was almost doubled
// in height"), and OSM's outline says "heights just estimated!". So the 42 m and 48 m are OSM's estimates.
//
// The colours of the walls follow a photo of 2025 (Dietmar Rabich, Wikimedia Commons, «Freiburg im Breisgau,
// Schwabentor -- 2025 -- 8031», one of the place's photos): white plaster, red sandstone at the corners, and a clock
// under the roof.
//
// ASSUMED: all the heights (OSM's estimates, above); the archway's width and height; the number and size of the
// windows; the colour of the roof (the photo shows it from below); the onion's profile; the size and height of the
// clock, and that there is one on both street faces (the photo shows one side).

import { gateTower, passageThrough } from './gate.js';
import { KIND } from '../kit.js';

export const PLACE = {
  key: 'schwabentor',
  name: 'Schwabentor',
  localName: 'Swabian Gate',
  kind: 'building',
  built: { from: 1250, rebuilt: 1901, simplified: 1954 }, // "um 1250 errichtete Torturm" (de); 1901 and 1954 (en and de)
  war: { state: 'spared', rebuilt: null, source: 'German Wikipedia, «Freiburg im Breisgau»: «die beiden noch erhaltenen mittelalterlichen Stadttore blieben nahezu unversehrt» (air raid of 27 November 1944); the city’s damage map of the raid leaves the gate unmarked' },
  coordinates: [47.99278, 7.85417], // en.wikipedia "Schwabentor", infobox
  osm: 'w129932309',
  checks: {
    footprint: { part: 'w321226541', size: [11, 11] }, // de: "auf quadratischem Grundriss … eine Seitenlänge von jeweils elf Metern"
  },
  sources: [
    'English Wikipedia, «Schwabentor»: coordinates (47.99278 N, 7.85417 E); closed with a stone wall in 1547; in 1901 «almost doubled in height» to Carl Schaefer’s design, with a crow-stepped gable; partly undone in 1954, with «a simpler tented roof» and «a bell turret with an onion dome»; St George painted on the outside in 1903 by Fritz Geiges',
    'German Wikipedia, «Schwabentor (Freiburg im Breisgau)»: the tower built around 1250, on a square plan eleven metres a side; a pointed archway with three storeys above it; a stair turret added in 1572; the work of 1901 by Geis & Bauer, completed on 14 October 1901 with the opening of the tram',
    'Wikimedia Commons, «Freiburg im Breisgau, Schwabentor -- 2025 -- 8031» (Dietmar Rabich, CC BY-SA 4.0): white plaster, red sandstone corners, and the clock under the roof',
    'German Wikipedia, «Freiburg im Breisgau»: «Ein großer Teil der historischen Altstadt wurde beim Bombenangriff am 27. November 1944 zerstört. Das Münster, die Südostecke des Münsterplatzes mit Historischem Kaufhaus, Wentzingerhaus und Alter Wache sowie die beiden noch erhaltenen mittelalterlichen Stadttore blieben nahezu unversehrt»; the city’s damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the gate is not marked',
    'OpenStreetMap, way 129932309 and its 3 building:parts: footprint, roof shapes and (estimated) heights of the tower and its turret; way 41455470: the passage through the gate',
  ],
  assumptions: [
    'every height: no source gives one, and OpenStreetMap marks its own as estimates',
    'the width and height of the archway',
    'the number and size of the windows',
    'the colour of the roof (the photo shows it only from below)',
    'the size and height of the clock, and that both street faces have one',
    'the profile of the onion dome',
  ],
  card: {
    title: 'Schwabentor',
    years: 'about 1250 · raised 1901 · simplified 1954',
    text: [
      'The gate tower was built around 1250, on a square plan eleven metres a side. It was only closed with a stone wall on the town side in 1547; a stair turret was added in 1572.',
      'In 1901 Carl Schäfer almost doubled its height and topped it with a stepped gable modelled on town towers in northern Germany. In 1903 Fritz Geiges painted St George, the dragon slayer, on its outer side.',
      'The gate came through the air raid of 27 November 1944 nearly unharmed. In 1954 the rebuilding was partly undone: the tower got a simpler tented roof, closer to the original, and a bell turret with an onion dome. That is the gate shown here.',
      'No source gives its height: the heights here are OpenStreetMap’s estimates. The archway and the windows are guesses too.',
    ],
  },
};

const BODY = 'w321226541', TURRET = 'w321226538';
const WALL = '#efe9dc', SANDSTONE = '#8a4f40'; // (from the 2025 photo)
const ROOF = '#9a4b33', DARK_ROOF = '#4b4a48';  // (assumed)

export function build(kit, parts, city) {
  const body = parts.find((b) => b.id === BODY), turret = parts.find((b) => b.id === TURRET);
  if (!body || !turret) throw new Error('Schwabentor: OSM parts missing from city.json');
  const line = passageThrough(city.streets, body.rings[0]);
  if (!line) throw new Error('Schwabentor: no OSM passage found through the tower');

  kit.osm(parts.filter((b) => b !== body && b !== turret).map((b) => ({ ...b, colour: WALL, roofColour: ROOF })), { walls: KIND.STONE });
  const { T } = gateTower(kit, {
    body, line, wall: WALL, roof: ROOF, quoins: SANDSTONE, clock: { y: body.height - body.roofHeight - 3.2, r: 1.5 },
    arch: { width: 4.4, spring: 4.2, crown: 7.6 },
    windows: { rows: [12, 19, 26], perFace: 2, w: 1.2, h: 2.1 },
  });

  // the bell turret: an open belfry on posts, then the onion and its finial, on OSM's part (40 → 48 m)
  const ring = turret.rings[0], cx = ring.reduce((s, p) => s + p[0], 0) / ring.length, cz = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const r = Math.max(...ring.map((p) => Math.hypot(p[0] - cx, p[1] - cz))) * 0.75;
  const B = kit.frame({ x: cx, z: cz });
  const y0 = turret.minHeight, y1 = turret.height - turret.roofHeight; // (40, 43)
  B.cylinder(r * 1.08, 0.4, 0, y0, 0, WALL, 8);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; B.box(0.22, y1 - y0 - 0.7, 0.22, Math.cos(a) * r * 0.92, y0 + 0.4, Math.sin(a) * r * 0.92, WALL); }
  B.cylinder(r * 0.55, y1 - y0 - 0.7, 0, y0 + 0.4, 0, 'OPENING', 8); // (the bell, in the dark)
  B.cylinder(r * 1.08, 0.3, 0, y1 - 0.3, 0, WALL, 8);
  const onion = [[0, 0], [r * 0.95, 0], [r * 1.15, 0.9], [r * 1.0, 1.9], [r * 0.55, 2.8], [r * 0.2, 3.5], [r * 0.12, 4.0], [0, 4.1]];
  B.lathe(onion, y1, DARK_ROOF, 10);
  B.cylinder(0.06, turret.height - y1 - 4.1, 0, y1 + 4.1, 0, 'IRON', 4);

  return { anchor: T.toWorld(0, 0), top: turret.height };
}
