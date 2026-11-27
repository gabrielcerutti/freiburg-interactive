// Coordinates: latitude/longitude <-> local metres. Shared by the browser and the tools in tools/.
//
// The world is in metres with its origin at the Münster (the coordinates on the English Wikipedia page
// "Freiburg Minster": 47.99556 N, 7.85306 E). Axes follow three.js conventions:
//   x  grows to the east
//   y  grows upwards
//   z  grows to the south (so north is -z)
// Over a couple of kilometres a flat (equirectangular) projection is accurate to a few centimetres, which is far
// better than the data we put on it.

export const ORIGIN = { lat: 47.99556, lon: 7.85306 };

const M_PER_DEG_LAT = 111_132; // metres per degree of latitude (mean value near 48°)
const M_PER_DEG_LON = 111_320 * Math.cos((ORIGIN.lat * Math.PI) / 180);

/** lat/lon -> [x, z] in metres */
export function toWorld(lat, lon) {
  return [(lon - ORIGIN.lon) * M_PER_DEG_LON, -(lat - ORIGIN.lat) * M_PER_DEG_LAT];
}

/** [x, z] in metres -> [lat, lon] */
export function toLatLon(x, z) {
  return [ORIGIN.lat - z / M_PER_DEG_LAT, ORIGIN.lon + x / M_PER_DEG_LON];
}

/**
 * The area the city covers: the old town inside the former ring of walls with a margin, and south of the Dreisam the
 * Wiehre, as far as the plans of 1875 and 1903 reach (about 47.979), and west of the railway the Stühlinger, as far
 * as the plan of 1920 — the one the buildings' years are read from — covers whole (7.830; that of 1875 ends at 7.832),
 * and to the north Herdern with its old village, as far as the plan of 1903 reaches (48.011; that of 1875 goes on to
 * 48.013, and that of 1920 misses the two northern corners, its sheet lying askew).
 */
export const BOUNDS = { south: 47.979, west: 7.83, north: 48.011, east: 7.862 };
