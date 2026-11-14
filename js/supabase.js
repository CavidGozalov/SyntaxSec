/* SyntaxSec — Supabase client.
   The anon key is safe to ship in the browser: every table is protected by
   Row Level Security (see supabase-setup.sql). */
var SUPABASE_URL = "https://rfyuigfsuzlgbmamzpzt.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmeXVpZ2ZzdXpsZ2JtYW16cHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNTkzNzcsImV4cCI6MjEwNjYzNTM3N30.VBj1CatdkBxW4DrKsC2ZZE2cYmVaKMdK16q8nJpJdzU";

var _supabase = null;
try {
  if (window.supabase && typeof window.supabase.createClient === "function") {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  } else {
    console.warn("[SyntaxSec] Supabase library did not load; running in offline mode.");
  }
} catch (err) {
  console.error("[SyntaxSec] Could not create the Supabase client:", err);
}
window._supabase = _supabase;
