// The ground's height (public/data/terrain.*, made by tools/terrain.mjs): metres above the ground at the Münster,
// read between the grid's points. Outside the grid the edge value carries on.
export async function loadTerrain(base) {
  const meta = await (await fetch(`${base}data/terrain.json`)).json();
  const data = new Int16Array(await (await fetch(`${base}data/terrain.bin`)).arrayBuffer());
  return makeTerrain(meta, data);
}

export function makeTerrain({ x0, z0, step, width: W, height: H }, data) {
  const at = (i, j) => data[Math.min(H - 1, Math.max(0, j)) * W + Math.min(W - 1, Math.max(0, i))] / 100;
  const heightAt = (x, z) => {
    const fx = (x - x0) / step, fz = (z - z0) / step, i = Math.floor(fx), j = Math.floor(fz), a = fx - i, b = fz - j;
    return (at(i, j) * (1 - a) + at(i + 1, j) * a) * (1 - b) + (at(i, j + 1) * (1 - a) + at(i + 1, j + 1) * a) * b;
  };
  /** the lowest ground under a set of points: where a building's foot goes, so it never floats */
  const lowest = (pts) => Math.min(...pts.map(([x, z]) => heightAt(x, z)));
  let min = Infinity; for (const v of data) min = Math.min(min, v / 100);
  return { heightAt, lowest, min, step, extent: [x0, z0, x0 + (W - 1) * step, z0 + (H - 1) * step] };
}

/** flat ground, for the tools that do not need the hills */
export const FLAT = { heightAt: () => 0, lowest: () => 0, min: 0, step: 8, extent: null };
