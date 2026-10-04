// Supabase quraşdırma və bağlantı faylı
const SUPABASE_URL = "https://rfyuigfsuzlgbmamzpzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmeXVpZ2ZzdXpsZ2JtYW16cHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNTkzNzcsImV4cCI6MjEwNjYzNTM3N30.VBj1CatdkBxW4DrKsC2ZZE2cYmVaKMdK16q8nJpJdzU";

// Supabaseclient-in yaradılması
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);