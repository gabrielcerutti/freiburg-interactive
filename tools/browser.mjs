// The test browser of tools/shot.mjs and tools/pace.mjs — Chrome for Testing, never your everyday browser — on
// macOS, Linux and Windows: where to find it, how to start it, how to kill it, and how much memory it takes.
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { exec, execSync } from 'node:child_process';

const mac = process.platform === 'darwin', win = process.platform === 'win32';

/** $CHROME if set, otherwise the newest Chrome for Testing in Playwright's cache (npx playwright-core install chromium) */
export function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const roots = [join(homedir(), 'Library/Caches/ms-playwright'), join(homedir(), '.cache/ms-playwright')];
  if (process.env.LOCALAPPDATA) roots.push(join(process.env.LOCALAPPDATA, 'ms-playwright'));
  const inside = ['chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-linux/chrome', 'chrome-win64/chrome.exe'];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const dirs = readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.split('-')[1] - a.split('-')[1]);
    for (const d of dirs) for (const p of inside) if (existsSync(join(root, d, p))) return join(root, d, p);
  }
  throw new Error('no Chrome for Testing found: set CHROME or run `npx playwright-core install chromium`');
}

/** the GPU on: Metal on macOS, Direct3D 11 on Windows (without it Chrome falls back to OpenGL, so slow there that
 *  a screenshot times out), the default elsewhere; on a laptop with two GPUs, the stronger one */
export const gpuArgs = ['--ignore-gpu-blocklist', '--enable-gpu', '--force_high_performance_gpu',
  ...(mac ? ['--use-angle=metal'] : win ? ['--use-angle=d3d11'] : [])];

// On Windows Chrome for Testing is called chrome.exe like the everyday Chrome, so its processes are picked by the
// path of the program, never by name.
// (a blocking call has a time limit: while it waits, the tools' own stop-after-a-time watchdogs cannot fire)
const ps = (script, done) => {
  const cmd = `powershell -NoProfile -NonInteractive -EncodedCommand ${Buffer.from(script, 'utf16le').toString('base64')}`;
  return done ? exec(cmd, { windowsHide: true }, done) : execSync(cmd, { windowsHide: true, timeout: 15_000, stdio: ['ignore', 'pipe', 'ignore'] });
};
const ours = (chrome) => `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.ExecutablePath -eq '${resolve(chrome).replace(/'/g, "''")}' }`;

/** kills every process of the test browser */
export function killChrome(chrome) {
  try {
    // (again until none is left: a child can outlive one pass, its parent already gone)
    if (win) ps(`for ($i = 0; $i -lt 8; $i++) { $p = @(${ours(chrome)}); if (-not $p.Count) { break }
  $p | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep -Milliseconds 250 }`);
    else execSync("pkill -9 -f 'Google Chrome for Testing'", { stdio: 'ignore' });
  } catch { /* none left */ }
}

/** the end of a run: the browser closed the normal way (up to 10 s), then whatever is left killed. On Windows a GPU
 *  process killed in the middle of a frame can hang in the graphics driver for minutes; closed first, it does not. */
export async function closeChrome(browser, chrome) {
  await Promise.race([browser.close().catch(() => {}), new Promise((done) => setTimeout(done, 10_000))]);
  killChrome(chrome);
}

/** asks, without blocking, how much memory (GB) every process of the test browser takes, summed; calls back with
 *  null if it cannot tell. macOS: the "memory" Activity Monitor shows (it counts what the GPU holds for the process,
 *  which plain `ps` does not). Windows: each process's private memory plus what the GPU holds for it (dedicated and
 *  shared), from the GPU's performance counters — counted differently from macOS, so the numbers of the two machines
 *  are not to be compared one for one. */
export function chromeMemory(chrome, back) {
  if (win) {
    ps(`$p = @(${ours(chrome)}); if (-not $p.Count) { 'none'; exit }
$ids = @{}; $sum = 0; foreach ($x in $p) { $ids["$($x.ProcessId)"] = 1; $sum += [double]$x.PrivatePageCount }
try { foreach ($c in (Get-Counter '\\GPU Process Memory(*)\\Dedicated Usage','\\GPU Process Memory(*)\\Shared Usage' -ErrorAction Stop).CounterSamples) {
  if ($c.InstanceName -match '^pid_(\\d+)_' -and $ids.ContainsKey($Matches[1])) { $sum += $c.CookedValue } } } catch {}
$sum`, (e, out) => { const s = String(out ?? '').trim(); back(e || s === 'none' || !s ? null : +(Number(s) / 1e9).toFixed(2)); });
    return;
  }
  exec("pgrep -f 'Google Chrome for Testing' | tr '\\n' ' '", (e1, pids) => {
    const ids = (pids ?? '').trim().split(/\s+/).filter(Boolean); if (!ids.length) return back(null);
    exec(`top -l 1 -stats pid,mem ${ids.map((id) => `-pid ${id}`).join(' ')}`, (e2, out) => {
      const gb = (out ?? '').split('\n').reduce((sum, line) => { const m = line.trim().match(/^\d+\s+([\d.]+)([KMG])/); return sum + (m ? m[1] * { K: 1e-6, M: 1e-3, G: 1 }[m[2]] : 0); }, 0);
      back(+gb.toFixed(2));
    });
  });
}
