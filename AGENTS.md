# AGENTS.md – Regeln für alle KI-Assistenten und Mitwirkenden

Diese Datei gilt für jedes Werkzeug (Claude Code, Cursor, Codex, Copilot …). `CLAUDE.md` verweist nur hierher.
Lies zuerst diese Datei, dann `docs/ROADMAP.md` (was ist als Nächstes dran) und bei Bedarf `docs/ARCHITECTURE.md`.

## Was dieses Projekt ist
Ein digitales Mehrspieler-Planspiel für die Lehre: Studierende führen in Teams ein fiktives Bauprojekt durch seine Phasen. In jeder Runde trifft sie eine Panne; das ISO-19650-Dokument oder -Werkzeug, das sie verhindert hätte, lernen sie durch die Folgen kennen. Die Spielleitung legt Sitzungen mit Teams an, verteilt Links, Rollen werden automatisch vergeben.
Spielregeln: `docs/GAME_DESIGN.md`. Stand: Gerüst (Meilenstein M0) fertig, Spiel selbst noch nicht gebaut.

## Befehle
```
npm ci               # einmalig, installiert nur Entwicklungswerkzeuge
npm run check        # Pflicht vor jedem Commit: Inhaltsprüfung + Tests
npm run validate     # nur Szenario-Pakete prüfen
npm test             # nur Tests (node:test)
npm run serve        # lokal ansehen: http://localhost:8080
```
Mehrere Spieler lokal testen: Seite in mehreren Browser-Tabs öffnen, `config.transport = 'local'` (Standard).

## Aufbau
```
web/                 wird 1:1 auf GitHub Pages veröffentlicht (nichts außerhalb von web/ ist öffentlich erreichbar)
  index.html         Startseite und Beitritt (#/join/CODE/TEAM)
  admin/  beamer/    Spielleitung, Beamer-Ansicht
  js/engine/         reine Spiellogik (kein DOM, kein Netz, keine Uhr)
  js/transport/      Nachrichtenkanal: local (BroadcastChannel) und supabase
  js/ui/             Oberfläche (Preact + htm, ohne Build)
  js/config.js       öffentliche Laufzeit-Konfiguration
  content/<paket>/   Szenario-Pakete als JSON (Rollen, Runden, Maßnahmen, Ereignisse)
  vendor/            fremde Bibliotheken, unverändert, mit Lizenztext
schema/              JSON-Schema der Szenario-Pakete
scripts/             Prüfskripte (Node)
tests/               Tests (node:test)
docs/                Spielregeln, Architektur, Roadmap, Deployment, Lizenz, Datenschutz, Entscheidungen (adr/)
```

## Harte Leitplanken (Verstöße = zurückweisen)
1. **Kein Build-Schritt, kein Bundler, kein CDN.** Browser lädt ES-Module direkt. Laufzeit-Abhängigkeiten nur als unveränderte Dateien in `web/vendor/` (Ablauf siehe `docs/LICENSING.md`). `package.json` enthält nur `devDependencies`.
2. **Engine ist rein.** `web/js/engine/` benutzt kein `document`, `fetch`, `Date.now()`, `Math.random()`. Zeit und Zufall kommen als Parameter (`createRng(seed)`). Gleiche Eingabe ergibt gleiche Ausgabe, auf jedem Gerät.
3. **Spiellogik kennt keinen Netzdienst.** Netz nur über die Transport-Schnittstelle (`web/js/transport/index.js`). Supabase-Aufrufe stehen nur in `transport/supabase.js`.
4. **Der Admin-Browser ist die Autorität.** Nur er verändert den Spielstand. Spieler senden Absichten (`intent`), der Admin prüft und verteilt den neuen Stand. Siehe `docs/ARCHITECTURE.md`.
5. **Inhalte sind Daten.** Ereignisse, Texte, Rollen, Schutzwerte stehen in `web/content/<paket>/scenario.json`, nicht im Code. Nach jeder Änderung `npm run validate`.
6. **Keine Geheimnisse im Repo.** Erlaubt: Supabase-URL und `anon key` in `config.js`. Verboten: `service_role key`, Passwörter, Tokens, Namen oder Daten echter Studierender.
7. **Fremde Bibliotheken nur über Wrapper in `web/js/ui/`** (`vendor.js` für Preact/htm, `qr.js` für QR-Codes). Nicht direkt aus `web/vendor/` importieren; neue Bibliothek = neuer Wrapper.
8. **Datenschutz:** keine Klarnamen, kein Login, keine Cookies, keine Analyse- oder Tracking-Skripte, keine Schriften oder Skripte von fremden Servern.

## Lizenz-Regeln (zwingend, siehe `docs/LICENSING.md`)
- Eigener Code: MIT. Eigene Inhalte (Szenario-Texte, Doku): CC BY 4.0. Jede neue Code-Datei beginnt mit `// SPDX-License-Identifier: MIT` (CSS: `/* … */`).
- **Kein Material aus dem Originalspiel** („Building Information Management Game“, Casteleyn, Ransijn, Toet, Briones Alonso; bSBenelux/Buildwise) übernehmen: keine Texte, Bilder, Spielbrett-Layouts, Kartenbeschreibungen. Es ist nur Ideengeber.
- **Keine Logos oder Marken** (buildingSMART, IFC, IDS, bSDD, BCF, ISO, RIBA, Hochschule …). Namen nur als sachliche Bezeichnung im Text.
- **Keine Normtexte** abschreiben. Eigene, kurze Erklärungen verwenden; Normverweise im Szenario mit `verified: false`, bis geprüft.
- **Keine RIBA-Phasennamen.** Phasen sind nur nummeriert (0 bis 7) mit eigenen Titeln.
- Neue fremde Datei (Bibliothek, Schrift, Icon, Bild, Ton): nur wenn Lizenz erlaubt (MIT, BSD, ISC, Apache-2.0, 0BSD, OFL, CC0, CC BY mit Nennung), selbst gehostet, und sofort in `THIRD_PARTY_NOTICES.md` eintragen. Unklare Lizenz = nicht verwenden, Rückfrage.
- KI-generierte Bilder oder Töne nur mit ausdrücklicher Freigabe der Projektleitung und Vermerk in `THIRD_PARTY_NOTICES.md`.

## Arbeitsweise (für KI-Assistenten)
1. Aufgabe aus `docs/ROADMAP.md` nehmen; kleine Schritte; die Abnahmekriterien dort sind verbindlich.
2. Bei Engine-Änderungen **zuerst Test schreiben**, dann Code. Jede neue exportierte Funktion bekommt Tests in `tests/`.
3. Bei UI-Änderungen im Browser prüfen (Playwright ist im Entwicklungs-Container vorhanden; Skript-Vorlage in `docs/ROADMAP.md`, M2) und auch mobil (390 px Breite, kein horizontales Scrollen).
4. `npm run check` muss grün sein, bevor du fertig meldest. Nicht behaupten, dass etwas läuft, was nicht ausgeführt wurde.
5. Zahlen der Balance (Schutzwerte, Kosten, Punkte) nur zusammen mit `docs/GAME_DESIGN.md` und den Tests ändern.
6. Nichts erfinden: Normverweise, Zitate, Zahlen zur ISO 19650 nur mit Quelle; sonst `verified: false`.
7. Bestehende Dateien nicht stillschweigend umschreiben. Änderungen an `web/vendor/` nur über den Ablauf in `docs/LICENSING.md`.
8. Entscheidungen von Gewicht als kurze Notiz in `docs/adr/` festhalten.

## Konventionen
- Sprache: Oberfläche und Doku Deutsch (Sie-frei, Du-Form im Spiel). Code-Bezeichner Englisch; Fachschlüssel aus den Szenarien (`termin`, `budget`, `qualitaet`, `vertrauen`) bleiben Deutsch. Kommentare Deutsch.
- Format: 2 Leerzeichen, LF, UTF-8 (`.editorconfig`). ES-Module, `const`, keine Klassen ohne Not, kleine Funktionen.
- Commits: kurze deutsche Betreffzeile mit Präfix (`feat:`, `fix:`, `docs:`, `test:`, `content:`, `chore:`).
- Barrierefreiheit: Kontrast mindestens 4,5:1, bedienbar per Tastatur, nie nur Farbe als Information, `prefers-color-scheme` beachten.
- Handy zuerst: Spieler nutzen meist Smartphones; Seitenrand 16 px; Mindestgröße der Tippflächen 44 px.

## Definition of Done
`npm run check` grün · Tests für neue Logik · im Browser geprüft (Desktop und 390 px) · Doku aktualisiert (`ROADMAP`, ggf. `ARCHITECTURE`/`GAME_DESIGN`) · keine neue fremde Datei ohne Eintrag in `THIRD_PARTY_NOTICES.md` · keine Geheimnisse.
