// SPDX-License-Identifier: MIT
// Reine Regelfunktionen ohne Seiteneffekte. Hier liegt die Balance-Mathematik.

export const KPI_KEYS = ['termin', 'budget', 'qualitaet', 'vertrauen'];
export const MAX_PROTECTION = 0.8;
export const MIN_DAMAGE_FACTOR = 0.2;

/**
 * Wirksamer Schutz einer Maßnahme.
 * @param {{catalogId:string, protection:number}} safeguard
 * @param {{[catalogId:string]: {active:boolean, stale?:boolean}}} activeMap
 */
function effectiveProtection(safeguard, activeMap) {
  const entry = activeMap[safeguard.catalogId];
  if (!entry || !entry.active) return 0;
  return entry.stale ? safeguard.protection / 2 : safeguard.protection;
}

/** Summe der Schutzwerte, gedeckelt auf MAX_PROTECTION. */
export function totalProtection(event, activeMap) {
  const sum = event.safeguards.reduce((acc, s) => acc + effectiveProtection(s, activeMap), 0);
  return Math.min(MAX_PROTECTION, sum);
}

/**
 * Wirksamer Schaden = Grundschaden × max(0,2; 1 − Schutz).
 * Positive Werte (Glückskarten) werden nicht verändert.
 * Ergebnis ist auf ganze Zahlen gerundet (Richtung null).
 */
export function effectiveDamage(event, activeMap) {
  const factor = Math.max(MIN_DAMAGE_FACTOR, 1 - totalProtection(event, activeMap));
  const result = {};
  for (const key of KPI_KEYS) {
    const base = event.damage[key];
    if (base === undefined) continue;
    result[key] = base >= 0 ? base : Math.trunc(base * factor);
  }
  return result;
}

export function clampKpi(value) {
  return Math.min(100, Math.max(0, value));
}

/** Wendet ein Delta auf die Kennzahlen an und begrenzt auf 0 bis 100. */
export function applyDelta(kpis, delta) {
  const next = { ...kpis };
  for (const key of KPI_KEYS) {
    if (delta[key] !== undefined) next[key] = clampKpi(next[key] + delta[key]);
  }
  return next;
}

/** Projekt gescheitert, sobald eine Kennzahl 0 erreicht. */
export function isProjectFailed(kpis) {
  return KPI_KEYS.some((k) => kpis[k] <= 0);
}

/** Durchschnitt der vier Kennzahlen, gerundet auf eine Dezimalstelle. */
export function kpiAverage(kpis) {
  const sum = KPI_KEYS.reduce((acc, k) => acc + kpis[k], 0);
  return Math.round((sum / KPI_KEYS.length) * 10) / 10;
}

/**
 * Passgenauigkeit der Maßnahmen: Anteil der eingeführten Maßnahmen, die in
 * mindestens einem getroffenen Ereignis geschützt haben. 1 = alles wirksam.
 */
export function fitScore(introducedIds, hitEvents) {
  if (introducedIds.length === 0) return 0;
  const useful = new Set();
  for (const ev of hitEvents) {
    for (const s of ev.safeguards) {
      if (introducedIds.includes(s.catalogId)) useful.add(s.catalogId);
    }
  }
  return useful.size / introducedIds.length;
}

/**
 * Teampunkte: 60 Punkte aus dem Kennzahl-Durchschnitt, 20 aus der
 * Passgenauigkeit, 20 aus dem Finale (0 bis 1).
 */
export function teamScore({ kpis, fit, finale }) {
  const kpiPart = (kpiAverage(kpis) / 100) * 60;
  const fitPart = Math.min(1, Math.max(0, fit)) * 20;
  const finalePart = Math.min(1, Math.max(0, finale)) * 20;
  return Math.round((kpiPart + fitPart + finalePart) * 10) / 10;
}

/** Gesamtwertung: 70 % Team, 30 % Einzelziele (beide in 0 bis 100). */
export function combinedScore(teamPoints, goalsFraction) {
  const goals = Math.min(1, Math.max(0, goalsFraction)) * 100;
  return Math.round((teamPoints * 0.7 + goals * 0.3) * 10) / 10;
}
