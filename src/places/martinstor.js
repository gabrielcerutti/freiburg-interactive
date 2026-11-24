// The Martinstor (Martin's Gate), on Kaiser-Joseph-Straße.
//
// How it is made:
//   - The tower is OpenStreetMap's main part of the gate (way 23235197: height 53 m, a hipped roof 20 m high), drawn as
//     a solid with an archway cut through it along the street OSM maps through the gate (way 53799627,
//     tunnel=building_passage). The roof on top is that part's own, from OSM.
//   - The four corner turrets (ways 1105286649–52: 28 to 43.5 m, pyramidal roofs 7.5 m high) and the small part on
//     the south side (way 1105286653, 11.5 m) are OSM's parts as they are.
//   - The colours follow a photo of 2025 (Dietmar Rabich, Wikimedia Commons, «Freiburg im Breisgau, Martinstor --
//     2025 -- 8005», one of the place's photos): white plaster, dark red sandstone at the corners and on the turrets,
//     green roofs, and a clock under the roof. (OSM gives the outline a single building:colour, #efc392.) The German
//     Wikipedia says the steep roof of 1901 had green glazed tiles and was later covered in copper.
//
// The height: the English Wikipedia says the tower "was heightened from 22 to 60 metres" in 1901; OSM maps it at
// 53 m; the German page gives only Carl Schäfer's proposal of 66 m, not the height built. The model uses OSM's, and
// the card says the sources do not agree.
//
// ASSUMED: the archway's width and height and its pointed shape (no source gives them); the number and size of the
// windows; the size and height of the clock, and that there is one on both street faces (the photo shows one side).

import { gateTower, passageThrough } from './gate.js';
import { KIND } from '../kit.js';

export const PLACE = {
  key: 'martinstor',
  name: 'Martinstor',
  localName: 'Martin’s Gate',
  kind: 'building',
  built: { from: 1238, rebuilt: 1901 }, // first mentioned 1238; raised in 1901 (both Wikipedias)
  coordinates: [47.993712, 7.848921], // en.wikipedia "Martinstor", infobox
  osm: 'w1105286648',
  checks: {
    footprint: { part: 'w23235197', size: [10, 11] }, // de.wikipedia: "Die Grundfläche beträgt 10 auf 11 Meter."
  },
  sources: [
    'English Wikipedia, «Martinstor»: coordinates (47.993712 N, 7.848921 E); timbers dated to 1202 by dendrochronology; first mentioned in 1238 as «Porta Sancti Martini»; in 1901, under Carl Schäfer, «heightened from 22 to 60 metres» with a roof in the style of the 15th century, and a second gate built next to it',
    'German Wikipedia, «Martinstor»: the footprint, 10 by 11 metres; the work done in summer 1901 by builder Eugen Schmidt, topping-out on 28 August and completion on 14 October 1901 with the opening of the tram; the steep roof first of green glazed tiles, later covered in copper; Schäfer’s proposal of 66 metres; the picture of St Martin on the town side, removed in 1968/69',
    'Wikimedia Commons, «Freiburg im Breisgau, Martinstor -- 2025 -- 8005» (Dietmar Rabich, CC BY-SA 4.0): the colours — white plaster, red sandstone corners and turrets, green roofs — and the clock',
    'OpenStreetMap, way 1105286648 and its 6 building:parts: footprint, heights and roofs of the tower and its turrets; way 53799627: the passage through the gate',
  ],
  assumptions: [
    'the width, height and pointed shape of the archway',
    'the number and size of the windows',
    'the size and height of the clock, and that both street faces have one (the photo shows one side)',
  ],
  card: {
    title: 'Martinstor',
    years: 'first mentioned 1238 · raised 1901',
    text: [
      'The gate is first mentioned in 1238, as the Porta Sancti Martini. Timbers inside it have been dated to 1202.',
      'In 1901 Carl Schäfer raised it and gave it a roof in the style of the 15th century, and a second, wider gateway was built beside it. The work was finished on 14 October 1901, when the tram opened. The steep roof first had green glazed tiles and was later covered in copper.',
      'From the 17th century a picture of St Martin decorated the town side. It was removed in 1968–69.',
      'The sources do not agree on its height: the English Wikipedia gives 60 metres (22 before 1901), OpenStreetMap 53. The model uses OpenStreetMap’s. The size of the archway and the windows are guesses.',
    ],
  },
};

const BODY = 'w23235197';
const WALL = '#ece5d6', SANDSTONE = '#8c4638', COPPER = '#6f9c8a';

export function build(kit, parts, city) {
  const body = parts.find((b) => b.id === BODY);
  if (!body) throw new Error('Martinstor: the main OSM part is missing from city.json');
  const line = passageThrough(city.streets, body.rings[0]);
  if (!line) throw new Error('Martinstor: no OSM passage found through the tower');

  kit.osm(parts.filter((b) => b !== body).map((b) => ({ ...b, colour: b.minHeight ? SANDSTONE : WALL, roofColour: COPPER })), { walls: KIND.STONE }); // (the turrets, which start high up, in sandstone)
  const { T } = gateTower(kit, {
    body, line, wall: WALL, roof: COPPER, quoins: SANDSTONE, clock: { y: body.height - body.roofHeight - 4.2, r: 1.6 },
    arch: { width: 4.6, spring: 4.6, crown: 7.4 },
    windows: { rows: [11, 16.5, 22], perFace: 2, w: 1.1, h: 1.9 },
  });
  return { anchor: T.toWorld(0, 0), top: body.height };
}
