# Architektur

Ziel: ein Spiel für bis zu etwa 12 Teams mit je 3 bis 8 Spielern, das auf GitHub Pages läuft und keinen eigenen Server braucht. Entscheidungen mit Begründung: `adr/`.

## Überblick
```
 Spieler-Browser (je Team)            Admin-Browser (Spielleitung)          Beamer-Browser
 ┌──────────────────────┐             ┌───────────────────────────┐        ┌──────────────┐
 │ UI (Preact+htm)      │  intent     │ Autorität: hält den Stand │ state  │ nur lesen    │
 │ Transport            │────────────▶│ engine.reduce(state,aktion)│───────▶│ Transport    │
 │                      │◀────────────│ Transport (alle Kanäle)   │        └──────────────┘
 └──────────────────────┘  state/event└───────────────────────────┘
            │  Kanäle über Supabase Realtime Broadcast (oder BroadcastChannel lokal)  │
```
GitHub Pages liefert nur Dateien. Zwischen den Browsern vermittelt ein Nachrichtenkanal (Supabase Realtime Broadcast, siehe `adr/0002`). Es gibt keine Datenbank und keinen eigenen Servercode.

## Schichten
| Schicht | Ordner | Regel |
|---|---|---|
| Engine | `web/js/engine/` | rein, deterministisch, ohne DOM/Netz/Uhr; testbar mit `node --test` |
| Transport | `web/js/transport/` | Schnittstelle `send`, `onMessage`, `close`; Varianten `local`, `supabase` |
| UI | `web/js/ui/` | Preact + htm, importiert Bibliotheken nur über `ui/vendor.js` |
| Inhalt | `web/content/<paket>/` | JSON, gegen `schema/scenario.schema.json` geprüft |
| Konfiguration | `web/js/config.js` | öffentliche Werte (Transport, Supabase-URL, `anon key`) |

## Seiten und Adressen
| Adresse | Zweck |
|---|---|
| `/` | Startseite; mit Hash `#/join/CODE/TEAM` die Beitrittsseite |
| `/admin/` | Spielleitung: Sitzung anlegen, steuern |
| `/beamer/#/CODE` | Beamer-Ansicht (nur lesend) |

Hash-Routing, weil GitHub Pages keine Umleitungen kennt. Sitzungscode: 4 Zeichen aus `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`.

## Kanäle
Name per `channelName(code, scope, team)`:
- `iso19650:CODE:lobby` – Beitritte und Ankündigungen der Spielleitung
- `iso19650:CODE:team:N` – Spielverkehr eines Teams
- `iso19650:CODE:beamer` – Anzeige für den Beamer

Kanalnamen sind kein Geheimnis (siehe `PRIVACY_AND_SECURITY.md`).

## Nachrichten
Jede Nachricht ist ein JSON-Objekt mit Hülle:
```json
{ "v": 1, "type": "intent", "sid": "KXQF", "team": 3, "from": "<geräteId>", "seq": 12, "ts": 1790000000000, "payload": { } }
```
`v` = `PROTOCOL_VERSION`, `seq` zählt pro Absender, `ts` setzt der Absender (Millisekunden).

| type | Richtung | payload |
|---|---|---|
| `join` | Spieler → Admin | `{ nickname, deviceToken, team }` |
| `welcome` | Admin → Spieler | `{ roleId, kind: 'role'/'twin'/'observer', snapshot }` |
| `intent` | Spieler → Admin | `{ action, args }` (Aktionen siehe unten) |
| `state` | Admin → Team/Beamer | `{ rev, snapshot }` (voller Stand, später Differenzen) |
| `event` | Admin → Team | `{ eventId, effective, lesson }` Panne und Folgen |
| `reject` | Admin → Spieler | `{ seq, reason }` |
| `phase` | Admin → alle | `{ round, step, endsAt }` |
| `ping`/`pong` | beide | Verbindungstest, Wiederaufnahme |

Unbekannte `type` oder fremde `v` werden ignoriert und protokolliert, nie ausgeführt. Nachrichten gehen verloren: Absoluten Stand senden, nicht Differenzen; Spieler fragen bei Lücke in `rev` per `ping` den Stand an.

## Spielstand (Admin)
```
session   { code, config{teams,size,duration,scenarioId,options}, status, round, step, endsAt, rev }
team[n]   { players[{ id, nickname, roleId, kind, lastSeen }], kpis, containers[], safeguards{ id:{active,stale,since} },
            log[], hits[], goalsState }
container { id, type, ownerRole, cdeStatus, version, defects, requirementRef, checks[] }
```
Der Stand ist reines JSON. `engine.reduce(state, action, ctx)` liefert den neuen Stand (`ctx` enthält `rng` und `now`).

## Aktionen (Absichten der Spieler)
`order` (Bestellen), `produce`, `check`, `release` (CDE-Statuswechsel), `establish` (Maßnahme einführen), `clarify` (Issue). Die Admin-Aktionen: `start`, `pause`, `nextStep`, `triggerEvent`, `assignRole`, `reveal`, `export`. Regeln pro Aktion: `GAME_DESIGN.md`.

## Wiederherstellung und Ausfälle
- Der Admin speichert den Stand nach jeder Änderung in `localStorage` und kann ihn als Datei exportieren und laden. Lädt er die Seite neu, setzt er die Sitzung fort.
- Ist der Admin offline, zeigen Spieler „Spielleitung offline“ und halten ihre Eingaben; beim Wiedereintreffen werden sie erneut gesendet.
- Spieler-Rolle: Gerätetoken in `localStorage` stellt Rolle und Team nach Neuladen wieder her. Rolle bleibt 3 Minuten reserviert; danach Auto-Spieler.
- Rate-Limit: höchstens 20 Nachrichten pro Sekunde und Verbindung (`eventsPerSecond` im Transport); Zeigerbewegungen, falls es sie gibt, höchstens 5 pro Sekunde.

## Zufall und Reihenfolge
Alle Zufälle laufen über `createRng(seed)` mit Seeds wie `teamSeed(code, team, 'roles')`. Dadurch sind Rollenreihenfolge und Pannenreihenfolge reproduzierbar und pro Team verschieden, und Tests sind stabil.

## Tests
- Engine und Inhalte: `node --test` (`tests/`), laufen in CI bei jedem Push.
- Oberfläche: Playwright-Skripte (ab M2, Vorlage in `ROADMAP.md`), mehrere Tabs simulieren mehrere Spieler.
- Last: 5 Teams × 6 Spieler gleichzeitig gegen den echten Kanal (M5) vor der ersten Veranstaltung.

## Erweiterbarkeit
Neues Szenario = neuer Ordner `web/content/<paket>/` mit `scenario.json`; Engine bleibt gleich. Weitere Sprachen: Texte stehen im Szenario, Oberflächentexte künftig in `web/js/i18n/` (noch nicht angelegt).
