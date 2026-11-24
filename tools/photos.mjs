// The photos of the places, from Wikimedia Commons to public/photos/:
//   node tools/photos.mjs   -> sources/photos/<title>.<ext>     (what was downloaded, once)
//                              public/photos/<key>-<n>.webp      (at most 1280 px wide)
//                              public/photos/photos.json         (per place: file, size, caption, author, date,
//                                                                 licence, licence link, the Commons page)
// The list and the captions are in src/places/photos.js. Each file's author, date and licence are read from Commons,
// and only public-domain or Creative Commons files are accepted.
// Manners: one request at a time, 2.6 s apart (6 s for the pictures themselves), waiting when the server asks to,
// with a generic User-Agent and no personal data.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { PHOTOS } from '../src/places/photos.js';

const USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';
const FREE = /^(public domain|pd\b|cc0|cc by(-sa)? \d\.\d|no restrictions)/i;
const WIDTH = 1280; // (the widest the pictures are kept)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
let last = 0;
/** one request at a time; the picture server is asked more slowly, and when it says "too many" (429) we wait as
 *  long as it asks (Retry-After) and try again, a few times */
async function get(url) {
  const gap = url.includes('upload.wikimedia.org') ? 6000 : 2600;
  for (let attempt = 1; ; attempt++) {
    const pause = last + gap - Date.now(); if (pause > 0) await wait(pause);
    last = Date.now();
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) return res;
    if (res.status !== 429 || attempt === 5) throw new Error(`HTTP ${res.status} for ${url}`);
    const after = Math.min(300, Number(res.headers.get('retry-after')) || 30 * attempt);
    console.log(`  the server asks to wait ${after} s…`);
    await wait(after * 1000);
  }
}

mkdirSync('sources/photos', { recursive: true }); mkdirSync('public/photos', { recursive: true });
const all = Object.entries(PHOTOS).flatMap(([key, list]) => list.map((p, i) => ({ key, n: i + 1, ...p })));

// Commons serves pictures scaled to a few standard widths, and asks robots to use those and not the originals:
// each file is fetched at the largest standard width that is still smaller than the original.
const STEPS = [1280, 960, 500, 330, 250];
async function ask(titles, width) {
  const pages = new Map();
  for (let i = 0; i < titles.length; i += 40) {
    const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
      action: 'query', format: 'json', titles: titles.slice(i, i + 40).join('|'), prop: 'imageinfo',
      iiprop: 'url|size|extmetadata', ...(width && { iiurlwidth: String(width) }), iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|DateTimeOriginal|Credit',
    });
    const json = await (await get(url)).json();
    const renamed = new Map((json.query.normalized ?? []).map((n) => [n.to, n.from]));
    for (const page of Object.values(json.query.pages)) pages.set(renamed.get(page.title) ?? page.title, page);
  }
  return pages;
}
const sizes = await ask(all.map((p) => p.file)), info = new Map();
for (const step of STEPS) {
  const want = all.filter((p) => { const w = sizes.get(p.file)?.imageinfo?.[0]?.width; return w && STEPS.find((s) => s < w) === step; }).map((p) => p.file);
  if (want.length) for (const [title, page] of await ask(want, step)) info.set(title, page);
}

const out = {}; let failed = 0;
for (const p of all) {
  const page = info.get(p.file), ii = page?.imageinfo?.[0];
  if (!ii) { console.error(`NOT FOUND   ${p.file}`); failed++; continue; }
  const m = ii.extmetadata ?? {}, licence = strip(m.LicenseShortName?.value);
  if (!FREE.test(licence)) { console.error(`NOT FREE    ${p.file}: «${licence}»`); failed++; continue; }
  const name = `${p.key}-${p.n}`;
  // (the download is kept under the Commons title, so reordering the list never mixes pictures up)
  const slug = p.file.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').normalize('NFD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  const raw = `sources/photos/${slug}.${new URL(ii.thumburl).pathname.split('.').pop().toLowerCase()}`;
  if (!existsSync(raw)) { writeFileSync(raw, Buffer.from(await (await get(ii.thumburl)).arrayBuffer())); console.log('downloaded ', raw); }
  let img = sharp(readFileSync(raw)).rotate();
  if (p.crop) {
    const { width, height } = await sharp(readFileSync(raw)).metadata(), [l, t, w, h] = p.crop;
    img = img.extract({ left: Math.round(l * width), top: Math.round(t * height), width: Math.round(w * width), height: Math.round(h * height) });
  }
  const done = await img.resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/photos/${name}.webp`);
  if (!p.caption) console.warn(`NO CAPTION  ${name}  (${p.file})`);
  (out[p.key] ??= []).push({
    src: `photos/${name}.webp`, width: done.width, height: done.height, caption: p.caption,
    author: strip(m.Artist?.value).replace(/Unknown authorUnknown author/, 'Unknown author') || 'Unknown author',
    date: strip(m.DateTimeOriginal?.value).replace(/date QS:.*$/, '').replace(/^Taken on /, ''),
    licence, licenceUrl: m.LicenseUrl?.value ?? null, cropped: Boolean(p.crop),
    page: ii.descriptionurl,
  });
}
writeFileSync('public/photos/photos.json', JSON.stringify(out, null, 1));
console.log(`${Object.values(out).flat().length} photos for ${Object.keys(out).length} places${failed ? `, ${failed} FAILED` : ''}`);
process.exit(failed ? 1 : 0);
