// SPDX-License-Identifier: MIT
// Offline-Transport für Entwicklung und Tests: mehrere Browser-Tabs derselben Herkunft
// sprechen über BroadcastChannel miteinander. Kein Dienst, kein Konto nötig.

export function createLocalTransport({ name }) {
  const channel = new BroadcastChannel(name);
  const handlers = new Set();
  channel.onmessage = (event) => {
    for (const handler of handlers) handler(event.data);
  };
  return {
    kind: 'local',
    send(message) {
      channel.postMessage(message);
    },
    onMessage(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    close() {
      handlers.clear();
      channel.close();
    },
  };
}
