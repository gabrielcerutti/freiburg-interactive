// The second station building of Freiburg: the «Provisorium» that Walter Lay designed for the railway after the
// war, opened on 9 November 1949 on the foundations of the destroyed building of 1845 and pulled down in February
// 1997 for today's station. It is gone and not in OpenStreetMap: like the first building (alter-hauptbahnhof.js) it
// stands on the footprint read off the city's plan of 1920, and is shown from 1949 to the last stop before `until`.
//
// Where it stood:
//   - The German Wikipedia says the building re-used «der intakt gebliebenen Fundamente und des Kellergeschosses» of
//     the old one. So the model takes the old building's traced rectangle (see alter-hauptbahnhof.js: the plan of
//     1920, each corner good to 2–3 m), its axis, its depth of 29.5 m and its line along platform 1. The same source
//     says there were «lediglich 30 Meter zwischen Bahnsteig und Vorplatz», which agrees with that depth.
//   - Its length and its place along that axis are the city's plan of 1955 (1:10,000, the viewer's plan of that
//     year), which draws the station as one red rectangle, about 65 m by 30 m, inside the old outline: its south
//     end 9 m in from the old south end, its north end 19 m in from the old north end (read off a sixfold
//     enlargement by eye; a tram stop's sign is printed over its street side, and at 1:10,000 a line is 3 m thick:
//     good to about 4 m). Its west and east sides lie on the old outline's, which bears the source out.
//   - Willy Pragher's aerial photographs of 30 March 1974 and 8 September 1976 show more than that plan draws: low
//     flat-roofed parts beyond both ends, about 80 m in all. Whether they were there in 1955 no source found says
//     (the German Wikipedia mentions works in 1955/56 without saying what was built). They are not drawn.
//   - The plan of 1981 (1:16,000) draws the station as a red strip too coarse to measure.
//
// How it is made (after the photographs, all on Wikimedia Commons; the layout is theirs, every size is by eye):
//   - «ein Grundriss mit massivem Mittelbau und zwei niederen Seitenflügeln in Leichtbauweise» (German Wikipedia):
//     a two-storey middle block under a hipped tile roof, and a lower wing on each side.
//   - The middle block's front, as in Pragher's photograph of 30 April 1981 («Freiburg Hauptbahnhof mit Vorplatz»):
//     tall windows between piers the full height of the upper storey, a canopy over the doors, a plain stretch of
//     wall with three tall windows at one end. On the ridge a small square clock turret (German Wikipedia: «In
//     Erinnerung an den alten Bahnhof hatte man ein Uhrtürmchen auf dem Dach platziert»; the photograph shows it).
//   - Behind the middle block the hall, low and flat-roofed (German Wikipedia: the hall was 5.50 m high inside and
//     had 520 m² of floor), lit by the skylight of the old building, whose steel frame of 15.60 × 12.40 m had come
//     through the raid: the aerial photographs show it as a glazed pyramid behind the big roof.
//   - The north wing, as the aerial photographs show it: a one-storey range on the street and another on the
//     platform, both under hipped tile roofs, with a yard between them (full of parked cars in 1974 and 1976),
//     closed at the north end by a low flat-roofed building.
//   - The south wing: a low range under a hipped tile roof on the street (the photograph of 1981 shows its end beside
//     the middle block), and low flat roofs behind it (the aerial photographs).
//   - Colours, from Peter Kappus's colour photograph of 1990 («Bahnhof Freiburg 27»): pale yellow walls, red-brown
//     tiles.
//
// Not drawn: the roofs over the platforms (the halls of 1885/86 on their Corinthian columns stood until 1997), the
// bus station south of the building, the kiosks and canopies added to the front over the years, the cross range
// between the middle block and the north yard, the works of 1955/56 and of 1985/86 that the German Wikipedia
// mentions without saying what they changed. It is drawn in one state for 1955 and 1981.
//
// ASSUMED: how the 65 m of the 1955 plan divide into south wing, middle block and north wing (21, 24 and 21 m: the
// middle block in the middle);
// every height (the middle block 8.5 m to the eaves and 12.5 m to the ridge, the turret 15.6 m, the wings 4.5 m to
// the eaves, the hall's roof 6.5 m); the depth of the middle block (13 m) and of the wings' ranges (9 m); the number and size of the windows and piers (seven bays,
// counted on the 1981 photograph), the canopy, and all the openings of the wings and of the hall (plain rows of windows);
// the height of the skylight and that it sits in the middle of the hall; the south wing as one range on the street with one flat block behind it.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { FRAME, DEPTH, LENGTH, world } from './alter-hauptbahnhof.js';

const SKYLIGHT = [15.6, 12.4]; // metres (German Wikipedia: «des Bauteils mit 15,60 × 12,40 Metern»)
// Along the old building's axis, in metres from its middle (north is +): the ends of the rectangle the plan of 1955
// draws, read off that plan by eye (good to about 4 m)…
const PLAN_1955 = [-LENGTH / 2 + 9.3, LENGTH / 2 - 19.4]; // −37.8 … +27.7
// …and from here on everything is ASSUMED (see the top of the file)
const [SOUTH_END, NORTH_END] = PLAN_1955, CENTRE = (SOUTH_END + NORTH_END) / 2, MIDDLE = [CENTRE - 12, CENTRE + 12];
const BLOCK_DEPTH = 13, RANGE = 9, EAVES = 8.5, RISE = 4, WING_EAVES = 4.5, WING_RISE = 3, HALL = 6.5, LOW = 4, TURRET = 15.6;
const WALL = '#e9e0bd', WALL_LOW = '#e4dcc4', TILE = '#8f4f3a', FLAT = '#8d8a85', GLASS = '#a7b7ba', DARK = 'OPENING', PIER = '#f0e9cf', DIAL = '#f1ecdc', CONCRETE = '#cfcabb';

const front = DEPTH / 2;
const rect = (x0, x1, z0, z1) => [world(x0, z0), world(x1, z0), world(x1, z1), world(x0, z1)];

export const PLACE = {
  key: 'hauptbahnhof-1949',
  name: 'Hauptbahnhof',
  localName: 'Main station: the provisional building, 1949–1997',
  kind: 'building',
  built: { from: 1947, to: 1949 }, // de.wikipedia: the hall «zwischen 1947 und 1949 … errichtet»
  since: 1949, // de.wikipedia: «Die Eröffnung fand am 9. November 1949 … statt»; infobox «1949 Provisorium»
  until: 1997, // de.wikipedia: «Der Abriss im Februar 1997 schuf – nach 50 Jahren Provisorium – Platz für den Neubau»
  coordinates: [47.997697, 7.84117], // de.wikipedia «Freiburg (Breisgau) Hauptbahnhof», infobox (the station: a point on the platforms)
  osm: null, // (gone: not in OpenStreetMap)
  sources: [
    'German Wikipedia, «Freiburg (Breisgau) Hauptbahnhof», «Zweiter Weltkrieg und seine Folgen»: «Die Aufräumarbeiten am Hauptgebäude begannen indes erst im Herbst 1947 und gingen wegen Personal- und Materialmangel bis zur Währungsreform 1948 nur schleppend voran. Der Freiburger Hauptbahnhof erhielt statt eines Wiederaufbaus ein provisorisches Empfangsgebäude, wobei es sich um das erste in einer deutschen Großstadt nach dem Kriege handelte. Die Eröffnung fand am 9. November 1949 in Gegenwart des badischen Staatspräsidenten Leo Wohleb statt»; work on the building again in 1955/56 and a large conversion inside in 1985/86, for the Landesgartenschau; the Badische Zeitung called it «eine Schande für die Groß- und Fremdenverkehrsstadt Freiburg»; plans for a new station over the tracks failed in the city council in October 1970, and in 1980 the Bundesbahn asked for the talks to be suspended',
    'German Wikipedia, the same article, «Zweites Gebäude (1949–1999)»: the old foundations and cellar were used again; «ein Grundriss mit massivem Mittelbau und zwei niederen Seitenflügeln in Leichtbauweise»; «Entworfen worden war der Bau von Oberreichsbahnrat und Architekten Walter Lay»; the steel frame of the old building’s skylight, 15.60 × 12.40 m, used again, the hall being only 5.50 m high; waiting rooms for smokers and non-smokers instead of by class; «ein Uhrtürmchen auf dem Dach»; the hall built from 1947 to 1949 for 300,000 DM by Bilfinger Berger, 520 m², with «lediglich 30 Meter zwischen Bahnsteig und Vorplatz»; The Railway Gazette of 14 July 1950: «not only fully adequate for the purpose, but also satisfactory architecturally»',
    'German Wikipedia, the same article, «Weg zum heutigen Neubau»: «Der Abriss im Februar 1997 schuf – nach 50 Jahren Provisorium – Platz für den Neubau»; the Corinthian columns that had carried the platform roofs at track 1 since 1885/86 went with it; the new station opened on 29 September 1999. The heading of the section on this building gives its years as 1949–1999, the text its demolition as February 1997',
    'City of Freiburg, plan of 1955 (1:10,000; the viewer’s plan of that year): the station as a rectangle of about 65 m by 30 m on the east side of the tracks, inside the outline of the old building; and the plan of 1920, from which that outline is read (see the first building’s file)',
    'Wikimedia Commons, «Freiburg: Hauptbahnhof mit Volksbank» (Willy Pragher, 30 March 1974, Staatsarchiv Freiburg W 134 Nr. 100208c, CC BY 4.0) and «Freiburg: Hauptbahnhof, Bismarckallee, von Norden» (Willy Pragher, 8 September 1976, W 134 Nr. 106747, CC BY 4.0): the building from the air — the big hipped roof of the middle block, the glazed pyramid behind it, the north wing’s two ranges with the yard between them, the low flat parts at both ends, the platform roofs',
    'Wikimedia Commons, «Freiburg i. Br.: Hauptbahnhof mit Vorplatz» (Willy Pragher, 30 April 1981, Staatsarchiv Freiburg W 134 Nr. 117843e, CC BY 3.0 de): the front of the middle block — the piers, the tall windows, the canopy, the square clock turret on the ridge — and a lower wing beyond it',
    'Wikimedia Commons, «Bahnhof Freiburg 27» (Peter Kappus, 1990, CC BY-SA 3.0; «Ehemaliger Bahnhofsvorplatz mit altem Empfangsgebäude, inzwischen komplett abgerissen»): the colours — pale yellow walls, red-brown tiled roofs — and the low wing with its hipped roof',
  ],
  assumptions: [
    'where it stood: on the outline of the old building, read off the plan of 1920 to 2–3 metres (the German Wikipedia says the old foundations were used again; the plan of 1955 draws it inside that outline)',
    'its length and its ends are read off the plan of 1955 (1:10,000) by eye, to about 4 metres: 65 metres; aerial photographs of 1974 and 1976 show low parts beyond both ends, which are not drawn',
    'how the length divides: the middle block of 24 m in the middle, a wing of 21 m on each side',
    'every height: the middle block 8.5 m to the eaves and 12.5 m to the ridge, the clock turret 15.6 m, the wings 4.5 m to the eaves; the hall’s roof at 6.5 m is set by its sourced inside height of 5.50 m',
    'the depth of the middle block (13 m) and of the wings’ ranges (9 m)',
    'the front of the middle block: seven bays of tall windows between piers and three tall windows beside them, counted on one photograph; their sizes and the canopy’s',
    'the windows of the wings and of the hall towards the platform: plain rows, their number and size made up',
    'the skylight’s height and its place in the middle of the hall (its length and width are sourced)',
    'the ground: the viewer’s terrain falls about a metre towards the south end, so the building stands level on a plain base',
    'the south wing as one range on the street with a flat-roofed block behind it, and the low building that closes the north yard',
    'it is drawn in one state for both stops, 1955 and 1981: the works of 1955/56 and the additions of later years are not shown',
  ],
  card: {
    title: 'Hauptbahnhof',
    years: '1949 · pulled down 1997',
    text: [
      'After the air raid of 27 November 1944 the first station building lay in ruins. Clearing it began only in the autumn of 1947. Instead of rebuilding it, the railway put up a provisional building, the first new station building of a large German city after the war. It opened on 9 November 1949.',
      'Walter Lay, an architect of the railway, designed it. Money, materials and machines were short, so it stood on the old foundations and cellar: a solid middle block and two low wings of light construction, which could have been raised later. The hall was only 5.50 metres high; the steel frame of the old building’s skylight, 15.60 by 12.40 metres, had come through the raid and was used again to light it. A small clock turret on the roof recalled the old station.',
      'The hall had 520 square metres, more than the old one, and cost 300,000 marks. In 1950 The Railway Gazette called the building «not only fully adequate for the purpose, but also satisfactory architecturally». Later the Badische Zeitung called it a disgrace for the city.',
      'Plans to replace it filled decades: a platform over the tracks failed in the city council in 1970, a station with a congress centre was too dear in 1978. The provisional building stood for almost fifty years. It was pulled down in February 1997, and today’s station opened on 29 September 1999. The German Wikipedia heads its section on this building «1949–1999» and gives its demolition as February 1997.',
      'Nothing of it is left. The model stands on the outline of the old building, read off the city’s plan of 1920 to a few metres. The layout — the big roof, the glazed pyramid behind it, the north wing around its yard — is taken from two aerial photographs of 1974 and 1976, the front from a photograph of 1981, the colours from one of 1990. Its length is the 65 metres the plan of 1955 draws; the photographs show low parts beyond both ends, which are left out. Every height is a guess, and so are the windows of the wings.',
    ],
  },
};

export function build(kit) {
  const P = kit.frame({ ...FRAME, kind: KIND.PLAIN });
  const block = (id, [x0, x1, z0, z1], eaves, { roof = 'flat', rise = 0, colour = WALL_LOW, roofColour = roof === 'flat' ? FLAT : TILE, base = 0, kinds = { walls: KIND.PLAIN } } = {}) =>
    kit.osm([{ id: `hbf-1949-${id}`, rings: [rect(x0, x1, z0, z1)], type: 'part', minHeight: base || null, height: eaves + rise, roofShape: roof, roofHeight: rise, colour, roofColour }], kinds);
  const [m0, m1] = MIDDLE, STREET = -Math.PI / 2, TRACKS = Math.PI / 2, zb = front - BLOCK_DEPTH;

  // ---- 0. a base under the whole building: the viewer's terrain falls about a metre towards the south end, and the
  //         place stands on the ground under its middle block (src/main.js)
  block('base', [SOUTH_END, NORTH_END, -front, front - 1.5], 0.05, { base: -2, roofColour: WALL_LOW, kinds: { walls: KIND.PLAIN, roof: KIND.PLAIN } });

  // ---- 1. the middle block: two storeys, a hipped tile roof, the clock turret on its ridge
  block('middle', [m0, m1, zb, front], EAVES, { roof: 'hipped', rise: RISE, colour: WALL, kinds: { walls: KIND.PLAIN } });
  // its front: at the south end a plain stretch with three tall windows, then seven bays of tall windows between piers
  for (const d of [1.6, 3.4, 5.2]) P.panel(0.9, 4.6, m0 + d, 2.6, front + 0.06, STREET, DARK);
  const bays = 7, b0 = m0 + 7, bay = (m1 - 0.6 - b0) / bays;
  P.panel(bays * bay, 2.6, b0 + (bays * bay) / 2, 0.15, front + 0.05, STREET, DARK); // (the doors, under the canopy)
  for (let i = 0; i < bays; i++) P.panel(bay - 0.7, EAVES - 4.1, b0 + (i + 0.5) * bay, 3.5, front + 0.05, STREET, GLASS);
  for (let i = 0; i <= bays; i++) P.box(0.7, EAVES - 0.3, 0.5, b0 + i * bay, 0, front + 0.1, PIER);
  P.box(bays * bay + 1.4, 0.3, 3, b0 + (bays * bay) / 2, 3.0, front + 1.5, CONCRETE);
  // its ends above the wings, and its back above the hall (ASSUMED)
  for (const d of [-3.5, 0, 3.5]) { P.panel(1.2, 1.6, m0 - 0.06, 5.9, front - BLOCK_DEPTH / 2 + d, Math.PI, DARK); P.panel(1.2, 1.6, m1 + 0.06, 5.9, front - BLOCK_DEPTH / 2 + d, 0, DARK); }
  // the turret: square, a clock on the street and the platform side, a low pointed cap
  const tx = (m0 + m1) / 2, tz = front - BLOCK_DEPTH / 2, tw = 2.2;
  P.box(tw, 2.4, tw, tx, EAVES + RISE - 0.4, tz, WALL);
  for (const [s, na] of [[1, STREET], [-1, TRACKS]]) P.put(new THREE.CircleGeometry(0.7, 14).rotateY(na + Math.PI / 2), DIAL, new THREE.Matrix4().makeTranslation(tx, EAVES + RISE + 1.0, tz + s * (tw / 2 + 0.05)));
  P.pyramid((tw / 2 + 0.25) * Math.SQRT2, TURRET - (EAVES + RISE + 2), tx, EAVES + RISE + 2, tz, TILE, 4, Math.PI / 4);

  // ---- 2. the hall behind it: low, flat-roofed, with the old building's skylight as a glazed pyramid
  block('hall', [m0, m1, -front, zb], HALL);
  const sz = (-front + zb) / 2;
  block('skylight', [tx - SKYLIGHT[0] / 2, tx + SKYLIGHT[0] / 2, sz - SKYLIGHT[1] / 2, sz + SKYLIGHT[1] / 2], HALL + 0.4, { roof: 'hipped', rise: 2.6, base: HALL, colour: GLASS, roofColour: GLASS, kinds: { walls: KIND.PLAIN, roof: KIND.PLAIN } });

  // ---- 3. the north wing: a range on the street and one on the platform, the yard between them, a low building at its end
  block('north-street', [m1, NORTH_END, front - RANGE, front], WING_EAVES, { roof: 'hipped', rise: WING_RISE });
  block('north-platform', [m1, NORTH_END, -front, -front + RANGE], WING_EAVES, { roof: 'hipped', rise: WING_RISE });
  block('north-end', [NORTH_END - 4, NORTH_END, -front + RANGE, front - RANGE], LOW - 0.5, { colour: '#efeae0' });

  // ---- 4. the south wing: a low range on the street under a hipped roof, a flat-roofed block behind it
  block('south-street', [SOUTH_END, m0, front - 1.5 - RANGE, front - 1.5], WING_EAVES, { roof: 'hipped', rise: WING_RISE });
  block('south', [SOUTH_END, m0, -front, front - 1.5 - RANGE], LOW);

  // ---- 5. the wings' and the hall's windows: plain rows on the street, on the platform and at the ends (ASSUMED)
  const row = (x0, x1, z, na, y = 1.3, h = 1.9, step = 3.2) => { const n = Math.max(1, Math.floor((x1 - x0) / step)); for (let i = 0; i < n; i++) P.panel(1.3, h, x0 + ((i + 0.5) * (x1 - x0)) / n, y, z, na, DARK); };
  row(m1, NORTH_END, front + 0.06, STREET); row(SOUTH_END, m0, front - 1.5 + 0.06, STREET);
  row(m1, NORTH_END, -front - 0.06, TRACKS); row(SOUTH_END, m0, -front - 0.06, TRACKS, 1.2, 1.7);
  row(m0, m1, -front - 0.06, TRACKS, 0.3, 3.4, 4);
  for (const d of [-10, -3.5, 3.5, 10]) { P.panel(1.3, 1.9, NORTH_END + 0.06, 1.3, d, 0, DARK); P.panel(1.3, 1.7, SOUTH_END - 0.06, 1.2, d - 0.75, Math.PI, DARK); }

  return { anchor: world(tx, tz), top: TURRET };
}
