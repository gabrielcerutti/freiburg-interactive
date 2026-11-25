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
  // "Archäologisches Museum Colombischlössle", https://www.openstreetmap.org/way/146291591
  colombischloessle: ['w146291591'],
  // "Universitätsbibliothek", https://www.openstreetmap.org/way/219971985
  universitaetsbibliothek: ['w219971985'],
  // "Kollegiengebäude I", https://www.openstreetmap.org/relation/5626
  'kollegiengebaeude-1': ['r5626'],
  // "Theater Freiburg", https://www.openstreetmap.org/way/113767229, with what OSM maps as outlines of their own
  // against its front block: the low south wing with the entrance of the Kleines Haus (way 254048365) and the raised
  // terraces on its south (way 254048364) and north side (ways 113767224 and 113767228)
  theater: ['w113767229', 'w254048365', 'w254048364', 'w113767224', 'w113767228'],
};
