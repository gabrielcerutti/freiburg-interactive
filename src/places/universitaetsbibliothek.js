// The Universitätsbibliothek (University Library) on Platz der Universität: the building opened in 2015.
//
// What the sources give:
//   - Where it stands and its outline: OpenStreetMap's way 219971985 (22 corners, traced from aerial imagery,
//     «source=Bing»), and the coordinates of both Wikipedias.
//   - When: «Die neue Universitätsbibliothek nahm […] am 21. Juli 2015 ihren Probebetrieb auf. Am 12. Oktober 2015
//     wurde sie offiziell […] der Universität übergeben» (de). OSM: start_date=2015. Before it, on the same basements,
//     stood the library of 1978 (closed 2008, taken down from January 2011), and before that the Rotteck-Gymnasium
//     (demolished in 1971).
//   - Who: «Architektenwettbewerb [Anfang 2006], bei dem der erste Preis an das Basler Architektenbüro Degelo
//     Architekten ging» (de); OSM: architect=Degelo Architekten, Basel.
//   - Its skin: «Fassade aus Glas und dunkelmattiertem Chromstahl mit einer Fläche von 7300 Quadratmeter» (de);
//     OSM: building:material=mirror, roof:shape=flat.
//   - Its storeys: the German article's list of what is on each floor runs from the ground floor to a sixth upper
//     floor (seven storeys), though the same article also speaks of «fünf oberirdischen Geschosse»; OSM tags
//     building:levels=9. A photo of 2017 (Taxiarchos228, Commons) shows seven: a ground floor and six storeys with
//     two rows of panels each. The model draws seven.
//
// How it is made: a crystal. Every side of the outline is a face made of two planes: one from the ground up to a
// fold, standing a little inside the outline at its foot (the wall leans out, and mirrors the square), and one from
// the fold up to the roof, standing further inside at the top (the wall leans back, and mirrors the sky). Where two
// faces that lean differently meet, the edge between them runs slanted by itself. Each face is then cut into rows
// (two per storey) of glass and metal panels, the rows shifted against each other like bricks, as on the photos.
// On Milchstraße (west) the faces lean back from the ground and are mostly metal, with a cleft between them where
// the back entrance is; the main entrance is on the east, at the waist of the building.
//
// ASSUMED (no source gives any of it; all of it by eye, from the photos listed in PLACE.sources):
//   - the height: 27.3 m, seven storeys of 3.9 m. With the leans below, the model's skin (the walls, without the
//     roof) then measures 7,240 m², about the 7,300 m² the Wikipedias give for the façade: that is how 3.9 m was
//     chosen. It holds only as far as the leans do;
//   - that OSM's outline is the widest line of the building (where the faces fold), not its foot;
//   - how far each face leans out and back, and at which storey it folds. The real folds are finer: some run
//     slanted across a face where the model's are level;
//   - six small corners of OSM's outline are left out (1, 2, 7, 9, 17, 20: each less than 2 m off the line between
//     its neighbours), so that every face is one plane;
//   - the size and rhythm of the panels, and the colours, which are those of a clear day (the glass light where it
//     mirrors the sky, dark where it mirrors the ground);
//   - the roof, flat and bare (OSM: roof:shape=flat; no photo used shows it);
//   - the size and the exact place of the two entrances.

import * as THREE from 'three';
import { KIND } from '../kit.js';

export const PLACE = {
  key: 'universitaetsbibliothek',
  name: 'Universitätsbibliothek',
  localName: 'University Library',
  kind: 'building',
  built: { from: 2011, to: 2015 }, // de: the old building taken down from January 2011, the shell begun in December 2011; trial operation from 21 July 2015
  since: 2015, // de.wikipedia: «nahm […] am 21. Juli 2015 ihren Probebetrieb auf»; OSM: start_date=2015. (The library of 1978 that stood here before is another building, and is not drawn.)
  coordinates: [47.99388889, 7.84527778], // de.wikipedia «Universitätsbibliothek Freiburg», the article's coordinates (that is 47° 59′ 38″ N, 7° 50′ 43″ E: given to the second, so good to some 30 m); en.wikipedia gives the same
  osm: 'w219971985',
  sources: [
    'German Wikipedia, «Universitätsbibliothek Freiburg»: coordinates (47.99388889 N, 7.84527778 E); the library of 1978 on Werthmannplatz, for which the Rotteck-Gymnasium was demolished in 1971, closed in 2008; the competition of early 2006, won by Degelo Architekten of Basel; the old building taken down from January 2011, its three basements and three stair towers kept; the shell finished in April 2013; the façade «aus Glas und dunkelmattiertem Chromstahl», 7,300 m², begun in April 2013; trial operation from 21 July 2015, handed over on 12 October 2015; the cost, first put at 32 and in the end 53 million euros; the uses of each floor, from the ground floor to a sixth upper floor; 1,750 places to work; the glare at the south-east corner and its sunshade; the panel that fell on 6 August 2018 and the refastening from May 2019',
    'English Wikipedia, «University Library Freiburg»: the same coordinates and dates; «a total of 1,700 workspaces»; the «7,300 m2 facade of glass and matted, dark chrome steel»',
    'OpenStreetMap, way 219971985: the outline (traced from aerial imagery), start_date=2015, architect=Degelo Architekten, Basel, building:levels=9, building:material=mirror, roof:shape=flat',
    'Wikimedia Commons, «Freiburg - Universitätsbibliothek Freiburg1» (Taxiarchos228, 2017, Free Art License) and «Freiburg im Breisgau, Universitätsbibliothek -- 2025 -- 8092» (Dietmar Rabich, CC BY-SA 4.0): the north-east faces, leaning out below and back above; seven storeys, six of them with two rows of panels; the colours',
    'Wikimedia Commons, «Universitätsbibliothek Freiburg» (Ronald Buck, 2017, CC BY-SA 4.0) and «Universitätsbibliothek in Freiburg vom Kollegiengebäude I» (Andreas Schwarzkopf, 2015, CC BY-SA 3.0): the east side, its folds and the main entrance at the waist',
    'Wikimedia Commons, «Zentrum - Universitätsbibliothek (2024)» (Besserwisser123, CC BY-SA 4.0) and «Universitätsbibliothek Freiburg von der Rempartstraße gesehen» (Andreas Schwarzkopf, 2015, CC BY-SA 3.0): the south end, leaning back from low down',
    'Wikimedia Commons, «Universitätsbibliothek Freiburg, Arbeitsbühnen hinter der UB» and «Universitätsbibliothek in Freiburg, Blick in die Milchstraße, im Hintergrund das Theater» (Andreas Schwarzkopf, 2015, CC BY-SA 3.0): the west side on Milchstraße, leaning back from the ground, mostly metal, with the cleft of the back entrance',
  ],
  assumptions: [
    'the height (27.3 m: seven storeys of 3.9 m, chosen so that the model’s skin comes to about the 7,300 m² given for the façade); no source gives it',
    'that OpenStreetMap’s outline is the widest line of the building, not its foot',
    'how far each face leans out and back, and at which storey it folds (by eye from photos; the real folds are finer and some run slanted)',
    'six small corners of the outline are left out, so that every face is one plane',
    'the size and rhythm of the panels, and the colours (those of a clear day)',
    'the roof, drawn flat and bare',
    'the size and exact place of the two entrances',
  ],
  card: {
    title: 'Universitätsbibliothek',
    years: 'opened 2015',
    text: [
      'The University Library opened for trial operation on 21 July 2015 and was handed over to the university on 12 October 2015. Degelo Architekten of Basel had won the competition for it in early 2006.',
      'It stands on the basements of the library of 1978, which closed in 2008 and was taken down from January 2011. Its three underground storeys of stacks and three stair towers were kept. Before 1978 the Rotteck-Gymnasium stood here; it was demolished in 1971.',
      'The façade, 7,300 square metres of glass and dark matt chrome steel, was put up from April 2013. At the south-east corner the low sun of spring and autumn dazzled people in the street, so the corner is covered with a sunshade at those times. On 6 August 2018 a metal panel came loose and fell; the panels were refastened from May 2019.',
      'The cost was first put at 32 million euros and came to 53 million. The German Wikipedia counts 1,750 places to work, the English one 1,700.',
      'Only the outline is OpenStreetMap’s. The height, how far each face leans, where it folds, the panels and the colours are guesses made from photos.',
    ],
  },
};

const OUTLINE = 'w219971985', CORNERS = 22;
const STOREYS = 7, STOREY = 3.9, H = STOREYS * STOREY; // (27.3 m: ASSUMED, see above)

// The faces, clockwise from the north-west corner. `from`: the corner of OSM's outline where the face starts (it ends
// where the next one starts); `foot`: how far inside the outline it stands at the ground, in metres; `fold`: the
// storey at which it folds (0: it leans back from the ground); `top`: how far inside the outline it reaches the roof;
// `metal`: mostly metal panels. ASSUMED, all of it.
const FACES = [
  { from: 21, foot: 1.5, fold: 2, top: 4.0 },              // north, on Sedanstraße
  { from: 0, foot: 3.0, fold: 4, top: 3.2 },               // north-east, towards Platz der Alten Synagoge (the café) …
  { from: 3, foot: 3.0, fold: 4, top: 3.2 },               // … in two parts with a slight fold between them
  { from: 4, foot: 1.5, fold: 3, top: 3.8 },               // the north-east corner
  { from: 5, foot: 1.5, fold: 3, top: 4.2 },               // east, the north block
  { from: 6, foot: 1.0, fold: 4, top: 2.5, door: 'main' }, // east, the waist: the main entrance at its south end
  { from: 8, foot: 1.0, fold: 4, top: 1.2 },               // east, the south block: almost upright
  { from: 11, foot: 0.5, fold: 1, top: 6.5 },              // south-east: leans back from above the ground floor
  { from: 12, foot: 0.5, fold: 1, top: 5.0 },              // south, on Belfortstraße …
  { from: 13, foot: 1.0, fold: 3, top: 4.5 },              // … and its longer part
  { from: 14, foot: 0, fold: 0, top: 11, metal: true },    // west (Milchstraße), the south block …
  { from: 15, foot: 0, fold: 0, top: 11, metal: true },    // … in two parts
  { from: 16, foot: 0, fold: 0, top: 0, metal: true, door: 'back' }, // the cleft: upright, with the back entrance
  { from: 18, foot: 0, fold: 0, top: 5.5, metal: true },   // west, the north block
  { from: 19, foot: 0, fold: 0, top: 7.0 },                // north-west
];

// Colours (ASSUMED, from the photos of clear days): the glass by what it mirrors, the metal «dunkelmattiert».
const GLASS = { sky: '#8aa6c4', upright: '#566a80', under: '#3a4652' };
const METAL = { sky: '#70705f', upright: '#7f7359', under: '#7f7359' };
const SHEET = { sky: '#7e8791', upright: '#6a7078', under: '#6a7078' }; // (the metal of the west side, mirroring the sky)
const GROUND_FLOOR = '#22282d', ROOF = '#5b5f63', DOOR = '#1d2024';
const PERIOD = 3.7, PANEL = 1.1; // (one pane of glass and one metal panel: 2.6 + 1.1 m)

export function build(kit, parts) {
  const outline = parts.find((b) => b.id === OUTLINE);
  if (!outline) throw new Error('Universitätsbibliothek: its OSM outline is missing from city.json');
  const ring = outline.rings[0];
  if (ring.length !== CORNERS) throw new Error(`Universitätsbibliothek: OSM’s outline has ${ring.length} corners, not the ${CORNERS} the faces are listed by`);

  const F = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }); // (the frame is the world: the faces come from the outline)
  const solid = crystal(ring, FACES);
  for (const [colour, triangles] of solid.skin) F.put(geometryOf(triangles), colour);
  F.put(geometryOf(solid.roof), ROOF);

  // the entrances: dark openings at the foot of their faces
  for (const f of solid.faces) {
    if (!f.door) continue;
    const [w, h, s] = f.door === 'main' ? [8, 3.3, f.length - 6.5] : [7, 3.1, f.length / 2];
    const x = f.a[0] + f.u[0] * s - f.out[0] * (f.foot - 0.15), z = f.a[1] + f.u[1] * s - f.out[1] * (f.foot - 0.15);
    F.box(w, h, 0.5, x, 0, z, DOOR, Math.atan2(-f.u[1], f.u[0]));
  }

  const top = solid.corners(H), anchor = [top.reduce((s, p) => s + p[0], 0) / top.length, top.reduce((s, p) => s + p[1], 0) / top.length];
  return { anchor, top: H };
}

/**
 * The faceted solid: every face is two planes (ground to fold, fold to roof), and the corner between two faces at a
 * given height is where their two lines meet at that height. Returns the skin (triangles by colour), the roof, the
 * faces with their measures, and corners(y): the outline at height y.
 */
function crystal(ring, list) {
  const n = list.length, P = list.map((f) => ring[f.from]);
  let area = 0; for (let i = 0, j = n - 1; i < n; j = i++) area += P[j][0] * P[i][1] - P[i][0] * P[j][1];
  const side = area > 0 ? 1 : -1; // (which way round the outline goes: `out` must point away from the building)
  const faces = list.map((f, k) => {
    const a = P[k], b = P[(k + 1) % n], length = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / length, (b[1] - a[1]) / length];
    return { ...f, a, u, length, out: [side * u[1], -side * u[0]], fold: f.fold * STOREY };
  });
  /** how far inside the outline the face stands at height y */
  const inset = (f, y) => (y < f.fold ? f.foot * (1 - y / f.fold) : (f.top * (y - f.fold)) / (H - f.fold));
  const cross = (p, q) => p[0] * q[1] - p[1] * q[0];
  /** the corner where face k starts, at height y: where its line and the previous face's meet */
  const corner = (k, y) => {
    const f = faces[k], g = faces[(k + n - 1) % n], df = inset(f, y), dg = inset(g, y);
    const qf = [f.a[0] - f.out[0] * df, f.a[1] - f.out[1] * df], qg = [g.a[0] - g.out[0] * dg, g.a[1] - g.out[1] * dg];
    const c = cross(g.u, f.u);
    if (Math.abs(c) < 0.05) return [(qf[0] + qg[0] + g.u[0] * g.length) / 2, (qf[1] + qg[1] + g.u[1] * g.length) / 2]; // (two faces in one line)
    const s = cross([qf[0] - qg[0], qf[1] - qg[1]], f.u) / c;
    return [qg[0] + g.u[0] * s, qg[1] + g.u[1] * s];
  };
  const corners = (y) => faces.map((_, k) => corner(k, y));

  // the rows: the ground floor, then two rows of panels to each storey
  const rows = [[0, STOREY]];
  for (let s = 1; s < STOREYS; s++) rows.push([s * STOREY, (s + 0.5) * STOREY], [(s + 0.5) * STOREY, (s + 1) * STOREY]);

  const skin = new Map(), add = (colour, tri) => { if (!skin.has(colour)) skin.set(colour, []); skin.get(colour).push(tri); };
  rows.forEach(([y0, y1], row) => {
    const low = corners(y0), high = corners(y1);
    faces.forEach((f, k) => {
      const along = (p) => (p[0] - f.a[0]) * f.u[0] + (p[1] - f.a[1]) * f.u[1];
      let s00 = along(low[k]), s01 = along(low[(k + 1) % n]), s10 = along(high[k]), s11 = along(high[(k + 1) % n]);
      if (s01 < s00) s00 = s01 = (s00 + s01) / 2; // (a face squeezed out by its neighbours ends in a point)
      if (s11 < s10) s10 = s11 = (s10 + s11) / 2;
      if (s01 - s00 < 1e-3 && s11 - s10 < 1e-3) return;
      const d0 = inset(f, y0), d1 = inset(f, y1), lean = (d1 - d0) / (y1 - y0);
      const tone = lean > 0.03 ? 'sky' : lean < -0.03 ? 'under' : 'upright';
      const want = [f.out[0], lean, f.out[1]]; // (the way the face looks: out, and up if it leans back)
      /** the point of this face `s` metres along it and `v` (0 to 1) up the row */
      const at = ([s, v]) => { const d = d0 + (d1 - d0) * v; return [f.a[0] + f.u[0] * s - f.out[0] * d, y0 + (y1 - y0) * v, f.a[1] + f.u[1] * s - f.out[1] * d]; };
      const piece = [[s00, 0], [s01, 0], [s11, 1], [s10, 1]]; // (this face's part of the row: a trapezoid)
      const cell = (from, to, colour) => {
        const poly = between(piece, from, to).map(at);
        for (let i = 1; i < poly.length - 1; i++) add(colour, facing([poly[0], poly[i], poly[i + 1]], want));
      };
      const s0 = Math.min(s00, s10), s1 = Math.max(s01, s11);
      if (row === 0 && !f.metal) { cell(s0, s1, GROUND_FLOOR); return; } // (the ground floor: dark glass, set back)
      const [wide, narrow] = f.metal ? [SHEET[tone], GLASS.upright] : [GLASS[tone], METAL[tone]];
      const shift = row % 2 ? PERIOD / 2 : 0; // (each row half a step off the one below)
      for (let j = Math.floor((s0 - shift) / PERIOD); shift + j * PERIOD < s1; j++) {
        const s = shift + j * PERIOD;
        cell(s, s + PERIOD - PANEL, wide);
        cell(s + PERIOD - PANEL, s + PERIOD, narrow);
      }
    });
  });

  // the roof: the outline at the top, flat
  const rim = corners(H), roof = [];
  for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(rim.map((p) => new THREE.Vector2(p[0], p[1])), [])) {
    roof.push(facing([rim[i], rim[j], rim[k]].map((p) => [p[0], H, p[1]]), [0, 1, 0]));
  }
  return { skin, roof, faces, corners };
}

/** the part of a polygon [[s, v], …] between s = from and s = to */
function between(poly, from, to) {
  const cut = (pts, keep, edge) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], ip = keep(p), iq = keep(q);
      if (ip) out.push(p);
      if (ip !== iq) { const t = (edge - p[0]) / (q[0] - p[0]); out.push([edge, p[1] + (q[1] - p[1]) * t]); }
    }
    return out;
  };
  return cut(cut(poly, (p) => p[0] >= from, from), (p) => p[0] <= to, to);
}

/** a triangle turned so that it looks the way `want` points */
function facing([a, b, c], want) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0];
  return nx * want[0] + ny * want[1] + nz * want[2] < 0 ? [a, c, b] : [a, b, c];
}

function geometryOf(triangles) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(triangles.flat(2), 3));
  return g;
}

