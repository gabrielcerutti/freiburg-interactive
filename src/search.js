// The search: type an address of today and the viewer goes there. The address is turned into coordinates by
// Nominatim, OpenStreetMap's search (https://nominatim.org), and only when the form is sent, never while typing.
// It looks in Freiburg and around; what falls outside the part of the city drawn so far is answered with how far
// from the Münster it lies. What to say about a point that was found is the caller's business (`onFound`).
import { toWorld, BOUNDS } from './geo.js';

const AROUND = '7.66,48.08,7.94,47.90'; // (where Nominatim looks: west, north, east, south — the city and its villages)
const TOWN = 'Freiburg im Breisgau';
const WINDS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const far = (m) => (m < 950 ? `${Math.round(m / 50) * 50} m` : `${(m / 1000).toFixed(1)} km`);

async function ask(text, ms = 9000) {
  const stop = new AbortController(), t = setTimeout(() => stop.abort(), ms);
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?' + new URLSearchParams({ q: text, format: 'jsonv2', limit: '6', countrycodes: 'de', addressdetails: '1', viewbox: AROUND, bounded: '1', 'accept-language': 'de' }), { signal: stop.signal });
    if (!res.ok) throw new Error(String(res.status));
    const list = await res.json();
    return (Array.isArray(list) ? list : []).filter((r) => isFinite(+r.lat) && isFinite(+r.lon)).map((r) => {
      const a = r.address ?? {}, street = [a.road ?? a.pedestrian ?? a.square, a.house_number].filter(Boolean).join(' ');
      const named = r.name && r.name !== (a.road ?? a.pedestrian) ? r.name : '';
      return { lat: +r.lat, lon: +r.lon, name: named && street ? `${named}, ${street}` : named || street || String(r.display_name ?? text).split(',')[0], exact: Boolean(a.house_number || named), inTown: (a.city ?? a.town) === TOWN, district: a.suburb ?? a.city_district ?? a.village ?? a.town ?? '' };
    });
  } finally { clearTimeout(t); }
}

/**
 * `el`: the form (an input and two buttons: index.html); `message`: the box under it.
 * `onFound({ name, x, z, exact })` shows the point (`exact`: a house or a named place, not just a street) and gives back what to say about it (HTML, or nothing); `onClear()`.
 */
export function createSearch(el, message, { onFound, onClear }) {
  const input = el.querySelector('input');
  const say = (html) => { message.innerHTML = html ?? ''; message.hidden = !html; };
  const inside = (r) => r.lat > BOUNDS.south && r.lat < BOUNDS.north && r.lon > BOUNDS.west && r.lon < BOUNDS.east;
  // (what is typed here is not a shortcut, and a drag that starts on the form does not move the map)
  input.addEventListener('keydown', (ev) => { ev.stopPropagation(); if (ev.key === 'Escape') input.blur(); });
  let turn = 0;
  async function search(text) {
    text = String(text ?? '').trim().replace(/\s+/g, ' ').slice(0, 120);
    const mine = ++turn;
    if (!text) { clear(); return; }
    el.classList.add('busy'); say('Searching…');
    let list = null;
    try { list = await ask(text); } catch { list = null; }
    if (mine !== turn) return; // (another search was sent meanwhile)
    el.classList.remove('busy'); el.classList.add('used');
    if (!list) { onClear(); say('The address search could not be reached.<small>Try again in a moment.</small>'); return; }
    const r = list.find(inside) ?? list.find((k) => k.inTown) ?? list[0];
    if (!r) { onClear(); say(`Nothing found for «${esc(text)}».<small>Try a street and a number («Salzstraße 32»), a square or the name of a place.</small>`); return; }
    const [x, z] = toWorld(r.lat, r.lon);
    if (!inside(r)) {
      onClear();
      const wind = WINDS[((Math.round(Math.atan2(x, -z) / (Math.PI / 4)) % 8) + 8) % 8];
      say(`<b>${esc(r.name)}</b>${r.district ? `, ${esc(r.district)}` : ''}<br>Outside the part of the city drawn so far: ${far(Math.hypot(x, z))} ${wind} of the Münster.`);
      return;
    }
    say(`<b>${esc(r.name)}</b>${onFound({ name: r.name, x, z, exact: r.exact }) ?? ''}`);
  }
  function clear() { turn++; input.value = ''; el.classList.remove('used', 'busy'); say(null); onClear(); }
  el.addEventListener('submit', (ev) => { ev.preventDefault(); input.blur(); search(input.value); });
  el.querySelector('.clear').addEventListener('click', () => { clear(); input.focus(); });
  input.addEventListener('input', () => el.classList.toggle('typed', Boolean(input.value)));
  return { search: (t) => { input.value = t; el.classList.add('typed'); return search(t); }, clear };
}
