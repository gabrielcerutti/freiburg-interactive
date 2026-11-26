// The Christuskirche, the Protestant church of the Wiehre, between Maienstraße, Zasiusstraße and Turnseestraße.
//
// How it is made:
//   - The footprint is OpenStreetMap's single outline (way 92130186; it has no building:parts, no height, no roof
//     tags): a cross about 36 m long and 27 m across the arms, lying north-west to south-east. Its walls are drawn
//     on that outline as it is. The outline shows what the ground plan printed in 1898 shows («Freiburg im
//     Breisgau. Die Stadt und ihre Bauten», p. 405): the tower standing a little out of the middle of the entrance
//     front (about 7.1 m wide), a nave, two arms with three-sided ends near the choir, and a three-sided choir.
//     The tower is at the south-east end, as the German Wikipedia says («Südostturm»).
//   - What the photos show, and is made by hand on that outline (all on Wikimedia Commons):
//       · the plate of 1898 in that book («Freiburg Bauten b 404»; one of the place's photos): two rows of
//         openings, small ones below and tall round-headed ones above; a cornice; low hipped roofs, the arm's roof
//         many-sided; the tower square up to a gallery with a balustrade just above the ridge, then a stage with the
//         clock, an eight-sided belfry with tall openings, a low arcaded stage and an eight-sided spire with a cross;
//       · the front in 2017 («Christuskirche (Freiburg im Breisgau) jm26448», joergens.mi; one of the place's
//         photos): the tower in the middle of the front, the arched door at the top of a flight of steps, the statue
//         in its niche above it, two windows in an arched recess higher up, the blue clock, the green spire; on each
//         side of the tower one round-headed window over a round one; yellowish stone on a red plinth;
//       · the side in 2023 («Freiburg-Wiehre, Christuskirche (1)», Cmcmcm1): the three-sided arm with a tall
//         window in each face and pairs of small ones below, a door beside it, dark slate roofs;
//       · from the air in 1982 («Freiburg: Christuskirche», Willy Pragher; one of the place's photos): the ridge
//         running from the tower to the choir, the arms' roofs lower, the choir's roof three-sided;
//       · from the Lorettoberg in 2017 («Lorettoberg-Ansichten (Freiburg im Breisgau) jm54241», joergens.mi): the
//         tower from far away, nearly without perspective — the proportions of its stages are read off this one.
//
// ASSUMED: EVERY HEIGHT. No source read gives one, not even for the tower. They are read off those photographs,
// scaled by the width of OSM's outline (the front 18.2 m, the tower 7.1 m): the eaves 12.5 m, the ridge 16.5 m, the
// tower's gallery 21.5 m, the foot of the spire 40 m, its tip 62 m, the top of the cross 64.6 m. Also assumed: the
// pitch of the roofs; the size and place of every opening, and how many there are on each wall (one tall window for
// about every 4.6 m of wall); that both long sides are alike (the photos show one) and that both have a door by the
// choir; the windows of the choir's end, which no photo read shows; a clock on all four sides of the tower (the
// photos show three); the tower's sides above the roof, drawn like its front, and its back, drawn blank; the
// balustrade's spacing; the colours. Not modelled: the chimney on the choir's roof, the tracery of the windows, the
// pediments over the doors.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { orientedBox, shrunk } from '../buildings.js';

export const PLACE = {
  key: 'christuskirche',
  name: 'Christuskirche',
  localName: 'Christ Church',
  kind: 'building',
  built: { from: 1889, to: 1891 }, // de.wikipedia: «wurde 1889 bis 1891 … errichtet und am 31. Mai 1891 eingeweiht»
  // The year of the consecration (German Wikipedia; Bernd Martin: «Die am 31.Mai 1891 eingeweihte Christuskirche»).
  // The book of 1898 says «1890 vollendet», the German Wikipedia's list of churches «1888–1891»: the card says so.
  // Not there at the stop of 1875; the plan of 1903 shows it («Ev. Christus-Kirche»).
  since: 1891,
  // No written account of the church in the raid was found: the state rests on the city's damage map alone.
  war: { state: 'damaged', rebuilt: null, source: 'City of Freiburg, damage map after the air raid of 27 November 1944 (the viewer’s «Nov 1944» plan): the church is marked blue, which its legend gives as light to medium damage, habitable. No written account was found; German Wikipedia, «Wiehre»: «Vom Zweiten Weltkrieg blieb die Wiehre weitgehend verschont, lediglich in Innenstadtnähe wurden einige Häuser beschädigt»' },
  coordinates: [47.987238, 7.849203], // de.wikipedia «Christuskirche (Freiburg im Breisgau)», geo data (Wikidata Q1087311 has the same)
  osm: 'w92130186',
  // (no `checks`: no source read gives a height or a length to check the model against)
  sources: [
    'German Wikipedia, «Christuskirche (Freiburg im Breisgau)»: «wurde 1889 bis 1891 nach Entwürfen des Architekten Ludwig Diemer errichtet und am 31. Mai 1891 eingeweiht»; the town gave the plot at the corner of Zasiusstraße and Turnseestraße for nothing and wished for a «schönen, hohen und weithin sichtbaren Turm» (quoted there after Gudrun Matys, «Schauinsland» 111, 1992, p. 105); the first design by the «Großherzoglichen Bauinspektor Knoderer» was brought down by «Kirchenbaurat Ludwig Diemer»; «1889 legte der Erbgroßherzog den Grundstein»; a cross-shaped plan, «polygonale Raumabschlüsse von Chor und Querarmen», «Emporenkirche mit in den Bau hineingezogenem Südostturm», the tower’s «obere Geschosse aus dem quadratischen Grundriss ins Achteck überleiten»; «Die Stilformen sind der italienischen Renaissancearchitektur entnommen»; «grünen Sandstein»; the statue of Christ over the door by Julius Seitz, 1891; three bells cast in 1954; the tower renovated in 2004 and 2005; closed for renovation from June 2015, reopened on 19 November 2016; the parish and the «Freiburger Kreis»; coordinates 47.987238 N, 7.849203 E',
    '«Freiburg im Breisgau. Die Stadt und ihre Bauten» (Badischer Architekten- und Ingenieur-Verband, 1898), «Die Pfarrkirchen der Vorstädte», pp. 404–405 (German Wikisource): «wurde nach den Plänen des Baurathes Diemer in Karlsruhe erbaut und 1890 vollendet. Die Baukosten betrugen 170,000 Mk. … Der Aufwand für Orgel, Glocken und Uhr betrug 17,000 Mk.; mithin die Gesammtkosten 187,000 Mk. Die Zahl der Sitzplätze beträgt 1080. Die gesammten Baukosten wurden von der evangelischen Gemeinde durch freiwillige Beträge aufgebracht. Die Kirche ist ein Centralbau mit Chorumgang auf der Empore»; its ground plan (p. 405) and its plate of the church (p. 404). It gives no height',
    'German Wikipedia, «Liste von Sakralbauten in Freiburg im Breisgau»: the church, «1888–1891»',
    'Bernd Martin, «Kulturdenkmal Ensemble Christuskirche – Maienstraße 2. Historischer Abriss» (the page of the friends of the parish house, read in the Internet Archive’s copy of 2016): «Die am 31.Mai 1891 eingeweihte Christuskirche in der Wiehre, das zweite evangelische Gotteshaus nach der Ludwigskirche»; the parish as a centre of the Bekennende Kirche; the professors of the «Freiburger Kreis» speaking at its «Bekenntnisabenden»',
    'German Wikipedia, «Ludwig Diemer»: 1828–1894, of the Protestant church building office in Karlsruhe; the Christuskirche in Freiburg among the new churches built under him',
    'orgel-verzeichnis.de, «Freiburg im Breisgau / Wiehre – Christuskirche»: «1889 wird der Grundstein gelegt. 1891 Einweihung der Christuskirche, welche unter der Leitung von Ludwig Diemer … mit 1080 Sitzplätzen erbaut wurde»',
    'City of Freiburg, damage map of the air raid of 27 November 1944 (1:10,000; the viewer’s «Nov 1944» plan, whose legend reads black, heavy damage to total loss, not habitable; blue, light to medium damage, habitable): the church is marked blue. None of the pages read (German Wikipedia on the church, on the Wiehre and on the raid, Bernd Martin’s outline, the parish’s page) says what the raid did to it',
    'City of Freiburg, plan of 1903 (the viewer’s «1903» plan): the church drawn on its plot and lettered «Ev. Christus-Kirche»',
    'Wikimedia Commons, «Freiburg Bauten b 404» (plate from the book of 1898, public domain): the church from the side — two rows of openings, the roofs, the stages of the tower',
    'Wikimedia Commons, «Christuskirche (Freiburg im Breisgau) jm26448» (joergens.mi, 2017, CC BY-SA 3.0): the entrance front — the tower, the door, the statue, the clock, the colours',
    'Wikimedia Commons, «Freiburg-Wiehre, Christuskirche (1)» (Cmcmcm1, 2023, CC BY-SA 4.0): one long side — the three-sided arm, the windows, a door, the slate roofs',
    'Wikimedia Commons, «Freiburg: Christuskirche» (Willy Pragher, 3 June 1982, Landesarchiv Baden-Württemberg, Staatsarchiv Freiburg W 134 Nr. 118372, CC BY 4.0): the roofs from the air',
    'Wikimedia Commons, «Lorettoberg-Ansichten (Freiburg im Breisgau) jm54241» (joergens.mi, 2017, CC BY-SA 3.0): the tower from far away, for the proportions of its stages',
    'OpenStreetMap, way 92130186 «Christuskirche» (building=church, Maienstraße 5, wikidata Q1087311): the outline. No parts, no heights, no roof',
  ],
  assumptions: [
    'every height — no source read gives one: the walls (12.5 m to the eaves), the ridge (16.5 m), the tower’s gallery (21.5 m), the foot of the spire (40 m), its tip (62 m) and the cross (to 64.6 m) are read off photographs, scaled by the width of the OSM outline',
    'the pitch and exact shape of the roofs',
    'the size and place of every opening, and how many each wall has',
    'that the two long sides are alike (the photos show one), with a door by the choir on both',
    'the windows of the choir’s end, which none of the photos read shows',
    'the tower: a clock on all four sides (the photos show three), its sides above the roof drawn like its front, its back blank, the spacing of the balustrade',
    'the colours; the tracery of the windows, the pediments over the doors and the chimney on the choir’s roof are left out',
  ],
  card: {
    title: 'Christuskirche',
    years: '1889 – 1891',
    text: [
      'The second Protestant church of Freiburg, after the Ludwigskirche, was built for the growing parish of the Wiehre. The town gave the plot for nothing and asked in return for a «fine, tall tower, visible from afar». The hereditary grand duke laid the foundation stone in 1889, and the church was consecrated on 31 May 1891. The book on the town’s buildings of 1898 says it was finished in 1890; the German Wikipedia’s list of churches gives 1888 to 1891.',
      'Ludwig Diemer, of the Protestant church building office in Karlsruhe, drew the plans, after bringing down a first design by the building inspector Knoderer. The forms are taken from the Italian Renaissance and the stone is a green sandstone, not the red one of the Münster. The plan is a cross with many-sided ends; the galleries inside show outside as two rows of windows. The building cost 170,000 marks, and 187,000 with the organ, the bells and the clock, all of it given by the parish. It had 1,080 seats. The statue of Christ over the door is by Julius Seitz, of 1891.',
      'In the 1930s the parish was a centre of the Confessing Church, and the professors of the resistance group known as the Freiburger Kreis spoke at its evenings.',
      'The city’s damage map of the air raid of 27 November 1944 marks the church with light to medium damage; no written account of it was found. The three bells were cast in 1954. The tower was renovated in 2004 and 2005, the church in 2015 and 2016.',
      'The outline is OpenStreetMap’s. No source read gives a height, not even the tower’s: all heights (the spire is drawn 62 metres to its tip), the roofs and every window are read off photographs. The two long sides are drawn alike, and the end of the choir, which those photos do not show, is drawn like the rest.',
    ],
  },
};

const STONE = '#cfc092', LIGHT = '#e2d8b6', RED = '#a8715f', SLATE = '#565c66', COPPER = '#6c9c72', DARK = 'OPENING';
const CLOCK = '#2d4a92', GOLD = '#b99b4b', WHITE = '#efe9da', STEP = '#b3a48f';
// heights in metres above the ground — ALL ASSUMED, read off the photographs (see the top of the file)
const PLINTH = 1.0, COURSE = 6.0, EAVES = 12.5, RIDGE = 16.5, ARM_RIDGE = 15.0;
const LOW = { sill: 2.5, h: 1.5, w: 0.5 }, TALL = { sill: 7.0, h: 4.2, w: 1.5 }, BAY = 4.6;
const GALLERY = 21.5, RAIL = 1.05, CLOCK_TOP = 27.5, BELFRY_TOP = 37.3, SPIRE_FOOT = 40, SPIRE_TIP = 62, CROSS_TOP = 64.6;
// the plan, in the church's own metres (x from the entrance front towards the choir, z to the right) — READ OFF OSM's outline
const HALF = 8.9;                                       // half the width of the nave and the choir (9.1 at the front)
const TOWER = { front: -1.3, w: 7.1 };                  // the tower: how far it stands out of the front, and its width
const ARM = { x0: 14.2, x1: 25.3, shoulder: 10.8, endX0: 17.4, endX1: 22.9, end: 13.5 }; // one arm and its three-sided end
const CHOIR = { cant: 30.4, end: 34.7, endHalf: 4.2 };  // where the choir's slanted sides begin, and its end wall
const OVER = 0.35;                                      // how far the roofs reach over the walls

/** a flat opening with a round head, facing +z, its foot centred on the origin */
function arched(w, h) {
  const r = w / 2, s = new THREE.Shape();
  s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r); s.absarc(0, h - r, r, 0, Math.PI, false); s.lineTo(-r, 0);
  return new THREE.ShapeGeometry(s, 5);
}

export function build(kit, parts) {
  const b = parts.find((p) => p.id === PLACE.osm);
  if (!b) throw new Error('Christuskirche: its OSM outline is missing from city.json');
  const ring = b.rings[0], n = ring.length;

  // ------------------------------------------------------------------------------------------- the church's frame
  // The long axis: the direction of the long walls (the box around the outline is a couple of degrees off, pulled
  // by the slanted sides). It points from the end where the outline is wide (the front) to where it is narrow (the choir).
  const box = orientedBox(ring), a0 = Math.atan2(box.u[1], box.u[0]); let sum = 0, weight = 0;
  ring.forEach((p, i) => {
    const q = ring[(i + 1) % n], len = Math.hypot(q[0] - p[0], q[1] - p[1]); if (len < 2.5) return;
    let d = Math.atan2(q[1] - p[1], q[0] - p[0]) - a0; d -= Math.round(d / (Math.PI / 2)) * (Math.PI / 2);
    if (Math.abs(d) < 0.3) { sum += d * len; weight += len; }
  });
  const a = a0 + sum / weight; let u = [Math.cos(a), Math.sin(a)];
  const along = (w) => ring.map((p) => [(p[0] - box.c[0]) * w[0] + (p[1] - box.c[1]) * w[1], (p[0] - box.c[0]) * -w[1] + (p[1] - box.c[1]) * w[0]]);
  const span = (pts, k) => [Math.min(...pts.map((p) => p[k])), Math.max(...pts.map((p) => p[k]))];
  const widthAt = (pts, end) => { const [z0, z1] = span(pts.filter((p) => Math.abs(p[0] - end) < 2.5), 1); return z1 - z0; };
  { const pts = along(u), [x0, x1] = span(pts, 0); if (widthAt(pts, x0) < widthAt(pts, x1)) u = [-u[0], -u[1]]; }
  const v = [-u[1], u[0]], rough = along(u), [z0, z1] = span(rough, 1), zMid = (z0 + z1) / 2;
  const front = Math.min(...rough.filter((p) => Math.abs(p[1] - zMid) > 7).map((p) => p[0])); // (the front wall beside the tower)
  const c = [box.c[0] + u[0] * front + v[0] * zMid, box.c[1] + u[1] * front + v[1] * zMid];
  const angle = Math.atan2(-u[1], u[0]);
  const F = kit.frame({ x: c[0], z: c[1], angle }), P = kit.frame({ x: c[0], z: c[1], angle, kind: KIND.PLAIN });
  const L = ring.map(([x, z]) => [(x - c[0]) * u[0] + (z - c[1]) * u[1], (x - c[0]) * v[0] + (z - c[1]) * v[1]]); // the outline, in the church's metres
  const at = (x, y, z) => { const [wx, wz] = F.toWorld(x, z); return [wx, y, wz]; };
  /** a flat shape hung on a wall: its foot at (x, y, z), looking along (nx, nz), `off` metres out of the wall */
  const hang = (frame, geometry, colour, x, y, z, nx, nz, off = 0.07) =>
    frame.put(geometry, colour, new THREE.Matrix4().makeTranslation(x + nx * off, y, z + nz * off).multiply(new THREE.Matrix4().makeRotationY(Math.atan2(nx, nz))));

  // ------------------------------------------------------------------------------- 1. the walls, on OSM's outline
  const solid = (o) => kit.osm([{ ...b, levels: null, roofLevels: null, roofShape: 'flat', roofHeight: 0, colour: STONE, roofColour: SLATE, ...o }], { walls: KIND.STONE, roof: KIND.PLAIN });
  const band = (y0, y1, out, colour) => solid({ id: `${b.id}-${y0}`, rings: shrunk(b.rings, -out), minHeight: y0, height: y1, colour, roofColour: colour });
  solid({ height: EAVES });
  band(0, PLINTH, 0.1, RED);                    // the plinth, red sandstone
  band(COURSE - 0.15, COURSE + 0.2, 0.12, LIGHT); // the course between the two rows of windows
  band(EAVES - 0.75, EAVES - 0.04, 0.28, LIGHT); // the cornice

  // ------------------------------------------------------------------------------------------------ 2. the openings
  // Along every wall of the outline that is long enough: tall round-headed windows above, pairs of small ones
  // below (their number and size: ASSUMED). The front is done with the tower, further down.
  const inside = (x, z) => { let k = false; for (let i = 0, j = n - 1; i < n; j = i++) { const [xi, zi] = L[i], [xj, zj] = L[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) k = !k; } return k; };
  L.forEach((p, i) => {
    const q = L[(i + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz); if (len < 3.4) return;
    let nx = dz / len, nz = -dx / len; const mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
    if (inside(mx + nx * 0.3, mz + nz * 0.3)) { nx = -nx; nz = -nz; }
    if (mx < 3 && nx < -0.9) return; // (the entrance front)
    const door = mx > ARM.x1 && mx < CHOIR.cant && Math.abs(nz) > 0.9; // (the short wall between an arm and the choir's slant)
    const count = Math.max(1, Math.round(len / BAY));
    for (let k = 0; k < count; k++) {
      const t = (k + 0.5) / count, x = p[0] + dx * t, z = p[1] + dz * t;
      hang(F, new THREE.PlaneGeometry(TALL.w + 0.5, TALL.h + 0.45).translate(0, (TALL.h + 0.45) / 2, 0), LIGHT, x, TALL.sill - 0.2, z, nx, nz, 0.04); // its frame
      hang(F, arched(TALL.w, TALL.h), DARK, x, TALL.sill, z, nx, nz);
      if (door) { hang(F, new THREE.PlaneGeometry(2.3, 3.6).translate(0, 1.8, 0), LIGHT, x, PLINTH, z, nx, nz, 0.04); hang(F, arched(1.5, 3.0), DARK, x, PLINTH, z, nx, nz); continue; }
      for (const s of [-1, 1]) hang(F, arched(LOW.w, LOW.h), DARK, x + (dx / len) * s * 0.45, LOW.sill, z + (dz / len) * s * 0.45, nx, nz);
    }
  });

  // ---------------------------------------------------------------------------------------------------- 3. the roofs
  // Slate, hipped, low: one ridge from behind the tower to the choir, whose end it closes in three faces; over each
  // arm a lower roof that runs into it, closed in three faces too.
  const slate = new THREE.Color(SLATE), TILES = [1e4, -1e4, 0.4, KIND.TILES], up = [0, 1, 0]; // (no ridge or eaves shading: the shader measures those from the ground)
  const slope = (...p) => { for (let i = 1; i < p.length - 1; i++) kit.mesher.tri(at(...p[0]), at(...p[i]), at(...p[i + 1]), slate, up, TILES); };
  const E = EAVES, w = HALF + 0.2 + OVER, pitch = (RIDGE - EAVES) / w, endX = CHOIR.end + OVER, endHalf = CHOIR.endHalf + OVER;
  const A = [-OVER + w, RIDGE, 0], B = [endX - w, RIDGE, 0]; // the two ends of the ridge
  for (const s of [-1, 1]) {
    const f0 = [-OVER, E, s * w], f1 = [endX - (w - endHalf), E, s * w], f2 = [endX, E, s * endHalf];
    slope(f0, f1, B, A);                                   // a long side
    slope(f1, f2, B);                                      // a slanted side of the choir
    if (s > 0) { slope([-OVER, E, -w], f0, A); slope(f2, [endX, E, -endHalf], B); } // the front (the tower stands in it) and the choir's end
    // the arm on this side
    const xm = (ARM.x0 + ARM.x1) / 2, reach = ARM.end + OVER, half = (ARM.x1 - ARM.x0) / 2 + OVER;
    const top = [xm, ARM_RIDGE, s * (reach - half)], meet = [xm, ARM_RIDGE, s * (w - (ARM_RIDGE - EAVES) / pitch)]; // its ridge, from over its end to where it meets the big roof
    const eaves = [[ARM.x0 - OVER, w], [ARM.x0 - OVER, ARM.shoulder + OVER], [ARM.endX0 - 0.15, reach], [ARM.endX1 + 0.15, reach], [ARM.x1 + OVER, ARM.shoulder + OVER], [ARM.x1 + OVER, w]].map(([x, z]) => [x, E, s * z]);
    for (let i = 0; i < eaves.length - 1; i++) slope(eaves[i], eaves[i + 1], top);
    slope(eaves[0], top, meet); slope(eaves[5], meet, top);
  }

  // ---------------------------------------------------------------------------------------------------- 4. the tower
  // Square on OSM's projection up to the gallery; above it a stage with the clock, its corners cut; then eight sides:
  // the belfry, a low arcaded stage, the spire. Every height ASSUMED (the proportions: the photo from the Lorettoberg).
  const tw = TOWER.w, tx = TOWER.front + tw / 2, th = tw / 2;
  const faces = [[-1, 0], [0, 1], [0, -1], [1, 0]]; // (the front first)
  F.box(tw + 0.1, GALLERY, tw + 0.1, tx, 0, 0, STONE);
  F.box(tw + 0.3, PLINTH, tw + 0.3, tx, 0, 0, RED);
  F.box(tw + 0.34, 0.35, tw + 0.34, tx, COURSE - 0.15, 0, LIGHT);
  F.box(tw + 0.66, 0.71, tw + 0.66, tx, EAVES - 0.75, 0, LIGHT);          // the church's cornice, carried round the tower
  F.box(tw + 0.7, 0.8, tw + 0.7, tx, GALLERY - 0.8, 0, LIGHT);            // the cornice under the gallery
  P.box(tw + 1.2, 0.25, tw + 1.2, tx, GALLERY, 0, LIGHT);                 // the gallery's floor
  const g = th + 0.45, top = GALLERY + 0.25;                              // its balustrade: a foot, a rail, balusters, corner posts
  for (const [nx, nz] of faces) {
    const bar = (h, y, t) => P.box(nx ? t : 2 * g, h, nx ? 2 * g : t, tx + nx * g, y, nz * g, WHITE);
    bar(0.16, top, 0.3); bar(0.14, top + RAIL - 0.14, 0.3);
    for (let k = -7; k <= 7; k++) P.box(0.16, RAIL - 0.3, 0.16, tx + nx * g + (nx ? 0 : k * 0.5), top + 0.16, nz * g + (nx ? k * 0.5 : 0), WHITE);
    P.box(0.42, RAIL + 0.15, 0.42, tx + (nx || nz) * g, top, (nx ? -nx : nz) * g, WHITE);
  }
  // on the square part: the front has the door, the statue and two windows in the upper stage; the sides, the two windows
  for (const [nx, nz] of faces.slice(0, 3)) for (const s of [-1, 1]) hang(F, arched(0.8, 2.7), DARK, tx + nx * (th + 0.05) + nz * s * 0.8, 15.4, nz * (th + 0.05) + nx * s * 0.8, nx, nz);
  const fx = tx - th - 0.05;
  hang(F, new THREE.PlaneGeometry(3.7, 5.5).translate(0, 2.75, 0), LIGHT, fx, PLINTH, 0, -1, 0, 0.05); // the frame of the door
  F.box(0.5, 0.35, 4.2, fx - 0.2, PLINTH + 5.5, 0, LIGHT);                                            // and the ledge over it
  hang(F, arched(2.3, 4.3), DARK, fx, PLINTH + 0.1, 0, -1, 0, 0.09);                                   // the door
  hang(F, new THREE.PlaneGeometry(2.2, 3.7).translate(0, 1.85, 0), LIGHT, fx, 7.1, 0, -1, 0, 0.05);    // the niche over it
  hang(F, arched(1.3, 3.0), DARK, fx, 7.4, 0, -1, 0, 0.09);
  P.box(0.35, 1.9, 0.55, fx - 0.2, 7.5, 0, WHITE);                                                     // the statue of Christ
  for (const k of [0, 1, 2]) F.box(1.0, PLINTH - k * 0.33, tw + 1.5 + k * 1.2, fx - 0.5 - k * 1.0 + 0.05, 0, 0, STEP); // the steps
  // on each side of the tower, in the front wall: a round-headed window over a round one
  for (const s of [-1, 1]) {
    const z = s * (th + (HALF + 0.2 - th) / 2);
    hang(F, new THREE.PlaneGeometry(1.8, 3.6).translate(0, 1.8, 0), LIGHT, 0, 7.2, z, -1, 0, 0.04);
    hang(F, arched(1.3, 3.1), DARK, 0, 7.4, z, -1, 0);
    hang(F, new THREE.CircleGeometry(0.6, 12).translate(0, 0.6, 0), DARK, 0, 3.6, z, -1, 0);
  }
  // the stage with the clock
  const ch = 2.95, cut = 0.95, octagon = (h, k) => [[h, -h + k], [h, h - k], [h - k, h], [-h + k, h], [-h, h - k], [-h, -h + k], [-h + k, -h], [h - k, -h]].map(([x, z]) => [tx + x, z]);
  F.prism(octagon(ch, cut), top - 0.05, CLOCK_TOP, STONE);
  F.prism(octagon(ch + 0.25, cut + 0.1), CLOCK_TOP, CLOCK_TOP + 0.5, LIGHT);
  for (const [nx, nz] of faces) {
    hang(P, new THREE.CircleGeometry(1.3, 20).translate(0, 1.3, 0), LIGHT, tx + nx * ch, 23.3, nz * ch, nx, nz, 0.05);
    hang(P, new THREE.CircleGeometry(1.08, 20).translate(0, 1.08, 0), CLOCK, tx + nx * ch, 23.52, nz * ch, nx, nz, 0.09);
    hang(F, arched(0.5, 0.9), DARK, tx + nx * ch, top + 0.2, nz * ch, nx, nz);
  }
  // the belfry and the arcaded stage, eight-sided: `ap` is the distance from the middle to the middle of a side
  const eight = (frame, ap, y0, y1, colour, apTop = ap) => frame.cylinder(ap / Math.cos(Math.PI / 8), y1 - y0, tx, y0, 0, colour, 8, apTop / Math.cos(Math.PI / 8), Math.PI / 8);
  const bf = 2.7, belfry = CLOCK_TOP + 0.5;
  eight(F, bf, belfry, BELFRY_TOP, STONE);
  eight(F, bf + 0.25, BELFRY_TOP, BELFRY_TOP + 0.4, LIGHT);
  eight(F, bf, BELFRY_TOP + 0.4, SPIRE_FOOT - 0.6, STONE);
  eight(F, bf + 0.05, SPIRE_FOOT - 0.6, SPIRE_FOOT, LIGHT, bf + 0.45);    // the cornice under the spire
  for (let k = 0; k < 8; k++) {
    const t = (k * Math.PI) / 4, nx = Math.cos(t), nz = Math.sin(t);
    hang(F, arched(1.25, 5.7), DARK, tx + nx * bf, belfry + 1.3, nz * bf, nx, nz);
    for (const s of [-1, 0, 1]) hang(F, arched(0.32, 1.0), DARK, tx + nx * bf - nz * s * 0.55, BELFRY_TOP + 0.75, nz * bf + nx * s * 0.55, nx, nz);
  }
  // the spire: copper gone green, eight-sided, with four small gabled openings at its foot; a ball and a cross on top
  const sp = bf + 0.3;
  P.pyramid(sp / Math.cos(Math.PI / 8), SPIRE_TIP - SPIRE_FOOT, tx, SPIRE_FOOT, 0, COPPER, 8, Math.PI / 8);
  for (const [nx, nz] of faces) {
    const d = sp - 0.55;
    P.box(nx ? 0.7 : 0.75, 1.1, nx ? 0.75 : 0.7, tx + nx * d, SPIRE_FOOT + 0.2, nz * d, COPPER);
    P.pyramid(0.62, 0.8, tx + nx * d, SPIRE_FOOT + 1.3, nz * d, COPPER, 4, Math.PI / 4);
    hang(P, arched(0.4, 0.8), DARK, tx + nx * (d + 0.36), SPIRE_FOOT + 0.35, nz * (d + 0.36), nx, nz, 0.03);
  }
  P.cylinder(0.38, 0.7, tx, SPIRE_TIP - 0.25, 0, GOLD, 8);
  P.beam([tx, SPIRE_TIP + 0.4, 0], [tx, CROSS_TOP, 0], 0.14, GOLD);
  P.beam([tx, CROSS_TOP - 0.75, -0.6], [tx, CROSS_TOP - 0.75, 0.6], 0.14, GOLD);

  return { anchor: F.toWorld((CHOIR.end + TOWER.front) / 2, 0), top: CROSS_TOP };
}
