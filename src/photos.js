// The photos of the places: the list (public/photos/photos.json, made by tools/photos.mjs), the photos as they go on
// a place's card (all of them, each with its caption and credit) and the viewer that opens when one is clicked — one picture at a time, with its caption and its credit (author, date, licence,
// and a link to its page on Wikimedia Commons), arrows and thumbnails to go through all the photos of the place.
// Keys: ← → to move, Esc to close.

let index = null;
/** the photos of a place (an empty list if it has none, or if the list could not be loaded) */
export async function photosOf(key) {
  index ??= fetch(`${import.meta.env.BASE_URL}photos/photos.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  return (await index)[key] ?? [];
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const url = (src) => `${import.meta.env.BASE_URL}${src}`;

/** who made it, when, and under which licence — every free licence asks for this to be said */
export function creditHtml(p) {
  const licence = p.licenceUrl ? `<a href="${esc(p.licenceUrl)}" target="_blank" rel="noopener">${esc(p.licence)}</a>` : esc(p.licence);
  return `${esc(p.author)}${p.date ? `, ${esc(p.date)}` : ''} · ${licence}${p.cropped ? ' · cropped' : ''} · <a href="${esc(p.page)}" target="_blank" rel="noopener">Wikimedia Commons</a>`;
}

/**
 * Photos `from`…`to` of a place as they go on its card: each one whole, with its caption and its credit under it.
 * Each is a button that carries its number (data-k), so a click can open the viewer on that very photo.
 */
export function cardPhotosHtml(photos, from = 0, to = photos.length) {
  return photos.slice(from, to).map((p, n) => `
    <figure class="photo">
      <button class="open" data-k="${from + n}" aria-label="Open photo ${from + n + 1} of ${photos.length}">
        <img src="${url(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(p.caption)}" loading="lazy" />
      </button>
      <figcaption>${esc(p.caption)} <span class="credit">${creditHtml(p)}</span></figcaption>
    </figure>`).join('');
}

/** Opens the viewer on photo `at` of `photos`; `title` is the place's name. */
export function openViewer(photos, at = 0, title = '') {
  const root = document.getElementById('viewer');
  let i = at;
  root.innerHTML = `
    <div class="frame" role="dialog" aria-modal="true" aria-label="Photos of ${esc(title)}">
      <header><h2>${esc(title)}</h2><span class="where"></span><button class="close" aria-label="Close">×</button></header>
      <div class="stage">
        <button class="nav prev" aria-label="Previous photo">‹</button>
        <img alt="" />
        <button class="nav next" aria-label="Next photo">›</button>
      </div>
      <p class="caption"></p>
      <p class="credit"></p>
      <div class="thumbs">${photos.map((p, k) => `<button data-k="${k}" aria-label="Photo ${k + 1}"><img src="${url(p.src)}" alt="" loading="lazy" /></button>`).join('')}</div>
    </div>`;
  const img = root.querySelector('.stage img'), many = photos.length > 1;
  root.querySelectorAll('.nav, .thumbs').forEach((el) => { el.hidden = !many; });
  const show = (k) => {
    i = (k + photos.length) % photos.length;
    const p = photos[i];
    img.src = url(p.src); img.alt = p.caption;
    root.querySelector('.caption').textContent = p.caption;
    root.querySelector('.credit').innerHTML = creditHtml(p);
    root.querySelector('.where').textContent = many ? `${i + 1} / ${photos.length}` : '';
    root.querySelectorAll('.thumbs button').forEach((b, k2) => b.classList.toggle('on', k2 === i));
  };
  const close = () => { root.hidden = true; root.innerHTML = ''; removeEventListener('keydown', onKey, true); };
  const onKey = (ev) => {
    if (ev.key === 'Escape') close(); else if (ev.key === 'ArrowLeft') show(i - 1); else if (ev.key === 'ArrowRight') show(i + 1); else return;
    ev.stopImmediatePropagation(); ev.preventDefault(); // (the viewer's keys do not reach the map)
  };
  root.onclick = (ev) => {
    if (ev.target === root || ev.target.closest('.close')) close();
    else if (ev.target.closest('.prev')) show(i - 1);
    else if (ev.target.closest('.next') || ev.target === img) show(i + 1);
    else if (ev.target.closest('.thumbs button')) show(Number(ev.target.closest('.thumbs button').dataset.k));
  };
  addEventListener('keydown', onKey, true);
  root.hidden = false; show(i);
  root.querySelector('.close').focus();
}
