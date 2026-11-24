// Labels over the city: an HTML tag on a stalk, pinned to a point in 3D. Clicking one flies there and opens the
// place's card (title, years, photos, text, sources and assumptions).
import * as THREE from 'three';
import { photosOf, cardPhotosHtml, openViewer } from './photos.js';

export function createLabels(root, camera, { onPick }) {
  const items = [], v = new THREE.Vector3();
  return {
    add(text, position, data) {
      const el = document.createElement('button');
      el.className = 'label'; el.textContent = text;
      el.addEventListener('click', () => onPick(data, position));
      root.appendChild(el);
      items.push({ el, position: new THREE.Vector3(...position) });
    },
    update(width, height) {
      for (const it of items) {
        v.copy(it.position).project(camera);
        const visible = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
        it.el.style.display = visible ? '' : 'none';
        if (visible) it.el.style.transform = `translate(${((v.x + 1) / 2) * width}px, ${((1 - v.y) / 2) * height}px) translate(-50%, -100%)`;
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
      <details><summary>What is assumed</summary><ul>${place.assumptions.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></details>
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
