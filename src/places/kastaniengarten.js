// The Kastaniengarten: the beer garden under chestnut trees on a spur of the Schlossberg, above the Schwabentor, and
// the Greiffenegg-Schlössle it belongs to — the country house of 1805 that has been an inn since the 1840s.
//
// Where it is: OpenStreetMap has the house as a building (way 118656365, «Greiffenegg-Schlössle», Schlossbergring 3,
// amenity=restaurant, 1 level, a hipped roof) and the beer garden as a POINT (node 32628620, amenity=biergarten,
// name=Kastaniengarten), about 13 m east of the house's east end and 6 m south of a small building OSM calls a kiosk
// (way 285810376). The German Wikipedia's coordinates for the Schlössle (47.99266451 N, 7.85549283 E) fall inside
// the house's outline.
//
// How it is made:
//   - The Schlössle: its walls are OSM's outline, one storey high. On them, by hand, what the photos on Wikimedia
//     Commons show: white walls and dark roofs; a square pavilion with a tall roof that ends in a point; a lower
//     wing with a hipped roof of its own along the side that looks to the town; white dormers
//     («Greiffeneggschlössle (Freiburg) 3239», joergens.mi, 2011, from below; «Greifeneggschlössle auf dem
//     Freiburger Schlossberg», Andreas Schwarzkopf, 2016, from the path above; «2019-04-16, Greiffeneggschlössle auf
//     dem Schlossberg, Blick von der Achteckhalle des Freiburger Münsterturms», Andreas Schwarzkopf). In OSM's
//     outline the pavilion is a square of about 16 m, the wing towards the town about 6 by 18 m, and a smaller wing
//     stands on the far side.
//   - Its terrace: the same photos show the house on a levelled platform held by a rubble wall, with a railing along
//     the edge and a round stone bastion at the corner towards the town (de.wikipedia: of the turret in front of the
//     house, which held a camera obscura, «nur noch der Unterbau» is left). OSM maps a retaining wall along the
//     north-west side that ends in a small round loop (way 1314940307): the platform's edge and the bastion follow it.
//   - The beer garden: a level terrace of gravel between the house, the kiosk, the edge of the park (OSM) and the
//     retaining wall OSM maps below it (way 1492025470), with a wooden fence on the downhill side, rows of beer
//     tables and benches, and chestnut trees. Photos taken in the garden («Freiburger Schlossberg, Kastaniengarten
//     mit Blick auf Schwaben- und Martinstor», 2005, and «… mit Schwabentor», «… mit Blick ins Dreisamtal», 2008,
//     all by Andreas Schwarzkopf) show thick trunks a few metres apart, folding tables with orange-brown tops on
//     grey-blue legs, gravel, and a fence of wooden frames with wire mesh; in the photo of 2005 the roof of the
//     Schlössle is at eye level, so the garden lies higher than the house's floor.
//   - The trees: neither OSM's mapped trees nor the viewer's woods stand on this spot (checked against
//     public/data/city.json), so the chestnuts are drawn here, shaped like the viewer's other trees (src/trees.js).
//
// The ground: the viewer lifts a place as a whole to the lowest ground under its OSM outlines, which here is the
// south corner of the house (about 16 m above the ground at the Münster in the viewer's terrain). That terrain is
// coarse and knows no terraces: under the house alone it climbs 6 m. So the two levels are set by hand: the house's
// platform 5.5 m and the garden 9 m above that lowest point, each just high enough not to be buried on its uphill
// side, and each closed by a wall down to the ground on the downhill side.
//
// ASSUMED: every height (the storey, the roofs, the two levels and the walls under them — no source gives one); the
// shape of the roofs beyond what the photos show, the dormers and all windows and the door; the outline of the
// platform away from OSM's wall; the outline of the beer garden (OSM has it as a point), how far it reaches, the
// number and the places of its tables and of its trees, the size of the trees; that the kiosk is the garden's serving
// hut, and its look; the steps between the two levels (OSM maps a footway there); the colours. The model shows
// today's garden at every stop of the timeline: no source found says how the terrace looked before (the lithograph
// of about 1897 shows a music pavilion and wooden garden halls there, pulled down in 1910; they are not drawn).

import * as THREE from 'three';
import { KIND } from '../kit.js';

export const PLACE = {
  key: 'kastaniengarten',
  name: 'Kastaniengarten',
  localName: 'Beer garden of the Greiffenegg-Schlössle',
  kind: 'group',
  built: { from: 1805 }, // de.wikipedia «Greiffeneggschlössle (Freiburg im Breisgau)»: «Im Jahre 1805 ließ sich … Hermann von Greiffenegg seinen Altersruhesitz … bauen»
  // (no `since`: the house is older than the first stop of the timeline, 1838; no source found dates the beer garden)
  coordinates: [47.99266451, 7.85549283], // de.wikipedia «Greiffeneggschlössle (Freiburg im Breisgau)», the article's coordinates: inside OSM's outline of the house
  osm: 'w118656365',
  sources: [
    'German Wikipedia, «Greiffeneggschlössle (Freiburg im Breisgau)»: coordinates (47.99266451 N, 7.85549283 E); on the Schlossberg «auf 300 m Höhe oberhalb des Schwabentores und unterhalb des Kanonenplatzes»; «Im Jahre 1805 ließ sich der letzte österreichische Regierungspräsident … Hermann von Greiffenegg seinen Altersruhesitz auf einer Nase des Schlossbergs und den Trümmern der Vauban’schen Festungsanlage bauen», the ground his since 1791, a country house in the Empire style; the stone by the entrance, «Qvieti Sacrum, Herm. de Greiffenegg, anno MDCCCV»; he lived in it two years; his son Hermann Gottlob lived there from 1833 to 1840 and sold it to the wife of the brewer Franz Schaich; «Danach diente es bis heute durchgehend als Gastbetrieb, von 1841 bis 1908 im Zusammenhang mit der … Schlossbergbrauerei, welche unmittelbar unterhalb des Schlösschens lag»; sold to the brewer Georg Stratz in 1876 and by his widow to the brewer Georg Rommel in 1885; bought by the city at a forced sale in 1902, which fixed the inn’s name «Greiffenegg-Schlössle» in 1914; the lithograph of about 1897 with the music pavilion «mit zwei Türmchen» and the wooden «Gartenhallen», «Beide wurden 1910 abgerissen», and the turret with the camera obscura, of which «nur noch der Unterbau» is left; «In den Gebäuden ist heute ein Restaurant mit Biergarten untergebracht»',
    'German Wikipedia, «Schlossberg (Freiburg im Breisgau)»: «Auf den überwucherten Trümmern eines unteren Vorsprungs des Schlossbergs ließ der österreichische Regierungspräsident Hermann von Greiffenegg 1805 eine Residenz errichten. Dieses … Gebäude ist heute ein Restaurant mit einem Kastanien-Biergarten»; the French blew up the fortifications in 1744/45',
    'The restaurant’s own site, greiffenegg.de (home page and «Kastaniengarten»): «in unserem Kastaniengarten sitzt man windgeschützt unter prachtvollen Bäumen»; «Der Kastaniengarten ist einer der schönsten und ältesten Biergärten Südbadens» (no year); the address, Schlossbergring 3. It gives no number of seats',
    'historische-gasthaeuser.de, «Greiffenegg Schlössle»: «Ab 1790 ließ sich Hermann von Greiffenegg (1737 – 1807) … das Greiffenegg-Schlössle als seinen Altersruhesitz erbauen, welchen er 1805 bezog»; «Gasthaus seit 1914»; the brewers Schaich and Rommel stored the beer of their Schlossbergbrauerei in the cellars of the Schlossberg, «Ab dieser Zeit wird das Greiffeneggschlössle auch bewirtschaftet»; the hosts since the 1920s',
    'OpenStreetMap: way 118656365 («Greiffenegg-Schlössle», amenity=restaurant, building:levels=1, roof:shape=hipped), the outline of the house; node 32628620 (amenity=biergarten, name=Kastaniengarten), where the beer garden is; way 285810376 (building=kiosk), its outline; ways 1492025470 and 1314940307 (barrier=retaining_wall), the wall below the garden and the wall with the round bastion; the edge of the park (leisure=park) and the footway between the house and the garden. No heights',
    'Wikimedia Commons, «Greiffeneggschlössle (Freiburg) 3239» (joergens.mi, 2011, CC BY-SA 3.0): the house from below — white walls, dark roofs, the tall roof in the middle, white dormers, the railing, the rubble wall and the round bastion',
    'Wikimedia Commons, «Greifeneggschlössle auf dem Freiburger Schlossberg» (Andreas Schwarzkopf, 2016, CC BY-SA 3.0) and «2019-04-16, Greiffeneggschlössle auf dem Schlossberg, Blick von der Achteckhalle des Freiburger Münsterturms» (Andreas Schwarzkopf, CC BY-SA 4.0): the wing with its own hipped roof in front of the taller roof; the large trees behind the house',
    'Wikimedia Commons, «Freiburger Schlossberg, Kastaniengarten mit Blick auf Schwaben- und Martinstor» (2005), «Freiburger Schlossberg, Kastaniengarten mit Schwabentor» and «… mit Blick ins Dreisamtal» (2008), all by Andreas Schwarzkopf, CC BY-SA 3.0: the garden — the trunks, the beer tables and benches, the gravel, the fence, and the roof of the Schlössle at eye level',
    'Wikimedia Commons, «Greiffeneggschlösschen (1897)» (lithograph by Michael Wachter, public domain): the house in about 1897 with the music pavilion, the garden halls and the turret on the bastion',
  ],
  assumptions: [
    'every height: the storey of the house (3.6 metres), its roofs, the level of its platform and of the garden, and the walls under them',
    'the roofs beyond what the photos show (a square pavilion with a pointed roof, two lower wings with hipped roofs), the dormers, every window and the door',
    'the outline of the platform around the house, except where OpenStreetMap maps its wall and the round bastion',
    'the outline of the beer garden, which OpenStreetMap maps as a point: drawn between the house, the kiosk, the edge of the park and the retaining wall below',
    'the number and the places of the tables and benches (23 sets are drawn), and of the chestnut trees (5), and the size of the trees',
    'that the kiosk OpenStreetMap maps at the upper edge is the garden’s serving hut, and what it looks like',
    'the steps between the house and the garden (OpenStreetMap maps a footway there), the fence and the railings',
    'the ground: the viewer’s terrain is coarse on the hill, so both levels are set by hand and closed by walls on the downhill side',
    'that the terrace looked like this at every year of the timeline: it is today’s garden; the music pavilion and the garden halls that stood here until 1910 are not drawn',
  ],
  card: {
    title: 'Kastaniengarten',
    years: 'The Schlössle: 1805 · an inn since the 1840s',
    text: [
      'The beer garden lies under chestnut trees on a spur of the Schlossberg, above the Schwabentor. It belongs to the restaurant in the Greiffenegg-Schlössle next to it. The restaurant calls it «einer der schönsten und ältesten Biergärten Südbadens», one of the oldest beer gardens of southern Baden, but gives no year, and no other source found dates it.',
      'Hermann von Greiffenegg, the last Austrian governor in Freiburg, had the house built as a country house for his old age, on the rubble of the French fortress blown up in 1744/45. The German Wikipedia says it was built in 1805; a guide to historic inns says it was built from 1790 and that he moved in in 1805. By the entrance he had a stone set with the words «Qvieti Sacrum», sacred to quiet. He died two years later.',
      'His son lived in the house from 1833 to 1840 and then sold it to the wife of the brewer Franz Schaich. It has been an inn ever since, until 1908 together with the Schlossberg brewery, which stood right below it. A lithograph of about 1897 shows a music pavilion with two turrets and wooden garden halls beside the house; both were pulled down in 1910. The round wall at the corner carried a turret with a camera obscura.',
      'The city bought the property at a forced sale in 1902 and gave the inn its name, «Greiffenegg-Schlössle», in 1914. Before that people called it after its owners, the brewers Stratz and Rommel.',
      'The outline of the house, the kiosk and the walls are OpenStreetMap’s, which marks the beer garden only as a point. Its outline, the tables, the trees and every height are guesses, made from photos. The garden is shown as it is today at every year of the timeline.',
    ],
  },
};

// OSM's outlines (https://www.openstreetmap.org/way/<number>)
const HOUSE = 'w118656365', KIOSK = 'w285810376';
// the frame of the house: x along its long front (east and a little north), z across it (towards the valley); read
// off OSM's outline, whose long south-east edge runs 17° north of east
const ORIGIN = [185, 321], ANGLE = (16.99 * Math.PI) / 180;
// heights in metres — ALL ASSUMED (see the top of the file); 0 is the lowest ground under OSM's outlines
const FLOOR = 5.5, GARDEN = 9.0;                 // the house's platform and the beer garden
const FOOT = { platform: -1.2, garden: 2.8 };    // how far down their walls go: just below the viewer's ground on the downhill side
const WALL = 3.6, EAVES = FLOOR + WALL + 0.2;    // one storey (OSM: building:levels=1), and the slab the roofs sit on
const ROOF = { pavilion: 5.2, wing: 2.9, east: 2.3 }, KIOSK_FOOT = 1.0;
// the places of the garden's trees, in world metres (ASSUMED: the photos show trunks a few metres apart) and their heights
const TREES = [[202.6, 310.6, 14.5], [203.6, 318.6, 13.5], [209.8, 310.2, 15], [210.9, 316.6, 14], [217.2, 313.5, 13]];
// what OSM maps around the garden, in world metres: the retaining wall below it (way 1492025470), the corner of the
// park (leisure=park) and the upper end of the footway from the house
const WALL_BELOW = [[198.5, 325.1], [222.4, 316.2]], PARK_CORNER = [221.09, 312.31], PATH_TOP = [199.52, 307.26];
const WHITE = '#f1ede4', SLATE = '#5b5652', RUBBLE = '#b3a48f', PAVING = '#cfc8b8', GRAVEL = '#d2c5a6', PLASTER = '#e6dcc6';
const TABLE = '#b4572f', LEGS = '#66828a', WOOD = '#7c6449', BARK = '#5d4a38', DARK = 'OPENING';
const GREENS = ['#5f8a3e', '#6e9a47', '#517a38', '#7aa550', '#5a8444']; // (the greens of src/trees.js)

const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };

export function build(kit, parts) {
  const house = parts.find((b) => b.id === HOUSE), kiosk = parts.find((b) => b.id === KIOSK);
  if (!house || !kiosk) throw new Error('Kastaniengarten: OSM outlines missing from city.json (the Schlössle or the kiosk)');

  const W = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }), WS = kit.frame({ x: 0, z: 0, kind: KIND.STONE }); // world metres: plain, and stone
  const H = kit.frame({ x: ORIGIN[0], z: ORIGIN[1], angle: ANGLE, kind: KIND.PLAIN });                     // the house's frame
  const at = (x, y, z) => { const [wx, wz] = H.toWorld(x, z); return [wx, y, wz]; };
  const turn = (dx, dz) => Math.atan2(-dz, dx); // (the turn that lays a box's long side along a direction)
  /** a line of posts with two rails along the points [[x, z], …], standing on y (in the frame `F`) */
  const fence = (F, pts, y, colour, h = 1.05, gap = 2.4) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / gap)), r = turn(bx - ax, bz - az);
      for (const top of [h - 0.08, h * 0.45]) F.box(len, 0.08, 0.07, (ax + bx) / 2, y + top, (az + bz) / 2, colour, r);
      for (let k = i ? 1 : 0; k <= n; k++) F.put(new THREE.CylinderGeometry(0.075, 0.075, h, 4, 1, true).translate(0, h / 2, 0), colour, new THREE.Matrix4().makeTranslation(ax + ((bx - ax) * k) / n, y, az + ((bz - az) * k) / n));
    }
  };

  // ------------------------------------------------------------------------------ 1. the platform under the house
  // Its edge: OSM's wall on the north-west side (from 176.3, 308.2 to 167.0, 314.0), round the bastion at its end,
  // then along the side towards the town and the valley (ASSUMED: 1 to 4 m in front of the house), to the wall below
  // the garden.
  const bastion = { x: -17.29, z: -10.83, r: 2.4 }; // (the loop at the end of OSM's wall, in the house's frame)
  const arc = Array.from({ length: 7 }, (_, i) => { const a = ((-28 - 44 * i) * Math.PI) / 180; return [bastion.x + bastion.r * Math.cos(a), bastion.z + bastion.r * Math.sin(a)]; });
  const edge = [[-4.58, -14.78], ...arc, [-16.4, -7.0], [-15.9, 2.5], [-14.3, 8.8], [-9.6, 10.6], [8.6, 10.6]].map(([x, z]) => H.toWorld(x, z)); // (from the north, round by the west, to the south-east)
  const gardenWest = [PATH_TOP, [199.3, 320.0], WALL_BELOW[0]]; // where the garden's wall rises from the platform
  const platform = [...edge, ...gardenWest.slice().reverse(), H.toWorld(18.0, -11.0)];
  WS.prism(platform, FOOT.platform, FLOOR - 0.12, RUBBLE);
  W.prism(platform, FLOOR - 0.12, FLOOR, PAVING);
  fence(W, [...edge, WALL_BELOW[0]], FLOOR, WHITE, 1.0, 2.2);
  // a few tables by the railing on the side towards the town (the photo of 2016 shows some there)
  for (const z of [-5.2, -2.4, 0.4, 3.2, 6.0]) H.box(0.8, 0.74, 0.8, -14.6, FLOOR, z, WHITE);

  // ------------------------------------------------------------------------------------------------ 2. the house
  const ring = house.rings[0];
  W.prism(ring, FLOOR, FLOOR + WALL, WHITE);
  W.prism(ring, FLOOR + WALL, EAVES, SLATE); // (the flat of the eaves: the roofs below sit on it)
  // its openings, along every side of OSM's outline that is long enough (ASSUMED); the door in the entrance bay
  ring.forEach((p, i) => {
    const q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz); if (len < 2.4) return;
    const door = i === 18, n = door ? 1 : Math.max(1, Math.round(len / 2.5));
    for (let k = 0; k < n; k++) { const t = (k + 0.5) / n; W.box(door ? 1.5 : 1.0, door ? 2.4 : 1.65, 0.16, p[0] + dx * t, FLOOR + (door ? 0 : 0.95), p[1] + dz * t, DARK, turn(dx, dz)); }
  });
  // the roofs: over the square pavilion a roof that ends (almost) in a point, over each wing a lower hipped one
  const tile = new THREE.Color(SLATE), TILES = [1e4, -1e4, 0.4, KIND.TILES], up = [0, 1, 0]; // (no ridge or eaves shading: the shader measures those from the ground)
  const slope = (...p) => { for (let i = 1; i < p.length - 1; i++) kit.mesher.tri(p[0], p[i], p[i + 1], tile, up, TILES); };
  const hipped = (x0, x1, z0, z1, h) => {
    const alongX = x1 - x0 >= z1 - z0, half = (alongX ? z1 - z0 : x1 - x0) / 2, y = EAVES;
    const c = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => at(x, y, z));
    const a = alongX ? at(x0 + half, y + h, (z0 + z1) / 2) : at((x0 + x1) / 2, y + h, z0 + half), b = alongX ? at(x1 - half, y + h, (z0 + z1) / 2) : at((x0 + x1) / 2, y + h, z1 - half);
    if (alongX) { slope(c[0], c[1], b, a); slope(c[1], c[2], b); slope(c[2], c[3], a, b); slope(c[3], c[0], a); }
    else { slope(c[0], c[1], a); slope(c[1], c[2], b, a); slope(c[2], c[3], b); slope(c[3], c[0], a, b); }
  };
  const P = { x0: -8.15, x1: 8.0, z0: -7.0, z1: 9.27 }, WG = { x0: -13.1, x1: -7.0, z0: -10.5, z1: 7.0 }, EW = { x0: 8.0, x1: 12.95, z0: -6.85, z1: 3.0 }; // (the pavilion and the wings, read off OSM's outline)
  hipped(P.x0, P.x1, P.z0, P.z1, ROOF.pavilion);
  hipped(WG.x0, WG.x1, WG.z0, WG.z1, ROOF.wing);
  hipped(EW.x0, EW.x1, EW.z0, EW.z1, ROOF.east);
  // white dormers: a box that comes out of the slope, with its window and a dark lid. (cx, cz): the middle of its
  // front; (nx, nz): the way it looks; `rise`: how fast the roof climbs behind the eaves; `back`: how far it stands in
  const dormer = (cx, cz, nx, nz, rise, back) => {
    const h = 1.25, w = 1.3, depth = h / rise + 0.1, y = EAVES + rise * back - 0.1, mx = cx - nx * (depth / 2), mz = cz - nz * (depth / 2);
    H.box(nx ? depth : w, h, nx ? w : depth, mx, y, mz, WHITE);
    H.box(nx ? depth + 0.2 : w + 0.25, 0.1, nx ? w + 0.25 : depth + 0.2, mx + nx * 0.1, y + h, mz + nz * 0.1, SLATE);
    H.box(nx ? 0.08 : 0.8, 0.8, nx ? 0.8 : 0.08, cx, y + 0.25, cz, DARK);
  };
  const pr = ROOF.pavilion / ((P.x1 - P.x0) / 2), wr = ROOF.wing / ((WG.x1 - WG.x0) / 2);
  for (const z of [-7.2, 3.8]) dormer(WG.x0 + 0.7, z, -1, 0, wr, 0.7);                                         // on the wing, towards the town
  for (const z of [-1.6, 3.9]) dormer(P.x0 + 4.2, z, -1, 0, pr, 4.2);                                          // on the tall roof, above the wing
  for (const x of [-2.6, 2.6]) dormer(x, P.z1 - 1.6, 0, 1, pr, 1.6);                                           // towards the valley
  dormer(0.9, P.z0 + 1.6, 0, -1, pr, 1.6);                                                                     // over the entrance

  // ----------------------------------------------------------------------------------------- 3. the beer garden
  // Its outline (ASSUMED: OSM has a point): from the top of the footway along the house, the retaining wall below
  // (OSM), the corner of the park (OSM), and round behind the kiosk, where the slope takes it in.
  const garden = [...gardenWest, WALL_BELOW[1], PARK_CORNER, [213.2, 298.9], [205.5, 296.2], [200.6, 296.4]];
  WS.prism(garden, FOOT.garden, GARDEN - 0.15, RUBBLE);
  W.prism(garden, GARDEN - 0.15, GARDEN, GRAVEL);
  fence(W, [...gardenWest, WALL_BELOW[1], PARK_CORNER], GARDEN, WOOD, 1.1, 2.4);
  // the kiosk, on OSM's outline (ASSUMED: one low storey under a hipped roof, on a foot that takes up the slope behind it)
  WS.prism(kiosk.rings[0], GARDEN, GARDEN + KIOSK_FOOT, RUBBLE);
  kit.osm([{ ...kiosk, levels: null, height: 4.2, roofShape: 'hipped', roofHeight: 1.6, colour: PLASTER, roofColour: SLATE }], { walls: KIND.PLAIN, roof: KIND.PLAIN, lift: GARDEN + KIOSK_FOOT });
  { // its serving hatch, on the longest side that looks into the garden (ASSUMED)
    const r = kiosk.rings[0], c = [r.reduce((t, p) => t + p[0], 0) / r.length, r.reduce((t, p) => t + p[1], 0) / r.length];
    const south = r.map((p, i) => [p, r[(i + 1) % r.length]]).filter(([p, q]) => (p[1] + q[1]) / 2 > c[1]).sort((e, g) => Math.hypot(g[1][0] - g[0][0], g[1][1] - g[0][1]) - Math.hypot(e[1][0] - e[0][0], e[1][1] - e[0][1]))[0];
    if (south) { const [p, q] = south; W.box(Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.55, 1.1, 0.16, (p[0] + q[0]) / 2, GARDEN + KIOSK_FOOT + 1.0, (p[1] + q[1]) / 2, DARK, turn(q[0] - p[0], q[1] - p[1])); }
  }
  // the steps from the house's platform up to the garden, where OSM maps a footway
  const STEPS = 10, run = 13 / STEPS, riser = (GARDEN - FLOOR) / STEPS;
  for (let i = 0; i < STEPS; i++) H.box(run + 0.02, (i + 1) * riser + 1, 2.1, 4.5 + (i + 0.5) * run, FLOOR - 1, -9.95, RUBBLE);

  // the chestnut trees: a trunk and a crown like those of src/trees.js — a ball pushed in and out into lumps and
  // flattened underneath, which keeps the ball's normals so that the light falls on it softly
  const LEAF = kit.frame({ x: 0, z: 0, kind: KIND.FOLIAGE });
  TREES.forEach(([x, z, h], i) => {
    const base = h * 0.36, R = h * 0.33, g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3();
    const bump = (a, b, c) => Math.sin(a * 3.1 + i) * Math.sin(b * 2.7 + i * 1.7) * Math.sin(c * 3.3 + i * 0.6) + 0.25 * Math.sin(a * 6.3 + b * 5.1 + i) * Math.sin(c * 5.7 + b * 4.3); // (gentler than there: this mesh gets ink lines on its sharp edges)
    for (let k = 0; k < p.count; k++) {
      v.fromBufferAttribute(p, k).normalize(); n.setXYZ(k, v.x, v.y, v.z);
      const r = 1 + 0.17 * bump(v.x, v.y, v.z), squash = v.y < -0.35 ? 0.55 : 1;
      p.setXYZ(k, v.x * r, v.y * r * squash, v.z * r);
    }
    const normals = Array.from(n.array), from = kit.mesher.nor.length;
    LEAF.put(g, GREENS[i % GREENS.length], new THREE.Matrix4().makeTranslation(x, GARDEN + base + (h - base) / 2, z).multiply(new THREE.Matrix4().makeScale(R, (h - base) / 2, R)));
    if (kit.mesher.nor.length - from === normals.length) for (let k = 0; k < normals.length; k++) kit.mesher.nor[from + k] = normals[k]; // (the ball's normals instead of each face's own)
    W.cylinder(0.45, base + 1.4, x, GARDEN, z, BARK, 7, 0.3);
  });

  // the beer tables: a table between two benches, in rows along the wall, wherever a set fits between the fence, the
  // kiosk and the trunks
  const seating = [[199.9, 308.3], [199.7, 320.0], [199.4, 324.1], [221.5, 315.9], [220.2, 312.7], [211.3, 308.2], [203.4, 306.9]]; // (the gravel that is free, a little inside the garden's edge)
  const a = turn(WALL_BELOW[1][0] - WALL_BELOW[0][0], WALL_BELOW[1][1] - WALL_BELOW[0][1]);
  const G = kit.frame({ x: WALL_BELOW[0][0], z: WALL_BELOW[0][1], angle: a, kind: KIND.PLAIN }); // (x along the wall, the garden on the −z side)
  let sets = 0;
  for (let z = -1.7; z > -20; z -= 2.25) for (let x = 1.7; x < 26; x += 2.95) {
    const corners = [[-1.25, -0.8], [1.25, -0.8], [1.25, 0.8], [-1.25, 0.8]].map(([dx, dz]) => G.toWorld(x + dx, z + dz)), [cx, cz] = G.toWorld(x, z);
    if (!corners.every(([px, pz]) => inside(seating, px, pz)) || TREES.some(([tx, tz]) => Math.hypot(tx - cx, tz - cz) < 1.8)) continue;
    G.box(2.2, 0.05, 0.5, x, GARDEN + 0.72, z, TABLE);
    for (const s of [-1, 1]) {
      G.box(0.05, 0.72, 0.42, x + s * 0.85, GARDEN, z, LEGS);
      G.box(2.2, 0.05, 0.25, x, GARDEN + 0.42, z + s * 0.52, TABLE);
      for (const e of [-1, 1]) G.box(0.05, 0.42, 0.22, x + e * 0.85, GARDEN, z + s * 0.52, LEGS);
    }
    sets++;
  }
  if (!sets) throw new Error('Kastaniengarten: no table fits in the garden');

  return { anchor: [209.5, 313.5], top: GARDEN + 15 };
}
