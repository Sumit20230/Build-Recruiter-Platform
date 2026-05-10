import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseConfigMessage =
  "Supabase is not configured. Create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.";

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl || "http://127.0.0.1:54321", supabaseAnonKey || "missing-anon-key");
