// The timeline: a row of years, each an old plan of the city (public/plan/plans.json, made by tools/plan.mjs), and
// "Today". Picking a year lays that plan on the ground, in colour as it was scanned and in the ink look redrawn
// with the viewer's own ink and paper; "Today" brings back the ground drawn from OpenStreetMap.
// The buildings follow (src/city.js, moved by src/main.js): those that stood then, as far as the plans tell, rise
// out of the ground and the others sink into it. One plan is held in memory at a time, and of it only a small picture
// of the whole and the pieces near the camera (src/ground.js).
// Under the years, a note says what changed by that year and which map it comes from. It can be put away («hide the
// note») and stays as each visitor left it; what cannot wait (a plan that did not load) is shown either way.

/**
 * `el`: the bar's element; `ground`: from buildGround; `onChange(plan | null)` is called after each change;
 * `about(plan | null)` gives the note's first lines (HTML): what changed by then.
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
    <div class="years" role="group" aria-label="The year: an old plan of the city, or today">
      ${list.plans.map((p) => `<button data-key="${esc(p.key)}" aria-pressed="false">${esc(p.label)}</button>`).join('')}
      <button data-key="" aria-pressed="true">Today</button>
    </div>
    <button class="more" type="button" aria-controls="year-note"></button>
    <div class="note" id="year-note" aria-live="polite"></div>`;
  el.hidden = false;
  const note = el.querySelector('.note'), more = el.querySelector('.more');
  let current = null, asked = 0;

  let open = true;
  try { open = localStorage.getItem('year-note') !== '0'; } catch { /* no storage: open */ }
  const fold = () => {
    el.classList.toggle('open', open); more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? 'hide the note ▴' : 'what changed ▾';
    more.title = open ? 'Put the note of this year away' : 'What changed by this year, and which map it comes from';
  };
  more.addEventListener('click', () => { open = !open; try { localStorage.setItem('year-note', open ? '1' : '0'); } catch { /* never mind */ } fold(); });
  fold();
  const write = (plan) => {
    el.classList.remove('failed');
    note.innerHTML = `<p>${about(plan)}</p>` + (plan ? `<p class="map">The map: ${esc(plan.note)}${plan.page ? ` <a href="${esc(plan.page)}" target="_blank" rel="noopener">The city’s record of it</a>` : ''}</p>` : '');
  };
  write(null);

  async function show(key) {
    const plan = list.plans.find((p) => p.key === key) ?? null, mine = ++asked;
    for (const b of el.querySelectorAll('button[data-key]')) b.setAttribute('aria-pressed', String(b.dataset.key === (plan?.key ?? '')));
    write(plan);
    // (the ground loads the plan — a small picture of the whole of it first, the pieces near the camera after — and
    // keeps the plan before on until the new one is there: src/ground.js)
    if (plan) el.classList.add('busy');
    const ok = await ground.showPlan(plan, base);
    if (mine !== asked) return; // (another year was picked meanwhile)
    el.classList.remove('busy');
    if (!ok) { note.innerHTML = '<p>This plan could not be loaded. Pick the year again to retry.</p>'; el.classList.add('failed'); }
    current = ok ? plan : null;
    onChange(current);
  }
  el.addEventListener('click', (ev) => { const b = ev.target.closest('button[data-key]'); if (b) show(b.dataset.key); });
  return { show, get plan() { return current; }, plans: list.plans };
}
