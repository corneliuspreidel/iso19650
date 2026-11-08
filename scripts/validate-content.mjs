// SPDX-License-Identifier: MIT
// Prüft alle Szenario-Pakete (web/content/*/scenario.json) gegen das JSON-Schema
// und auf inhaltliche Widersprüche (Verweise, Wertebereiche, Rollenpakete).
// Aufruf: npm run validate

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Ajv from 'ajv';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KPI_KEYS = ['termin', 'budget', 'qualitaet', 'vertrauen'];

/** Prüft ein Szenario und liefert eine Liste von Fehlertexten (leer = in Ordnung). */
export function validateScenario(scenario, schema) {
  const errors = [];
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  if (!validate(scenario)) {
    for (const e of validate.errors) errors.push(`Schema: ${e.instancePath || '/'} ${e.message}`);
    return errors; // Folgeprüfungen setzen ein gültiges Schema voraus
  }

  const unique = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item.id)) errors.push(`${label}: doppelte ID "${item.id}"`);
      seen.add(item.id);
    }
    return seen;
  };

  const roleIds = unique(scenario.roles, 'roles');
  const catalogIds = unique(scenario.catalog, 'catalog');
  const roundIds = unique(scenario.rounds, 'rounds');
  unique(scenario.events, 'events');

  for (const [size, pack] of Object.entries(scenario.rolePacks)) {
    if (pack.length !== Number(size)) errors.push(`rolePacks[${size}] hat ${pack.length} statt ${size} Rollen`);
    if (new Set(pack).size !== pack.length) errors.push(`rolePacks[${size}] enthält Rollen doppelt`);
    for (const id of pack) if (!roleIds.has(id)) errors.push(`rolePacks[${size}]: unbekannte Rolle "${id}"`);
  }
  for (let size = 3; size <= 8; size++) {
    if (!scenario.rolePacks[String(size)]) errors.push(`rolePacks: Teamgröße ${size} fehlt`);
  }

  for (const ev of scenario.events) {
    if (ev.round !== 'any' && !roundIds.has(ev.round)) errors.push(`Ereignis ${ev.id}: unbekannte Runde "${ev.round}"`);
    for (const key of Object.keys(ev.damage)) {
      if (!KPI_KEYS.includes(key)) errors.push(`Ereignis ${ev.id}: unbekannte Kennzahl "${key}"`);
    }
    for (const role of ev.affects ?? []) {
      if (!roleIds.has(role) && role !== 'all') errors.push(`Ereignis ${ev.id}: unbekannte Rolle "${role}"`);
    }
    let sum = 0;
    for (const s of ev.safeguards ?? []) {
      if (!catalogIds.has(s.catalogId)) errors.push(`Ereignis ${ev.id}: unbekannte Maßnahme "${s.catalogId}"`);
      if (s.protection < 0 || s.protection > 1) errors.push(`Ereignis ${ev.id}: Schutzwert ${s.protection} außerhalb 0 bis 1`);
      sum += s.protection;
    }
    const hasDamage = Object.values(ev.damage).some((v) => v < 0);
    if (hasDamage && sum < 0.5) errors.push(`Ereignis ${ev.id}: Summe der Schutzwerte ${sum.toFixed(2)} ist zu klein, kaum abwendbar`);
  }

  const used = new Set(scenario.events.flatMap((ev) => (ev.safeguards ?? []).map((s) => s.catalogId)));
  for (const id of catalogIds) {
    if (!used.has(id)) errors.push(`WARN Maßnahme "${id}" schützt vor keinem Ereignis (gewollt als Ablenkungskarte?)`);
  }
  return errors;
}

export function loadScenarios() {
  const dir = join(root, 'web', 'content');
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, 'scenario.json')))
    .map((d) => ({ name: d.name, path: join(dir, d.name, 'scenario.json') }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const schema = JSON.parse(readFileSync(join(root, 'schema', 'scenario.schema.json'), 'utf8'));
  let failed = false;
  for (const { name, path } of loadScenarios()) {
    const scenario = JSON.parse(readFileSync(path, 'utf8'));
    const errors = validateScenario(scenario, schema);
    const hard = errors.filter((e) => !e.startsWith('WARN '));
    for (const e of errors) console.log(`${e.startsWith('WARN ') ? 'Warnung' : 'FEHLER '} [${name}] ${e.replace(/^WARN /, '')}`);
    if (hard.length) failed = true;
    else console.log(`OK      [${name}] ${scenario.events.length} Ereignisse, ${scenario.catalog.length} Maßnahmen, ${scenario.roles.length} Rollen`);
  }
  process.exit(failed ? 1 : 0);
}
