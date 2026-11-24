// The Altes Rathaus (Old Town Hall), on Rathausplatz.
//
// How it is made: OpenStreetMap's 5 building:parts of the building (way 23226923), with their levels, roof shapes and
// colours (building:colour darkred, roof:colour maroon and darkgrey), drawn by src/buildings.js. The red agrees with
// both Wikipedias: «einheitlichen Sandsteinrot verputzt» (de), «plastered uniformly in sandstone red» (en).
// Not modelled yet: the portals, the clock «gekrönt vom Doppeladler» over the arch, the coats of arms on the gables,
// and the «schwarzgold» window frames — the pages say they are there, not exactly where or how big.
//
// ASSUMED: the heights (OSM gives levels, not metres: 3.1 m per level and 2.6 m per roof level, src/buildings.js) and
// the painted windows.

import { resolve } from '../buildings.js';

export const PLACE = {
  key: 'altes-rathaus',
  name: 'Altes Rathaus',
  localName: 'Old Town Hall',
  kind: 'building',
  built: { from: 1557, to: 1559, rebuilt: [1949, 1954] }, // de: «Das Gebäude von 1557/1559»; «Wiederaufbau 1949 bis 1954»
  coordinates: [47.996256, 7.8493], // de.wikipedia «Rathaus (Freiburg im Breisgau)», infobox for the Altes Rathaus
  osm: 'w23226923',
  sources: [
    'German Wikipedia, «Rathaus (Freiburg im Breisgau)»: coordinates (47.996256 N, 7.8493 E); in 1557 the council commissioned master builder Dietrich Neeb and master mason Barthlin Ress; the building of 1557/1559; extended in 1561 and 1600; burned out completely in the air raid of 1944; rebuilt 1949 to 1954 with modern materials, extended 1953 to 1958 by three wings towards Gauchstraße; plastered in sandstone red; a clock crowned by the double-headed eagle over the arch',
    'English Wikipedia, «Freiburg im Breisgau Town Hall»: the same history; «plastered uniformly in sandstone red»',
    'OpenStreetMap, way 23226923 and its 5 building:parts: footprint, levels, roof shapes and colours',
  ],
  assumptions: [
    'the heights: OSM gives the number of storeys, not metres',
    'the windows, painted on as on every other building',
    'the portals, the clock and the coats of arms are not drawn',
  ],
  card: {
    title: 'Altes Rathaus',
    years: '1557 – 1559 · rebuilt 1949 – 1954',
    text: [
      'In 1557 the council commissioned the master builder Dietrich Neeb and the master mason Barthlin Ress; the town hall was built in 1557–59 and extended in 1561 and 1600.',
      'It is plastered in a uniform sandstone red. Over the arch of its passage is a clock crowned by the double-headed eagle of the Holy Roman Empire.',
      'In the air raid of 1944 it burned out completely, and its interior was lost. It was rebuilt in 1949–54 with modern materials.',
      'The volumes are OpenStreetMap’s; the heights come from its storey counts. The portals, the clock and the coats of arms are not drawn yet.',
    ],
  },
};

export function build(kit, parts) {
  if (!parts.length) throw new Error('Altes Rathaus: no OSM parts in city.json');
  kit.osm(parts);
  return centreTop(parts);
}

/** the label goes over the middle of the parts, above the tallest */
export function centreTop(parts) {
  const top = Math.max(...parts.map((b) => resolve(b).wallTop + resolve(b).roofH));
  const pts = parts.flatMap((b) => b.rings[0]);
  const x = pts.reduce((s, p) => s + p[0], 0) / pts.length, z = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return { anchor: [x, z], top };
}
