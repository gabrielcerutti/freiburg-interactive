// The first station building of Freiburg: the «Bahnhof bei Freiburg» of the Baden main line, designed by Friedrich
// Eisenlohr, opened on 30 July 1845 and destroyed in the air raid of 27 November 1944. It is gone: nothing of it is
// in OpenStreetMap, so the place stands on a footprint read off one of the city's old plans (PLACE.footprint) and is
// shown from 1845 to the last stop before `until`.
//
// Where it stood — TRACED, not remembered:
//   - The outline is read off the city's plan of 1920 (1:6,000, the viewer's public/plan/1920.webp, georeferenced by
//     the city's survey office; public/plan/plans.json gives the sheet's rectangle in world metres). That plan draws
//     the public buildings one by one, in brown: the station is a long rectangle on the east side of the tracks, with
//     two small light courts. The plan was cut out around the station, enlarged six times with a grid of world
//     metres over it, and the middle of the black line at each of the four corners was read by eye (TRACED, below).
//     It comes out 94 m long and 29.5 m deep, its long axis turned 28.5° east of north.
//   - How exact: the plan's line is about 1.5 m thick at that scale and the reading is by eye, so each corner is good
//     to 2–3 m, and the whole sheet may sit a few metres off today's map. Three things agree with it: the plan of
//     1903 (1:6,500) and that of 1944 (1:10,000) draw the same rectangle in the same place, to 3–4 m; its west side
//     lies on the edge of today's platform 1 (the west wall of OSM way 308486106, the track-side range of today's
//     station, is 2 to 5 m from it and 1.3° off its direction); and the German Wikipedia's coordinates of the
//     station (47.997697 N, 7.84117 E, a point on the platforms) are 40 m from its west side.
//   - The plan of 1875 does NOT agree: it draws the station (the hall with its rows of piers, the court, the front
//     building) about 60 m to the south-east of where the three later plans and the tracks put it. That sheet is
//     badly registered at this edge of the area (the goods shed west of the tracks is off by the same amount), so at
//     the stop of 1875 the model does not stand on the plan's drawing of it. The model is right; the sheet is off.
//   - Against a sourced length: the German Wikipedia (after Berger, «Historische Bahnhofsbauten III») gives the
//     building of 1845 as 70 m long, 40 m of it two-storeyed; Eisenlohr's own ground plan (Wikimedia Commons,
//     «Eisenlohr Hochbauten der badischen Bahn Freiburg 00004», with a scale bar of 60 m / 200 Baden feet) measures
//     about 71 m across the front and 40 m across the two-storey block by that bar. The plan of 1920 draws 94 m: 24 m more.
//     The German Wikipedia says the station was enlarged in the 1870s with waiting rooms, service rooms and a light
//     court («Lichthof»); the two courts of the 1920 plan sit in the outer thirds, where Eisenlohr's plan has open
//     ground. So the 94 m are taken as the building after that enlargement, and the 40 m of the two-storey block are
//     Eisenlohr's — the one figure of the model that is a source's and not the plan's. No source found gives the
//     length after the enlargement: the plan is the only witness.
//
// How it is made (the state of the photographs of about 1890–1910 and of the plan of 1920; all by hand):
//   - The two-storey block in the middle, 40 m long (source), under a low hipped roof («flache Walmdächer», Pretsch,
//     quoted by the German Wikipedia), with seven round arches into the entrance hall between two side risalits
//     («einen von sieben Bögen, die sich zwischen zwei Seitenrisaliten befanden»), pilaster strips between the
//     arches, seven round-headed windows above them, and on each risalit two round-headed windows below and a group
//     of three with a balcony above — as in the photos «Freiburg Main Station 1890» and «Freiburger Hbf 1910»
//     (Wikimedia Commons, public domain).
//   - The clock turret on the ridge, as both photos show it: a square shaft with a pair of round-headed openings,
//     a clock in a small gable on each face they show, and a short pointed roof. Eisenlohr's drawings give it a
//     slender spire («grazile Turmspitze»), which had been taken down by the time of the photos of about 1910
//     (German Wikipedia, after Berger). No source found says when: the model has no spire at any stop.
//   - A one-storey wing on each side under a low hipped roof, set a little back from the middle block (the photo
//     «Freiburg Main Station 1890» shows the north one), and behind the wings the ranges around the two light courts
//     of the 1920 plan.
//   - Behind the middle block, the roofed court with its skylight. Eisenlohr's plan has an open court with a fountain
//     there («Offener Hof mit Brunnen»); the German Wikipedia says the steel frame of the old building's skylight
//     («Oberlicht»), 15.60 × 12.40 m, survived the raid and was used again in the building of 1949. That it stood
//     over the former court is this file's reading, not a source's.
//   - Colours: Eisenlohr left the stone bare and set the projecting parts off in reddish sandstone against a pale
//     wall (German Wikipedia: «Durch rötlichen Sandstein hob er die hervortretenden Fassadenelemente auf dem sonst
//     hellen Wandhintergrund hervor»): pale walls, red pilasters, bands and arches. The coloured lithograph of about
//     1845 (Wikimedia Commons, Augustinermuseum) shows a dark roof.
//
// Not drawn: the train shed of 1845 (110 m long, 16.30 m wide, 12.30 m to the ridge — the largest in Baden — pulled
// down in 1885), the two platform halls on Corinthian columns that replaced it in 1885/86, the goods sheds and the
// carriage sheds. So at the stop of 1875 the shed is missing, and the wings may be longer than they were that year.
//
// ASSUMED (no source gives them; read off the two photos by eye against the 40 m of the middle block): every height
// (the eaves of the middle block 11.5 m, its ridge 14.7 m, the turret 24.5 m to its tip, the wings 6 m to the
// eaves); the depth of the middle block (16 m; Eisenlohr's plan has 15 to 18 m) and of the wings' front range (9 m);
// the width of the risalits (7 m each) and of the arches; that the wings are set back 1.5 m; the wings' windows,
// their number and size, and every opening on the sides and towards the tracks; the roofs behind the front (drawn
// flat) and the place and size of the two light courts within the wings (the 1920 plan draws them about 5 × 13 m);
// the place of the skylight; the chimneys; the ground (the viewer's terrain falls 1.5 m towards the south end: the building is
// level, on a plain base); the roof's material (drawn as slate, which the sources give only for the
// train shed); that the building of the 1870s enlargement looked like Eisenlohr's wings.

import * as THREE from 'three';
import { KIND } from '../kit.js';

// The four corners of the building on the city's plan of 1920, in world metres (x east, z south), read by eye off a
// sixfold enlargement: south-west, north-west, north-east, south-east. Good to 2–3 m each (see the top of the file).
const TRACED = [[-857.2, -206.9], [-812.0, -289.9], [-786.5, -275.3], [-831.2, -192.7]];
// The rectangle that fits them: its middle, the direction of its long side (u, towards the north-north-east) and of
// its short side (v, towards the street and the town), its length and its depth.
const [SW, NW, NE, SE] = TRACED;
const MID = [(SW[0] + NW[0] + NE[0] + SE[0]) / 4, (SW[1] + NW[1] + NE[1] + SE[1]) / 4];
const along = [NW[0] - SW[0] + NE[0] - SE[0], NW[1] - SW[1] + NE[1] - SE[1]], alongLength = Math.hypot(...along);
const U = [along[0] / alongLength, along[1] / alongLength], V = [-U[1], U[0]];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const LENGTH = (dist(SW, NW) + dist(SE, NE)) / 2, DEPTH = (dist(SW, SE) + dist(NW, NE)) / 2; // 94.2 m, 29.5 m
/** from the building's own metres (x along the front, northwards; z towards the street) to world metres */
export const world = (x, z) => [MID[0] + x * U[0] + z * V[0], MID[1] + x * U[1] + z * V[1]];
export const FRAME = { x: MID[0], z: MID[1], angle: Math.atan2(-U[1], U[0]) };
const rect = (x0, x1, z0, z1) => [world(x0, z0), world(x1, z0), world(x1, z1), world(x0, z1)];

const MIDDLE = 40;     // metres: the two-storey block (German Wikipedia: «70 Metern, von denen 40 zweistöckig ausgeführt waren»)
const SKYLIGHT = [15.6, 12.4]; // metres (German Wikipedia: «des Bauteils mit 15,60 × 12,40 Metern»)
// ---- everything from here to the end of the list is ASSUMED (see the top of the file)
const BLOCK_DEPTH = 16, RISALIT = 7, SETBACK = 1.5, WING_DEPTH = 9;
const EAVES = 11.5, RISE = 3.2, WING_EAVES = 6, WING_RISE = 2.2, REAR = 5.6, HALL = 7, TURRET = 21, TIP = 24.5;
const COURT = { x: 27.2, z: 0.5, w: 13, d: 5 }; // (the light court of each wing: its middle, its length and its depth)
const WALL = '#dccdb0', RED = 'SANDSTONE', SLATE = '#5a5e66', ZINC = '#8b8d8c', GLASS = '#9fb1b4', DARK = 'OPENING', DIAL = '#efe9d8', BRICK = '#9c8474';

const half = LENGTH / 2, front = DEPTH / 2, m = MIDDLE / 2;

export const PLACE = {
  key: 'alter-hauptbahnhof',
  name: 'Hauptbahnhof',
  localName: 'Main station: the first building, 1845–1944',
  kind: 'building',
  // de.wikipedia «Freiburg (Breisgau) Hauptbahnhof»: foundation stone 1843, opened 30 July 1845 in a building not yet
  // finished; enlarged in the 1870s; the train shed replaced in 1885/86
  built: { from: 1843, to: 1845, enlarged: '1870s' },
  since: 1845, // de.wikipedia: «Am 30. Juli 1845 wurde der Bahnhof … feierlich eröffnet»; infobox «Eröffnung 1845 historisches Gebäude»
  // Gone. No source found gives the year the ruin was cleared away: the German Wikipedia says the clearing began in
  // the autumn of 1947 and went slowly until the currency reform of 1948, and that the building which replaced it —
  // on the old foundations and cellar — opened on 9 November 1949. `until` is that year, the first for which a
  // source says something else stood here; the ruin may have been gone a year or two earlier. No stop of the
  // timeline lies between November 1944 and 1955, so the choice changes nothing that is shown.
  until: 1949,
  // The raid: «zerstörte … fast das komplette Hauptgebäude»; only the clock turret stood, until 8 February 1945.
  // `rebuilt` is null: it never stood again (the ruin is drawn at the stop of November 1944 only).
  war: { state: 'ruin', rebuilt: null, source: 'German Wikipedia, «Freiburg (Breisgau) Hauptbahnhof» (after Scharf/Wollny, «Die Höllentalbahn», 1987, pp. 128–129): the raid of 27 November 1944 «zerstörte die gesamten Oberleitungsanlagen, einen Großteil der Gleisanlagen sowie fast das komplette Hauptgebäude. Der Uhrturm, der den Abend als einziges Bauteil überstand, stürzte nach einem zweiten Treffer am 8. Februar 1945 ein»; the city’s damage map of the raid marks the whole building black (heavy damage to total loss)' },
  coordinates: [47.997697, 7.84117], // de.wikipedia «Freiburg (Breisgau) Hauptbahnhof», infobox (the station: a point on the platforms, 40 m from the traced west side)
  osm: null, // (gone: not in OpenStreetMap)
  // The shell drawn at the stop of November 1944 (src/main.js): the traced rectangle in its four pieces, with the
  // heights of the model (assumed).
  footprint: [
    { id: 'alter-hauptbahnhof-middle', rings: [rect(-m, m, front - BLOCK_DEPTH, front)], type: 'part', height: EAVES, roofShape: 'flat', colour: WALL },
    { id: 'alter-hauptbahnhof-hall', rings: [rect(-m, m, -front, front - BLOCK_DEPTH)], type: 'part', height: HALL, roofShape: 'flat', colour: WALL },
    { id: 'alter-hauptbahnhof-south', rings: [rect(-half, -m, -front, front - SETBACK)], type: 'part', height: WING_EAVES, roofShape: 'flat', colour: WALL },
    { id: 'alter-hauptbahnhof-north', rings: [rect(m, half, -front, front - SETBACK)], type: 'part', height: WING_EAVES, roofShape: 'flat', colour: WALL },
  ],
  sources: [
    'German Wikipedia, «Freiburg (Breisgau) Hauptbahnhof»: coordinates (47.997697 N, 7.84117 E); the law of 1838 for a railway from Mannheim to the Swiss border at Basel named Freiburg as a station; the foundation stone of the station laid in 1843; first trial train on 22 July 1845; «Am 30. Juli 1845 wurde der Bahnhof in Anwesenheit des Großherzogs Leopold … feierlich eröffnet», the guests received «im allerdings noch unfertigen Stationsgebäude»; the terminus became a through station with a second track when the line reached Schliengen in 1847; in another place the article speaks of «der Fertigstellung des Empfangsgebäudes im Jahre 1861»; in the 1870s the station was enlarged «um Wartesäle, Wirtschaftsräume und einen Lichthof»; in 1885 the old train shed was pulled down and two new ones built; it has been called «Hauptbahnhof» since 1887',
    'German Wikipedia, the same article, «Erstes Gebäude (1845–1945)»: «Das nach Plänen des Architekten Friedrich Eisenlohr gebaute zweigeschossige Empfangsgebäude», in the Rundbogenstil; «Durch rötlichen Sandstein hob er die hervortretenden Fassadenelemente auf dem sonst hellen Wandhintergrund hervor. Das Empfangsgebäude besaß eine Länge von 70 Metern, von denen 40 zweistöckig ausgeführt waren. In seine Vorhalle gelangte man über einen von sieben Bögen, die sich zwischen zwei Seitenrisaliten befanden»; a clock over the ridge turret, crowned in early drawings by a «grazilen Turmspitze», removed by the time of photographs of about 1910 (after Manfred Berger, «Historische Bahnhofsbauten III», 1988); offices, telegraph and post on the ground floor, flats for railway staff above; an open court with a fountain between the building and the train shed, the three waiting rooms beside it; the shed 110 m long, 16.30 m wide, 12.30 m to the ridge, «die größte Badens», of three aisles, with a slate roof on a timber frame; the two carriage sheds of 1845 by track 8 are all that is left',
    'German Wikipedia, the same article, «Zweiter Weltkrieg und seine Folgen» and «Zweites Gebäude»: what the raid of 27 November 1944 destroyed, and the clock turret’s fall on 8 February 1945 (after Scharf/Wollny, 1987); «Die Aufräumarbeiten am Hauptgebäude begannen indes erst im Herbst 1947» (after Kuntzemüller, Schweizerische Bauzeitung, 3 June 1950); the building that replaced it opened on 9 November 1949, on the old foundations and cellar, with the steel frame of the old skylight, 15.60 × 12.40 m',
    'City of Freiburg, plan of 1920 (1:6,000; the viewer’s plan of that year): the outline — a rectangle 94 m by 29.5 m with two light courts, east of the tracks — read off it by eye; the plans of 1903 and 1944 draw the same rectangle in the same place; the damage map of November 1944 has it black',
    'Wikimedia Commons, «Eisenlohr Hochbauten der badischen Bahn Freiburg 00004» (Friedrich Eisenlohr, «Bahnhof bei Freiburg. Grundriss des Hauptdienstgebäudes», from his «Sammlung von Hochbauten der Großherzoglich Badischen Eisenbahn»; public domain): the ground plan of 1845 with its scale bar — the front about 71 m and the two-storey block about 40 m by that bar, the open court with a fountain, the entrance hall behind seven openings, the train shed across the back',
    'Wikimedia Commons, «Freiburg Main Station 1890» (unknown photographer, dated 1890 there; public domain) and «Freiburger Hbf 1910» (unknown photographer, from Berger’s book; public domain): the front of the middle block — seven arches, pilaster strips, seven windows above, the risalits with their balconies, the low hipped roof with its chimneys, the clock turret without a spire, a lower wing on the north side — and every proportion of the model',
    'Wikimedia Commons, «Freiburger Hbf Empfangsgebäude und Bahnhalle von Stadtseite 1845» (Eisenlohr’s elevation, from Berger’s book; public domain) and «Freiburger Bahnhof Kolorierte Lithographie nach 1845» (Augustinermuseum Freiburg; public domain): the building as first planned — the two-storey block between one-storey wings, the turret with its spire, the train shed behind',
  ],
  assumptions: [
    'where it stood is read off the plan of 1920 by eye: each corner is good to 2–3 metres, and the plan itself may sit a few metres off today’s map',
    'that the 94 metres of the 1920 plan are Eisenlohr’s 70-metre building lengthened in the 1870s: no source gives the length after the enlargement',
    'every height: the eaves of the middle block (11.5 m), its ridge, the clock turret (24.5 m to its tip) and the wings (6 m), read off two photos by eye against the 40 metres of the middle block',
    'the depth of the middle block (16 m) and of the wings’ front range, the width of the risalits and of the arches, and that the wings stand 1.5 m back',
    'the windows of the wings, and every opening on the ends and on the side of the tracks: no photo found shows them',
    'the ranges behind the front, drawn with flat roofs, and the place and size of the two light courts (the 1920 plan draws them about 5 by 13 metres)',
    'that the skylight of 15.60 × 12.40 m stood over Eisenlohr’s former court, behind the middle block',
    'the roof’s material (drawn as slate), the chimneys, and that the wings of the 1870s looked like Eisenlohr’s',
    'the ground: the viewer’s terrain falls 1.5 metres towards the south end, so the building stands level on a plain base',
    'it is drawn as in the photographs of about 1890–1910 at every stop from 1875 to 1944: without the spire the turret first had, without the train shed that stood behind it until 1885, and without the platform halls that followed',
  ],
  card: {
    title: 'Hauptbahnhof',
    years: '1845 · enlarged in the 1870s · destroyed 1944',
    text: [
      'This was Freiburg’s first station building. The law of 1838 for a railway from Mannheim to the Swiss border named Freiburg as a station; the foundation stone was laid in 1843, and on 30 July 1845 the station was opened in the presence of Grand Duke Leopold, in a building that was not finished yet. It stood outside the town, on the flat ground of the former fortress belt.',
      'Friedrich Eisenlohr, the architect of the Baden railway, designed it in the Rundbogenstil, the round-arch style. The building was 70 metres long, 40 of them two-storeyed. Seven arches between two projecting ends led into the entrance hall. He left the stone bare and set the projecting parts off in reddish sandstone. A clock turret stood on the ridge; its slender spire had been taken down by about 1910.',
      'Behind it lay an open court with a fountain, the waiting rooms, and a train shed 110 metres long, the largest in Baden. In the 1870s waiting rooms, service rooms and a light court were added; in 1885 the shed was pulled down for two new platform halls. Since 1887 it was called the Hauptbahnhof.',
      'The air raid of 27 November 1944 destroyed almost the whole building. Only the clock turret stood; a second hit brought it down on 8 February 1945. The clearing of the ruin began in the autumn of 1947. A new building on the old foundations opened on 9 November 1949; it is shown at the stops of 1955 and 1981.',
      'The German Wikipedia gives 1845 as the year the building was put up, and in another place speaks of its completion in 1861. It does not explain the difference.',
      'Nothing of it is left, and OpenStreetMap does not have it. Where it stood is read off the city’s plan of 1920, to a few metres; that plan draws it 94 metres long, which is taken as the building after the enlargement. The 40 metres of the middle block, the seven arches and the colours come from sources; the shape comes from two photographs. Every height is a guess, and so is everything behind the front. It is drawn as in the photographs of about 1890 to 1910 at every stop: without the spire, without the train shed. The plan of 1875 lies about 60 metres off at this edge, so at that stop the model does not sit on the plan’s drawing of the station.',
    ],
  },
};

export function build(kit) {
  const F = kit.frame({ ...FRAME, kind: KIND.STONE }), P = kit.frame({ ...FRAME, kind: KIND.PLAIN });
  // one block of the building: a rectangle of the frame with walls to `eaves` and a roof
  const block = (id, [x0, x1, z0, z1], eaves, { roof = 'flat', rise = 0, colour = WALL, roofColour = roof === 'flat' ? ZINC : SLATE, base = 0, holes = [], kinds = { walls: KIND.STONE } } = {}) =>
    kit.osm([{ id: `alter-hbf-${id}`, rings: [rect(x0, x1, z0, z1), ...holes.map((h) => rect(...h).reverse())], type: 'part', minHeight: base || null, height: eaves + rise, roofShape: roof, roofHeight: rise, colour, roofColour }], kinds);
  // a round-headed opening w wide and h high (to the top of its arch), its foot centred on x, y, z, facing `na` (0 = +x)
  const arched = (w, h, x, y, z, na, colour = DARK) => {
    const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, 0, Math.PI, false); s.lineTo(-w / 2, 0);
    P.put(new THREE.ShapeGeometry(s, 5).rotateY(na + Math.PI / 2), colour, new THREE.Matrix4().makeTranslation(x, y, z));
  };
  const STREET = -Math.PI / 2, TRACKS = Math.PI / 2, NORTH = 0, SOUTH = Math.PI; // (which way a face looks, for `arched`)

  // ---- 0. a base under the whole building: the viewer's terrain falls 1.5 m towards the south end, and the place
  //         stands on the ground under its middle (src/main.js), so without it the south end would hang in the air
  block('base', [-half, half, -front, front - SETBACK], 0.05, { base: -2, roofColour: WALL, kinds: { walls: KIND.PLAIN, roof: KIND.PLAIN } });

  // ---- 1. the two-storey middle block (40 m: source), its low hipped roof
  block('middle', [-m, m, front - BLOCK_DEPTH, front], EAVES, { roof: 'hipped', rise: RISE });
  // the front: the risalits a hand's breadth proud, red bands under the eaves and between the storeys
  for (const s of [-1, 1]) F.box(RISALIT, EAVES, 0.5, s * (m - RISALIT / 2), 0, front + 0.1, WALL);
  F.box(MIDDLE + 0.5, 0.7, BLOCK_DEPTH + 0.5, 0, EAVES - 0.7, front - BLOCK_DEPTH / 2, RED);
  F.box(MIDDLE - 2 * RISALIT, 0.35, 0.3, 0, 5.75, front + 0.05, RED);
  // the seven arches of the entrance hall and the seven windows above them, pilaster strips between
  const bay = (MIDDLE - 2 * RISALIT) / 7;
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * bay;
    arched(bay - 1.0, 4.9, x, 0.05, front + 0.07, STREET);
    arched(bay - 0.75, 5.15, x, 0, front + 0.05, STREET, RED); // (its red surround, behind the dark)
    arched(1.5, 2.9, x, 7.1, front + 0.07, STREET);
  }
  for (let i = 0; i <= 7; i++) F.box(0.45, EAVES - 0.7, 0.25, (i - 3.5) * bay, 0, front + 0.1, RED);
  // the risalits: two round-headed windows below, a balcony, a group of three above; red corners
  for (const s of [-1, 1]) {
    const x = s * (m - RISALIT / 2), z = front + 0.37;
    for (const d of [-1.25, 1.25]) arched(1.3, 3.1, x + d, 1.5, z, STREET);
    for (const d of [-1.3, 0, 1.3]) arched(0.95, d ? 2.4 : 2.8, x + d, 7.2, z, STREET);
    F.box(4.6, 0.9, 0.9, x, 6.2, front + 0.75, RED);
    for (const e of [-1, 1]) F.box(0.5, EAVES - 0.7, 0.3, x + e * (RISALIT / 2 - 0.25), 0, front + 0.3, RED);
  }
  // the ends of the block above the wings' roofs, and its back above the hall: windows (ASSUMED)
  for (const s of [-1, 1]) for (const d of [-4, 0, 4]) arched(1.4, 2.6, s * (m + 0.06), 7.3, front - BLOCK_DEPTH / 2 + d, s > 0 ? NORTH : SOUTH);
  for (let i = -4; i <= 4; i++) arched(1.4, 2.4, i * 4.2, 7.9, front - BLOCK_DEPTH - 0.06, TRACKS);

  // ---- 2. the clock turret on the ridge: a square shaft, paired openings, a clock in a gable on each face, a pointed roof
  const tz = front - BLOCK_DEPTH / 2, tw = 3.4;
  F.box(tw, TURRET - EAVES - 1.5, tw, 0, EAVES + 1.5, tz, WALL);
  F.box(tw + 0.4, 0.4, tw + 0.4, 0, 17.6, tz, RED);
  F.box(tw + 0.5, 0.45, tw + 0.5, 0, TURRET - 0.45, tz, RED);
  for (const [dx, dz, na] of [[0, 1, STREET], [0, -1, TRACKS], [1, 0, NORTH], [-1, 0, SOUTH]]) {
    const o = tw / 2 + 0.06;
    for (const d of [-0.55, 0.55]) arched(0.7, 2.3, dx * o + (dz ? d : 0), 18.2, tz + dz * o + (dx ? d : 0), na);
    // the gable with its clock
    const g = new THREE.Shape(); g.moveTo(-tw / 2, 0); g.lineTo(tw / 2, 0); g.lineTo(0, 2.3); g.lineTo(-tw / 2, 0);
    F.put(new THREE.ShapeGeometry(g).rotateY(na + Math.PI / 2), WALL, new THREE.Matrix4().makeTranslation(dx * (tw / 2), TURRET, tz + dz * (tw / 2)));
    P.put(new THREE.CircleGeometry(0.62, 14).rotateY(na + Math.PI / 2), DIAL, new THREE.Matrix4().makeTranslation(dx * o, TURRET + 0.85, tz + dz * o));
  }
  P.pyramid((tw / 2) * Math.SQRT2, TIP - TURRET, 0, TURRET, tz, SLATE, 4, Math.PI / 4);

  // ---- 3. the wings: a front range under a low hipped roof, set back; behind it the ranges around a light court
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? m : -half, x1 = s > 0 ? half : -m, zf = front - SETBACK;
    block(`wing-${s}`, [x0, x1, zf - WING_DEPTH, zf], WING_EAVES, { roof: 'hipped', rise: WING_RISE });
    block(`rear-${s}`, [x0, x1, -front, zf - WING_DEPTH], REAR, { holes: [[s * COURT.x - COURT.w / 2, s * COURT.x + COURT.w / 2, COURT.z - COURT.d / 2, COURT.z + COURT.d / 2]] });
    F.box(x1 - x0 + 0.3, 0.45, 0.3, (x0 + x1) / 2, WING_EAVES - 0.45, zf + 0.05, RED);
    // round-headed windows in pairs along the street, a row towards the tracks, three at the end (ASSUMED)
    const n = 6, step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) for (const d of [-0.85, 0.85]) arched(1.2, 3.0, x0 + (i + 0.5) * step + d, 1.4, zf + 0.06, STREET);
    for (let i = 0; i < n; i++) arched(1.6, 3.2, x0 + (i + 0.5) * step, 0.6, -front - 0.06, TRACKS);
    for (const d of [-9, -3, 3, 9]) arched(1.3, 3.0, s * (half + 0.06), 1.4, d - SETBACK / 2, s > 0 ? NORTH : SOUTH);
  }

  // ---- 4. behind the middle block: the roofed court, with the skylight (its size: source; its place: ASSUMED)
  block('hall', [-m, m, -front, front - BLOCK_DEPTH], HALL);
  for (let i = -4; i <= 4; i++) arched(1.8, 3.6, i * 4.2, 0.4, -front - 0.06, TRACKS);
  const sz = (-front + front - BLOCK_DEPTH) / 2;
  block('skylight', [-SKYLIGHT[0] / 2, SKYLIGHT[0] / 2, sz - SKYLIGHT[1] / 2, sz + SKYLIGHT[1] / 2], HALL + 0.5, { roof: 'hipped', rise: 1.8, base: HALL, colour: GLASS, roofColour: GLASS, kinds: { walls: KIND.PLAIN, roof: KIND.PLAIN } });

  // ---- 5. chimneys on the roof of the middle block (the photos show about eight: ASSUMED where)
  for (const x of [-15.5, -9.5, -4, 4, 9.5, 15.5]) F.box(0.8, 2.6, 0.8, x, EAVES + 1.6, tz + (Math.abs(x) > 12 ? 0 : 2.2), BRICK);

  return { anchor: world(0, front - BLOCK_DEPTH / 2), top: TIP };
}
