// SPDX-License-Identifier: MIT
// Hilfen für Adressen. Die Seite läuft unter /iso19650/ (GitHub Pages) oder lokal unter /.

/** Wurzel der Anwendung, immer mit Schrägstrich am Ende. Unterseiten wie /admin/ werden abgeschnitten. */
export function siteBase(loc = globalThis.location) {
  const path = loc.pathname.replace(/(admin|beamer)\/(index\.html)?$/, '').replace(/index\.html$/, '');
  return `${loc.origin}${path.endsWith('/') ? path : `${path}/`}`;
}

/** localStorage ohne Absturz, falls blockiert (privates Fenster, Vorschau). */
export const safeStorage = {
  get(key) {
    try { return JSON.parse(globalThis.localStorage.getItem(key)); } catch { return null; }
  },
  set(key, value) {
    try { globalThis.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
};
