# Datenschutz und Sicherheit

Stand 2026-11-08. Entwurf für die Abstimmung mit dem Datenschutz der Hochschule; keine Rechtsberatung.

## 1. Grundsatz: so wenig Daten wie möglich
- Kein Login, keine Konten, keine Cookies, keine Analyse- oder Werbe-Skripte, keine Schriften oder Skripte von fremden Servern (alles liegt im Repo).
- Spieler geben nur einen **Spitznamen** ein (Hinweis: keinen Klarnamen verwenden).
- Der Spielstand liegt im Browser der Spielleitung (`localStorage`) und flüchtig in den Nachrichten; es gibt keine Datenbank.
- Der Export der Auswertung (M6) enthält Spitznamen, Rollen und Spielaktionen, aber keine Geräte- oder Personendaten. Exporte nicht öffentlich ablegen (`exports/` ist in `.gitignore`).

## 2. Welche Daten wo anfallen
| Dienst | Was | Hinweis |
|---|---|---|
| GitHub Pages (GitHub/Microsoft) | beim Aufruf der Seite IP-Adresse und technische Zugriffsdaten (Server-Protokolle) | nicht beeinflussbar; in der Datenschutzinformation nennen |
| Supabase Realtime (optional, Region Frankfurt) | Spielnachrichten (Spitzname, Rolle, Aktionen), IP-Adressen der Verbindungen | Nachrichten werden nicht gespeichert; Auftragsverarbeitung prüfen |
| Browser des Spielers | Gerätetoken und Rolle in `localStorage` | nur für Wiedereintritt; löschbar |
| Browser der Spielleitung | Spielstand in `localStorage`, Export als Datei | Rechner der Spielleitung |

## 3. Entwurf eines Hinweistextes (vor Einsatz mit der Hochschule abstimmen)
> Für dieses Planspiel wird kein Konto benötigt. Bitte gib nur einen Spitznamen ein, keinen Klarnamen. Beim Aufruf der Seite verarbeitet GitHub technische Zugriffsdaten (z. B. die IP-Adresse). Während des Spiels werden deine Eingaben (Spitzname, Rolle, Spielaktionen) über einen Echtzeitdienst (Supabase, Rechenzentrum in Frankfurt) an die anderen Teilnehmenden und die Spielleitung übertragen und nicht dauerhaft gespeichert. Die Spielleitung kann die Ergebnisse ohne Klarnamen als Datei sichern. Die Teilnahme ist freiwillig; eine Alternative ohne Digitaltool ist [einzutragen]. Verantwortlich: [einzutragen].

Der Text gehört auf die Startseite oder auf die Beitrittsseite (Umsetzung in M8).

## 4. Bedrohungen und Gegenmaßnahmen
| Risiko | Wirkung | Maßnahme |
|---|---|---|
| Fremde kennen Kanalnamen (Sitzungscode ist kurz, 4 Zeichen) | Mitlesen oder Senden in eine fremde Sitzung | Kanalname enthält Code + Sitzungsgeheimnis (zufällige Zeichenkette, mindestens 8 weitere Zeichen) aus dem Team-Link; ab M5 umsetzen. Bis dahin: nur Testbetrieb |
| Spieler fälscht Spielleiter-Nachrichten (`state`, `event`) | Schummeln, Chaos | Kurzfristig: Spieler ignorieren `state` von anderen Spielern, Admin kennzeichnet sich im `welcome`. Mittelfristig: Admin signiert Nachrichten mit ECDSA (Web Crypto), der öffentliche Schlüssel steckt im Team-Link; Clients prüfen die Signatur (`adr` folgt) |
| Geheime Rollenziele sind im Kanal sichtbar | Wer die Entwicklerwerkzeuge liest, sieht fremde Ziele | Akzeptiert für das Lehrspiel; Ziele erst bei Bedarf senden und nur an die Rolle adressieren |
| Spielleitung-Browser schließt sich | Spiel steht | Stand in `localStorage`, Export; „Spielleitung offline“-Hinweis |
| Nachrichtenflut | Gratis-Limit (100/s), Ausfall | Rate-Limit im Transport, Zeiger-Updates drosseln, Nachrichten klein halten |
| Fremde Inhalte im Spielstand (Spitznamen) | Skript-Einschleusung (XSS) | Texte nie als HTML einfügen (`dangerouslySetInnerHTML` nur für selbst erzeugte QR-SVG), Spitzname auf 24 Zeichen kürzen, Steuerzeichen entfernen |
| Schlüssel im Repo | Missbrauch des Dienstes | nur `anon key`; `service_role` nie committen; Secret-Scanning von GitHub aktiv lassen |

## 5. Für Mitwirkende
Siehe `AGENTS.md`, Leitplanken 6 und 8. Bei Änderungen an Nachrichten oder Speicherung diese Datei mit aktualisieren.
