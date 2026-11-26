# Freiburg im Breisgau — interactive

Freiburg im Breisgau in 3D, in the browser — the old town and, south of the Dreisam, the Wiehre: every building from OpenStreetMap with its roof, the streets, the
Bächle, the tram and OSM's trees on the ground, and landmarks modelled by hand: the Münster, the Martinstor and the
Schwabentor, the Historisches Kaufhaus, the two town halls, the Colombischlössle, the Theater, the university's
Alte Universität, its Kollegiengebäude I, II and III and its library, the Ganter brewery, the Hauptbahnhof (its three buildings, each at its
years), on the Schlossberg the tower and the Kastaniengarten, and in the Wiehre the Johanneskirche, the Christuskirche,
the Alter Wiehrebahnhof and the Wasserschlössle. Two looks — colour, and an ink engraving.

    npm install
    npm run dev          # http://localhost:5173
    npm run build        # dist/

Drag to move, scroll to zoom, right-drag to turn. Click a landmark or its label to highlight it and open its card;
the card's name stays on top while the rest scrolls: all the photos of the place, each with its caption and credit;
click any of them to open it large in the viewer (← → to move, Esc to close).
The years at the top put an old plan of the city on the ground and show the city of that year: the buildings that
stood then rise out of the ground and the others sink into it. It is an estimate read off the plans, and the line
under the years says how much of it is a guess: today's buildings appear in the shape they have today; buildings
that are gone are drawn as plain houses where the plan of 1920 shows one (where they stood is the plan's; their
height, roofs and colours are assumed); and in **Nov 1944** what the raid destroyed stands in ruins (how much of
each house was left is assumed). **Today** brings everything back.
**C** (or the button) switches between colour and ink; **Esc** closes the card.
**L** (or the «Names» button) shows or hides the landmarks' names. Shown, only those of the part of the city in view
appear, and of two that would overlap, the nearer one; hidden, a landmark shows its name under the pointer.

Inspired by [«Buenos Aires, de 1867 a 1950»](https://github.com/mormonnegro/baires-interactivo) by @mormonnegro
(<https://baires.mormon.garden>). The code here is new, written from scratch in English, but the ideas are theirs:
a city drawn on its own map, hand-made landmarks built from simple solids, and every fact with its source.

To work on it, read [`CONTRIBUTING.md`](CONTRIBUTING.md): the rules (nothing invented, every year historically
accurate), the setup, what is generated from what, and what to run before sending a change.

## How it is made

| Step | File | What it does |
|---|---|---|
| 1 | `tools/osm.mjs` | Downloads buildings, building parts, streets, rail/tram, water, green areas and vineyards for the old town from OpenStreetMap (Overpass) into `sources/osm/`. |
| 1b | `tools/terrain.mjs` | Downloads the open Terrain Tiles (zoom 15) over the area and writes an elevation grid every 4 m, relative to the ground at the Münster: `public/data/terrain.bin` and `.json`. The Schlossberg rises 175 m above the old town. |
| 1c | `tools/plan.mjs` | Fetches eight of the city's georeferenced historical town plans (1838 to 1981) over the same area, two requests each, and writes them as scanned, see-through where a sheet ends: `public/plan/<year>.webp` and `plans.json`. |
| 2 | `tools/city.mjs` | Converts that to local metres and writes `public/data/city.json` (1.9 MB). Buildings claimed by a hand-made place (`src/places/osm-ids.js`) are tagged with its key. |
| 3 | `src/buildings.js` | Turns each footprint into walls and a roof (gabled, hipped, pyramidal, skillion, flat) from its OSM tags. What OSM does not say is filled in and **counted as assumed**. |
| 4 | `src/ground.js` | The ground: two small maps of what each point is (street, green, water, and which kind), which the shader turns into crisp, painted surfaces at any zoom; a vineyard gets its rows of vines, run across the slope (assumed); the terrain's shape; and the Bächle and the rails as ribbons on it. |
| 1d | `tools/ages.mjs` | Works out which buildings stood at each stop of the timeline, and which lay in ruins, by reading the old plans under every footprint (built-up tint, the houses the plan of 1920 draws one by one, the black of the 1944 damage map, the hatched “destroyed blocks” of 1955), plus the few construction years OpenStreetMap has. Also cuts the buildings that are gone today out of the plan of 1920: `public/data/ages.json`. An estimate, not recorded dates; the rules are at the top of the file. |
| 3b | `src/city.js` | The generic city as three sets of meshes (today's buildings, the lost ones, the ruins), each cut into tiles of 384 m so that only the part in view is drawn, with its shadows. |
| 4b | `src/timeline.js` | The timeline: picking a year lays that year's plan on the ground (in colour as scanned; in ink redrawn with the viewer's ink and paper) and the city follows (`src/city.js`): the buildings that stood then, the lost ones and the ruins rise, the rest sink, each a moment apart (the shader in `src/look.js` does it); “Today” brings the OpenStreetMap ground and every building back. |
| 4b | `src/trees.js` | OSM's trees and tree rows, and trees filling OSM's woods, as instanced lumpy crowns and trunks. |
| 4c | `src/look.js` | The shader: façades (windows, frames, shutters, doors), roof tiles and ridges, stone, cobbles, grass, water, foliage; the ink look (sepia paper, ink, hatching laid on the surfaces) and the highlight of a selected landmark. |
| 4d | `tools/photos.mjs`, `src/places/photos.js`, `src/photos.js` | The photos: the list with captions, the tool that fetches them from Wikimedia Commons with author, date and licence (public domain or Creative Commons only), and the viewer. |
| 5 | `src/places/` | The hand-made landmarks. Each file exports `PLACE` (facts, sources, assumptions, card) and `build()`. |
| 6 | `src/main.js` | The scene, light, camera (three.js `MapControls`) and labels. |
| 6b | `src/sky.js` | The sky: a dome around the camera, pale blue overhead and haze at the horizon (the fog's colour); all paper in the ink look. An illustration choice. |
| 6c | `src/search.js` | The address search: an address of today, turned into coordinates by Nominatim only when the form is sent. The viewer flies there, marks it, and says since which plan a building stands on that spot (the same estimate as the timeline); outside the area drawn, how far from the Münster it lies. |

The page (`index.html`, `src/style.css`): the title and the search on the left, the years with their note (what
changed by then, in a visitor's words; it can be put away) in the middle, a landmark's card on the right, and a «?»
in the bottom corner that opens how to move, what is shown and the credits.

Coordinates (`src/geo.js`): metres from the Münster; x east, y up, z south.

### Tools

| Command | What it does |
|---|---|
| `npm run osm`, `npm run terrain`, `npm run city` | Download OSM and the terrain, and build `public/data/`. |
| `npm run plan` | Download the old plans and build `public/plan/`. |
| `npm run ages` | Read the plans under every building and write `public/data/ages.json` (`-- --debug` also writes pictures of what was read into `shots/`). |
| `node tools/photo-search.mjs "words"` | Lists candidate photos on Wikimedia Commons with licence, author and date. |
| `npm run photos` | Fetches the photos listed in `src/places/photos.js` into `public/photos/`. |
| `npm run check -- <key>` | Checks a place against its own sources. |
| `node tools/shot.mjs out.png [--view …] [--ink] [--select key] [--viewer]` | A headless screenshot. |
| `node tools/pace.mjs [--hide a,b]` | Frame time, triangles and the browser's memory, with a watchdog. |

The screenshot and pace tools always kill their test browser at the end and stop themselves after a time limit.
They run on macOS, Linux and Windows; `tools/browser.mjs` holds what differs (where Chrome for Testing is, which
GPU it uses, how it is killed and how its memory is read).

### Stack

Plain JavaScript, no framework. [three.js](https://threejs.org) for 3D, [Vite](https://vite.dev) for the dev server
and the build, Node for the tools, and [playwright-core](https://playwright.dev) with Chrome for Testing for
screenshots (`node tools/shot.mjs`).

## Adding a landmark

1. Find its OSM outline. If OSM already has `building:part`s for it, start from those (as the Münster does).
2. Add `src/places/<key>.js` with `PLACE` and `build(kit, parts)`. The kit (`src/kit.js`) has `box`, `cylinder`,
   `pyramid`, `prism`, `beam` and `put` (any three.js geometry), all in the place's own metres.
3. List its outline in `src/places/osm-ids.js` and its module in `src/places/index.js`, then `npm run city`
   (and `npm run ages`, so the timeline knows the ground is taken). A landmark OSM maps as a point and not as a
   building (the Schlossbergturm) lists nothing and places itself at its coordinates.
   If it was not always there, give `PLACE.since` (the year, with its source): the timeline puts it away before.
   If it stood in 1944, say what the air raid of 27 November 1944 did to it, with the source:
   `PLACE.war = { state: 'ruin' | 'damaged' | 'spared', rebuilt: year | null, source }`. A `'ruin'` is drawn as a
   roofless shell of its outline (assumed, like the other ruins) from the stop of November 1944 until `rebuilt`
   (without a year: only at that stop); the note of that stop lists the landmarks by what happened to them. Where
   no source says, leave it out.
4. `npm run check -- <key>`: it must build, stay under budget (25,000 vertices for a building, 90,000 for a group),
   fall where its coordinates say, and match its sourced height and length.

**Facts need sources; guesses are called guesses.** Every year, height and measurement in a place comes from a
source you can reopen (a page, a photo, OSM), and the file says which. What had to be made up for the model to close
(the pattern of the tracery, a hidden side) goes under `assumptions`, and the card says so to the reader too.

## Data and licences

- Code: MIT (`LICENSE`).
- Map data: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL. `public/data/city.json`
  is derived from it and keeps that licence; the viewer shows the credit (under the «?»).
- Address search: [Nominatim](https://nominatim.org), with OpenStreetMap data. What is typed in the search box is
  sent to it, once, when the form is sent; nothing else leaves the page.
- The old plans of the timeline (1838, 1875, 1903, 1920, 1944, the damage map of November 1944, 1955, 1981): the
  city's «Historische Stadtpläne», scanned and georeferenced by its survey office.
  [Datengrundlage: Stadt Freiburg, www.freiburg.de](https://geoportal.freiburg.de/freigis/),
  [Datenlizenz Deutschland – Namensnennung – Version 2.0](https://www.govdata.de/dl-de/by-2-0). Changed here: cut to
  the area and compressed. Each plan's record in the city's catalogue is linked from the timeline.
- Terrain: [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (Mapzen, on AWS Open Data), built in Europe
  mostly from Copernicus EU-DEM and SRTM ([attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md)).
  Everything stands on the lowest ground under it; the woods are OSM's, the trees inside them are placed by the viewer.
- Facts about the Münster: English and German Wikipedia (CC BY-SA), cited in `src/places/muenster.js`.
