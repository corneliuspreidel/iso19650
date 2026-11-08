# Spielregeln und Spiellogik – ISO-19650-Planspiel „Murphy baut mit“

Stand: 2026-11-08 · Version 0.1 (Entwurf, nicht spielgetestet) · Lizenz: CC BY 4.0

Dies ist die verbindliche Beschreibung der Spiellogik. Alle Zahlen sind Startwerte für den ersten Spieltest, keine fertige Balance. Die Umsetzung steht in `web/js/engine/` (Regeln) und `web/content/` (Inhalte); die Reihenfolge der Arbeit steht in `ROADMAP.md`. Abgrenzung zum Originalspiel und Quellen: `LICENSING.md`.

## 1. Idee in einem Satz
Die Studierenden führen ein Bauprojekt durch seine Phasen. In jeder Runde trifft sie eine Panne. Das ISO-19650-Dokument oder -Werkzeug, das die Panne verhindert hätte, lernen sie erst dadurch kennen, dass sie die Folgen spüren (Problem zuerst, Dokument als Antwort).

## 2. Lernziele (nach dem Spiel können die Studierenden …)
1. erklären, wer wem was wann beauftragt (Anforderungen vor Lieferung);
2. die CDE-Status WIP, Shared, Client Shared und Published unterscheiden und sagen, wer freigeben darf;
3. begründen, warum geprüft wird (statt zu vertrauen) und womit (Sichtprüfung, IDS, Validierung);
4. den passenden Dokumentenumfang abwägen (zu wenig = Pannen, zu viel = Bürokratie).

## 3. Admin und Sessions
### 3.1 Spiel anlegen (Admin-Seite)
Eingaben:
- Veranstaltungsname, Szenario-Paket (Standard: Kita-Neubau; weitere Pakete austauschbar);
- Anzahl Teams T (1–12) und Teamgröße N (3–8);
- Dauer: 45 / 90 / 120 Minuten (4 / 6 / 8 Runden);
- Pannenhäufigkeit (leicht / normal / hart);
- Schalter: geheime Rollenziele an/aus, Fremdprüfung im Finale an/aus, Rundentimer automatisch/manuell.

Ergebnis (automatisch erzeugt):
- eine Spielleiter-Seite (nur für den Admin, mit geheimem Schlüssel);
- eine Beamer-Seite (Rangliste, Timer, Ereignisse);
- T Team-Links und QR-Codes, z. B. `…/#/join/KXQF/3` (Sitzungscode + Teamnummer; Hash-Routing, weil GitHub Pages keine Umleitungen kann). Der Admin verteilt die Links, z. B. als Ausdruck der QR-Seite.

### 3.2 Beitritt und Rollenvergabe
- Spieler öffnet den Team-Link, gibt einen Spitznamen ein (keine Klarnamen, kein Login) und bekommt automatisch die nächste freie Rolle.
- Vergabereihenfolge pro Team nach Priorität (siehe 4): erst die für den Ablauf unverzichtbaren Rollen, Reihenfolge innerhalb gleicher Priorität zufällig mit festem Seed.
- Ein Gerätetoken im Browser stellt die Rolle nach Neuladen wieder her.
- Optionaler Modus „Rollen erst beim Start“: Teams sammeln sich in einer Lobby, die Rollen werden nach tatsächlicher Teamstärke verteilt (Rollenpaket nach 4.1).
- Weniger Spieler als Rollen: freie Rollen übernimmt ein einfacher Auto-Spieler (erledigt Routine mit mittlerer Qualität, prüft nicht von selbst). Ein Auto-Spieler ist selbst eine Lernquelle („wer prüft, wenn keiner prüft?“).
- Mehr Spieler als Rollen: Überzählige werden Zwilling einer Rolle (einer klickt, einer berät, Wechsel jede Runde) oder Beobachter-Auditor (Admin wählt).
- Admin kann Rollen tauschen, sperren, neu zuweisen und Spieler einem anderen Team zuordnen.
- Abbruch/Verbindungsverlust: Rolle bleibt 3 Minuten reserviert, danach springt der Auto-Spieler ein; Rückkehr jederzeit möglich.

### 3.3 Spielleiter-Funktionen
Start/Pause, Runde überspringen, Ereignis manuell auslösen oder verschieben, Nachricht an alle, Lösungen aufdecken, Debrief-Ansicht, Export der Ergebnisse (Markdown/CSV), Spielstand als Datei sichern und laden.

## 4. Rollen
### 4.1 Rollenpakete nach Teamgröße
| N | Rollen |
|---|--------|
| 3 | Auftraggeber (inkl. Informationsmanagement), Planung (Architektur + TGA), Ausführung (GU + Sub) |
| 4 | Auftraggeber, BIM-Management (Informationsmanager), Planung (Architektur + TGA), Ausführung |
| 5 | Auftraggeber, BIM-Management, Architektur, TGA-Fachplanung, Ausführung |
| 6 | Auftraggeber, BIM-Management, Architektur, TGA, Generalunternehmer, Subunternehmer (= Original) |
| 7 | + Betreiber/Nutzer (besitzt die Anforderungen an das Asset-Informationsmodell und die Betriebsphase) |
| 8 | + Behörde/Prüfer (Genehmigung, Fremdprüfung) |

Rollentyp nach ISO 19650: Auftraggeber = Appointing Party; Architektur und Generalunternehmer = Lead Appointed Party; TGA, Subunternehmer = Appointed Party.

### 4.2 Geheime Rollenziele (optional)
Jede Rolle bekommt zwei private Ziele, die teils miteinander in Konflikt stehen. Beispiele:
- Auftraggeber: Budget am Ende ≥ 60; im Konflikt: keine Nachträge.
- BIM-Management: jede Lieferung besteht die Prüfung im ersten Anlauf.
- Architektur: Entwurf unverändert halten (kein Änderungsereignis Kategorie „Entwurf“).
- TGA: früh Raumdaten bekommen (Bestellung der Anforderungen bis Runde 2).
- Generalunternehmer: keine Nacharbeit (kein Ereignis „Nacharbeit“).
- Subunternehmer: nie überlastet (Kapazität ≤ Aufträge).
- Betreiber: vollständiges Asset-Informationsmodell bei Übergabe.

Wertung: Team 70 %, individuelle Ziele 30 %. Beim Debrief wird aufgedeckt, wessen Einzelziel dem Projekt geschadet hat.

## 5. Spielmodell
### 5.1 Informationscontainer
Jeder Container hat: Typ (Dokument oder Modell), Eigentümerrolle, CDE-Status (WIP / Shared / Client Shared / Published), Version, verdeckte Mängel (0–3), Anforderung, gegen die er gemessen wird, Prüfhistorie.
Statuswechsel nur durch die erlaubte Rolle und nur nach bestandener Prüfung:
- WIP → Shared: Eigentümerrolle, nach interner Prüfung;
- Shared → Client Shared: Lead Appointed Party, nach Koordinationsprüfung;
- Client Shared → Published: Auftraggeber, nach Annahmeprüfung.
Abkürzung per E-Mail/USB ist erlaubt, löst aber das Schattenkanal-Risiko aus (Ereignis wahrscheinlicher, Container gilt als „ungeprüft“).

### 5.2 Kennzahlen (Team, je 0–100, Start 70)
Termin, Budget, Qualität (Informationsqualität), Vertrauen (Zusammenarbeit). Fällt eine Kennzahl auf 0, ist das Projekt gescheitert (Abbruch-Ereignis, Debrief sofort).

### 5.3 Aktionspunkte (AP)
Jeder Spieler hat 2 AP pro Runde. Jedes eingeführte Dokument/Werkzeug kostet einmal 1 AP (Einführung) und danach 1 AP des Teams pro Runde (Pflege). Nicht gepflegte Dokumente gelten als „veraltet“ und schützen nur zur Hälfte. So entsteht der Zielkonflikt zwischen Schutz und Bürokratie: zu viele Dokumente fressen AP und senken Termin.

## 6. Ablauf (90 Minuten, 6 Runden)
| Zeit | Block | Inhalt |
|------|-------|--------|
| 0–10 | Lobby und Einführung | Beitritt, Rollen, Kurzgeschichte, Beamer erklärt die vier Kennzahlen |
| 10–22 | R1 Bedarf und Bestellung (Phase 0–1) | Auftraggeber formuliert Bedarf, Ausschreibung, Beauftragung |
| 22–34 | R2 Konzept (Phase 2–3) | Entwurf, Koordination, CDE-Freigaben |
| 34–46 | R3 Technische Planung (Phase 4) | Fachmodelle, IFC, Lieferplanung |
| 46–58 | R4 Bau (Phase 5) | Ausführung, Änderungen, Kapazität |
| 58–70 | R5 Übergabe und Betrieb (Phase 6–7) | Als-gebaut, Asset-Informationsmodell |
| 70–85 | Finale | Fremdprüfung und Abnahme (siehe 9) |
| 85–90 | Auswertung | Rangliste, Debrief |

Je Runde (12 Minuten): Lage (1) → Planen und Handeln (6) → Ereignis (2) → Folgen und Lernkarte (3). Der Admin hat zusätzlich zwei Minuten Debrief-Pause, die er per Knopf einblendet.
Für 45 Minuten: R1+R2 und R3+R4 zusammenlegen, Finale kurz. Für 120 Minuten: zusätzlich Runde „Änderungsmanagement“ und „Qualitätssicherung“.

## 7. Aktionen (6)
1. **Bestellen (Require):** Auftraggeber/Lead wählt Zweck (Anwendungsfall), Informationstiefe (niedrig/mittel/hoch) und Termin. Trifft die Bestellung den verdeckten Bedarf der Runde, gibt es Bonus Qualität; zu vage → Mehrdeutigkeit (Ereignis wahrscheinlicher); zu detailliert → Aufwand und Termin −.
2. **Erstellen (Produce):** Erzeugt einen Container. Qualität folgt der Bestellung, der Kapazität der Rolle und eingeführten Standards; Mängel sind verdeckt.
3. **Prüfen (Check):** Prüfart wählen (Sichtprüfung 1 AP, Regelprüfung/IDS 2 AP, Validierungsdienst 1 AP, jeweils mit eigener Trefferquote). Mängel werden sichtbar und kosten Nacharbeit (Termin −).
4. **Freigeben (Release):** CDE-Statuswechsel nach 5.1; unzulässige Wege erzeugen den Schattenkanal.
5. **Einführen (Establish):** Dokument/Werkzeug aus dem Katalog (siehe 8.3) wählen. Die Karte zeigt nur die Kurzbeschreibung wie im Original; falsche Wahl kostet den AP ohne Wirkung („falsches Dokument“).
6. **Klären (Communicate):** Issue (BCF) anlegen, zuweisen, schließen. Reduziert Folgeschäden von Koordinationsereignissen.

Entscheidungen sind deterministisch; Zufall steckt nur in der Reihenfolge der Ereigniskarten (fester Seed pro Team). Alle Teams bekommen dieselben Ereignisse, aber in unterschiedlicher Reihenfolge innerhalb der Runde, damit Nachbarn nicht abschauen und der Vergleich am Ende fair bleibt.

## 8. Ereignisse und Schutz
### 8.1 Wirkung
Jedes Ereignis hat Runde, betroffene Rolle(n), Grundschaden je Kennzahl und eine Liste von Schutzmaßnahmen mit Schutzwert.
Effektiver Schaden = Grundschaden × max(0,2; 1 − Σ Schutzwerte der aktiven Maßnahmen), Summe auf 0,8 begrenzt. Veraltete Maßnahmen zählen halb. Ohne jeden Schutz: voller Schaden.
Nach dem Ereignis zeigt die Lernkarte: Was ist passiert? Was hätte es verhindert? Wo steht das in ISO 19650? Erst jetzt wird die passende Maßnahme als Karte hervorgehoben (aber nicht automatisch eingeführt).

### 8.2 Beispielereignisse (Kita-Paket, Startsatz)
| Nr | Runde | Ereignis | Schutz (Schutzwert) | Schaden |
|----|-------|----------|--------------------|---------|
| E01 | 1 | Der Träger will „irgendwie nachhaltig“ (vage Anforderung) | AIA/EIR (0,5), PIR (0,3) | Qualität −15, Budget −5 |
| E02 | 1 | Zwei Büros, zwei Dateinamen-Systeme | Informationsstandard (0,5), Methoden und Verfahren (0,3) | Qualität −10, Termin −5 |
| E03 | 1 | Angebot verspricht alles, ohne Plan | BAP vor Beauftragung (0,5), Capability-and-Capacity-Bewertung (0,3) | Vertrauen −10, Termin −10 |
| E04 | 2 | Die falsche Version hängt im Besprechungsraum | CDE-Status (0,6), Informationsmanagement-Matrix (0,2) | Qualität −15, Termin −5 |
| E05 | 2 | Lüftung kollidiert mit Unterzug | BCF-Issues (0,4), Prüfung in Shared (0,3) | Qualität −15, Termin −10 |
| E06 | 2 | Der Träger ändert den Nutzungsfall | Risikoregister (0,3), Detaillierte Verantwortungsmatrix (0,2) | Budget −15, Termin −10 |
| E07 | 3 | IFC ohne Property-Sets | IDS (0,5), bSDD (0,3), Validierungsdienst (0,2) | Qualität −20 |
| E08 | 3 | TGA liefert zu spät | MIDP/TIDP (0,5), Mobilisierungsplan (0,2) | Termin −15, Vertrauen −5 |
| E09 | 3 | Datei per Mail am CDE vorbei | CDE-Status (0,3), Projektinformationsprotokoll (0,4) | Vertrauen −10, Qualität −10 |
| E10 | 4 | Subunternehmer baut nach Planstand B statt C | CDE-Status (0,4), TIDP (0,3), Prüfung vor Published (0,3) | Budget −15, Termin −10 |
| E11 | 4 | Kapazitätsloch beim Subunternehmer | Capability-and-Capacity-Bewertung (0,6) | Termin −15, Budget −5 |
| E12 | 5 | Als-gebaut-Dokumentation unvollständig | AIA für Übergabe (0,5), IDS (0,3) | Qualität −20 |
| E13 | 5 | Betreiber fragt nach der Wartungsanleitung des Lüftungsgeräts | Asset-Informationsanforderungen/AIM (0,6), IDS (0,2) | Qualität −15, Vertrauen −5 |
| G01 | beliebig | Glückskarte: Der Praktikant findet den Fehler früh | – | Qualität +5 |

Terminologie im Spiel: AIA (Auftraggeber-Informationsanforderungen = EIR), BAP (BIM-Abwicklungsplan), MIDP/TIDP, CDE. Vor dem Einsatz die Begriffe gegen die aktuelle DIN EN ISO 19650 prüfen (Ausgabe noch nicht geprüft).

### 8.3 Katalog der Maßnahmen (Karten wie im Original)
Anforderungen: PIR, AIA/EIR, (L)EIR, Informationsstandard, Methoden und Verfahren, Projektinformationsprotokoll. Planung und Steuerung: BAP vor/nach Beauftragung, Informationsmanagement-Matrix, Hoch- und Detail-Verantwortungsmatrix, MIDP, TIDP, Risikoregister, Mobilisierungsplan, Capability-and-Capacity-Bewertung. Container: WIP/Shared/Client Shared/Published (CDE). bSI-Werkzeuge: UCM, IDS, bSDD, BCF, Validierungsdienst, IFC. Ergebnisse: Projekt- und Asset-Informationsmodell.
Jede Karte hat: Kurzbeschreibung, Einführungs- und Pflegekosten, Schutzwerte je Ereignis (Datensatz im Szenario-Paket, nicht im Code).

## 9. Finale: Fremdprüfung und Abnahme
1. **Fremdprüfung (optional):** Der Auftraggeber jedes Teams erhält das Übergabepaket des Nachbarteams und prüft es gegen dessen AIA: Fehler finden zählt als Punkte für den Prüfer, unentdeckte Mängel als Minuspunkte für das prüfende Team. Das Team sieht dabei, was schlechte Informationslieferung kostet.
2. **Abnahmefragen:** Drei Fragen des Betreibers („Wo ist …?“) werden mit den eigenen Containern beantwortet; gelingt es dem Team, den Container zu finden und er ist Published, gibt es Punkte.
3. **Auflösung „Welches Dokument fehlt?“:** Das im Original versteckte Rätsel (Capability-and-Capacity-Bewertung) wird als Abschlusspointe aufgedeckt: Wer hat es eingeführt, und welches Ereignis hat es abgefangen?

## 10. Wertung
Teampunkte = Durchschnitt der vier Kennzahlen (60) + Passgenauigkeit der Maßnahmen (20, Verhältnis wirksam eingeführt zu insgesamt eingeführt) + Finale (20). Gesamt = 70 % Team + 30 % Einzelziele. Rangliste live am Beamer; Auswertung zeigt je Team die teuerste Panne und den größten vermeidbaren Verlust.

## 11. Spielleiter-Ansicht und Debrief
- Live-Matrix: Team × Runde mit Ampel; welche Panne hat wen wie stark getroffen.
- „Lehrmomente“: nach jeder Runde automatisch zwei Vorschläge für die Nachbesprechung (häufigste Panne, größter Unterschied zwischen zwei Teams).
- Export am Ende: Ergebnisse je Team, Entscheidungsprotokoll (wer hat wann was bestellt, geprüft, freigegeben) als Markdown/CSV für das Lerntagebuch.

## 12. Technische Architektur (Kurzfassung)
- **Hosting:** GitHub Pages, reine Dateien ohne Build-Schritt, Hash-Routing (siehe `adr/`).
- **Echtzeit:** Supabase Realtime Broadcast (Gratis-Tarif: 200 gleichzeitige Verbindungen, 100 Nachrichten/s; Projekt nach 7 Tagen ohne Aktivität pausiert, vor der Veranstaltung reaktivieren). Region Frankfurt, keine Klarnamen.
- **Autorität:** Der Admin-Browser hält den Spielstand und prüft alle Aktionen; Spieler senden nur Absichten. Spielstand wird bei jeder Änderung lokal gesichert (Wiederherstellung nach Neuladen) und ist als Datei exportierbar. Ist der Admin offline, zeigen die Clients „Spielleitung offline“.
- **Schichten:** `engine/` (reine Funktion `reduce(state, aktion)`, in Node testbar), `content/` (Szenario-Pakete als JSON: Rollen, Runden, Ereignisse, Katalog, Texte), `transport/` (LocalTransport mit BroadcastChannel zum Testen mit mehreren Tabs, SupabaseTransport), `ui/` (Spieler-, Admin- und Beamer-Seite).
- **Test:** Engine-Unit-Tests; mehrere Browser-Tabs simulieren 5 Teams × 6 Spieler automatisiert.
- **Bekannte Grenzen:** Rollenziele sind nicht abhörsicher (Broadcast ist technisch einsehbar); Spielstand hängt am Admin-Browser; Uni-WLAN muss WebSockets auf Port 443 zulassen (vorher testen).

## 13. Szenario-Paket (Datenstruktur, Skizze)
`scenario.json`: `meta` (Name, Sprache), `rollenpakete` (nach N), `runden` (Titel, Lage, Phase, Bedarf), `ereignisse` (Runde, Rolle, Schaden, Schutz, Lernkarte), `katalog` (Karten, Kosten, Beschreibung), `ziele` (je Rolle), `texte` (Erzähler). Weitere Pakete (Straßenbrücke, Schulsanierung) entstehen durch Austausch der Datei.

## 14. Offene Punkte
1. Szenario-Standard: Kita-Neubau (festgelegt für v0.1; weitere Pakete später).
2. Fremdprüfung im Finale: Wettbewerb zwischen den Teams ja/nein?
3. Dauer: 90 Minuten angenommen.
4. Balancing aller Zahlen erst nach Spieltest mit 1–2 Gruppen.
5. Lizenz und Quellenangabe: eigenes Spiel ohne Material des Originals, Hinweis in `LICENSING.md`; Autoren des Originals informieren (empfohlen).
6. Datenschutz an der HM: externer Dienst (Supabase) mit Spitznamen ohne Login akzeptabel?
7. Aktuelle Ausgabe und deutsche Terminologie der DIN EN ISO 19650 prüfen.
