// SPDX-License-Identifier: MIT
// Transport über Supabase Realtime (Broadcast). Noch NICHT gegen ein echtes Projekt getestet.
// Erwartet, dass web/vendor/supabase-js/supabase.js vorher per <script> geladen wurde
// (stellt die globale Variable `supabase` bereit).
//
// Der "anon key" ist für den Einsatz im Browser gedacht und darf im Repo stehen.
// Der "service_role key" darf NIE in dieses Repo.

const EVENT = 'msg';

export function createSupabaseTransport({ name, url, anonKey }) {
  const lib = globalThis.supabase;
  if (!lib || typeof lib.createClient !== 'function') {
    throw new Error('supabase-js ist nicht geladen (web/vendor/supabase-js/supabase.js).');
  }
  if (!url || !anonKey) {
    throw new Error('Supabase-URL und anon key fehlen (web/js/config.js).');
  }
  const client = lib.createClient(url, anonKey, {
    realtime: { params: { eventsPerSecond: 20 } },
  });
  const channel = client.channel(name, { config: { broadcast: { self: false, ack: false } } });
  const handlers = new Set();
  channel.on('broadcast', { event: EVENT }, ({ payload }) => {
    for (const handler of handlers) handler(payload);
  });
  const ready = new Promise((resolve, reject) => {
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') resolve();
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') reject(new Error(`Realtime: ${status}`));
    });
  });
  return {
    kind: 'supabase',
    ready,
    send(message) {
      return channel.send({ type: 'broadcast', event: EVENT, payload: message });
    },
    onMessage(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    close() {
      handlers.clear();
      return client.removeChannel(channel);
    },
  };
}
