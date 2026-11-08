# Inhalte schreiben (Szenario-Pakete)

Ein Szenario-Paket ist ein Ordner `web/content/<paket>/` mit einer Datei `scenario.json`. Die Spiel-Engine bleibt für alle Pakete gleich. Prüfung: `npm run validate` (Schema `schema/scenario.schema.json` plus Verweise und Wertebereiche).

## Aufbau von `scenario.json`
| Schlüssel | Inhalt |
|---|---|
| `schemaVersion` | derzeit 1 |
| `meta` | `id`, `title`, `subtitle`, `language`, `version`, `license` (`CC-BY-4.0`), `author`, `inspiredBy`, `story` |
| `kpis` | `start` (Startwert, 70) und `labels` für `termin`, `budget`, `qualitaet`, `vertrauen` |
| `roles` | Rollen mit `id`, `name`, `isoParty` (Rollentyp nach ISO 19650), `tier` (1 = zuerst vergeben), `description`, `goals` |
| `rolePacks` | je Teamgröße 3 bis 8 die Liste der Rollen-IDs (genau so viele wie die Größe) |
| `rounds` | `id`, `number`, `title`, `stages` (Phasennummern 0 bis 7), `briefing`, `need`, `finale` |
| `catalog` | Maßnahmen: `id`, `name`, `nameEn`, `group`, `description`, `introCostAP`, `upkeepAP` |
| `events` | Ereignisse: `id`, `round`, `title`, `story`, `affects`, `damage`, `safeguards`, `tags`, `lesson` |

Rollenziele (`goals`) haben `kind` (`main` oder `conflict`) und eine `condition` vom Typ `kpi_min`, `events_with_tag_max`, `safeguard_by_round` oder `first_pass_rate_min`.

## Ein Ereignis schreiben
1. **Panne zuerst:** Titel und `story` beschreiben, was schiefgeht, nicht, wie die Norm heißt. Zwei bis drei Sätze, alltagsnah, leicht ironisch, ohne echte Firmen, Personen oder Projekte.
2. **Schaden:** `damage` mit negativen Zahlen je Kennzahl, üblich −5 bis −20, selten mehr. Positive Werte nur bei Glückskarten.
3. **Schutz:** `safeguards` nennt Maßnahmen aus dem Katalog mit Schutzwert 0 bis 1. Richtwert: Summe aller Schutzwerte 0,6 bis 1,0, damit die Panne abwendbar ist (die Prüfung verlangt mindestens 0,5). Wirksamer Schaden = Schaden × max(0,2; 1 − Schutz).
4. **Lernkarte:** `lesson.what` (was ist passiert), `lesson.prevention` (was hätte es verhindert), `lesson.reference` (Norm, Thema, `verified`).
5. **Tags:** klein, mit Bindestrich (`nachtrag`, `unklare-anforderung`), werden von Rollenzielen ausgewertet.

## Maßnahmen im Katalog
- Kurzbeschreibung in eigenen Worten, ein Satz, verständlich für Studierende. Nicht aus der Norm oder dem Originalspiel kopieren.
- `introCostAP`: einmalige Kosten. `upkeepAP`: Pflege pro Runde. Teure Maßnahmen schützen entsprechend stärker.
- Ablenkungskarten (Maßnahmen ohne Schutzwirkung) sind erlaubt und gewollt, weil falsche Wahl Aktionspunkte kostet; die Prüfung meldet sie nur als Warnung.

## Normverweise
`reference.verified` bleibt `false`, bis Titel, Teil und Thema gegen die aktuelle Ausgabe (DIN EN ISO 19650 und ISO 19650) geprüft sind. Keine Zitate oder Abschnitte der Norm abschreiben; nur das Thema nennen.

## Neues Paket anlegen
1. Ordner kopieren: `web/content/kita` → `web/content/<neu>`.
2. `meta.id`, Titel, Geschichte, Runden, Ereignisse ändern; Rollen und Katalog nur ändern, wenn nötig.
3. `npm run validate`, dann `config.scenarioUrl` oder die Auswahl in der Admin-Seite anpassen.
4. Spieltest, dann `meta.version` erhöhen.

## Balance-Hinweise
- Ein Team ohne jede Maßnahme soll sichtbar leiden, aber nicht in Runde 2 scheitern (Kennzahl 0).
- Ein Team, das alles einführt, verliert durch Pflegekosten Termin: dafür sorgen `upkeepAP` und das Aktionspunkte-Budget (2 pro Spieler und Runde).
- Änderungen an Zahlen im Änderungsprotokoll von `GAME_DESIGN.md` vermerken.
