// The Schlossbergturm (Schlossberg Tower), the observation tower on the Salzbüchsle, a spur of the Schlossberg east
// of the old town, as it has stood since 2017: a steel stair in a round cage, held by six leaning steel posts.
//
// Where it stands: OpenStreetMap has the tower as a point, not as a building (node 9453925186, man_made=tower, at
// 47.9950491 N, 7.8619998 E), so there are no OSM parts to draw on: the model is put on that point. The German
// Wikipedia's infobox gives 47.99507 N, 7.86194 E, which is 5 m from it. Both fall on the viewer's terrain, about
// 300 m inside its east edge.
//
// How it is made (all of it by hand; the photos are on Wikimedia Commons):
//   - Six posts. The German Wikipedia: tree trunks «rund um einen Treppenlauf aus Stahl aufgestellt „wie
//     gegeneinander verdrehte Mikadostangen“», replaced in 2017 by steel posts (it cites the city's notice «Mit sechs
//     neuen Stahlpylonen: Der sanierte Schlossbergturm wurde heute eröffnet»); the forestry office's notice of
//     5 June 2002 (in the press collection on freiburg-schwarzwald.de) says six trunks were prepared. In the photo of
//     2020 («Schlossbergturm (Freiburg)», Jörg Braukmann) each post leans the same way round the stair: it leaves the
//     rim of the top deck, passes close to the cage a little above mid-height and reaches the ground about a third of
//     a turn further on, well outside the decks. Six straight posts, each turned 120° between head and foot, give
//     that outline. The steel is galvanised (de.wikipedia: «verzinkten Stahlpylone»), so it is drawn pale grey.
//   - The stair: a spiral inside a round cage of uprights and hoops, clad in wire mesh. A photo of July 2015
//     («Schlossbergturm in Freiburg ohne Stützen 3», Andreas Schwarzkopf), taken when the trunks were gone, shows the
//     cage and the decks alone. The German Wikipedia counts 153 steps, and that many are drawn.
//   - The decks, as the 2020 photo shows them: a ring round the cage at about a quarter of the height, a second ring
//     and a wider deck close under the top, and a small pulpit above the wide deck (Commons calls it the «Kanzel»:
//     «Aussichtsplattform mit Treppe zur Kanzel»), with a thin mast. The German Wikipedia counts three viewing
//     platforms, the highest reached by a small spiral stair; it does not say which of the four railed levels of the
//     photo it leaves out.
//
// The height: the German Wikipedia says 33.27 m (OSM: 33.3 m), with the top at 463 m above sea level. The press
// collection on freiburg-schwarzwald.de says «Die Holz-/Stahlkonstruktion ist 30 m hoch» and puts the highest
// platform at 469 m. The model is 33.27 m to the tip of its mast; the card says the sources do not agree.
// The steps: 153 (German Wikipedia), 180 (the press collection), 187 (OSM's step_count). 153 are drawn.
//
// ASSUMED (read off the photos by eye, no source gives them): that the 33.27 m are measured to the tip of the mast;
// the height and width of every deck and of the pulpit; the width of the cage, the number of its uprights and hoops;
// how far out the posts stand at the foot and at the head, their thickness, and which way each foot points; which
// way the stair winds and how many steps make a turn. The wire mesh round the stair and the railings' mesh are drawn
// as thin bars. The ground under the model is the viewer's terrain, which is coarse here: the posts are carried on
// below their feet so that none hangs in the air on the slope.

import * as THREE from 'three';
import { KIND } from '../kit.js';
import { toWorld } from '../geo.js';

const OSM_POINT = [47.9950491, 7.8619998]; // OpenStreetMap, node 9453925186 (man_made=tower, name=Schlossbergturm)
const HEIGHT = 33.27; // de.wikipedia, infobox and first sentence: «ein 33,27 Meter hoher … Aussichtsturm»
const STEPS = 153; // de.wikipedia: «Der Schlossbergturm hat 153 Treppenstufen»
const POSTS = 6; // «sechs neuen Stahlpylonen» (City of Freiburg, cited by de.wikipedia)

export const PLACE = {
  key: 'schlossbergturm',
  name: 'Schlossbergturm',
  localName: 'Schlossberg Tower',
  kind: 'building',
  built: { from: 2002, rebuilt: 2017 }, // de.wikipedia: «2002 errichteter Aussichtsturm», «im November 2002 eingeweiht»; steel posts since 2017
  since: 2002, // de.wikipedia: built 2002, inaugurated in November 2002 (the press collection: opened on 9 November 2002)
  coordinates: [47.99507, 7.86194], // de.wikipedia «Schlossbergturm», infobox; OpenStreetMap's node 9453925186 (47.9950491, 7.8619998) is 5 m away
  osm: 'n9453925186',
  checks: { height: HEIGHT },
  sources: [
    'German Wikipedia, «Schlossbergturm»: coordinates (47.99507 N, 7.86194 E); «ein 33,27 Meter hoher, 2002 errichteter Aussichtsturm»; on the Salzbüchslekuppe, about 500 metres east of the old town, its top 463 metres above sea level; started by the Kuratorium Schlossberg e. V. and inaugurated in November 2002; cost 375,000 euros, two thirds of it donations, with a plaque for each donor on the front of a step; 153 steps; Douglas fir trunks 34 metres long, about a hundred years old, from the Ottilienwald, blown down by the storm Lothar, set up round a steel stair «wie gegeneinander verdrehte Mikadostangen»; three viewing platforms, the highest reached by a small spiral stair; fungus, closures, the trunks taken away in July 2015; reopened on 1 September 2017 with galvanised steel posts, for 192,000 euros',
    'freiburg-schwarzwald.de, «Schlossbergturmtreppe» (a collection of press reports): opened on 9 November 2002; «180 Stufen führen zur obersten Plattform auf 469 m Höhe», «Die Holz-/Stahlkonstruktion ist 30 m hoch»; the city forestry office’s notice of 5 June 2002: six of the seven trunks stored at the Kleiner Kanonenplatz were prepared, to be joined to «dem Metallkern des Turmes», and brought up with a cable crane',
    'OpenStreetMap, node 9453925186 (man_made=tower, tower:type=observation): the position (47.9950491 N, 7.8619998 E), where the model stands; its tags height=33.3, ele=463, start_date=2002, step_count=187 and architect=«Hubert Horbach, Freiburg - Konzeption: Josef Diel, Freiburg»',
    'Wikimedia Commons, «Schlossbergturm (Freiburg)» (Jörg Braukmann, 2020, CC BY-SA 4.0): the shape — six leaning steel posts, the round stair cage with its hoops, the ring at about a quarter of the height, the ring and the wide deck under the top, the pulpit and the mast — and every proportion of the model',
    'Wikimedia Commons, «Schlossbergturm in Freiburg ohne Stützen 3» (Andreas Schwarzkopf, July 2015, CC BY-SA 3.0): the stair cage and the decks without the posts — the uprights, the hoops and the wire mesh',
    'Wikimedia Commons, «Schlossbergturm in Freiburg 7» (Andreas Schwarzkopf, 2011, CC BY-SA 3.0): the same outline with the tree trunks, before 2015',
  ],
  assumptions: [
    'that the 33.27 metres are measured to the tip of the mast',
    'the height and the width of each deck and of the pulpit (read off the photos of 2015 and 2020 by eye)',
    'the width of the stair cage, and the number of its uprights and hoops',
    'how far out the posts stand at the foot and at the head, their thickness, and in which directions their feet point',
    'which way the stair winds and how many steps make a turn; 153 steps are drawn, the German Wikipedia’s count',
    'the wire mesh round the stair and on the railings, drawn as thin bars',
    'the ground: the viewer’s terrain is coarse on the hill, so the posts are carried on below their feet',
  ],
  card: {
    title: 'Schlossbergturm',
    years: '2002 · steel posts since 2017',
    text: [
      'The observation tower stands on the Salzbüchsle, a spur of the Schlossberg about 500 metres east of the old town. The Kuratorium Schlossberg started it, and it was inaugurated in November 2002. It cost 375,000 euros; two thirds were donations, and each donor got a plaque on the front of a step.',
      'A steel spiral stair in a round cage was held by six Douglas fir trunks 34 metres long, set up round it «wie gegeneinander verdrehte Mikadostangen», like pick-up sticks twisted against each other. The trees, about a hundred years old, had been blown down by the storm Lothar in the city’s Ottilienwald. OpenStreetMap names Hubert Horbach as the architect, after a concept by Josef Diel.',
      'Fungus attacked the trunks. The tower was closed several times, and in July 2015 the trunks were taken away. It reopened on 1 September 2017 on six galvanised steel posts, which cost 192,000 euros. That is the tower shown here.',
      'The sources do not agree on its size. The German Wikipedia gives a height of 33.27 metres and 153 steps; a collection of press reports gives 30 metres and 180 steps; OpenStreetMap gives 33.3 metres and 187 steps. The model is 33.27 metres to the tip of its mast and has 153 steps.',
      'Only the position, the height, the six posts and the number of steps come from sources. The decks, the cage and the lean of the posts are read off photos by eye: their sizes are guesses.',
    ],
  },
};

// Everything below, except HEIGHT, STEPS and POSTS, is read off the photos of 2015 and 2020 by eye (ASSUMED), in metres.
const DECK = { low: 9.0, ring: 26.6, top: 29.2, pulpit: 31.4 }; // the floor of each level
const RADIUS = { cage: 1.5, low: 2.7, ring: 2.85, top: 3.6, pulpit: 1.1, foot: 5.2, head: 3.85 };
const RAIL = 1.1, POST_HEAD = DECK.top + RAIL, TWIST = (2 * Math.PI) / 3, PER_TURN = 16;
const STEEL = '#d5d8d9', CAGE = '#a3a8ab', GRATING = '#8b9093', UNDER = '#6c7174';

export function build(kit) {
  const [ox, oz] = toWorld(...OSM_POINT);
  const T = kit.frame({ x: ox, z: oz, angle: 0, kind: KIND.PLAIN }); // (x east, z south, as the world)
  const polar = (r, a, y) => [r * Math.cos(a), y, r * Math.sin(a)];

  // a round bar from a to b ([x, y, z] each): the kit's beam is square (thin bars: three sides and no ends, to save vertices)
  const tube = (a, b, r, colour, sides = 3) => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    T.put(new THREE.CylinderGeometry(r, r, len, sides, 1, sides === 3), colour, new THREE.Matrix4().compose(A.clone().add(B).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)));
  };
  // a flat hoop of radius r at height y
  const hoop = (r, y, t, colour) => T.put(new THREE.TorusGeometry(r, t, 3, 24).rotateX(Math.PI / 2), colour, new THREE.Matrix4().makeTranslation(0, y, 0));
  // a railing round a deck: a hand rail and thin bars under it
  const railing = (r, y, bars) => {
    hoop(r, y + RAIL, 0.05, STEEL);
    for (let i = 0; i < bars; i++) { const a = (2 * Math.PI * i) / bars; tube(polar(r, a, y), polar(r, a, y + RAIL), 0.025, CAGE); }
  };

  // 1. the six posts: straight, each turned TWIST between its foot and its head, and carried on below the ground
  for (let i = 0; i < POSTS; i++) {
    const a = (2 * Math.PI * i) / POSTS, foot = polar(RADIUS.foot, a, 0), head = polar(RADIUS.head, a + TWIST, POST_HEAD);
    const below = foot.map((f, k) => f + (f - head[k]) * 0.07); // (about 2 m further down the same line)
    tube(below, head, 0.26, STEEL, 10);
  }

  // 2. the stair cage: six uprights, thin bars between them for the wire mesh, and hoops
  for (let i = 0; i < 24; i++) {
    const a = (2 * Math.PI * i) / 24, main = i % 4 === 0;
    tube(polar(RADIUS.cage, a, main ? -2 : -1.2), polar(RADIUS.cage, a, DECK.top), main ? 0.07 : 0.022, CAGE, main ? 6 : 3);
  }
  for (const y of [3, 6, 11.7, 14.4, 17.1, 19.8, 22.5]) hoop(RADIUS.cage + 0.05, y, 0.07, STEEL);

  // 3. the spiral stair: a pole in the middle, the steps, and the outer string that joins them
  const riser = DECK.pulpit / STEPS, main = Math.round(DECK.top / riser), turn = (2 * Math.PI) / PER_TURN;
  tube([0, -2, 0], [0, DECK.pulpit, 0], 0.14, CAGE, 8);
  let before = null;
  for (let i = 0; i < main; i++) {
    const a = -i * turn, y = (i + 1) * riser, mid = polar(0.8, a, y - 0.05), end = polar(1.38, a, y);
    T.box(1.2, 0.05, 0.42, mid[0], mid[1], mid[2], GRATING, -a);
    if (before) tube(before, end, 0.07, CAGE);
    before = end;
  }
  // (the small spiral from the wide deck up to the pulpit: the rest of the steps)
  for (let i = main; i < STEPS; i++) {
    const a = -i * turn * 1.6, mid = polar(0.6, a, (i + 1) * riser - 0.05);
    T.box(0.9, 0.05, 0.36, mid[0], mid[1], mid[2], GRATING, -a);
  }

  // 4. the decks, each with its railing: two rings round the cage, the wide deck and the pulpit
  const deck = (r, y, thick, bars) => { T.cylinder(r, thick, 0, y - thick, 0, GRATING, 24); T.cylinder(r - 0.5, 0.3, 0, y - thick - 0.3, 0, UNDER, 24, r - 0.1); railing(r - 0.06, y, bars); };
  deck(RADIUS.low, DECK.low, 0.2, 36);
  deck(RADIUS.ring, DECK.ring, 0.2, 36);
  deck(RADIUS.top, DECK.top, 0.3, 48);
  for (let i = 0; i < POSTS; i++) { const a = (2 * Math.PI * (i + 0.5)) / POSTS; T.beam(polar(RADIUS.cage, a, DECK.top - 1.5), polar(RADIUS.top - 0.3, a, DECK.top - 0.45), 0.1, UNDER); } // (the struts under the wide deck)
  T.cylinder(RADIUS.pulpit, 0.15, 0, DECK.pulpit - 0.15, 0, GRATING, 16);
  railing(RADIUS.pulpit - 0.04, DECK.pulpit, 16);
  // the mast at the pulpit's rail: its tip is the tower's height
  tube([RADIUS.pulpit - 0.04, DECK.pulpit, 0], [RADIUS.pulpit - 0.04, HEIGHT, 0], 0.035, CAGE);

  return { anchor: [ox, oz], top: HEIGHT };
}
