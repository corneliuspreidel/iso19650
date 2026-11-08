// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { validateScenario, loadScenarios } from '../scripts/validate-content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(readFileSync(join(root, 'schema/scenario.schema.json'), 'utf8'));

test('alle Szenario-Pakete sind gültig', () => {
  const packs = loadScenarios();
  assert.ok(packs.length >= 1, 'mindestens ein Szenario-Paket');
  for (const { name, path } of packs) {
    const errors = validateScenario(JSON.parse(readFileSync(path, 'utf8')), schema).filter((e) => !e.startsWith('WARN '));
    assert.deepEqual(errors, [], `Szenario ${name}`);
  }
});

test('Prüfung erkennt kaputte Verweise', () => {
  const s = JSON.parse(readFileSync(join(root, 'web/content/kita/scenario.json'), 'utf8'));
  s.events[0].safeguards[0].catalogId = 'gibt-es-nicht';
  const errors = validateScenario(s, schema);
  assert.ok(errors.some((e) => e.includes('gibt-es-nicht')));
});

test('Szenario nennt Lizenz und Quelle', () => {
  const s = JSON.parse(readFileSync(join(root, 'web/content/kita/scenario.json'), 'utf8'));
  assert.equal(s.meta.license, 'CC-BY-4.0');
  assert.ok(s.meta.inspiredBy.length >= 1);
});
