// The ground. Not a picture of a map: two small maps of WHAT each point of the city is, drawn on canvases from
// city.json, which the shader (src/look.js) turns into crisp edges and painted surfaces at any zoom, in colour and
// in ink:
//   mask   red: paved (streets and squares)      green: parks, grass, woods      blue: water (the river, ponds)
//   sub    red: which paving (asphalt 1, cobbles 0.5, a path 0.15)               green: woods 1, grass 0.4
// Both cover the city's BOUNDS (src/geo.js); the ground itself is wider (the whole terrain grid, bare beyond the
// city) and is shaped by the terrain's heights.
// The ground is cut into tiles: a coarse pair of maps of the whole city is always there, and a tile looked at from
// near gets a sharp pair of its own (see buildGround).
// On top of it, as thin ribbons laid on the terrain: the Bächle (OSM's open drains and ditches; half a metre wide
// unless OSM gives a width) and the rails (two per track, at OSM's gauge: 1,000 mm for the tram).
// With a year picked on the timeline (src/timeline.js) an old plan of the city lies on the ground instead, wherever
// its sheet reaches, and the ribbons are put away. The city on it is today's.
import * as THREE from 'three';
import { BOUNDS, toWorld } from './geo.js';
import { lookMaterial, setGround, setPlan } from './look.js';
import { KIND } from './buildings.js';
import { FLAT } from './terrain.js';
import { lighten } from './city.js';

const ASPHALT = new Set(['primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'primary_link', 'secondary_link', 'tertiary_link', 'service']);
const WOODS = new Set(['forest', 'wood']);

const TILE = 768;      // metres: the side of a tile of ground
const SHARP = 1.8;     // pixels a metre of a tile's own maps, when it is looked at from near
const PAD = 6;         // metres a tile's maps reach beyond it, so that two neighbours agree along their edge
const NEAR = 700, FAR = 1000, CLOSE = 1500, AWAY = 1900; // (metres: see update() below)

/**
 * The ground is cut into tiles of TILE metres, so that only what is in view is drawn and — what matters as the city
 * grows — only what is looked at from near is held sharp:
 *   - one pair of maps of the whole city, coarse (at most 2048 pixels a side), is always there, and so is, with a
 *     year picked, a small picture of the whole plan: from far, nothing else is needed;
 *   - a tile within NEAR metres of the point the camera looks at, with the camera less than CLOSE metres from it,
 *     gets maps of its own at SHARP pixels a metre and its own piece of the plan as it was scanned; it gives them
 *     back when that point is FAR metres away or the camera AWAY. One tile is made sharp at a time.
 * Returns { group, lines, update(focus, distance), showPlan(plan | null, base) }.
 */
export function buildGround(data, terrain = FLAT) {
  const [x0, z0] = toWorld(BOUNDS.north, BOUNDS.west), [x1, z1] = toWorld(BOUNDS.south, BOUNDS.east); // (north is −z)
  const streets = data.streets.filter((s) => s.pts.length > 1);
  const kindOf = (s) => (ASPHALT.has(s.kind) ? 255 : s.width < 3 ? 38 : 128);
  const byKind = streets.slice().sort((a, b) => kindOf(a) - kindOf(b));

  /** the two maps of a rectangle [x, z, width, depth] of the city, at k pixels a metre → { mask, sub } (textures) */
  function maps([rx, rz, rw, rh], k) {
    const canvas = () => {
      const c = document.createElement('canvas'); c.width = Math.max(2, Math.round(rw * k)); c.height = Math.max(2, Math.round(rh * k));
      const g = c.getContext('2d');
      g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
      g.setTransform(c.width / rw, 0, 0, c.height / rh, (-rx * c.width) / rw, (-rz * c.height) / rh); // (draw straight in world metres)
      g.lineJoin = g.lineCap = 'round';
      return g;
    };
    /**
     * Soft edges (the shader cuts them sharp again, smoothly): the finished drawing is blurred ONCE, onto a new canvas.
     * Never with the filter on while drawing: the browser then sets aside a layer the size of the whole canvas for
     * every single stroke — thousands of them, hundreds of gigabytes — and the machine runs out of memory.
     */
    const soften = (g, metres) => {
      const c = document.createElement('canvas'); c.width = g.canvas.width; c.height = g.canvas.height;
      const out = c.getContext('2d');
      if ('filter' in out) out.filter = `blur(${Math.max(0.5, metres * k).toFixed(2)}px)`;
      out.drawImage(g.canvas, 0, 0);
      g.canvas.width = g.canvas.height = 0; // (the sharp drawing is not needed any more: give its memory back)
      return out;
    };
    const path = (g, pts) => { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); };
    const fill = (g, rings, style) => { g.beginPath(); for (const r of rings) { path(g, r); g.closePath(); } g.fillStyle = style; g.fill('evenodd'); };
    const line = (g, pts, style, w) => { g.beginPath(); path(g, pts); g.strokeStyle = style; g.lineWidth = w; g.stroke(); };

    // what each point is: every class adds to its own channel
    const mask = canvas(); mask.globalCompositeOperation = 'lighter';
    for (const a of data.green) fill(mask, a.rings, '#0f0');
    for (const a of data.waterAreas) fill(mask, a, '#00f');
    for (const w of data.waterLines) if (w.width >= 1) line(mask, w.pts, '#00f', w.width);
    for (const s of data.squares) fill(mask, [s.ring], '#f00');
    for (const s of streets) line(mask, s.pts, '#f00', s.width);

    // which kind: woods over grass in green; in red, paths first, then cobbles, then asphalt on top
    const sub = canvas();
    for (const a of data.green) if (!WOODS.has(a.kind)) fill(sub, a.rings, 'rgb(0,102,0)');
    for (const a of data.green) if (WOODS.has(a.kind)) fill(sub, a.rings, 'rgb(0,255,0)');
    // A vineyard, in blue: which way its rows run — 0 to 180°, as 77 to 255; under 77 there is none. ASSUMED: the
    // rows run across the slope (along the contour), as on a terraced hillside; on flat ground, along its longest side.
    for (const a of data.green) if (a.kind === 'vineyard') fill(sub, a.rings, `rgb(0,102,${Math.round(77 + 178 * (rowsOf(a.rings[0]) / Math.PI))})`);
    const paving = canvas();
    for (const s of data.squares) fill(paving, [s.ring], 'rgb(128,0,0)');
    for (const s of byKind) line(paving, s.pts, `rgb(${kindOf(s)},0,0)`, s.width + 0.6);
    sub.setTransform(1, 0, 0, 1, 0, 0); sub.globalCompositeOperation = 'lighter'; sub.drawImage(paving.canvas, 0, 0);
    paving.canvas.width = paving.canvas.height = 0;

    const texture = (g) => {
      const t = new THREE.CanvasTexture(g.canvas);
      t.colorSpace = THREE.NoColorSpace; t.flipY = false; t.anisotropy = 8; // (numbers, not colours; row 0 is the north)
      // (once it is on the graphics card, the canvas it came from is given back)
      t.onUpdate = () => { g.canvas.width = g.canvas.height = 0; t.onUpdate = null; };
      return t;
    };
    return { mask: texture(soften(mask, 0.7)), sub: texture(soften(sub, 1.15)) };
  }
  const rowsOf = (ring) => {
    let gx = 0, gz = 0, long = 0, side = 0;
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i], q = ring[(i + 1) % ring.length], l = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (l > long) { long = l; side = Math.atan2(q[1] - p[1], q[0] - p[0]); }
      gx += terrain.heightAt(p[0] + 10, p[1]) - terrain.heightAt(p[0] - 10, p[1]); gz += terrain.heightAt(p[0], p[1] + 10) - terrain.heightAt(p[0], p[1] - 10);
    }
    const angle = Math.hypot(gx, gz) / ring.length > 0.6 ? Math.atan2(gz, gx) + Math.PI / 2 : side; // (more than 3 % of slope)
    return ((angle % Math.PI) + Math.PI) % Math.PI;
  };

  // the whole city, coarse: what every tile shows until it is looked at from near
  const all = [x0, z0, x1 - x0, z1 - z0], whole = maps(all, Math.min(2048 / all[2], 2048 / all[3], SHARP));

  // the tiles: the terrain's own grid, every point at its height, cut every TILE metres
  const [ex0, ez0, ex1, ez1] = terrain.extent ?? [x0, z0, x1, z1], cell = terrain.step ?? 8, per = Math.round(TILE / cell);
  const nx = Math.round((ex1 - ex0) / cell), nz = Math.round((ez1 - ez0) / cell), group = new THREE.Group(); group.name = 'ground';
  const tiles = [];
  for (let r = 0; r * per < nz; r++) for (let c = 0; c * per < nx; c++) {
    const i0 = c * per, j0 = r * per, w = Math.min(per, nx - i0), h = Math.min(per, nz - j0), pos = new Float32Array((w + 1) * (h + 1) * 3), nor = new Float32Array(pos.length), idx = [];
    for (let j = 0; j <= h; j++) for (let i = 0; i <= w; i++) {
      const x = ex0 + (i0 + i) * cell, z = ez0 + (j0 + j) * cell, k = (j * (w + 1) + i) * 3;
      pos[k] = x; pos[k + 1] = terrain.heightAt(x, z); pos[k + 2] = z;
      // (the slope from the heights themselves, not from the tile's own triangles: no crease where two tiles meet)
      const dx = terrain.heightAt(x + cell, z) - terrain.heightAt(x - cell, z), dz = terrain.heightAt(x, z + cell) - terrain.heightAt(x, z - cell), l = Math.hypot(dx, 2 * cell, dz);
      nor[k] = -dx / l; nor[k + 1] = (2 * cell) / l; nor[k + 2] = -dz / l;
      if (i < w && j < h) { const a = j * (w + 1) + i, b = a + 1, d = a + w + 1, e = d + 1; idx.push(a, d, b, b, d, e); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setIndex(idx);
    lighten(geo);
    const mesh = new THREE.Mesh(geo, lookMaterial({ ground: { mask: whole.mask, sub: whole.sub, area: all } }));
    mesh.receiveShadow = true; mesh.name = `ground ${c},${r}`; group.add(mesh);
    const rect = [ex0 + i0 * cell, ez0 + j0 * cell, w * cell, h * cell];
    // (a tile wholly outside the city has nothing to show sharper)
    const inCity = rect[0] < x1 && rect[0] + rect[2] > x0 && rect[1] < z1 && rect[1] + rect[3] > z0;
    tiles.push({ c, r, rect, mesh, inCity, own: null, plan: null, asked: null });
  }

  // ---- the old plan: a small picture of the whole of it on every tile, and each tile's own piece when it is near
  const loader = new THREE.TextureLoader();
  const scan = (t) => { t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.anisotropy = 8; return t; }; // (row 0 is the north)
  let plan = null, base = '', small = null;
  const dropPiece = (t) => { t.plan?.dispose(); t.plan = null; t.asked = null; };
  /** Lays a plan (an entry of plans.json) on the ground, or takes it away (null). → whether it could be loaded. */
  async function showPlan(next, from = '') {
    let picture = null;
    if (next) { try { picture = scan(await loader.loadAsync(`${from}${next.low}`)); } catch { picture = null; } }
    for (const t of tiles) { dropPiece(t); setPlan(t.mesh.material, picture, next?.area, next?.levels); }
    small?.dispose(); small = picture; plan = picture ? next : null; base = from;
    return Boolean(picture) || !next;
  }
  const pieceOf = (t) => plan?.tiles?.find((p) => p[0] === t.c && p[1] === t.r);
  function askPiece(t) {
    const p = pieceOf(t), mine = plan; if (!p) return;
    t.asked = mine.key;
    loader.loadAsync(`${base}plan/${mine.key}/${t.c}-${t.r}.webp`).then((picture) => {
      if (plan !== mine || t.asked !== mine.key) { picture.dispose(); return; } // (another year, or the tile is far by now)
      t.plan = scan(picture); setPlan(t.mesh.material, t.plan, p.slice(2), mine.levels);
    }).catch(() => { /* its piece is missing: the small picture stays */ });
  }

  /**
   * Which tiles are sharp: called now and then with the point the camera looks at and how far the camera is from it.
   * Makes at most one tile's own maps a call (drawing them takes a moment); the pieces of the plan load by themselves.
   */
  function update(focus, distance) {
    const away = (t) => Math.hypot(Math.max(t.rect[0] - focus.x, 0, focus.x - t.rect[0] - t.rect[2]), Math.max(t.rect[1] - focus.z, 0, focus.z - t.rect[1] - t.rect[3]));
    let made = false;
    for (const t of tiles.slice().sort((a, b) => away(a) - away(b))) {
      const d = away(t), near = d < NEAR && distance < CLOSE, far = d > FAR || distance > AWAY;
      if (near) {
        if (t.inCity && !t.own && !made) {
          const rect = [t.rect[0] - PAD, t.rect[1] - PAD, t.rect[2] + 2 * PAD, t.rect[3] + 2 * PAD];
          t.own = maps(rect, SHARP); setGround(t.mesh.material, t.own.mask, t.own.sub, rect); made = true;
        }
        if (plan && t.asked !== plan.key) askPiece(t);
      } else if (far) {
        if (t.own) { setGround(t.mesh.material, whole.mask, whole.sub, all); t.own.mask.dispose(); t.own.sub.dispose(); t.own = null; }
        if (t.plan || t.asked) { dropPiece(t); if (plan) setPlan(t.mesh.material, small, plan.area, plan.levels); }
      }
    }
  }

  return { group, lines: buildLines(data, terrain), update, showPlan, tiles };
}

/** The Bächle and the rails: ribbons laid on the terrain, a point every 2 m or less, a hand above the ground. */
function buildLines(data, terrain) {
  const pos = [], fac = [], LIFT = 0.09;
  /** a ribbon `half` metres to each side of the line; `facade(side)` gives each edge's aFacade (side: −1 or +1) */
  const ribbon = (pts, half, facade) => {
    const fine = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2));
      for (let j = i ? 1 : 0; j <= n; j++) fine.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n]);
    }
    const edge = fine.map((p, i) => {
      const a = fine[Math.max(0, i - 1)], b = fine[Math.min(fine.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / l, nz = (b[0] - a[0]) / l, y = terrain.heightAt(p[0], p[1]) + LIFT;
      return [[p[0] - nx * half, y, p[1] - nz * half], [p[0] + nx * half, y, p[1] + nz * half]];
    });
    for (let i = 0; i < edge.length - 1; i++) {
      const [l0, r0] = edge[i], [l1, r1] = edge[i + 1];
      for (const [p, side] of [[l0, -1], [r0, 1], [r1, 1], [l0, -1], [r1, 1], [l1, -1]]) { pos.push(...p); fac.push(...facade(side)); }
    }
  };
  for (const w of data.waterLines) if (w.width < 1 && w.pts.length > 1) ribbon(w.pts, Math.max(w.width, 0.5) / 2, (side) => [side, 0, 0, KIND.RUNNEL]);
  for (const r of data.rail) if (r.pts.length > 1) { const half = r.gauge / 2 + 0.12; ribbon(r.pts, half, (side) => [side * half, r.gauge / 2, 0, KIND.TRACK]); }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aFacade', new THREE.Float32BufferAttribute(fac, 4));
  geo.computeVertexNormals(); geo.computeBoundingSphere();
  const material = lookMaterial({ vertexColors: false }); material.side = THREE.DoubleSide;
  material.polygonOffsetFactor = -1; material.polygonOffsetUnits = -1; // (in front of the ground they lie on)
  const mesh = new THREE.Mesh(geo, material);
  mesh.receiveShadow = true; mesh.name = 'lines';
  return mesh;
}
