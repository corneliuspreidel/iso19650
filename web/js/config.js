// SPDX-License-Identifier: MIT
// Laufzeit-Konfiguration. Hier dürfen nur öffentliche Werte stehen.
// Supabase: Projekt-URL und "anon key" (öffentlich vorgesehen). NIE den service_role key eintragen.
export const config = {
  transport: 'local', // 'local' (Tabs derselben Herkunft) oder 'supabase'
  supabaseUrl: '',
  supabaseAnonKey: '',
  scenarioUrl: './content/kita/scenario.json',
};
