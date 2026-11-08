// SPDX-License-Identifier: MIT
// Deterministischer Zufall. Gleicher Seed => gleiche Folge, auf jedem Gerät.

/** Wandelt einen Text in eine 32-Bit-Zahl (FNV-1a). */
export function hashString(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Liefert eine Funktion, die bei jedem Aufruf eine Zahl in [0, 1) erzeugt (mulberry32). */
export function createRng(seed) {
  let a = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mischt eine Kopie des Arrays (Fisher-Yates) mit dem gegebenen Zufallsgenerator. */
export function shuffle(items, rng) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
