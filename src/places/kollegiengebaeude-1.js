// The Kollegiengebäude I (KG I), the main building of the University of Freiburg, on Platz der Universität — as it
// has stood since it was raised after the fire of 1934.
//
// How it is made:
//   - The plan is OpenStreetMap's 13 building:parts of the building (relation 5626): the ranges around the inner
//     courtyard (ways 1172673727, …29, …38), the Aula in the west range, which bulges out on both sides (way …28, with
//     its roof, way …26), the part inside the south-west block (way …37), the long wing to the east (way …30) with the
//     tower in its corner (way …31), and on its south side the round wing (way …35), its neck (way …32)
//     and two low wings (ways …33, …34). The walls are those outlines, raised to OSM's number of storeys: 4 for the
//     ranges, 2 and 2.5 for the low parts, 9 for the tower.
//   - OSM gives storeys, not metres, and the storeys of this building are tall. A storey is taken as 4.9 m: in
//     Willy Pragher's frontal photograph of 28 November 1951 (Wikimedia Commons, «Freiburg i. Br.: Universität,
//     Kollegiengebäude I Frontalansicht») the south front, 45.8 m wide in OSM, measures 840 px across and 360 px from
//     the ground to the eaves, which makes the eaves about 19.6 m, a quarter of that per storey. The same photo gives
//     the roof (118 px, about 6.5 m) and the rows of windows.
//   - The roofs are made by hand, one hipped roof per range, all of the same pitch (the 6.5 m of the photo over the
//     7 m half-depth of a range), in slate: OSM tags each part «hipped», but its parts are L- and U-shaped, and one
//     hip over such a shape comes out wrong. OSM gives the north and north-east ranges (way …29) one roof storey and
//     the others two: their roofs are drawn half as steep. Where two ranges meet, one roof runs into the other.
//   - Made by hand after photos (all on Wikimedia Commons; the ones of 2007 and 2009 are also among the place's
//     photos):
//       · the aerial view of 21 October 2012 (Taxiarchos228, «Aerial View - Freiburg im Breisgau-Innenstadt1»): the
//         dark slate roofs, the green copper of the round wing's dome and of the tower's cap, the copper over the
//         Aula's bulge and the pale walls of the inner courtyard;
//       · «Uni Freiburg - KGI» (Michael Schmalenstroer, January 2007): the round wing with two rows of tall
//         windows under a low copper dome, the tower behind it and the block at the south-east end;
//       · «Turm der Freiburger Universität am Kollegiengebäude I» (Andreas Schwarzkopf, 2015): the top of the tower —
//         a clock on each face it shows, a storey with three windows a side, a heavy cornice on corbels, a smaller
//         storey set back, and a low four-sided copper cap with a flagpole;
//       · «Kollegiengebäude I Universität Freiburg 01» (Giftzwerg 88, 2023): the west front, with the bulge of the
//         Aula, its tall windows and the band of glass under the eaves;
//       · «Kolleggebäude I Uni.Fr» (Joergens.mi, 2009) and Pragher's photo of 1951: the south front — nine window
//         axes, the portal in the middle at the top of a flight of steps, the two seated figures on round plinths
//         beside it, the coat of arms over the door, and five dormers on the roof.
//   - Colours: OSM's building:colour is #BD8089; the walls are drawn in the red sandstone of the photos (#ad685c),
//     the roofs in slate (the aerial view shows them almost black: drawn lighter, or they read as holes).
//
// ASSUMED: the storey height (4.9 m, read off the 1951 photo as above) and with it every height, the tower's
// included (9 storeys in OSM); the pitch and the height of the roofs, and that the south range's roof is as deep as
// the long wing's; the number, size and rhythm of the windows on every side but the south front (there: nine axes,
// placed by eye on the photos); the size of the dormers, the portal, the steps, the plinths and the figures; the
// heights of the tower's upper stages, the shape of its cap, the size of its clocks and that all four faces have one
// (the photos show two faces at a time); the column of small windows up the tower; the height and the profile of the
// round wing's dome; the lean-to roofs of the low wings; the colour of the flat roof inside the south-west block (and
// what that part is: OSM does not say); that the courtyard walls are pale all around. Not drawn: the lettering of the
// inscriptions, the coat of arms' carving, the eyebrow dormers and skylights, the chimneys, the escape stairs.

import * as THREE from 'three';
import { KIND } from '../kit.js';

export const PLACE = {
  key: 'kollegiengebaeude-1',
  name: 'Kollegiengebäude I',
  localName: 'University main building (KG I)',
  kind: 'building',
  // de «Albert-Ludwigs-Universität Freiburg» and de «Hermann Billing»: 1907–1911; de «Friedrich Ratzel (Architekt)»:
  // 1906–1911; en «University of Freiburg»: «built in 1911». Raised: de, «Beim Wiederaufbau 1936 wurde das Gebäude
  // aufgestockt»; the inscription on the building reads «nach dem Brande 1934 aufgestockt 1935-36» (Commons).
  built: { from: 1907, to: 1911, raised: [1935, 1936] },
  since: 1911, // (the year every source gives for its completion: not there at the stop of 1903, standing from 1920 on)
  // 1944: «schwer beschädigt» is all the written sources say; the damage map has it black, and a photo shows one
  // stretch of a front torn open — nothing says the whole building lost its roof, so the weaker state. `rebuilt` is
  // not the year of the repair (not found) but the year of the first dated photo that shows it whole again.
  war: { state: 'damaged', rebuilt: 1951, source: 'Wikimedia Commons, caption of «Landappbw 763196 1819 Universität Kollegiengebäude I Freiburg»: «1944 schwer beschädigt»; Willy Pragher’s photo «Zerstörte Fassade Kollegiengebäude I der Universität»: one stretch of a front torn open from roof to ground; his photos of 28 November 1951 show the building whole, with roofs and tower' },
  coordinates: [47.993859, 7.846078], // de.wikipedia «Liste von historischen Objekten in der Freiburger Altstadt», entry «Uni-Kollegiengebäude I»
  osm: 'r5626',
  sources: [
    'German Wikipedia, «Albert-Ludwigs-Universität Freiburg»: «Das Kollegiengebäude I, Hauptgebäude und Sitz der Theologischen sowie der Philosophischen Fakultät, ist ein Bauwerk im Jugendstil. Es wurde 1907–1911 nach Plänen von Friedrich Ratzel und Hermann Billing errichtet»; the red sandstone front and the tower, with two «Karzerräume»; the sculptures of Homer and Aristotle beside the entrance, made in 1915 by Cipri Adolf Bermann of Vöhrenbach; the inscription over the entrance, «AEDEM A PATRE STUDIIS DEDICATAM EREXIT FRIDERICUS II»; the motto on the west front over the windows of the Aula, «DIE WAHRHEIT WIRD EUCH FREI MACHEN»; the fire of 10 July 1934, which destroyed «zahlreiche Institute und die Aula im obersten Stockwerk»; «Beim Wiederaufbau 1936 wurde das Gebäude aufgestockt»; the inscription «Dem ewigen Deutschtum» over the entrance, once gilded, scraped out on French orders after the war',
    'German Wikipedia, «Friedrich Ratzel (Architekt)»: Ratzel died on 5 July 1907; «1906–1911: Kollegienhaus der Albert-Ludwigs-Universität in Freiburg … (nach Ratzels Tod durch Hermann Billing erheblich verändert ausgeführt)»',
    'German Wikipedia, «Hermann Billing»: «1907–1911: Kollegiengebäude I der Albert-Ludwigs-Universität Freiburg (verändert)»',
    'English Wikipedia, «University of Freiburg»: «the Jugendstil Kollegiengebäude I (short: "KG I"), built in 1911 by Hermann Billing»',
    'German Wikipedia, «Liste von historischen Objekten in der Freiburger Altstadt», entry «Uni-Kollegiengebäude I», Platz der Universität 3: coordinates (47.993859 N, 7.846078 E); architects Friedrich Ratzel and Hermann Billing; a protected monument («Kulturdenkmal gem. § 12 DSchG»)',
    'Wikimedia Commons, «Landappbw 763196 1819 Universität Kollegiengebäude I Freiburg» (Klemens Maier, CC0), its description: «1906 Grundsteinlegung 1936 erweitert 1944 schwer beschädigt»; and «Kollegiengebäude I der Albert-Ludwigs-Universität Freiburg mit Inschrift nach dem Brande 1934 aufgestockt» (Andreas Schwarzkopf, 2020), whose description gives the inscription as «nach dem Brande 1934 aufgestockt 1935-36»',
    'Wikimedia Commons, «Freiburg i. Br.: Zerstörte Fassade Kollegiengebäude I der Universität» (Willy Pragher, Staatsarchiv Freiburg W 134 Nr. 017610a and b, CC BY 4.0; a photograph of a print, dated there «after 1952», which cannot be the year of what it shows): one stretch of a stone front torn open from the roof to the ground, the floors hanging, the roof above it broken, rubble at its foot; the walls on either side standing to the eaves. Which front it is cannot be told from the picture',
    'Wikimedia Commons, «Freiburg i. Br.: Universität, Kollegiengebäude I vom Werthmannhaus aus» (Willy Pragher, 28 November 1951, Staatsarchiv Freiburg W 134 Nr. 019346a, CC BY 4.0): the building whole again — the roof and dormers of the front with the main entrance, the dome of the round wing, the tower with its cap',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): nearly all of the footprint is black. German Wikipedia, «Albert-Ludwigs-Universität Freiburg»: «Bei Kriegsende war die Universität durch alliierte Bombenangriffe zu 65–80 Prozent zerstört»',
    'Wikimedia Commons, «Freiburg i. Br.: Universität, Kollegiengebäude I Frontalansicht» (Willy Pragher, 28 November 1951, Landesarchiv Baden-Württemberg, CC BY 4.0): the proportions of the south front — the height of the eaves and of the roof against the width of the front, the rows of windows, the nine axes, the five dormers',
    'Wikimedia Commons, photos of 2007 to 2023 (listed at the top of the place’s file): the colours, the roofs, the dome of the round wing, the top of the tower, the west front and the portal',
    'OpenStreetMap, relation 5626 and its 13 building:parts: the footprint, the number of storeys of each part (4; 2 and 2.5 for the low parts; 9 for the tower), which parts have a hipped, a flat or a domed roof and how many roof storeys, building:colour #BD8089',
  ],
  assumptions: [
    'every height: OSM gives storeys, not metres; a storey is taken as 4.9 m, read off the 1951 photo of the south front against the width of that front in OSM — the tower (9 storeys in OSM) comes out at 44 m to the foot of its cap',
    'the pitch and height of the roofs (one pitch for all, half of it where OSM gives one roof storey), and how the roofs of the ranges run into each other',
    'the windows: their number, size and rhythm on every side except the south front, where the nine axes are placed by eye on the photos',
    'the size of the five dormers, of the portal with its steps, and of the plinths and figures of Homer and Aristotle',
    'the tower above the roofs: the heights of its stages, the shape of the copper cap, the size of the clocks, that all four faces have one (the photos show two faces at a time), and the small windows up its shaft',
    'the height and profile of the copper dome over the round wing on the south side, and the lean-to roofs of the low wings beside it',
    'the colour of the flat roof inside the south-west block, and that the courtyard walls are pale all around (the 2012 aerial view shows two sides)',
    'not drawn: the inscriptions, the carving of the coat of arms, the small dormers and skylights, the chimneys',
  ],
  card: {
    title: 'Kollegiengebäude I',
    years: 'completed 1911 · raised 1936 · badly damaged 1944',
    text: [
      'The university’s main building was completed in 1911, in the Jugendstil, with fronts of red sandstone and a tower. Friedrich Ratzel drew the plans; he died in July 1907, and Hermann Billing carried them out with considerable changes. The German Wikipedia gives the start of the work as 1907 on two pages and as 1906 on a third.',
      'It is the seat of the faculties of theology and philosophy. In the tower are two «Karzer» rooms (a Karzer was a university’s lock-up for its students).',
      'Sculptures of Homer and Aristotle, made in 1915 by Cipri Adolf Bermann, flank the entrance. Above it is cut «AEDEM A PATRE STUDIIS DEDICATAM EREXIT FRIDERICUS II», and on the west front, over the windows of the Aula, the university’s motto: «DIE WAHRHEIT WIRD EUCH FREI MACHEN».',
      'On 10 July 1934 a fire destroyed many institutes and the Aula on the top floor. When it was rebuilt, in 1936, the building was raised, and the university’s leaders had «Dem ewigen Deutschtum» cut over the entrance; it was gilded, and after the war the French had the gilding scraped out.',
      'In 1944 the building was badly damaged («schwer beschädigt», says a photo caption on Wikimedia Commons). The city’s damage map of the air raid of 27 November 1944 marks it black, for heavy damage to total loss, and a photograph by Willy Pragher shows one stretch of a front torn open from the roof to the ground. No source found gives the year of the repair: Pragher’s photographs of 28 November 1951 show the building whole again, with its roofs and its tower.',
      'The plan and the number of storeys are OpenStreetMap’s. Every height is a guess — 4.9 metres a storey, read off a photo of 1951 — and so are the pitch of the roofs, the windows, the dormers, the portal, the copper dome of the round wing and the top of the tower, all placed by eye from photos. It is drawn as it stands today at every stop of the timeline, also at those before 1936.',
    ],
  },
};

// OSM's parts (https://www.openstreetmap.org/way/<number>)
const PART = {
  west: 'w1172673727',     // the west range, north of the Aula
  aula: 'w1172673728',     // the Aula: the middle of the west range, bulging out to the street and to the courtyard
  aulaRoof: 'w1172673726', // (its roof: a part that starts at the 4th storey)
  north: 'w1172673729',    // the north range and the north half of the east range of the courtyard
  south: 'w1172673738',    // the south-west block: three ranges around way …37
  hall: 'w1172673737',     // the part inside it (a flat roof in OSM; what it is, OSM does not say)
  turret: 'w1172673736',   // a half-round turret in the courtyard
  long: 'w1172673730',     // the long wing to the east, with the block at its south-east end
  tower: 'w1172673731',
  neck: 'w1172673732',     // between the long wing and the round wing
  rotunda: 'w1172673735',  // the round wing on the south side
  lowW: 'w1172673734',     // the low wings on either side of the neck
  lowE: 'w1172673733',
};

const STOREY = 4.9;  // metres per storey (ASSUMED: see the top of the file)
const PITCH = 6.5 / 7; // the roofs: metres up per metre in from the eaves (ASSUMED: the 1951 photo's 6.5 m over a 7 m half-depth)
const ROWS = [[1.7, 3.4], [7.6, 2.4], [12.4, 2.3], [16.6, 2.0]]; // the four rows of windows: sill and height (read off the 1951 photo)
const LOW_ROWS = [[1.5, 2.6], [6.1, 2.4]];                       // …and the two of the low wings (ASSUMED)
const RED = '#ad685c', RED_DARK = '#935247', SLATE = '#525a64', COPPER = '#7fa89c', FLAT = '#8d8a85', PALE = '#e6dfd0';
const GLASS = '#4a5a6b', BRONZE = '#46544a', GOLD = '#c9a23a', DARK = 'OPENING';

const area = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };
const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };

export function build(kit, parts) {
  const by = Object.fromEntries(Object.entries(PART).map(([k, id]) => [k, parts.find((b) => b.id === id)]));
  const missing = Object.keys(by).filter((k) => !by[k]);
  if (missing.length) throw new Error(`Kollegiengebäude I: OSM parts missing from city.json (${missing.join(', ')})`);

  // ---- the building's own frame: x along the long wing (to the east), z out towards the square (to the south)
  let u = [1, 0], longest = 0;
  by.long.rings[0].forEach((p, i, r) => { const q = r[(i + 1) % r.length], l = Math.hypot(q[0] - p[0], q[1] - p[1]); if (l > longest) { longest = l; u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; } });
  if (u[0] < 0) u = [-u[0], -u[1]];
  const pts = parts.flatMap((b) => b.rings[0]), O = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const loc = ([x, z]) => [(x - O[0]) * u[0] + (z - O[1]) * u[1], -(x - O[0]) * u[1] + (z - O[1]) * u[0]];
  const world = (x, z) => [O[0] + x * u[0] - z * u[1], O[1] + x * u[1] + z * u[0]];
  const frame = { x: O[0], z: O[1], angle: Math.atan2(-u[1], u[0]) };
  const F = kit.frame({ ...frame, kind: KIND.STONE }), C = kit.frame({ ...frame, kind: KIND.PLAIN }); // (stone; and copper, bronze, glass)
  const L = Object.fromEntries(Object.entries(by).map(([k, b]) => [k, b.rings[0].map(loc)])); // (each part's outline, in the frame)
  const box = (r) => ({ x0: Math.min(...r.map((p) => p[0])), x1: Math.max(...r.map((p) => p[0])), z0: Math.min(...r.map((p) => p[1])), z1: Math.max(...r.map((p) => p[1])) });
  const B = Object.fromEntries(Object.entries(L).map(([k, r]) => [k, box(r)]));
  const top = (b) => b.levels * STOREY, EAVES = top(by.south);

  // ---- 1. the walls: OSM's outlines, to the height of their storeys, flat on top (the roofs come next)
  const walls = Object.keys(PART).filter((k) => k !== 'tower' && k !== 'aulaRoof');
  const cap = { aula: COPPER, hall: FLAT, rotunda: COPPER, neck: COPPER }; // (what shows of a top that no roof covers)
  kit.osm(walls.map((k) => ({ ...by[k], levels: null, minLevel: null, minHeight: null, roofLevels: null, roofHeight: null, height: top(by[k]), roofShape: 'flat', colour: RED, roofColour: cap[k] ?? SLATE })), { walls: KIND.STONE });

  // ---- 2. the roofs: a hipped (or gabled) roof over a rectangle of the frame, standing on a cornice half a metre high
  const roof = (name, r, y, { levels = 2, shape = 'hipped', colour = SLATE, h = (Math.min(r.x1 - r.x0, r.z1 - r.z0) / 2) * PITCH * (levels / 2) } = {}) => {
    kit.osm([{ id: `kg1-${name}`, rings: [[world(r.x0, r.z0), world(r.x1, r.z0), world(r.x1, r.z1), world(r.x0, r.z1)]], type: 'part', minHeight: y - 0.5, height: y + h, roofShape: shape, roofHeight: h, colour: RED, roofColour: colour }], { walls: KIND.STONE });
  };
  const e = 0.4, d = 0.5; // (the eaves stand 0.4 m out; where two roofs would share a plane, one steps back by 0.5 m)
  const zLong = B.lowW.z0;                                                                  // the long wing's south face
  const where = (r, test, pick, f) => f(...r.filter(test).map(pick));
  const xLongEast = where(L.long, (p) => p[1] < B.long.z0 + 2, (p) => p[0], Math.max);      // …and its east end
  const xPav = where(L.long, (p) => p[1] > B.long.z1 - 1, (p) => p[0], Math.min);           // the south-east block's west and north faces
  const zPav = where(L.long, (p) => p[0] > B.long.x1 - 1, (p) => p[1], Math.min);
  const xNorthEast = where(L.north, (p) => p[1] < B.north.z0 + 1, (p) => p[0], Math.max);   // the north range's east end
  const zEastNorth = where(L.north, (p) => p[0] > B.north.x1 - 1.5, (p) => p[1], Math.min); // the east range's north end
  const depth = zLong - B.long.z0 + 2 * e;                                                  // (the long wing's roof, eaves to eaves)

  const W = { x0: Math.min(B.west.x0, B.south.x0) - e, x1: B.west.x1 + e, z0: B.west.z0 - e, z1: B.south.z1 + e - d };           // the west range
  const S = { x0: W.x0 + 0.3, x1: B.south.x1 + e, z0: B.south.z1 + e - depth, z1: B.south.z1 + e };                              // the south range
  const E2 = { x0: B.hall.x1 - e, x1: S.x1 + 0.3, z0: B.hall.z0 - 2, z1: S.z1 - d };                                             // the east range, south half
  const E1 = { x0: E2.x0 + 0.1, x1: B.north.x1 + e, z0: zEastNorth - e, z1: E2.z0 + 6 };                                         // …and north half
  const N = { x0: B.north.x0 - e, x1: xNorthEast + e, z0: B.north.z0 - e, z1: B.turret.z0 + e };                                 // the north range
  const LW = { x0: E2.x0 + d, x1: xLongEast + e, z0: B.long.z0 - e, z1: zLong + e };                                             // the long wing
  const PV = { x0: xPav - e, x1: B.long.x1 + e, z0: zPav - e, z1: B.long.z1 + e };                                               // the south-east block
  const LK = { x0: B.tower.x1 - 0.3, x1: LW.x1 - 0.4, z0: (LW.z0 + LW.z1) / 2 + d, z1: (PV.z0 + PV.z1) / 2 - d };                // the link behind the tower
  roof('west', W, EAVES); roof('south', S, EAVES); roof('east-s', E2, EAVES); roof('long', LW, EAVES); roof('block-se', PV, EAVES); roof('link', LK, EAVES);
  roof('north', N, EAVES, { levels: by.north.roofLevels ?? 2 }); roof('east-n', E1, EAVES, { levels: by.north.roofLevels ?? 2 });
  // the low wings and the neck: lean-to roofs against the long wing (a gabled roof whose far half is inside the wall)
  for (const k of ['lowW', 'lowE']) roof(k, { x0: B[k].x0, x1: B[k].x1, z0: 2 * zLong - B[k].z1 - e, z1: B[k].z1 + e }, top(by[k]), { shape: 'gabled', h: 2.4 });
  roof('neck', { x0: B.neck.x0, x1: B.neck.x1, z0: 2 * zLong - B.neck.z1 - 0.1, z1: B.neck.z1 + 0.1 }, top(by.neck), { shape: 'gabled', h: 2.2, colour: COPPER });

  // ---- 3. the round wing's dome: low, in copper, over the half-round end (and as far back over the neck)
  const R = (B.rotunda.x1 - B.rotunda.x0) / 2, rx = (B.rotunda.x0 + B.rotunda.x1) / 2, rz = B.rotunda.z1 - R, ry = top(by.rotunda);
  C.lathe([[R + 0.45, 0], [R + 0.45, 0.25], [R * 0.9, 1.4], [R * 0.68, 2.5], [R * 0.36, 3.3], [0, 3.6]], ry, COPPER, 24, rx, rz);

  // ---- 4. the tower
  const tx = (B.tower.x0 + B.tower.x1) / 2, tz = (B.tower.z0 + B.tower.z1) / 2, tw = B.tower.x1 - B.tower.x0, td = B.tower.z1 - B.tower.z0;
  const TOP = top(by.tower), Y = { clock: TOP - 14.4, floor: TOP - 12, cornice: TOP - 6.4, stage: TOP - 3.9 }; // (the stages, down from the foot of the cap)
  F.box(tw, Y.cornice, td, tx, 0, tz, RED);                                        // the shaft, up to the cornice
  F.box(tw + 0.9, 0.35, td + 0.9, tx, Y.floor - 0.35, tz, RED_DARK);               // the ledge under the three windows
  F.box(tw + 0.7, 1.0, td + 0.7, tx, Y.cornice, tz, RED_DARK);                     // the corbels
  F.box(tw + 1.5, 1.5, td + 1.5, tx, Y.cornice + 1.0, tz, RED);                    // …and the parapet they carry
  F.box(tw - 1.4, TOP - Y.stage, td - 1.4, tx, Y.stage, tz, RED);                  // the smaller storey, set back
  F.box(tw - 0.8, 0.4, td - 0.8, tx, TOP - 0.2, tz, RED_DARK);
  const k2 = Math.SQRT2, capY = TOP + 0.2, capH = 3.6;                             // the cap: four curved sides
  C.put(new THREE.LatheGeometry([[1, 0], [1, 0.14], [0.94, 0.42], [0.8, 0.68], [0.55, 0.86], [0.25, 0.96], [0, 1]].map(([r, y]) => new THREE.Vector2(r * k2, y * capH)), 4)
    .rotateY(Math.PI / 4).scale((tw - 1.0) / 2, 1, (td - 1.0) / 2).translate(tx, capY, tz), COPPER);
  C.beam([tx, capY + capH - 0.3, tz], [tx, capY + capH + 7, tz], 0.16, 'WHITE');   // the flagpole
  // on each face: the clock, three tall windows above it, two small ones in the top storey, a few up the shaft
  for (const [nx, nz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const half = nx ? tw / 2 : td / 2, span = nx ? td : tw, na = Math.atan2(-nz, nx), turn = na + Math.PI / 2;
    const at = (s, out) => [tx + nx * (half + out) + nz * s, tz + nz * (half + out) - nx * s]; // (s along the face, `out` of it)
    const disc = (r, y, out, colour) => { const [x, z] = at(0, out); C.put(new THREE.CircleGeometry(r, 20).rotateY(turn).translate(x, y, z), colour); };
    disc(1.6, Y.clock, 0.06, GOLD); disc(1.34, Y.clock, 0.09, 'IRON'); disc(0.2, Y.clock, 0.12, GOLD);
    const hand = (len, w, a) => { const [x, z] = at(0, 0.15); C.put(new THREE.PlaneGeometry(w, len).translate(0, len / 2, 0).rotateZ(a).rotateY(turn).translate(x, Y.clock, z), GOLD); };
    hand(1.2, 0.14, 0.5); hand(0.85, 0.18, -1.9);
    for (const s of [-1, 0, 1]) { const [x, z] = at((s * span) / 4, 0.06); F.panel(1.0, 2.5, x, Y.floor + 1.3, z, na, DARK); }
    for (const s of [-1, 1]) { const [x, z] = at((s * (span - 1.4)) / 4, -0.7 + 0.06); F.panel(0.9, 1.1, x, Y.stage + 1.3, z, na, DARK); }
    for (let y = 9; y < Y.clock - 4; y += STOREY) { const [x, z] = at(-span / 4, 0.06); F.panel(0.8, 1.3, x, y, z, na, DARK); }
  }

  // ---- 5. the windows: dark panels just proud of every wall that faces the open air
  const solids = [...walls, 'tower'].map((k) => ({ k, ring: by[k].rings[0], top: top(by[k]) }));
  const hidden = (k, p, y) => { const [x, z] = world(...p); return solids.some((s) => s.k !== k && s.top > y && inside(s.ring, x, z)); };
  const yard = { x0: B.hall.x0 - 1, x1: B.hall.x1 + 1, z0: B.turret.z0 - 1, z1: B.hall.z0 + 1 }; // (the inner courtyard, roughly)
  const inYard = (p) => p[0] > yard.x0 && p[0] < yard.x1 && p[1] > yard.z0 && p[1] < yard.z1;
  const lights = (c, t, n, na, w, y, h) => { // one window: three lights side by side (two or one if it is narrow)
    const m = w > 2.4 ? 3 : w > 1.5 ? 2 : 1, lw = (w - 0.25 * (m - 1)) / m;
    for (let i = 0; i < m; i++) { const s = (i - (m - 1) / 2) * (lw + 0.25); F.panel(lw, h, c[0] + t[0] * s + n[0] * 0.07, y, c[1] + t[1] * s + n[1] * 0.07, na, DARK); }
  };
  for (const k of walls) {
    const r = L[k], sign = Math.sign(area(r)), H = top(by[k]), rows = H < 11 ? LOW_ROWS : ROWS;
    r.forEach((p, i) => {
      const q = r[(i + 1) % r.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz); if (len < 2) return;
      const t = [dx / len, dz / len], n = [t[1] * sign, -t[0] * sign], na = Math.atan2(-n[1], n[0]), mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const out = (c, m) => [c[0] + n[0] * m, c[1] + n[1] * m];
      // the walls of the inner courtyard are pale, not sandstone: a skin over them
      if (inYard(out(mid, 0.5)) && !hidden(k, out(mid, 0.5), H - 1)) {
        const [a, b] = sign > 0 ? [out(q, 0.03), out(p, 0.03)] : [out(p, 0.03), out(q, 0.03)]; // (so that the skin faces out)
        C.put(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([a[0], 0, a[1], b[0], 0, b[1], b[0], H, b[1], a[0], 0, a[1], b[0], H, b[1], a[0], H, a[1]], 3)), PALE);
      }
      if (k === 'south' && n[1] > 0.9 && mid[1] > B.south.z1 - 1) return; // (the south front: done by hand, below)
      const bay = k === 'aula' && mid[0] < B.west.x0 - 0.3, count = Math.max(1, Math.round(len / 4.6)), w = Math.min(2.9, Math.max(0.9, len / count - 1.3));
      for (let j = 0; j < count; j++) {
        const s = ((j + 0.5) / count - 0.5) * len, c = [mid[0] + t[0] * s, mid[1] + t[1] * s];
        if (bay) { // the Aula's bulge to the street: a window below, a tall one above it, the band of glass under the eaves
          lights(c, t, n, na, w, ...ROWS[0]); lights(c, t, n, na, w, ROWS[1][0], ROWS[2][0] + ROWS[2][1] - ROWS[1][0]);
          const g = out(mid, 0.07); if (j === 0) C.panel(len - 0.3, 1.5, g[0], EAVES - 2.2, g[1], na, GLASS);
          continue;
        }
        for (const [y, h] of rows) if (y + h <= H - 0.4 && !hidden(k, out(c, 0.5), y + h / 2)) lights(c, t, n, na, w, y, h);
      }
    });
  }

  // ---- 6. the south front: nine axes of windows, the portal at the top of its steps, Homer and Aristotle beside it,
  //         and five dormers on the roof
  const face = L.south.map((p, i, r) => [p, r[(i + 1) % r.length]]).filter(([p, q]) => Math.min(p[1], q[1]) > B.south.z1 - 1 && Math.abs(q[0] - p[0]) > 1);
  const frontZ = (x) => { // (where the front is at x: OSM draws it in a few stretches, not quite in line)
    const hit = face.find(([p, q]) => (x - p[0]) * (x - q[0]) <= 0) ?? face[0];
    return hit[0][1] + ((hit[1][1] - hit[0][1]) * (x - hit[0][0])) / (hit[1][0] - hit[0][0]);
  };
  const fx = (B.south.x0 + B.south.x1) / 2, half = (B.south.x1 - B.south.x0) / 2, fz = frontZ(fx), door = 1.35, south = -Math.PI / 2;
  for (const f of [-0.88, -0.7, -0.52, -0.33, 0, 0.33, 0.52, 0.7, 0.88]) { // (the axes, as fractions of the half-width: read off the photos)
    const x = fx + f * half, c = [x, frontZ(x)];
    ROWS.forEach(([y, h], row) => { if (f !== 0 || row > 0) lights(c, [1, 0], [0, 1], south, f === 0 ? 4.2 : 2.9, y, h); });
  }
  F.box(8.4, door / 3, 5.2, fx, 0, fz + 2.6, RED); F.box(7.2, (2 * door) / 3, 4.2, fx, 0, fz + 2.1, RED); F.box(6.0, door, 3.2, fx, 0, fz + 1.6, RED); // the steps
  F.panel(2.6, 3.9, fx, door, fz + 0.08, south, DARK);                                                             // the door
  for (const s of [-1, 1]) F.cylinder(0.55, 4.1, fx + s * 2.0, door, fz + 0.9, RED, 10);                           // its two round pillars
  F.box(5.4, 0.6, 1.7, fx, door + 4.1, fz + 0.85, RED_DARK);                                                       // the lintel
  F.box(4.2, 1.9, 0.8, fx, door + 4.7, fz + 0.5, RED);                                                             // the coat of arms over it (a plain block)
  for (const s of [-1, 1]) {
    const x = fx + s * 4.9, z = fz + 2.4;
    F.cylinder(1.6, 1.8, x, 0, z, RED, 14);                                                                        // a round plinth
    C.box(1.0, 0.9, 1.3, x, 1.8, z, BRONZE); C.box(0.9, 0.9, 0.6, x, 2.7, z - 0.3, BRONZE); C.cylinder(0.28, 0.5, x, 3.6, z - 0.3, BRONZE, 8); // a seated figure
  }
  for (let i = -2; i <= 2; i++) {
    const x = fx + i * 5.4, z = frontZ(x) - 1.75;
    F.box(3.1, 2.7, 3.2, x, EAVES - 0.1, z, RED);
    F.panel(1.7, 1.3, x, EAVES + 0.9, z + 1.6 + 0.06, south, DARK);
    C.pyramid(2.45, 1.2, x, EAVES + 2.6, z, SLATE, 4, Math.PI / 4);
  }

  return { anchor: world(tx, tz), top: capY + capH };
}
