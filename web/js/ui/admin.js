// SPDX-License-Identifier: MIT
// Spielleitung: Sitzung anlegen, Team-Links und QR-Codes erzeugen.
// Spielstand-Verwaltung folgt in Meilenstein M3 (docs/ROADMAP.md).
import { html, render, useState } from './vendor.js';
import { cryptoRandom, makeSessionCode, teamUrl, beamerUrl, clampTeamSize } from '../engine/index.js';
import { qrSvg } from './qr.js';
import { siteBase, safeStorage } from './site.js';

const STORAGE_KEY = 'iso19650.admin.lastSetup';

function Team({ number, url }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* Kopieren nicht erlaubt */ }
  };
  return html`
    <div class="card team">
      <strong>Team ${number}</strong>
      <div class="qr" aria-label=${`QR-Code für Team ${number}`} dangerouslySetInnerHTML=${{ __html: qrSvg(url) }}></div>
      <code>${url}</code>
      <button class="secondary no-print" onClick=${copy}>${copied ? 'Kopiert' : 'Link kopieren'}</button>
    </div>`;
}

function App() {
  const saved = safeStorage.get(STORAGE_KEY) ?? {};
  const [teams, setTeams] = useState(saved.teams ?? 5);
  const [size, setSize] = useState(saved.size ?? 6);
  const [duration, setDuration] = useState(saved.duration ?? 90);
  const [session, setSession] = useState(null);

  const create = (event) => {
    event.preventDefault();
    const setup = { teams: Math.min(12, Math.max(1, Number(teams) || 1)), size: clampTeamSize(size), duration: Number(duration) };
    safeStorage.set(STORAGE_KEY, setup);
    setSession({ ...setup, code: makeSessionCode(cryptoRandom), createdAt: new Date().toISOString() });
  };

  const base = siteBase();
  return html`
    <h1>Sitzung anlegen</h1>
    <p class="lead">Teams und Teamgröße festlegen, Links verteilen. Die Rollen werden beim Beitritt automatisch vergeben.</p>
    <form class="card row" onSubmit=${create}>
      <label>Teams (1 bis 12)
        <input type="number" min="1" max="12" value=${teams} onInput=${(e) => setTeams(e.target.value)} />
      </label>
      <label>Teamgröße (3 bis 8)
        <input type="number" min="3" max="8" value=${size} onInput=${(e) => setSize(e.target.value)} />
      </label>
      <label>Dauer
        <select value=${duration} onChange=${(e) => setDuration(e.target.value)}>
          <option value="45">45 Minuten</option>
          <option value="90">90 Minuten</option>
          <option value="120">120 Minuten</option>
        </select>
      </label>
      <button type="submit">Sitzung anlegen</button>
    </form>
    ${session && html`
      <h2>Sitzung <span class="code">${session.code}</span></h2>
      <p class="note">${session.teams} Teams, je ${session.size} Rollen, ${session.duration} Minuten.
        Beamer-Seite: <a href=${beamerUrl(base, session.code)}>${beamerUrl(base, session.code)}</a></p>
      <p class="note warn">Hinweis: Die Spielsteuerung ist noch nicht gebaut (M3). Diese Seite erzeugt bisher nur Code und Links.</p>
      <div class="grid">
        ${Array.from({ length: session.teams }, (_, i) => html`<${Team} key=${i} number=${i + 1} url=${teamUrl(base, session.code, i + 1)} />`)}
      </div>
      <p class="no-print"><button onClick=${() => globalThis.print()}>Links drucken</button></p>`}
    <p class="note"><a href="../">Zur Startseite</a></p>`;
}

render(html`<${App} />`, document.getElementById('app'));
