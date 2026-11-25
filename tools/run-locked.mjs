// Runs a command while holding a named lock, so that several workers (Claude subagents building landmarks side by
// side) never do the same kind of thing at once. The names in use: `net` (anything that makes a web request),
// `city` (npm run city, and the checks that read its output), `shot` (screenshots: the tool kills every test browser).
//   node tools/run-locked.mjs <name> [--gap ms] -- <command> [args…]
// `--gap`: at least this long after the previous holder finished (for downloads: one request at a time, 2.5 s apart).
import { mkdirSync, rmdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const args = process.argv.slice(2), cut = args.indexOf('--');
if (cut < 1) { console.error('usage: run-locked.mjs <name> [--gap ms] -- <command> [args…]'); process.exit(2); }
const name = args[0], gap = args.includes('--gap') && args.indexOf('--gap') < cut ? Number(args[args.indexOf('--gap') + 1]) : 0, cmd = args.slice(cut + 1);
const dir = join(tmpdir(), 'freiburg-interactive-locks'), lock = join(dir, `${name}.lock`), stamp = join(dir, `${name}.last`);
const STALE = { net: 600_000, shot: 150_000, city: 180_000 }[name] ?? 300_000;
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
mkdirSync(dir, { recursive: true });
for (let waited = 0; ; waited += 400) {
  try { mkdirSync(lock); break; } catch {
    try { if (Date.now() - statSync(lock).mtimeMs > STALE) { rmdirSync(lock); continue; } } catch { /* gone meanwhile */ }
    if (waited > 1_200_000) { console.error(`run-locked: gave up waiting for "${name}"`); process.exit(4); }
    sleep(400);
  }
}
let code = 1;
try {
  if (gap && existsSync(stamp)) { const since = Date.now() - Number(readFileSync(stamp, 'utf8')); if (since < gap) sleep(gap - since); }
  const r = spawnSync(cmd[0], cmd.slice(1), { stdio: 'inherit' });
  code = r.status ?? 1;
} finally {
  writeFileSync(stamp, String(Date.now()));
  try { rmdirSync(lock); } catch { /* already gone */ }
}
process.exit(code);
