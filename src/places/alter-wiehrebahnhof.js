// The Alter Wiehrebahnhof: the station building of the Höllentalbahn in the Wiehre, on Urachstraße, where trains
// stopped until the line was moved south in 1934; since 1981 a cinema, a gallery and a café.
//
// How it is made:
//   - The footprint is OpenStreetMap's outline (way 145404229, «Alter Wiehrebahnhof», Urachstraße 40, traced from
//     the state survey's map: «source:geometry = maps4bw (LGL)»): a middle block of about 14.5 by 11 m, standing
//     1 m out of a wing of about 10 by 9 m on each side; 34 m long in all. OSM gives NO levels, heights, roofs or
//     colours: everything above the ground is read off three photographs on Wikimedia Commons (the place's photos).
//   - The street front, 2005 («Alter Wiehrebahnhof», Chalco) and 2019 («Kommunales Kino Freiburg - Der Alte
//     Wiehrebahnhof in Freiburg», Joblin): the middle block has two storeys and five bays; on the ground floor five
//     round arches framed in red sandstone (three doors in the middle, a window on each side), above them five
//     upright windows in sandstone frames; strips of red sandstone at the corners and after the first and the fourth
//     bay, a sandstone plinth and a band between the floors; a tiled roof with its ridge along the building. Each
//     wing has one storey with round-arched windows (three on the east wing; two show on the west wing, a tree hides
//     the rest) and a lower tiled roof. The plaster is grey in 2005 and yellow in 2019.
//   - The side of the tracks, 2013 («Alter Wiehre Bahnhof 2», Andreas Schwarzkopf): the same five arches and five
//     windows on the middle block; three arches on the east wing; and the east end of the middle block rising over
//     the wing's roof as a gable with a pair of small windows — so the block's roof is gabled, not hipped.
//   - Where it stands is checked against the city's plans of 1903 and 1920, which draw a building labelled «Bahnhof
//     Wiehre» here, between Urachstraße and the tracks (the plan of 1920 within about 8 m of OSM's outline, with a
//     projection in the middle of the track side), and against the coordinates on the city's tourism page. The plan of
//     1875 has only a line across the fields and an empty rectangle lettered «proj. Bahnhof».
//
// ASSUMED: every height (8 m to the eaves of the middle block, 11 m to its ridge; 4.6 m and 6.8 m for the wings);
// the wings' roofs as gabled, closed by a hip at their outer ends; the sizes of the arches and windows and their
// even spacing; three arches on every long side of both wings (the photos show eight of the twelve); the west gable
// like the east one; the outer ends of the wings, which no photo shows, left plain; the colours, by eye from the
// photo of 2019. It is drawn in one state for every year from 1903: the yellow plaster of 2019 (grey in 2005;
// earlier colours not known), no chimneys (four in 2005, one in 2019), no platform roofs, no lettering.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { orientedBox } from '../buildings.js';

export const PLACE = {
  key: 'alter-wiehrebahnhof',
  name: 'Alter Wiehrebahnhof',
  localName: 'Old Wiehre station',
  kind: 'building',
  built: { from: 1887, to: 1891 }, // the line and its station: 1887 (de.wikipedia; Hübsch 1898); the building: «1891 … eröffnet» (the city's tourism page); see `sources`
  since: 1891, // the city's tourism page: «Das denkmalgeschützte Gebäude wurde 1891 als Station der legendären Höllentalbahn eröffnet» (the later of the two years the sources give: see `sources`)
  war: { state: 'damaged', rebuilt: null, source: 'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): a blue mark lies on the building numbered 40 on the south side of Urachstraße, as the plan of 1944 draws it. No written account of the building in the raid was found' },
  coordinates: [47.9848, 7.85359], // visit.freiburg.de, «Alter Wiehrebahnhof» (the page's map data); Wikidata Q130340058 gives 47.9848 N, 7.853603 E
  osm: 'w145404229',
  sources: [
    'visit.freiburg.de (the city’s tourism site), «Alter Wiehrebahnhof»: «Das denkmalgeschützte Gebäude wurde 1891 als Station der legendären Höllentalbahn eröffnet. Seit der Stilllegung der ursprünglichen Strecke im Jahr 1934 dient das markante Backsteingebäude als kreativer Treffpunkt»; «Im Alten Wiehrebahnhof sind das Kommunale Kino und ein Café zuhause»; the address, Urachstraße 40; the coordinates in the page’s map data (47.9848 N, 7.85359 E). The page calls it a brick building; the photographs show plaster and red sandstone',
    'Wikidata, Q130340058 «Alter Wiehre-Bahnhof»: «ehemaliges Bahnhofsgebäude … eingeweiht 1890/1891, seit 1934 nicht mehr als Bahnhof genutzt» (the description; it names no source for the years); coordinates 47.9848 N, 7.853603 E',
    'German Wikipedia, «Höllentalbahn (Schwarzwald)»: «Der Streckenabschnitt Freiburg–Neustadt (Schwarzwald) konnte am 21. Mai 1887 … eröffnet werden»; «Bis 1934 nahm die Höllentalbahn vom Freiburger Hauptbahnhof bis zum Wiehrebahnhof einen anderen Verlauf als heute … querte die Strecke, wiederum höhengleich, Schwimmbad-, Loretto-, Goethe- und Günterstalstraße, um schließlich den heutigen „Alten Wiehrebahnhof“ zu erreichen. 1934 wurde die Streckenführung durch die heutige ersetzt»; «Ziel der Streckenverlegung war vor allem, die Bahnübergänge im Stadtgebiet aufzuheben»; the station: «östlich der Anlagen für den Personenverkehr Gleisanlagen für den Güterverkehr … Laderampen, Ladestraßen und ein Güterschuppen. Für den Personenverkehr waren mindestens zwei Bahnsteiggleise und ein Empfangsgebäude vorhanden. Mit der Neutrassierung der Höllentalbahn 1934 im Stadtgebiet Freiburgs wurde auch der Wiehrebahnhof verlegt. Das Bahnhofsgebäude des alten Wiehrebahnhofs in der Urachstraße ist bis heute erhalten»',
    'Eberhard Hübsch, «Die Staatseisenbahnen», in «Freiburg im Breisgau. Die Stadt und ihre Bauten» (1898), p. 134 (German Wikisource): the line to Neustadt «1887 dem Verkehr übergeben»; «Freiburg besitzt ausser dem Hauptbahnhofe noch den Bahnhof in der Wiehre für den Betrieb der Höllenthalbahn. Er … nimmt … für den Personenverkehr Freiburgs mit dem Schwarzwalde die erste Stelle ein»',
    'German Wikipedia, «Wiehre»: the line «1933 und 1934 nach Süden verlegt»; «Die alte Trasse ist im Stadtbild bis heute zu erkennen, da man in den 1950er-Jahren dort eine vierspurige Autoschnellstraße erbauen wollte»; around the building «Zweimal wöchentlich … ein Markt»',
    'German Wikipedia, «Kommunales Kino Freiburg»: «1981 zog das Kommunale Kino gemeinsam mit der Freien Künstlergruppe Freiburg (fkf) in den Alten Wiehrebahnhof … Neben den Büroräumen des Kinos und dem Kinosaal ist in dem Gebäude ein Galerieraum untergebracht. 1981 wurde das Café im Alten Wiehrebahnhof eingerichtet. Nach der Auflösung der fkf zog 2003 das Literatur Forum Südwest in den Alten Wiehrebahnhof ein. 2017 wechselte es ins Literaturhaus»',
    'City of Freiburg, plans of 1903 (1:6,500) and 1920 (1:6,000), the viewer’s plans of those years: a station building labelled «Bahnhof Wiehre» on the south side of Urachstraße, the tracks behind it; the plan of 1875 (1:6,000) draws a line across the fields here and an empty rectangle lettered «proj. Bahnhof», a station still only planned. The plan of 1944 draws the building, numbered 40, on a green strip where the tracks had been',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (the viewer’s «Nov 1944» plan): a blue mark, light to medium damage, on this building',
    'Wikimedia Commons, «Alter Wiehrebahnhof» (Chalco, 30 August 2005, public domain), «Alter Wiehre Bahnhof 2» (Andreas Schwarzkopf, 10 August 2013, CC BY-SA 3.0; «Ansicht von der früheren Gleisseite») and «Kommunales Kino Freiburg - Der Alte Wiehrebahnhof in Freiburg» (Joblin, 17 December 2019, CC BY-SA 4.0): the storeys, the bays, the arches and windows, the sandstone strips, the roofs and the colours',
    'OpenStreetMap, way 145404229 «Alter Wiehrebahnhof» (Urachstraße 40; wikidata Q130340058; geometry from maps4bw, LGL): the footprint. No levels, heights or roof are mapped',
  ],
  assumptions: [
    'every height: the middle block 8 m to the eaves and 11 m to the ridge, the wings 4.6 m and 6.8 m (OpenStreetMap maps none; read off the photographs by eye)',
    'the wings’ roofs: gabled along the building, with a hip at the outer end',
    'the size of the arches and windows, and that they are evenly spaced',
    'three arched windows on each long side of each wing: the photographs show eight of the twelve',
    'the gable at the west end of the middle block, drawn like the east one, which a photograph shows',
    'the outer ends of the wings, which no photograph shows, are left plain',
    'the colours, by eye from the photograph of 2019',
    'one state for every year: the yellow plaster of 2019 (it was grey in 2005; earlier colours are not known), without chimneys (four in 2005, one in 2019), platform roofs or lettering',
    'the year it appears: 1891, the later of the years the sources give for the building; no source read says what served the passengers from the opening of the line in 1887 until then',
    'what the raid of 1944 left: the damage map marks light to medium damage, and the building is drawn whole',
  ],
  card: {
    title: 'Alter Wiehrebahnhof',
    years: '1891 · a station until 1934',
    text: [
      'This was the station of the Wiehre on the Höllentalbahn, the railway from Freiburg up into the Black Forest. The line to Neustadt opened on 21 May 1887. The city’s tourism site says the building opened in 1891; Wikidata gives 1890/1891. No source read says what stood here in the first years. The city’s plan of 1875 already marks the spot «proj. Bahnhof», a planned station.',
      'In 1898 a book on the city’s buildings said the station came first for travel between Freiburg and the Black Forest. Goods tracks with ramps and a goods shed lay east of the building.',
      'The trains came from the main station through the district and crossed its streets on the level, the tram to Günterstal among them. To be rid of the crossings the line was moved south, through two new tunnels, in 1933 and 1934. A new Wiehre station opened on the new line, and trains have not stopped here since 1934.',
      'The city’s damage map of the air raid of 27 November 1944 marks light to medium damage here. No written account of it was found.',
      'In 1981 the Kommunales Kino moved in, together with a group of artists, and a café opened; a cinema, a gallery and the café are still here. From 2003 to 2017 the Literatur Forum Südwest was also in the house. A market is held on the square twice a week.',
      'The outline is OpenStreetMap’s. Everything above it is read off three photographs of 2005, 2013 and 2019: the heights, the roofs of the wings and the sizes of the openings are guesses, and the ends of the wings, which no photograph shows, are left plain. The yellow is that of 2019; in 2005 the plaster was grey.',
    ],
  },
};

const OUTLINE = 'w145404229';
const EAVES = 8, RISE = 3, WING_EAVES = 4.6, WING_RISE = 2.2, FLOOR = 4.5, PLINTH = 0.7;
const WALL = '#e6cd6c', TILE = '#8a4f3d', STONE = 'SANDSTONE', DARK = 'OPENING';

export function build(kit, parts) {
  const outline = parts.find((b) => b.id === OUTLINE);
  if (!outline) throw new Error('Alter Wiehrebahnhof: OSM outline missing from city.json');

  // ---- the frame: x along the building towards the west, z out towards Urachstraße (north), from the outline's middle
  const box = orientedBox(outline.rings[0]), u = box.u[0] > 0 ? [-box.u[0], -box.u[1]] : box.u;
  const P = kit.frame({ x: box.c[0], z: box.c[1], angle: Math.atan2(-u[1], u[0]), kind: KIND.PLAIN });
  const local = outline.rings[0].map(([x, z]) => [(x - box.c[0]) * u[0] + (z - box.c[1]) * u[1], -(x - box.c[0]) * u[1] + (z - box.c[1]) * u[0]]);
  // the outline, measured: the middle block is the deepest part; the wings are what lies beyond its ends
  const depth = (pts) => [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
  const [z0, z1] = depth(local), deep = local.filter((p) => p[1] < z0 + 0.4 || p[1] > z1 - 0.4).map((p) => p[0]);
  const m0 = Math.min(...deep), m1 = Math.max(...deep), x0 = Math.min(...local.map((p) => p[0])), x1 = Math.max(...local.map((p) => p[0]));
  const east = depth(local.filter((p) => p[0] < m0 - 1)), west = depth(local.filter((p) => p[0] > m1 + 1));
  if (!(m1 - m0 > 8 && m0 - x0 > 5 && x1 - m1 > 5)) throw new Error('Alter Wiehrebahnhof: the OSM outline is not a middle block between two wings any more');

  const rect = (a, b, c, d) => [P.toWorld(a, c), P.toWorld(b, c), P.toWorld(b, d), P.toWorld(a, d)];
  const block = (id, [a, b, c, d], eaves, { roof = 'gabled', rise = 0, colour = WALL, roofColour = TILE, base = null, kinds = { walls: KIND.PLAIN } } = {}) =>
    kit.osm([{ id: `wiehrebahnhof-${id}`, rings: [rect(a, b, c, d)], type: 'part', minHeight: base, height: eaves + rise, roofShape: roof, roofHeight: rise, colour, roofColour }], kinds);
  const STREET = -Math.PI / 2, TRACKS = Math.PI / 2;

  // ---- 1. the volumes: the two-storey middle block under a gabled roof, and a one-storey wing on each side (each
  //         wing's roof runs on under the middle block, so only the hip at its outer end shows: ASSUMED)
  block('middle', [m0, m1, z0, z1], EAVES, { rise: RISE });
  block('east', [x0, m0 + 5, east[0], east[1]], WING_EAVES, { roof: 'hipped', rise: WING_RISE });
  block('west', [m1 - 5, x1, west[0], west[1]], WING_EAVES, { roof: 'hipped', rise: WING_RISE });

  // ---- 2. red sandstone: the plinth all round, the band between the floors, the strips at the corners and after
  //         the first and the fourth bay
  const P2 = 0.12; // (how far the stone stands out of the plaster)
  P.box(m1 - m0 + 2 * P2, PLINTH, z1 - z0 + 2 * P2, (m0 + m1) / 2, 0, (z0 + z1) / 2, STONE);
  P.box(m0 - x0 + P2, PLINTH, east[1] - east[0] + 2 * P2, (x0 + m0 - P2) / 2, 0, (east[0] + east[1]) / 2, STONE);
  P.box(x1 - m1 + P2, PLINTH, west[1] - west[0] + 2 * P2, (x1 + m1 + P2) / 2, 0, (west[0] + west[1]) / 2, STONE);
  P.box(m1 - m0 + 2 * P2, 0.25, z1 - z0 + 2 * P2, (m0 + m1) / 2, FLOOR, (z0 + z1) / 2, STONE);
  const bays = 5, bay = (m1 - m0) / bays, STRIP = 0.7;
  for (const z of [z0, z1]) {
    for (const x of [m0 + STRIP / 2 - P2, m1 - STRIP / 2 + P2]) P.box(STRIP, EAVES, STRIP, x, 0, z + (z === z0 ? 1 : -1) * (STRIP / 2 - P2), STONE); // the corners
    for (const x of [m0 + bay, m1 - bay]) P.box(STRIP, EAVES, 2 * P2, x, 0, z, STONE);
  }
  for (const [x, [a, b]] of [[x0, east], [x1, west]]) for (const z of [a, b]) P.box(0.5, WING_EAVES, 0.5, x + (x === x0 ? 1 : -1) * (0.25 - P2), 0, z + (z === a ? 1 : -1) * (0.25 - P2), STONE); // the wings' outer corners

  // ---- 3. the openings: a round arch in a sandstone frame, an upright window in a sandstone frame
  const flat = (w, h, x, y, z, na, colour, out) => P.panel(w, h, x, y, z + (na === STREET ? out : -out), na, colour);
  const half = (r, x, y, z, na, colour, out) => P.put(new THREE.CircleGeometry(r, 10, 0, Math.PI).rotateY(na + Math.PI / 2), colour, new THREE.Matrix4().makeTranslation(x, y, z + (na === STREET ? out : -out)));
  const arch = (x, z, na, w, foot, spring) => { // (an opening w wide, from `foot` up to `spring`, then a half circle)
    const F = 0.28;
    flat(w + 2 * F, spring - foot + F, x, foot - F, z, na, STONE, 0.05); half(w / 2 + F, x, spring, z, na, STONE, 0.05);
    flat(w, spring - foot, x, foot, z, na, DARK, 0.1); half(w / 2, x, spring, z, na, DARK, 0.1);
  };
  const upright = (x, z, na) => { flat(1.6, 2.5, x, FLOOR + 0.75, z, na, STONE, 0.05); flat(1.1, 1.9, x, FLOOR + 1.05, z, na, DARK, 0.1); };
  for (const [z, na] of [[z1, STREET], [z0, TRACKS]]) {
    for (let i = 0; i < bays; i++) {
      const x = m0 + (i + 0.5) * bay, door = i > 0 && i < bays - 1;
      arch(x, z, na, 1.7, door ? PLINTH - 0.4 : PLINTH + 0.5, 2.9); // three doors in the middle, a window on each side
      upright(x, z, na);
    }
  }
  // the wings: three round-arched windows on each long side
  for (const [a, b, [c, d]] of [[x0, m0, east], [m1, x1, west]]) for (const [z, na] of [[d, STREET], [c, TRACKS]]) for (let i = 0; i < 3; i++) arch(a + 0.6 + ((i + 0.5) * (b - a - 0.8)) / 3, z, na, 1.5, PLINTH + 0.5, 2.6);
  // the gables of the middle block over the wings' roofs: a pair of small windows each
  for (const [x, na] of [[m0 - 0.06, Math.PI], [m1 + 0.06, 0]]) for (const dz of [-0.5, 0.5]) P.panel(0.7, 1.2, x, EAVES + 0.5, (z0 + z1) / 2 + dz, na, DARK);

  return { anchor: P.toWorld((m0 + m1) / 2, (z0 + z1) / 2), top: EAVES + RISE };
}
