// Which OpenStreetMap building outlines belong to each hand-made place. tools/city.mjs tags these outlines (and every
// building:part inside them) with the place's key; the generic city then leaves them out and the place file decides
// what to draw with them. Kept apart from the place files so the Node tools can read it without loading three.js.
export const PLACE_OSM = {
  // "Münster Unserer Lieben Frau", https://www.openstreetmap.org/way/110404213
  muenster: ['w110404213'],
  // "Martinstor", https://www.openstreetmap.org/way/1105286648
  martinstor: ['w1105286648'],
  // "Schwabentor", https://www.openstreetmap.org/way/129932309
  schwabentor: ['w129932309'],
  // "Historisches Kaufhaus", https://www.openstreetmap.org/way/767726339
  kaufhaus: ['w767726339'],
  // "Altes Rathaus", https://www.openstreetmap.org/way/23226923
  'altes-rathaus': ['w23226923'],
  // "Neues Rathaus", https://www.openstreetmap.org/relation/6824, and the bridge over Turmstraße to the Altes Rathaus
  // (https://www.openstreetmap.org/way/551176977)
  'neues-rathaus': ['r6824', 'w551176977'],
};
