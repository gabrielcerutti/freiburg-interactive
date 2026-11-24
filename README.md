# Freiburg im Breisgau — interactive

The old town of Freiburg in 3D, in the browser: every building from OpenStreetMap with its roof, the streets, the
Bächle, the tram and OSM's trees on the ground, and landmarks modelled by hand: the Münster, the Martinstor and the
Schwabentor, the Historisches Kaufhaus and the two town halls. Two looks — colour, and an ink engraving.

    npm install
    npm run dev          # http://localhost:5173
    npm run build        # dist/

Drag to move, scroll to zoom, right-drag to turn. Click a landmark or its label to highlight it and open its card;
the card's name stays on top while the rest scrolls: all the photos of the place, each with its caption and credit;
click any of them to open it large in the viewer (← → to move, Esc to close).
**C** (or the button) switches between colour and ink; **Esc** closes the card.

Inspired by [«Buenos Aires, de 1867 a 1950»](https://github.com/mormonnegro/baires-interactivo) by @mormonnegro
(<https://baires.mormon.garden>). The code here is new, written from scratch in English, but the ideas are theirs:
a city drawn on its own map, hand-made landmarks built from simple solids, and every fact with its source.

## How it is made

| Step | File | What it does |
|---|---|---|
| 1 | `tools/osm.mjs` | Downloads buildings, building parts, streets, rail/tram, water and green areas for the old town from OpenStreetMap (Overpass) into `sources/osm/`. |
| 1b | `tools/terrain.mjs` | Downloads the open Terrain Tiles (zoom 15) over the area and writes an elevation grid every 4 m, relative to the ground at the Münster: `public/data/terrain.bin` and `.json`. The Schlossberg rises 175 m above the old town. |
| 2 | `tools/city.mjs` | Converts that to local metres and writes `public/data/city.json` (1.9 MB). Buildings claimed by a hand-made place (`src/places/osm-ids.js`) are tagged with its key. |
| 3 | `src/buildings.js` | Turns each footprint into walls and a roof (gabled, hipped, pyramidal, skillion, flat) from its OSM tags. What OSM does not say is filled in and **counted as assumed**. |
| 4 | `src/ground.js` | The ground: two small maps of what each point is (street, green, water, and which kind), which the shader turns into crisp, painted surfaces at any zoom; the terrain's shape; and the Bächle and the rails as ribbons on it. A historical map will come in here later. |
| 4b | `src/trees.js` | OSM's trees and tree rows, and trees filling OSM's woods, as instanced lumpy crowns and trunks. |
| 4c | `src/look.js` | The shader: façades (windows, frames, shutters, doors), roof tiles and ridges, stone, cobbles, grass, water, foliage; the ink look (sepia paper, ink, hatching laid on the surfaces) and the highlight of a selected landmark. |
| 4d | `tools/photos.mjs`, `src/places/photos.js`, `src/photos.js` | The photos: the list with captions, the tool that fetches them from Wikimedia Commons with author, date and licence (public domain or Creative Commons only), and the viewer. |
| 5 | `src/places/` | The hand-made landmarks. Each file exports `PLACE` (facts, sources, assumptions, card) and `build()`. |
| 6 | `src/main.js` | The scene, light, camera (three.js `MapControls`) and labels. |

Coordinates (`src/geo.js`): metres from the Münster; x east, y up, z south.

### Tools

| Command | What it does |
|---|---|
| `npm run osm`, `npm run terrain`, `npm run city` | Download OSM and the terrain, and build `public/data/`. |
| `node tools/photo-search.mjs "words"` | Lists candidate photos on Wikimedia Commons with licence, author and date. |
| `npm run photos` | Fetches the photos listed in `src/places/photos.js` into `public/photos/`. |
| `npm run check -- <key>` | Checks a place against its own sources. |
| `node tools/shot.mjs out.png [--view …] [--ink] [--select key] [--viewer]` | A headless screenshot. |
| `node tools/pace.mjs [--hide a,b]` | Frame time, triangles and the browser's memory, with a watchdog. |

The screenshot and pace tools always kill their test browser at the end and stop themselves after a time limit.

### Stack

Plain JavaScript, no framework. [three.js](https://threejs.org) for 3D, [Vite](https://vite.dev) for the dev server
and the build, Node for the tools, and [playwright-core](https://playwright.dev) with Chrome for Testing for
screenshots (`node tools/shot.mjs`).

## Adding a landmark

1. Find its OSM outline. If OSM already has `building:part`s for it, start from those (as the Münster does).
2. Add `src/places/<key>.js` with `PLACE` and `build(kit, parts)`. The kit (`src/kit.js`) has `box`, `cylinder`,
   `pyramid`, `prism`, `beam` and `put` (any three.js geometry), all in the place's own metres.
3. List its outline in `src/places/osm-ids.js` and its module in `src/places/index.js`, then `npm run city`.
4. `npm run check -- <key>`: it must build, stay under budget (25,000 vertices for a building, 90,000 for a group),
   fall where its coordinates say, and match its sourced height and length.

**Facts need sources; guesses are called guesses.** Every year, height and measurement in a place comes from a
source you can reopen (a page, a photo, OSM), and the file says which. What had to be made up for the model to close
(the pattern of the tracery, a hidden side) goes under `assumptions`, and the card says so to the reader too.

## Data and licences

- Code: MIT (`LICENSE`).
- Map data: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL. `public/data/city.json`
  is derived from it and keeps that licence; the viewer shows the credit.
- Terrain: [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (Mapzen, on AWS Open Data), built in Europe
  mostly from Copernicus EU-DEM and SRTM ([attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md)).
  Everything stands on the lowest ground under it; the woods are OSM's, the trees inside them are placed by the viewer.
- Facts about the Münster: English and German Wikipedia (CC BY-SA), cited in `src/places/muenster.js`.
