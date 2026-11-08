// SPDX-License-Identifier: MIT
// Rollenpakete und automatische Rollenvergabe.

import { createRng, shuffle } from './rng.js';

export const MIN_TEAM_SIZE = 3;
export const MAX_TEAM_SIZE = 8;

/** Begrenzt die Teamgröße auf den unterstützten Bereich. */
export function clampTeamSize(n) {
  const size = Math.round(Number(n));
  if (!Number.isFinite(size)) return MIN_TEAM_SIZE;
  return Math.min(MAX_TEAM_SIZE, Math.max(MIN_TEAM_SIZE, size));
}

/** Liefert die Rollen-IDs des Pakets für die Teamgröße. */
export function rolePackFor(scenario, teamSize) {
  const size = clampTeamSize(teamSize);
  const pack = scenario.rolePacks[String(size)];
  if (!pack) throw new Error(`Kein Rollenpaket für Teamgröße ${size}`);
  return pack;
}

/**
 * Bestimmt die Vergabereihenfolge: Rollen der Stufe 1 zuerst, dann 2, dann 3.
 * Innerhalb einer Stufe wird mit festem Seed gemischt, damit nicht immer
 * dieselbe Person dieselbe Rolle bekommt, das Ergebnis aber reproduzierbar bleibt.
 */
export function assignmentOrder(scenario, teamSize, seed, { randomize = true } = {}) {
  const pack = rolePackFor(scenario, teamSize);
  const rolesById = new Map(scenario.roles.map((r) => [r.id, r]));
  const rng = createRng(seed);
  const order = [];
  for (const tier of [1, 2, 3]) {
    const group = pack.filter((id) => rolesById.get(id)?.tier === tier);
    order.push(...(randomize ? shuffle(group, rng) : group));
  }
  return order;
}

/**
 * Vergibt die nächste freie Rolle.
 * @param {object} p
 * @param {object} p.scenario
 * @param {number} p.teamSize   konfigurierte Teamgröße
 * @param {string} p.seed       Seed für die Reihenfolge (z. B. teamSeed(code, team, 'roles'))
 * @param {string[]} p.taken    bereits vergebene Rollen-IDs
 * @param {'twin'|'observer'} [p.overflow]  Verhalten, wenn alle Rollen vergeben sind
 * @returns {{kind:'role', roleId:string} | {kind:'twin', roleId:string} | {kind:'observer'}}
 */
export function assignNextRole({ scenario, teamSize, seed, taken, overflow = 'twin' }) {
  const order = assignmentOrder(scenario, teamSize, seed);
  const free = order.find((id) => !taken.includes(id));
  if (free) return { kind: 'role', roleId: free };
  if (overflow === 'observer') return { kind: 'observer' };
  // Zwilling: die Rolle mit den wenigsten Spielern, in Vergabereihenfolge.
  const counts = new Map(order.map((id) => [id, taken.filter((t) => t === id).length]));
  const min = Math.min(...counts.values());
  const roleId = order.find((id) => counts.get(id) === min);
  return { kind: 'twin', roleId };
}

/** Rollen, die im Team nicht besetzt sind und von einem Auto-Spieler übernommen werden. */
export function unfilledRoles(scenario, teamSize, taken) {
  return rolePackFor(scenario, teamSize).filter((id) => !taken.includes(id));
}
