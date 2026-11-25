// The Brauerei Ganter, the brewery in the Oberau between Schwarzwaldstraße and the Dreisam, on the site it has had
// since 1877 — drawn with the buildings that stand there today, at every stop of the timeline.
//
// How it is made:
//   - The plan is OpenStreetMap's, two outlines:
//       · relation 7509071, «Brauerei Ganter», Schwarzwaldstraße 43: one outline, about 67 × 50 m, for the whole
//         block of old buildings west of the yard. OSM maps nothing inside it;
//       · way 766716133, without a name: the block north of the yard, towards the Dreisam. That it is the brewery's is
//         read off the photos, not off OSM: the photo taken through the gate of no. 43 («Landappbw 422990 …», 2021)
//         shows, straight ahead across the yard, the front lettered «Brauerei Ganter» and the tall tower behind it,
//         and the coordinates of the German Wikipedia's article fall inside this outline.
//   - Neither outline says where one building ends and the next begins, nor how tall anything is. What stands where
//     inside them is put together by eye from photos (all on Wikimedia Commons):
//       · «Brauerei Ganter» (Martin Röll, 25 May 2007), from above, from the north: from east to west a block under a tall
//         hipped roof, the square tower lettered «Ganter» with glazed storeys on top, a flat roof with steel stacks
//         and a round tank, the brick chimney, and the tower with a stepped slate roof and a pointed cap;
//       · «Freiburg: Vom Schlossberg auf Ganter Brauerei» (Willy Pragher, 14 July 1976): much the same view thirty
//         years earlier, from the Schlossberg as its title says, with a stepped gable below the chimney;
//       · «Landappbw 422990 …» (Klemens Maier, 2021), through the gate: on the left a long yellow range of three
//         storeys with the slate-roofed tower behind it, the chimney, the lettered front with four tall windows and
//         a low white pavilion before it, the tall tower behind. The directions in which these stand from the gate
//         are what places the tower, the chimney and the slate-roofed tower inside the outlines;
//       · «Brauerei Ganter in Freiburg» and «… 2» (Andreas Schwarzkopf, 11 April 2015): the yard from the east and
//         from the south — a front with red pilasters and the words «Brauerei Ganter» on its parapet, next to it a
//         taller block under a hipped tile roof; yellow walls, red-brown cornices;
//       · «Landappbw 665598 …» (Judith Zimmermann, 2022), from the bank of the Dreisam: the stepped gable lettered
//         «Brauerei Ganter» on a tiled range, the chimney behind it with a platform half way up, the tower;
//       · «Freiburg, Wiehre: Schwarzwaldstraße, Talstraße, Ganter-Brauerei, von Süden» (Willy Pragher, 8 September
//         1976), from the air: gabled roofs around the slate-roofed tower.
//   - The walls with rows of windows are painted by the viewer, as on the houses of the city.
//
// ASSUMED: nearly everything but the two outlines. Where each building stands inside them and how far it reaches;
// every height (the tower 34 m and 39 m with its top storeys, the chimney 40 m, the slate-roofed tower 30 m, the
// ranges 8 to 19 m to the eaves: by eye from the photos, none measured); the roofs of the west block (three gabled
// ranges and a hipped one: only the air photo of 1976 hints at them); what each building is for (the photos do not
// say; a roof like the stepped slate one usually sits on a malt kiln, but no source read here says so of this one);
// the windows; the colours. Not drawn: the lettering and the painted signs, the loading canopies, the hop shed, the
// tanks, the gate. The same buildings are drawn at every stop from 1903 on, although some are far newer than that.
//
// The war: the sources read give no damage to the brewery in the raid of 27 November 1944 (which destroyed its
// house in Schiffstraße, in the old town); they give the night of 2 December 1944, when workshops, the office
// building and the stables were destroyed. So PLACE carries no `war` field (that field is about 27 November); the
// card tells it.

import { KIND } from '../kit.js';
import { shrunk } from '../buildings.js';

export const PLACE = {
  key: 'brauerei-ganter',
  name: 'Brauerei Ganter',
  localName: 'Ganter brewery',
  kind: 'group',
  // de.wikipedia: founded 1865 in Schiffstraße 7; «Im Jahr 1877 schließlich erwarb Ganter ein Gelände in der
  // Freiburger Oberau, die Alte Ölmühle»; «Bis 1877 wurde in diesem Haus [Schiffstraße] das Bier … gebraut».
  built: { from: 1877, extended: [1970, 1980], rebuilt: 2011 },
  // 1877 is the year the site was bought and the year brewing in the old town ended (both the German Wikipedia; the
  // brewery's own history says the same of the purchase). In which year the first buildings here were finished, no
  // source read says. For the timeline it makes no difference: not there at the stop of 1875, there at that of 1903.
  since: 1877,
  coordinates: [47.990278, 7.860278], // de.wikipedia «Brauerei Ganter», the article's coordinates: 47° 59′ 25″ N, 7° 51′ 37″ E
  osm: 'r7509071',
  sources: [
    'German Wikipedia, «Brauerei Ganter»: founded in 1865 by Ludwig «Louis» Ganter, an innkeeper’s son from Schönau im Schwarzwald, in the house «Zum Kindlein Jesu», Schiffstraße 7; «Bis 1877 wurde in diesem Haus das Bier … gebraut»; «Im Jahr 1877 schließlich erwarb Ganter ein Gelände in der Freiburger Oberau, die Alte Ölmühle … Das Gelände befand sich damals „auf der grünen Wiese“ außerhalb der Stadt»; a deep well and a power station of its own; «1883 bekam die Brauerei eine Kältemaschine»; a steam turbine in the 1920s; «zwischen 1970 und 1980 wurde die Braustätte … ausgebaut»; a new fermenting and storage cellar and keg filling in 2011; a third of the site sold in September 2021 for flats, the west part «mit Mälzerei, Kesselhaus, Villa, Biergarten und Ballhaus» to stay with the family; the coordinates (47° 59′ 25″ N, 7° 51′ 37″ E)',
    'German Wikipedia, the same article, citing Gerd R. Ueberschär, «Freiburg im Luftkrieg 1939–1945» (1990), p. 287 (the book itself was not read): «nachdem durch den Fliegerangriff vom 27. November 1944 das Stammhaus der Brauerei in der Altstadt zerstört und am 2. Dezember 1944 die Brauereianlagen beschädigt worden waren, konnte die Brauerei zunächst weiter produzieren und dank ihrer autonomen Turbinen-Stromversorgung auch die Anwohner mit frischem Trinkwasser versorgen»',
    'Brauerei Ganter, «Historie» (ganter.com/brauerei-ganter/historie/): «Der 28. August 1865 ist die Geburtsstunde der Brauerei»; «1877 kauft die … Brauerei GANTER das Areal „Alte Ölmühle“ weit vor der Stadt: Zwischen Dreisam und Schwarzwaldstraße entstehen die Produktionsstätten und die herrschaftliche Villa»; «In der Nacht vom 2. Dezember 1944 zerstört ein Luftangriff die Werkstätten, das Verwaltungsgebäude und den Pferdestall. Viele Freiburger pilgern zum intakten Brunnen der Brauerei»; the new works opened on 22 January 2011, «erbaut an eben der Stelle, an der bereits Firmengründer Ludwig Ganter über 130 Jahre zuvor seinen Gärkeller errichtet hatte»; bottling in the old fermenting cellar from early 2016',
    'Wikimedia Commons, «Brauerei Ganter» (Martin Röll, 25 May 2007, CC BY-SA 2.0) and «Freiburg: Vom Schlossberg auf Ganter Brauerei» (Willy Pragher, 14 July 1976, Landesarchiv Baden-Württemberg, CC BY 4.0): the brewery from above, from the north (the second from the Schlossberg, as its title says) — the tower, the chimney, the stacks, the stepped slate roof, the hipped block; how tall they stand against each other',
    'Wikimedia Commons, «Landappbw 422990 1823 Brauerei Brauerei Ganter Freiburg» (Klemens Maier, 2021, CC0): the view through the gate of Schwarzwaldstraße 43, from which the places of the tower, the chimney and the slate-roofed tower inside the outlines are worked out',
    'Wikimedia Commons, «Brauerei Ganter in Freiburg» and «Brauerei Ganter in Freiburg 2» (Andreas Schwarzkopf, 11 April 2015, CC BY-SA 3.0): the yard — the front with red pilasters, the block with the hipped roof, the lettered front with the tower behind it, the colours',
    'Wikimedia Commons, «Landappbw 665598 1822 Ganter Brauerei Ganter Brauerei Freiburg» (Judith Zimmermann, 2022, CC0), described there as «Rückseite der Brauerei vom Dreisamufer»: the stepped gable, the chimney with its platform, the tower; and «Freiburg, Wiehre: Schwarzwaldstraße, Talstraße, Ganter-Brauerei, von Süden» (Willy Pragher, 8 September 1976, CC BY 4.0): the roofs from the air',
    'OpenStreetMap, relation 7509071 («Brauerei Ganter», Schwarzwaldstraße 43, wikidata Q323969) and way 766716133 (no name): the two outlines. OSM gives no heights, levels or roofs for either',
  ],
  assumptions: [
    'the model shows the buildings of today (as in photos of 2007 to 2022) at every stop of the timeline from 1903 on: how the brewery looked in 1903, 1920 or 1944 is not drawn, and parts of it are much newer (the works were extended between 1970 and 1980 and rebuilt in 2010–11)',
    'that the unnamed outline north of the yard (OSM way 766716133) belongs to the brewery: read off photos, not off OSM',
    'where each building stands inside the two outlines and how far it reaches: OSM maps each block as one outline; the tower, the chimney and the slate-roofed tower are placed by the directions in which they stand in a photo taken from the gate',
    'every height, by eye from the photos: the tower 34 m (39 m with the storeys on top), the chimney 40 m, the slate-roofed tower 30 m, the other buildings 8 to 19 m to the eaves',
    'the roofs of the west block: three gabled ranges and a hipped one along the yard; and the roof shapes of the north block, from the photos',
    'the windows (painted in rows by the viewer, as on the city’s houses), the stacks on the flat roof, the colours',
    'what each building is used for is not said: the photos do not tell, and no plan of the works was found',
    'not drawn: lettering and painted signs, loading canopies, the hop shed, tanks, the gate; nor the brewery’s other buildings, which stay with the generic city (the long halls on the Dreisam, the house with the mural in the yard, the big building of the 1970s on Schwarzwaldstraße, the Villa Ganter)',
  ],
  card: {
    title: 'Brauerei Ganter',
    years: 'founded 1865 · on this site since 1877',
    text: [
      'Ludwig Ganter, called Louis, an innkeeper’s son from Schönau in the Black Forest, founded the brewery in 1865 in the old town, in the house «Zum Kindlein Jesu» in Schiffstraße, where Erasmus of Rotterdam had lived. In 1877 he bought the site of the «Alte Ölmühle», the old oil mill, then in open fields outside the town, and built the works and a villa between Schwarzwaldstraße and the Dreisam, with a deep well and a power station of their own. A refrigerating machine came in 1883: until then beer could only be brewed in winter.',
      'The raid of 27 November 1944 destroyed the brewery’s house in the old town. In the night of 2 December 1944 bombs hit the works: the brewery’s own history says they destroyed the workshops, the office building and the stables. The well and the turbine kept running, and people from the neighbourhood came for drinking water.',
      'Between 1970 and 1980 the works were extended. In 2010–11 they were rebuilt smaller; the new plant opened on 22 January 2011, on the spot where the founder had built his fermenting cellar. In 2021 the family sold a third of the site, at the corner of Fabrikstraße, for flats.',
      'What is drawn is the brewery of today, also at the earlier years: the timeline does not show how it looked in 1903 or 1944. Only the two outlines are OpenStreetMap’s. Where each building stands inside them, every height and every roof are guesses made from photos — the tower, the brick chimney, the tower with the stepped slate roof.',
    ],
  },
};

// OSM's outlines (https://www.openstreetmap.org/relation/7509071, https://www.openstreetmap.org/way/766716133)
const WEST = 'r7509071', NORTH = 'w766716133';

const YELLOW = '#e3cb82', YELLOW_PALE = '#ecd999', RED = '#964a3c', SLATE = '#54575d', TILE = '#9a4b33', BRICK = '#8c5645';
const STEEL = '#b4b8bc', GLASS = '#45515b', GRAVEL = '#98938a', WHITE = '#e4e2dc';

// ---- every height here is ASSUMED (by eye from the photos: see the top of the file)
const TOWER = 34, TOWER_TOP = 39, CHIMNEY = 40;

const middleOf = (r) => [r.reduce((s, p) => s + p[0], 0) / r.length, r.reduce((s, p) => s + p[1], 0) / r.length];

/** the part of a ring inside the rectangle [u0, u1] × [v0, v1] of a frame (origin o, unit axes ex and ez) */
function cut(ring, { o, ex, ez }, [u0, u1, v0, v1]) {
  let pts = ring.map(([x, z]) => [(x - o[0]) * ex[0] + (z - o[1]) * ex[1], (x - o[0]) * ez[0] + (z - o[1]) * ez[1]]);
  for (const [axis, limit, keepBelow] of [[0, u0, false], [0, u1, true], [1, v0, false], [1, v1, true]]) {
    const inside = (p) => (keepBelow ? p[axis] <= limit : p[axis] >= limit), out = [];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      if (inside(p)) out.push(p);
      if (inside(p) !== inside(q)) { const t = (limit - p[axis]) / (q[axis] - p[axis]); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    });
    pts = out;
  }
  // (drop points that repeat, then back to world metres)
  pts = pts.filter((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05; });
  if (pts.length < 3) throw new Error(`Brauerei Ganter: nothing of the outline inside ${[u0, u1, v0, v1].join(', ')}`);
  return pts.map(([u, v]) => [o[0] + u * ex[0] + v * ez[0], o[1] + u * ex[1] + v * ez[1]]);
}

export function build(kit, parts) {
  const west = parts.find((b) => b.id === WEST), north = parts.find((b) => b.id === NORTH);
  if (!west || !north) throw new Error(`Brauerei Ganter: OSM outlines missing from city.json (${[!west && WEST, !north && NORTH].filter(Boolean).join(', ')})`);
  const ringW = west.rings[0], ringN = north.rings[0];

  // one building of the group: a piece of an outline with walls to `eaves`, a roof and painted windows
  const piece = (id, ring, eaves, { roof = 'flat', rise = 0, across = false, colour = YELLOW, roofColour = roof === 'flat' ? GRAVEL : TILE, windows = true } = {}) =>
    kit.osm([{ id: `ganter-${id}`, rings: [ring], type: 'part', height: eaves + rise, roofShape: roof, roofHeight: rise, roofOrientation: across ? 'across' : null, colour, roofColour }], { walls: windows ? KIND.WINDOWS : KIND.PLAIN });
  // a red-brown cornice around the top of a piece (`flat`: with the gravel of a flat roof inside it)
  const cornice = (F, ring, y, h = 0.7, flat = true) => {
    F.prism(shrunk([ring.map((p) => [p[0], p[1]])], -0.25)[0], y - 0.1, y + h, RED);
    if (flat) F.prism(ring, y + h - 0.2, y + h + 0.06, GRAVEL);
  };

  // =========================================================== 1. the west block (relation 7509071)
  // Its own frame: x along its north side, from the north-west corner eastwards; z across the block, southwards.
  const o = ringW.reduce((best, p) => (p[0] + 3 * p[1] < best[0] + 3 * best[1] ? p : best)); // (the north-west corner)
  const far = ringW.reduce((best, p) => (p[0] - 3 * p[1] > best[0] - 3 * best[1] ? p : best)); // (the north-east corner)
  const len = Math.hypot(far[0] - o[0], far[1] - o[1]), ex = [(far[0] - o[0]) / len, (far[1] - o[1]) / len], ez = [-ex[1], ex[0]];
  const M = { o, ex, ez }, world = { o: [0, 0], ex: [1, 0], ez: [0, 1] };
  const F = kit.frame({ x: o[0], z: o[1], angle: Math.atan2(-ex[1], ex[0]), kind: KIND.PLAIN });
  const W = kit.frame({ x: 0, z: 0, kind: KIND.PLAIN }); // (world metres, for the north block: its outline runs east–west)
  const E = len + 6; // (past the east side)

  // the range along the yard: three storeys, a low hipped roof (ASSUMED: 11 m deep)
  const yard = cut(ringW, M, [len - 8, E, -5, 80]);
  piece('yard', yard, 11.5, { roof: 'hipped', rise: 3 });
  cornice(W, yard, 11.5, 0.4, false);
  // three ranges behind it, side by side, each under a gabled roof (ASSUMED)
  piece('west-n', cut(ringW, M, [-10, len - 8, -5, 12]), 9, { roof: 'gabled', rise: 4.5, colour: YELLOW_PALE });
  piece('west-m', cut(ringW, M, [-10, len - 8, 12, 32]), 8, { roof: 'gabled', rise: 5 });
  piece('west-s', cut(ringW, M, [-10, len - 8, 32, 80]), 8, { roof: 'gabled', rise: 5, colour: YELLOW_PALE });

  // the tower with the stepped slate roof, behind the range along the yard: a square body, a wide slate skirt, a
  // red storey set back, a second slate roof, a lantern and a pointed cap
  const kx = len - 16, kz = 24, ks = 14, q = Math.SQRT2, turn = Math.PI / 4;
  F.box(ks, 14.5, ks, kx, 0, kz, YELLOW);
  for (const y of [5.2, 8.6, 11.8]) for (const s of [-4.4, -1.5, 1.5, 4.4]) for (const [dx, dz, a] of [[1, 0, 0], [-1, 0, Math.PI], [0, 1, -Math.PI / 2], [0, -1, Math.PI / 2]]) {
    F.panel(1.1, 1.5, kx + dx * (ks / 2 + 0.05) + (dz ? s : 0), y, kz + dz * (ks / 2 + 0.05) + (dx ? s : 0), a, GLASS);
  }
  F.box(ks + 0.6, 0.5, ks + 0.6, kx, 14.2, kz, RED);
  F.cylinder((ks / 2 + 0.9) * q, 4.6, kx, 14.7, kz, SLATE, 4, 4.2 * q, turn);
  F.box(8.4, 1.9, 8.4, kx, 19.3, kz, RED);
  for (const s of [-2.4, 0, 2.4]) for (const [dx, dz, a] of [[1, 0, 0], [-1, 0, Math.PI], [0, 1, -Math.PI / 2], [0, -1, Math.PI / 2]]) F.panel(1.3, 1.0, kx + dx * 4.25 + (dz ? s : 0), 19.8, kz + dz * 4.25 + (dx ? s : 0), a, GLASS);
  F.cylinder(5.1 * q, 3.6, kx, 21.2, kz, SLATE, 4, 1.7 * q, turn);
  F.box(3.2, 1.5, 3.2, kx, 24.8, kz, RED);
  F.pyramid(2.5 * q, 4.2, kx, 26.3, kz, SLATE, 4, turn);
  F.cylinder(0.08, 1.2, kx, 30.3, kz, '#221f1d', 4);

  // the brick chimney, at the north end of the block: round, tapering, with a platform half way up
  const cx = len - 18, cz = 6;
  F.box(4.2, 5, 4.2, cx, 0, cz, BRICK);
  F.cylinder(1.75, CHIMNEY - 5, cx, 5, cz, BRICK, 14, 1.05);
  F.cylinder(2.3, 0.35, cx, 23, cz, STEEL, 14);
  F.cylinder(1.2, 0.8, cx, CHIMNEY - 0.4, cz, STEEL, 14);

  // =========================================================== 2. the north block (way 766716133), in world metres
  const [x0, z0] = [Math.min(...ringN.map((p) => p[0])), Math.min(...ringN.map((p) => p[1]))];
  const rect = (a, b, c, d) => cut(ringN, world, [x0 + a, x0 + b, z0 + c, z0 + d]); // (metres from the block's north-west corner)

  // the west end: a tiled range with a stepped gable towards the Dreisam, and a wing behind it
  const gableRange = rect(-1, 28, -1, 15.1);
  piece('gable-range', gableRange, 9, { roof: 'gabled', rise: 5 });
  piece('gable-wing', rect(16, 28, 15.1, 33.2), 9, { roof: 'gabled', rise: 4, colour: YELLOW_PALE });
  const gx = x0 + 13.5, gz = z0 + 0.1; // (the stepped gable, on the north face)
  piece('gable-cross', [[gx - 5, gz], [gx + 5, gz], [gx + 5, gz + 7.4], [gx - 5, gz + 7.4]], 9, { roof: 'gabled', rise: 5, across: true });
  [10.6, 8.4, 6.2, 4, 1.8].forEach((w, i) => W.box(w, 1.25, 0.7, gx, 9 + i * 1.25, gz, YELLOW_PALE));

  // the middle: the block with the lettered front on the yard — tall windows, a red cornice, a flat roof with steel
  // stacks and a round tank — and the low white pavilion before it
  const brewhouse = rect(28, 59.6, -1, 34.45);
  piece('brewhouse', brewhouse, 16.5);
  cornice(W, brewhouse, 16.5, 0.9);
  for (const s of [0, 1, 2, 3]) W.panel(2.6, 9, x0 + 43 + s * 4.6, 3.2, z0 + 34.52, -Math.PI / 2, GLASS); // (the four tall windows, behind the pavilion)
  for (const [sx, sz, h] of [[33, 8, 6.5], [37, 12, 5], [41, 8, 7.5], [45, 15, 5.5], [38, 20, 4.5]]) { W.cylinder(0.45, h, x0 + sx, 17.3, z0 + sz, STEEL, 8); W.cylinder(0.7, 0.5, x0 + sx, 17.3 + h, z0 + sz, STEEL, 8, 0.2); }
  W.cylinder(3.7, 5.5, x0 + 54, 17.3, z0 + 24, YELLOW, 10);
  W.cylinder(3.9, 0.4, x0 + 54, 22.8, z0 + 24, YELLOW_PALE, 10);
  piece('pavilion', rect(45.8, 57.8, 34.45, 51), 5.5, { colour: WHITE, windows: false });

  // the tower: a square shaft without windows, a glazed storey at its top and a smaller glazed storey on its roof;
  // against its south side a lower block
  const tower = rect(59.6, 71.1, 2.5, 16.3), [tx, tz] = middleOf(tower);
  const tw = Math.max(...tower.map((p) => p[0])) - Math.min(...tower.map((p) => p[0])), td = Math.max(...tower.map((p) => p[1])) - Math.min(...tower.map((p) => p[1]));
  piece('tower', tower, TOWER, { windows: false });
  for (const [dx, dz, a, w] of [[1, 0, 0, td], [-1, 0, Math.PI, td], [0, 1, -Math.PI / 2, tw], [0, -1, Math.PI / 2, tw]]) {
    W.panel(w - 1.6, 2.2, tx + dx * (tw / 2 + 0.06), TOWER - 3.4, tz + dz * (td / 2 + 0.06), a, GLASS);
    W.panel((dx ? td : tw) - 4.6, 1.6, tx + dx * (tw / 2 - 1.44), TOWER + 1.6, tz + dz * (td / 2 - 1.44), a, GLASS);
  }
  W.box(tw + 0.5, 0.5, td + 0.5, tx, TOWER - 0.1, tz, YELLOW_PALE);
  W.box(tw - 3, TOWER_TOP - TOWER - 0.4, td - 3, tx, TOWER + 0.4, tz, YELLOW);
  W.box(tw - 2.2, 0.4, td - 2.2, tx, TOWER_TOP - 0.4, tz, YELLOW_PALE);
  piece('shoulder', rect(59.6, 69.8, 16.3, 34.45), 24);

  // the east end: the front with the red pilasters on the yard, and the taller block under a hipped tile roof
  const store = rect(62.7, 88.7, 26.2, 60);
  piece('store', store, 15.5);
  cornice(W, store, 15.5, 0.8);
  const sz = Math.max(...store.map((p) => p[1])), sx0 = x0 + 63.2, sx1 = x0 + 88.2;
  for (let i = 0; i <= 5; i++) W.box(0.9, 16, 0.5, sx0 + ((sx1 - sx0) * i) / 5, 0, sz + 0.1, RED);
  W.box(9, 1.6, 0.6, (sx0 + sx1) / 2, 16.2, sz, RED);
  const hipped = rect(88.7, 120, -1, 60);
  piece('hipped', hipped, 19, { roof: 'hipped', rise: 7, colour: YELLOW_PALE });
  cornice(W, hipped, 19, 0.4, false);

  return { anchor: [tx, tz], top: CHIMNEY + 0.4 };
}
