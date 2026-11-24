// The Neues Rathaus (New Town Hall), on Rathausplatz, and the bridge over Turmstraße to the Altes Rathaus.
//
// How it is made: OpenStreetMap's building:parts of the building (relation 6824) — white walls, maroon roofs, and the
// small turrets with onion domes (roof:shape onion, roof:colour lightseagreen) — and the bridge (way 551176977),
// drawn by src/buildings.js, which turns the onions on a lathe. The German Wikipedia: «Ein Übergang vom Neuen Rathaus
// zum Alten Rathaus überspannt die Turmstraße zwischen den beiden Gebäuden.»
// Not modelled yet: the balconies and oriels of 1896–1901, the columned portal in the middle with «Academia
// friburgensis», and the Glockenspiel.
//
// ASSUMED: most heights (OSM gives levels for most parts; 3.1 m per level), the onion profile, the height under the
// bridge (4.5 m) and the painted windows.

import { centreTop } from './altes-rathaus.js';

export const PLACE = {
  key: 'neues-rathaus',
  name: 'Neues Rathaus',
  localName: 'New Town Hall',
  kind: 'building',
  built: { from: 1539, converted: [1896, 1901] }, // «Zum Rechen» 1539–1545; bought by the city 1896, converted until 1901
  coordinates: [47.996046, 7.849225], // de.wikipedia «Rathaus (Freiburg im Breisgau)», infobox for the Neues Rathaus
  osm: 'r6824',
  sources: [
    'German Wikipedia, «Rathaus (Freiburg im Breisgau)»: coordinates (47.996046 N, 7.849225 E); a double house: «Zum Rechen», built 1539–1545 for the physician Joachim Schiller von Herdern, and «Zum Phönix», bought by the university in 1595 and joined to it; the university’s until 1774 (Collegium Universitatis); bought by the city in 1896 and converted into the New Town Hall until 1901, with larger windows, balconies and oriels; the columned portal with «Academia friburgensis»; the Glockenspiel, decided on 21 September 1898 and inaugurated on 14 October 1901; the figures above the balcony melted down in the Second World War; the bridge over Turmstraße',
    'English Wikipedia, «Freiburg im Breisgau Town Hall»: the same history (it puts «Zum Rechen» on the right, the German page on the left)',
    'OpenStreetMap, relation 6824 and its building:parts: footprint, levels, roof shapes and colours, the onion turrets; way 551176977: the bridge',
  ],
  assumptions: [
    'most heights: OSM gives the number of storeys, not metres',
    'the profile of the onion domes and the clearance under the bridge',
    'the windows, painted on as on every other building',
    'the balconies, oriels, portal and Glockenspiel are not drawn',
  ],
  card: {
    title: 'Neues Rathaus',
    years: '1539 – 1545 · town hall since 1901',
    text: [
      'It began as two houses. «Zum Rechen» was built in 1539–45 for the physician Joachim Schiller von Herdern; in 1595 the university bought the house next door, «Zum Phönix», and joined the two. The university used them until 1774.',
      'The city bought the building in 1896 and by 1901 had turned it into the New Town Hall, adding larger windows, balconies and oriels. Its Glockenspiel was inaugurated on 14 October 1901. A bridge over Turmstraße joins it to the Altes Rathaus.',
      'The two Wikipedias disagree on which side «Zum Rechen» stands. The volumes are OpenStreetMap’s; the balconies, the portal and the Glockenspiel are not drawn yet.',
    ],
  },
};

export function build(kit, parts) {
  if (!parts.length) throw new Error('Neues Rathaus: no OSM parts in city.json');
  kit.osm(parts);
  return centreTop(parts);
}
