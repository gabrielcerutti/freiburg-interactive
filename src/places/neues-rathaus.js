// The Neues Rathaus (New Town Hall), on Rathausplatz, and the bridge over Turmstraße to the Altes Rathaus.
//
// How it is made:
//   - The volumes are OpenStreetMap's building:parts of the building (relation 6824) and the bridge (way 551176977),
//     drawn by src/buildings.js: the two gabled houses on the square (ways 551352895 and 551352896), the middle wing
//     between them (way 551352897, from 3 m up), the floor of its balcony (way 551352898, at 3 m), the gable with the
//     clock (way 551467088), the bell turret on the ridge (way 551467087, 22 m, an onion roof) and the two oriels on
//     the outer corners of the houses (ways 551352899 and 551992538, from the first floor up). The German Wikipedia:
//     «Ein Übergang vom Neuen Rathaus zum Alten Rathaus überspannt die Turmstraße zwischen den beiden Gebäuden.»
//   - The front of the middle wing is found from those parts, not written down: it runs between the two corners
//     where the balcony's floor meets the houses, and the wing's own wall stands 3 m behind that line.
//   - Made by hand on that front, after photographs on Wikimedia Commons (listed in `sources`): the three arches
//     under the balcony; the balcony's parapet; the three large windows of the upper floor and, between and beside
//     them, the four niches with a coat of arms over each («Die Hauswappen über den Figurennischen über dem Balkon
//     verweisen noch auf die … Fürstenstandbilder, die im Zweiten Weltkrieg eingeschmolzen wurden», de); the cornice;
//     the clock (the «Turmuhr» of the decision of 1898, de) on its gable; the openings of the bell turret, its
//     cornices and its finial; the stone lower storey, the windows and the corbels of the two corner oriels (the one
//     on the corner of Rathausgasse is the «Einhornerker», de); and the shaped gables of the two houses.
//   - Colours, from the photos: white plaster, dark red sandstone, dark brown roof tiles, green copper on the turret
//     and on the oriels' roofs, a gilt clock face with a white middle. OSM agrees where the viewer can read its
//     words (white walls) and says maroon for the roofs, rosybrown for the stone and lightseagreen for the copper.
//   - Not drawn: the columned portal with «Academia friburgensis» (de). A photograph from before 1896 shows a portal
//     with a pediment in the wall that then joined the two houses, where the middle wing stands now; neither page
//     says where it is today. Nor the bells of the Glockenspiel, the gilded grilles of the ground floor, the stone
//     window surrounds of the houses, or the oriels and balconies of the other sides.
//
// The arches: OSM maps two piers under the balcony (ways 551467864 and 551467865), 1.5 m behind its front edge and
// not evenly spaced (bays of 3.3, 4.5 and 4.3 m). The photos show three equal arches standing right under the
// parapet. The model follows the photos — three equal arches across the gap between the houses, under the front edge
// of the balcony — and leaves OSM's two piers out.
//
// ASSUMED: most heights (OSM gives levels for most parts; 3.1 m per level), the onion profile, the height under the
// bridge (4.5 m) and the painted windows of the houses; the shape and height of the arches (they have to fit under
// OSM's 3 m), and that what is behind them is dark; the size and place of the windows, niches and arms of the upper
// floor (read off the photos by eye); the size of the clock; the size of the turret's openings and the height of its
// finial; the look of the oriels' sides the photos do not show; the outline of the shaped gables and their windows;
// the exact shades.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { resolve } from '../buildings.js';
import { centreTop, mid, wallFrame, slab, flat, archOutline, archBand, clock, shield } from './altes-rathaus.js';

export const PLACE = {
  key: 'neues-rathaus',
  name: 'Neues Rathaus',
  localName: 'New Town Hall',
  kind: 'building',
  built: { from: 1539, converted: [1896, 1901] }, // «Zum Rechen» 1539–1545; bought by the city 1896, converted until 1901
  // Which part was hit is not said anywhere found; «einigermaßen instandgesetzt» by July 1946 is the only date.
  war: { state: 'damaged', rebuilt: 1946, source: 'Gerhard Dangel, «Welte Glockenspiel Freiburg Rathaus» (Waldkircher Orgelbau Jäger & Brommer): «Im Zweiten Weltkrieg … wurde das Rathaus und damit auch das Glockenspiel erheblich beschädigt. Nachdem das Gebäude wieder einigermaßen instandgesetzt war, wurde die Firma Welte am 9. Juli 1946 erneut beauftragt»; the city’s damage map of the raid of 27 November 1944 marks it blue, light to medium damage (only «beschädigt», and no word of a fire: the weaker state)' },
  coordinates: [47.996046, 7.849225], // de.wikipedia «Rathaus (Freiburg im Breisgau)», infobox for the Neues Rathaus
  osm: 'r6824',
  sources: [
    'German Wikipedia, «Rathaus (Freiburg im Breisgau)»: coordinates (47.996046 N, 7.849225 E); a double house: «Zum Rechen», built 1539–1545 for the physician Joachim Schiller von Herdern, and «Zum Phönix», bought by the university in 1595 and joined to it; the university’s until 1774 (Collegium Universitatis); bought by the city in 1896 and converted into the New Town Hall until 1901, with larger windows, balconies and oriels; the columned portal with «Academia friburgensis»; the coats of arms over the figure niches above the balcony, whose statues were melted down in the Second World War; the «Einhornerker» on the corner of Rathausplatz and Rathausgasse; the tower clock and the Glockenspiel, decided on 21 September 1898, the Glockenspiel inaugurated on 14 October 1901; the bridge over Turmstraße',
    'English Wikipedia, «Freiburg im Breisgau Town Hall»: the same history (it puts «Zum Rechen» on the right, the German page on the left)',
    'Wikimedia Commons, «Neues Rathaus (Freiburg) 4029» (joergens.mi, 2011, CC BY-SA 3.0) and «Neues Rathaus Freiburg 2016-05» (Zinneke, 2016, CC BY-SA 3.0): the front on the square — the three arches, the balcony, the three windows and the niches with arms over them, the clock on its gable, the turret, the shaped gables of the two houses, the colours',
    'Wikimedia Commons, «Neues Rathaus in Freiburg i. Br. (2025)» (JoachimKohler-HB, CC BY-SA 4.0) and «Neues Rathaus Freiburg 03» (Giftzwerg 88, 2023, CC BY-SA 4.0): the front from either side — the oriels on the corners of Rathausgasse and Turmstraße, with their stone lower storey, corbels and copper roofs; the niche at each end of the upper floor',
    'Wikimedia Commons, «Freiburg im Breisgau, Neues Rathaus -- 2025 -- 7964» (Dietmar Rabich, CC BY-SA 4.0; one of the place’s photos): the clock, and the copper turret with its open bell stage and its gilt ball',
    'Wikimedia Commons, «Alte Universität Freiburg» (Georg Röbcke, before 1896, public domain): the building before the conversion, with a portal under a pediment in the wall between the two houses',
    'German Wikipedia, «Rathaus (Freiburg im Breisgau)», on the Glockenspiel: «Im Zweiten Weltkrieg … wurde es wie das Rathaus erheblich beschädigt. Zwar erklang es in der Silvesternacht 1946 … wieder, doch erst im September 1947 war es vorläufig repariert»; Gerhard Dangel, «Welte Glockenspiel Freiburg Rathaus», on the website of Waldkircher Orgelbau Jäger & Brommer: «wurde das Rathaus und damit auch das Glockenspiel erheblich beschädigt. Nachdem das Gebäude wieder einigermaßen instandgesetzt war, wurde die Firma Welte am 9. Juli 1946 erneut beauftragt, das Glockenspiel instand zu setzen»',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the building is marked blue for the most part. The city’s board on the town halls (Wikimedia Commons, «Beschreibungstafel der Freiburger Rathäuser», Andreas Schwarzkopf, 2016, CC BY-SA 3.0) says nothing of war damage here, and that the baroque Aula on the first floor is «erhalten»',
    'OpenStreetMap, relation 6824 and its building:parts: footprint, levels, roof shapes and colours, the onion turrets, the balcony’s floor and the two oriels; way 551176977: the bridge',
  ],
  assumptions: [
    'most heights: OSM gives the number of storeys, not metres',
    'the profile of the onion domes and the clearance under the bridge',
    'the windows of the houses, painted on as on every other building',
    'the three arches: equal and under the front edge of the balcony, as in the photos (OSM maps two piers further back, unevenly spaced: they are left out); their shape and height; the dark behind them',
    'the size and place of the three windows, the four niches and the arms over them, and of the clock (read off photos by eye)',
    'the size of the bell turret’s openings and the height of its finial',
    'the sides of the two corner oriels that the photos do not show, and the size of their windows and corbels',
    'the outline of the shaped gables of the two houses and the windows in them',
    'the shades of the stone, the roofs, the copper and the gilding',
  ],
  card: {
    title: 'Neues Rathaus',
    years: '1539 – 1545 · town hall since 1901',
    text: [
      'It began as two houses. «Zum Rechen» was built in 1539–45 for the physician Joachim Schiller von Herdern; in 1595 the university bought the house next door, «Zum Phönix», and joined the two. The university used them until 1774.',
      'The city bought the building in 1896 and by 1901 had turned it into the New Town Hall, adding larger windows, balconies and oriels. Its Glockenspiel was inaugurated on 14 October 1901. A bridge over Turmstraße joins it to the Altes Rathaus.',
      'In the Second World War the building and its Glockenspiel were badly damaged; no source found says which part or on which day. The city’s damage map of the air raid of 27 November 1944 marks it with light to medium damage. By July 1946 the building was more or less repaired, and the Glockenspiel played again on New Year’s Eve 1946.',
      'The two Wikipedias disagree on which side «Zum Rechen» stands. The volumes are OpenStreetMap’s. The three arches, the balcony, the windows and niches above it, the clock, the openings of the bell turret, the two corner oriels and the shaped gables are placed by eye from photographs: their size, their exact position and their shades are guesses. The columned portal of the old university and the bells of the Glockenspiel are not drawn.',
    ],
  },
};

const WING = 'w551352897', BALCONY = 'w551352898', PIERS = ['w551467864', 'w551467865'], TURRET = 'w551467087', DORMER = 'w551467088';
const HOUSES = ['w551352895', 'w551352896'], ORIELS = ['w551352899', 'w551992538']; // (south first: Rathausgasse, then Turmstraße)
const WHITE = '#efeae0', STONE = '#94503f', STONE_DARK = '#70382e', ROOF = '#65453d', COPPER = '#6f9c8a', COPPER_DARK = '#58806f', GOLD = '#d1a83a', GILT_DARK = '#7a5a22';
// The ground. src/main.js stands a whole place on the lowest ground under its parts, less 0.3 m, and a place is not told
// about the terrain. In front of the middle wing the square lies about 1 m above that foot (0.85 to 1.1 m:
// public/data/terrain.*), so only 2 m are left under OSM's balcony: the arches spring from just above that ground.
const GROUND = 1.0;
// a shaped gable, one half of it: [how far from the middle (1 = the corner), how high (1 = the tip)], from the foot up
const SCROLLS = [[1, 0], [1, 0.04], [0.93, 0.1], [0.8, 0.24], [0.62, 0.4], [0.55, 0.43], [0.5, 0.47], [0.47, 0.55], [0.37, 0.7], [0.26, 0.8], [0.21, 0.82], [0.2, 0.9], [0.14, 0.96], [0, 1]];

const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
/** every side of a footprint: its middle, the direction it faces (away from the footprint's middle) and its length */
function eachFace(ring, fn) {
  const c = mid(ring);
  ring.forEach((p, i) => {
    const q = ring[(i + 1) % ring.length], len = dist(p, q); if (len < 0.05) return;
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; let n = [(q[1] - p[1]) / len, -(q[0] - p[0]) / len];
    if (n[0] * (m[0] - c[0]) + n[1] * (m[1] - c[1]) < 0) n = [-n[0], -n[1]];
    fn(m, n, len);
  });
}
/** a flat figure (drawn facing +z, its foot at the origin) laid on such a side, `proud` of it, its foot at height y */
const onFace = (W, geometry, colour, m, n, y, proud) => W.put(geometry, colour, new THREE.Matrix4().makeTranslation(m[0] + n[0] * proud, y, m[1] + n[1] * proud).multiply(new THREE.Matrix4().makeRotationY(Math.atan2(n[0], n[1]))));
/** the outline of an opening w wide and h high with a round head, its foot at the origin */
function roundHeaded(w, h) {
  const r = w / 2, pts = [[-r, 0], [r, 0]];
  for (let i = 0; i <= 8; i++) { const a = (Math.PI * i) / 8; pts.push([r * Math.cos(a), h - r + r * Math.sin(a)]); }
  return pts;
}

export function build(kit, parts) {
  const by = (id) => parts.find((b) => b.id === id);
  const wing = by(WING), balcony = by(BALCONY), turret = by(TURRET), dormer = by(DORMER), houses = HOUSES.map(by), oriels = ORIELS.map(by);
  if ([wing, balcony, turret, dormer, ...houses, ...oriels].some((b) => !b)) throw new Error('Neues Rathaus: OSM parts missing from city.json');

  // 1. the volumes, from OSM, with the colours its words stand for (see the top of this file). The wing, the clock's
  //    gable, the turret and the oriels without painted windows: theirs are drawn below. The two piers are left out.
  const tint = (b) => ({ ...b, colour: { rosybrown: STONE, lightseagreen: COPPER_DARK }[b.colour] ?? b.colour, roofColour: { maroon: ROOF, lightseagreen: COPPER }[b.roofColour] ?? b.roofColour });
  const own = new Set([WING, DORMER, TURRET, ...ORIELS, ...PIERS]);
  kit.osm(parts.filter((b) => !own.has(b.id) && b.roofColour !== 'lightseagreen').map(tint));
  kit.osm(parts.filter((b) => !own.has(b.id) && b.roofColour === 'lightseagreen').map(tint), { roof: KIND.PLAIN }); // (copper, not tiles)
  kit.osm([tint(wing)], { walls: KIND.PLAIN });
  kit.osm([tint(dormer)], { walls: KIND.STONE });
  kit.osm([turret, ...oriels].map(tint), { walls: KIND.PLAIN, roof: KIND.PLAIN });

  // 2. the front's frame: between the two corners where the balcony's floor meets the houses; x to the right of
  //    someone standing on the square, z out towards them. The wing's own wall stands behind that line, at `back`.
  const centre = mid(wing.rings[0]);
  const corner = (house) => balcony.rings[0].filter((p) => house.rings[0].some((q) => dist(p, q) < 0.05)).reduce((a, b) => (!a || dist(b, centre) > dist(a, centre) ? b : a), null);
  const A = corner(houses[0]), B = corner(houses[1]);
  if (!A || !B) throw new Error('Neues Rathaus: the balcony does not meet the two houses in city.json');
  const front = wallFrame(kit, A, B, centre), F = front.F, L = front.len;
  const back = Math.max(...wing.rings[0].map(front.z)), under = resolve(balcony).minH, floor = resolve(balcony).wallTop, eaves = resolve(wing).wallTop;

  // 3. the three arches under the balcony, their piers and arch stones in sandstone, and the dark behind them
  const bay = L / 3, arches = [-1, 0, 1].map((k) => ({ x: k * bay, width: bay - 0.9, spring: GROUND + 0.55, crown: under - 0.35 }));
  slab(F, archOutline(-L / 2, L / 2, 0, under, arches), 0.5, -0.7, WHITE);
  for (const a of arches) archBand(F, a, 0.3, -0.17, STONE);
  for (const k of [-1.5, -0.5, 0.5, 1.5]) {
    const end = Math.abs(k) > 1;
    F.box(end ? 0.48 : 0.96, arches[0].spring + 0.1, 0.62, k * bay - (end ? Math.sign(k) * 0.24 : 0), 0, -0.45, STONE);
  }
  F.box(L, under, 0.2, 0, 0, back, 'OPENING');

  // 4. the balcony: the edge of its floor and its parapet (pierced stonework, drawn solid)
  F.box(L, 0.34, 0.5, 0, under - 0.1, 0, STONE);
  F.box(L, 0.12, 0.2, 0, floor, 0.12, STONE); F.box(L, 0.14, 0.26, 0, floor + 0.86, 0.12, STONE);
  F.box(L, 0.76, 0.08, 0, floor + 0.11, 0.12, STONE_DARK);
  for (const k of [-1.5, -0.5, 0.5, 1.5]) F.box(0.3, 0.9, 0.24, Math.max(-L / 2 + 0.15, Math.min(L / 2 - 0.15, k * bay)), floor, 0.12, STONE);

  // 5. the upper floor of the wing: three large windows, a niche between and beside them, a coat of arms over each niche
  const sill = floor + 0.9, tall = 3.5;
  for (const k of [-1, 0, 1]) {
    const x = k * 0.31 * L;
    F.box(2.7, tall + 0.3, 0.16, x, sill - 0.15, back + 0.06, STONE); F.box(0.9, 0.5, 0.16, x, sill + tall + 0.15, back + 0.06, STONE); // the frame, higher in the middle
    F.box(2.14, tall - 0.25, 0.06, x, sill + 0.1, back + 0.15, 'OPENING'); F.box(0.58, 0.42, 0.06, x, sill + tall - 0.15, back + 0.15, 'OPENING');
    for (const m of [-0.37, 0.37]) F.box(0.13, tall - 0.25, 0.08, x + m, sill + 0.1, back + 0.17, STONE);
    F.box(2.14, 0.13, 0.08, x, sill + 0.1 + (tall - 0.25) * 0.55, back + 0.17, STONE);
  }
  for (const x of [-(L / 2 - 0.47), -0.155 * L, 0.155 * L, L / 2 - 0.47]) {
    F.box(0.86, 3.3, 0.14, x, sill, back + 0.05, STONE); F.box(0.74, 0.25, 0.3, x, sill, back + 0.15, STONE);
    flat(F, roundHeaded(0.5, 2.3), x, sill + 0.55, back + 0.13, STONE_DARK);
    shield(F, x, sill + 3.75, back + 0.03, 0.5, STONE);
  }
  F.box(L, 0.45, 0.34, 0, eaves - 0.45, back + 0.1, STONE); // the cornice under the roof

  // 6. the clock, on the front of OSM's small gable, and the scrolled stones at its sides
  const dr = resolve(dormer), face = dormer.rings[0].slice().sort((p, q) => front.z(q) - front.z(p)).slice(0, 2);
  const cx = (front.x(face[0]) + front.x(face[1])) / 2, cw = Math.abs(front.x(face[0]) - front.x(face[1]));
  clock(F, cx, dr.minH + 1.5, back + 0.04, 0.36 * cw, { face: GOLD, centre: WHITE, marks: GILT_DARK, hands: 'IRON' });
  for (const side of [-1, 1]) slab(F, [[0, 0], [1.15, 0], [1.15, 0.3], [0.75, 0.5], [0.35, 1.0], [0, 1.7]].map(([x, y]) => [cx + side * (cw / 2 + x), dr.minH + y]), 0.3, back - 0.3, STONE);

  // 7. the bell turret: a sill and a cornice around it, an arched opening in each of its eight sides, and its finial
  const W0 = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }); // (world metres, for what stands on OSM's own outlines)
  const tr = resolve(turret), ring = turret.rings[0], tc = mid(ring), R = Math.max(...ring.map((p) => dist(p, tc)));
  const turn = Math.atan2(ring[0][0] - tc[0], ring[0][1] - tc[1]), tip = tr.wallTop + tr.roofH;
  W0.cylinder(R + 0.2, 0.2, tc[0], tr.wallTop - 2.3, tc[1], COPPER_DARK, 8, R + 0.2, turn);
  W0.cylinder(R + 0.3, 0.3, tc[0], tr.wallTop - 0.3, tc[1], COPPER_DARK, 8, R + 0.3, turn);
  eachFace(ring, (m, n, len) => onFace(W0, new THREE.ShapeGeometry(new THREE.Shape(roundHeaded(len * 0.55, 1.6).map(([x, y]) => new THREE.Vector2(x, y)))), 'OPENING', m, n, tr.wallTop - 2.05, 0.04));
  W0.cylinder(0.1, 1.5, tc[0], tip - 0.2, tc[1], COPPER, 6, 0.03);
  W0.put(new THREE.SphereGeometry(0.2, 8, 6).translate(tc[0], tip + 1.1, tc[1]), GOLD);

  // 8. the two corner oriels: a stone lower storey, a sill, a cornice under the copper roof, a corbel on a corner
  //    pier below, and windows on the sides that look out
  const solid = [...houses, wing].map((b) => b.rings[0]);
  for (const o of oriels) {
    const r = resolve(o), c = mid(o.rings[0]), mid1 = r.minH + (r.wallTop - r.minH) * 0.45;
    const grow = (d) => o.rings[0].map((p) => { const l = dist(p, c); return [c[0] + ((p[0] - c[0]) * (l + d)) / l, c[1] + ((p[1] - c[1]) * (l + d)) / l]; });
    W0.prism(grow(0.1), r.minH, mid1, STONE); W0.prism(grow(0.2), mid1, mid1 + 0.2, STONE); W0.prism(grow(0.25), r.wallTop - 0.3, r.wallTop + 0.02, STONE);
    W0.prism(grow(0.05), r.minH - 0.7, r.minH, STONE); W0.prism(grow(-0.35), r.minH - 1.3, r.minH - 0.7, STONE); W0.prism(grow(-0.6), 0, r.minH - 1.3, STONE);
    eachFace(o.rings[0], (m, n, len) => {
      if (len < 1 || solid.some((s) => inside(s, m[0] + n[0] * 0.5, m[1] + n[1] * 0.5))) return;
      for (const [y, h] of [[r.minH + 0.75, 1.5], [mid1 + 0.75, 1.6]]) {
        onFace(W0, new THREE.PlaneGeometry(len - 0.5, h).translate(0, h / 2, 0), 'OPENING', m, n, y, 0.17);
        const lights = Math.max(2, Math.round((len - 0.5) / 0.7)); // (stone mullions between its lights)
        for (let k = 1; k < lights; k++) onFace(W0, new THREE.PlaneGeometry(0.1, h).translate(((len - 0.5) * k) / lights - (len - 0.5) / 2, h / 2, 0), STONE, m, n, y, 0.2);
      }
    });
    W0.cylinder(0.07, 0.9, c[0], r.wallTop + r.roofH - 0.1, c[1], COPPER, 6, 0.02);
  }

  // 9. the shaped gables of the two houses, on the square: white with a stone edge, standing a little proud of the wall
  houses.forEach((h, i) => {
    const r = resolve(h), { c, u, v, hl, hw } = r.box, end = front.z([c[0] + u[0], c[1] + u[1]]) > front.z(c) ? 1 : -1; // (the end on the square)
    const e = [c[0] + end * u[0] * hl, c[1] + end * u[1] * hl];
    const G = wallFrame(kit, [e[0] - v[0] * hw, e[1] - v[1] * hw], [e[0] + v[0] * hw, e[1] + v[1] * hw], c).F, W = 2 * hw + 0.3, H = r.roofH * 1.12, y0 = r.wallTop;
    const outline = (w, t, y) => { const half = SCROLLS.map(([f, k]) => [(f * w) / 2, y + k * t]); return [...half, ...half.slice(0, -1).reverse().map(([x, yy]) => [-x, yy])]; };
    slab(G, outline(W + 0.3, H + 0.2, y0 - 0.3), 0.4, -0.3, STONE);
    slab(G, outline(W, H, y0 - 0.2), 0.4, -0.18, WHITE);
    const n = i === 0 ? 2 : 1; // (two windows a row on the south house, one on the north house: the photos)
    for (let k = 0; k < n; k++) {
      const s = n === 2 ? (k ? 1 : -1) : 0;
      G.box(n === 2 ? 1.3 : 1.5, 0.2 * H, 0.08, s * 0.2 * W, y0 + 0.1 * H, 0.22, 'OPENING');
      G.box(0.7, 0.13 * H, 0.08, s * 0.1 * W, y0 + 0.5 * H, 0.22, 'OPENING');
    }
    G.pyramid(0.2, 1.1, 0, y0 + H - 0.15, -0.05, STONE);
  });

  return { anchor: centreTop(parts).anchor, top: Math.max(centreTop(parts).top, tip + 1.4) };
}
