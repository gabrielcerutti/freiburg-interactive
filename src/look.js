// How everything is drawn. One material (three.js's Lambert, with a few lines of shader added) for the buildings,
// the places, the trees and the ground, with two looks and a smooth switch between them (uInk, 0 → 1):
//   colour  the city painted: plaster walls with framed windows, shutters and doors, tiled roofs with their ridges,
//           dressed stone, cobbles, asphalt, grass and water, leafy trees; a warm sun and a cool shade;
//   ink     an engraving on sepia paper, after the viewer of Buenos Aires that inspired this one: paper and ink only.
//           Lit faces are paper; the shade darkens the paper towards a warm grey and is hatched with lines laid on
//           the surface itself (so they stay put when the camera moves, and melt into a tone far away); windows,
//           openings and iron are solid ink; roofs are a shade darker, with their courses; parks are stippled,
//           water is lined, and streets, banks and trees are outlined in ink.
// What is what is told by the `aFacade` attribute (src/buildings.js, KIND): [a, b, seed, kind].
// Every pattern knows how many pixels it covers and fades to its average tone when it gets finer than a pixel, so
// nothing shimmers in motion.
// The ground is not a picture: src/ground.js hands over two small maps of what each point is (street, green, water;
// which kind of street, wood or grass) and the shader cuts crisp edges out of them at any zoom and paints the
// surfaces itself.
// ASSUMED, all of it drawing convention and not data: the windows, frames, shutters and doors (OSM does not map
// them), the textures of the surfaces, the look of the foliage.
// A material can be highlighted (uHighlight, 0 → 1): the selected landmark glows in colour, or turns to red ink.
// The city follows the timeline (`rise`): every vertex of a building carries the ground it stands on and the stops
// at which it stands (aWhen, src/buildings.js), and as the timeline goes from one stop to another (STOP.uStop) the
// buildings that come rise out of the ground and those that go sink into it, each a moment apart. The shadows
// (riseDepthMaterial) and the ink outlines (riseLines) do the same.
import * as THREE from 'three';

/** Shared by every material: the look (0 colour, 1 ink) and the clock. */
export const LOOK = { uInk: { value: 0 }, uTime: { value: 0 } };

export const PAPER = new THREE.Color('#f4e9cf'), INK = new THREE.Color('#2e2620'), SHADE = new THREE.Color(0.6, 0.56, 0.57);

/**
 * The timeline, shared by everything that rises: the stop it comes from, the stop it goes to (0 … 7: the old plans;
 * 8: today) and how far along it is (0 → 1; src/main.js moves it).
 */
export const STOP = { uStop: { value: new THREE.Vector3(8, 8, 1) } };
const RISE_PARS = /* glsl */ `
  uniform vec3 uStop;
  float standsAt(float stops, float stop) { return mod(floor((stops + 0.5) / exp2(stop)), 2.0); }
  /** a point of a building, raised from its ground (when.x) as much as it stands now; far away when it does not at all */
  vec3 risen(vec3 p, vec2 when) {
    float a = standsAt(when.y, uStop.x), b = standsAt(when.y, uStop.y);
    float seed = fract(sin(when.x * 91.17) * 43758.5453);                  // (each building a moment apart)
    float k = mix(a, b, smoothstep(seed * 0.55, seed * 0.55 + 0.45, uStop.z));
    return k <= 0.0 ? vec3(0.0, -1.0e6, 0.0) : vec3(p.x, when.x + (p.y - when.x) * k, p.z);
  }
`;
const RISE_MAIN = /* glsl */ `
  #ifdef RISE
    transformed = risen(transformed, aWhen);
  #endif
`;

const VERTEX_PARS = /* glsl */ `
  #ifdef RISE
    attribute vec2 aWhen;
    ${RISE_PARS}
  #endif
  attribute vec4 aFacade;
  varying vec4 vFacade;
  varying vec3 vWPos;
  varying vec3 vWNor;
`;
const VERTEX_MAIN = /* glsl */ `
  vFacade = aFacade;
  vec4 wp = vec4(transformed, 1.0);
  vec3 wn = objectNormal;
  #ifdef USE_INSTANCING
    wp = instanceMatrix * wp; wn = mat3(instanceMatrix) * wn;
  #endif
  vWPos = (modelMatrix * wp).xyz;
  vWNor = normalize(mat3(modelMatrix) * wn);
`;

const FRAGMENT_PARS = /* glsl */ `
  uniform float uInk, uTime, uHighlight, uLightFull;
  uniform vec3 uPaper, uInkColour, uShade, uGlow;
  varying vec4 vFacade;
  varying vec3 vWPos;
  varying vec3 vWNor;
  #ifdef GROUND
    uniform sampler2D tMask, tSub, tPlan;
    uniform vec4 uPlan;   // x0, z0, width, depth of the old plan, in world metres
    uniform float uPlanOn; // 1 while an old plan lies on the ground
    uniform vec2 uPlanLevels; // the scan's tones of ink and of paper (grey, 0 to 1)
    uniform vec4 uGround; // x0, z0, width, depth of the masks, in world metres
  #endif

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); } // (colours are written as on screen and computed in linear light)
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) { return 0.6 * vnoise(p) + 0.3 * vnoise(p * 2.3 + 7.1) + 0.1 * vnoise(p * 5.1 + 3.7); }
  // 1 between a and b on a repeating coordinate f = fract(x / period), softened by w (the pixel size in f's units)
  float band(float f, float a, float b, float w) { return smoothstep(a - w, a + w, f) * (1.0 - smoothstep(b - w, b + w, f)); }
  // how much a pattern whose pixel size (in periods) is w is still worth drawing: 1 near, 0 when finer than a pixel
  float keep(float w) { return 1.0 - smoothstep(0.18, 0.45, w); }
  // a line every period along d (in metres on the surface), "width" of the period wide; far away, its mean tone
  float lines(float d, float period, float width) {
    float v = d / period, w = fwidth(v), f = abs(fract(v) - 0.5) * 2.0;
    float l = 1.0 - smoothstep(width - w, width + w, f);
    return mix(width, l, keep(w));
  }
  // a 2D position on the surface: along and up a wall, or across the ground and the roofs
  vec2 onSurface() {
    vec3 n = normalize(vWNor);
    if (abs(n.y) < 0.7) { vec2 t = normalize(vec2(-n.z, n.x) + vec2(1e-5, 0.0)); return vec2(dot(vWPos.xz, t), vWPos.y); }
    return vWPos.xz;
  }
  // the masks of the ground are soft-edged; these cut them sharp at whatever size a pixel is
  float cut(float v) { float w = clamp(fwidth(v) * 0.75, 0.004, 0.5); return smoothstep(0.5 - w, 0.5 + w, v); }
  float rimOf(float v, float reach) { float w = fwidth(v); return 1.0 - smoothstep(reach, reach + w + 0.004, abs(v - 0.5)); }
`;

// Painted on the albedo before the light is computed.
const FACADE = /* glsl */ `
  float inkMark = 0.0;  // 1 where the ink drawing is solid ink (windows, doors, rails)
  float inkTone = 0.0;  // 0..1: a mid tone of ink (shutters)
  float gGreen = 0.0, gWood = 0.0, gWater = 0.0, gPaved = 0.0, gLine = 0.0, gVine = 0.0, gRow = 0.0;
  vec4 gPlan = vec4(0.0); // the old plan at this point (its colour, and how much of it there is)
  {
    float kind = vFacade.w;
    if (kind > 1.5 && kind < 2.5 && abs(vWNor.y) < 0.35) {            // ---- a wall with windows
      vec2 t = normalize(vec2(-vWNor.z, vWNor.x) + vec2(1e-5, 0.0));
      float u = dot(vWPos.xz, t), v = vWPos.y - vFacade.x, eaves = vFacade.y - vFacade.x, seed = vFacade.z;
      float bay = 2.5 + fract(seed * 7.13) * 0.9, storey = 3.1;
      float cu = u / bay, cv = v / storey, fu = fract(cu), fv = fract(cv), n = floor(cv);
      float wu = fwidth(cu), wv = fwidth(cv), kk = keep(max(wu, wv));
      float inside = step(0.0, v) * (1.0 - smoothstep(eaves - 0.75, eaves - 0.55, v));
      float win, frame, shut = 0.0, door = 0.0;
      if (n < 1.0 && eaves > 4.5) {                                     // the ground floor: shop fronts, or windows; doors
        if (seed > 0.4) { win = band(fu, 0.14, 0.86, wu) * band(fv, 0.08, 0.76, wv); frame = band(fu, 0.1, 0.9, wu) * band(fv, 0.04, 0.8, wv); }
        else { win = band(fu, 0.35, 0.65, wu) * band(fv, 0.3, 0.76, wv); frame = band(fu, 0.31, 0.69, wu) * band(fv, 0.26, 0.8, wv); }
        if (hash(vec2(floor(cu), seed * 31.0)) < 0.28) {
          door = band(fu, 0.36, 0.64, wu) * (1.0 - smoothstep(0.72 - wv, 0.72 + wv, fv)); win = 0.0;
          frame = band(fu, 0.32, 0.68, wu) * (1.0 - smoothstep(0.76 - wv, 0.76 + wv, fv));
        }
      } else {                                                          // upper floors: a window per bay, some with shutters
        win = band(fu, 0.33, 0.67, wu) * band(fv, 0.3, 0.8, wv); frame = band(fu, 0.29, 0.71, wu) * band(fv, 0.26, 0.84, wv);
        shut = step(0.55, fract(seed * 3.7)) * (band(fu, 0.19, 0.29, wu) + band(fu, 0.71, 0.81, wu)) * band(fv, 0.3, 0.8, wv);
      }
      vec3 wall = diffuseColor.rgb * (0.96 + 0.08 * vnoise(vec2(u, vWPos.y) * 0.4 + seed * 40.0));
      vec3 c = wall;
      c = mix(c, wall * 1.2 + 0.03, clamp(frame - win - door, 0.0, 1.0) * inside * kk);
      c = mix(c, mix(srgb(vec3(0.31, 0.42, 0.29)), srgb(vec3(0.45, 0.3, 0.22)), step(0.5, fract(seed * 11.3))), shut * inside * kk);
      c = mix(c, srgb(vec3(0.3, 0.22, 0.16)), door * kk);
      float glassAt = mix(0.17 * inside, win * inside, kk);            // (far away: the windows' share of the wall, as a tone)
      c = mix(c, mix(vec3(0.05, 0.06, 0.08), vec3(0.1, 0.13, 0.17), fv), glassAt);
      if (eaves > 4.5) c = mix(c, wall * 1.14, (1.0 - smoothstep(0.05, 0.09, abs(v - storey))) * kk); // a string course
      c *= mix(1.0, 0.76, smoothstep(eaves - 0.5, eaves - 0.12, v) * step(v, eaves + 0.02));        // the eaves' shadow
      c *= mix(0.78, 1.0, smoothstep(0.0, 0.5, v));                                                   // the plinth
      diffuseColor.rgb = c;
      inkMark = max(glassAt, door * kk); inkTone = shut * inside * kk * 0.5;
    } else if (kind > 2.5 && kind < 3.5 && vWNor.y > 0.2) {           // ---- roof tiles (a: the ridge's height, b: the eaves')
      vec2 t = normalize(vec2(-vWNor.z, vWNor.x) + vec2(1e-5, 0.0));
      float u = dot(vWPos.xz, t), y = vWPos.y, wt = max(fwidth(u / 0.26), fwidth(y / 0.32));
      vec3 c = diffuseColor.rgb * (1.0 - 0.18 * lines(y, 0.32, 0.2));
      c *= 1.0 + (hash(floor(vec2(u / 0.26, y / 0.32))) - 0.5) * 0.16 * keep(wt);            // tile by tile
      c *= 0.94 + 0.12 * vnoise(vec2(u, y) * 0.5 + vFacade.z * 30.0);                          // weathering
      c *= mix(1.0, 0.7, smoothstep(vFacade.x - 0.3, vFacade.x - 0.2, y));                     // the ridge
      c *= mix(0.82, 1.0, smoothstep(vFacade.y + 0.05, vFacade.y + 0.3, y));                   // the eaves' edge
      diffuseColor.rgb = c;
    } else if (kind > 3.5 && kind < 4.5 && abs(vWNor.y) < 0.5) {       // ---- dressed stone: courses and joints
      vec2 t = normalize(vec2(-vWNor.z, vWNor.x) + vec2(1e-5, 0.0));
      vec2 b = vec2(dot(vWPos.xz, t) / 0.9, vWPos.y / 0.45); b.x += 0.5 * mod(floor(b.y), 2.0);
      vec2 f = fract(b), w = fwidth(b); float kk = keep(max(w.x, w.y));
      float joint = 1.0 - band(f.x, 0.03, 0.97, w.x) * band(f.y, 0.05, 0.95, w.y);
      diffuseColor.rgb *= (1.0 - 0.13 * mix(0.14, joint, kk)) * (1.0 + (hash(floor(b)) - 0.5) * 0.08 * kk);
    } else if (kind > 5.5 && kind < 6.5) {                             // ---- a runnel (the Bächle): water between two stone edges
      float e = smoothstep(0.55, 0.75, abs(vFacade.x));
      diffuseColor.rgb = mix(srgb(vec3(0.42, 0.62, 0.7)), srgb(vec3(0.6, 0.57, 0.5)), e);
      inkMark = 0.75;
    } else if (kind > 7.5 && vWNor.y > 0.05) {                         // ---- glazed tiles laid in diamonds of four colours
      vec2 t = normalize(vec2(-vWNor.z, vWNor.x) + vec2(1e-5, 0.0));
      vec2 p = vec2(dot(vWPos.xz, t) / 0.46, vWPos.y / 0.62), q = vec2(p.x + p.y, p.x - p.y), cell = floor(q), f = fract(q), w = fwidth(q);
      float which = mod(cell.x, 2.0) + 2.0 * mod(cell.y, 2.0), kk = keep(max(w.x, w.y));
      vec3 tile = which < 0.5 ? srgb(vec3(0.3, 0.5, 0.33)) : which < 1.5 ? srgb(vec3(0.86, 0.72, 0.3)) : which < 2.5 ? srgb(vec3(0.62, 0.25, 0.18)) : srgb(vec3(0.9, 0.87, 0.78));
      float joint = 1.0 - band(f.x, 0.05, 0.95, w.x) * band(f.y, 0.05, 0.95, w.y);
      diffuseColor.rgb = mix(srgb(vec3(0.55, 0.5, 0.32)), tile, kk) * (1.0 - 0.3 * joint * kk); // (far away: the four, mixed)
      inkTone = (step(which, 0.5) * 0.55 + step(1.5, which) * step(which, 2.5) * 0.35) * kk + 0.2 * (1.0 - kk);
      inkMark = joint * kk * 0.7;
    } else if (kind > 6.5 && kind < 7.5) {                             // ---- a track: two rails (a: metres from the middle, b: half the gauge)
      float w = fwidth(vFacade.x), d = abs(abs(vFacade.x) - vFacade.y);
      float rail = (1.0 - smoothstep(0.045, 0.045 + w, d)) * (1.0 - smoothstep(0.1, 0.35, w));
      if (rail < 0.35) discard;
      diffuseColor.rgb = srgb(vec3(0.33, 0.31, 0.3)); inkMark = 1.0;
    }
    #ifdef GROUND
    {
      vec2 P = vWPos.xz, guv = (P - uGround.xy) / uGround.zw;
      vec3 gm = vec3(0.0), gs = vec3(0.0);
      if (guv.x > 0.0 && guv.x < 1.0 && guv.y > 0.0 && guv.y < 1.0) { gm = texture2D(tMask, guv).rgb; gs = texture2D(tSub, guv).rgb; }
      float px = length(fwidth(P));                                     // metres per pixel
      gPaved = cut(gm.r); gWater = cut(gm.b) * (1.0 - gPaved); gGreen = cut(gm.g) * (1.0 - gPaved) * (1.0 - gWater);
      gWood = smoothstep(0.55, 0.8, gs.g);
      gLine = max(rimOf(gm.r, 0.09), max(rimOf(gm.b, 0.09) * (1.0 - gPaved), 0.5 * rimOf(gm.g, 0.06) * (1.0 - gPaved))) * (1.0 - smoothstep(0.5, 1.6, px));
      float n1 = fbm(P * 0.07), n2 = vnoise(P * 0.8), near = 1.0 - smoothstep(0.06, 0.25, px), grain = (hash(floor(P * 6.0)) - 0.5) * near;
      vec3 base = srgb(vec3(0.89, 0.84, 0.73)) * (0.93 + 0.12 * n1) * (1.0 + 0.07 * grain);
      // cobbles: a brick bond of small stones, each its own shade, with joints
      vec2 cb = P / vec2(0.44, 0.24); cb.x += 0.5 * mod(floor(cb.y), 2.0);
      vec2 cf = fract(cb), cw = fwidth(cb); float ck = keep(max(cw.x, cw.y));
      float joint = 1.0 - band(cf.x, 0.06, 0.94, cw.x) * band(cf.y, 0.1, 0.9, cw.y);
      vec3 paving = srgb(vec3(0.85, 0.8, 0.7)) * (0.95 + 0.08 * n1) * (1.0 + (hash(floor(cb)) - 0.5) * 0.14 * ck) * (1.0 - 0.2 * mix(0.2, joint, ck));
      vec3 asphalt = srgb(vec3(0.69, 0.67, 0.64)) * (0.94 + 0.1 * n2) * (1.0 + 0.1 * grain);
      vec3 path = srgb(vec3(0.91, 0.87, 0.77)) * (0.95 + 0.08 * n2) * (1.0 + 0.08 * grain);
      vec3 street = mix(mix(path, paving, smoothstep(0.25, 0.4, gs.r)), asphalt, smoothstep(0.65, 0.85, gs.r));
      vec3 grass = mix(srgb(vec3(0.56, 0.69, 0.38)), srgb(vec3(0.68, 0.78, 0.47)), n1) * (0.9 + 0.2 * n2) * (1.0 + 0.16 * grain);
      vec3 wood = srgb(vec3(0.42, 0.53, 0.3)) * (0.88 + 0.24 * n2) * (1.0 + 0.12 * grain);
      vec3 water = srgb(vec3(0.47, 0.65, 0.72)) * (0.94 + 0.1 * n2) * (1.0 + 0.07 * lines(P.y + 0.7 * vnoise(P * 0.35), 1.3, 0.2));
      // a vineyard: rows of vines 2 m apart, each its own shade, with pale grass between (the rows' direction comes
      // with the map; that there are rows, how wide and how far apart, is the illustration's)
      gVine = smoothstep(0.12, 0.26, gs.b);
      float va = (clamp(gs.b, 0.302, 1.0) - 0.302) / 0.698 * 3.14159265, vr = dot(P, vec2(-sin(va), cos(va))) / 2.0, vw = fwidth(vr), vk = keep(vw);
      gRow = mix(0.5, band(fract(vr), 0.22, 0.78, vw), vk);
      float along = dot(P, vec2(cos(va), sin(va))), tuft = vnoise(vec2(along * 0.9, floor(vr) * 7.3));
      vec3 vines = mix(srgb(vec3(0.74, 0.77, 0.5)), srgb(vec3(0.36, 0.52, 0.24)) * (0.85 + 0.3 * tuft * vk) * (1.0 + (hash(vec2(floor(vr), 3.0)) - 0.5) * 0.18 * vk), gRow) * (0.95 + 0.1 * n1);
      vec3 c = mix(base, mix(mix(grass, wood, gWood), vines, gVine), gGreen);
      c = mix(c, water, gWater);
      c = mix(c, street, gPaved);
      diffuseColor.rgb = mix(c, c * 0.6, gLine * 0.75);                 // kerbs and banks
      // an old plan instead, where its sheet reaches: in colour, as it was scanned
      vec2 puv = (P - uPlan.xy) / uPlan.zw;
      if (uPlanOn > 0.5 && puv.x > 0.0 && puv.x < 1.0 && puv.y > 0.0 && puv.y < 1.0) {
        gPlan = texture2D(tPlan, puv);
        diffuseColor.rgb = mix(diffuseColor.rgb, gPlan.rgb, gPlan.a);
      }
    }
    #endif
  }
`;

// Replaces three's last step: from the lit colour to the ink drawing (by uInk), then the highlight.
const OUTPUT = /* glsl */ `
  {
    float kind = vFacade.w;
    // the light this point gets, relative to a fully lit roof: 0 in deep shadow, about 1 in the sun
    float lit = clamp(luma(outgoingLight) / max(luma(diffuseColor.rgb) * uLightFull, 1e-3), 0.0, 1.3);
    float k = smoothstep(0.3, 0.92, lit);
    float rim = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
    // colour: a warm sun and a cool shade
    vec3 colour = outgoingLight * mix(vec3(0.84, 0.89, 1.05), vec3(1.05, 1.0, 0.93), k);

    // ink: paper, darkened and hatched in the shade
    vec2 s = onSurface();
    float roof = step(2.5, kind) * step(kind, 3.5) * step(0.2, vWNor.y); // (plain tiles; the diamonds draw themselves)
    vec3 ink = uPaper * mix(0.74, 1.03, k);
    #ifdef GROUND
    {
      // The old plan, where there is one: redrawn with our ink on our paper, from its scan's tones of ink and paper.
      float drawn = 1.0 - smoothstep(uPlanLevels.x + 0.08, uPlanLevels.y - 0.04, pow(luma(gPlan.rgb), 1.0 / 2.2));
      // Without it: parks stippled (woods more densely), water lined, streets and banks outlined
      vec2 sc = vWPos.xz / mix(0.95, 0.6, gWood), si = floor(sc), sf = fract(sc) - 0.5 - (vec2(hash(si), hash(si + 7.3)) - 0.5) * 0.55;
      float dw = length(fwidth(sc)), dots = mix(0.07, 1.0 - smoothstep(0.1 - dw, 0.1 + dw, length(sf)), keep(dw));
      vec3 own = mix(ink, uInkColour, gGreen * mix(dots, gRow * 0.45, gVine) * 0.8); // (a vineyard: its rows, not dots)
      own = mix(own, uInkColour, gWater * lines(vWPos.z + 0.3 * sin(vWPos.x * 1.1), 0.75, 0.2) * 0.6);
      own = mix(own, uInkColour, gLine * 0.85);
      ink = mix(own, mix(ink, uInkColour, drawn * 0.88), gPlan.a);
    }
    #endif
    ink = mix(ink, mix(uInkColour, uPaper, 0.66) * mix(0.72, 1.06, k), roof);            // roofs a shade darker
    ink = mix(ink, uInkColour, roof * lines(vWPos.y, 0.64, 0.14) * 0.4);                  // and their courses
    ink = mix(ink, uInkColour, roof * smoothstep(vFacade.x - 0.3, vFacade.x - 0.2, vWPos.y) * 0.5); // and ridges
    ink = mix(ink, uInkColour, inkTone);
    float raya = lines(s.x + s.y * 1.4, 0.45, 0.42);
    ink = mix(ink, uInkColour, raya * (1.0 - k) * 0.4);                                     // the hatching
    if (kind > 4.5 && kind < 5.5) {                                                        // ---- foliage, in three tones with a dark rim
      float leaf = vnoise(vWPos.xz * 1.9 + vWPos.y * 1.3), l = lit + (leaf - 0.5) * 0.5;
      float tone = 0.5 * smoothstep(0.36, 0.42, l) + 0.5 * smoothstep(0.74, 0.8, l);
      float edge = smoothstep(0.58, 0.78, rim + (leaf - 0.5) * 0.2);
      colour = diffuseColor.rgb * uLightFull * mix(0.4, 1.16, tone) * mix(vec3(0.86, 0.94, 1.08), vec3(1.06, 1.0, 0.9), tone);
      colour = mix(colour, colour * 0.42, edge * 0.8);
      ink = mix(uInkColour, uPaper, mix(0.22, 0.86, tone));
      ink = mix(ink, uInkColour, lines(s.x - s.y, 0.3, 0.38) * (1.0 - tone) * 0.5);
      ink = mix(ink, uInkColour, edge * 0.9);
    }
    ink *= mix(uShade, vec3(1.0), smoothstep(0.42, 0.94, lit));                           // the shadow's tone
    // solid ink: the windows, and whatever is near black (openings, iron); colours are linear here
    float dark = max(inkMark, 1.0 - smoothstep(0.022, 0.034, luma(diffuseColor.rgb)));
    vec3 inkColour = mix(uInkColour, vec3(0.62, 0.12, 0.08), uHighlight);
    ink = mix(ink, inkColour * 1.12, dark);
    ink = mix(ink, mix(ink, vec3(0.75, 0.2, 0.13), 0.55), uHighlight * (1.0 - dark));      // the selected one, in red
    ink *= 0.975 + 0.05 * hash(floor(gl_FragCoord.xy * 0.5));                              // the grain of the paper
    colour = mix(colour, ink, uInk);

    // the highlight in colour: a slow glow with a brighter rim
    float pulse = 0.75 + 0.25 * sin(uTime * 3.0);
    colour = mix(colour, uGlow, uHighlight * (1.0 - uInk) * (0.3 + 0.4 * rim * rim) * pulse);
    gl_FragColor = vec4(colour, diffuseColor.a);
  }
`;

const BLANK = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1); BLANK.needsUpdate = true;

/**
 * Lays an old plan on a ground material: `texture` (the scan; see-through where its sheet ends) over `area`
 * [x0, z0, width, depth], with the scan's `levels` [ink, paper]. Without a texture, the plan is taken away.
 */
export function setPlan(material, texture, area = [0, 0, 1, 1], levels = [0, 1]) {
  const p = material.userData.plan;
  p.tPlan.value = texture ?? BLANK; p.uPlan.value.set(...area); p.uPlanLevels.value.set(...levels); p.uPlanOn.value = texture ? 1 : 0;
}

/** Gives a ground material other maps: `mask` and `sub` over `area` [x0, z0, width, depth]. */
export function setGround(material, mask, sub, area) {
  const g = material.userData.ground;
  g.tMask.value = mask; g.tSub.value = sub; g.uGround.value.set(...area);
}

/**
 * A Lambert material with the look. `ground`: { mask, sub, area: [x0, z0, width, depth] } for the ground (its two
 * maps and the rectangle they cover). Every material is pushed back a little in depth, so the ink outlines drawn on
 * its edges never flicker.
 */
export function lookMaterial({ ground = null, vertexColors = !ground, rise = false } = {}) {
  const m = new THREE.MeshLambertMaterial({ vertexColors, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const own = { uHighlight: { value: 0 } };
  m.userData.highlight = own.uHighlight;
  // (the ground's old plan comes and goes with the timeline: see setPlan above)
  const plan = { tPlan: { value: BLANK }, uPlan: { value: new THREE.Vector4(0, 0, 1, 1) }, uPlanOn: { value: 0 }, uPlanLevels: { value: new THREE.Vector2(0, 1) } };
  // (and its two maps can be changed for sharper ones, tile by tile: see setGround below)
  const maps = ground ? { tMask: { value: ground.mask }, tSub: { value: ground.sub }, uGround: { value: new THREE.Vector4(...ground.area) } } : null;
  if (ground) { m.userData.plan = plan; m.userData.ground = maps; }
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, LOOK, own, {
      uPaper: { value: PAPER }, uInkColour: { value: INK }, uShade: { value: SHADE }, uGlow: { value: new THREE.Color('#ffd27a') },
      uLightFull: { value: LIGHT_FULL },
    });
    if (rise) { Object.assign(shader.uniforms, STOP); shader.defines = { ...shader.defines, RISE: '' }; }
    if (ground) {
      Object.assign(shader.uniforms, plan, maps);
      shader.defines = { ...shader.defines, GROUND: '' };
    }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_PARS}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${RISE_MAIN}`)
      .replace('#include <fog_vertex>', `#include <fog_vertex>\n${VERTEX_MAIN}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_PARS}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${FACADE}`)
      .replace('#include <opaque_fragment>', OUTPUT);
  };
  m.customProgramCacheKey = () => (ground ? 'look-ground' : rise ? 'look-rise' : 'look');
  return m;
}

/** For the shadows of what rises: the depth material three.js would use, with the same rise. (As a mesh's customDepthMaterial.) */
export function riseDepthMaterial() {
  const m = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, STOP);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nattribute vec2 aWhen;\n${RISE_PARS}`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n  transformed = risen(transformed, aWhen);');
  };
  m.customProgramCacheKey = () => 'rise-depth';
  return m;
}

/** For the ink outlines of what rises: a LineMaterial whose segments carry `instanceWhen` and rise with their building. */
export function riseLines(material) {
  const before = material.vertexShader;
  material.uniforms.uStop = STOP.uStop;
  material.vertexShader = before
    .replace('attribute vec3 instanceEnd;', `attribute vec3 instanceEnd;\nattribute vec2 instanceWhen;\n${RISE_PARS}`)
    .replace('vec4( instanceStart, 1.0 )', 'vec4( risen( instanceStart, instanceWhen ), 1.0 )')
    .replace('vec4( instanceEnd, 1.0 )', 'vec4( risen( instanceEnd, instanceWhen ), 1.0 )');
  if (material.vertexShader.split('risen(').length !== 4) console.warn('the outlines could not be made to follow the timeline (three.js changed its line shader?)');
  material.needsUpdate = true;
  return material;
}

/** How bright a fully sunlit horizontal surface of albedo 1 comes out with the lights in src/main.js. */
export let LIGHT_FULL = 1;
export function setLightFull(v) { LIGHT_FULL = v; }
