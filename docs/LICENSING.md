# Lizenzen, Marken und Quellen

Stand 2026-11-08. Dies ist eine sorgfältige Zusammenstellung, aber keine Rechtsberatung. Offene Punkte stehen am Ende.

## 1. Lizenzen im Projekt
| Bestandteil | Lizenz | Datei |
|---|---|---|
| Quelltext (`web/js`, `scripts`, `tests`, Workflows, `schema`) | MIT | `LICENSE` |
| Inhalte (Szenario-Pakete, Spieltexte, Doku in `docs/`) | CC BY 4.0, Namensnennung „Cornelius Preidel“ | `LICENSE-CONTENT` |
| htm 3.1.1 (mit gebündeltem Preact 10.x) | Apache-2.0 / MIT | `web/vendor/htm-preact/` |
| qrcode-generator 2.0.4 | MIT | `web/vendor/qrcode-generator/` |
| @supabase/supabase-js 2.119.0 (Browser-Bündel) | MIT | `web/vendor/supabase-js/` |

Details und Herkunft der Bibliotheken: `THIRD_PARTY_NOTICES.md`. Jede eigene Code-Datei trägt `SPDX-License-Identifier: MIT`. Szenario-Dateien nennen ihre Lizenz in `meta.license`.

## 2. Das Originalspiel
Das „Building Information Management Game“ (Casteleyn, Ransijn, Toet, Briones Alonso; buildingSMART Benelux/Buildwise, Stand 2024) war Ideengeber für die Frage, wie sich eine Dokumentenkette nach ISO 19650 spielerisch vermitteln lässt. Eine Lizenz für das Original konnte nicht festgestellt werden (weder in den Dateien noch bei einer Websuche). Deshalb gilt:
- Aus dem Original wird **nichts übernommen**: keine Texte, Kartenbeschreibungen, Bilder, Logos, Spielbrett-Grafiken oder Layouts, keine Geschichte (Marrakesch), keine Phasenbezeichnungen.
- Übernommen ist nur die allgemeine Idee (Rollen, Phasen, Dokumente, Prüfungen). Ideen und Fachbegriffe sind nicht geschützt; die Ausgestaltung hier (Pannen, Kennzahlen, Aktionspunkte, geheime Ziele, Fremdprüfung, Digitalform) ist eigen.
- Namensnennung als Ideengeber in `README.md` und im Szenario (`meta.inspiredBy`).
- Empfehlung: Autoren kurz informieren. Möchte man Material des Originals nutzen, vorher schriftlich nachfragen.

## 3. Marken und Normen
- **buildingSMART®, IFC, IDS, bSDD, BCF** und die zugehörigen Logos sind Marken von buildingSMART International bzw. seinen Chaptern. Im Spiel erscheinen nur die Namen als sachliche Bezeichnung von Werkzeugen. **Keine Logos**, keine Verwendung, die eine Billigung nahelegt. Hinweis in `README.md`.
- **ISO** und **ISO 19650**: Die Norm ist urheberrechtlich geschützt. Das Projekt enthält keine Normtexte, nur eigene kurze Erklärungen und Themenverweise (`verified: false`, bis geprüft). Deutsche Begriffe (z. B. AIA, BAP) nach aktueller DIN EN ISO 19650 prüfen.
- **RIBA Plan of Work**: Dessen Phasenbezeichnungen und Grafiken werden nicht benutzt; Phasen sind nur nummeriert (0 bis 7) und eigen betitelt.
- Fiktive Namen und Orte; keine echten Firmen, Behörden oder Personen als Figuren.

## 4. Regeln für neue Dateien
1. **Code** der eigenen Entwicklung: MIT, SPDX-Zeile am Anfang.
2. **Bibliotheken:** nur Lizenzen MIT, BSD, ISC, Apache-2.0, 0BSD (oder gleichwertig freizügig). Kein GPL/AGPL/LGPL-Code, keine Dateien ohne Lizenz. Selbst hosten (kein CDN).
   Ablauf für Aufnahme oder Update einer Bibliothek:
   1. `npm pack <paket>@<version> --ignore-scripts` in einem leeren Ordner; Tarball entpacken.
   2. Gewünschte Datei unverändert nach `web/vendor/<name>/` kopieren, Lizenzdatei daneben legen (fehlt sie im Paket, Lizenztext aus dem Quell-Repository und im Hinweis vermerken).
   3. Gleichheit prüfen (`cmp`) und Version in `THIRD_PARTY_NOTICES.md` eintragen.
   4. `npm run check`.
3. **Schriften:** nur freie Lizenzen (SIL OFL, Apache-2.0), als Dateien im Repo, mit Lizenztext. Keine Google-Fonts-Einbindung per Link (Datenschutz). Aktuell: Systemschriften.
4. **Icons, Bilder, Töne:** eigene Werke oder CC0/MIT/ISC/CC BY mit Nennung; Eintrag in `THIRD_PARTY_NOTICES.md` mit Quelle, Autor, Lizenz, Datum. KI-erzeugte Medien nur mit Freigabe der Projektleitung und Vermerk.
5. **Inhalte:** eigene Formulierungen; keine Abschriften aus Normen, Büchern, Folien oder dem Originalspiel.
6. **Beiträge Dritter:** Mit dem Beitrag stimmen Mitwirkende zu, dass er unter denselben Lizenzen steht (Code MIT, Inhalte CC BY 4.0) und dass sie die Rechte daran haben.

## 5. Dienste Dritter
- **GitHub Pages / Actions:** Nutzungsbedingungen von GitHub gelten. Die Seite ist öffentlich.
- **Supabase** (optional): Nutzungsbedingungen und Datenverarbeitungsvertrag von Supabase; Gratis-Tarif ohne Gewähr (Pausierung nach Inaktivität).
- Datenschutz: `PRIVACY_AND_SECURITY.md`.

## 6. Offene Punkte
1. **Rechte der Hochschule:** Prüfen, ob die Hochschule als Dienstherr Rechte an Software oder Lehrmaterial beansprucht oder eine Freigabe zur Veröffentlichung nötig ist. Vor der ersten öffentlichen Nutzung klären.
2. **Autoren des Originals** informieren; ggf. schriftliche Zustimmung, falls später doch Material übernommen werden soll.
3. **Lizenzwahl bestätigen:** MIT und CC BY 4.0 sind Vorschläge; ein Wechsel (z. B. CC BY-NC-SA für Inhalte) ist vor Veröffentlichung leicht, danach für bereits weitergegebene Fassungen nicht mehr widerrufbar.
4. **Normverweise** und deutsche Begriffe gegen die aktuelle Ausgabe prüfen (M8).
5. Prüfen, ob die Bündel `supabase.js` weitere eingebettete Pakete mit eigenen Hinweispflichten enthält (siehe `THIRD_PARTY_NOTICES.md`).
