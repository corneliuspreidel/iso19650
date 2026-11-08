# 0004 Kein Build-Schritt, Bibliotheken lokal
Status: angenommen

**Kontext:** Das Projekt soll mit KI-Unterstützung schnell änderbar, nachvollziehbar und ohne Werkzeugkette lauffähig sein; Lizenzen und Datenschutz müssen eindeutig sein.
**Entscheidung:** ES-Module direkt im Browser, Preact + htm statt JSX, fremde Bibliotheken unverändert in `web/vendor/` mit Lizenztext; `package.json` enthält nur Entwicklungswerkzeuge (ajv). Kein CDN.
**Folgen:** Weniger Fehlerquellen, keine Übersetzung nötig, Dateien sind das Produkt. Größere Bibliotheken (supabase.js ca. 220 KB) werden unverändert ausgeliefert. Typprüfung nur über JSDoc und Tests.
