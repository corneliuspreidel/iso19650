// SPDX-License-Identifier: MIT
// Leitplanken für Lizenzen, Datenschutz und Geheimnisse (siehe AGENTS.md und docs/LICENSING.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname, relative, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.git', 'vendor'].includes(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}
const rel = (p) => relative(root, p);

test('jede eigene JS-Datei trägt eine SPDX-Lizenzzeile, jede CSS-Datei ebenso', () => {
  const missing = [];
  for (const dir of ['web', 'scripts', 'tests']) {
    for (const file of walk(join(root, dir))) {
      if (!['.js', '.mjs', '.css'].includes(extname(file))) continue;
      const head = readFileSync(file, 'utf8').slice(0, 200);
      if (!head.includes('SPDX-License-Identifier: MIT')) missing.push(rel(file));
    }
  }
  assert.deepEqual(missing, []);
});

test('jede Bibliothek in web/vendor hat Lizenztext und steht in THIRD_PARTY_NOTICES.md', () => {
  const vendor = join(root, 'web', 'vendor');
  const notices = readFileSync(join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');
  for (const name of readdirSync(vendor)) {
    const files = readdirSync(join(vendor, name));
    assert.ok(files.some((f) => f.startsWith('LICENSE')), `${name}: Lizenztext fehlt`);
    assert.ok(notices.includes(`web/vendor/${name}/`), `${name}: nicht in THIRD_PARTY_NOTICES.md`);
  }
});

test('Seiten laden nichts von fremden Servern (kein CDN, keine Fremdschriften)', () => {
  const offenders = [];
  for (const file of walk(join(root, 'web'))) {
    if (!['.html', '.css', '.js'].includes(extname(file))) continue;
    const text = readFileSync(file, 'utf8');
    const external = /(<script[^>]+src|<link[^>]+href|@import|url\()\s*=?\s*["']?https?:\/\//i;
    if (external.test(text)) offenders.push(rel(file));
  }
  assert.deepEqual(offenders, []);
});

test('keine Geheimnisse im Repo (service_role-Schlüssel, private Schlüssel)', () => {
  const offenders = [];
  for (const file of walk(root)) {
    if (!['.js', '.mjs', '.json', '.html', '.md', '.yml'].includes(extname(file))) continue;
    if (rel(file).startsWith('package-lock')) continue;
    const text = readFileSync(file, 'utf8');
    if (/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./.test(text)) offenders.push(`${rel(file)}: JWT-ähnlicher Schlüssel`);
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) offenders.push(`${rel(file)}: privater Schlüssel`);
  }
  assert.deepEqual(offenders, []);
});

test('config.js enthält nur leere oder öffentliche Werte und Standard "local"', () => {
  const text = readFileSync(join(root, 'web/js/config.js'), 'utf8');
  assert.match(text, /transport: 'local'/);
  assert.doesNotMatch(text, /service_role\s*[:=]/);
});

test('Pflichtdateien sind vorhanden', () => {
  for (const f of ['LICENSE', 'LICENSE-CONTENT', 'THIRD_PARTY_NOTICES.md', 'AGENTS.md', 'CLAUDE.md', 'README.md', 'docs/ROADMAP.md', 'docs/LICENSING.md', 'web/.nojekyll']) {
    assert.ok(existsSync(join(root, f)), f);
  }
});
