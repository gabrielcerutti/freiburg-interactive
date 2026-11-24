// The hand-made places. Each file in this folder exports PLACE (what it is, its sources and assumptions, its info
// card) and build(kit, parts, city), which draws it from its OSM parts (and the rest of city.json if it needs it). To add one: write the file, add it here, and if it replaces OSM
// buildings, list their outline in osm-ids.js and run `npm run city`. Then `npm run check -- <key>`.
import * as muenster from './muenster.js';
import * as martinstor from './martinstor.js';
import * as schwabentor from './schwabentor.js';
import * as kaufhaus from './kaufhaus.js';
import * as altesRathaus from './altes-rathaus.js';
import * as neuesRathaus from './neues-rathaus.js';

export const PLACES = [muenster, martinstor, schwabentor, kaufhaus, altesRathaus, neuesRathaus];
