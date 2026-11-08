// SPDX-License-Identifier: MIT
// Startseite und Beitritts-Seite (Hash-Route #/join/CODE/TEAM). Beitritt ist Meilenstein M2.
import { html, render, useState, useEffect } from './vendor.js';
import { parseJoinHash } from '../engine/index.js';
import { config } from '../config.js';

function useHash() {
  const [hash, setHash] = useState(globalThis.location.hash);
  useEffect(() => {
    const on = () => setHash(globalThis.location.hash);
    globalThis.addEventListener('hashchange', on);
    return () => globalThis.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function useScenarioMeta() {
  const [meta, setMeta] = useState(null);
  useEffect(() => {
    fetch(config.scenarioUrl).then((r) => r.json()).then((s) => setMeta(s.meta)).catch(() => setMeta(null));
  }, []);
  return meta;
}

function Join({ code, team }) {
  return html`
    <h1>Team ${team}</h1>
    <p class="lead">Sitzung <span class="code">${code}</span></p>
    <div class="card">
      <p>Hier trittst du dem Spiel bei: Spitzname eingeben, Rolle wird automatisch zugeteilt.</p>
      <p class="note warn">Der Beitritt ist noch nicht gebaut (Meilenstein M2, siehe docs/ROADMAP.md).</p>
    </div>`;
}

function Home({ meta }) {
  return html`
    <h1>${meta ? meta.title : 'ISO-19650-Planspiel'}</h1>
    <p class="lead">${meta ? meta.subtitle : 'Wird geladen …'}</p>
    <div class="card">
      <p><strong>Spieler:</strong> Öffne den Link oder QR-Code deines Teams, den die Spielleitung verteilt.</p>
      <p><strong>Spielleitung:</strong> <a href="./admin/">Neue Sitzung anlegen</a></p>
    </div>
    <p class="note">Entwurfsstand. Quelltext und Lizenz: <a href="https://github.com/corneliuspreidel/iso19650">GitHub</a>.</p>`;
}

function App() {
  const hash = useHash();
  const meta = useScenarioMeta();
  const join = parseJoinHash(hash);
  return join ? html`<${Join} code=${join.code} team=${join.team} />` : html`<${Home} meta=${meta} />`;
}

render(html`<${App} />`, document.getElementById('app'));
