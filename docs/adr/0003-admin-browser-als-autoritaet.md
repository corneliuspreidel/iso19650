# 0003 Admin-Browser als Autorität
Status: angenommen

**Kontext:** Ohne Server muss irgendwer Regeln durchsetzen und den Stand halten.
**Entscheidung:** Der Browser der Spielleitung hält den Spielstand und wendet `engine.reduce` an. Spieler senden Absichten; der Admin prüft und verteilt den Stand.
**Folgen:** Kein Servercode. Fällt der Admin-Browser aus, steht das Spiel; Gegenmaßnahmen: Speichern in `localStorage`, Export/Import, Hinweis „Spielleitung offline“. Schummeln ist über gefälschte Nachrichten möglich; Gegenmaßnahme später: Signatur (`PRIVACY_AND_SECURITY.md`).
**Alternativen:** Jeder Client rechnet selbst (Abweichungen, Schummeln); Cloud-Funktionen (Servercode, Betrieb).
