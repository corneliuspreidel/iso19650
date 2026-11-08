# 0002 Echtzeit über Supabase Broadcast hinter einer Transport-Schnittstelle
Status: angenommen, noch nicht gegen ein echtes Projekt getestet

**Kontext:** GitHub Pages kann keine Verbindungen halten. Gebraucht wird ein Kanal ohne eigenen Servercode, im Gratis-Tarif, mit EU-Region.
**Entscheidung:** Supabase Realtime Broadcast (Gratis: 200 gleichzeitige Verbindungen, 100 Nachrichten/s). Der Code spricht nur die Transport-Schnittstelle (`send`, `onMessage`, `close`); `local` (BroadcastChannel) dient Entwicklung und Tests.
**Folgen:** Austauschbar (z. B. Cloudflare Durable Objects, eigener WebSocket-Server). Gratis-Projekte pausieren nach 7 Tagen Inaktivität. Datenschutz siehe `PRIVACY_AND_SECURITY.md`.
**Abgelehnt:** Liveblocks (Gratis-Tarif nur nicht-kommerziell/persönlich, mit Badge, 10 Verbindungen je Raum); reines Peer-to-Peer (WebRTC wird in Uni-WLANs oft blockiert); tldraw (kommerzielle Lizenz, Whiteboard statt festem Brett).
