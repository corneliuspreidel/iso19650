// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import {
  createRng, shuffle, hashString,
  makeSessionCode, isValidSessionCode, teamUrl, beamerUrl, parseJoinHash, teamSeed, CODE_ALPHABET,
  rolePackFor, assignmentOrder, assignNextRole, unfilledRoles, clampTeamSize,
  effectiveDamage, totalProtection, applyDelta, isProjectFailed, kpiAverage, fitScore, teamScore, combinedScore,
} from '../web/js/engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scenario = JSON.parse(readFileSync(join(root, 'web/content/kita/scenario.json'), 'utf8'));

test('rng: gleicher Seed liefert gleiche Folge, anderer Seed eine andere', () => {
  const a = createRng('KXQF:1:roles');
  const b = createRng('KXQF:1:roles');
  const c = createRng('KXQF:2:roles');
  const seqA = [a(), a(), a()];
  assert.deepEqual(seqA, [b(), b(), b()]);
  assert.notDeepEqual(seqA, [c(), c(), c()]);
  for (const v of seqA) assert.ok(v >= 0 && v < 1);
  assert.equal(hashString('x'), hashString('x'));
});

test('rng: shuffle verändert das Original nicht und behält alle Elemente', () => {
  const items = [1, 2, 3, 4, 5, 6];
  const out = shuffle(items, createRng(7));
  assert.deepEqual(items, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual([...out].sort(), items);
});

test('sitzung: Codes verwenden nur erlaubte Zeichen und sind validierbar', () => {
  const rng = createRng(1);
  for (let i = 0; i < 200; i++) {
    const code = makeSessionCode(rng);
    assert.equal(code.length, 4);
    assert.ok(isValidSessionCode(code));
    assert.ok([...code].every((c) => CODE_ALPHABET.includes(c)));
  }
  assert.ok(!CODE_ALPHABET.includes('O') && !CODE_ALPHABET.includes('0') && !CODE_ALPHABET.includes('I') && !CODE_ALPHABET.includes('1'));
  assert.equal(isValidSessionCode('AB0D'), false);
  assert.equal(isValidSessionCode('ABC'), false);
});

test('sitzung: Links und Hash lassen sich hin und zurück wandeln', () => {
  const url = teamUrl('https://corneliuspreidel.github.io/iso19650', 'KXQF', 3);
  assert.equal(url, 'https://corneliuspreidel.github.io/iso19650/#/join/KXQF/3');
  assert.deepEqual(parseJoinHash('#/join/KXQF/3'), { code: 'KXQF', team: 3 });
  assert.equal(parseJoinHash('#/join/KXQF/0'), null);
  assert.equal(parseJoinHash('#/join/KXQF/13'), null);
  assert.equal(parseJoinHash('#/join/kxqf/3'), null);
  assert.equal(parseJoinHash(''), null);
  assert.equal(beamerUrl('https://x.test/iso19650/#/alt', 'KXQF'), 'https://x.test/iso19650/beamer/#/KXQF');
  assert.notEqual(teamSeed('KXQF', 1, 'roles'), teamSeed('KXQF', 2, 'roles'));
});

test('rollen: Teamgröße wird begrenzt, jedes Paket hat die richtige Größe', () => {
  assert.equal(clampTeamSize(1), 3);
  assert.equal(clampTeamSize(99), 8);
  assert.equal(clampTeamSize('abc'), 3);
  for (let n = 3; n <= 8; n++) assert.equal(rolePackFor(scenario, n).length, n);
});

test('rollen: Vergabe ist deterministisch und beachtet die Stufen', () => {
  const o1 = assignmentOrder(scenario, 6, 'KXQF:1:roles');
  const o2 = assignmentOrder(scenario, 6, 'KXQF:1:roles');
  assert.deepEqual(o1, o2);
  const tiers = Object.fromEntries(scenario.roles.map((r) => [r.id, r.tier]));
  const seq = o1.map((id) => tiers[id]);
  assert.deepEqual(seq, [...seq].sort((a, b) => a - b), 'Stufe 1 vor 2 vor 3');
  assert.ok(o1.slice(0, 2).every((id) => tiers[id] === 1), 'Auftraggeber und BIM zuerst');
});

test('rollen: nächste freie Rolle, danach Zwilling oder Beobachter', () => {
  const taken = [];
  const base = { scenario, teamSize: 4, seed: 'KXQF:2:roles' };
  for (let i = 0; i < 4; i++) {
    const r = assignNextRole({ ...base, taken });
    assert.equal(r.kind, 'role');
    assert.ok(!taken.includes(r.roleId));
    taken.push(r.roleId);
  }
  assert.equal(new Set(taken).size, 4);
  const twin = assignNextRole({ ...base, taken });
  assert.equal(twin.kind, 'twin');
  assert.ok(taken.includes(twin.roleId));
  assert.deepEqual(assignNextRole({ ...base, taken, overflow: 'observer' }), { kind: 'observer' });
});

test('rollen: nicht besetzte Rollen werden gemeldet', () => {
  const pack = rolePackFor(scenario, 5);
  assert.deepEqual(unfilledRoles(scenario, 5, pack.slice(0, 3)), pack.slice(3));
  assert.deepEqual(unfilledRoles(scenario, 5, pack), []);
});

const ev = (damage, safeguards) => ({ damage, safeguards });

test('regeln: Schaden sinkt mit dem Schutz, Untergrenze 20 %', () => {
  const e = ev({ qualitaet: -20, termin: -10 }, [
    { catalogId: 'a', protection: 0.5 },
    { catalogId: 'b', protection: 0.3 },
    { catalogId: 'c', protection: 0.2 },
  ]);
  assert.deepEqual(effectiveDamage(e, {}), { qualitaet: -20, termin: -10 }, 'ohne Schutz voller Schaden');
  assert.deepEqual(effectiveDamage(e, { a: { active: true } }), { qualitaet: -10, termin: -5 });
  assert.equal(totalProtection(e, { a: { active: true }, b: { active: true }, c: { active: true } }), 0.8, 'Schutz gedeckelt');
  assert.deepEqual(effectiveDamage(e, { a: { active: true }, b: { active: true }, c: { active: true } }), { qualitaet: -4, termin: -2 });
});

test('regeln: veraltete Maßnahmen schützen nur zur Hälfte, inaktive gar nicht', () => {
  const e = ev({ qualitaet: -20 }, [{ catalogId: 'a', protection: 0.5 }]);
  assert.deepEqual(effectiveDamage(e, { a: { active: true, stale: true } }), { qualitaet: -15 });
  assert.deepEqual(effectiveDamage(e, { a: { active: false } }), { qualitaet: -20 });
});

test('regeln: positive Ereignisse bleiben unverändert', () => {
  const e = ev({ qualitaet: 5 }, []);
  assert.deepEqual(effectiveDamage(e, {}), { qualitaet: 5 });
});

test('regeln: Kennzahlen bleiben zwischen 0 und 100, Scheitern bei 0', () => {
  const kpis = { termin: 70, budget: 70, qualitaet: 70, vertrauen: 70 };
  assert.equal(applyDelta(kpis, { termin: 50 }).termin, 100);
  assert.equal(applyDelta(kpis, { budget: -200 }).budget, 0);
  assert.deepEqual(kpis, { termin: 70, budget: 70, qualitaet: 70, vertrauen: 70 }, 'Eingabe unverändert');
  assert.equal(isProjectFailed(kpis), false);
  assert.equal(isProjectFailed({ ...kpis, vertrauen: 0 }), true);
  assert.equal(kpiAverage({ termin: 60, budget: 70, qualitaet: 80, vertrauen: 90 }), 75);
});

test('regeln: Passgenauigkeit und Wertung', () => {
  const hits = [ev({ qualitaet: -10 }, [{ catalogId: 'a', protection: 0.5 }, { catalogId: 'b', protection: 0.3 }])];
  assert.equal(fitScore([], hits), 0);
  assert.equal(fitScore(['a', 'x'], hits), 0.5);
  assert.equal(fitScore(['a', 'b'], hits), 1);
  const kpis = { termin: 100, budget: 100, qualitaet: 100, vertrauen: 100 };
  assert.equal(teamScore({ kpis, fit: 1, finale: 1 }), 100);
  assert.equal(teamScore({ kpis, fit: 5, finale: -3 }), 80, 'Werte werden auf 0 bis 1 begrenzt');
  assert.equal(combinedScore(100, 0), 70);
  assert.equal(combinedScore(80, 0.5), 71);
});
