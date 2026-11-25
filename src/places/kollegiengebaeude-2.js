// The Kollegiengebäude II (KG II) of the University of Freiburg, on the east side of Platz der Alten Synagoge — as
// it stood from 1961 until its renovation began (the photos used are of 1961 to 2018; since 2021 it is a building site).
//
// How it is made:
//   - The plan is OpenStreetMap's five building:parts inside the outline (way 273332423): two long wings side by
//     side (ways 23021256 to the square and 105521681 behind, 6 storeys each), the block between them, one storey
//     higher (way 105521689, 7 storeys), and two low parts that close the gaps between the wings: one on
//     Bertoldstraße (way 105521671, 2 storeys) and one on the south side (way 540284727, 1 storey).
//   - OSM draws the outer long face of each wing as a row of teeth: fifteen piers, 1 m wide and 1.4 m deep, 5.7 m
//     apart. Those are the red sandstone piers of the photos, and they are kept as OSM gives them; between them
//     hangs the pale wall of metal and glass, drawn here as a pale skin with four windows per bay and storey.
//   - Made by hand after photos (all on Wikimedia Commons; the one of 1962, the one of 2018 and the one of the back are also among the
//     place's photos):
//       · Willy Pragher, «Blick vom Hochhaus des Regierungspräsidiums auf neues Kollegiengebäude der Universität»
//         (7 May 1962, Landesarchiv Baden-Württemberg): the front to the square from above — the piers the full
//         height of the building, five storeys of windows between them over an open ground floor, a thin canopy
//         over the ground floor along the front and around the corner, the bare stone end wall, the low part
//         between the wings, and on the middle block a roof terrace with people on it under a thin flat roof on posts;
//       · Pragher, «Neues Kollegiengebäude der Uni, Außenansicht von Westen» (26 April 1961): the same front, level;
//       · «Kollegiengebäude II (Freiburg im Breisgau) jm59866» (joergens.mi, January 2018) and «Kollegiengebäude II
//         der Freiburger Uni» (Andreas Schwarzkopf, June 2015): the side on Bertoldstraße — the two end walls of
//         red sandstone without windows, a row of small stone blocks near the top of the one nearer the square,
//         between the walls a lower front of close white fins, and the canopy over shop windows all along;
//       · «Kollegiengebäude II der Freiburger Uni 7» (Schwarzkopf, June 2015): the back, with the same piers and
//         canopy as the front;
//       · «Kollegiengebäude II der Freiburger Uni 22» (Schwarzkopf, July 2015): the faces of the wings that look
//         at each other — pale, with windows between white fins and no piers — and the glass boxes of the skylights
//         on the roof of the low part on Bertoldstraße (the caption calls them the skylights of the Audimax).
//
// ASSUMED: every height. OSM gives storeys, not metres; a storey is taken as 3.6 m (the photos, all taken at an
// angle, allow anything from about 3.4 to 4.1 m against the 5.7 m between two piers), which makes the wings 21.6 m
// and the middle block 25.2 m. The low part on Bertoldstraße is drawn 9.2 m high, not OSM's 2 storeys: in the photos
// its top is at about four tenths of the wings' height. Also assumed: the size and the number of the windows
// (four per bay on the outer faces is what the photos show; elsewhere one every 1.15 m); that the south end walls are
// bare stone like the north ones and that the canopy does not go around the south side (no photo of it was found);
// the look of the middle block's two free faces and of the low part on the south side; the roof terrace (seen
// only in the photo of 1962: the size of its pavilion, of its roof and the number of posts are guesses, and whether
// it is still there was not checked); the number, size and place of the skylights (nine boxes in three rows); the
// width and the height of the canopy; the colours. Not drawn: the lettering and the plaque on the end walls, the
// doors, the display cases one by one, the stair heads and the machinery on the roofs, the crane and the scaffolding
// of the renovation.

import { KIND } from '../kit.js';

export const PLACE = {
  key: 'kollegiengebaeude-2',
  name: 'Kollegiengebäude II',
  localName: 'University lecture building (KG II)',
  kind: 'building',
  // de «Otto Ernst Schweizer»: «1955–1961: Kollegiengebäude II der Universität Freiburg»; de «Platz der Alten Synagoge
  // (Freiburg im Breisgau)»: «1956 bis 1961 wurde das neue KG II errichtet»; Commons (Willy Pragher, Landesarchiv
  // Baden-Württemberg): the foundation stone laid on 25 June 1957, the inauguration in June 1961.
  built: { from: 1955, to: 1961 },
  since: 1961, // (the year both Wikipedia pages and OSM give for its completion, and of Pragher's photos of the inauguration: not there at the stop of 1955, standing from 1981 on)
  coordinates: [47.994838, 7.846619], // de.wikipedia «Liste von historischen Objekten in der Freiburger Altstadt», entry «Uni-Kollegiengebäude II»
  osm: 'w273332423',
  sources: [
    'German Wikipedia, «Platz der Alten Synagoge (Freiburg im Breisgau)», section «Universitätserweiterung»: between 1950 and 1956 the state of Baden-Württemberg acquired from the city the ground between Bertoldstraße, Werderring and Löwenstraße next to the Kollegiengebäude I; «1956 bis 1961 wurde das neue KG II errichtet, das der Karlsruher Architekt Otto Ernst Schweizer als dominierendes Gebäude des Areals entworfen hatte und dessen Westfassade parallel zu der des angrenzenden KG I, aber zurückgesetzt verläuft, sodass durch die etwa 100 Meter Abstand zum westlich gelegenen Stadttheater die heutige Platzfläche entstand. Die Buntsandsteinfassade nimmt das Material des KG I und des Freiburger Münsters auf»; the state bought a cast of Henry Moore’s «Reclining Figure» («Liegende») in 1961 for the square in front of the new building, for 30,000 DM; it was «im Frühjahr 1961 vom Ministerpräsidenten Kurt Georg Kiesinger eingeweiht», stood in the corner between KG II and KG I, and is a registered monument; the photo caption «Östlich des Platzes der Alten Synagoge …, auf dem sich u. a. die Synagoge befunden hatte, wurde Anfang der 1960er-Jahre das Kollegiengebäude II der Universität errichtet»',
    'German Wikipedia, «Otto Ernst Schweizer», list of works: «1955–1961: Kollegiengebäude II der Universität Freiburg»; he held a chair at the Technische Hochschule Karlsruhe from 1930',
    'German Wikipedia, «Albert-Ludwigs-Universität Freiburg», section «Kollegiengebäude II»: the photo caption «Kollegiengebäude II der Universität Freiburg (Rechtswissenschaften, VWL und Auditorium maximum)»; the renovation — «Nur das Stahlskelett des denkmalgeschützten Gebäudes samt den Fenstern, die 2010 … finanziert wurden, bleibt stehen»; «Im Sommer 2021 begannen schließlich die Bauarbeiten»; «Im Februar 2022 begannen die Entkernungsarbeiten»; «Bis Ende des Jahres 2027 sollen die Arbeiten nun abgeschlossen sein»; «Insgesamt werden 102 Millionen Euro veranschlagt»',
    'German Wikipedia, «Liste von historischen Objekten in der Freiburger Altstadt», entry «Uni-Kollegiengebäude II», Platz der Alten Synagoge 1, Bertoldstraße 28: coordinates (47.994838 N, 7.846619 E); architect Otto Ernst Schweizer; a protected monument («Kulturdenkmal gem. § 2 DSchG»)',
    'Wikimedia Commons, category «KG II (Uni Freiburg)», photographs by Willy Pragher from the Landesarchiv Baden-Württemberg, Staatsarchiv Freiburg (CC BY 4.0), by their titles and dates: «Modell des Kollegiengebäudes» (April 1957); «Gesamtszene während der Grundsteinlegung zum Kollegiengebäude» and «Ministerpräsident Dr. Gebhard Müller am Grundstein» (25 June 1957); «Neues Kollegiengebäude der Uni, Außenansicht von Westen» (26 April 1961); «Einweihung des neuen Kollegiengebäudes, Henry Moores "Die Liegende"» (June 1961); «Blick vom Hochhaus des Regierungspräsidiums auf neues Kollegiengebäude der Universität» (7 May 1962)',
    'Wikimedia Commons, photos of 1961 to 2018 (listed at the top of the place’s file): the piers, the pale walls between them, the canopy, the stone end walls, the low front on Bertoldstraße, the skylights, the roof terrace and the colours; and «Reclining Figure External Form (Liegende) von Henry Moore, wegen Sanierung des KG II im Innenhof» (Andreas Schwarzkopf, September 2021), whose description says the figure was moved into the inner courtyard because of the renovation',
    'OpenStreetMap, way 273332423 and the five building:parts inside it: the footprint, the piers of the two long faces, the number of storeys of each part (6 for the wings, 7 for the middle block, 2 and 1 for the low parts), flat roofs; its tags architect «Otto Ernst Schweizer, Karlsruhe (1955-1961); Architekturbüro an der Milchstraße, Freiburg (Generalsanierung 2022)» and start_date 1961',
  ],
  assumptions: [
    'every height: OSM gives storeys, not metres; a storey is taken as 3.6 m (the photos allow about 3.4 to 4.1 m), so the wings are drawn 21.6 m high and the middle block 25.2 m',
    'the low part on Bertoldstraße is drawn 9.2 m high instead of OSM’s 2 storeys, because the photos show its top at about four tenths of the wings’ height; the low part on the south side is drawn as a plain block one storey high',
    'the windows: their size everywhere; their number except on the two outer long faces (four per bay, as in the photos); the pale wall and the windows of the middle block’s free faces',
    'that the south end walls are bare sandstone like the north ones, and that the canopy runs along the two long faces and Bertoldstraße but not around the south side: no photo of the south side was found',
    'the roof terrace on the middle block, with its glazed pavilion and thin roof on posts: taken from one photo of 1962, sizes guessed; whether it is still there was not checked',
    'the skylights on the low part on Bertoldstraße: nine glass boxes in three rows (a photo of 2015 shows about that many; their place and size are by eye)',
    'the width (2.4 m out from the piers) and the height of the canopy; the colours of the stone, the pale wall and the roofs',
    'drawn as it stood before the renovation that began in 2021; not drawn: the lettering and the plaque on the end walls, the doors, the stair heads and machinery on the roofs, the building site',
  ],
  card: {
    title: 'Kollegiengebäude II',
    years: 'completed 1961',
    text: [
      'The university’s second lecture building was completed in 1961 to plans by Otto Ernst Schweizer, an architect and professor in Karlsruhe. The German Wikipedia gives the start of the work as 1955 on one page and as 1956 on another. Photographs in the state archive show the foundation stone being laid on 25 June 1957 and the inauguration in June 1961.',
      'The state had acquired the ground from the city between 1950 and 1956. The front to the square runs parallel to that of the Kollegiengebäude I but stands further back, about 100 metres from the theatre: that gap became the square. The piers and end walls are of red sandstone, the stone of the Kollegiengebäude I and of the Münster.',
      'It houses law, economics and the Auditorium maximum, the university’s largest lecture hall. For the square in front of it the state bought a cast of Henry Moore’s «Reclining Figure» in 1961, for 30,000 marks. It stood in the corner between this building and the Kollegiengebäude I.',
      'The building is a protected monument. Its renovation began in summer 2021, and in February 2022 the gutting of the interior started; only the steel frame and the windows were to stay. The work was last expected to end in 2027, at a cost put at 102 million euros.',
      'The plan, the piers and the number of storeys are OpenStreetMap’s. Every height is a guess (3.6 metres a storey), and so are the windows, the canopy, the skylights, the roof terrace — seen in a photo of 1962 — and the whole south side, of which no photo was found. It is drawn as it stood before the renovation.',
    ],
  },
};

// OSM's parts (https://www.openstreetmap.org/way/<number>)
const PART = {
  west: 'w23021256',   // the wing on the square
  east: 'w105521681',  // the wing behind it
  middle: 'w105521689', // the block between them, one storey higher
  north: 'w105521671', // the low part on Bertoldstraße
  south: 'w540284727', // the low part on the south side
};

const STOREY = 3.6;      // metres per storey (ASSUMED: see the top of the file)
const LOW = 9.2;         // the low part on Bertoldstraße (ASSUMED from the photos: about 0.4 of the wings' height)
const SILL = 1.0, LIGHT = 1.8; // a window: its sill above the floor and its height (ASSUMED)
const STONE = '#b6837a', STONE_DARK = '#96655e', PALE = '#e2ddcf', SLAB = '#d3cec1', GRAVEL = '#8f8c86', GLASS = '#46525c', DARK = 'OPENING';

const area = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };
const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };

export function build(kit, parts) {
  const by = Object.fromEntries(Object.entries(PART).map(([k, id]) => [k, parts.find((b) => b.id === id)]));
  const missing = Object.keys(by).filter((k) => !by[k]);
  if (missing.length) throw new Error(`Kollegiengebäude II: OSM parts missing from city.json (${missing.join(', ')})`);

  // ---- the building's own frame: x across the wings (to the east), z along them (to the south, away from Bertoldstraße)
  let v = [0, 1], longest = 0;
  by.middle.rings[0].forEach((p, i, r) => { const q = r[(i + 1) % r.length], l = Math.hypot(q[0] - p[0], q[1] - p[1]); if (l > longest) { longest = l; v = [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; } });
  if (v[1] < 0) v = [-v[0], -v[1]];
  const u = [v[1], -v[0]];
  const pts = parts.flatMap((b) => b.rings[0]), O = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const loc = ([x, z]) => [(x - O[0]) * u[0] + (z - O[1]) * u[1], -(x - O[0]) * u[1] + (z - O[1]) * u[0]];
  const world = (x, z) => [O[0] + x * u[0] - z * u[1], O[1] + x * u[1] + z * u[0]];
  const frame = { x: O[0], z: O[1], angle: Math.atan2(-u[1], u[0]) };
  const F = kit.frame({ ...frame, kind: KIND.STONE }), C = kit.frame({ ...frame, kind: KIND.PLAIN }); // (stone; and metal, glass, concrete)
  const L = Object.fromEntries(Object.entries(by).map(([k, b]) => [k, b.rings[0].map(loc)])); // (each part's outline, in the frame)
  const box = (r) => ({ x0: Math.min(...r.map((p) => p[0])), x1: Math.max(...r.map((p) => p[0])), z0: Math.min(...r.map((p) => p[1])), z1: Math.max(...r.map((p) => p[1])) });
  const B = Object.fromEntries(Object.entries(L).map(([k, r]) => [k, box(r)]));
  const WING = by.west.levels * STOREY, DECK = WING + 0.9, TOP = by.middle.levels * STOREY; // (the wings' roofs; the terrace's parapet; the terrace's roof)
  const top = { west: WING, east: by.east.levels * STOREY, middle: DECK, north: LOW, south: by.south.levels * STOREY + 0.4 };

  // ---- 1. the walls: OSM's outlines (with the piers of the long faces), flat on top
  const colour = { west: STONE, east: STONE, middle: PALE, north: PALE, south: STONE };
  kit.osm(Object.keys(PART).map((k) => ({ ...by[k], levels: null, minLevel: null, minHeight: null, roofLevels: null, roofHeight: null, height: top[k], roofShape: 'flat', colour: colour[k], roofColour: k === 'middle' ? SLAB : GRAVEL })), { walls: KIND.STONE });

  // ---- 2. the faces: between the piers and on the faces that look inwards, a pale skin with rows of windows; a dark
  //         ground floor under the canopy; the end walls of the wings stay bare stone
  const solids = Object.keys(PART).map((k) => ({ k, ring: by[k].rings[0], top: top[k] }));
  const hidden = (k, p, y) => { const [x, z] = world(...p); return solids.some((s) => s.k !== k && s.top > y && inside(s.ring, x, z)); };
  const lowest = (k, p) => { const [x, z] = world(...p); return Math.max(0, ...solids.filter((s) => s.k !== k && inside(s.ring, x, z)).map((s) => s.top)); }; // (what stands against a face)
  const all = box(Object.values(L).flat());
  for (const k of Object.keys(PART)) {
    const r = L[k], sign = Math.sign(area(r)), H = top[k], wing = k === 'west' || k === 'east';
    r.forEach((p, i) => {
      const q = r[(i + 1) % r.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz); if (len < 2) return; // (a pier's face or side)
      const t = [dx / len, dz / len], n = [t[1] * sign, -t[0] * sign], na = Math.atan2(-n[1], n[0]), mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const out = (c, m) => [c[0] + n[0] * m, c[1] + n[1] * m], at = (s, m) => out([mid[0] + t[0] * s, mid[1] + t[1] * s], m);
      const foot = lowest(k, out(mid, 0.5)); if (foot >= H - 0.5) return;                                // (a face against a taller part)
      const end = Math.abs(n[1]) > 0.9, street = end && n[1] < 0 && mid[1] < all.z0 + 2;               // (facing north or south; on Bertoldstraße)
      if (foot < 1) { const g = at(0, 0.06); if (!end || street) C.panel(len - 0.2, STOREY - 0.5, g[0], 0.15, g[1], na, GLASS); } // the ground floor: glass (shop windows on Bertoldstraße)
      if (k === 'south' || (wing && end)) return;                                                        // (bare stone)
      if (k === 'north') { // the low front on Bertoldstraße: close white fins, dark between them
        const g = at(0, 0.05), count = Math.round(len / 0.9); C.panel(len, H - STOREY, g[0], STOREY, g[1], na, PALE);
        for (let j = 0; j < count; j++) { const c = at(((j + 0.5) / count - 0.5) * len, 0.09); C.panel(0.45, H - STOREY - 1.1, c[0], STOREY + 0.5, c[1], na, DARK); }
        return;
      }
      const y0 = Math.max(STOREY, foot), g = at(0, 0.05); C.panel(len, H - y0, g[0], y0, g[1], na, PALE);  // the skin
      const count = len < 6 ? 4 : Math.round(len / 1.15), w = len / count - 0.32;
      for (let j = 0; j < count; j++) {
        const s = ((j + 0.5) / count - 0.5) * len, c = at(s, 0.09);
        for (let y = STOREY + SILL; y + LIGHT < H; y += STOREY) if (y > foot + 0.3 && !hidden(k, at(s, 0.5), y + LIGHT / 2)) C.panel(w, LIGHT, c[0], y, c[1], na, DARK);
      }
    });
  }

  // ---- 3. the canopy over the ground floor: along the two long faces and on Bertoldstraße (2.4 m out: ASSUMED)
  const reach = 2.4, cy = STOREY - 0.3, ct = 0.3;
  C.box(reach + 1.6, ct, all.z1 - all.z0 + reach, all.x0 - reach / 2 + 0.8, cy, (all.z0 + all.z1 - reach) / 2, SLAB);
  C.box(reach + 1.6, ct, all.z1 - all.z0 + reach, all.x1 + reach / 2 - 0.8, cy, (all.z0 + all.z1 - reach) / 2, SLAB);
  C.box(all.x1 - all.x0, ct, reach + 0.4, (all.x0 + all.x1) / 2, cy, all.z0 - reach / 2 + 0.2, SLAB);

  // ---- 4. the end wall nearer the square, on Bertoldstraße: a row of small stone blocks near its top
  const wx0 = Math.min(...L.west.filter((p) => p[1] < B.west.z0 + 3).map((p) => p[0])) + 1.4, wx1 = B.north.x0, wz = Math.min(...L.west.filter((p) => p[0] > wx1 - 1).map((p) => p[1]));
  for (let i = 0; i < 10; i++) F.box(0.5, 0.8, 0.5, wx1 - 1.2 - i * (wx1 - wx0 - 3.4) / 9, WING * 0.83, wz - 0.1, STONE_DARK);

  // ---- 5. the skylights on the low part on Bertoldstraße: nine glass boxes (ASSUMED: three rows of three)
  const nx = (B.north.x0 + B.north.x1) / 2, nz = (B.north.z0 + B.north.z1) / 2, nw = B.north.x1 - B.north.x0 - 1.5, nd = B.north.z1 - B.north.z0 - 4;
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
    const x = nx + i * nw * 0.3, z = nz + j * nd * 0.3 + i * 0.5;
    C.box(3.2, 1.3, 3.2, x, LOW, z, GLASS); C.box(3.4, 0.12, 3.4, x, LOW + 1.3, z, SLAB);
  }

  // ---- 6. the roof terrace on the middle block (the photo of 1962): a glazed pavilion set back, under a thin roof on posts
  const m = { x: (B.middle.x0 + B.middle.x1) / 2, z: (B.middle.z0 + B.middle.z1) / 2, w: B.middle.x1 - B.middle.x0 - 2.2, d: B.middle.z1 - B.middle.z0 - 2.2 };
  C.box(m.w - 7, TOP - 0.3 - WING, m.d - 9, m.x, WING, m.z, GLASS);
  C.box(m.w, 0.3, m.d, m.x, TOP - 0.3, m.z, SLAB);
  for (const sx of [-1, 1]) for (let j = 0; j <= 6; j++) { const x = m.x + sx * (m.w / 2 - 0.5), z = m.z + (j / 6 - 0.5) * (m.d - 1); C.beam([x, DECK, z], [x, TOP - 0.3, z], 0.18, 'WHITE'); }

  return { anchor: world(m.x, m.z), top: TOP };
}
