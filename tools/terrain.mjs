// The lie of the land: an elevation grid for the area of the city, from the open Terrain Tiles on AWS (Mapzen's
// "terrarium" tiles, zoom 15; in Europe they are built mostly from Copernicus EU-DEM and SRTM — see
// https://github.com/tilezen/joerd/blob/master/docs/attribution.md). They are a terrain model at about 30 m
// resolution: the Schlossberg is there, a single house is not.
//   node tools/terrain.mjs   -> sources/terrain/<z>-<x>-<y>.png (the tiles, downloaded once)
//                               public/data/terrain.bin (heights in centimetres, Int16, row by row from the north-west)
//                               public/data/terrain.json (the grid: origin, step, size, and the base height)
// Heights are relative to the ground at the origin (the Münster, src/geo.js): 0 there, positive uphill.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { BOUNDS, toWorld, toLatLon } from '../src/geo.js';

const Z = 15, STEP = 4; // tile zoom, and the grid's spacing in metres
const DIR = 'sources/terrain', USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';
const MARGIN = 300; // metres of terrain beyond the city, so the hills do not stop at its edge

const tileX = (lon) => ((lon + 180) / 360) * 2 ** Z;
const tileY = (lat) => { const r = (lat * Math.PI) / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z; };

// the area in world metres, with the margin
const [ax0, az0] = toWorld(BOUNDS.north, BOUNDS.west), [ax1, az1] = toWorld(BOUNDS.south, BOUNDS.east);
const x0 = ax0 - MARGIN, z0 = az0 - MARGIN, x1 = ax1 + MARGIN, z1 = az1 + MARGIN;
const [north, west] = toLatLon(x0, z0), [south, east] = toLatLon(x1, z1);
const tx0 = Math.floor(tileX(west)), tx1 = Math.floor(tileX(east)), ty0 = Math.floor(tileY(north)), ty1 = Math.floor(tileY(south));

mkdirSync(DIR, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const tiles = new Map();
let first = true;
for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
  const file = `${DIR}/${Z}-${tx}-${ty}.png`;
  if (!existsSync(file)) {
    if (!first) await wait(2600);
    first = false;
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) { console.error(`${url}: HTTP ${res.status}`); process.exit(1); }
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log('downloaded', file);
  }
  const { data, info } = await sharp(readFileSync(file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== 256 || info.height !== 256) throw new Error(`${file}: not a 256 px tile`);
  tiles.set(`${tx},${ty}`, data);
}

/** metres above sea level at a latitude/longitude, bilinear between the tile's pixels */
function elevation(lat, lon) {
  const fx = tileX(lon) * 256 - 0.5, fy = tileY(lat) * 256 - 0.5;
  const px = Math.floor(fx), py = Math.floor(fy), ax = fx - px, ay = fy - py;
  const at = (X, Y) => {
    const t = tiles.get(`${Math.floor(X / 256)},${Math.floor(Y / 256)}`); if (!t) return NaN;
    const i = ((Y % 256) * 256 + (X % 256)) * 3;
    return t[i] * 256 + t[i + 1] + t[i + 2] / 256 - 32768; // (the terrarium encoding)
  };
  return (at(px, py) * (1 - ax) + at(px + 1, py) * ax) * (1 - ay) + (at(px, py + 1) * (1 - ax) + at(px + 1, py + 1) * ax) * ay;
}

const W = Math.ceil((x1 - x0) / STEP) + 1, H = Math.ceil((z1 - z0) / STEP) + 1;
const base = elevation(...toLatLon(0, 0));
const out = new Int16Array(W * H);
let lo = Infinity, hi = -Infinity;
for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
  const h = elevation(...toLatLon(x0 + i * STEP, z0 + j * STEP)) - base;
  out[j * W + i] = Math.round(h * 100); lo = Math.min(lo, h); hi = Math.max(hi, h);
}
writeFileSync('public/data/terrain.bin', Buffer.from(out.buffer));
writeFileSync('public/data/terrain.json', JSON.stringify({
  source: 'Terrain Tiles (Mapzen/AWS Open Data; Copernicus EU-DEM, SRTM and others)', x0, z0, step: STEP, width: W, height: H,
  base: Math.round(base * 10) / 10,
}));
console.log(`grid ${W} × ${H} at ${STEP} m; base ${base.toFixed(1)} m above sea level; from ${lo.toFixed(1)} to ${hi.toFixed(1)} m around it`);
