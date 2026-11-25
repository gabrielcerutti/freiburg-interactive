// Starts the viewer: the scene, the camera, the light, and then the ground, the city, the trees and the hand-made
// places; the switch between colour and ink, and picking a landmark (by its label or by clicking it).
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { buildGround } from './ground.js';
import { createTimeline } from './timeline.js';
import { buildCity, TODAY } from './city.js';
import { buildTrees } from './trees.js';
import { startPlace } from './kit.js';
import { PLACES } from './places/index.js';
import { createLabels, showCard } from './labels.js';
import { LOOK, STOP, INK, PAPER, lookMaterial, riseDepthMaterial, riseLines, setLightFull } from './look.js';
import { loadTerrain } from './terrain.js';

const app = document.getElementById('app'), status = document.getElementById('status');

// -------------------------------------------------------------------------------------------------------- the scene
// Without WebGL there is nothing to show. A browser turns it off when its graphics process has crashed a few times
// (or when hardware acceleration is switched off): say so, instead of "Loading…" for ever.
if (!document.createElement('canvas').getContext('webgl2')) {
  window.failed('This browser could not start 3D graphics (WebGL), so the city cannot be drawn. That usually happens after the browser’s graphics process has crashed: quit the browser completely and open it again. If it still fails, check that hardware acceleration is on in the browser’s settings.');
  throw new Error('WebGL 2 is not available');
}
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.addEventListener('webglcontextlost', () => {
  status.hidden = false; status.classList.remove('failed');
  window.failed('The browser took the 3D graphics away from this page (the graphics context was lost). Reload the page.');
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const SKY = { colour: new THREE.Color('#dcd6c8'), ink: PAPER.clone().multiplyScalar(0.97) };
scene.background = SKY.colour.clone(); scene.fog = new THREE.Fog(SKY.colour.clone(), 1200, 3200);

const camera = new THREE.PerspectiveCamera(40, 1, 2, 8000);
camera.position.set(-330, 260, 380);
const controls = new MapControls(camera, renderer.domElement);
controls.target.set(-20, 25, 0);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.47; controls.minDistance = 25; controls.maxDistance = 2600;
controls.screenSpacePanning = false;

// The light is an illustration choice, not data: a late-morning sun from the south-south-east, fairly low, so the
// view from the south-west sees both lit and shaded faces and long shadows; and a soft sky.
const hemi = new THREE.HemisphereLight('#fbf6ea', '#8f8572', 1.0);
const sun = new THREE.DirectionalLight('#fff3dc', 3.0);
sun.position.set(300, 520, 700); sun.target.position.set(0, 0, 0);
Object.assign(sun.shadow.camera, { left: -950, right: 950, top: 950, bottom: -950, near: 10, far: 3200 });
sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6;
sun.castShadow = true;
scene.add(hemi, sun, sun.target);
// how bright a sunlit roof comes out (for the hatching in src/look.js): Lambert is irradiance × albedo / π
{
  const l = (c) => c.r * 0.299 + c.g * 0.587 + c.b * 0.114, up = sun.position.clone().normalize().y;
  setLightFull((sun.intensity * l(sun.color) * up + hemi.intensity * l(hemi.color)) / Math.PI);
}

// The shadows follow the view: the shadow map covers the part of the city in sight — a small area when the camera is
// near (crisp shadows), a wide one when it is far — and moves in whole texels, so the shadows do not crawl.
const sunDir = sun.position.clone().normalize(), sunRight = new THREE.Vector3(0, 1, 0).cross(sunDir).normalize(), sunUp = sunDir.clone().cross(sunRight);
let shadowHalf = 0;
function aimSun() {
  const want = THREE.MathUtils.clamp(camera.position.distanceTo(controls.target) * 1.15, 220, 1100);
  const half = 220 * 1.3 ** Math.round(Math.log(want / 220) / Math.log(1.3)); // (in steps, so it does not change with every bit of zoom)
  const cam = sun.shadow.camera;
  if (half !== shadowHalf) { shadowHalf = half; cam.left = cam.bottom = -half; cam.right = cam.top = half; cam.updateProjectionMatrix(); }
  const texel = (2 * half) / sun.shadow.mapSize.x, c = controls.target;
  const a = c.dot(sunRight), b = c.dot(sunUp);
  sun.target.position.copy(c).addScaledVector(sunRight, Math.round(a / texel) * texel - a).addScaledVector(sunUp, Math.round(b / texel) * texel - b);
  sun.position.copy(sun.target.position).addScaledVector(sunDir, 1500);
  sun.target.updateMatrixWorld();
}

// ink outlines on the edges of every solid, with a real width: fine in colour, firm in ink
const edgeMaterial = new LineMaterial({ color: INK.getHex(), linewidth: 1, transparent: true, opacity: 0.25, fog: true });
const outline = (mesh) => {
  const lines = new LineSegments2(new LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(mesh.geometry, 28)), edgeMaterial);
  lines.raycast = () => {}; mesh.add(lines);
};
// the city's outlines rise and sink with its buildings as the timeline moves (src/look.js)
const cityEdgeMaterial = riseLines(new LineMaterial({ color: INK.getHex(), linewidth: 1, transparent: true, opacity: 0.25, fog: true }));
const outlineCity = (mesh) => {
  const { positions, whens } = mesh.userData.edges, geo = new LineSegmentsGeometry().setPositions(positions);
  geo.setAttribute('instanceWhen', new THREE.InstancedBufferAttribute(whens, 2));
  const lines = new LineSegments2(geo, cityEdgeMaterial);
  lines.raycast = () => {}; lines.frustumCulled = false; mesh.add(lines); delete mesh.userData.edges;
};

// ----------------------------------------------------------------------------------------------- the card and labels
const card = document.getElementById('card');
const placeMeshes = []; let selected = null, flight = null;
function select(entry) {
  for (const p of placeMeshes) p.target = p === entry ? 1 : 0;
  selected = entry;
  if (!entry) { card.hidden = true; return; }
  showCard(card, entry.place);
  card.querySelector('.close').onclick = () => select(null);
  const [x, y, z] = entry.labelAt;
  const g = terrain.heightAt(x, z), target = new THREE.Vector3(x, g + Math.min((y - g) * 0.4, 45), z);
  const offset = camera.position.clone().sub(controls.target).setLength(Math.max(160, (y - g) * 2.4));
  flight = { t: 0, fromP: camera.position.clone(), fromT: controls.target.clone(), toP: target.clone().add(offset), toT: target };
}
const labels = createLabels(document.getElementById('labels'), camera, { onPick: (entry) => select(entry) });

// --------------------------------------------------------------------------------------------------------- the data
status.textContent = 'Loading the city…';
const [data, terrain, ages] = await Promise.all([
  fetch(`${import.meta.env.BASE_URL}data/city.json`).then((r) => r.json()),
  loadTerrain(import.meta.env.BASE_URL),
  // which buildings stood at each stop of the timeline (read off the old plans; without the file, all of them always)
  fetch(`${import.meta.env.BASE_URL}data/ages.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
]);

const ground = buildGround(data, terrain);
scene.add(ground.mesh, ground.lines);
// the timeline: an old plan on the ground for each year (it has its own streams, and for long no tram: the ribbons go)
// and the buildings that stood then, as far as the plans tell — they rise and sink as the year changes (see the loop)
const timeline = createTimeline(document.getElementById('timeline'), ground, import.meta.env.BASE_URL, {
  onChange: (plan) => {
    ground.lines.visible = !plan;
    const i = plan && ages ? ages.stops.indexOf(plan.key) : -1, to = i < 0 ? TODAY : i, s = STOP.uStop.value;
    if (to !== s.y) s.set(s.z >= 0.5 ? s.y : s.x, to, 0); // (from where it is — or was, if it had barely started — to the new stop)
    city.showStops(s.x, s.y);
    // the hand-made places that say since when they stand (PLACE.since) are not there before
    const year = plan ? Number(plan.key) || 1944.9 : Infinity; // (the damage map, "bomben", is of November 1944)
    for (const p of placeMeshes) p.hidden = year < p.since;
    if (selected?.hidden) select(null);
  },
  about: (plan) => {
    const i = ages ? ages.stops.indexOf(plan.key) : -1; if (i < 0) return '';
    const n = (v) => v.toLocaleString('en'), lost = ages.lostCounts?.[i] ?? 0, ruins = ages.ruins?.[i] ?? 0;
    return `Buildings: ${n(ages.counts[i])} of today’s ${n(ages.buildings)}`
      + (lost ? `, and ${n(lost)} that are gone, drawn as plain houses where the plan of 1920 shows a building (their shapes are assumed)` : '')
      + (ruins ? `; ${n(ruins)} in ruins (how much of each was left is assumed)` : '')
      + '. All of it read off the plans: an estimate, not recorded dates.';
  },
});
// the paper beyond the map, well below the lowest ground so the two never fight over the same pixels
const low = terrain.min;
const under = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000).rotateX(-Math.PI / 2).translate(0, low - 6, 0), lookMaterial({ vertexColors: false }));
under.material.color.set('#e3dccb'); scene.add(under);

const cityLook = { solid: lookMaterial({ rise: true }), open: lookMaterial({ rise: true }), depth: riseDepthMaterial() };
cityLook.open.side = THREE.DoubleSide; // (the ruins: walls with no roof, seen from inside too)
cityLook.open.shadowSide = THREE.FrontSide; // (and a single skin must not shade its own sunlit inside: it came out speckled)
const city = buildCity(data, cityLook, terrain, ages);
city.meshes.forEach(outlineCity); scene.add(city.group);
city.showStops(TODAY, TODAY);
const trees = buildTrees(data, terrain); scene.add(trees.group);
console.info('city', city.stats, 'trees', trees.count, 'of them in woods', trees.inWoods);

for (const place of PLACES) {
  const kit = startPlace();
  try {
    const parts = data.buildings.filter((b) => b.place === place.PLACE.key);
    const { anchor, top } = place.build(kit, parts, data);
    const mesh = new THREE.Mesh(kit.mesher.toGeometry(), lookMaterial());
    mesh.castShadow = mesh.receiveShadow = true; mesh.name = place.PLACE.key;
    // the whole place stands on the lowest ground under it (one lift for all its pieces, so they stay together)
    const lift = (parts.length ? terrain.lowest(parts.flatMap((b) => b.rings[0])) : terrain.heightAt(anchor[0], anchor[1])) - 0.3;
    mesh.position.y = lift;
    outline(mesh); scene.add(mesh);
    const entry = { place: place.PLACE, mesh, labelAt: [anchor[0], lift + top + 6, anchor[1]], target: 0, since: place.PLACE.since ?? -Infinity, hidden: false, rise: 1 };
    mesh.userData.entry = entry; placeMeshes.push(entry);
    labels.add(place.PLACE.name, entry.labelAt, entry);
    console.info(place.PLACE.key, kit.mesher.vertices, 'vertices');
  } catch (e) { console.warn(`could not build ${place.PLACE.key}:`, e); }
}
status.hidden = true;

// --------------------------------------------------------------------------------------- clicking on a landmark
const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
const pickAt = (ev) => {
  const r = renderer.domElement.getBoundingClientRect();
  mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(mouse, camera);
  const hit = ray.intersectObjects(placeMeshes.filter((p) => !p.hidden).map((p) => p.mesh), false)[0];
  return hit?.object.userData.entry ?? null;
};
let down = null;
renderer.domElement.addEventListener('pointerdown', (ev) => { down = [ev.clientX, ev.clientY]; });
renderer.domElement.addEventListener('pointerup', (ev) => {
  if (!down || Math.hypot(ev.clientX - down[0], ev.clientY - down[1]) > 5) return; // (a drag, not a click)
  const hit = pickAt(ev); if (hit) select(hit);
});
renderer.domElement.addEventListener('pointermove', (ev) => {
  if (ev.buttons) return;
  const hit = pickAt(ev);
  renderer.domElement.style.cursor = hit ? 'pointer' : '';
  for (const p of placeMeshes) p.hover = p === hit;
});

// ------------------------------------------------------------------------------------------- colour ⇄ ink
const lookButton = document.getElementById('look');
let inkTarget = 0;
function setLook(ink) {
  inkTarget = ink ? 1 : 0;
  lookButton.textContent = ink ? 'Colour' : 'Ink';
  lookButton.setAttribute('aria-pressed', String(ink));
  document.body.classList.toggle('ink', ink);
}
lookButton.addEventListener('click', () => setLook(!inkTarget));
addEventListener('keydown', (ev) => {
  if (ev.target instanceof HTMLInputElement) return;
  if (ev.key === 'c' || ev.key === 'C') setLook(!inkTarget);
  if (ev.key === 'Escape') select(null);
});
setLook(false);

window.lab = { scene, camera, controls, renderer, city: city.stats, setLook, plan: (key) => timeline.then((t) => t?.show(key)), select: (key) => select(placeMeshes.find((p) => p.place.key === key) ?? null) };

// ---------------------------------------------------------------------------------------------------- the main loop
function resize() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const timer = new THREE.Timer();
renderer.setAnimationLoop((time) => {
  timer.update(time); const dt = timer.getDelta();
  LOOK.uTime.value += dt;
  // the look eases from one to the other
  const ink = (LOOK.uInk.value += Math.sign(inkTarget - LOOK.uInk.value) * Math.min(Math.abs(inkTarget - LOOK.uInk.value), dt / 0.6));
  scene.background.lerpColors(SKY.colour, SKY.ink, ink); scene.fog.color.copy(scene.background);
  for (const m of [edgeMaterial, cityEdgeMaterial]) { m.opacity = 0.3 + 0.65 * ink; m.linewidth = (0.9 + 0.7 * ink) * renderer.getPixelRatio(); }
  STOP.uStop.value.z = Math.min(1, STOP.uStop.value.z + dt / 1.8); // (the timeline: the buildings that come and go)
  if (STOP.uStop.value.z === 1) city.showStops(STOP.uStop.value.y, STOP.uStop.value.y); // (arrived: what is left of the stop before is put away)
  for (const p of placeMeshes) {
    const h = p.mesh.material.userData.highlight, to = Math.max(p.target, p.hover ? 0.45 : 0); h.value += (to - h.value) * Math.min(1, dt * 6);
    // (a place that is not there yet at this year sinks into the ground, like the city's buildings, and rises back)
    const want = p.hidden ? 0 : 1; p.rise += Math.sign(want - p.rise) * Math.min(Math.abs(want - p.rise), dt / 1.2);
    p.mesh.visible = p.rise > 0.002; p.mesh.scale.y = Math.max(p.rise * p.rise * (3 - 2 * p.rise), 0.002);
  }
  if (flight) {
    flight.t = Math.min(1, flight.t + dt / 1.4);
    const e = flight.t < 0.5 ? 2 * flight.t * flight.t : 1 - (-2 * flight.t + 2) ** 2 / 2;
    camera.position.lerpVectors(flight.fromP, flight.toP, e); controls.target.lerpVectors(flight.fromT, flight.toT, e);
    if (flight.t === 1) flight = null;
  }
  controls.update();
  aimSun();
  renderer.render(scene, camera);
  labels.update(app.clientWidth, app.clientHeight);
});
