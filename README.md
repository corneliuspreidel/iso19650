# ISO-19650-Planspiel „Murphy baut mit“ (Arbeitstitel)

Digitales Mehrspieler-Planspiel für die Lehre. Studierende spielen in Teams ein Bauprojekt von der ersten Idee bis zum Betrieb. In jeder Runde trifft sie eine Panne, und das Dokument oder Werkzeug aus der Normreihe ISO 19650, das sie verhindert hätte, lernen sie durch die Folgen kennen. Läuft im Browser, ohne Installation, und wird auf GitHub Pages veröffentlicht.

**Stand:** Gerüst (M0). Sitzungscode, Team-Links und QR-Codes funktionieren; das Spiel selbst (Beitritt, Runden, Ereignisse) ist noch nicht gebaut. Plan: [docs/ROADMAP.md](docs/ROADMAP.md).

## Schnellstart
```
git clone https://github.com/corneliuspreidel/iso19650.git
cd iso19650
npm ci
npm run check      # Prüfung und Tests
npm run serve      # http://localhost:8080  (Spielleitung: /admin/)
```
Node 22 oder neuer. Die Seite selbst braucht keinen Build-Schritt.

## So ist es gedacht
1. Die Spielleitung öffnet `/admin/`, legt Teams (1 bis 12) und Teamgröße (3 bis 8) fest und bekommt einen Sitzungscode sowie einen Link samt QR-Code pro Team.
2. Spieler öffnen ihren Team-Link, geben einen Spitznamen ein und bekommen automatisch eine Rolle.
3. Sechs Runden entlang der Projektphasen, ein Finale mit Fremdprüfung, Rangliste auf dem Beamer.

## Dokumentation
| Datei | Inhalt |
|---|---|
| [AGENTS.md](AGENTS.md) | Regeln für KI-Assistenten und Mitwirkende |
| [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) | Spielregeln und Spiellogik |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Aufbau, Nachrichten, Spielstand |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Meilensteine mit Abnahmekriterien |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | Szenarien und Ereignisse schreiben |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | GitHub Pages und Supabase einrichten, Checkliste vor der Veranstaltung |
| [docs/LICENSING.md](docs/LICENSING.md) | Lizenzen, Marken, Quellen |
| [docs/PRIVACY_AND_SECURITY.md](docs/PRIVACY_AND_SECURITY.md) | Datenschutz und Sicherheit |
| [docs/adr/](docs/adr/) | Entscheidungen mit Begründung |

## Lizenz
- Quelltext: [MIT](LICENSE)
- Inhalte (Szenarien, Texte, Dokumentation): [CC BY 4.0](LICENSE-CONTENT), bitte mit Namensnennung „Cornelius Preidel“
- Fremde Bibliotheken: eigene Lizenzen, siehe [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

## Quellen und Abgrenzung
Die Idee, eine Dokumentenkette nach ISO 19650 spielerisch zu vermitteln, wurde durch das „Building Information Management Game“ (Casteleyn, Ransijn, Toet, Briones Alonso; buildingSMART Benelux/Buildwise, 2024) angeregt. Dieses Projekt ist ein eigenes Spiel; es übernimmt kein Material daraus.
buildingSMART®, IFC, IDS, bSDD und BCF sind Marken ihrer jeweiligen Inhaber; ISO ist eine Marke der Internationalen Organisation für Normung. Dieses Projekt ist weder mit ihnen verbunden noch von ihnen gebilligt. Es enthält keine Normtexte.
