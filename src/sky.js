// The sky: a dome around the camera, a pale blue overhead that thins into a warm haze at the horizon — the haze is
// the colour of the fog, so the far end of the city fades into it. In the ink look it is all paper.
// An illustration choice, like the light: not the weather of any day.
import * as THREE from 'three';
import { LOOK, PAPER } from './look.js';

export const SKY = { top: new THREE.Color('#8fb9d3'), haze: new THREE.Color('#e2e8e2'), paper: PAPER.clone().multiplyScalar(0.97) };

export function buildSky() {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
    uniforms: { uTop: { value: SKY.top }, uHaze: { value: SKY.haze }, uPaper: { value: SKY.paper }, uInk: LOOK.uInk },
    vertexShader: 'varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      uniform vec3 uTop, uHaze, uPaper; uniform float uInk; varying vec3 vDir;
      void main() {
        float up = normalize(vDir).y;
        vec3 sky = mix(uHaze, uTop, smoothstep(0.0, 0.32, up)); // (below the horizon: haze)
        gl_FragColor = vec4(mix(sky, uPaper, uInk), 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), material);
  mesh.name = 'sky'; mesh.renderOrder = -10; mesh.frustumCulled = false; mesh.raycast = () => {};
  return mesh;
}
