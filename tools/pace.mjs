// How long a frame takes, what is being drawn, and how much memory the browser takes while it runs: for finding out
// what made the viewer slow or hungry.
//   node tools/pace.mjs [--hide name,name] [--no-shadows] [--url http://localhost:5173/]
//   (--url: measure a server that is already running — yours — instead of starting one)
//   (names of objects in the scene to hide first: city, trees, ground, lines, outlines, or a place's key)
// It watches the memory of its own browser every 3 s and stops at once if it passes 6 GB or if the run takes more
// than a minute; whatever happens, the browser is killed at the end.
// Uses the same headless Chrome for Testing as tools/shot.mjs, on its own port.
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { findChrome, gpuArgs, killChrome, chromeMemory } from './browser.mjs';

const args = process.argv.slice(2), hide = args.includes('--hide') ? args[args.indexOf('--hide') + 1].split(',') : [];
if (args.includes('--no-shadows')) hide.push('shadows');
// the memory of every process of the test browser, summed (tools/browser.mjs says what is counted on each system),
// asked without blocking every 3 s
const chrome = findChrome(), kill = () => killChrome(chrome);
const series = [];
const watch = setInterval(() => chromeMemory(chrome, (gb) => {
  if (gb === null) return;
  series.push(gb);
  if (gb > 6) { console.log('MEMORY PASSED 6 GB — stopping.', series.join(' ')); kill(); process.exit(2); }
}), 3000);
// and whatever happens, the whole run ends after a minute
const t0 = Date.now(), stage = (what) => console.log(`${((Date.now() - t0) / 1000).toFixed(1)} s  ${what}`);
setTimeout(() => { console.log('TOOK MORE THAN 75 s — stopping. memory, GB:', series.join(' ')); kill(); process.exit(3); }, 75_000);
const url = args.includes('--url') ? args[args.indexOf('--url') + 1] : null;
const server = url ? { close: async () => {} } : await createServer({ server: { port: 5432, strictPort: true }, logLevel: 'silent', cacheDir: 'node_modules/.vite-tools' });
if (!url) await server.listen();
const browser = await chromium.launch({ executablePath: chrome, headless: true, args: gpuArgs });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on('pageerror', (e) => console.log('[page error]', e.message));
  let said = 0; // (only the first few complaints: a broken shader repeats itself hundreds of times)
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && said++ < 4) console.log(`[page ${m.type()}]`, m.text().slice(0, 600)); });
  stage('browser open'); await page.goto(url ?? 'http://localhost:5432/'); stage('page loaded');
  await page.waitForFunction(() => window.lab, null, { timeout: 45_000, polling: 500 }); stage('city built');
  const result = await page.evaluate(async (hide) => {
    lab.scene.traverse((o) => { if (hide.includes(o.name) || (hide.includes('outlines') && o.isLineSegments2)) o.visible = false; });
    if (hide.includes('shadows')) lab.renderer.shadowMap.enabled = false;
    const times = [], start = performance.now(); let last = start;
    await new Promise((done) => { const tick = () => { const now = performance.now(); times.push(now - last); last = now; if (times.length < 40 && now < start + 8000) requestAnimationFrame(tick); else done(); }; requestAnimationFrame(tick); });
    times.sort((a, b) => a - b);
    const i = lab.renderer.info;
    return { frames: times.length, medianMs: +times[Math.floor(times.length / 2)].toFixed(1), worstMs: +times[times.length - 1].toFixed(1), calls: i.render.calls, triangles: i.render.triangles, lines: i.render.lines, programs: i.programs?.length };
  }, hide);
  stage('frames measured');
  console.log(hide.length ? `hidden: ${hide.join(', ')}` : 'everything visible', result);
  await new Promise((r) => setTimeout(r, 9000)); // (a few more memory readings)
  console.log('memory, GB, every 3 s:', series.join(' '));
} catch (e) {
  console.log('FAILED:', String(e.message).slice(0, 500));
  console.log('memory, GB, every 3 s:', series.join(' '));
} finally { clearInterval(watch); kill(); await server.close(); process.exit(0); }
