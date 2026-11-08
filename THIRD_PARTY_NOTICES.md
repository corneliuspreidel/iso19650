# Hinweise zu Bibliotheken Dritter

Alle Dateien liegen unverändert in `web/vendor/` und werden von dort geladen (kein CDN). Herkunft: offizielle npm-Veröffentlichungen. Die Dateien wurden am 2026-11-08 mit `cmp` Byte für Byte gegen die Tarballs von `npm pack` verglichen und sind identisch.

| Bibliothek | Version | Datei im Repo | Quelle im Paket | Lizenz | Copyright |
|---|---|---|---|---|---|
| htm | 3.1.1 | `web/vendor/htm-preact/standalone.module.js` | `htm/preact/standalone.module.js` | Apache-2.0 (`LICENSE-htm`) | Jason Miller |
| Preact (im Bündel von htm, Version 10.x) | 10.x (laut Abhängigkeit von htm 3.1.1) | dieselbe Datei | – | MIT (`LICENSE-preact`) | Copyright (c) 2015-present Jason Miller |
| qrcode-generator | 2.0.4 | `web/vendor/qrcode-generator/qrcode.mjs` | `dist/qrcode.mjs` | MIT (`LICENSE`) | Copyright (c) 2009 Kazuhiko Arase |
| @supabase/supabase-js | 2.119.0 | `web/vendor/supabase-js/supabase.js` | `dist/umd/supabase.js` | MIT (`LICENSE`) | Copyright (c) 2020 Supabase |

## Hinweise
- **htm (Apache-2.0):** Die Datei ist unverändert. Eine NOTICE-Datei enthält das Paket nicht. Der Lizenztext liegt bei (`LICENSE-htm`).
- **qrcode-generator:** Das npm-Paket enthält keine eigene LICENSE-Datei; die Lizenz (MIT) steht im Kopf der Quelldatei und in `package.json`. `web/vendor/qrcode-generator/LICENSE` gibt den MIT-Text mit dem Copyright aus dem Dateikopf wieder.
- **supabase.js** ist ein Browser-Bündel. Es enthält laut Paketbeschreibung die Teilpakete `@supabase/auth-js`, `storage-js`, `realtime-js`, `functions-js` und `postgrest-js` (jeweils Version 2.119.0, nach Angabe der Pakete MIT) sowie Hilfscode. Die Lizenzen der Teilpakete wurden nicht einzeln gegen deren Quell-Repositories geprüft (offener Punkt in `docs/LICENSING.md`). Für das Spiel wird nur Realtime Broadcast benötigt.
- Entwicklungswerkzeug (nicht ausgeliefert): ajv 8.20.0 (MIT) in `devDependencies`.
- Schriften, Icons, Bilder, Töne: derzeit keine fremden Dateien (Systemschriften, eigene SVG/CSS).

## Eintragsvorlage für neue Dateien
`Name · Version · Datei im Repo · Quelle (URL oder Paket) · Autor · Lizenz · Datum der Aufnahme · Änderungen (ja/nein)`
