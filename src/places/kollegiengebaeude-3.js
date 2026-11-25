// The Kollegiengebäude III (KG III) of the University of Freiburg: the concrete building of the 1960s east of the
// Kollegiengebäude I, between Platz der Weißen Rose, Löwenstraße and Humboldtstraße.
//
// How it is made:
//   - The plan is OpenStreetMap's: the building's outline (relation 12450227) is two bodies, and relation 12036358
//     lists its ten building:parts. The west body is a long range running north–south, with a canted head at its
//     north end (way 863033830, and the ring around it, way 863033833), a middle stretch (way 917590079, with a strip
//     along either side, ways 917590078 and 863033831) and a south part (way 863033832) that joins the
//     Kollegiengebäude I and turns east along Humboldtstraße. The east body is low: a lecture hall (way 283629614,
//     «Hörsaal 3044» in OSM) and a wing south of it (way 917590012). OSM maps a roof between the two bodies
//     (way 442217813). The outlines drawn here are put together from the corners of those ways; ways 442217814 and
//     442217815, which repeat the two bodies whole, are not drawn.
//   - Storeys: OSM gives the head and the middle 6 levels and the south part 5. The photos show what those are: a
//     ground floor set back under the upper floors, four upper floors, each with a band of concrete under a ribbon of
//     windows, and on the roof a storey set back behind a terrace. So the long range is drawn with five full storeys
//     and the set-back one, and the range on Humboldtstraße, one level less in OSM, with four and the set-back one.
//   - OSM gives no metres. A storey is taken as 3.4 m: in «Kollegiengebäude III der Uni Freiburg, im Hintergrund das
//     KG I» (Andreas Schwarzkopf, 2015, Wikimedia Commons; one of the place's photos) the north face of the head,
//     13.9 m wide in OSM, measures about 425 px across and about 505 px from the ground to the top of the roof
//     parapet, which makes that parapet about 16.5 m up, over five storeys and a parapet.
//   - Made by hand after photos (all on Wikimedia Commons):
//       · the aerial view of 21 October 2012 (Taxiarchos228, «Aerial View - Freiburg im Breisgau-Innenstadt1»): the
//         low hipped roofs of green copper over the set-back top storeys of both ranges, the terraces in front of
//         them, a concrete block standing above the roof at each end of the long range (the one by the
//         Kollegiengebäude I with a small copper roof of its own), and the range on Humboldtstraße lower than the
//         long one;
//       · Willy Pragher's photograph of 12 March 1980 («Kollegiengebäude III vom Hof aus») and Andreas Schwarzkopf's
//         three of June 2015 («… mit Martinstor», «… im Hintergrund das KG I», «… mit Uniturm»): the head with its
//         canted faces, the bands of concrete and the ribbons of windows, the ground floor set back behind columns,
//         the railing on the roof; the low east body with glass walls towards the courtyard, a blank wall towards
//         Löwenstraße and a green copper roof; the concrete deck between the two bodies.
//   - Colours: OSM gives none. The concrete is drawn pale grey, the glass dark, the roofs in the pale green of the
//     aerial view.
//
// ASSUMED: the storey height (3.4 m, read off one photo as above) and with it every height; that the south stretch of
// the long range is as tall as its middle (OSM maps it with the lower part; the aerial view shows one roof line);
// how far the ground floor and the top storey are set back; the depth and the height of the concrete bands; the
// windows on every side (drawn as one ribbon per bay on every face, also where the photos show bare concrete or
// balconies); the columns; the pitch of the copper roofs; the size and the place of the two blocks above the roof;
// the height of the east body (two storeys, by eye from the photos), that its roofs are hipped, which of its walls
// are glass (those that look west) and that the others are blank; the height of the deck between the bodies. Not
// drawn: the balconies' railings, the stairs, the underground car park's ramp, the sculptures.

import { KIND } from '../kit.js';
import { shrunk } from '../buildings.js';

export const PLACE = {
  key: 'kollegiengebaeude-3',
  name: 'Kollegiengebäude III',
  localName: 'University building (KG III)',
  kind: 'building',
  // The sources do not agree: the university's history page says «erbaut 1969» and its campus tour «im Jahr 1969 …
  // gebaut»; a tour of the university's museum, as uniCROSS reports it, «zwischen 1964 und 1968»; alemannische-seiten.de
  // «zwischen 1964 und 1967».
  built: { from: 1964, to: 1969 },
  // `since` uses 1969, the latest year any source gives and the university's own: by then it stood according to all of
  // them. For the timeline it makes no difference which is right: not there at the stop of 1955, there at that of 1981.
  since: 1969,
  coordinates: [47.994103, 7.847441], // de.wikipedia «Liste von historischen Objekten in der Freiburger Altstadt», entry «Uni-Kollegiengebäude III»
  osm: 'r12450227',
  sources: [
    'University of Freiburg, «Geschichte der Universität Freiburg» (uni-freiburg.de/universitaet/portrait/geschichte/), caption of a photo: «Das Kollegiengebäude III, erbaut 1969»; on the same page, the growth of the university from 3,000 students in 1948 to 12,000 in the summer of 1965',
    'University of Freiburg, campus tour «Das Universitätszentrum» (osa.uni-freiburg.de/campustour/universitaetszentrum/): «Das Kollegiengebäude III ist im Jahr 1969 im Stil des Brutalismus gebaut worden. … der Bau zeigt seinen rohen Beton»',
    'uniCROSS (the university’s student media), «Altes neu im Blick», 10 July 2024, on a tour by Wilhelm Gros of the Uniseum: «Ein Stahlbetonbau des Brutalismus, wie er aus der Schalung kommt»; «Gebaut wurde das Gebäude zwischen 1964 und 1968»; the idea of opening the university to the town, with a way through the foyer that passers-by use; the nine Muses of Bettina Eichin in a corner of the building',
    'alemannische-seiten.de, «Kollegiengebäude III. Uni Freiburg»: «wurde zwischen 1964 und 1967 erbaut»; built of concrete; lecture halls, a café and an entrance to the underground car park',
    'University of Freiburg, «Lagepläne: Kollegiengebäude III»: the address, Platz der Universität 3; the main entrance on Karl-Rahner-Platz/Humboldtstraße, side entrances on Platz der Weißen Rose',
    'German Wikipedia, «Liste von historischen Objekten in der Freiburger Altstadt», entry «Uni-Kollegiengebäude III», Platz der Universität 3: coordinates (47.994103 N, 7.847441 E). The entry names Carl Anton Meckel as the architect; the German Wikipedia’s article on him gives his life as 1875–1938 and does not list the building, so no architect is given here',
    'German Wikipedia, «Martin Waldseemüller»: the house «zum Hechtkopf», Löwenstraße 9/11, where he lived, destroyed in the Second World War, «heute steht dort das Kollegiengebäude III»; a facsimile of his world map hung there since 2013',
    'German Wikipedia, «Bettina Eichin»: «1978–1998: «Die neun Musen» - Foyer des Kollegiengebäude III der Universität Freiburg»; and «Liste von Kunstwerken im öffentlichen Raum in Freiburg im Breisgau», which dates the same work 1966',
    'Not read, only its catalogue record (EconBiz): Ortwin Müller, «Kollegiengebäude III der Universität Freiburg», Die Bauverwaltung 19 (1970), no. 5, pp. 260–265',
    'Wikimedia Commons, «Kollegiengebäude III der Uni Freiburg, im Hintergrund das KG I» (Andreas Schwarzkopf, 2015, CC BY-SA 3.0): the height of the head against the width of its north face, the bands and the ribbons of windows, the set-back ground floor',
    'Wikimedia Commons, «Aerial View - Freiburg im Breisgau-Innenstadt1» (Taxiarchos228, 21 October 2012, CC BY 3.0): the copper roofs, the set-back top storeys and their terraces, the blocks above the roof, the lower range on Humboldtstraße',
    'Wikimedia Commons, «Freiburg: Kollegiengebäude III vom Hof aus» (Willy Pragher, 12 March 1980, Landesarchiv Baden-Württemberg, CC BY 4.0) and «Kollegiengebäude III der Uni Freiburg mit Martinstor» and «… mit Uniturm» (Andreas Schwarzkopf, 2015): the head, the columns, the low east body and its copper roof, the deck between the two bodies',
    'OpenStreetMap, relations 12450227 and 12036358 and their building:parts: the footprint, the number of levels (6 for the head and the middle, 5 for the south part and the strips), that the strips of the middle start at level 2, the lecture hall «Hörsaal 3044», the roof between the two bodies',
  ],
  assumptions: [
    'every height: OSM gives levels, not metres; a storey is taken as 3.4 m, read off one photo of the head against the width of its north face in OSM',
    'how OSM’s levels are read: a ground floor, four upper floors and a set-back storey on the roof for the long range (6 levels), one upper floor less for the range on Humboldtstraße (5 levels); and that the south stretch of the long range is as tall as its middle, as the aerial view shows, although OSM maps it with the lower part',
    'how far the ground floor and the top storeys are set back, the columns under the upper floors, the depth and height of the concrete bands',
    'the windows: one ribbon per bay on every face, also where the photos show bare concrete, balconies or stairs',
    'the pitch of the copper roofs, and the size and place of the two concrete blocks that stand above the roof of the long range',
    'the east body: its height (two storeys, by eye), hipped copper roofs, glass on the walls that look west and blank walls elsewhere; the height of the deck between the two bodies',
    'not drawn: railings, stairs, the ramp of the underground car park, the sculptures',
  ],
  card: {
    title: 'Kollegiengebäude III',
    years: 'built in the 1960s · standing by 1969',
    text: [
      'A building of bare reinforced concrete, in the style called Brutalism, put up as the university grew: from 3,000 students in 1948 to 12,000 in 1965. The university gives 1969 as the year it was built. A tour of the university’s museum, the Uniseum, puts the work between 1964 and 1968, and a regional website between 1964 and 1967.',
      'It joins the Kollegiengebäude I and holds lecture halls and a café. The idea was to open the university to the town: a way leads through the foyer, and passers-by use it. In the building stand «Die neun Musen», nine figures by the Swiss sculptor Bettina Eichin.',
      'Before the war the house «zum Hechtkopf» stood on part of the site, at Löwenstraße 9/11. The cartographer Martin Waldseemüller, whose world map of 1507 was the first to carry the name «America», lived in it. It was destroyed in the Second World War. A copy of the map has hung at the building since 2013.',
      'Who designed it could not be established here. The German Wikipedia’s list of the old town’s buildings names Carl Anton Meckel, but he died in 1938.',
      'The plan and the number of storeys are OpenStreetMap’s. The heights are guesses — 3.4 metres a storey, read off a photo — and so are the windows, the columns, the copper roofs and the low lecture-hall wing, all placed by eye from photos.',
    ],
  },
};

// OSM's parts (https://www.openstreetmap.org/way/<number>)
const PART = {
  head: 'w863033830',   // the head at the north end
  ring: 'w863033833',   // …and the ring around it: how far its upper floors reach out
  middle: 'w917590079', // the middle of the long range
  stripE: 'w917590078', // the strips along it, from level 2 up
  stripW: 'w863033831',
  south: 'w863033832',  // the south part: the end of the long range and the range on Humboldtstraße
  hall: 'w283629614',   // the east body: the lecture hall
  wing: 'w917590012',   // …and the wing south of it
  deck: 'w442217813',   // the roof OSM maps between the two bodies
};

const STOREY = 3.4;             // metres per storey (ASSUMED: see the top of the file)
const BAND = [-0.45, 0.85];     // a concrete band: from below the floor to the top of the parapet (ASSUMED)
const ATTIC = 2.6, RISE = 1.1;  // the set-back storey and the rise of its copper roof (ASSUMED)
const LOW = 2 * STOREY;         // the east body's walls (ASSUMED)
const CONCRETE = '#bdb7aa', CONCRETE_DARK = '#a39d91', BAND_COLOUR = '#c9c3b6', GLASS = '#45515b', FOYER = '#353c42', COPPER = '#8fb7a4', GRAVEL = '#8f8c86';

const area = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };
const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
const middleOf = (r) => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length];

export function build(kit, parts) {
  const by = Object.fromEntries(Object.entries(PART).map(([k, id]) => [k, parts.find((b) => b.id === id)]));
  const missing = Object.keys(by).filter((k) => !by[k]);
  if (missing.length) throw new Error(`Kollegiengebäude III: OSM parts missing from city.json (${missing.join(', ')})`);
  const ring = Object.fromEntries(Object.entries(by).map(([k, b]) => [k, b.rings[0]]));
  const F = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }); // (the frame is the world: every outline comes from OSM's corners)

  // ---- the outlines, put together from OSM's corners: `corner(part, x, z)` is the corner of that way nearest to the
  //      rough position given (world metres; the exact place is OSM's)
  const corner = (k, x, z) => {
    const p = ring[k].reduce((best, q) => (Math.hypot(q[0] - x, q[1] - z) < Math.hypot(best[0] - x, best[1] - z) ? q : best));
    if (Math.hypot(p[0] - x, p[1] - z) > 2.5) throw new Error(`Kollegiengebäude III: no corner of ${PART[k]} near ${x}, ${z}`);
    return p;
  };
  // the long range, as far as its upper floors reach: around the head's ring, down the west strip and the west side
  // of the south part to the Kollegiengebäude I, along the line where the range on Humboldtstraße begins, and back
  // up the east side
  const LONG = [
    corner('ring', -410.1, 157.9), corner('ring', -409.6, 142.4), corner('ring', -422.8, 138.0), corner('ring', -422.9, 140.4),
    corner('ring', -431.0, 150.3), corner('ring', -427.1, 154.8), corner('stripW', -427.2, 155.7), corner('stripW', -430.8, 180.5),
    corner('south', -434.4, 196.1), corner('south', -436.0, 208.5), corner('south', -423.2, 210.1), corner('south', -406.6, 208.9),
    corner('south', -406.4, 207.7), corner('south', -405.4, 178.4), corner('stripE', -410.8, 179.1),
  ];
  // …its part south of the head, which carries the set-back storey
  const BODY = [LONG[0], ...LONG.slice(6)];
  // the range on Humboldtstraße
  const STREET = [corner('south', -423.2, 210.1), corner('south', -406.6, 208.9), corner('south', -380.5, 212.2), corner('south', -382.4, 226.0), corner('south', -421.9, 220.7), corner('south', -424.5, 220.4)];

  const T = (n) => n * STOREY + BAND[1]; // (the top of a range of n storeys: its roof parapet)
  const solids = [{ ring: LONG, top: T(5) + ATTIC }, { ring: STREET, top: T(4) + ATTIC }, { ring: ring.hall, top: LOW }, { ring: ring.wing, top: LOW }];
  const hidden = (self, x, z, y) => solids.some((s) => s.ring !== self && s.top > y && inside(s.ring, x, z));
  const inFront = (r) => r.map((p) => [p[0], p[1]]);

  // one ribbon of windows per bay on every open face of an outline, `h` high from `y` up
  const ribbons = (self, outline, y, h, { bay = 6, pier = 0.7, only = () => true, colour = GLASS } = {}) => {
    const sign = Math.sign(area(outline));
    outline.forEach((p, i) => {
      const q = outline[(i + 1) % outline.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz); if (len < 3) return;
      const t = [dx / len, dz / len], n = [t[1] * sign, -t[0] * sign], na = Math.atan2(-n[1], n[0]), count = Math.max(1, Math.round(len / bay)), w = len / count - pier;
      if (!only(n)) return;
      for (let j = 0; j < count; j++) {
        const s = ((j + 0.5) / count - 0.5) * len, c = [(p[0] + q[0]) / 2 + t[0] * s, (p[1] + q[1]) / 2 + t[1] * s];
        if (hidden(self, c[0] + n[0] * 0.8, c[1] + n[1] * 0.8, y + h / 2)) continue;
        F.panel(w, h, c[0] + n[0] * 0.06, y, c[1] + n[1] * 0.06, na, colour);
      }
    });
  };
  // columns under the edge of the upper floors
  const columns = (self, outline, h, { bay = 6 } = {}) => {
    const line = shrunk([inFront(outline)], 0.7)[0];
    line.forEach((p, i) => {
      const q = line[(i + 1) % line.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]); if (len < 4) return;
      const count = Math.max(1, Math.round(len / bay));
      for (let j = 0; j <= count; j++) {
        const x = p[0] + ((q[0] - p[0]) * j) / count, z = p[1] + ((q[1] - p[1]) * j) / count;
        if (!hidden(self, x, z, h / 2)) F.box(0.55, h, 0.55, x, 0, z, CONCRETE_DARK, -Math.atan2(q[1] - p[1], q[0] - p[0]));
      }
    });
  };

  // ---- a range: a ground floor (set back by `recess`, behind columns, or flush), `n − 1` upper floors with a band of
  //      concrete at every floor and ribbons of windows between them, and the roof parapet
  const range = (outline, n, recess) => {
    const walls = shrunk([inFront(outline)], 0.8)[0], top = T(n);
    if (recess) {
      const foyer = shrunk([inFront(outline)], recess)[0];
      F.prism(foyer, 0, STOREY + BAND[0], FOYER);
      columns(outline, outline, STOREY + BAND[0]);
    } else {
      F.prism(walls, 0, STOREY + BAND[0], CONCRETE);
      ribbons(outline, walls, 0.9, STOREY + BAND[0] - 1.2, { colour: FOYER });
    }
    F.prism(walls, STOREY + BAND[0], top - 0.2, CONCRETE);
    for (let k = 1; k <= n; k++) F.prism(outline, k * STOREY + BAND[0], k * STOREY + BAND[1], BAND_COLOUR);
    for (let k = 1; k < n; k++) ribbons(outline, walls, k * STOREY + BAND[1], STOREY - (BAND[1] - BAND[0]), {});
    return top;
  };
  // …and the storey set back on its roof, under a low hipped roof of copper that reaches out over it
  const attic = (name, outline, y, back) => {
    const walls = shrunk([inFront(outline)], back)[0], eaves = shrunk([inFront(outline)], back - 0.9)[0];
    F.prism(walls, y - 0.3, y + ATTIC, CONCRETE);
    ribbons(null, walls, y + 0.5, ATTIC - 0.8, { bay: 5, pier: 0.5 });
    kit.osm([{ id: `kg3-${name}`, rings: [eaves], type: 'part', minHeight: y + ATTIC, height: y + ATTIC + 0.3 + RISE, roofShape: 'hipped', roofHeight: RISE, colour: BAND_COLOUR, roofColour: COPPER }], { walls: KIND.PLAIN, roof: KIND.PLAIN });
    return y + ATTIC + 0.3 + RISE;
  };

  // ---- 1. the long range, with the head at its north end
  const longTop = range(LONG, 5, 2.8);
  const roofTop = attic('long', BODY, longTop, 3.0);
  // the two concrete blocks that stand above its roof: one on the head, one at the south end with a small copper roof
  const [hx, hz] = middleOf(ring.head), south = middleOf([LONG[8], LONG[9], LONG[10]]);
  F.box(7, 3.4, 6, hx + 1.5, longTop - 0.3, hz + 3, CONCRETE, 0.05);
  F.box(7.5, ATTIC + 3.4, 7.5, south[0] + 2.5, longTop - 0.3, south[1] - 3, CONCRETE, 0.1);
  F.pyramid(5.7, 1.0, south[0] + 2.5, longTop + ATTIC + 3.1, south[1] - 3, COPPER, 4, Math.PI / 4 + 0.1);

  // ---- 2. the range on Humboldtstraße: one storey less, its ground floor flush
  const streetTop = range(STREET, 4, 0);
  const f = (STREET[1][0] - STREET[3][0]) / (STREET[4][0] - STREET[3][0]), foot = [STREET[1][0], STREET[3][1] + (STREET[4][1] - STREET[3][1]) * f]; // (on its south face, where the long range ends)
  attic('street', [STREET[1], STREET[2], STREET[3], foot], streetTop, 2.2);

  // ---- 3. the east body: the lecture hall and the wing south of it — low, glass towards the courtyard, copper roofs
  for (const k of ['hall', 'wing']) {
    const outline = ring[k];
    kit.osm([{ id: `kg3-${k}`, rings: [outline], type: 'part', height: LOW, roofShape: 'flat', colour: CONCRETE, roofColour: GRAVEL }], { walls: KIND.PLAIN, roof: KIND.PLAIN });
    for (const y of [0.5, STOREY + 0.4]) ribbons(outline, outline, y, STOREY - 0.9, { bay: 4.5, pier: 0.4, only: (n) => n[0] < -0.35 });
    const eaves = shrunk([inFront(outline)], -0.6)[0];
    F.prism(eaves, LOW - 0.1, LOW + 0.5, BAND_COLOUR);
    kit.osm([{ id: `kg3-${k}-roof`, rings: [shrunk([inFront(outline)], 0.4)[0]], type: 'part', minHeight: LOW + 0.4, height: LOW + 0.6 + 1.5, roofShape: 'hipped', roofHeight: 1.5, colour: BAND_COLOUR, roofColour: COPPER }], { walls: KIND.PLAIN, roof: KIND.PLAIN });
  }

  // ---- 4. the deck between the two bodies, at the height of the first floor
  F.prism(ring.deck, STOREY + BAND[0], STOREY + BAND[1], BAND_COLOUR);

  return { anchor: middleOf(BODY), top: Math.max(roofTop, longTop + ATTIC + 4.1) };
}
