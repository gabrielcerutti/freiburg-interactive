// Labels over the city: an HTML tag on a stalk, pinned to a point in 3D. Clicking one flies there and opens the
// place's card (title, years, photos, text, sources and assumptions).
import * as THREE from 'three';
import { photosOf, cardPhotosHtml, openViewer } from './photos.js';

export function createLabels(root, camera, { onPick }) {
  const items = [], v = new THREE.Vector3();
  return {
    /** `kind`: one more class for the tag (the address that was searched for is drawn apart). Gives the label back, for remove(). */
    add(text, position, data, kind = '') {
      const el = document.createElement('button');
      el.className = `label ${kind}`.trim(); el.textContent = text;
      el.addEventListener('click', () => onPick(data, position));
      root.appendChild(el);
      const item = { el, position: new THREE.Vector3(...position), data, w: el.offsetWidth, h: el.offsetHeight + 22 }; // (22: its stalk)
      items.push(item); return item;
    },
    remove(item) { const i = items.indexOf(item); if (i >= 0) { items.splice(i, 1); item.el.remove(); } },
    /**
     * Places the labels and decides which ones show, so that they do not cover the map:
     * - with the labels on (`all`), those of the part of the city being looked at — within `reach` metres of
     *   `focus`, the point the camera looks at, so more of them from far and fewer from near — and, of two that would
     *   overlap, only the one nearer to that point;
     * - with the labels off, none;
     * - always: the place that is selected, the one under the pointer, and the address that was searched for.
     */
    update(width, height, { all = true, focus = null, reach = Infinity } = {}) {
      const shown = [];
      for (const it of items) {
        v.copy(it.position).project(camera);
        const there = !it.data?.hidden && v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1; // (hidden: not there at this year)
        it.el.style.display = there ? '' : 'none';
        if (!there) continue;
        it.x = ((v.x + 1) / 2) * width; it.y = ((1 - v.y) / 2) * height;
        it.el.style.transform = `translate(${it.x}px, ${it.y}px) translate(-50%, -100%)`;
        it.must = !it.data || it.data.target === 1 || Boolean(it.data.hover);
        it.far = focus ? Math.hypot(it.position.x - focus.x, it.position.z - focus.z) : 0;
        shown.push(it);
      }
      shown.sort((a, b) => b.must - a.must || a.far - b.far);
      const kept = [];
      for (const it of shown) {
        const clear = !kept.some((k) => Math.abs(k.x - it.x) < (k.w + it.w) / 2 + 8 && k.y - k.h < it.y + 4 && it.y - it.h < k.y + 4);
        const on = it.must || (all && it.far <= reach && clear);
        it.el.classList.toggle('off', !on);
        if (on) kept.push(it);
      }
    },
  };
}

/**
 * Fills the card element with a place's card: a header that stays in place (the name, and the × that closes it) and,
 * under it, what scrolls — the years, the first photo, the text, the rest of the photos, the sources and what is
 * assumed. Every photo is shown whole with its caption and credit; a click on one opens the viewer on it.
 */
export function showCard(el, place) {
  const c = place.card, esc = (s) => s.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]);
  el.innerHTML = `
    <header>
      <h2>${esc(c.title)}</h2>
      ${place.localName ? `<p class="local">${esc(place.localName)}</p>` : ''}
      <button class="close" aria-label="Close">×</button>
    </header>
    <div class="body">
      <p class="years">${esc(c.years)}</p>
      <div class="photos first"></div>
      ${c.text.map((t) => `<p>${esc(t)}</p>`).join('')}
      <div class="photos rest"></div>
      <details><summary>Sources</summary><ul>${place.sources.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></details>
      <details><summary>What is assumed</summary><ul>${[...place.assumptions, ...(place.war?.state === 'ruin' ? ['At the years when it lay in ruins it is drawn as a roofless shell of its outline, like the other ruins: how much of each wall still stood is assumed.'] : [])].map((s) => `<li>${esc(s)}</li>`).join('')}</ul></details>
    </div>`;
  el.hidden = false;
  el.querySelector('.close').onclick = () => { el.hidden = true; };
  // the photos arrive a moment later (the list is fetched once)
  photosOf(place.key).then((photos) => {
    const first = el.querySelector('.photos.first'), rest = el.querySelector('.photos.rest');
    if (!first || !photos.length || el.querySelector('h2')?.textContent !== c.title) return; // (another card by now)
    first.innerHTML = cardPhotosHtml(photos, 0, 1);
    rest.innerHTML = cardPhotosHtml(photos, 1);
    el.querySelector('.body').onclick = (ev) => {
      const open = ev.target.closest('.photo .open');
      if (open) openViewer(photos, Number(open.dataset.k), c.title);
    };
  });
}
