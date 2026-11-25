// The Colombischlössle (Villa Colombi), on its mound in the Colombipark; today the archaeological museum.
//
// How it is made:
//   - The footprints are OpenStreetMap's 12 parts of the villa (way 146291591): the body, a square of about 18 by
//     20 m with cut corners (way 1546625569, 2 levels, a pyramidal roof); a middle part running through it from the
//     garden front to the back, standing out of both (way 1546625571, hipped roof); the square lantern over the
//     stairwell (way 1546625570); the porch on the front (way 1546625572, 1 level, flat); two round turrets at the
//     back (ways 1546625579/80, 3 levels); and six small squares at the corners of the body and of the front
//     projection (ways 1546625573–78), which the photos show to be sandstone pilasters. OSM gives levels and roof
//     shapes, the roofs' colour («grey»), and NO heights in metres.
//   - What the photos show, and is made by hand on those footprints (all of them on Wikimedia Commons):
//       · the front, 2011 («Colombischlößchen (Freiburg) 3348», joergens.mi; one of the place's photos): walls of
//         yellowish brick, a plinth and pilasters of red sandstone, window frames and parapets of light stone; the
//         middle part taller than the wings; a porch of three pointed arches with a balcony on top and a three-light
//         window above it; pierced parapets all round instead of visible eaves;
//       · the south-west side, 2019 («Colombischlößle (Freiburg im Breisgau) jm90430», Joergens.mi; one of the
//         place's photos): five bays on two floors, a double window in the middle bay between two pilasters, a
//         turret behind;
//       · the back, 2016 («Ansicht von Westen (Rückseite) des Colombischlössles in Freiburg», Andreas Schwarzkopf):
//         the two turrets have EIGHT sides (OSM maps them round) and rise one storey above the roof, with a pierced
//         parapet of their own; between them two double windows on each floor, the upper ones with balconies;
//       · the photograph by Gottlieb Theodor Hase, after 1861 («Colombischlößle, Blick von der Eisenbahnstraße»;
//         one of the place's photos): behind the parapets a low hipped roof, and on it the glazed lantern with a low
//         pyramid and a weathervane (de.wikipedia: «eine helle Glaskuppel», «das historische Glasdach»).
//
// ASSUMED: every height (no source gives one: they are read off those photographs, scaled by the width of OSM's
// footprint — walls 10.3 m, parapets to 11.25 m, the middle part 1 m more, the turrets 15.4 m, the top of the
// lantern 14.7 m); the pitch of the roofs; the size and exact place of every window; the north-east side, which none
// of these photos shows (drawn like the south-west one); the spacing of the parapets' openings (the real ones are
// tracery); the exact colours. The foot of the porch is hidden in the photos: no steps are drawn. The terrace and
// the flights of stairs in front of the villa are not modelled.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { orientedBox, shrunk } from '../buildings.js';

export const PLACE = {
  key: 'colombischloessle',
  name: 'Colombischlössle',
  localName: 'Colombi Villa',
  kind: 'building',
  built: { from: 1859, to: 1861 }, // de: «wurde 1859 bis 1861 … errichtet»; en: «built between 1859 and 1861»
  since: 1861, // (the year it was finished, same sources: it is not there at the stop of 1838 and stands from 1875 on)
  // No written account of the villa in the raid was found: the state rests on the city’s damage map alone.
  war: { state: 'damaged', rebuilt: null, source: 'City of Freiburg, damage map after the air raid of 27 November 1944 (the viewer’s «Nov 1944» plan): the villa is marked blue, which its legend gives as light to medium damage, habitable; German Wikipedia, «Colombischlössle»: «Von 1947 bis 1952 … Sitz der Staatskanzlei»' },
  coordinates: [47.99774, 7.84618], // en.wikipedia «Colombischlössle Freiburg», geo data (de.wikipedia «Colombischlössle»: 47.997713, 7.846174)
  osm: 'w146291591',
  sources: [
    'German Wikipedia, «Colombischlössle»: built 1859 to 1861 on the former Bastion Saint Louis, «die auf 15 Meter aufgefüllt und zu einem Garten umfunktioniert worden war»; for «Gräfin Maria Antoni(et)a Gertrudis de Colombi y de Bode (1809–1863)», as her «Witwensitz»; plans by the Freiburg architect Georg Jakob Schneider, in «den gotischen Tudorstil des englischen Mittelalters», after his teacher Friedrich Eisenlohr and Schloss Ortenberg; about 300,000 Goldmark; the stairwell and the «Glaskuppel»; bought by the town in 1899; municipal art museum 1909–1923; Staatskanzlei of Baden under Leo Wohleb 1947–1952; Badischer Verwaltungsgerichtshof 1952–1958; chambers of the Oberlandesgericht Karlsruhe 1959–1977; the museum since 1983; a Kulturdenkmal since 2003; the park open to the public since 1906; coordinates 47.997713 N, 7.846174 E',
    'English Wikipedia, «Colombischlössle Freiburg»: coordinates (47.99774 N, 7.84618 E); the same dates, architect and cost; it calls the client a duchess («Duches Maria Antonia Gertrudis von Zea Bermudez y Colombi»)',
    'German Wikipedia, «Archäologisches Museum Colombischlössle»: the museum, then called Museum für Ur- und Frühgeschichte, reopened in the villa in 1983',
    'Wikimedia Commons, «Colombischlößle, Blick von der Eisenbahnstraße - Gottlieb Theodor Hase - Augustiner M Freiburg» (photograph by Gottlieb Theodor Hase, after 1861, CC0): the low hipped roof behind the parapets, the lantern with its weathervane, the raised middle part, a turret',
    'Wikimedia Commons, «Colombischlößchen (Freiburg) 3348» (joergens.mi, 2011, CC BY-SA 3.0): the front — materials and colours, the porch of three arches with its balcony, the windows, the parapets',
    'Wikimedia Commons, «Colombischlößle (Freiburg im Breisgau) jm90430» (Joergens.mi, 2019, CC BY-SA 3.0): the south-west side — five bays, the two pilasters, the turret',
    'Wikimedia Commons, «Ansicht von Westen (Rückseite) des Colombischlössles in Freiburg» (Andreas Schwarzkopf, 2016, CC BY-SA 3.0): the back — two eight-sided turrets one storey taller than the roof, the windows and balconies between them',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the villa is marked blue. None of the pages read (German and English Wikipedia on the villa and on the museum, the raid’s article, the museum’s page) says what the raid did to it',
    'OpenStreetMap, way 146291591 and its 12 building:parts: the footprints, the levels (2; turrets 3), the roof shapes (pyramidal, hipped, flat) and roof:colour grey. No heights',
  ],
  assumptions: [
    'every height: walls, parapets, the raised middle part, the turrets, the roof and the lantern (read off photographs, scaled by the width of the OSM footprint)',
    'the pitch of the roofs behind the parapets',
    'the size and exact place of the windows, and the shape of their heads',
    'the north-east side, which none of the photos used shows: drawn like the south-west side',
    'the parapets: the real ones are tracery, drawn here as a row of plain openings',
    'the foot of the porch (hidden in the photos: no steps are drawn) and the exact colours',
  ],
  card: {
    title: 'Colombischlössle',
    years: '1859 – 1861',
    text: [
      'The villa was built between 1859 and 1861 as the widow’s residence of Maria Antonia Gertrudis de Colombi y de Bode (1809–1863). The German Wikipedia calls her a countess («Gräfin»), the English one a duchess. It stands on the former Bastion Saint Louis of the town’s fortifications, which had been filled in and turned into a garden.',
      'The Freiburg architect Georg Jakob Schneider drew the plans, in the Gothic Tudor style of medieval England, following his teacher Friedrich Eisenlohr. The house cost about 300,000 Goldmark. A glass roof lights the stairwell in the middle.',
      'The town bought the villa in 1899. It was the municipal art museum from 1909 to 1923. The city’s damage map of the air raid of 27 November 1944 marks the villa with light to medium damage; no written account of it was found. From 1947 to 1952 it was the seat of the state government of Baden under Leo Wohleb; then it housed courts until 1977. Since 1983 it has been the archaeological museum. The park has been open to the public since 1906.',
      'The footprints are OpenStreetMap’s, which maps the two turrets round; the photos show eight sides. No source gives a height: all heights, the roof, the windows and the parapets are read off photographs, and the north-east side, which those photos do not show, is drawn like the south-west one.',
    ],
  },
};

const BODY = 'w1546625569', MIDDLE = 'w1546625571', LANTERN = 'w1546625570', PORCH = 'w1546625572', TURRETS = ['w1546625579', 'w1546625580'];
const BRICK = '#c9a682', RED = '#955a50', STONE = '#dccaa6', GLASS = '#b4c6ca', GLASS_ROOF = '#cbd8da', DARK = 'OPENING';
// heights in metres above the ground — ALL ASSUMED, read off the photographs (see the top of the file)
const PLINTH = 1.0, FLOOR = 5.4, SILL = [1.95, 6.1], WIN = 2.25, WALL = 10.3, RAISE = 1.0, PARAPET = 0.95;
const ROOF = 3.4, RIDGE = 1.2, LAMP = { foot: 12.2, eaves: 13.5, top: 14.7 }, TURRET = { eaves: 14.45, top: 15.4 };

/** a window light: upright sides and a pointed head, flat, facing +z, its foot centred on the origin */
function pointed(w, h) {
  const r = w / 2, rise = Math.min(h * 0.4, w * 0.9), y = h - rise, s = new THREE.Shape();
  s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, y); s.lineTo(r * 0.72, y + rise * 0.55); s.lineTo(0, h); s.lineTo(-r * 0.72, y + rise * 0.55); s.lineTo(-r, y);
  return new THREE.ShapeGeometry(s);
}

export function build(kit, parts) {
  const byId = (id) => parts.find((b) => b.id === id);
  const body = byId(BODY), middle = byId(MIDDLE), lantern = byId(LANTERN), porch = byId(PORCH), turrets = TURRETS.map(byId);
  if (!body || !middle || !lantern || !porch || turrets.some((t) => !t)) throw new Error('Colombischlössle: OSM parts missing from city.json');
  const mid = (ring) => [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length];

  // the villa's frame: origin at the middle of the body, x towards the garden front (where the porch is), z to its right
  const hb = orientedBox(body.rings[0]), c = hb.c, pm = mid(porch.rings[0]);
  const u = [hb.u, [-hb.u[0], -hb.u[1]], hb.v, [-hb.v[0], -hb.v[1]]].sort((a, b) => ((pm[0] - c[0]) * b[0] + (pm[1] - c[1]) * b[1]) - ((pm[0] - c[0]) * a[0] + (pm[1] - c[1]) * a[1]))[0];
  const angle = Math.atan2(-u[1], u[0]), v = [Math.sin(angle), Math.cos(angle)];
  const F = kit.frame({ x: c[0], z: c[1], angle });
  const local = (b) => b.rings[0].map(([x, z]) => [(x - c[0]) * u[0] + (z - c[1]) * u[1], (x - c[0]) * v[0] + (z - c[1]) * v[1]]);
  const span = (pts, k) => [Math.min(...pts.map((p) => p[k])), Math.max(...pts.map((p) => p[k]))];
  const B = local(body), M = local(middle), P = local(porch), [bx0, bx1] = span(B, 0), [bz0, bz1] = span(B, 1), [mx0, mx1] = span(M, 0);
  const [fz0, fz1] = span(M.filter((p) => p[0] > mx1 - 0.5), 1), [rz0, rz1] = span(M.filter((p) => p[0] < mx0 + 0.5), 1); // (the middle part's front and back walls)
  const [mz0, mz1] = span(M.filter((p) => Math.abs(p[0]) < bx1), 1), zc = (fz0 + fz1) / 2;

  // ------------------------------------------------------------------------------------------ 1. the volumes, from OSM
  const solid = (b, o, options = { walls: KIND.STONE }) => kit.osm([{ ...b, levels: null, roofLevels: null, ...o }], options);
  const band = (b, y0, y1, out, colour) => solid(b, { id: `${b.id}-${y0}`, rings: shrunk(b.rings, -out), minHeight: y0, height: y1, roofShape: 'flat', roofHeight: 0, colour, roofColour: colour });
  solid(body, { height: WALL + ROOF, roofHeight: ROOF, colour: BRICK }); // (pyramidal, as OSM has it; its colour, grey, is OSM's)
  solid(middle, { height: WALL + RAISE + RIDGE, roofHeight: RIDGE, colour: BRICK }); // (hipped, as OSM has it)
  for (const [b, top] of [[body, WALL], [middle, WALL + RAISE]]) {
    band(b, 0, PLINTH, 0.07, RED); // the plinth
    band(b, FLOOR - 0.2, FLOOR + 0.2, 0.08, STONE); // the course between the floors
    band(b, top - 0.55, top, 0.1, STONE); // the frieze and cornice under the parapet
  }
  // the lantern over the stairwell: glazed walls and a low glass pyramid, with a weathervane
  solid(lantern, { minHeight: LAMP.foot, height: LAMP.top, roofHeight: LAMP.top - LAMP.eaves, colour: GLASS, roofColour: GLASS_ROOF }, { walls: KIND.PLAIN, roof: KIND.PLAIN });
  const L = local(lantern), [lx0, lx1] = span(L, 0), [lz0, lz1] = span(L, 1), lx = (lx0 + lx1) / 2, lz = (lz0 + lz1) / 2;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) F.box(0.16, LAMP.eaves - LAMP.foot, 0.16, lx + (sx * (lx1 - lx0)) / 2, LAMP.foot, lz + (sz * (lz1 - lz0)) / 2, 'IRON');
  for (const k of [-1 / 6, 1 / 6]) for (const s of [-1, 1]) {
    F.box(0.1, LAMP.eaves - LAMP.foot, 0.1, lx + k * (lx1 - lx0), LAMP.foot, lz + (s * (lz1 - lz0)) / 2, 'IRON');
    F.box(0.1, LAMP.eaves - LAMP.foot, 0.1, lx + (s * (lx1 - lx0)) / 2, LAMP.foot, lz + k * (lz1 - lz0), 'IRON');
  }
  F.cylinder(0.05, 1.3, lx, LAMP.top - 0.1, lz, 'IRON', 4);
  F.cylinder(0.13, 0.26, lx, LAMP.top + 0.25, lz, 'IRON', 6); // (its knob, and the vane to one side of the rod)
  F.box(0.5, 0.2, 0.04, lx + 0.3, LAMP.top + 0.9, lz, 'IRON', 0.6);
  // the pilasters at the corners (OSM's small squares), in red sandstone, standing a little over the parapets
  for (const b of parts) {
    if ([BODY, MIDDLE, LANTERN, PORCH, ...TURRETS].includes(b.id)) continue;
    const onFront = Math.abs(mid(local(b))[1]) < bz1 - 2; // (the two at the corners of the front projection)
    solid(b, { height: WALL + (onFront ? RAISE : 0) + PARAPET + 0.2, roofShape: 'flat', roofHeight: 0, colour: RED, roofColour: RED });
  }

  // ------------------------------------------------------------------- 2. the walls' faces, to hang things on them
  // A face is the longest straight wall of a ring that looks along +x, −x, +z or −z of the frame; things are placed
  // by their distance along it (a) and stand `off` metres out of it.
  const face = (ring, axis, s) => {
    const k = axis === 'x' ? 0 : 1; let best = null;
    ring.forEach((p, i) => { const q = ring[(i + 1) % ring.length], run = Math.abs(q[1 - k] - p[1 - k]); if (s * (p[k] + q[k]) > 0 && run > 4 * Math.abs(q[k] - p[k]) && (!best || run > best.run)) best = { p, q, run }; });
    const at = (a) => best.p[k] + ((best.q[k] - best.p[k]) * (a - best.p[1 - k])) / (best.q[1 - k] - best.p[1 - k]);
    const point = (a, out) => (axis === 'x' ? [at(a) + s * out, a] : [a, at(a) + s * out]);
    return {
      /** a block w wide and h high, t thick, its back `off` metres out of the wall (and `bury` metres more into it) */
      slab(a, y, w, h, t, colour, off = 0, bury = 0.2) {
        const [x, z] = point(a, off + (t - bury) / 2);
        if (axis === 'x') F.box(t + bury, h, w, x, y, z, colour); else F.box(w, h, t + bury, x, y, z, colour);
      },
      /** a dark window light with a pointed head */
      light(a, y, w, h, off) {
        const [x, z] = point(a, off), turn = axis === 'x' ? (s * Math.PI) / 2 : s > 0 ? 0 : Math.PI;
        F.put(pointed(w, h), DARK, new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(turn)));
      },
    };
  };
  /** a window of 1, 2 or 3 lights in its stone frame, with the panel under its sill */
  const win = (f, a, y, lights = 1, apron = 0.8, h = WIN) => {
    const w = lights === 1 ? 1.0 : lights === 2 ? 1.75 : 2.6, lw = (w - (lights - 1) * 0.16) / lights;
    f.slab(a, y - 0.12, w + 0.5, h + 0.5, 0.1, STONE);
    for (let i = 0; i < lights; i++) f.light(a + (i - (lights - 1) / 2) * (lw + 0.16), y, lw, lights === 3 && i !== 1 ? h - 0.35 : h, 0.115);
    if (apron) f.slab(a, y - 0.12 - apron, w + 0.3, apron, 0.06, STONE);
  };
  /** a pierced parapet from a0 to a1 standing on y: a foot, a rail and uprights with gaps between them */
  const rail = (f, a0, a1, y, h = PARAPET, t = 0.24) => {
    const len = a1 - a0, m = (a0 + a1) / 2, n = Math.max(1, Math.round(len / 0.5));
    f.slab(m, y, len, 0.2, t, STONE, -t, 0);
    f.slab(m, y + h - 0.16, len, 0.16, t, STONE, -t, 0);
    for (let i = 0; i < n; i++) f.slab(a0 + ((i + 0.5) * len) / n, y + 0.2, 0.2, h - 0.36, 0.12, STONE, -t + 0.06, 0);
  };
  const post = (f, a, y, colour) => f.slab(a, y, 0.62, PARAPET + 0.12, 0.34, colour, -0.3, 0);

  const sides = [face(B, 'z', 1), face(B, 'z', -1)], front = face(B, 'x', 1), back = face(B, 'x', -1);
  const mFront = face(M, 'x', 1), mBack = face(M, 'x', -1), mSides = [face(M, 'z', 1), face(M, 'z', -1)];
  const TOP = WALL + RAISE, floors = [[SILL[0], 0.8], [SILL[1], 0.36]]; // (each floor: the sill and the panel under it)

  // ----------------------------------------------------------------------- 3. the two long sides (south-west, north-east)
  for (const f of sides) {
    for (const [y, apron] of floors) { for (const a of [-6.5, -3.9, 3.9, 6.5]) win(f, a, y, 1, apron); win(f, 0, y, 2, apron); }
    for (const a of [-1.85, 1.85]) { f.slab(a, PLINTH, 0.65, WALL - PLINTH, 0.09, RED); post(f, a, WALL, RED); } // the pilasters of the middle bay
    rail(f, bx0 + 0.75, bx1 - 0.75, WALL);
  }
  // ------------------------------------------------------------------------------------------- 4. the garden front
  const wing = (bz1 + fz1) / 2 + 0.25; // (the middle of a wing, between its two corner pilasters)
  for (const s of [-1, 1]) {
    for (const [y, apron] of floors) { win(front, zc + s * (wing - zc), y, 2, apron); win(mFront, zc + s * 3.3, y, 1, apron); }
    rail(front, s > 0 ? fz1 + 0.5 : bz0 + 0.75, s > 0 ? bz1 - 0.75 : fz0 - 0.5, WALL);
    post(mFront, zc + s * 1.9, TOP, STONE);
  }
  rail(mFront, fz0, fz1, TOP);
  win(mFront, zc, SILL[1] - 0.15, 3, 0, WIN + 0.15); // the three-light window over the porch
  // ------------------------------------------------------------------------------------------------ 5. the back
  for (const s of [-1, 1]) {
    for (const [y, apron] of floors) { win(back, s * wing, y, 2, apron); win(mBack, (rz0 + rz1) / 2 + s * 1.9, y, 2, apron); }
    rail(back, s > 0 ? mz1 + 0.1 : bz0 + 0.75, s > 0 ? bz1 - 0.75 : mz0 - 0.1, WALL);
    // a balcony under each upper window between the turrets: a floor and a front
    mBack.slab((rz0 + rz1) / 2 + s * 1.9, FLOOR + 0.2, 2.3, 0.2, 0.7, STONE);
    mBack.slab((rz0 + rz1) / 2 + s * 1.9, FLOOR + 0.4, 2.3, 0.8, 0.1, STONE, 0.6, 0);
  }
  rail(mBack, rz0 + 0.2, rz1 - 0.2, TOP);
  // where the raised middle part comes out of the roof, towards the front and the back, its parapet turns the corner
  const out = bx1 * (1 - RAISE / ROOF); // (how far from the middle the body's roof drops below the top of its walls)
  for (const f of mSides) { rail(f, out, bx1 + 0.6, TOP); rail(f, bx0 - 0.8, -out, TOP); }

  // ------------------------------------------------------------------------------------------------ 6. the porch
  const [px0, px1] = span(P, 0), [pz0, pz1] = span(P, 1), pw = pz1 - pz0, pd = px1 - px0, pzc = (pz0 + pz1) / 2, H = FLOOR - PLINTH;
  const A = F.archedWall;
  F.box(pd, PLINTH, pw, (px0 + px1) / 2, 0, pzc, RED); // its foot
  A(pw, H, 0.4, px1 - 0.2, PLINTH, pzc, STONE, [-1.2, 0, 1.2].map((along) => ({ along, width: 0.95, spring: 2.2, crown: 3.45 })), Math.PI / 2); // three pointed arches
  for (const s of [-1, 1]) {
    A(pd - 0.4, H, 0.4, (px0 + px1 - 0.4) / 2, PLINTH, pzc + s * (pw / 2 - 0.2), STONE, [{ along: 0, width: 1.6, spring: 2.2, crown: 3.45 }]); // one arch on each side
    F.box(0.5, H, 0.5, px1 - 0.21, PLINTH, pzc + s * (pw / 2 - 0.21), RED); // the corner piers
    F.box(0.5, H, 0.3, px0 + 0.25, PLINTH, pzc + s * (pw / 2 - 0.11), RED);
  }
  F.box(0.14, 0.85, pw - 0.9, px1 - 0.2, PLINTH, pzc, STONE); // the low parapet between the piers
  F.box(0.12, 3.0, 1.5, px0 + 0.05, PLINTH, pzc, DARK); // the door
  F.box(pd + 0.25, 0.5, pw + 0.4, (px0 + px1) / 2 + 0.12, FLOOR, pzc, STONE); // the balcony over it
  const ring = [[px0, pz0 - 0.2], [px1 + 0.25, pz0 - 0.2], [px1 + 0.25, pz1 + 0.2], [px0, pz1 + 0.2]];
  rail(face(ring, 'x', 1), pz0 - 0.2, pz1 + 0.2, FLOOR + 0.5, 1.0, 0.2);
  for (const s of [-1, 1]) { rail(face(ring, 'z', s), px0, px1 + 0.05, FLOOR + 0.5, 1.0, 0.2); F.box(0.34, 1.15, 0.34, px1 + 0.1, FLOOR + 0.5, pzc + s * (pw / 2 + 0.05), STONE); }

  // ------------------------------------------------------------------------------------------- 7. the two turrets
  // OSM maps them round; the photos show eight sides. Drawn eight-sided, on OSM's middle and as wide as OSM's circle.
  const inside = (pts, x, z) => { let k = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, zi] = pts[i], [xj, zj] = pts[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) k = !k; } return k; };
  for (const t of turrets) {
    const T = local(t), [tx, tz] = mid(T), flat = T.reduce((s, p) => s + Math.hypot(p[0] - tx, p[1] - tz), 0) / T.length, r = flat / Math.cos(Math.PI / 8);
    const drum = (y0, y1, grow, colour, growTop = grow) => F.cylinder(r + grow, y1 - y0, tx, y0, tz, colour, 8, r + growTop, Math.PI / 8);
    drum(0, TURRET.eaves, 0, BRICK);
    drum(0, PLINTH, 0.08, RED);
    drum(FLOOR - 0.2, FLOOR + 0.2, 0.09, STONE);
    drum(WALL - 0.55, WALL, 0.1, STONE);
    drum(TOP + 0.1, TOP + PARAPET, 0.1, STONE); // the band level with the parapet of the middle part
    drum(TURRET.eaves - 0.7, TURRET.eaves, 0.05, STONE, 0.32); // the cornice, standing out
    drum(TURRET.eaves, TURRET.top, 0.32, STONE); // its parapet, with an opening on each side
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4, sx = Math.sin(a), sz = Math.cos(a), at = (d) => [tx + sx * (flat + d), tz + sz * (flat + d)];
      const hole = (w, h, y, d) => { const [x, z] = at(d); F.box(w, h, 0.1, x, y, z, DARK, a); };
      hole(0.85, 0.5, TURRET.eaves + 0.24, 0.27);
      hole(0.5, 1.2, TOP + PARAPET + 0.12, 0.0); // the storey above the roof: a window on every side
      const [x, z] = at(0.4); if (inside(B, x, z) || inside(M, x, z)) continue; // (below, only the sides that look out)
      for (const y of SILL) hole(0.5, 1.9, y, 0.0);
    }
  }

  return { anchor: c, top: TURRET.top + 1 };
}
