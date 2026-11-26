// The hand-made places. Each file in this folder exports PLACE (what it is, its sources and assumptions, its info
// card) and build(kit, parts, city), which draws it from its OSM parts (and the rest of city.json if it needs it). To add one: write the file, add it here, and if it replaces OSM
// buildings, list their outline in osm-ids.js and run `npm run city`. Then `npm run check -- <key>`.
// A place that was not always there says since when in PLACE.since (a year, with its source): at the stops of the
// timeline before that year it is put away, with its label. Without it, a place stands at every stop.
// A place that is gone says until when in PLACE.until (a year, with its source): it is shown from `since` to the
// last stop before that year, and not today. OSM has no outline for it: it places itself (as the Schlossbergturm
// does) on a footprint read off an old plan, and if the raid left it in ruins it gives the shell's footprint in
// PLACE.footprint ([{ id, rings: [[[x, z], …]], levels }], world metres).
// A place that stood in 1944 says what the air raid of 27 November 1944 did to it in PLACE.war ({ state: 'ruin' |
// 'damaged' | 'spared', rebuilt: year | null, source }): a 'ruin' is drawn as a roofless shell from that stop until
// `rebuilt` (src/main.js). Where no source says, the field is left out.
import * as muenster from './muenster.js';
import * as martinstor from './martinstor.js';
import * as schwabentor from './schwabentor.js';
import * as kaufhaus from './kaufhaus.js';
import * as altesRathaus from './altes-rathaus.js';
import * as neuesRathaus from './neues-rathaus.js';
import * as schlossbergturm from './schlossbergturm.js';
import * as colombischloessle from './colombischloessle.js';
import * as universitaetsbibliothek from './universitaetsbibliothek.js';
import * as kollegiengebaeude1 from './kollegiengebaeude-1.js';
import * as theater from './theater.js';
import * as kollegiengebaeude2 from './kollegiengebaeude-2.js';
import * as alteUniversitaet from './alte-universitaet.js';
import * as kollegiengebaeude3 from './kollegiengebaeude-3.js';
import * as brauereiGanter from './brauerei-ganter.js';
import * as kastaniengarten from './kastaniengarten.js';
import * as alterHauptbahnhof from './alter-hauptbahnhof.js';
import * as hauptbahnhof1949 from './hauptbahnhof-1949.js';
import * as hauptbahnhof from './hauptbahnhof.js';

export const PLACES = [muenster, martinstor, schwabentor, kaufhaus, altesRathaus, neuesRathaus, schlossbergturm, colombischloessle, universitaetsbibliothek, kollegiengebaeude1, theater, kollegiengebaeude2, alteUniversitaet, kollegiengebaeude3, brauereiGanter, kastaniengarten, alterHauptbahnhof, hauptbahnhof1949, hauptbahnhof];
