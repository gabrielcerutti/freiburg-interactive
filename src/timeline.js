// The timeline: a row of years, each an old plan of the city (public/plan/plans.json, made by tools/plan.mjs), and
// "Today". Picking a year lays that plan on the ground, in colour as it was scanned and in the ink look redrawn
// with the viewer's own ink and paper; "Today" brings back the ground drawn from OpenStreetMap. Only the ground
// The buildings follow (src/city.js): those that stood then, as far as the plans tell. One plan is held in memory
// at a time.
import * as THREE from 'three';
import { setPlan } from './look.js';

/**
 * `el`: the bar's element; `ground`: from buildGround; `onChange(plan | null)` is called after each change;
 * `about(plan)` may give one more sentence for the line under the bar.
 */
export async function createTimeline(el, ground, base, { onChange = () => {}, about = () => '' } = {}) {
  let list;
  try {
    const res = await fetch(`${base}plan/plans.json`);
    if (!res.ok) return null;
    list = await res.json();
  } catch { return null; } // (no plans: no timeline, and the ground stays today's)

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  el.innerHTML = `
    <div class="years" role="group" aria-label="The ground: an old plan, or today">
      ${list.plans.map((p) => `<button data-key="${esc(p.key)}" aria-pressed="false">${esc(p.label)}</button>`).join('')}
      <button data-key="" aria-pressed="true">Today</button>
    </div>
    <p class="note" hidden></p>`;
  el.hidden = false;
  const note = el.querySelector('.note'), loader = new THREE.TextureLoader();
  let current = null, texture = null, asked = 0;

  async function show(key) {
    const plan = list.plans.find((p) => p.key === key) ?? null, mine = ++asked;
    for (const b of el.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.key === (plan?.key ?? '')));
    note.hidden = !plan;
    if (plan) note.innerHTML = `${esc(plan.note)}${plan.page ? ` <a href="${esc(plan.page)}" target="_blank" rel="noopener">The city's record</a>` : ''}${about(plan) ? `<br>${esc(about(plan))}` : ''}`;
    let next = null;
    if (plan) {
      el.classList.add('busy');
      try { next = await loader.loadAsync(`${base}${plan.src}`); } catch { next = null; }
      if (mine !== asked) { next?.dispose(); return; } // (another year was picked meanwhile)
      el.classList.remove('busy');
      if (!next) { note.textContent = 'This plan could not be loaded.'; }
      else { next.colorSpace = THREE.SRGBColorSpace; next.flipY = false; next.anisotropy = 8; } // (row 0 is the north)
    }
    setPlan(ground.mesh.material, next, plan?.area, plan?.levels);
    texture?.dispose(); texture = next; current = next ? plan : null;
    onChange(current);
  }
  el.addEventListener('click', (ev) => { const b = ev.target.closest('button[data-key]'); if (b) show(b.dataset.key); });
  return { show, get plan() { return current; }, plans: list.plans };
}
