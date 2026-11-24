// Looks for photos of a place on Wikimedia Commons and lists the candidates with what matters for using them:
// licence, author, date, size.   node tools/photo-search.mjs "Schwabentor Freiburg" ["another search" …]
// Nothing is downloaded: pick from the list, then add the file to src/places/photos.js and run tools/photos.mjs.
// One request per search, 2.6 s apart, with a generic User-Agent.
const USER_AGENT = 'historic-maps/1.0 (viewer of old city maps)';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const searches = process.argv.slice(2);
for (const [i, q] of searches.entries()) {
  if (i) await wait(2600);
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '25', gsrsearch: `${q} filetype:bitmap`,
    prop: 'imageinfo', iiprop: 'size|extmetadata', iiextmetadatafilter: 'LicenseShortName|Artist|DateTimeOriginal|ImageDescription',
  });
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) { console.error(`${q}: HTTP ${res.status}`); continue; }
  const pages = Object.values((await res.json()).query?.pages ?? {}).sort((a, b) => a.index - b.index);
  console.log(`\n== ${q} (${pages.length})`);
  for (const p of pages) {
    const ii = p.imageinfo?.[0], m = ii?.extmetadata ?? {};
    console.log(`${p.title}\n    ${ii?.width}×${ii?.height} · ${strip(m.LicenseShortName?.value)} · ${strip(m.Artist?.value).slice(0, 60)} · ${strip(m.DateTimeOriginal?.value).slice(0, 40)}\n    ${strip(m.ImageDescription?.value).slice(0, 160)}`);
  }
}
