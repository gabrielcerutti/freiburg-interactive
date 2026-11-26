// Freiburg (Breisgau) Hauptbahnhof as it stands today: the station that Harter + Kanzler built with Bilfinger Berger
// on the east side of the tracks, opened on 29 September 1999 — two long six-storey ranges with a glass-roofed
// concourse between them, and two office towers. It is the third station building on this ground: the first
// (alter-hauptbahnhof.js, 1845–1944) and the provisional one (hauptbahnhof-1949.js, 1949–1997) are places of their own.
//
// What the place covers — three OSM outlines and the building:parts inside them:
//   - way 233444291, «Hauptbahnhof» (building=train_station, Bismarckallee 7): the range along platform 1 in two
//     pieces (ways 308486106 and 308652383), the low piece between them (way 308652382), the low part along the
//     street with the concourse (way 308486103), the canopy over the entrance (way 308487756) and the link at the
//     south end (way 1428672412);
//   - way 308486108 (Bismarckallee 9, offices): the two towers (ways 308486104 and 308486105);
//   - way 308486107 (offices): the range along Bismarckallee north of the towers.
// Left to the generic city: a lift at the corner of the concourse (way 232851000, a part OSM maps outside the
// station's outline, so tools/city.mjs does not hand it to the place); the InterCity hotel south of the station (way 17062369, 1992) and the building between
// the two (way 236503161, Bismarckallee 5); the roofs over the platforms (ways 233444302, 233444303 and others); the
// Stadtbahn bridge of 1983 over the tracks with its lifts and tram-stop roofs (drawn as track and as OSM's small
// roofs); the bus station; and what stands north of the station's outline on Bismarckallee (way 144908139 and on).
// The German Wikipedia says the two ranges are 275 m long on the tracks and 265 m on Bismarckallee; OSM's outlines
// taken here are about 215 m from end to end. Which neighbours the longer figure counts in, no source found says.
//
// How it is made:
//   - The plan is OSM's. The heights are NOT OSM's but the German Wikipedia's: «zwei Gebäude mit jeweils sechs
//     Stockwerken (22 Meter Höhe) … sowie zwei Bürotürme mit einer Höhe von 44 beziehungsweise 60 Metern». OSM tags
//     the pieces of the track-side range height=15, the street-side range 6 levels, and the towers 12 and 18 levels
//     (no heights). The taller tower is the one OSM gives 18 levels (way 308486105, the southern one), which agrees
//     with the German Wikipedia placing the «Windfenster» north of the taller tower.
//   - The «Windfenster» (wind window), about 14 m wide: on the track side, north of the towers, storeys three to six
//     are left out so that air passes between the old town and the Stühlinger. OSM maps it as a low piece (way
//     308652382, height=5); it is drawn two storeys high, a third of the 22 m.
//   - The concourse and the market hall lie between the two ranges under a glass roof «oberhalb des zweiten
//     Stockwerks»: OSM's low part (way 308486103, height=5) is drawn two storeys high with a pale glass roof.
//   - The canopy: «das freischwebende Vordach des Empfangsgebäudes». OSM's outline (way 308487756), drawn as a slab
//     at the height of the concourse's roof on two columns, as in the photograph of 2009 («Gare de Fribourg IMG
//     4390», Wikimedia Commons).
//   - The towers' south faces carry photovoltaic panels («Die beiden Türme sind an der Südseite mit einer
//     Photovoltaikanlage … versehen»): drawn dark blue, as in the photograph of 2008 («FR-HBF 011», Wikimedia
//     Commons). The other walls are glass: drawn pale grey-green with a dark band of glass for every storey — six
//     on the ranges, and on the towers the 12 and 18 that OSM counts.
//
// The ground: the viewer's terrain is coarse here and falls 3 m from the entrance to the north end of the row, and
// src/main.js stands a whole place on the lowest ground under it — which would bury the entrance 3 m deep. So every
// piece is raised to the ground at the entrance (FLOOR, measured on the viewer's terrain) and carried down to the
// place's foot on a plain base: along the lower ground the base shows, up to 3 m high at the north end.
//
// ASSUMED: that all six storeys are equally high (so two storeys are 7.3 m: the concourse's roof, the low piece
// under the wind window and the canopy); the bands of glass (one per storey, on every face, all alike; the towers' storeys
// counted as OSM tags them); the colours; the canopy's thickness and its columns; the link at the south end, drawn as OSM
// gives it (15 m, starting one level up); that the photovoltaic panels cover the whole south
// face of each tower. Not drawn: the glazed bridge that has crossed the wind window at the sixth storey since 2000,
// the dark precast west front, the plant on the roofs, the underpass and its skylight, the lettering.

import { KIND } from '../kit.js';

// OSM's parts (https://www.openstreetmap.org/way/<number>)
const PART = {
  tracksSouth: 'w308486106', // the range along platform 1, south of the wind window
  tracksNorth: 'w308652383', // …and north of it
  window: 'w308652382',      // the piece between the two: the «Windfenster» above its second storey
  concourse: 'w308486103',   // the low part between the ranges and along the street: concourse and market hall
  canopy: 'w308487756',      // the canopy over the entrance on Bismarckallee
  link: 'w1428672412',       // at the south end, towards the hotel
  towerLow: 'w308486104',    // the northern, lower tower (12 levels in OSM)
  towerHigh: 'w308486105',   // the southern, taller tower (18 levels in OSM)
  street: 'w308486107',      // the range along Bismarckallee north of the towers
};

const RANGE = 22, TOWER_LOW = 44, TOWER_HIGH = 60; // metres (German Wikipedia: six storeys, 22 m; the towers 44 and 60 m)
const TWO_STOREYS = (RANGE / 6) * 2;               // (ASSUMED: six equal storeys)
const FLOOR = 2.9; // metres: the ground at the entrance above the lowest ground under the place (the viewer's terrain: −8.9 m and −11.8 m)
const BASE = '#8f8c86', BAND = '#46565f', GLASS = '#a9bbb6', GLASS_DARK = '#93a8a4', TOWER = '#8fb3aa', ROOF = '#8d8a85', GLASS_ROOF = '#bccdd0', CONCRETE = '#d5d2c8', BLUE = '#2f4b8a';

export const PLACE = {
  key: 'hauptbahnhof',
  name: 'Hauptbahnhof',
  localName: 'Main station: today’s building, since 1999',
  kind: 'group',
  built: { from: 1997, to: 2001 }, // de.wikipedia: the old building pulled down in February 1997; opened 29 September 1999; the whole row 18 July 2001
  // The year the new station opened. The sources give more than one year: the German Wikipedia's infobox says «1999
  // heutiges Gebäude» and its text «Am 29. September 1999 konnte der neue Hauptbahnhof eröffnet werden; die komplette
  // Bahnhofszeile folgte am 18. Juli 2001», while the heading of its section on the building reads «Drittes Gebäude
  // (seit 2001)»; OSM tags the outline start_date=1999. No source found dates the towers on their own: they belong
  // to the row that was complete in 2001. No stop of the timeline lies between 1981 and today, so nothing shown
  // depends on which year is taken.
  since: 1999,
  coordinates: [47.997697, 7.84117], // de.wikipedia «Freiburg (Breisgau) Hauptbahnhof», infobox (a point on the platforms, beside the track-side range)
  osm: 'w233444291',
  checks: { height: TOWER_HIGH + FLOOR }, // (the check measures from the place's foot: the taller tower's 60 m stand on the base)
  sources: [
    'German Wikipedia, «Freiburg (Breisgau) Hauptbahnhof»: coordinates (47.997697 N, 7.84117 E); infobox «Eröffnung: 1845 historisches Gebäude, 1949 Provisorium, 1999 heutiges Gebäude», «Architekten: Harter + Kanzler»; the junction of the Rheintalbahn (Mannheim–Basel), the Höllentalbahn and the line to Breisach; eight platform tracks; 75,000 travellers and visitors a day in 2019',
    'German Wikipedia, the same article, «Weg zum heutigen Neubau»: the decision of 1988 to build the Konzerthaus set things moving; a competition for investors, led by Albert Speer junior, with nine proposals from seven investors; «Sieger wurde das Waldkircher Architektenbüro Harter und Kanzler mit dem Baukonzern Bilfinger Berger als Investor»; objections to the closed row, to the height of the two towers and to the effect on the air of the Stühlinger; a climate report of June 1992 found the airing of Wentzingerstraße reduced by 15 %, so the city insisted on «einer ungefähr 14 Meter breiten Öffnung im Baukörper, dem sogenannte Windfenster»; «Der Abriss im Februar 1997 schuf – nach 50 Jahren Provisorium – Platz für den Neubau»; «Am 29. September 1999 konnte der neue Hauptbahnhof eröffnet werden; die komplette Bahnhofszeile folgte am 18. Juli 2001»',
    'German Wikipedia, the same article, «Drittes Gebäude (seit 2001)»: 40,000 m² gross floor area, 230,000 m³, 61.4 million euros; «zwei Gebäude mit jeweils sechs Stockwerken (22 Meter Höhe) und einer Länge von 275 Metern am Gleis und 265 Metern an der Bismarckallee sowie zwei Bürotürme mit einer Höhe von 44 beziehungsweise 60 Metern», opposite Eisenbahnstraße and Rosastraße; the taller tower is the second-highest building of the old town after the Münster; «Oberhalb des zweiten Stockwerks sind die beiden Gebäude durch ein Glasdach verbunden», with the concourse and the market hall under it; 25,000 m² of offices; the free-floating canopy, which the architects say quotes the roof of the Konzerthaus; the wind window north of the taller tower, where storeys three to six are left out on the track side; glass fronts, a darker west side of precast parts; photovoltaic panels on the south side of both towers, commended in the state’s photovoltaic architecture prize of 2001',
    'German Wikipedia, the same article, «Verbindungssteg im „Windfenster“»: in 2000 Bilfinger Berger put a glazed bridge across the wind window at the sixth storey without the city’s knowledge; a fine of 70,000 DM followed, and the bridge stayed',
    'OpenStreetMap, way 233444291 («Hauptbahnhof», building=train_station, Bismarckallee 7, start_date=1999, architect=«Harter + Kanzler, Freiburg»), way 308486108 (Bismarckallee 9) and way 308486107, and the eight building:parts inside the first two: the plan of every piece; its tags height=15 for the track-side range, 12 and 18 levels for the towers, 6 levels for the street-side range and height=5 for the low parts are NOT used where the German Wikipedia gives metres',
    'Wikimedia Commons, «Freiburg Bahnhof-3» (Luftfahrer, 15 April 2007, CC BY 3.0): the station from the air — the long range on the tracks, the lower glass roof beside it, the two towers, the range on the street',
    'Wikimedia Commons, «Gare de Fribourg IMG 4390 retouched» (Poudou99, 24 May 2009, CC BY 3.0): the entrance — the canopy on its columns before the glass front of the concourse, the six-storey range behind — and «FR-HBF 011 retouched» (Joergens.mi, 30 July 2008, CC BY-SA 3.0): the towers from the south, their south faces dark blue',
  ],
  assumptions: [
    'that the six storeys are equally high, so that two storeys — the concourse’s glass roof, the piece under the wind window, the canopy — come to 7.3 metres',
    'the fronts: one dark band of glass per storey on every face, all alike; the towers’ 12 and 18 storeys are OpenStreetMap’s count',
    'the colours of the glass fronts and of the roofs',
    'that the photovoltaic panels cover the whole south face of each tower',
    'the canopy’s thickness and its two columns, placed by eye from one photograph',
    'the link at the south end, drawn as OpenStreetMap gives it (15 metres high, starting one level up)',
    'the ground: the viewer’s terrain falls 3 metres along the row, so the station stands on a plain base that shows where the ground is lower',
    'not drawn: the glazed bridge across the wind window, the dark west front, the plant on the roofs, the underpass',
  ],
  card: {
    title: 'Hauptbahnhof',
    years: 'opened 1999 · the whole row 2001',
    text: [
      'Freiburg’s main station stands where the line from Mannheim to Basel meets the Höllentalbahn into the Black Forest and the line to Breisach. It has eight platform tracks; in 2019 about 75,000 travellers and visitors used it a day.',
      'This is the third station building on this ground. The first, of 1845, was destroyed in the air raid of 27 November 1944. A provisional building of 1949 stood for almost fifty years and was pulled down in February 1997. The timeline shows each of them at its own years.',
      'The new station was opened on 29 September 1999, and the whole row along the tracks on 18 July 2001. The architects were Harter + Kanzler, the investor the building firm Bilfinger Berger, which won a competition for investors. It cost 61.4 million euros.',
      'Two ranges of six storeys, 22 metres high, run along the tracks and along Bismarckallee. Above the second storey a glass roof joins them, over the concourse and a market hall. Two office towers stand before them, 44 and 60 metres high; the taller is the second-highest building of the old town after the Münster. Their south faces carry photovoltaic panels.',
      'A climate report of 1992 found that the closed row would cut the airing of the Stühlinger, the quarter behind the station. So the city insisted on the «Windfenster», the wind window: an opening about 14 metres wide where the upper four storeys are left out. In 2000 the owner put a glazed bridge across it without asking, and paid a fine of 70,000 marks.',
      'The sources do not agree on everything. The German Wikipedia gives 1999 for the opening and heads its section on the building «since 2001»; it places the architects in Waldkirch, OpenStreetMap in Freiburg; it gives the ranges as 275 and 265 metres long, while the outlines OpenStreetMap maps as the station are about 215 metres from end to end.',
      'The plan is OpenStreetMap’s; the 22, 44 and 60 metres are the German Wikipedia’s. The bands of glass are schematic, the colours and the canopy are placed by eye from photographs, and the low parts are drawn two storeys high on the guess that all six storeys are equal.',
    ],
  },
};

export function build(kit, parts) {
  const by = Object.fromEntries(Object.entries(PART).map(([k, id]) => [k, parts.find((b) => b.id === id)]));
  const missing = Object.keys(by).filter((k) => !by[k]);
  if (missing.length) throw new Error(`Hauptbahnhof: OSM parts missing from city.json (${missing.join(', ')})`);
  const W = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }); // (the frame is the world: every outline is OSM's)
  const plain = { walls: KIND.PLAIN, roof: KIND.PLAIN }, bare = { levels: null, minLevel: null, minHeight: null, roofLevels: null, roofHeight: null, roofShape: 'flat', inset: null };
  const middle = (r) => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length];
  const turn = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return Math.sign(a); };
  /** the sides of an outline: their ends, length, middle and the direction they face */
  const sides = (r) => { const s = turn(r); return r.map((p, i) => { const q = r[(i + 1) % r.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return { p, q, len, m: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], n: [((q[1] - p[1]) / len) * s, (-(q[0] - p[0]) / len) * s] }; }); };
  let axis = [0, 1]; { const s = sides(by.tracksSouth.rings[0]).sort((a, b) => b.len - a.len)[0]; axis = [(s.q[0] - s.p[0]) / s.len, (s.q[1] - s.p[1]) / s.len]; } // (the direction of the row…)
  if (axis[1] < 0) axis = [-axis[0], -axis[1]]; // (…pointing south)
  const south = (s) => s.n[0] * axis[0] + s.n[1] * axis[1] > 0.8;
  // one of OSM's pieces, `height` high from the station's floor, with a dark band of glass for each of its
  // `storeys` on every face (`solar`: but not on the faces that look south: the towers' panels); under it the base
  const solid = (k, height, storeys, colour, { roofColour = ROOF, solar = false } = {}) => {
    kit.osm([{ ...by[k], ...bare, height, colour, roofColour }], { ...plain, lift: FLOOR });
    kit.osm([{ ...by[k], ...bare, id: `${by[k].id}-base`, height: FLOOR, colour: BASE, roofColour: BASE }], plain);
    const storey = height / storeys;
    for (const s of sides(by[k].rings[0])) {
      if (s.len < 2.5 || (solar && south(s))) continue;
      for (let i = 0; i < storeys; i++) W.panel(s.len - 0.9, storey * 0.56, s.m[0] + s.n[0] * 0.06, FLOOR + (i + 0.26) * storey, s.m[1] + s.n[1] * 0.06, Math.atan2(-s.n[1], s.n[0]), BAND);
    }
  };

  // ---- 1. the two six-storey ranges (22 m: source) and the towers (44 and 60 m: source)
  solid('tracksSouth', RANGE, 6, GLASS_DARK);
  solid('tracksNorth', RANGE, 6, GLASS_DARK);
  solid('street', RANGE, 6, GLASS);
  solid('towerLow', TOWER_LOW, by.towerLow.levels ?? 12, TOWER, { solar: true });
  solid('towerHigh', TOWER_HIGH, by.towerHigh.levels ?? 18, TOWER, { solar: true });

  // ---- 2. the low parts, two storeys high: under the wind window, and the concourse under its glass roof
  solid('window', TWO_STOREYS, 2, GLASS_DARK);
  solid('concourse', TWO_STOREYS, 2, GLASS, { roofColour: GLASS_ROOF });
  kit.osm([{ ...by.link, inset: null, colour: GLASS_DARK, roofColour: ROOF }], { ...plain, lift: FLOOR }); // (as OSM gives it)

  // ---- 3. the canopy over the entrance: a slab at the height of the concourse's roof, on two columns
  kit.osm([{ ...by.canopy, ...bare, minHeight: TWO_STOREYS, height: TWO_STOREYS + 0.6, colour: CONCRETE, roofColour: CONCRETE }], { ...plain, lift: FLOOR });
  // (its long edge farthest from the tracks is the street edge: the columns stand just inside it)
  const ring = by.canopy.rings[0], centre = middle(ring);
  const east = sides(ring).sort((a, b) => b.len - a.len).slice(0, 2).sort((a, b) => (b.p[0] + b.q[0]) - (a.p[0] + a.q[0]))[0];
  for (const t of [0.22, 0.78]) {
    const x = east.p[0] + (east.q[0] - east.p[0]) * t, z = east.p[1] + (east.q[1] - east.p[1]) * t, d = Math.hypot(centre[0] - x, centre[1] - z);
    W.cylinder(0.35, FLOOR + TWO_STOREYS, x + ((centre[0] - x) / d) * 0.7, 0, z + ((centre[1] - z) / d) * 0.7, CONCRETE, 10);
  }

  // ---- 4. the photovoltaic panels: the faces of the towers that look south along the row, dark blue
  for (const [k, top] of [['towerLow', TOWER_LOW], ['towerHigh', TOWER_HIGH]]) for (const s of sides(by[k].rings[0])) {
    if (s.len >= 1 && south(s)) W.panel(s.len - 0.3, top - TWO_STOREYS - 0.6, s.m[0] + s.n[0] * 0.07, FLOOR + TWO_STOREYS, s.m[1] + s.n[1] * 0.07, Math.atan2(-s.n[1], s.n[0]), BLUE);
  }

  return { anchor: middle(by.towerHigh.rings[0]), top: FLOOR + TOWER_HIGH };
}
