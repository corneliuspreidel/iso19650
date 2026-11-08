// SPDX-License-Identifier: MIT
// Beamer-Ansicht (Rangliste, Timer, Ereignisse). Platzhalter bis Meilenstein M4.
import { html, render } from './vendor.js';
import { isValidSessionCode } from '../engine/index.js';

const code = (globalThis.location.hash.match(/^#\/([A-Z0-9]{4})$/) ?? [])[1];

render(html`
  <h1>Beamer</h1>
  <p class="lead">${code && isValidSessionCode(code) ? html`Sitzung <span class="code">${code}</span>` : 'Keine gültige Sitzung in der Adresse.'}</p>
  <div class="card"><p class="note warn">Rangliste, Timer und Ereignisse folgen in Meilenstein M4 (docs/ROADMAP.md).</p></div>`,
  document.getElementById('app'));
