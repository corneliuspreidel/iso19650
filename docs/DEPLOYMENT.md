# Veröffentlichen und Betrieb

## 1. GitHub Pages (einmalig)
1. Auf GitHub: Repository → **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
2. Änderungen nach `main` pushen. Der Workflow `Pages` prüft (`npm run check`) und veröffentlicht den Ordner `web/`.
3. Adresse: `https://corneliuspreidel.github.io/iso19650/`. Die Spielleitung öffnet `…/admin/`.
Der Workflow `CI` prüft zusätzlich jede Pull-Anfrage. Hinweis: Die Versionen der GitHub-Actions im Workflow (`checkout@v4`, `setup-node@v4`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`) wurden nicht gegen die neuesten Veröffentlichungen geprüft; Dependabot schlägt Updates vor (`.github/dependabot.yml`).

## 2. Echtzeit-Kanal mit Supabase (ab M5)
Nur nötig, wenn Spieler auf verschiedenen Geräten spielen (lokal im Tab-Test reicht `transport: 'local'`).
1. Konto bei supabase.com anlegen, **neues Projekt**, Region **Frankfurt (eu-central-1)**. Eine Datenbank wird nicht benutzt.
2. In den Projekteinstellungen unter **API** die Projekt-URL und den `anon`/`public`-Schlüssel kopieren. **Niemals** den `service_role`-Schlüssel verwenden oder committen.
3. In `web/js/config.js` eintragen: `transport: 'supabase'`, `supabaseUrl`, `supabaseAnonKey`. Der `anon`-Schlüssel ist für den Browser vorgesehen und darf im öffentlichen Repo stehen.
4. In den Realtime-Einstellungen öffentliche (nicht private) Kanäle zulassen; es werden nur Broadcast-Nachrichten benutzt. (Bezeichnung der Einstellung nicht geprüft; Oberfläche von Supabase kann abweichen.)
5. Mit zwei Geräten testen (Admin, Spieler).

Gratis-Tarif (geprüft am 2026-11-08, vor Einsatz erneut ansehen): 200 gleichzeitige Verbindungen, 100 Nachrichten pro Sekunde, Nutzlast bis 256 KB. Gratis-Projekte werden nach 7 Tagen ohne Aktivität pausiert; Projekt vorher im Dashboard reaktivieren.

## 3. Checkliste einen Tag vor der Veranstaltung
- [ ] Supabase-Projekt aktiv (nicht pausiert), URL und `anon key` in `config.js`, veröffentlicht
- [ ] Test mit 2 Geräten im Hörsaal-WLAN (WebSocket auf Port 443 erlaubt?)
- [ ] Sitzung anlegen, Team-Links und QR-Codes ausdrucken oder projizieren (`Links drucken`)
- [ ] Beamer-Seite öffnet, Rangliste sichtbar
- [ ] Export-Ordner bereit; Admin-Gerät am Netz und mit abgeschaltetem Ruhezustand
- [ ] Notfallplan: Szenario als Papier oder Präsentation, falls das Netz ausfällt
- [ ] Hinweis zum Datenschutz am Beamer oder auf der Startseite (`PRIVACY_AND_SECURITY.md`)

## 4. Lokal entwickeln
```
npm ci
npm run serve      # http://localhost:8080
npm run check
```
Mehrere Tabs desselben Browsers spielen über `BroadcastChannel` gegeneinander, ohne Dienst.

## 5. Wenn etwas hakt
- Weiße Seite: Browserkonsole prüfen, Pfade in `web/` sind relativ; unter `/iso19650/` darf kein absoluter Pfad mit `/` am Anfang stehen.
- Keine Verbindung: URL oder Schlüssel in `config.js`, Projekt pausiert, WLAN blockiert WebSocket (Mobilfunk testen).
- Spielstand weg: Admin-Seite im selben Browser neu öffnen (Stand liegt in `localStorage`), sonst exportierte Datei laden.
