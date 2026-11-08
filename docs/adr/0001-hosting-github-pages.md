# 0001 Hosting auf GitHub Pages mit Actions
Status: angenommen (2026-11-08)

**Kontext:** Das Spiel soll mit minimalem Betriebsaufwand laufen. Eine Veröffentlichung aus dem Ordner `web/` hält Doku, Tests und Skripte vom öffentlichen Auftritt getrennt.
**Entscheidung:** GitHub Pages, Quelle „GitHub Actions“. Der Workflow `pages.yml` führt `npm run check` aus und veröffentlicht `web/`.
**Folgen:** Nur statische Dateien, keine Servercode. Echtzeit braucht einen Zusatzdienst (0002). Das Repo ist öffentlich; alles darin ist einsehbar. Seiten werden unter `/iso19650/` ausgeliefert: nur relative Pfade verwenden.
**Alternativen:** Ordner `/docs` oder Wurzel als Quelle (vermischt Doku und Seite); eigener Server (Betriebsaufwand).
