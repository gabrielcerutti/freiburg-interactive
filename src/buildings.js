// Turning an OpenStreetMap footprint into a solid: walls and a roof, in world metres (src/geo.js).
// Used by the generic city (src/city.js) and by hand-made places that start from their OSM parts.
//
// What comes from OSM and what is assumed (resolve(), below, records which is which in `assumed`):
//   - the footprint, `height`, `min_height`, `building:levels`, `roof:shape`, `roof:height`, `roof:levels`,
//     `roof:orientation`, `building:colour` and `roof:colour` are data, used as they are;
//   - ASSUMED when missing: 3.1 m per level and 2.6 m per roof level; 3 levels if nothing says how tall it is;
//     a gabled roof; a roof height of about half the building's width (a 45° pitch), between 1.5 and 9 m;
//     plaster colours for the walls and red tiles for the roofs, picked per building from a small palette.
//
// The roof is the lowest of a few sloping planes laid over the footprint's oriented bounding box: two planes make a
// gabled roof, four a hipped or pyramidal one, one a skillion. Where the plane in charge changes there is a crease
// (the ridge, the hips): the footprint is cut along it so every piece of roof is flat, and the walls get a vertex
// there so the gable ends rise to meet the roof.
import * as THREE from 'three';

export const LEVEL = 3.1, ROOF_LEVEL = 2.6, DEFAULT_LEVELS = 3;
const FLAT_TYPES = new Set(['roof', 'garage', 'garages', 'carport', 'parking', 'construction', 'container']);
const FLAT_SHAPES = new Set(['flat', 'many']);
const DOMES = new Set(['dome', 'onion']); // (turned on a lathe over the footprint's middle)
const WALLS = ['#efe6d4', '#e8d9b5', '#e9d2bf', '#f2eee4', '#ddd6c6', '#e6caa0', '#d9c7b0'];
const ROOFS = ['#a5553a', '#9a4b33', '#b0613f', '#8e4a36', '#a85d44'];

const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
// OSM colours come as hex codes (#EFC392: used as they are) or as words ("red", "light_grey", "darkbrown"). A word
// only says roughly what colour it is, and the pure CSS colour (red = #ff0000) looks like neon on a roof, so words
// are read as the muted tone of real materials below. Anything else falls back to the palette.
const WORDS = {
  red: '#a5553a', darkred: '#8a3f2e', orange: '#c07a45', brown: '#7a5343', darkbrown: '#5e4031', yellow: '#d6bf78',
  beige: '#e3d3b1', cream: '#efe4c8', rose: '#d9a99c', pink: '#d9a99c', green: '#6f8a5e', darkgreen: '#4f6447',
  turquoise: '#6f9c8a', turqoise: '#6f9c8a', teal: '#5f8a80', blue: '#5f7187', lightblue: '#8ea3b3', darkblue: '#47566b',
  grey: '#8d8a85', gray: '#8d8a85', lightgrey: '#b9b5ad', lightgray: '#b9b5ad', darkgrey: '#5d5b58', darkgray: '#5d5b58',
  silver: '#a9a8a4', black: '#3d3a37', white: '#efeae0', copper: '#6f9c8a',
};
const colour = (css, fallback) => {
  const c = new THREE.Color(), s = (css ?? '').trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(s)) return c.setStyle(s);
  const word = WORDS[s.replace(/[\s_-]/g, '')];
  return c.set(word ?? fallback);
};

// ------------------------------------------------------------------------------------------------------ 2D helpers
const insideRing = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
const signedArea = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };
function hull(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
/** The smallest rectangle around the points: centre, unit axis along its long side, half length and half width. */
export function orientedBox(pts) {
  const h = hull(pts); let best = null;
  for (let i = 0; i < h.length; i++) {
    const a = h[i], b = h[(i + 1) % h.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1e-6) continue;
    const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], v = [-u[1], u[0]];
    let s0 = Infinity, s1 = -Infinity, t0 = Infinity, t1 = -Infinity;
    for (const p of h) { const s = p[0] * u[0] + p[1] * u[1], t = p[0] * v[0] + p[1] * v[1]; s0 = Math.min(s0, s); s1 = Math.max(s1, s); t0 = Math.min(t0, t); t1 = Math.max(t1, t); }
    const A = (s1 - s0) * (t1 - t0);
    if (!best || A < best.A) best = { A, u, v, s: (s0 + s1) / 2, t: (t0 + t1) / 2, hl: (s1 - s0) / 2, hw: (t1 - t0) / 2 };
  }
  if (!best) return { c: pts[0], u: [1, 0], v: [0, 1], hl: 0, hw: 0 };
  const { u, v, s, t } = best; let { hl, hw } = best;
  let U = u, V = v;
  if (hw > hl) { [hl, hw] = [hw, hl]; U = v; V = [-u[0], -u[1]]; } // (u always along the long side)
  return { c: [u[0] * s + v[0] * t, u[1] * s + v[1] * t], u: U, v: V, hl, hw };
}

/** Keeps the part of a polygon where f(x, z) <= 0, f linear: f = a·x + b·z + c (Sutherland–Hodgman). */
function clip(poly, [a, b, c]) {
  const out = [], f = (p) => a * p[0] + b * p[1] + c;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp <= 0) out.push(p);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
}

/** A footprint (its rings) stepped in by d metres on every side: the outline inwards, the courtyards outwards. */
export function shrunk(rings, d) {
  return rings.map((ring, k) => {
    const sign = Math.sign(signedArea(ring)) * (k === 0 ? 1 : -1), n = ring.length;
    const out = ring.map((p, i) => { const q = ring[(i + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz); return l < 1e-6 ? null : [(dz / l) * sign, (-dx / l) * sign]; });
    return ring.map((p, i) => {
      let a = null, b = out[i];
      for (let j = 1; j <= n && !a; j++) a = out[(i - j + n) % n];
      for (let j = 1; j <= n && !b; j++) b = out[(i + j) % n];
      if (!a || !b) return p;
      const k2 = d / Math.max(0.3, 1 + a[0] * b[0] + a[1] * b[1]); // (along the corner's bisector, so both walls move by d)
      return [p[0] - (a[0] + b[0]) * k2, p[1] - (a[1] + b[1]) * k2];
    });
  });
}

// --------------------------------------------------------------------------------------------- what to build, exactly
/** OSM tags (as tools/city.mjs stores them) -> the numbers the solid needs, and the list of what had to be assumed. */
export function resolve(b) {
  const assumed = [], box = orientedBox(b.rings[0]);
  let shape = b.roofShape;
  if (!shape) { shape = FLAT_TYPES.has(b.type) ? 'flat' : 'gabled'; assumed.push('roof shape'); }
  if (FLAT_SHAPES.has(shape)) shape = 'flat';

  let minH = b.minHeight ?? (b.minLevel != null ? b.minLevel * LEVEL : 0);
  if (b.type === 'roof' && b.minHeight == null) { minH = 2.5; assumed.push('canopy height'); }
  if (b.type === 'bridge' && b.minHeight == null) { minH = 4.5; assumed.push('clearance under the bridge'); }

  let roofH;
  if (shape === 'flat') roofH = 0;
  else if (DOMES.has(shape) && b.roofHeight == null) { roofH = Math.max(1, box.hw * 1.6); assumed.push('roof height'); }
  else if (b.roofHeight != null) roofH = b.roofHeight;
  else if (b.roofLevels) roofH = b.roofLevels * ROOF_LEVEL;
  else { roofH = Math.min(9, Math.max(1.5, box.hw)); assumed.push('roof height'); }

  let height = b.height;
  if (height == null) {
    if (b.type === 'roof') height = minH + 0.4;
    else if (b.levels != null) height = b.levels * LEVEL + roofH;
    else { height = DEFAULT_LEVELS * LEVEL + roofH; assumed.push('height'); }
  }
  // (a roof taller than the building leaves no wall: keep at least half a metre of wall)
  roofH = Math.max(0, Math.min(roofH, height - minH - 0.5));
  const wallTop = height - roofH;

  const wall = colour(b.colour, WALLS[hash(b.id) % WALLS.length]);
  const roof = colour(b.roofColour, shape === 'flat' ? '#9c968a' : ROOFS[hash(b.id + 'r') % ROOFS.length]);
  if (!b.colour) assumed.push('wall colour');
  if (!b.roofColour) assumed.push('roof colour');
  return { shape, minH, wallTop, roofH, box, across: b.roofOrientation === 'across', wall, roof, assumed };
}

/** The roof planes, as functions in world x, z: value 0 at the eaves, 1 at the top (and above 1 is cut by the others). */
function planes({ shape, box, across }) {
  if (DOMES.has(shape)) return [];
  let { c, u, v, hl, hw } = box;
  if (across) { [u, v] = [v, [-u[0], -u[1]]]; [hl, hw] = [hw, hl]; } // the ridge runs across instead of along
  hl = Math.max(hl, 0.01); hw = Math.max(hw, 0.01);
  // s along the ridge and t across it, both 0 at the centre: s = u·(p − c), t = v·(p − c)
  const lin = (ku, kv, k0) => [ku * u[0] + kv * v[0], ku * u[1] + kv * v[1], k0 - (ku * (u[0] * c[0] + u[1] * c[1]) + kv * (v[0] * c[0] + v[1] * c[1]))];
  const gable = [lin(0, -1 / hw, 1), lin(0, 1 / hw, 1)];
  switch (shape) {
    case 'skillion': return [lin(0, 1 / (2 * hw), 0.5)];
    case 'pyramidal': return [...gable, lin(-1 / hl, 0, 1), lin(1 / hl, 0, 1)];
    case 'hipped': case 'half-hipped': case 'side_hipped': case 'mansard': case 'quadruple_saltbox':
      return [...gable, lin(-1 / hw, 0, hl / hw), lin(1 / hw, 0, hl / hw)];
    default: return gable; // gabled and everything else that has a ridge (round, gambrel, saltbox…)
  }
}

// --------------------------------------------------------------------------------------------------------- building
/**
 * What the shader (src/look.js) paints on a surface, one vec4 per vertex: [base, eaves, seed, kind].
 * kind 1 plain, 2 a wall with windows (floors counted from `base`, none above `eaves`), 3 roof tiles, 4 dressed stone,
 * 5 foliage, 6 a runnel (a: −1…1 across it), 7 a track (a: metres from its middle, b: half its gauge).
 * 8 a roof of glazed tiles laid in coloured diamonds. For both kinds of roof a is the height of the ridge and b the
 * height of the eaves.
 * (1 is what WebGL hands a mesh that has no such attribute at all, like the trees: plain.)
 */
export const KIND = { PLAIN: 1, WINDOWS: 2, TILES: 3, STONE: 4, FOLIAGE: 5, RUNNEL: 6, TRACK: 7, DIAMONDS: 8 };
const PLAIN = [0, 0, 0, KIND.PLAIN];

/**
 * Collects triangles with flat normals, one colour per triangle and what the shader paints on it.
 * `when` (optional, set before adding a building): [the ground under it, the stops of the timeline at which it
 * stands, one bit each] — the shader raises it from that ground and lowers it back as the timeline moves (src/look.js).
 */
export class Mesher {
  constructor() { this.pos = []; this.nor = []; this.col = []; this.fac = []; this.whn = []; this.when = null; this.seg = []; }
  /** an outline to draw in ink, from a to b, for a thing that names its own (the rest get theirs from their edges: src/city.js) */
  line(a, b) { this.seg.push(a[0], a[1], a[2], b[0], b[1], b[2]); }
  get vertices() { return this.pos.length / 3; }
  /** one triangle; `want` is the direction its face should look (it is flipped to match) */
  tri(a, b, c, colr, want, fac = PLAIN) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz); if (l < 1e-9) return;
    nx /= l; ny /= l; nz /= l;
    if (want && nx * want[0] + ny * want[1] + nz * want[2] < 0) { [b, c] = [c, b]; nx = -nx; ny = -ny; nz = -nz; }
    for (const p of [a, b, c]) {
      this.pos.push(p[0], p[1], p[2]); this.nor.push(nx, ny, nz); this.col.push(colr.r, colr.g, colr.b); this.fac.push(fac[0], fac[1], fac[2], fac[3]);
      if (this.when) this.whn.push(this.when[0], this.when[1]);
    }
  }
  /** any three.js geometry (indexed or not), with a matrix and a colour */
  geometry(g, colr, matrix, fac = PLAIN) {
    const geo = (g.index ? g.toNonIndexed() : g.clone()); if (matrix) geo.applyMatrix4(matrix);
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 9) this.tri([p[i], p[i + 1], p[i + 2]], [p[i + 3], p[i + 4], p[i + 5]], [p[i + 6], p[i + 7], p[i + 8]], colr, null, fac);
    geo.dispose();
  }
  toGeometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('aFacade', new THREE.Float32BufferAttribute(this.fac, 4));
    if (this.whn.length === (this.pos.length / 3) * 2) g.setAttribute('aWhen', new THREE.Float32BufferAttribute(this.whn, 2));
    g.computeBoundingSphere();
    return g;
  }
}

/**
 * Adds one OSM building (as stored in city.json) to a Mesher. Returns what resolve() decided.
 * `roof`: KIND.TILES (the default) or KIND.DIAMONDS.
 * `lift`: the height of the ground under it (src/terrain.js). `chimneys`: add assumed chimneys (the generic city).
 * `walls`: what the shader paints on the walls — KIND.WINDOWS (the default: floors of windows, ASSUMED, as OSM does
 * not map them) or KIND.STONE (for churches and towers, whose openings a place draws itself).
 * A building with an `inset` (tools/city.mjs: its walls share a plane with a taller neighbour's) is drawn that much
 * smaller all around and lower, so the two do not flicker.
 */
export function addBuilding(m, b, { walls = KIND.WINDOWS, roof = KIND.TILES, lift = 0, chimneys = false } = {}) {
  if (b.inset) b = { ...b, rings: shrunk(b.rings, b.inset) };
  const r = resolve(b), P = r.shape === 'flat' ? [] : planes(r), floats = r.minH > 0;
  if (b.inset) r.wallTop = Math.max(r.minH + 0.3, r.wallTop - b.inset);
  r.minH += lift; r.wallTop += lift; // (`lift`: the height of the ground the building stands on)
  const seed = (hash(b.id) % 1000) / 1000;
  const fWall = [r.minH, r.wallTop, seed, walls], fRoof = [r.wallTop + r.roofH, r.wallTop, seed, roof];
  if (walls === KIND.WINDOWS) r.assumed.push('windows');
  const roofAt = (x, z) => { if (!P.length) return 0; let h = Infinity; for (const [a, bb, c] of P) h = Math.min(h, a * x + bb * z + c); return Math.max(0, Math.min(1, h)) * r.roofH; };
  const top = (p) => r.wallTop + roofAt(p[0], p[1]);

  // walls: every ring, every edge, split where the roof plane in charge changes
  r.walls = 0;
  b.rings.forEach((ring, k) => {
    const sign = Math.sign(signedArea(ring)) * (k === 0 ? 1 : -1); // (+1: the solid is on the left of each edge)
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1];
      const len = Math.hypot(dx, dz); if (len < 1e-3) continue;
      const out = [(dz / len) * sign, 0, (-dx / len) * sign];
      const ts = [0, 1];
      for (let a = 0; a < P.length; a++) for (let c = a + 1; c < P.length; c++) {
        const f = (pt) => (P[a][0] - P[c][0]) * pt[0] + (P[a][1] - P[c][1]) * pt[1] + (P[a][2] - P[c][2]);
        const fp = f(p), fq = f(q); if (fp * fq < 0) ts.push(fp / (fp - fq));
      }
      ts.sort((x, y) => x - y);
      for (let j = 0; j < ts.length - 1; j++) {
        const A = [p[0] + dx * ts[j], p[1] + dz * ts[j]], B = [p[0] + dx * ts[j + 1], p[1] + dz * ts[j + 1]];
        const a0 = [A[0], r.minH, A[1]], b0 = [B[0], r.minH, B[1]], a1 = [A[0], top(A), A[1]], b1 = [B[0], top(B), B[1]];
        m.tri(a0, b0, b1, r.wall, out, fWall); m.tri(a0, b1, a1, r.wall, out, fWall);
      }
    }
  });

  // roof: flat (with its courtyards), or one flat piece per plane
  const up = [0, 1, 0];
  const fill = (contour, holes, y, want = up) => {
    const v2 = (pts) => pts.map((p) => new THREE.Vector2(p[0], p[1]));
    const all = [contour, ...holes].flat();
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(v2(contour), holes.map(v2))) {
      const pi = all[i], pj = all[j], pk = all[k];
      m.tri([pi[0], y(pi), pi[1]], [pj[0], y(pj), pj[1]], [pk[0], y(pk), pk[1]], want === up ? r.roof : r.wall, want, want === up && P.length ? fRoof : PLAIN);
    }
  };
  if (!P.length || b.rings.length > 1) {
    // (courtyard buildings with a sloped roof are drawn flat: cutting a ridge around holes is left for later)
    fill(b.rings[0], b.rings.slice(1), () => r.wallTop + (P.length ? r.roofH * 0.5 : 0));
  } else {
    for (let i = 0; i < P.length; i++) {
      let region = b.rings[0];
      for (let j = 0; j < P.length && region.length >= 3; j++) if (j !== i) region = clip(region, [P[i][0] - P[j][0], P[i][1] - P[j][1], P[i][2] - P[j][2]]);
      if (region.length >= 3) fill(region, [], top);
    }
  }
  // a dome or an onion: turned on a lathe, as wide as the footprint's narrow side
  if (DOMES.has(r.shape) && r.roofH > 0) {
    const R = r.box.hw, H = r.roofH;
    const prof = r.shape === 'onion'
      ? [[0, 0], [R * 0.95, 0], [R * 1.12, 0.22], [R * 1.0, 0.45], [R * 0.6, 0.68], [R * 0.25, 0.85], [R * 0.1, 0.95], [0, 1]]
      : Array.from({ length: 7 }, (_, i) => { const a = (i / 6) * (Math.PI / 2); return [R * Math.cos(a), Math.sin(a)]; });
    const g = new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y * H)), 12);
    m.geometry(g, r.roof, new THREE.Matrix4().makeTranslation(r.box.c[0], r.wallTop, r.box.c[1]), fRoof);
    g.dispose();
  }
  // chimneys: one or two on a pitched roof of an ordinary house, near the ridge. ASSUMED — OSM does not map them:
  // they are there because a roofscape without them does not read as one.
  if (chimneys && P.length && b.rings.length === 1 && r.roofH >= 2.5 && r.box.hw > 3 && !DOMES.has(r.shape)) {
    const { c, u, v, hl, hw } = r.box, n = hl > 9 ? 2 : 1, brick = new THREE.Color().set(['#9c8474', '#8d7a70', '#a88f7c'][Math.floor(seed * 3)]);
    for (let i = 0; i < n; i++) {
      const s = hl * (n === 2 ? (i ? 0.5 : -0.5) : (seed - 0.5) * 0.9), t = hw * (0.22 + 0.2 * ((seed * 7.7 + i * 0.37) % 1)) * (((seed * 13 + i) % 1) < 0.5 ? -1 : 1);
      const x = c[0] + u[0] * s + v[0] * t, z = c[1] + u[1] * s + v[1] * t;
      if (!insideRing(b.rings[0], x, z)) continue;
      const y0 = r.wallTop + roofAt(x, z) - 0.3, y1 = r.wallTop + r.roofH + 0.55, h = 0.38;
      const q = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([a, d]) => [x + u[0] * a + v[0] * d, z + u[1] * a + v[1] * d]);
      for (let k = 0; k < 4; k++) {
        const p0 = q[k], p1 = q[(k + 1) % 4], out = [(p0[0] + p1[0]) / 2 - x, 0, (p0[1] + p1[1]) / 2 - z];
        m.tri([p0[0], y0, p0[1]], [p1[0], y0, p1[1]], [p1[0], y1, p1[1]], brick, out); m.tri([p0[0], y0, p0[1]], [p1[0], y1, p1[1]], [p0[0], y1, p0[1]], brick, out);
      }
      m.tri([q[0][0], y1, q[0][1]], [q[1][0], y1, q[1][1]], [q[2][0], y1, q[2][1]], brick, up); m.tri([q[0][0], y1, q[0][1]], [q[2][0], y1, q[2][1]], [q[3][0], y1, q[3][1]], brick, up);
    }
  }
  // a part that floats (a gallery, a canopy) gets a floor too, seen from below
  if (floats) fill(b.rings[0], b.rings.slice(1), () => r.minH, [0, -1, 0]);
  return r;
}

// ------------------------------------------------------------------------------------------------------------ ruins
/**
 * Adds what is left of a building after a fire: its outer walls, burnt, standing to a ragged height with their empty
 * windows, and rubble inside. ASSUMED, all of it — the damage map says "heavy damage to total loss", not what was
 * left of each house: how high each stretch of wall still stands (between a fifth of its height and all of it, with
 * breaches), that the roof and the floors are gone, the rubble.
 * A part that floats (a gallery, an upper storey mapped on its own) leaves nothing.
 * The walls are a single skin, to keep the ruins light: their mesh has to be drawn from both sides (src/city.js).
 */
export function addRuin(m, b, { lift = 0 } = {}) {
  const r = resolve(b), seed = (hash(b.id) % 1000) / 1000;
  if (r.minH > 0.5) return r;
  // (each ruin a little inside its footprint, by its own amount: two neighbours' party walls would otherwise lie in
  // the same plane and, with no roof to hide them, flicker)
  b = { ...b, rings: shrunk(b.rings, 0.1 + 0.15 * seed) };
  const foot = lift, ground = lift + 0.3, full = Math.max(3.5, r.wallTop);
  const soot = r.wall.clone().multiplyScalar(0.8).lerp(new THREE.Color('#5a4e43'), 0.3), rubble = new THREE.Color('#9a8f80');
  const fWall = [ground, ground + full, seed, KIND.WINDOWS];
  // how much of the wall is left at a point: the same for every wall that meets there
  const rnd = (x, z) => { const v = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return v - Math.floor(v); };
  const soft = (x, z) => { const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz); return (rnd(ix, iz) * (1 - sx) + rnd(ix + 1, iz) * sx) * (1 - sz) + (rnd(ix, iz + 1) * (1 - sx) + rnd(ix + 1, iz + 1) * sx) * sz; };
  const left = (x, z) => (0.22 + 0.78 * (0.6 * soft(x / 6, z / 6) + 0.4 * rnd(x, z))) * (soft(x / 9 + 40, z / 9 + 17) < 0.3 ? 0.3 : 1);
  b.rings.forEach((ring, k) => {
    const sign = Math.sign(signedArea(ring)) * (k === 0 ? 1 : -1);
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz); if (len < 1e-3) continue;
      const out = [(dz / len) * sign, 0, (-dx / len) * sign], n = Math.max(1, Math.ceil(len / 3.2));
      for (let j = 0; j < n; j++) {
        const A = [p[0] + (dx * j) / n, p[1] + (dz * j) / n], B = [p[0] + (dx * (j + 1)) / n, p[1] + (dz * (j + 1)) / n];
        const a0 = [A[0], foot, A[1]], b0 = [B[0], foot, B[1]], a1 = [A[0], ground + full * left(A[0], A[1]), A[1]], b1 = [B[0], ground + full * left(B[0], B[1]), B[1]];
        m.tri(a0, b0, b1, soot, out, fWall); m.tri(a0, b1, a1, soot, out, fWall); // (one skin: the ruins are drawn from both sides)
        m.line(a1, b1); if (j === 0) m.line([A[0], ground, A[1]], a1);             // (in ink: the broken top, and the corners)
      }
    }
  });
  // the rubble: a bed of it over the whole floor, and a few heaps
  const v2 = (pts) => pts.map((p) => new THREE.Vector2(p[0], p[1])), all = b.rings.flat(), bed = ground + 0.6 + 0.2 * seed;
  for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(v2(b.rings[0]), b.rings.slice(1).map(v2))) {
    m.tri([all[i][0], bed, all[i][1]], [all[j][0], bed, all[j][1]], [all[k][0], bed, all[k][1]], rubble, [0, 1, 0]);
  }
  const { c, u, v, hl, hw } = r.box, heaps = Math.min(5, Math.max(1, Math.round((hl * hw * 4) / 70)));
  for (let h = 0; h < heaps; h++) {
    const s = (rnd(seed * 97 + h, 3.1) - 0.5) * 1.6 * hl, t = (rnd(seed * 31 + h, 7.7) - 0.5) * 1.6 * hw, x = c[0] + u[0] * s + v[0] * t, z = c[1] + u[1] * s + v[1] * t;
    if (!insideRing(b.rings[0], x, z) || b.rings.slice(1).some((hole) => insideRing(hole, x, z))) continue;
    const rad = Math.min(1.6 + 2.6 * rnd(x, z), Math.max(1.2, hw * 0.8)), top = [x, bed + 0.9 + 1.6 * rnd(z, x), z], tone = rubble.clone().multiplyScalar(0.86 + 0.26 * rnd(x + 5, z));
    for (let a = 0; a < 6; a++) {
      const a0 = (a / 6) * Math.PI * 2, a1 = ((a + 1) / 6) * Math.PI * 2;
      m.tri([x + Math.cos(a0) * rad, bed, z + Math.sin(a0) * rad], [x + Math.cos(a1) * rad, bed, z + Math.sin(a1) * rad], top, tone, [0, 1, 0]);
      if (a % 2 === 0) m.line([x + Math.cos(a0) * rad, bed, z + Math.sin(a0) * rad], top);
    }
  }
  return r;
}
