// The Historisches Kaufhaus (Historical Merchants' Hall), on the south side of Münsterplatz.
//
// How it is made:
//   - The volumes are OpenStreetMap's 12 parts of the building (way 767726339): the upper hall (way 767726343, from
//     4.5 to 19.5 m, a gabled roof 10.5 m high), the two oriels at its front corners (ways 767726340/41, 4.5–16 m,
//     pyramidal roofs), the hall behind the arcade (way 767726352, 4.5 m), the back parts, and — on the front — five
//     piers 0.8 m wide (ways 767726344–48). Five piers make four arches, which is what both Wikipedias say: «the four
//     arcades with an access balcony facing the Minster» (en), «vier große Arkaden» (de).
//   - Made by hand on those: the arches between the piers; the balcony of 1550 («1550 erhielt das Kaufhaus einen
//     Balkon an der Platzfassade», de); the large windows of the upper floor («große spätgotische Fenster mit
//     Vorhangbögen», de); the four statues under canopies (Maximilian I, Philip I, Charles V and Ferdinand I, by Hans
//     Sixt von Staufen, 1530/31; replicas, en); the five coats of arms under each oriel («The five emblems under each
//     of the bay windows», en); and the stepped gables of the steep roof («lined by crow-stepped gables», en;
//     «Treppengiebel», de).
//   - Colours: the façade is red (en: «crimson paint», de: «roten Fassade»; OSM's building:colour is #dd2222, drawn
//     here a little deeper). The roof is OSM's roof:colour, #2c0707, drawn lighter (#5a2a22): that dark it reads as a hole.
//     The oriels' roofs have coloured glazed tiles (de: «farbig glasierten Dachziegeln»). The text does not name the
//     colours; a photo of 2025 (JoachimKohler-HB, Wikimedia Commons, «Historisches Kaufhaus Freiburg im Breisgau
//     (2025)», one of the place's photos) shows them laid in diamonds of green, yellow, red-brown and white.
//
// ASSUMED: the arches' shape (round) and height; the number, size and place of the windows (and that the other sides
// have a row of plain ones); where exactly the statues and the coats of arms sit, their size and colours; the exact
// shades, the size and the order of the diamonds on the oriel roofs (read off the photo by eye; the real pattern is
// finer); the number of steps in the gables.

import { KIND } from '../kit.js';
import { orientedBox } from '../buildings.js';

export const PLACE = {
  key: 'kaufhaus',
  name: 'Historisches Kaufhaus',
  localName: 'Historical Merchants’ Hall',
  kind: 'building',
  built: { from: 1520, to: 1532 }, // de: «Das zwischen 1520 und 1532 errichtete Gebäude»; en: «completed in 1532»
  war: { state: 'spared', rebuilt: null, source: 'German Wikipedia, «Münsterplatz (Freiburg im Breisgau)»: «Lediglich die Gebäude auf der Südostseite mit Historischem Kaufhaus, Wentzingerhaus und Alter Wache blieben wie das Münster selbst weitgehend verschont» (27 November 1944); the city’s damage map of the raid marks the building mostly blue, light to medium damage' },
  coordinates: [47.994964, 7.852727], // en.wikipedia «Historical Merchants' Hall (Freiburg)», infobox
  osm: 'w767726339',
  sources: [
    'English Wikipedia, «Historical Merchants’ Hall (Freiburg)»: coordinates (47.994964 N, 7.852727 E); completed in 1532, architect not known, assumed to be Lienhardt Müller; the four arcades with an access balcony facing the Minster; two polygonal bay windows with coloured tiles; five emblems under each bay window; the four statues are replicas; the high roof with two attic storeys lined by crow-stepped gables; the crimson façade',
    'German Wikipedia, «Historisches Kaufhaus (Freiburg im Breisgau)»: built between 1520 and 1532; the attribution to Lienhart Müller not certain; Hans Sixt von Staufen made the figures and coats of arms in 1530/31; the balcony of 1550; the large late-Gothic windows with curtain arches; the steep roof with Treppengiebel; the red façade',
    'Wikimedia Commons, «Historisches Kaufhaus Freiburg im Breisgau (2025)» (JoachimKohler-HB, CC BY-SA 4.0): the oriel roofs, in diamonds of green, yellow, red-brown and white',
    'German Wikipedia, «Münsterplatz (Freiburg im Breisgau)»: «Bei der Bombardierung Freiburgs am 27. November 1944 wurde fast die gesamte Randbebauung des Münsterplatzes zerstört. Lediglich die Gebäude auf der Südostseite mit Historischem Kaufhaus, Wentzingerhaus und Alter Wache blieben wie das Münster selbst weitgehend verschont»; «Freiburg im Breisgau»: these «blieben nahezu unversehrt»',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the building is marked mostly blue. Wikimedia Commons, «Luftbild Freiburg 1944» (Stadtarchiv Freiburg M 72 B 271, dated there «Sommer 1945 oder Folgejahre», public domain): the row on the south side of the square still has its roofs, the houses on its north and west sides are roofless walls',
    'OpenStreetMap, way 767726339 and its 12 building:parts: footprint, heights and roofs, the five piers of the arcade, building:colour #dd2222 and roof:colour #2c0707',
  ],
  assumptions: [
    'the shape and height of the arches',
    'the number, size and place of the windows',
    'where the statues and the coats of arms sit, their size and their colours',
    'the shades, size and order of the coloured diamonds on the oriel roofs (read off the 2025 photo by eye)',
    'the number of steps in the gables',
  ],
  card: {
    title: 'Historisches Kaufhaus',
    years: '1520 – 1532',
    text: [
      'The merchants’ hall on Münsterplatz was built between 1520 and 1532. Who designed it is not certain; it is usually attributed to Lienhart Müller.',
      'Its red front opens onto the square with four arcades, and the balcony above them was added in 1550. Two polygonal oriels with coloured tiles frame the upper floor, where Hans Sixt von Staufen’s statues of four Habsburg rulers — Maximilian I, Philip I, Charles V and Ferdinand I — stand under canopies, with five coats of arms under each oriel. The statues there today are replicas.',
      'The steep roof, with two attic storeys, is closed by stepped gables.',
      'The air raid of 27 November 1944 destroyed nearly all the buildings around Münsterplatz. Only those on its south-east side — the Kaufhaus, the Wentzingerhaus and the Alte Wache — were largely spared, like the Minster; the city’s damage map of the raid marks light to medium damage here.',
      'The volumes are OpenStreetMap’s. The arches, windows, statues and coats of arms are placed by eye: their exact size and position are guesses.',
    ],
  },
};

const HALL = 'w767726343', ORIELS = ['w767726340', 'w767726341'], PIERS = ['w767726344', 'w767726345', 'w767726346', 'w767726347', 'w767726348'];
const RED = '#b8352c', ROOF = '#5a2a22', TILES = '#5e8a55', STONE = '#cdb898', DARK = 'OPENING';
const ARMS = ['#c9a23a', '#f1ece0', '#9a2a22', '#2f4f7a', '#c9a23a'];

export function build(kit, parts) {
  const byId = (id) => parts.find((b) => b.id === id);
  const hall = byId(HALL), piers = PIERS.map(byId), oriels = ORIELS.map(byId);
  if (!hall || piers.some((p) => !p) || oriels.some((o) => !o)) throw new Error('Kaufhaus: OSM parts missing from city.json');
  const mid = (b) => { const r = b.rings[0]; return [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length]; };

  // 1. the volumes, from OSM (the hall without painted windows: its windows are drawn below)
  const coloured = (b) => ({ ...b, colour: RED, roofColour: ORIELS.includes(b.id) ? TILES : ROOF });
  kit.osm(parts.filter((b) => b === hall || PIERS.includes(b.id)).map(coloured), { walls: KIND.PLAIN });
  kit.osm(oriels.map(coloured), { walls: KIND.PLAIN, roof: KIND.DIAMONDS }); // (their roofs: glazed tiles in coloured diamonds)
  kit.osm(parts.filter((b) => b !== hall && !ORIELS.includes(b.id) && !PIERS.includes(b.id)).map(coloured));

  // 2. the front's frame: x along the line of piers, z out towards the square (towards the Münster, north)
  const P = piers.map(mid), a = P[0], b = P[P.length - 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len;
  const angle = Math.atan2(-uz, ux), zAxis = [-uz, ux]; // (the frame's +z, in the world)
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], out = zAxis[1] < 0 ? 1 : -1; // (+1 if +z points north)
  const F = kit.frame({ x: c[0], z: c[1], angle, kind: KIND.PLAIN });
  const along = ([x, z]) => (x - c[0]) * ux + (z - c[1]) * uz;
  const across = ([x, z]) => ((x - c[0]) * zAxis[0] + (z - c[1]) * zAxis[1]) * out; // (metres out of the pier line)

  // the hall's front face, measured: how far it stands out of the pier line, and its height
  const hallFront = Math.max(...hall.rings[0].map(across));
  const Y0 = hall.minHeight ?? 4.5, YW = hall.height - (hall.roofHeight ?? 0); // (4.5 and 9: the upper floor)

  // 3. the four arches between the five piers
  const xs = P.map(along).sort((p, q) => p - q), PW = 0.8;
  const arches = xs.slice(0, -1).map((x, i) => { const w = xs[i + 1] - x - PW; return { along: (x + xs[i + 1]) / 2, width: w, spring: Y0 - 0.45 - w / 2, crown: Y0 - 0.45 }; });
  F.archedWall(xs[4] - xs[0] + PW, Y0, PW, (xs[0] + xs[4]) / 2, 0, 0, RED, arches);

  // 4. the balcony of 1550, along the front over the arches, with its railing
  const zb = out * (hallFront + 0.55), depth = 1.1;
  F.box(xs[4] - xs[0] + PW, 0.3, depth, (xs[0] + xs[4]) / 2, Y0 - 0.1, out * (hallFront + depth / 2), STONE);
  F.box(xs[4] - xs[0] + PW, 0.1, 0.1, (xs[0] + xs[4]) / 2, Y0 + 1.0, zb + out * 0.5, 'IRON');
  for (let x = xs[0]; x <= xs[4] + 1e-6; x += 1.2) F.box(0.06, 1.0, 0.06, x, Y0 + 0.2, zb + out * 0.5, 'IRON');

  // 5. the upper floor of the front: four statues under canopies, and large windows between them
  const zf = out * (hallFront + 0.08), span = xs[3] - xs[1], rotFace = 0;
  const statues = [-0.75, -0.25, 0.25, 0.75].map((k) => (xs[1] + xs[3]) / 2 + (k * span) / 2 * 1.25);
  for (const x of statues) {
    F.box(0.8, 0.5, 0.5, x, Y0 + 0.9, zf + out * 0.25, STONE); // the console
    F.cylinder(0.28, 1.7, x, Y0 + 1.4, zf + out * 0.3, STONE, 8, 0.22); // the figure
    F.cylinder(0.17, 0.3, x, Y0 + 3.1, zf + out * 0.3, STONE, 8); // its head
    F.box(0.9, 0.15, 0.6, x, Y0 + 3.55, zf + out * 0.3, STONE); // the canopy
    F.pyramid(0.55, 1.1, x, Y0 + 3.7, zf + out * 0.3, STONE, 4, Math.PI / 4);
  }
  const gaps = [statues[0] - (statues[1] - statues[0]) / 2, ...statues.slice(0, -1).map((x, i) => (x + statues[i + 1]) / 2), statues[3] + (statues[3] - statues[2]) / 2];
  for (const x of gaps) {
    F.box(1.9, YW - Y0 - 2.1, 0.12, x, Y0 + 1.1, zf, DARK, rotFace);
    F.box(0.14, YW - Y0 - 2.1, 0.16, x, Y0 + 1.1, zf + out * 0.02, STONE); // the mullion
    F.box(2.2, 0.18, 0.2, x, Y0 + 1.0, zf + out * 0.04, STONE); // the sill
  }

  // 6. five coats of arms under each oriel, around its outer half
  for (const o of oriels) {
    const [ox, oz] = mid(o), x = along([ox, oz]), z = across([ox, oz]);
    const r = Math.max(...o.rings[0].map((p) => Math.hypot(p[0] - ox, p[1] - oz)));
    ARMS.forEach((col, i) => {
      const t = Math.PI * (0.1 + (0.8 * i) / 4), dx = Math.cos(t) * (r + 0.05), dz = Math.sin(t) * (r + 0.05);
      F.box(0.5, 0.62, 0.1, x - dx, Y0 + 0.35, out * (z + dz), col, Math.atan2(-dz * out, -dx) + Math.PI / 2);
    });
  }

  // 7. the stepped gables at both ends of the hall's roof
  const hb = orientedBox(hall.rings[0]), G = kit.frame({ x: hb.c[0], z: hb.c[1], angle: Math.atan2(-hb.u[1], hb.u[0]) });
  const steps = 7, rh = hall.roofHeight ?? 10.5, W = 2 * hb.hw, h = rh / steps;
  for (const end of [-1, 1]) {
    for (let k = 0; k < steps; k++) G.box(0.7, h + 0.25, W * (1 - k / steps) + 0.3, end * (hb.hl - 0.2), YW + k * h, 0, RED);
    G.box(0.9, 1.2, 0.9, end * (hb.hl - 0.2), YW + rh + 0.25, 0, RED);
  }
  // the other faces of the hall: a row of plain windows (ASSUMED); the side facing north is the front, done above
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) if (side * hb.u[0] > 0) G.box(1.1, 1.8, 0.1, -hb.hl + (2 * hb.hl * (i + 0.5)) / 6, Y0 + 1.4, side * (hb.hw + 0.06), DARK);
  for (const end of [-1, 1]) for (let i = 0; i < 4; i++) G.box(0.1, 1.8, 1.1, end * (hb.hl + 0.06), Y0 + 1.4, -hb.hw + (2 * hb.hw * (i + 0.5)) / 4, DARK);

  const top = mid(hall);
  return { anchor: top, top: hall.height };
}
