// The Alte Universität on Bertoldstraße: the south range of the former Jesuit college, beside the Universitätskirche —
// as it stands today, rebuilt after 1944 with its old outer appearance.
//
// What the place covers: the one outline OpenStreetMap names «Alte Universität» (way 285561959), the long range on
// the street. The rest of the former college stays with the generic city: OSM maps it as outlines of their own,
// without a name (the east wing, way 285562001; the low range that closes the courtyard on the north and the block
// north of the church, way 285561975), and no photo that could be used shows them. So does the Universitätskirche
// (way 106950622), a building of its own in OSM and in the sources.
//
// How it is made:
//   - The plan is OSM's three building:parts of that outline: the west half of the range (way 550740114), the east
//     half (way 1171011189) and the low gatehouse against its east end (way 1171011187). OSM gives 3 storeys and
//     3 roof storeys for the two halves, 1 storey for the gatehouse, gabled roofs, roof:colour darkbrown — and no
//     heights in metres. The range bends with the street: the walls are OSM's outlines as they are.
//   - The roof is made by hand over those outlines: one ridge down the middle of the bent range, the two long
//     slopes, a hip at the east end, and across it — where OSM's two halves meet — the stepped fire wall that
//     stands out of the roof.
//   - Made by hand after photos (all on Wikimedia Commons; the first three are the place's photos):
//       · «Jesuitenkolleg Bertoldstraße» (Georg Röbcke, dated «after 1901» there): the range before the war — three
//         storeys, the tall tiled roof hipped at the east end, the stepped fire wall half way along, dormers, the
//         low gatehouse with its round archway at the east end, the church at the far end;
//       · «Bertoldstraße 17 (Freiburg im Breisgau) jm61169» (joergens.mi, 2018): the same view today — pale pink
//         plaster, pale window surrounds, a plinth of red sandstone, brown tiles, two rows of dormers on the street
//         side and two dormers on the hip, four windows in the top storey of the east end and none below them, the
//         gatehouse with a small gable over its archway;
//       · «University College Freiburg & Uniseum (2025)» (JoachimKohler-HB, 2025): the whole street front — seventeen
//         axes of windows on three floors and, in the ninth bay from the church, a niche with a statue instead of
//         windows; a door in the first bay beside the church; an arched sandstone portal in the last bay;
//       · «Bertoldstraße 17 (Freiburg im Breisgau) jm61175» (joergens.mi, 2018): the niche and the east half from
//         close by — the grilles of the ground-floor windows, the people on the pavement against the height of the
//         wall;
//       · «Freiburg - Alte Uni» (Michael Schmalenstroer, 2007) and «Bertoldstraße 17 (Freiburg im Breisgau) jm61203»
//         (joergens.mi, 2018): the west half, and how the roof runs up against the church.
//
// ASSUMED: every height — the eaves at 12 m (in the 2018 close view the people on the pavement stand about a sixth
// as tall as the wall behind them), the roof 9 m high (as steep as it looks in the photos, about 45° over the 9 m
// half-depth of OSM's outline; OSM says three roof storeys); the height of each row of windows; that the bays are
// evenly spaced (in the photos they stand in slightly uneven groups); the whole courtyard side, which no photo used
// here shows (drawn like the street side: the same rows of windows and dormers, without niche or portals); the number
// and the place of the dormers (the photos show two rows; here one dormer over every other bay and a smaller one
// between them, higher up); the size and the number of steps of the fire wall; how the roof ends against the church
// (a plain gable wall on the line between the two buildings); the gatehouse's heights, its roof and the size of its
// archway; the sizes of the two doorways and of the niche; the exact colours. Not drawn: the statue's figure (a plain
// block stands in the niche), the lettering «Uniseum Freiburg», the lamps, the rainwater pipes, the chimneys, the
// window bars.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { shrunk } from '../buildings.js';

export const PLACE = {
  key: 'alte-universitaet',
  name: 'Alte Universität',
  localName: 'Old University (former Jesuit college)',
  kind: 'building',
  // Bieri: «Gebaut wird mit Unterbrüchen seit 1699», «Fertigstellungstermin aller Bauten 1727», «Der Umbau des alten
  // Kolleg-Südflügels erfolgt 1726–1727»; «bis zu ihrer Zerstörung 1944». (No `since`: it stood before 1838.)
  built: { from: 1699, to: 1727, destroyed: 1944 },
  // No source found gives the year the college had a roof again (the church beside it: 1956–57), hence `rebuilt: null`.
  war: { state: 'ruin', rebuilt: null, source: 'Pius Bieri, «Universitätskirche und Jesuitenkolleg Freiburg im Breisgau»: the baroque rooms of the college stayed «bis zu ihrer Zerstörung 1944 zum grossen Teil unverändert … Beim Wiederaufbau wird nur die äussere Erscheinung im Wesentlichen beibehalten»; the city’s damage map of the raid of 27 November 1944 marks the range black, heavy damage to total loss' },
  coordinates: [47.995355, 7.848317], // de.wikipedia «Liste von historischen Objekten in der Freiburger Altstadt», entry «Jesuitenkolleg, Alte Universität» (the pin named «Uniseum»)
  osm: 'w285561959',
  sources: [
    'Pius Bieri, «Universitätskirche und Jesuitenkolleg Freiburg im Breisgau», sueddeutscher-barock.ch (2025; linked from the German Wikipedia article on the church): the college founded in 1620; plans for a new college «schon seit 1682», by the Jesuit builder Br. Heinrich Mayer; «Gebaut wird mit Unterbrüchen seit 1699. Widersprüchliche Baudaten stimmen nur im Fertigstellungstermin aller Bauten 1727 überein»; 1699 the fathers’ wing north of the church, 1707–1708 the arcaded wing with the library on the north side of the courtyard; in 1725 the east wing begun to plans by the military engineer Johann Baptist Heintze, «dem Erhalt des alten Südflügels», «Der Umbau des alten Kolleg-Südflügels erfolgt 1726–1727»; the order dissolved in 1773, «Kolleg und Kirche gehen 1774 in einer Versteigerung für 46 000 Gulden an die Stadt», then «Die Kirche und ein Teil des Kollegs wird der Universität, ein anderer Teil dem Kollegium Sapientiae zur Verfügung gestellt»; «Die barocken Räume des Kollegs bleiben … bis zu ihrer Zerstörung 1944 zum grossen Teil unverändert … Beim Wiederaufbau wird nur die äussere Erscheinung im Wesentlichen beibehalten. Hinter den Fassaden bleibt aber nichts mehr von den barocken Räumen erhalten»; Bertoldstraße, «der ehemaligen Jesuitengasse», «nach 1945 stark verbreitert»',
    'German Wikipedia, «Albert-Ludwigs-Universität Freiburg»: «Die Einführungs-Urkunde der Jesuiten vom 16. November 1620»; the caption «Bauten der Jesuiten entlang der Bertoldstraße. Der 1682 begonnene Neubau der Jesuitenkirche wurde 1689 eingeweiht. Die Fertigstellung des gesamten Gebäudekomplexes dauerte jedoch noch bis zum Jahre 1750»; «1773 wurde der Jesuitenorden in den habsburgischen Erblanden aufgehoben»; «Der Theatersaal der Alten Uni an der Bertoldstraße wurde zu einem Literaturhaus umgebaut»',
    'German Wikipedia, «Universitätskirche (Freiburg im Breisgau)»: «Unmittelbar an die Kirche angebaut sind die Gebäude der so genannten Alten Universität, des ehemaligen Jesuitenkollegs, in der auch heute noch Einrichtungen der Universität sowie das „Uniseum“ genannte Universitätsmuseum und das Literaturhaus Freiburg untergebracht sind»; the air raid of 27 November 1944; the church rebuilt «in den Jahren 1956/57»',
    'German Wikipedia, «Uniseum»: the university’s museum, «im Juli 2004 eröffnet», «im ehemaligen Jesuitenkolleg, in das 1557 die Freiburger Universität ihren Lehrbetrieb verlegte und das heute als Alte Universität bezeichnet wird»',
    'German Wikipedia, «Liste von historischen Objekten in der Freiburger Altstadt», entries 64 and 65, «Bertoldstraße 17, 17a, Brunnenstraße 1 — Jesuitenkolleg, Alte Universität»: coordinates (47.995355 N, 7.848317 E); a protected monument («Kulturdenkmal gem. § 12 DSchG (Sachgesamtheit)»)',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the range on the street is black. The official plan of 1955 (the viewer’s «1955» plan) draws the block, lettered «Alte Universität», in the tint of built-up blocks, not hatched as its destroyed blocks are — but it also draws the church, rebuilt only in 1956–57, as a building',
    'Wikimedia Commons, «Jesuitenkolleg Bertoldstraße» (Georg Röbcke, dated «after 1901», public domain): the range before the war — the roof, the stepped fire wall, the dormers, the gatehouse',
    'Wikimedia Commons, photos of 2007 to 2025 (listed at the top of the place’s file): the colours, the seventeen axes of windows, the niche, the two doorways, the dormers, the east end',
    'OpenStreetMap, way 285561959 («Alte Universität», Bertoldstraße 17) and its three building:parts: the footprint, 3 storeys and 3 roof storeys (the gatehouse: 1 storey), gabled roofs, roof:colour darkbrown. No heights',
  ],
  assumptions: [
    'every height: the eaves at 12 m (people on the pavement against the wall, in a photo of 2018), the roof 9 m high (about 45°, as it looks in the photos), the rows of windows',
    'that the bays of the street front are evenly spaced, and the sizes of the windows, the two doorways and the niche',
    'the courtyard side, which none of the photos used shows: drawn like the street side, with the same rows of windows and dormers',
    'the dormers: their number, size and places (the photos show two rows on the street side and two dormers on the hip)',
    'the stepped fire wall: its thickness, the number and the size of its steps',
    'how the roof ends against the church: a plain gable wall on the line between the two buildings',
    'the gatehouse at the east end: its heights, its roof, the size of the archway and of the gable over it',
    'the exact colours',
    'not drawn: the figure in the niche (a plain block), the lettering, the lamps, the rainwater pipes, the chimneys',
  ],
  card: {
    title: 'Alte Universität',
    years: 'completed 1727 · destroyed 1944 · rebuilt',
    text: [
      'This was the college of the Jesuits, who took over teaching at the university under a deed of 16 November 1620. A new college had been planned since 1682, by the Jesuit builder Heinrich Mayer. It was built from 1699, with interruptions. In 1725 the military engineer Johann Baptist Heintze drew the east wing, and in 1726–1727 the older south range on the street — the one modelled here — was converted.',
      'The historian Pius Bieri writes that the sources contradict each other and agree only on 1727 as the year everything was finished. A caption in the German Wikipedia says the complex was not complete until 1750.',
      'The order was dissolved in 1773. In 1774 the town bought college and church at auction for 46,000 gulden, and then left the church and part of the college to the university. The German Wikipedia’s page on the Uniseum says instead that the university moved its teaching here in 1557.',
      'The college was destroyed in 1944, and the city’s damage map of the air raid of 27 November marks it black, for heavy damage to total loss; the church beside it lost its vaults in that raid. In the rebuilding only the outer appearance was kept: nothing of the baroque rooms is left behind the fronts. The church was rebuilt in 1956–57; no source found gives the year for the college. Bertoldstraße, once Jesuitengasse, was widened after 1945.',
      'The building houses institutions of the university, its museum — the «Uniseum», opened in July 2004 — and the Literaturhaus Freiburg, in the former theatre hall.',
      'Only the range on the street is modelled; the wings around the courtyard and the church are drawn like the rest of the town. The plan is OpenStreetMap’s. Every height is a guess read off photos, and so are the dormers, the steps of the fire wall and the gatehouse; the courtyard side, which the photos do not show, is drawn like the street side. It is drawn as it stands today at every stop of the timeline but November 1944, where it is a roofless shell.',
    ],
  },
};

// OSM's parts (https://www.openstreetmap.org/way/<number>)
const WEST = 'w550740114', EAST = 'w1171011189', GATE = 'w1171011187';

// heights in metres — ALL ASSUMED, read off the photographs (see the top of the file)
const EAVES = 12, ROOF = 9, PLINTH = 0.8, OVERHANG = 0.4;
const ROWS = [[1.7, 1.7, 1.15], [5.1, 2.3, 1.3], [8.8, 2.0, 1.3]]; // the three rows of windows: sill, height, width
const BAYS = 18, NICHE = 8, BAYS_YARD = 15;                       // the street front: 17 axes and the niche (the ninth bay from the church)
const GATE_WALL = 3.8, GATE_ROOF = 2.6;
const PLASTER = '#dcb9a4', SURROUND = '#efe6d8', SANDSTONE = '#a8685a', TILE = '#85573f', WOOD = '#6a4a3c', STEP = '#e4d8c6', DARK = 'OPENING';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1], len = (a) => Math.hypot(a[0], a[1]), unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const centre = (r) => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length];

export function build(kit, parts) {
  const west = parts.find((b) => b.id === WEST), east = parts.find((b) => b.id === EAST), gate = parts.find((b) => b.id === GATE);
  if (!west || !east || !gate) throw new Error('Alte Universität: OSM parts missing from city.json');

  // ---- the range's own directions: u along it (from the church towards the east end), v across it (to the street)
  const cw = centre(west.rings[0]), ce = centre(east.rings[0]), u = unit(sub(ce, cw)), c0 = mid(cw, ce);
  let v = [-u[1], u[0]]; if (dot(sub(centre(gate.rings[0]), c0), v) < 0) v = [-v[0], -v[1]]; // (the gatehouse stands on the street side)
  const st = (p) => [dot(sub(p, c0), u), dot(sub(p, c0), v)];
  const same = (a, b) => len(sub(a, b)) < 0.3;
  const all = [...west.rings[0], ...east.rings[0].filter((p) => !west.rings[0].some((q) => same(p, q)))];
  const joint = east.rings[0].filter((p) => west.rings[0].some((q) => same(p, q))).sort((a, b) => st(a)[1] - st(b)[1]); // where the halves meet
  if (joint.length !== 2) throw new Error('Alte Universität: the two halves of the range no longer share one wall in OSM');
  const sMax = Math.max(...all.map((p) => st(p)[0]));
  const end = east.rings[0].filter((p) => st(p)[0] > sMax - 6).sort((a, b) => st(a)[1] - st(b)[1]);           // the east end, from the yard to the street
  const chain = (side) => all.filter((p) => !end.slice(1, -1).some((q) => same(p, q)) && Math.sign(st(p)[1]) === side).sort((a, b) => st(a)[0] - st(b)[0]);
  const yard = chain(-1), street = chain(1); // the two long walls, from the church to the east end

  // the ridge: from the church, over the joint, to the top of the hip (half the range's depth in from the east end)
  const eMid = mid(end[0], end[end.length - 1]), r1 = mid(joint[0], joint[1]);
  const r2 = add(eMid, unit(sub(r1, eMid)), len(sub(end[0], end[end.length - 1])) / 2);
  const ridge = [mid(yard[0], street[0]), r1, r2];
  const onRidge = (p) => { // the point of the ridge nearest to p
    let best = null;
    for (let i = 0; i < ridge.length - 1; i++) {
      const a = ridge[i], d = sub(ridge[i + 1], a), t = Math.max(0, Math.min(1, dot(sub(p, a), d) / dot(d, d))), q = add(a, d, t), l = len(sub(p, q));
      if (!best || l < best.l) best = { q, l };
    }
    return best.q;
  };

  // ---- 1. the walls: OSM's outlines, up to the eaves (the roof comes next), with a sandstone plinth and a pale band
  //         under the eaves
  const solid = (b, o) => kit.osm([{ ...b, levels: null, minLevel: null, roofLevels: null, roofOrientation: null, colour: PLASTER, roofColour: TILE, ...o }], { walls: KIND.PLAIN });
  const band = (b, y0, y1, out, colour) => solid(b, { id: `${b.id}-${y0}`, rings: shrunk(b.rings, -out), minHeight: y0, height: y1, roofShape: 'flat', roofHeight: 0, colour, roofColour: colour });
  for (const b of [west, east]) {
    solid(b, { height: EAVES, roofShape: 'flat', roofHeight: 0 });
    band(b, 0, PLINTH, 0.07, SANDSTONE);
    band(b, EAVES - 0.4, EAVES - 0.02, 0.12, SURROUND);
  }

  // ---- 2. the roof, in tiles: two long slopes, the hip at the east end, a gable wall against the church
  const tile = new THREE.Color(TILE), plaster = new THREE.Color(PLASTER), TILES = [1e4, -1e4, 0.4, KIND.TILES]; // (no ridge or eaves shading: the shader measures those from the ground)
  const TOP = EAVES + ROOF, up = [0, 1, 0];
  const at = (p, y) => [p[0], y, p[1]];
  const eavesOf = (line, side) => line.map((p, i) => { // the eaves: the wall line, moved out by the overhang
    const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)], t = unit(sub(b, a));
    let n = [-t[1], t[0]]; if (dot(n, v) * side < 0) n = [-n[0], -n[1]];
    return add(p, n, OVERHANG);
  });
  const faces = []; // (every piece of the roof, kept to stand the dormers on it)
  const face = (a, b, c) => { if (Math.abs((b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0])) < 1e-6) return; faces.push([a, b, c]); kit.mesher.tri(a, b, c, tile, up, TILES); };
  const slope = (line) => {
    for (let i = 0; i < line.length - 1; i++) {
      const a = line[i], b = line[i + 1], ra = onRidge(a), rb = onRidge(b);
      face(at(a, EAVES), at(b, EAVES), at(rb, TOP));
      face(at(a, EAVES), at(rb, TOP), at(ra, TOP));
    }
  };
  const roofAt = ([x, z]) => { // the height of the roof over a point of the plan
    for (const [a, b, c] of faces) {
      const k = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2]);
      const w0 = ((b[2] - c[2]) * (x - c[0]) + (c[0] - b[0]) * (z - c[2])) / k, w1 = ((c[2] - a[2]) * (x - c[0]) + (a[0] - c[0]) * (z - c[2])) / k, w2 = 1 - w0 - w1;
      if (w0 >= -1e-3 && w1 >= -1e-3 && w2 >= -1e-3) return w0 * a[1] + w1 * b[1] + w2 * c[1];
    }
    return EAVES;
  };
  const hipOut = unit(sub(eMid, r2)), hip = end.map((p) => add(p, hipOut, OVERHANG));
  const eYard = eavesOf(yard, -1), eStreet = eavesOf(street, 1);
  eYard[eYard.length - 1] = hip[0]; eStreet[eStreet.length - 1] = hip[hip.length - 1]; // (the corners of the hip)
  slope(eYard); slope(eStreet);
  for (let i = 0; i < hip.length - 1; i++) face(at(hip[i], EAVES), at(hip[i + 1], EAVES), at(r2, TOP));
  kit.mesher.tri(at(yard[0], EAVES), at(street[0], EAVES), at(ridge[0], TOP), plaster, [-u[0], 0, -u[1]]); // the gable against the church

  // ---- 3. the fire wall across the roof, where the two halves meet: steps up to the ridge from either side
  const half = len(sub(joint[1], joint[0])) / 2, fu = unit(sub(joint[1], joint[0])), STEPS = 9, run = half / STEPS;
  const W = kit.frame({ x: r1[0], z: r1[1], angle: Math.atan2(-fu[1], fu[0]), kind: KIND.PLAIN }); // (x along the fire wall, from the yard to the street)
  for (let i = 0; i < STEPS; i++) for (const s of [-1, 1]) {
    const x = s * (half - (i + 0.5) * run), y0 = EAVES + (i / STEPS) * ROOF - 0.4, y1 = EAVES + ((i + 1) / STEPS) * ROOF + 0.55;
    W.box(run + 0.02, y1 - y0, 0.6, x, y0, 0, STEP);
    W.box(run * 0.7, 0.14, 0.8, x + s * run * 0.1, y1, 0, SANDSTONE); // (its cap)
  }

  // ---- 4. the windows: a pale surround and a dark panel, bay by bay along each long wall
  const P = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }); // (the frame is the world: the faces come from OSM's outlines)
  const along = (line, d) => { // the point d metres along a wall line, and which way the wall looks there
    for (let i = 0; i < line.length - 1; i++) {
      const l = len(sub(line[i + 1], line[i]));
      if (d <= l || i === line.length - 2) { const t = unit(sub(line[i + 1], line[i])); return { p: add(line[i], t, d), t }; }
      d -= l;
    }
  };
  const total = (line) => line.slice(1).reduce((s, p, i) => s + len(sub(p, line[i])), 0);
  const facing = (t, side) => { let n = [-t[1], t[0]]; if (dot(n, v) * side < 0) n = [-n[0], -n[1]]; return n; };
  const pane = (p, n, y, w, h, colour, out) => P.panel(w, h, p[0] + n[0] * out, y, p[1] + n[1] * out, Math.atan2(-n[1], n[0]), colour);
  const windowAt = (p, n, [y, h, w]) => { pane(p, n, y - 0.22, w + 0.44, h + 0.44, SURROUND, 0.04); pane(p, n, y, w, h, DARK, 0.08); };
  const doorway = (p, n, w, h) => { // sandstone around a dark door with a round head
    pane(p, n, 0, w + 1.1, h + w / 2 + 0.9, SANDSTONE, 0.1); pane(p, n, 0, w, h, DARK, 0.14);
    P.put(new THREE.CircleGeometry(w / 2, 10, 0, Math.PI).rotateY(Math.atan2(-n[1], n[0]) + Math.PI / 2).translate(p[0] + n[0] * 0.14, h, p[1] + n[1] * 0.14), DARK);
  };
  const frontLength = total(street);
  for (let i = 0; i < BAYS; i++) {
    const { p, t } = along(street, ((i + 0.5) / BAYS) * frontLength), n = facing(t, 1);
    if (i === NICHE) { // the niche with its statue, between pilasters and under a small pediment: sandstone, a dark hollow, a pale block
      pane(p, n, 4.6, 2.3, 4.2, SANDSTONE, 0.12); pane(p, n, 5.3, 1.2, 2.7, DARK, 0.16);
      P.box(0.6, 1.9, 0.5, p[0] + n[0] * 0.3, 5.5, p[1] + n[1] * 0.3, SURROUND, Math.atan2(-t[1], t[0]));
      continue;
    }
    ROWS.forEach((row, k) => { if (k > 0 || (i > 0 && i < BAYS - 1)) windowAt(p, n, row); });
    if (i === 0) doorway(p, n, 1.5, 2.5);        // the door beside the church
    if (i === BAYS - 1) doorway(p, n, 1.9, 2.9); // the portal at the east end
  }
  // the courtyard side (ASSUMED: no photo): the same rows, up to where the east wing stands against the range
  const open = yard.slice(0, -1), yardLength = total(open);
  for (let i = 0; i < BAYS_YARD; i++) { const { p, t } = along(open, ((i + 0.5) / BAYS_YARD) * yardLength), n = facing(t, -1); for (const row of ROWS) windowAt(p, n, row); }
  // the east end: four windows in the top storey, none below (the 2018 photo)
  const endLength = total(end);
  for (let i = 0; i < 4; i++) { const { p, t } = along(end, ((i + 0.5) / 4) * endLength); let n = [-t[1], t[0]]; if (dot(n, u) < 0) n = [-n[0], -n[1]]; windowAt(p, n, ROWS[2]); }

  // ---- 5. the dormers: shed dormers standing on the slopes — a pale front with a dark window, a tiled top, wooden cheeks
  const wood = new THREE.Color(WOOD), pale = new THREE.Color(SURROUND), dark = new THREE.Color('#2a221f');
  const dormer = (p, q, f, w, h) => { // on the slope from the wall point p up to the ridge point q, a fraction f of the way up
    const D = len(sub(q, p)), d = unit(sub(q, p)), t = [-d[1], d[0]], o = add(p, d, f * D), out = [-d[0], 0, -d[1]];
    const y = Math.min(roofAt(add(o, t, -w / 2)), roofAt(add(o, t, w / 2))) - 0.05, m = roofAt(add(o, d, 1)) - roofAt(o); // (m: how steep the roof is here)
    const back = (h + 0.1) / Math.max(0.3, m - 0.2), ob = add(o, d, back), yb = Math.min(TOP, y + h - 0.2 * back);
    const [l, r, bl, br] = [add(o, t, -w / 2), add(o, t, w / 2), add(ob, t, -w / 2), add(ob, t, w / 2)];
    const quad = (a, b, c, e, colour, want, fac) => { kit.mesher.tri(a, b, c, colour, want, fac); kit.mesher.tri(a, c, e, colour, want, fac); };
    quad(at(l, y), at(r, y), at(r, y + h), at(l, y + h), pale, out);
    const g = 0.2, fl = add(add(o, t, -w / 2 + g), d, -0.04), fr = add(add(o, t, w / 2 - g), d, -0.04);
    quad(at(fl, y + g), at(fr, y + g), at(fr, y + h - g), at(fl, y + h - g), dark, out);
    quad(at(add(l, t, -0.12), y + h), at(add(r, t, 0.12), y + h), at(add(br, t, 0.12), yb), at(add(bl, t, -0.12), yb), tile, up, TILES);
    kit.mesher.tri(at(l, y), at(l, y + h), at(bl, yb), wood, [-t[0], 0, -t[1]]);
    kit.mesher.tri(at(r, y), at(r, y + h), at(br, yb), wood, [t[0], 0, t[1]]);
  };
  const rows = (line, length, bays, skip) => {
    for (let i = 0; i < bays; i++) {
      if (skip(i)) continue;
      const { p } = along(line, ((i + 0.5) / bays) * length), q = onRidge(p);
      if (i % 2 === 1) dormer(p, q, 0.2, 1.7, 1.25); else dormer(p, q, 0.5, 1.2, 0.9);
    }
  };
  // (none in the first bay, at the fire wall, nor over the hip's corner)
  const upTo = (line, p) => total(line.slice(0, line.findIndex((q) => same(p, q)) + 1)); // (how far along a wall the fire wall stands)
  const clear = (line, length, bays, j) => (i) => i === 0 || Math.abs(((i + 0.5) / bays) * length - upTo(line, j)) < 2.2;
  rows(street, frontLength, BAYS, (i) => clear(street, frontLength, BAYS, joint[1])(i) || i >= BAYS - 2);
  rows(open, yardLength, BAYS_YARD, (i) => clear(open, yardLength, BAYS_YARD, joint[0])(i) || i === BAYS_YARD - 1);
  for (const f of [0.36, 0.64]) { const p = along(end, f * endLength).p; dormer(p, add(p, hipOut, -len(sub(eMid, r2))), 0.22, 1.5, 1.1); } // the two on the hip, looking straight out of it

  // ---- 6. the gatehouse at the east end: one low storey under a roof that falls to the street, a round archway and
  //         a small gable over it
  solid(gate, { height: GATE_WALL + GATE_ROOF, roofShape: 'gabled', roofHeight: GATE_ROOF, roofOrientation: 'across' });
  band(gate, 0, PLINTH, 0.07, SANDSTONE);
  const gr = gate.rings[0], gFront = gr.map((p, i) => [p, gr[(i + 1) % gr.length]]).filter(([a, b]) => len(sub(b, a)) > 3)
    .sort((a, b) => dot(sub(mid(...b), c0), v) - dot(sub(mid(...a), c0), v))[0]; // its wall on the street
  const [ga, gb] = dot(sub(gFront[1], gFront[0]), u) > 0 ? gFront : [gFront[1], gFront[0]];
  const gt = unit(sub(gb, ga)), gn = facing(gt, 1), arch = add(ga, gt, 2.3), aw = 2.6, spring = 1.9;
  pane(arch, gn, 0, aw, spring, DARK, 0.08);
  P.put(new THREE.CircleGeometry(aw / 2, 12, 0, Math.PI).rotateY(Math.atan2(-gn[1], gn[0]) + Math.PI / 2).translate(arch[0] + gn[0] * 0.08, spring, arch[1] + gn[1] * 0.08), DARK);
  const gl = add(add(arch, gt, -2.0), gn, 0.06), gR = add(add(arch, gt, 2.0), gn, 0.06), apex = add(arch, gn, 0.06), gh = 1.5, behind = add(arch, gn, -2.6);
  kit.mesher.tri(at(gl, GATE_WALL - 0.05), at(gR, GATE_WALL - 0.05), at(apex, GATE_WALL + gh), plaster, [gn[0], 0, gn[1]]);
  kit.mesher.tri(at(gl, GATE_WALL - 0.05), at(apex, GATE_WALL + gh), at(behind, GATE_WALL + gh), tile, up, TILES);
  kit.mesher.tri(at(gR, GATE_WALL - 0.05), at(apex, GATE_WALL + gh), at(behind, GATE_WALL + gh), tile, up, TILES);

  return { anchor: r1, top: TOP + 0.6 };
}
