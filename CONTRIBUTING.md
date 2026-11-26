# Contributing

Thank you for wanting to help. This is a viewer of Freiburg im Breisgau through time: today's city from
OpenStreetMap, the city's own old plans under it, and landmarks made by hand. `README.md` explains how it is made;
this page is what you need to work on it.

## The rules that do not bend

1. **Nothing is invented.** Every year, architect, name and measure carries its source in the file: which page, and
   the words taken from it. What was filled in so a model closes (heights, the number of windows, the side no photo
   shows) is an **assumption**: it is listed in the file and told to the reader on the place's card. When two sources
   disagree, the card says so instead of choosing. When no source says, it is left out.
2. **Historically accurate at every year.** The timeline shows the city of each year, so a building appears from the
   year it stood (`since`), disappears from the year it was gone (`until`), and lies in ruins after the raid of
   27 November 1944 if a source says it did (`war`). A place that was rebuilt differently is several places, one per
   building (see the Hauptbahnhof: three files).
3. **Positions come from data**, never from memory: OpenStreetMap outlines, coordinates from a second source, or a
   footprint traced from one of the city's georeferenced plans (and the file says which plan and how exact it is).
4. **What the plans tell is an estimate.** Which ordinary buildings stood in which year, the buildings that are gone
   and the ruins are read off the old plans by `tools/ages.mjs`: an inference, not a record. Wherever it is shown,
   it says so. Keep it that way.
5. **Photos**: public domain or Creative Commons only, from Wikimedia Commons, each with its author, date and
   licence (`tools/photos.mjs` records them and refuses anything else). Look at a picture before writing its caption.
6. **Manners with other people's servers**: one request at a time, at least 2.5 seconds apart, as
   `historic-maps/1.0 (viewer of old city maps)`, with no personal data. No crawling.
7. **Nothing personal in the repository**: no real names, e-mail addresses or paths of your machine in files or
   commits. Contributors are credited by their GitHub user name.
8. Everything is in **English**: code, comments, texts, commit messages. Plain JavaScript, no framework.

## Setting up

    npm install          # Node 22 or newer
    npm run dev          # the viewer, http://localhost:5173
    npm run build        # must always pass

The viewer runs straight away: everything it shows is in `public/`. Two more things are only needed for some work:

- **Screenshots and the speed test** (`node tools/shot.mjs`, `node tools/pace.mjs`) use Chrome for Testing, never
  your everyday browser: `npx playwright-core install chromium`, once. They work on macOS, Linux and Windows
  (`tools/browser.mjs` holds what differs).
- **The downloads** (`sources/`: the OpenStreetMap extract, terrain tiles, plan scans, original photos) are not in
  the repository. Fetch them when you need to regenerate data — adding a landmark does:
  `node tools/osm.mjs --refresh`, `npm run terrain`, `npm run plan`, `npm run photos` (a few minutes).

## What is generated, and from what

Do not edit `public/data/` or `public/plan/` by hand.

| File | Made by | From |
|---|---|---|
| `public/data/terrain.*` | `npm run terrain` | open terrain tiles, over `BOUNDS` (`src/geo.js`) |
| `public/plan/*.webp`, `plans.json` | `npm run plan` | the city's historical plans (its map service), over the same area |
| `public/data/city.json` | `npm run city` | `sources/osm/` and `src/places/osm-ids.js` |
| `public/data/ages.json` | `npm run ages` | `city.json`, the plans, and the places' `since` / `until` / `footprint` |
| `public/photos/` | `npm run photos` | `src/places/photos.js` and Wikimedia Commons |

After `npm run city`, run `npm run ages`. After either, run the checks below and look at what changed.

## Adding or changing a landmark

Each landmark is one file in `src/places/` exporting `PLACE` (facts, sources, assumptions, the card) and `build()`
(its shape, out of simple solids from `src/kit.js`). The steps are in `README.md` («Adding a landmark») and, in
full, in `.claude/skills/add-landmark/SKILL.md` — written for Claude Code, but it is the checklist for a person too.
In short: find it in the data, research with sources, write the file, register it last in `src/places/index.js`,
add its outline to `osm-ids.js` and its photos to `photos.js`, regenerate, check, look at it from several sides.

What a place can say about time (all optional, all sourced; the comment at the top of `src/places/index.js` has
the details):

| Field | Meaning |
|---|---|
| `since` | the year it stood; hidden at the stops before |
| `until` | the year it was gone; hidden from then on, and today |
| `war` | what the raid of 27 November 1944 did: `'ruin'`, `'damaged'` or `'spared'`, the year it stood again, the source |
| `footprint` | for a place that is gone and has no outline in OpenStreetMap: its outline, traced from an old plan |

Budget: a single building under 25,000 vertices, a group under 90,000. Model what a draughtsman would draw from a
distance — volumes, roofs, towers, rows of openings — not interiors or mouldings.

## Keeping the map data fresh, and growing the map

- **Fresh OpenStreetMap data**: `node tools/osm.mjs --refresh`, then `npm run city && npm run ages`, every check, and
  a look at the difference in `public/data/city.json` (a mapper may have moved an outline a landmark stands on).
  Commit the regenerated data with the refresh.
- **A larger area**: move `BOUNDS` in `src/geo.js`, then `npm run terrain`, `node tools/osm.mjs --refresh`,
  `npm run plan`, `npm run city`, `npm run ages`. Before that, check how far each old plan reaches over the new
  area: where a sheet does not reach, nothing is shown standing at that year, and the viewer says so. The city is
  drawn in tiles (`src/city.js`), so more buildings cost little; the ground and the plans are still one picture
  each, which is fine while the map only grows in one direction and will need tiles when it grows in both.

## Before you send a change

    npm run build
    npm run check -- <key>      # for every place you touched (all of them after regenerating data)
    node tools/pace.mjs         # frame time and memory; prints a shader error if there is one
    node tools/shot.mjs out.png --view x,y,z,tx,ty,tz [--plan 1920] [--ink] [--select <key>]

Look at the screenshots in both looks (colour and ink) and at the years your change affects. `tools/pace.mjs` is a
must after touching `src/look.js`: a shader that does not compile takes the whole picture with it.

Then open a pull request against `main`: one subject per request, with a title that says what changed for someone
looking at the viewer («The Hauptbahnhof, a building for each period»), and in the description what is assumed,
where sources disagreed and what could not be found. If you worked with an AI assistant, leave its
`Co-Authored-By` line in the commit.

## Working with Claude Code

`CLAUDE.md` is read by Claude Code at the start of a session: the rules above in short, the commands, the working
habits. The skill `add-landmark` is the brief for building a place; several can be built side by side by subagents,
which then share the network, the city data and the test browser through `node tools/run-locked.mjs` (the skill
says how). Whatever an assistant writes is held to the same rules: sources opened, not remembered.

## Known limits (good places to help)

- A present-day building counts as old when an old plan shows something built on its ground, so some modern blocks
  stand at early years (visibly so around the station).
- Buildings that are gone are only known from the plan of 1920; their height, roofs and colours are assumed.
- The plan of 1838 does not reach the Wiehre, and that of 1875 is badly registered at the west edge.
- Landmarks that were only partly destroyed in 1944 are drawn whole; a ruin is always the whole building.
- The windows the shader paints may sit wrong on a landmark that stands on a slope (drawn openings do not).
- The Wiehre has no hand-made landmarks yet.
- Not tested on phones since the map grew.
