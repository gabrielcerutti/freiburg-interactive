// Starts the viewer: the scene, the camera, the light, and then the ground, the city, the trees and the hand-made
// places; the switch between colour and ink, and picking a landmark (by its label or by clicking it).
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { buildGround } from './ground.js';
import { createTimeline } from './timeline.js';
import { buildCity, lighten, TODAY } from './city.js';
import { Mesher, addRuin } from './buildings.js';
import { buildTrees } from './trees.js';
import { startPlace } from './kit.js';
import { PLACES } from './places/index.js';
import { createLabels, showCard } from './labels.js';
import { LOOK, STOP, INK, lookMaterial, riseDepthMaterial, riseLines, setLightFull } from './look.js';
import { loadTerrain } from './terrain.js';
import { buildSky, SKY } from './sky.js';
import { createSearch } from './search.js';

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
// the sky (src/sky.js): blue overhead, haze at the horizon; the fog is that haze, so the far city fades into it
scene.background = SKY.haze.clone(); scene.fog = new THREE.Fog(SKY.haze.clone(), 1500, 4600); // (far enough to see across the whole map from its other end)
const sky = buildSky(); scene.add(sky);

const camera = new THREE.PerspectiveCamera(40, 1, 2, 8000);
camera.position.set(-330, 260, 380);
const controls = new MapControls(camera, renderer.domElement);
controls.target.set(-20, 25, 0);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.47; controls.minDistance = 25; controls.maxDistance = 3400;
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
  if (!whens.length) { delete mesh.userData.edges; return; }
  geo.boundingSphere = mesh.geometry.boundingSphere.clone(); geo.boundingBox = new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position); // (its building's: the lines never leave it)
  lighten(geo);
  lines.raycast = () => {}; mesh.add(lines); delete mesh.userData.edges;
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
  const [x, y, z] = entry.labelAt, g = terrain.heightAt(x, z);
  flyTo(x, g + Math.min((y - g) * 0.4, 45), z, Math.max(160, (y - g) * 2.4));
}
/** the camera goes to look at a point from `distance` metres, keeping the side it is looking from */
function flyTo(x, y, z, distance) {
  const target = new THREE.Vector3(x, y, z), offset = camera.position.clone().sub(controls.target).setLength(distance);
  flight = { t: 0, fromP: camera.position.clone(), fromT: controls.target.clone(), toP: target.clone().add(offset), toT: target };
}
const labels = createLabels(document.getElementById('labels'), camera, { onPick: (entry, at) => (entry ? select(entry) : flyTo(at[0], at[1] - 8, at[2], 230)) });

// --------------------------------------------------------------------------------------------------------- the data
status.textContent = 'Loading the city…';
const [data, terrain, ages] = await Promise.all([
  fetch(`${import.meta.env.BASE_URL}data/city.json`).then((r) => r.json()),
  loadTerrain(import.meta.env.BASE_URL),
  // which buildings stood at each stop of the timeline (read off the old plans; without the file, all of them always)
  fetch(`${import.meta.env.BASE_URL}data/ages.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
]);

const ground = buildGround(data, terrain);
scene.add(ground.group, ground.lines);
// What the note under the years says: what changed by that year, in a visitor's words. The numbers are counts of
// public/data/ages.json (which buildings each plan shows: an estimate, and the note says so), rounded to the ten; the
// landmarks are the hand-made places with a year of their own (PLACE.since, sourced in each file).
function yearNote(plan) {
  const n = (v) => v.toLocaleString('en'), about = (v) => `about ${n(Math.round(v / 10) * 10)}`;
  if (!plan || !ages) return `<b>Today.</b> The city as OpenStreetMap maps it${ages ? `: ${n(ages.buildings)} buildings` : ''}. Pick a year to see how much of it stood then.`;
  const i = ages.stops.indexOf(plan.key); if (i < 0) return '';
  const year = (k) => Number(ages.stops[k]) || 1944.9, label = (k) => (ages.stops[k] === 'bomben' ? 'November 1944' : ages.stops[k]);
  const lost = ages.lostCounts?.[i] ?? 0, ruins = ages.ruins?.[i] ?? 0, more = i ? ages.counts[i] - ages.counts[i - 1] : 0;
  const gone = lost ? ` Another ${about(lost)} stood that are gone today: they are drawn as plain houses, their shapes assumed.` : '';
  let text;
  if (ruins) text = `<b>After the air raid of 27 November 1944.</b> ${about(ruins).replace(/^a/, 'A')} buildings lay in ruins or were too damaged to live in; ${about(ages.counts[i] + lost)} still stood. How much of each ruin was left is assumed.`;
  else if (!i) text = `<b>${label(i)}.</b> The oldest plan here. ${about(ages.counts[i]).replace(/^a/, 'A')} of today’s ${n(ages.buildings)} buildings already stood.${gone}`;
  else text = `<b>${label(i)}.</b> ${more > 0 ? `${about(more).replace(/^a/, 'A')} of today’s buildings went up since ${label(i - 1)}: ` : ''}${about(ages.counts[i])} of ${n(ages.buildings)} ${more > 0 ? 'now stood' : 'stood'}.${gone}`;
  const fresh = PLACES.map((p) => p.PLACE).filter((p) => p.since > (i ? year(i - 1) : -Infinity) && p.since <= year(i) && i).sort((a, b) => a.since - b.since);
  if (fresh.length) text += ` New among the landmarks: ${fresh.map((p) => `${p.name} (${p.since})`).join(', ')}.`;
  const left = i ? PLACES.map((p) => p.PLACE).filter((p) => p.until > year(i - 1) && p.until <= year(i) && !(p.war?.state === 'ruin' && year(i - 1) >= 1944.9)) : [];
  if (left.length && !ruins) text += ` Gone since ${label(i - 1)}: ${left.map((p) => `${p.name} (${p.until})`).join(', ')}.`;
  // (what the raid did to the landmarks: each place's file says, with its source)
  const fate = (state, at) => PLACES.map((p) => p.PLACE).filter((p) => p.war?.state === state && !(p.since > at) && !(p.until <= at) && (state !== 'ruin' || at < (p.war.rebuilt ?? 1945))).map((p) => p.name).join(', ');
  if (ruins) { const r = fate('ruin', year(i)), d = fate('damaged', year(i)), ok = fate('spared', year(i)); text += ` Among the landmarks${r ? `, in ruins: ${r}` : ''}${d ? `${r ? ';' : ','} damaged: ${d}` : ''}${ok ? `${r || d ? ';' : ','} spared: ${ok}` : ''}.`; }
  else if (year(i) > 1945 && fate('ruin', year(i))) text += ` Still in ruins among the landmarks: ${fate('ruin', year(i))}.`;
  return `${text} <i>Read off the city’s old plans: an estimate, not recorded dates.</i>`;
}

// the timeline: an old plan on the ground for each year (it has its own streams, and for long no tram: the ribbons go)
// and the buildings that stood then, as far as the plans tell — they rise and sink as the year changes (see the loop)
const timeline = createTimeline(document.getElementById('timeline'), ground, import.meta.env.BASE_URL, {
  onChange: (plan) => {
    ground.lines.visible = !plan;
    const i = plan && ages ? ages.stops.indexOf(plan.key) : -1, to = i < 0 ? TODAY : i, s = STOP.uStop.value;
    if (to !== s.y) s.set(s.z >= 0.5 ? s.y : s.x, to, 0); // (from where it is — or was, if it had barely started — to the new stop)
    city.showStops(s.x, s.y);
    // the hand-made places that say since when they stand (PLACE.since) are not there before
    const year = plan ? Number(plan.key) || 1944.9 : Number.MAX_VALUE; // (today: after any year, but before the «never» — Infinity — of a place that still stands)
    // (the damage map, "bomben", is of November 1944: 1944.9)
    for (const p of placeMeshes) { p.hidden = year < p.since || year >= p.until; // (not there yet, or gone by then)
      if (p.ruin) p.ruined = year >= 1944.9 && year < p.ruinUntil; }
    if (selected?.hidden) select(null);
  },
  about: yearNote,
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

// (a ruin's walls are a single skin: drawn from both sides, and not shading their own sunlit inside)
const ruinLook = () => { const m = lookMaterial(); m.side = THREE.DoubleSide; m.shadowSide = THREE.FrontSide; return m; };
for (const place of PLACES) {
  const kit = startPlace();
  try {
    const parts = data.buildings.filter((b) => b.place === place.PLACE.key);
    const { anchor, top } = place.build(kit, parts, data);
    const mesh = new THREE.Mesh(kit.mesher.toGeometry(), lookMaterial());
    mesh.castShadow = mesh.receiveShadow = true; mesh.name = place.PLACE.key;
    // the whole place stands on the lowest ground under it (one lift for all its pieces, so they stay together)
    // (a place that is gone stands on the footprint it gives; one with neither, at its anchor)
    const under = (parts.length ? parts : place.PLACE.footprint ?? []).flatMap((b) => b.rings[0]);
    const lift = (under.length ? terrain.lowest(under) : terrain.heightAt(anchor[0], anchor[1])) - 0.3;
    mesh.position.y = lift;
    outline(mesh); scene.add(mesh);
    const entry = { place: place.PLACE, mesh, labelAt: [anchor[0], lift + top + 6, anchor[1]], target: 0, since: place.PLACE.since ?? -Infinity, until: place.PLACE.until ?? Infinity, hidden: place.PLACE.until != null, rise: place.PLACE.until != null ? 0 : 1 };
    mesh.userData.entry = entry; placeMeshes.push(entry);
    // A place the raid of 27 November 1944 left in ruins (PLACE.war, sourced in its file) has a second shape: the
    // shell of its outline, made like the city's ruins. It takes the place's place from that stop until the year it
    // stood again (`rebuilt`; where no source gives one, only at the stop of November 1944).
    const war = place.PLACE.war;
    // (a place that is gone has no outline in OSM: it gives the shell's footprint itself, PLACE.footprint)
    const shell = parts.length ? parts : place.PLACE.footprint ?? [];
    if (war?.state === 'ruin' && shell.length) {
      const m = new Mesher(); for (const b of shell) addRuin(m, b, { lift: 0 });
      const ruin = new THREE.Mesh(m.toGeometry(), ruinLook()); ruin.position.y = lift; ruin.castShadow = ruin.receiveShadow = true; ruin.visible = false;
      const lines = new LineSegments2(new LineSegmentsGeometry().setPositions(m.seg), edgeMaterial); lines.raycast = () => {}; ruin.add(lines);
      ruin.userData.entry = entry; scene.add(ruin);
      Object.assign(entry, { ruin, ruinRise: 0, ruined: false, ruinUntil: war.rebuilt ?? 1945 });
    }
    labels.add(place.PLACE.name, entry.labelAt, entry);
    console.info(place.PLACE.key, kit.mesher.vertices, 'vertices');
  } catch (e) { console.warn(`could not build ${place.PLACE.key}:`, e); }
}
// Everything is built: what was only needed for building is let go. Of the buildings, the search still needs
// where each one stands (its outline) and which it is; the ground keeps the streets, the green and the water for
// its tiles.
data.buildings = data.buildings.map((b) => ({ id: b.id, group: b.group, place: b.place, type: b.type, rings: [b.rings[0]] }));
data.trees = null; if (ages) ages.lost = null;
status.hidden = true;

// --------------------------------------------------------------------------------------- clicking on a landmark
const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
const pickAt = (ev) => {
  const r = renderer.domElement.getBoundingClientRect();
  mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(mouse, camera);
  const hit = ray.intersectObjects(placeMeshes.filter((p) => !p.hidden).map((p) => (p.ruined ? p.ruin : p.mesh)), false)[0];
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

// ------------------------------------------------------------------------------------------- the address search
// A found address gets a red tag and the camera goes there. What is said about it comes from the same estimate as the
// timeline: since which plan a building shows on that spot (the spot, not necessarily the same house).
const insideRing = (ring, x, z) => { let inside = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside; } return inside; };
const toRing = (ring, x, z) => { let best = Infinity; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [ax, az] = ring[j], [bx, bz] = ring[i], l = (bx - ax) ** 2 + (bz - az) ** 2 || 1, t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / l)); best = Math.min(best, Math.hypot(x - ax - t * (bx - ax), z - az - t * (bz - az))); } return best; };
function buildingAt(x, z) {
  let near = null, d = 8; // (an address is often a point at the door: the nearest wall within 8 m counts)
  for (const b of data.buildings) {
    if (b.type === 'part' && !b.place) continue;
    if (insideRing(b.rings[0], x, z)) return b;
    const k = toRing(b.rings[0], x, z); if (k < d) { d = k; near = b; }
  }
  return near;
}
function spotNote(x, z) {
  const b = buildingAt(x, z);
  if (!b) return '<br>No building at this point today.';
  const place = b.place && placeMeshes.find((p) => p.place.key === b.place);
  if (place) return `<br>This is the ${place.place.name}: its label opens its story.`;
  if (!ages) return '';
  const when = ages.standing[b.group ?? b.id] ?? '1'.repeat(ages.stops.length); // (the file leaves out those standing at every stop)
  const label = (k) => (ages.stops[k] === 'bomben' ? 'November 1944' : ages.stops[k]), first = when.search(/[12]/);
  const text = first < 0 ? `The building here is newer than the plan of ${label(when.length - 1)}.`
    : first === 0 ? `A building already stands on this spot on the oldest plan, of ${label(0)}.`
    : `A building stands on this spot from the plan of ${label(first)} on; the plan of ${label(first - 1)} shows none.`;
  return `<br>${text}${when.includes('2') ? ' The damage map of November 1944 marks it as heavily damaged or lost.' : ''}<small>Read off the city’s old plans: an estimate, and of the spot, not of the house.</small>`;
}
let foundLabel = null;
const dropFound = () => { if (foundLabel) labels.remove(foundLabel); foundLabel = null; };
const search = createSearch(document.getElementById('search'), document.getElementById('search-note'), {
  onFound: ({ name, x, z, exact }) => {
    dropFound(); select(null);
    const g = terrain.heightAt(x, z);
    foundLabel = labels.add(name, [x, g + 16, z], null, 'found');
    flyTo(x, g + 8, z, 230);
    return exact ? spotNote(x, z) : '<small>This is the street. With a house number, the search also says since when a building stands there.</small>';
  },
  onClear: dropFound,
});

// ------------------------------------------------------------------------------------------- the «?»
const aboutButton = document.getElementById('about-button'), aboutBox = document.getElementById('about');
const showAbout = (on) => { aboutBox.hidden = !on; aboutButton.setAttribute('aria-expanded', String(on)); };
aboutButton.addEventListener('click', () => showAbout(aboutBox.hidden));
addEventListener('pointerdown', (ev) => { if (!aboutBox.hidden && !aboutBox.contains(ev.target) && ev.target !== aboutButton) showAbout(false); });

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
// the landmarks' names: on (those of the part of the city in view: src/labels.js) or off (only the one pointed at)
const namesButton = document.getElementById('names');
let namesOn = true;
try { namesOn = localStorage.getItem('names') !== '0'; } catch { /* no storage: on */ }
function setNames(on) { namesOn = on; namesButton.setAttribute('aria-pressed', String(on)); try { localStorage.setItem('names', on ? '1' : '0'); } catch { /* never mind */ } }
namesButton.addEventListener('click', () => setNames(!namesOn));
setNames(namesOn);
addEventListener('keydown', (ev) => {
  if (ev.target instanceof HTMLInputElement) return;
  if (ev.key === 'c' || ev.key === 'C') setLook(!inkTarget);
  if (ev.key === 'l' || ev.key === 'L') setNames(!namesOn);
  if (ev.key === 'Escape') { select(null); showAbout(false); }
});
setLook(false);

window.lab = { setNames, search: (text) => search.search(text), scene, camera, controls, renderer, city: city.stats, setLook, plan: (key) => timeline.then((t) => t?.show(key)), select: (key) => select(placeMeshes.find((p) => p.place.key === key) ?? null) };

// ---------------------------------------------------------------------------------------------------- the main loop
function resize() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const timer = new THREE.Timer();
let frame = 0;
renderer.setAnimationLoop((time) => {
  timer.update(time); const dt = timer.getDelta();
  LOOK.uTime.value += dt;
  // the look eases from one to the other
  const ink = (LOOK.uInk.value += Math.sign(inkTarget - LOOK.uInk.value) * Math.min(Math.abs(inkTarget - LOOK.uInk.value), dt / 0.6));
  scene.background.lerpColors(SKY.haze, SKY.paper, ink); scene.fog.color.copy(scene.background);
  // The outlines are drawn with a pen that thins as one steps back: from near, a firm line; from far, where every
  // house is a few pixels, a hair — and paler — or the town turns into a black thicket.
  const away = camera.position.distanceTo(controls.target), fine = THREE.MathUtils.clamp(320 / away, 0.3, 1);
  for (const m of [edgeMaterial, cityEdgeMaterial]) {
    m.linewidth = Math.max((0.9 + 0.7 * ink) * fine, 0.55) * renderer.getPixelRatio();
    m.opacity = (0.3 + 0.65 * ink) * (0.55 + 0.45 * fine);
  }
  STOP.uStop.value.z = Math.min(1, STOP.uStop.value.z + dt / 1.8); // (the timeline: the buildings that come and go)
  if (STOP.uStop.value.z === 1) city.showStops(STOP.uStop.value.y, STOP.uStop.value.y); // (arrived: what is left of the stop before is put away)
  for (const p of placeMeshes) {
    const h = p.mesh.material.userData.highlight, to = Math.max(p.target, p.hover ? 0.45 : 0); h.value += (to - h.value) * Math.min(1, dt * 6);
    // (a place that is not there yet at this year sinks into the ground, like the city's buildings, and rises back)
    const ease = (v) => Math.max(v * v * (3 - 2 * v), 0.002), towards = (v, want) => v + Math.sign(want - v) * Math.min(Math.abs(want - v), dt / 1.2);
    p.rise = towards(p.rise, p.hidden || p.ruined ? 0 : 1);
    p.mesh.visible = p.rise > 0.002; p.mesh.scale.y = ease(p.rise);
    if (p.ruin) { // (its ruin comes up as the place goes down, and the other way round)
      p.ruinRise = towards(p.ruinRise, p.ruined && !p.hidden ? 1 : 0);
      p.ruin.visible = p.ruinRise > 0.002; p.ruin.scale.y = ease(p.ruinRise); p.ruin.material.userData.highlight.value = h.value;
    }
  }
  if (flight) {
    flight.t = Math.min(1, flight.t + dt / 1.4);
    const e = flight.t < 0.5 ? 2 * flight.t * flight.t : 1 - (-2 * flight.t + 2) ** 2 / 2;
    camera.position.lerpVectors(flight.fromP, flight.toP, e); controls.target.lerpVectors(flight.fromT, flight.toT, e);
    if (flight.t === 1) flight = null;
  }
  controls.update();
  if (frame++ % 10 === 0) ground.update(controls.target, camera.position.distanceTo(controls.target)); // (which tiles of ground are sharp)
  sky.position.copy(camera.position);
  aimSun();
  renderer.render(scene, camera);
  labels.update(app.clientWidth, app.clientHeight, { all: namesOn, focus: controls.target, reach: 150 + 0.6 * camera.position.distanceTo(controls.target) });
});
