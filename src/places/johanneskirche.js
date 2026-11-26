// Johanneskirche (St. Johann), the Catholic parish church of the Wiehre, south of the Dreisam.
//
// How it is made:
//   - The whole body of the church is OpenStreetMap's 3D mapping of it: the outline (way 643437367, «Johanneskirche»)
//     and the 15 `building:part`s inside it, with their own heights, roof shapes and colours, drawn by
//     src/buildings.js. The entrance front with the two towers looks east (the altar is in the west: «nicht geostet»,
//     says the German Wikipedia). The parts, from east to west:
//       · the half-octagonal porch between the towers (way 548771947, 23 m, pyramidal roof);
//       · the two towers: a shaft up to 19 m (ways 548416464 north, 548416465 south) and, on it, the upper storeys
//         with the steep spire (ways 548779415 north, 548772617 south: 19–59 m, the top 23 m of it the spire);
//       · the nave (way 548881370, 19 m, gabled) and the long roof over nave and choir (way 547536150, 26 m);
//       · the transept (way 548416467, 26 m, gabled), the crossing (way 548717105, 33 m, pyramidal) with the small
//         turret on it (way 117518134, 30–46 m), and lower parts around it (ways 692428492, 692428493);
//       · the choir end (way 548604781, 26 m) with the two rooms in its corners (ways 692428494 and 692428495, 15 m:
//         «Sakristei bzw. eine Paramentenkammer», says the Heidelberg page).
//     That is data, not a guess — but it is a mapper's 3D model, not a survey. Its 59 m for the towers is a little
//     under what the written sources say («etwa 60 m», «knapp über 60 Meter», «61 Meter»), and its outline is 75.0 m
//     long along the axis of the church, where the sources say 74.3 m (0.7 m more, 1 %: a hair over what
//     `npm run check` allows for a `length`, so that check is not listed in PLACE.checks).
//   - Changed by hand: the towers above 19 m. OSM continues them as an octagon; the photographs show them square up
//     to the foot of the spire, so the shaft's own square outline is carried up to 36 m (where OSM's spire starts:
//     59 − 23 m) and OSM's octagon is kept for the spire alone.
//   - Added by hand, placed by eye on the photographs listed in PLACE.sources: on the towers the cornices, the four
//     gables and corner pinnacles at the foot of each spire, the openings and the clocks; the doorways, round
//     windows and arcades of the porch; the round windows and the tall windows of the transept; the windows of the
//     nave and the choir.
//
// ASSUMED (not measured, not from a source): the size, number and height of everything drawn by hand; the heights of
// the storeys of the towers (read off the photograph of 2009 against OSM's 19 m and 59 m); that the north tower has a
// clock on its north face (the photographs show three dials — south tower, east and south; north tower, east — and
// the German Wikipedia counts four); that the sides no photograph here shows (the north side, the choir) are like the
// ones they do. Not drawn: what OSM's model leaves out (the lower aisles with their lean-to roofs and the clerestory
// behind them, the buttresses, the side porches) and the crosses on the spires. The colours: OSM has `rosybrown`
// walls and `darkgrey` roofs; they are drawn in the red of the sandstone and the blue-grey of the slate that the
// sources name, the tones read off the photographs.

export const PLACE = {
  key: 'johanneskirche',
  name: 'Johanneskirche',
  localName: 'Pfarrkirche St. Johann',
  kind: 'building', // (budget: 25,000 vertices)
  built: { from: 1894, to: 1899 }, // de.wikipedia: the works «begannen 1894 und endeten mit der Kirchenweihe 1899» (the parish's page: «1895/99 erbaut»)
  since: 1899, // (consecrated 1899: not there at the stop of 1875, standing from 1903 on)
  // 27 November 1944: no written account of the church in the raid was found. The city's damage map is the only
  // source: it marks the church neither black nor blue (it keeps the brown-red of the base plan's public buildings),
  // while the block just north of it is blue. An unmarked building on a map is not a statement that it was spared: no `war`
  // is given, and the church is not listed in the note of November 1944. The card says what the map shows.
  coordinates: [47.988899, 7.846968], // de.wikipedia «St. Johann (Freiburg im Breisgau)», the article's coordinates (independent of the OSM outline)
  osm: 'w643437367',
  checks: {
    height: 60, // de.wikipedia: «zwei etwa 60 m hohen Türmen» (the same page later: «61 Meter»; UB Heidelberg: «knapp über 60 Meter»); OSM height=59
    // (no `length`: the sources' 74.3 m against 75.0 m for OSM's outline — see the top of the file)
  },
  sources: [
    'German Wikipedia, «St. Johann (Freiburg im Breisgau)» (version of 29 October 2026): coordinates (47.988899 N, 7.846968 E); «Sie wurde 1899 eingeweiht»; the new church was decided on in 1889, «Der Auftrag ging an den Baudirektor Joseph Durm»; the works «auf einem Gelände nahe der Dreisam, auf dem das erste Gaswerk der Stadt gestanden hatte, begannen 1894 und endeten mit der Kirchenweihe 1899»; 900 seats, a nave 11 m wide and two aisles of 3.5 m with galleries; «Die Länge des Bauwerkes beträgt 74,3 m»; «in rotem Sandstein ausgeführt und trägt typische Merkmale der Neuromanik»; «nicht geostet – der Altar steht im Westen. Die Fassade mit einem Eingangsvorbau in Form eines halben Achtecks, flankiert von zwei etwa 60 m hohen Türmen mit sehr steilem Turmhelm zeigt in Richtung Osten in die Talstraße»; Durm named Bamberg cathedral as his model; the clockwork of 1900 «die Zeiger von insgesamt vier Zifferblättern an den beiden Kirchtürmen steuert»; eight bells of 1954; under «Sturmschäden», «an den 61 Meter hohen Türmen»',
    'Universitätsbibliothek Heidelberg, «Katholische Kirche St. Johann in Freiburg i.Br.» (a page of its exhibition on the history of that library): «Konkrete Planungen wurden ab 1889 aufgenommen, die Bauzeit dauerte von 1894 bis 1899»; «dreischiffige Basilika mit Emporen in den Seitenschiffen und einem breiten Querschiff»; «Im Osten findet sich ein im halben Achteck gestalteter Vorbau mit zwei knapp über 60 Meter hohen Seitentürmen»; «Als Baumaterial wurde roter Mainsandstein gewählt, für die Bedachung blaugrauer, rheinischer Schiefer»; «Raum für 900 Sitzplätze sowie 1500-2000 Stehplätze. Die Gesamtlänge des Baus mißt 74,30 Meter»',
    'Seelsorgeeinheit Freiburg Wiehre-Günterstal, «Kirche St. Johann» (the parish’s page, as archived on 11 July 2016): «1895/99 erbaut von Josef Durm als Teil eines städtebaulichen Ensembles (Lessingschule, Johanniskirche, Gewerbeschule mit Direktorwohnung, Pfarrhaus St. Johann)»; the patron, John the Baptist, «weil die Stadt am 24.6.1889 den Bauplatz unentgeltlich zur Verfügung stellte»',
    'German Wikipedia, «Wiehre»: «Die katholische Johanneskirche, vereinzelt wegen ihrer städtebaulichen Wirkung „Wiehredom“ genannt, wurde auf dem Gelände des bis dahin dort stehenden Gaswerks … erbaut»',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the church is not marked — it keeps the brown-red tint of the plan underneath — and the large building just north of it is blue',
    'Wikimedia Commons, «Aerial View - Freiburg im Breisgau-Johanneskirche1» (Taxiarchos228, 21 October 2012, CC BY 3.0): the church from the air, from the south-east — the square towers with a clock on the east face of each and on the south face of the south one, the gables and pinnacles at the foot of the spires, the porch with two doorways under round windows and a small arcade, the lower south aisle with four bays, the south arm of the transept with its large round window and, on its east wall, three tall windows under a round one, the turret on the crossing, the slate roofs',
    'Wikimedia Commons, «JohanniskircheFR 001» (Joergens.mi, 25 January 2009, CC BY-SA 2.5): the front and the south side from the street — the storeys of the towers (cornices, two openings and a round one, three openings and a round one under each gable), the two gold-rimmed dials of the south tower, the porch',
    'Wikimedia Commons, «Freiburg, Wiehre: Johanneskirche» (Willy Pragher, 8 September 1976, Staatsarchiv Freiburg W 134 Nr. 106739, CC BY 4.0): the church from the air, from the west — the round choir end, the transept with a large round window, the towers beyond',
    'OpenStreetMap, way 643437367 («Johanneskirche», wikidata Q2319056) and the 15 building:parts inside it: the footprint, the heights (towers 59 m with a 23 m spire, crossing 33 m, its turret 46 m, roofs of nave and transept 26 m), the roof shapes and the slate roofs',
  ],
  assumptions: [
    'everything drawn by hand on OpenStreetMap’s model: the size, number and height of the openings of the towers, the porch, the transept, the nave and the choir, placed by eye on photographs',
    'the towers above 19 m: square up to the foot of the spire as in the photographs (OpenStreetMap has an octagon), with the heights of their storeys, the gables and the pinnacles read off a photograph',
    'the clock on the north face of the north tower (the photographs show the other three; the German Wikipedia counts four)',
    'the sides no photograph here shows — the north side and the windows of the choir — are drawn like the ones they do show',
    'the height of the towers is OpenStreetMap’s 59 m, a little under the «about 60» and «61» metres of the written sources; its outline is 75.0 m long, the sources say 74.3 m',
    'the exact red of the walls and blue-grey of the roofs',
    'not drawn: the lower aisles and the clerestory (OpenStreetMap has nave and aisles as one block), buttresses, side porches, the tracery of the round windows, the crosses on the spires',
  ],
  card: {
    title: 'Johanneskirche',
    years: '1894 – 1899',
    text: [
      'The Wiehre grew fast after it joined Freiburg, and its old church held fewer than 200 people. A new one was decided on in 1889, on the ground of the city’s first gasworks, near the Dreisam. Joseph Durm, the building director of Baden, drew it. Work began in 1894, says the German Wikipedia (1895, says the parish), and the church was consecrated in 1899.',
      'It is a Neo-Romanesque church of red sandstone with slate roofs, 74.3 metres long, with 900 seats. The altar stands in the west: the front, a half-octagonal porch between two towers, looks east down Talstraße. The towers are about 60 metres high (one page of the German Wikipedia says both «about 60» and «61»). Durm named Bamberg cathedral as his model.',
      'The city’s damage map of the air raid of 27 November 1944 leaves the church unmarked, while it marks the large building just north of it for light to medium damage. No written account of the church in the raid was found, so that is all that is said here. The eight bells are of 1954.',
      'The shape of the church is OpenStreetMap’s 3D model of it, towers of 59 metres included. The towers are drawn square up to the spire, as the photographs show them. Their gables, pinnacles and clocks and every window and doorway are drawn by hand from photographs: their sizes are guesses, and so are the sides the photographs do not show.',
    ],
  },
};

import * as THREE from 'three';
import { KIND } from '../kit.js';

// OSM's parts (https://www.openstreetmap.org/way/<number>)
const PART = {
  porch: 'w548771947',
  shaftN: 'w548416464', shaftS: 'w548416465', // the towers up to 19 m
  upperN: 'w548779415', upperS: 'w548772617', // the towers from 19 m: in OSM an octagon with the spire on it
  nave: 'w548881370',
  transept: 'w548416467',
  choir: 'w548604781',
};
// the walls in the red of the sandstone, the roofs in the blue-grey of the slate (the sources name both; the exact
// tones are read off the photographs)
const RED = '#ad665a', RED_DARK = '#935247', SLATE = '#4f5761', GLASS = '#3d4a52', GOLD = '#c9a23a', DIAL = '#2f3d38', DARK = 'OPENING';
// the towers, in metres above the ground: OSM's split at 19 m and its 23 m of spire under 59 m; the rest read off the
// photograph of 2009 against those two (ASSUMED)
const SPLIT = 19, STAGE = 27.4, EAVES = 36, GABLE = 40, DIAL_AT = 17;

const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
const centre = (ring) => [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length];
const wallTop = (b) => b.height - (b.roofShape && b.roofShape !== 'flat' ? b.roofHeight ?? 0 : 0);

/** Builds the Johanneskirche. `kit` comes from startPlace() (src/kit.js); `parts` are its buildings from city.json. */
export function build(kit, parts) {
  const by = Object.fromEntries(Object.entries(PART).map(([k, id]) => [k, parts.find((b) => b.id === id)]));
  const missing = Object.keys(by).filter((k) => !by[k]);
  if (missing.length) throw new Error('Johanneskirche: OSM parts missing from city.json (' + missing.join(', ') + ')');

  // ---- 1. the church, from OSM, in the sources' colours. The towers above 19 m are OSM's too, but square, as the
  // photographs show them (OSM continues them as an octagon): the shaft's own outline up to the foot of the spire,
  // and OSM's octagon for the spire alone.
  const stone = (b) => ({ ...b, colour: RED, roofColour: b.roofShape === 'flat' || !b.roofShape ? (b.height > 15 ? RED_DARK : SLATE) : SLATE });
  kit.osm(parts.filter((b) => b !== by.upperN && b !== by.upperS).map(stone), { walls: KIND.STONE });
  for (const [shaft, upper] of [[by.shaftN, by.upperN], [by.shaftS, by.upperS]]) {
    kit.osm([{ ...stone(shaft), id: shaft.id + '-up', minHeight: SPLIT, height: EAVES, roofShape: 'flat', roofColour: RED_DARK }], { walls: KIND.STONE });
    kit.osm([{ ...upper, minHeight: EAVES - 0.4, colour: RED, roofColour: SLATE }], { walls: KIND.STONE });
  }

  // ---- 2. what is drawn on the walls. The frame is the world: every wall is one of OSM's.
  const W = kit.frame({ x: 0, z: 0, kind: KIND.STONE }), P = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN });
  /** the faces of a part: each edge with its middle, its direction and its outward normal */
  const faces = (b) => { const ring = b.rings[0], c = centre(ring); return ring.map((p, i) => {
    const q = ring[(i + 1) % ring.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]), a = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
    let n = [a[1], -a[0]]; const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    if ((m[0] - c[0]) * n[0] + (m[1] - c[1]) * n[1] < 0) n = [-n[0], -n[1]];
    return { b, p, m, a, n, len, angle: Math.atan2(-n[1], n[0]) };
  }); };
  /** the stretches of a face that no other part stands against at height y: [from, to] along it, from its middle */
  const free = (f, y) => { const out = []; let start = null;
    for (let s = -f.len / 2; s <= f.len / 2 + 1e-6; s += 0.25) {
      const x = f.m[0] + f.a[0] * s + f.n[0] * 0.5, z = f.m[1] + f.a[1] * s + f.n[1] * 0.5;
      const hit = parts.some((o) => o !== f.b && (o.minHeight ?? 0) <= y && wallTop(o === by.upperN || o === by.upperS ? { ...o, roofHeight: 0 } : o) > y && inside(o.rings[0], x, z));
      if (!hit && start == null) start = s;
      if ((hit || s + 0.25 > f.len / 2 + 1e-6) && start != null) { out.push([start, hit ? s - 0.25 : s]); start = null; }
    }
    return out.filter(([s0, s1]) => s1 - s0 > 1); };
  const at = (f, s, out = 0.07) => [f.m[0] + f.a[0] * s + f.n[0] * out, f.m[1] + f.a[1] * s + f.n[1] * out];
  const disc = (f, s, y, r, colour, out = 0.07) => { const [x, z] = at(f, s, out); P.put(new THREE.CircleGeometry(r, 20).rotateY(f.angle + Math.PI / 2), colour, new THREE.Matrix4().makeTranslation(x, y, z)); };
  /** an opening with a round head, w wide, h to the top of the arch, its sill at y */
  const arched = (f, s, y, w, h, colour = DARK) => { const [x, z] = at(f, s); P.panel(w, h - w / 2, x, y, z, f.angle, colour); disc(f, s, y + h - w / 2, w / 2, colour); };
  /** a row of n arched openings, d apart */
  const row = (f, s, y, n, d, w, h, colour) => { for (let i = 0; i < n; i++) arched(f, s + (i - (n - 1) / 2) * d, y, w, h, colour); };
  const round = (f, s, y, r) => { disc(f, s, y, r + 0.35, RED_DARK, 0.05); disc(f, s, y, r, GLASS, 0.09); };
  /** a gable standing on a face: a triangle w wide and h high, t thick, its foot at y */
  const gable = (f, y, w, h, t = 0.6) => {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, h)]), { depth: t, bevelEnabled: false }).rotateY(f.angle + Math.PI / 2);
    const [x, z] = at(f, 0, 0.12 - t); W.put(g, RED, new THREE.Matrix4().makeTranslation(x, y, z));
  };

  // ---- 3. the two towers (ASSUMED: every size and height below; the photographs give the arrangement)
  const naveAxis = centre(by.nave.rings[0]);
  for (const shaft of [by.shaftN, by.shaftS]) {
    const ring = shaft.rings[0], c = centre(ring), fs = faces(shaft), w = Math.min(...fs.map((f) => f.len));
    for (const y of [SPLIT, STAGE, EAVES]) W.box(w + 0.7, 0.5, w + 0.7, c[0], y - 0.25, c[1], RED_DARK, fs[0].angle); // the cornices
    for (const p of ring) { // a pinnacle on each corner
      const x = p[0] + (c[0] - p[0]) * 0.1, z = p[1] + (c[1] - p[1]) * 0.1;
      W.cylinder(0.5, 4.6, x, EAVES - 1.6, z, RED, 6); W.pyramid(0.6, 2.6, x, EAVES + 3, z, RED, 6);
    }
    for (const f of fs) {
      // the belfry: three openings, a round one over them, and a gable against the spire
      gable(f, EAVES, w - 1.6, GABLE - EAVES);
      row(f, 0, STAGE + 1.2, 3, 1.5, 0.85, 5); round(f, 0, EAVES - 1.3, 0.55);
      // the storey under it: two openings and a round one
      row(f, 0, SPLIT + 1.6, 2, 1.4, 0.8, 3.8); round(f, 0, STAGE - 1.6, 0.5);
      // below 19 m, on the faces that look away from the church: the clock, two small windows, a slit
      const outer = (f.m[0] - naveAxis[0]) * f.n[0] + (f.m[1] - naveAxis[1]) * f.n[1] > 0 && free(f, 14).some(([s0, s1]) => s1 - s0 > w - 1.5);
      if (!outer) continue;
      disc(f, 0, DIAL_AT, 1.25, GOLD, 0.06); disc(f, 0, DIAL_AT, 1.05, DIAL, 0.1);
      row(f, 0, 11.6, 2, 1.2, 0.6, 2.4); arched(f, 0, 5.5, 0.6, 2.2);
    }
  }

  // ---- 4. the porch: on each face that stands free, a doorway, a round window and a small arcade (the photographs
  // show two such faces; the others are ASSUMED alike)
  for (const f of faces(by.porch)) {
    if (!free(f, 2).some(([s0, s1]) => s1 - s0 > f.len - 1)) continue;
    arched(f, 0, 0.3, 1.9, 4.9); round(f, 0, 8.4, 0.95); row(f, 0, 11.6, 3, 0.9, 0.55, 1.7);
  }

  // ---- 5. the transept: on each front a large round window and a small arcade in the gable; on the walls beside
  // the fronts, three tall windows under a round one (the aerial view of 2012 shows the south arm; ASSUMED alike north)
  const tf = faces(by.transept), short = Math.min(...tf.map((f) => f.len));
  for (const f of tf) {
    if (f.len < short + 1) { round(f, 0, 11.5, 3.1); row(f, 0, 20.2, 3, 1, 0.55, 1.8); continue; }
    for (const [s0, s1] of free(f, 10)) { if (s1 - s0 < 5) continue; const s = (s0 + s1) / 2; row(f, s, 7.5, 3, 1.5, 0.9, 5.2); round(f, s, 15.6, 0.7); }
  }

  // ---- 6. the nave: four bays a side, each a window for the aisle and one above it (ASSUMED: OSM draws nave and
  // aisles as one block, so the lean-to roofs of the aisles and the clerestory behind them are not there to draw on)
  for (const f of faces(by.nave)) for (const [s0, s1] of free(f, 6)) {
    if (s1 - s0 < 15) continue;
    for (let k = 0; k < 4; k++) { const s = s0 + ((s1 - s0) * (k + 0.5)) / 4; row(f, s, 3.2, 2, 1.3, 0.7, 2.6); row(f, s, 8.6, 2, 1.3, 0.7, 3); }
  }

  // ---- 7. the choir: a tall window in every face that stands free above the rooms beside it (ASSUMED)
  for (const f of faces(by.choir)) if (free(f, 12).some(([s0, s1]) => s1 - s0 > f.len - 0.8)) arched(f, 0, 9.5, 0.9, 5.5);

  const cN = centre(by.shaftN.rings[0]), cS = centre(by.shaftS.rings[0]);
  return { anchor: [(cN[0] + cS[0]) / 2, (cN[1] + cS[1]) / 2], top: by.upperN.height };
}
