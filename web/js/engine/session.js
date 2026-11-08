// SPDX-License-Identifier: MIT
// Sitzungscodes und Links. Nur Hash-Routing, weil GitHub Pages keine Umleitungen kennt.

/** Buchstaben ohne Verwechslungsgefahr (kein I, O, 0, 1). */
export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 4;

/**
 * Erzeugt einen Sitzungscode. Für echte Sitzungen sollte `random` aus
 * crypto.getRandomValues stammen; für Tests kann ein Seed-RNG übergeben werden.
 */
export function makeSessionCode(random = Math.random) {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  }
  return code;
}

/** Zufallsfunktion auf Basis von crypto (Browser und Node). */
export function cryptoRandom() {
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

export function isValidSessionCode(code) {
  if (typeof code !== 'string' || code.length !== CODE_LENGTH) return false;
  return [...code].every((c) => CODE_ALPHABET.includes(c));
}

/** Baut den Team-Link, z. B. https://…/iso19650/#/join/KXQF/3 */
export function teamUrl(baseUrl, code, teamNumber) {
  const base = baseUrl.replace(/#.*$/, '').replace(/\/?$/, '/');
  return `${base}#/join/${code}/${teamNumber}`;
}

export function beamerUrl(baseUrl, code) {
  const base = baseUrl.replace(/#.*$/, '').replace(/\/?$/, '/');
  return `${base}beamer/#/${code}`;
}

/** Liest einen Hash wie "#/join/KXQF/3" aus. Gibt null zurück, wenn er nicht passt. */
export function parseJoinHash(hash) {
  const m = /^#\/join\/([A-Z0-9]{4})\/(\d{1,2})$/.exec(hash || '');
  if (!m) return null;
  const code = m[1];
  const team = Number(m[2]);
  if (!isValidSessionCode(code) || team < 1 || team > 12) return null;
  return { code, team };
}

/** Deterministischer Seed pro Team (für Rollenreihenfolge und Pannenreihenfolge). */
export function teamSeed(code, teamNumber, purpose) {
  return `${code}:${teamNumber}:${purpose}`;
}
