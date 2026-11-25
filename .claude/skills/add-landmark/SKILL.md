---
name: add-landmark
description: Add a hand-made landmark (a building, a square, a garden) to the Freiburg viewer, with its sources, photos and checks. Use when asked to add or rework a place in src/places/.
---

# Adding a landmark

Read `CLAUDE.md` and the "Adding a landmark" part of `README.md` first. Models to follow:
`src/places/kollegiengebaeude-1.js` (made from OSM building:parts), `src/places/colombischloessle.js`,
`src/places/schlossbergturm.js` (no OSM outline: placed at sourced coordinates) and `src/places/kastaniengarten.js`
(a group on a slope).

## Steps

1. **Is it inside the map?** Look for it in `sources/osm/*.json` and `public/data/city.json` (by name; if the name
   is not there, by coordinates from a source that is not OSM). The area is `BOUNDS` in `src/geo.js`. If it is
   outside, say so and stop.
2. **Research, with sources opened in this session**: German and English Wikipedia, the «Liste von historischen
   Objekten in der Freiburger Altstadt», Wikimedia Commons descriptions, the owner's own pages. Quote what is taken.
   When two sources disagree, the card says so. Nothing from memory.
3. **Write `src/places/<key>.js`**: a header comment (how it is made, what is ASSUMED), `PLACE` (key, name,
   localName, kind, built, `since` if it was completed after 1838, `war` if it stood in 1944 and a source says what
   the raid of 27 November 1944 did to it, coordinates from a non-OSM source, osm, sources, assumptions, card) and
   `build(kit, parts, city)`. Model what is seen from above and from the street at a distance: volumes, roofs,
   towers, rows of openings. Under 25,000 vertices for a building, 90,000 for a group.
4. **Register it**: import and LAST entry in `PLACES` (`src/places/index.js`); its OSM outlines in
   `src/places/osm-ids.js`; 2–3 photos in `src/places/photos.js` (public domain or Creative Commons only;
   `node tools/photo-search.mjs "…"` lists candidates). Then `npm run city`, `npm run photos`, and look at each
   downloaded picture before writing its caption.
5. **Check**: `npm run check -- <key>` must pass everything; `npm run build`; screenshots from at least two sides
   and one with `--ink` (`node tools/shot.mjs`), looked at, and what looks wrong fixed (floating or buried pieces,
   holes, roofs poking through).
6. **Finish**: `npm run ages` (so the timeline knows the ground is taken), `node tools/pace.mjs`, add the place to
   the list at the top of `README.md`.
7. **Report**: OSM ids, `since`, `war`, vertices, photos with licences, the facts with their sources, every
   assumption, where sources disagreed, what could not be verified.

## Several landmarks at once

Each can go to a subagent with this skill as its brief, one place each. They share three files (`index.js`,
`osm-ids.js`, `photos.js`): small targeted insertions only, re-reading right before editing. And they share the
network, the city data and the test browser, so each wraps those commands:

    node tools/run-locked.mjs net --gap 2600 -- <anything that makes a web request>
    node tools/run-locked.mjs city -- npm run city        # and `npm run check -- <key>` right after, same lock
    node tools/run-locked.mjs shot -- node tools/shot.mjs <out.png> --view x,y,z,tx,ty,tz

Subagents do not run `npm run ages`, do not commit, and keep downloads and screenshots outside the repository.
Whoever coordinates runs `npm run city`, `npm run ages`, the build, every check and `tools/pace.mjs` at the end.
