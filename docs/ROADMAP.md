# Roadmap

Reihenfolge der Arbeit mit Abnahmekriterien. Ein Meilenstein ist erst fertig, wenn alle Punkte erfüllt sind und `npm run check` grün ist. Stand 2026-11-08.

Legende: [x] erledigt · [ ] offen

## M0 Gerüst – fertig
- [x] Repo-Struktur, Lizenzen (MIT, CC BY 4.0), Regeln für KI (`AGENTS.md`)
- [x] Engine-Grundlagen: Zufall mit Seed, Sitzungscodes und Links, Rollenpakete und -vergabe, Regelfunktionen (Schaden, Schutz, Wertung) mit 16 Tests
- [x] Szenario „Kita-Neubau“: 11 Rollen, 6 Rollenpakete (3 bis 8), 6 Runden, 24 Maßnahmen, 14 Ereignisse; Schema und Prüfskript
- [x] Admin-Seite: Sitzung anlegen, Team-Links, QR-Codes; Start- und Beamer-Platzhalter
- [x] CI und Veröffentlichung (Workflows), Bibliotheken lokal mit Lizenztexten

## M1 Spiel-Kern (nur Engine, ohne Oberfläche)
Dateien: `web/js/engine/state.js`, `actions.js`, `events.js`, `score.js`, Tests dazu.
- [ ] `createSession(config, scenario, ctx)` baut den Anfangsstand (Teams, Kennzahlen 70, leere Container)
- [ ] `reduce(state, action, ctx)` für alle Aktionen aus `GAME_DESIGN.md` Abschnitt 7; ungültige Aktionen liefern `{ ok: false, reason }`, ändern aber nie den Stand
- [ ] Ereignis-Ziehung pro Runde mit Seed je Team; gleiche Ereignisse für alle Teams, andere Reihenfolge
- [ ] Aktionspunkte und Pflege (Einführen, Pflegekosten, „veraltet“)
- [ ] CDE-Statuswechsel mit Berechtigungen und Schattenkanal-Regel
- [ ] Wertung inkl. geheimer Rollenziele (`kpi_min`, `events_with_tag_max`, `safeguard_by_round`, `first_pass_rate_min`)
- Abnahme: Ein automatisierter Probelauf spielt 6 Runden mit Strategie „keine Maßnahmen“ und „alle Maßnahmen“; erste scheitert oder verliert deutlich, zweite verliert durch Aktionspunkte an Termin. Beide Läufe sind reproduzierbar (zweimal gleiches Ergebnis). Testabdeckung der Engine ≥ 90 % der Zeilen.

## M2 Beitritt und Rollen (lokal)
- [ ] Beitrittsseite `#/join/CODE/TEAM`: Spitzname, automatische Rolle, Rollenkarte mit geheimen Zielen
- [ ] Lobby mit Teamliste für die Spielleitung; Rollen tauschen, sperren, neu zuweisen
- [ ] Wiedereintritt per Gerätetoken; Auto-Spieler für freie Rollen; Zwilling oder Beobachter bei Überzahl
- [ ] Transport `local` (mehrere Tabs) vollständig; Nachrichtenhülle laut `ARCHITECTURE.md`
- Abnahme: Playwright-Test öffnet 1 Admin-Tab und 6 Spieler-Tabs, alle bekommen unterschiedliche Rollen; Neuladen eines Tabs behält die Rolle; 7. Tab wird Zwilling.
- Vorlage Browser-Test (Node, Playwright): Seite per `npm run serve` starten, `chromium.launch()`, mehrere `context.newPage()`, mit `page.on('console'|'pageerror')` Fehler sammeln, am Ende `errors.length === 0` prüfen und Screenshots mit `deviceScaleFactor: 1` ansehen.

## M3 Spielleitung
- [ ] Sitzungsablauf: Lobby → Runde 1 … 5 → Finale → Auswertung, mit Timer je Schritt (Lage, Handeln, Panne, Folgen)
- [ ] Steuerung: Start, Pause, Weiter, Runde überspringen, Ereignis auslösen oder verschieben, Nachricht an alle
- [ ] Speichern des Stands in `localStorage` nach jeder Änderung, Export und Import als Datei
- [ ] Dauerprofile 45 / 90 / 120 Minuten
- Abnahme: Neuladen der Admin-Seite mitten in Runde 3 setzt die Sitzung fort; Export und Import ergeben denselben Stand.

## M4 Spieler-Oberfläche und Beamer
- [ ] Spielbrett (Phasen × Rollen), Hand mit Maßnahmenkarten, Aktionen, Kennzahlen, Lernkarte nach Ereignis
- [ ] Private Ansicht: Rollenziele, eigene Aufgaben
- [ ] Beamer: Rangliste, Timer, aktuelle Panne, Lehrmomente für die Nachbesprechung
- [ ] Handy zuerst (390 px), Tastatur bedienbar, Kontrast ≥ 4,5:1, hell und dunkel
- Abnahme: Ein Team mit 6 Tabs spielt Runde 1 komplett; keine Konsolenfehler; Screenshots geprüft.

## M5 Echter Kanal (Supabase) und Last
- [ ] `transport/supabase.js` gegen ein echtes Projekt testen (bisher nur geschrieben, nicht getestet)
- [ ] Last: 5 Teams × 6 Spieler plus Admin und Beamer gleichzeitig; Nachrichtenrate unter 100/s (Gratis-Limit), Verbindungen unter 200
- [ ] Test im Uni-WLAN (WebSocket auf Port 443) und mit Mobilfunk
- Abnahme: 36 gleichzeitige Verbindungen 20 Minuten stabil; Wiederverbindung nach 30 s Netzausfall.

## M6 Finale und Auswertung
- [ ] Fremdprüfung (optional): Übergabepaket des Nachbarteams prüfen
- [ ] Abnahmefragen, Auflösung „Welches Dokument fehlt?“
- [ ] Auswertung je Team (teuerste Panne, vermeidbarer Verlust) und Export (Markdown/CSV) ohne Klarnamen

## M7 Politur
- [ ] Gestaltung, Animationen (Konfetti, Kennzahl-Schläge), optionale Töne (nur eigene oder freie, siehe `LICENSING.md`)
- [ ] Druckansicht für Team-Links
- [ ] Englische Fassung (Texte)

## M8 Spieltest und Freigabe
- [ ] Spieltest mit 1 bis 2 Gruppen, Balancing der Zahlen, Eintrag im Änderungsprotokoll
- [ ] Normverweise im Szenario prüfen (`verified: true`) gegen die aktuelle Ausgabe der DIN EN ISO 19650
- [ ] Datenschutz-Freigabe der Hochschule, Hinweistext einbauen (`PRIVACY_AND_SECURITY.md`)
- [ ] Autoren des Originalspiels informieren

## Offene Entscheidungen
1. Fremdprüfung im Finale: Wettbewerb zwischen Teams ja oder nein?
2. Dauer: 90 Minuten angenommen.
3. Hosting des Echtzeit-Kanals: Supabase (Frankfurt) angenommen; Alternative Cloudflare Durable Objects (`adr/0002`).
4. Signierte Spielleiter-Nachrichten gegen Schummeln (`PRIVACY_AND_SECURITY.md`) – erst nach Spieltest.
