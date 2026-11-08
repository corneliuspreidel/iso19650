// SPDX-License-Identifier: MIT
// Transport-Schnittstelle. Die Spiellogik kennt nur diese Funktionen, nie Supabase direkt.
//
//   transport.send(message)        -> sendet ein JSON-serialisierbares Objekt an alle anderen
//   transport.onMessage(handler)   -> handler(message) für jede eingehende Nachricht; gibt Abmeldefunktion zurück
//   transport.close()              -> Verbindung beenden
//
// Nachrichtenformat und Kanäle: siehe docs/ARCHITECTURE.md.

import { createLocalTransport } from './local.js';
import { createSupabaseTransport } from './supabase.js';

export const PROTOCOL_VERSION = 1;

/** Kanalname je Sitzung und Zweck, z. B. "iso19650:KXQF:team:3". */
export function channelName(code, scope, team) {
  return scope === 'team' ? `iso19650:${code}:team:${team}` : `iso19650:${code}:${scope}`;
}

/**
 * @param {{kind:'local'|'supabase', name:string, supabase?:{url:string, anonKey:string}}} options
 */
export function createTransport(options) {
  if (options.kind === 'supabase') {
    return createSupabaseTransport({ name: options.name, ...options.supabase });
  }
  return createLocalTransport({ name: options.name });
}
