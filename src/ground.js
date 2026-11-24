// The ground. Not a picture of a map: two small maps of WHAT each point of the city is, drawn on canvases from
// city.json, which the shader (src/look.js) turns into crisp edges and painted surfaces at any zoom, in colour and
// in ink:
//   mask   red: paved (streets and squares)      green: parks, grass, woods      blue: water (the river, ponds)
//   sub    red: which paving (asphalt 1, cobbles 0.5, a path 0.15)               green: woods 1, grass 0.4
// Both cover the city's BOUNDS (src/geo.js); the ground itself is wider (the whole terrain grid, bare beyond the
// city) and is shaped by the terrain's heights.
// On top of it, as thin ribbons laid on the terrain: the Bächle (OSM's open drains and ditches; half a metre wide
// unless OSM gives a width) and the rails (two per track, at OSM's gauge: 1,000 mm for the tram).
// In the ink look the ground is an old plan instead, wherever it reaches: the town plan of 1875 (public/plan/, made
// by tools/plan.mjs from the city's scanned and georeferenced historical plans). The city on it is today's, so a
// house does not always stand on a block of 1875. Without the plan's files the ink ground is drawn from the masks.
import * as THREE from 'three';
import { BOUNDS, toWorld } from './geo.js';
import { lookMaterial, setPlan } from './look.js';
import { KIND } from './buildings.js';
import { FLAT } from './terrain.js';

const ASPHALT = new Set(['primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'primary_link', 'secondary_link', 'tertiary_link', 'service']);
const WOODS = new Set(['forest', 'wood']);

export function buildGround(data, terrain = FLAT, { maxSize = 4096 } = {}) {
  const [x0, z0] = toWorld(BOUNDS.north, BOUNDS.west), [x1, z1] = toWorld(BOUNDS.south, BOUNDS.east); // (north is −z)
  const W = x1 - x0, H = z1 - z0, k = Math.min(maxSize / W, maxSize / H); // canvas pixels per metre

  const canvas = () => {
    const c = document.createElement('canvas'); c.width = Math.round(W * k); c.height = Math.round(H * k);
    const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    g.setTransform(k, 0, 0, k, -x0 * k, -z0 * k);     // (draw straight in world metres)
    g.lineJoin = g.lineCap = 'round';
    return g;
  };
  /**
   * Soft edges (the shader cuts them sharp again, smoothly): the finished drawing is blurred ONCE, onto a new canvas.
   * Never with the filter on while drawing: the browser then sets aside a layer the size of the whole canvas for
   * every single stroke — thousands of them, hundreds of gigabytes — and the machine runs out of memory.
   */
  const soften = (g, px) => {
    const c = document.createElement('canvas'); c.width = g.canvas.width; c.height = g.canvas.height;
    const out = c.getContext('2d');
    if ('filter' in out) out.filter = `blur(${px}px)`;
    out.drawImage(g.canvas, 0, 0);
    g.canvas.width = g.canvas.height = 0; // (the sharp drawing is not needed any more: give its memory back)
    return out;
  };
  const path = (g, pts) => { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); };
  const fill = (g, rings, style) => { g.beginPath(); for (const r of rings) { path(g, r); g.closePath(); } g.fillStyle = style; g.fill('evenodd'); };
  const line = (g, pts, style, w) => { g.beginPath(); path(g, pts); g.strokeStyle = style; g.lineWidth = w; g.stroke(); };
  const streets = data.streets.filter((s) => s.pts.length > 1);

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
  const paving = canvas();
  const kindOf = (s) => (ASPHALT.has(s.kind) ? 255 : s.width < 3 ? 38 : 128);
  for (const s of data.squares) fill(paving, [s.ring], 'rgb(128,0,0)');
  for (const s of streets.slice().sort((a, b) => kindOf(a) - kindOf(b))) line(paving, s.pts, `rgb(${kindOf(s)},0,0)`, s.width + 0.6);
  sub.setTransform(1, 0, 0, 1, 0, 0); sub.globalCompositeOperation = 'lighter'; sub.drawImage(paving.canvas, 0, 0);
  paving.canvas.width = paving.canvas.height = 0;

  const texture = (g) => {
    const t = new THREE.CanvasTexture(g.canvas);
    t.colorSpace = THREE.NoColorSpace; t.flipY = false; t.anisotropy = 8; // (numbers, not colours; row 0 is the north)
    return t;
  };
  const material = lookMaterial({ ground: { mask: texture(soften(mask, 1.2)), sub: texture(soften(sub, 2)), area: [x0, z0, W, H] } });

  // the ground's shape: the terrain's own grid, every point at its height (the normals then shade the slopes)
  const [ex0, ez0, ex1, ez1] = terrain.extent ?? [x0, z0, x1, z1], cell = terrain.step ?? 8;
  const geo = new THREE.PlaneGeometry(ex1 - ex0, ez1 - ez0, Math.round((ex1 - ex0) / cell), Math.round((ez1 - ez0) / cell)).rotateX(-Math.PI / 2).translate((ex0 + ex1) / 2, 0, (ez0 + ez1) / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, terrain.heightAt(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals(); geo.computeBoundingSphere();
  const mesh = new THREE.Mesh(geo, material);
  mesh.receiveShadow = true; mesh.name = 'ground';

  return { mesh, lines: buildLines(data, terrain) };
}

/** Fetches the old plan and lays it on the ground (ink look). Resolves to its description, or null if there is none. */
export async function loadPlan(ground, base, year = 1875) {
  try {
    const res = await fetch(`${base}plan/${year}.json`);
    if (!res.ok) return null;
    const plan = await res.json();
    const t = await new THREE.TextureLoader().loadAsync(`${base}${plan.src}`);
    t.colorSpace = THREE.NoColorSpace; t.flipY = false; t.anisotropy = 8; // (numbers, not colours; row 0 is the north)
    setPlan(ground.mesh.material, t, plan.area);
    return plan;
  } catch { return null; }
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
