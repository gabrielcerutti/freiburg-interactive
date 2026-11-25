// Takes a screenshot of the viewer with a headless Chrome for Testing (never your everyday browser).
//   node tools/shot.mjs [out.png] [--view x,y,z,tx,ty,tz] [--card] [--ink] [--select <key>] [--viewer] [--scroll px] [--plan <key>] [--then <key>] [--size WxH] [--eval <js>]
//   (--viewer: with --select, opens the place's photos and goes to the second one; --scroll: scrolls the card down;
//    --then: after everything else, picks another year and takes the picture half way through the change;
//    --eval: prints what a line of JavaScript gives in the page (say, "lab.city");
//    --no-webgl: a browser that cannot do 3D, to see the message the page shows)
// Starts its own Vite server on port 5431, waits for the city to load, and saves the picture (default: shots/view.png).
// Chrome: $CHROME if set, otherwise the newest "Google Chrome for Testing" in Playwright's cache (npx playwright-core install chromium).
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const out = args.find((a, i) => !a.startsWith('--') && !['--view', '--select', '--scroll', '--plan', '--then', '--size', '--eval'].includes(args[i - 1])) ?? 'shots/view.png';
const view = args.includes('--view') ? args[args.indexOf('--view') + 1].split(',').map(Number) : null;

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = join(homedir(), 'Library/Caches/ms-playwright'), linux = join(homedir(), '.cache/ms-playwright');
  for (const root of [cache, linux]) {
    if (!existsSync(root)) continue;
    for (const d of readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()) {
      for (const p of ['chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-linux/chrome']) {
        if (existsSync(join(root, d, p))) return join(root, d, p);
      }
    }
  }
  throw new Error('no Chrome for Testing found: set CHROME or run `npx playwright-core install chromium`');
}

// Whatever happens — a broken shader, a page that never loads — the test browser is killed at the end, and the whole
// run stops after 90 s: a browser left behind with a broken page can eat all the memory of the machine.
const kill = () => { try { execSync("pkill -9 -f 'Google Chrome for Testing'"); } catch { /* none left */ } };
setTimeout(() => { console.error('TOOK MORE THAN 90 s — stopping.'); kill(); process.exit(3); }, 90_000);
const server = await createServer({ server: { port: 5431, strictPort: true }, logLevel: 'silent', cacheDir: 'node_modules/.vite-tools' }); // (its own cache: a dev server already running keeps its own)
await server.listen();
const noWebgl = args.includes('--no-webgl'); // (to see what the page says in a browser that cannot do 3D)
const browser = await chromium.launch({ executablePath: findChrome(), headless: true, args: noWebgl ? ['--disable-3d-apis'] : ['--ignore-gpu-blocklist', '--use-angle=metal', '--enable-gpu'] });
try {
  const page = await browser.newPage({ viewport: opt('--size') ? { width: Number(opt('--size').split('x')[0]), height: Number(opt('--size').split('x')[1]) } : { width: 1600, height: 1000 } });
  let said = 0; // (only the first few complaints: a broken shader repeats itself hundreds of times)
  page.on('console', (m) => { if ((m.type() === 'warning' || m.type() === 'error') && said++ < 4) console.log(`[page ${m.type()}]`, m.text().slice(0, 600)); });
  page.on('pageerror', (e) => console.log('[page error]', e.message));
  await page.goto('http://localhost:5431/');
  await page.waitForFunction((no) => (no ? document.querySelector('#status.failed') : window.lab), noWebgl, { timeout: 45_000, polling: 500 });
  if (noWebgl) { mkdirSync(dirname(out), { recursive: true }); await page.screenshot({ path: out, timeout: 20_000 }); console.log(out); throw new Error('(as asked: no WebGL)'); }
  if (view) await page.evaluate(([x, y, z, tx, ty, tz]) => { lab.camera.position.set(x, y, z); lab.controls.target.set(tx, ty, tz); lab.controls.update(); }, view);
  if (opt('--plan')) { await page.evaluate((k) => lab.plan(k), opt('--plan')); await page.waitForTimeout(1500); }
  if (args.includes('--ink')) await page.evaluate(() => lab.setLook(true));
  if (opt('--select')) await page.evaluate((k) => lab.select(k), opt('--select'));
  if (args.includes('--card')) await page.click('.label');
  if (args.includes('--viewer')) { await page.waitForSelector('#card .photo .open', { timeout: 10_000 }); await page.click('#card .photo .open'); await page.keyboard.press('ArrowRight'); }
  if (opt('--scroll')) { await page.waitForSelector('#card .photo .open', { timeout: 10_000 }); await page.evaluate((y) => { document.querySelector('#card .body').scrollTop = y; }, Number(opt('--scroll'))); }
  if (view && (opt('--select') || args.includes('--card'))) await page.waitForTimeout(1600); // (let the flight finish)
  if (view && opt('--select')) await page.evaluate(([x, y, z, tx, ty, tz]) => { lab.camera.position.set(x, y, z); lab.controls.target.set(tx, ty, tz); lab.controls.update(); }, view);
  await page.waitForTimeout(args.includes('--card') || opt('--select') || args.includes('--ink') ? 1800 : 1200);
  if (opt('--eval')) console.log(JSON.stringify(await page.evaluate(opt('--eval'))));
  if (opt('--then')) { await page.evaluate((k) => lab.plan(k), opt('--then')); await page.waitForTimeout(900); }
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, timeout: 20_000 });
  console.log(out);
} catch (e) {
  console.error('FAILED:', String(e.message).slice(0, 400)); process.exitCode = 1;
} finally {
  kill();
  await server.close();
  process.exit(process.exitCode ?? 0);
}
