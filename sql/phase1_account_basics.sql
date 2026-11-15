-- =====================================================================
--  SyntaxSec — Phase 1: account basics (profile avatars)
--  Paste this whole file into Supabase Dashboard → SQL Editor → Run.
--  Run it AFTER supabase-setup.sql. It is safe to run more than once.
--
--  What it does:
--    1. Adds profiles.avatar_key (nullable text) — the chosen preset avatar.
--    2. Adds a check so avatar_key is NULL or one of the preset keys.
--    3. Lets a logged-in user update avatar_key as well as username on
--       their OWN row. role, email and id stay read-only from the browser.
--
--  The existing RLS policies (profiles_select_own_or_admin and
--  profiles_update_own) are not changed.
--
--  Note: supabase-setup.sql resets the grant to "update (username)". If you
--  ever re-run supabase-setup.sql, run this file again afterwards.
--
--  To undo this script, run sql/phase1_rollback.sql.
-- =====================================================================

begin;

-- 1. The column. NULL means "show the user's initial".
alter table public.profiles add column if not exists avatar_key text;

-- 2. Allowed values. Keep this list identical to SS.AVATAR_KEYS in js/auth.js
--    (each key is also a file: assets/avatars/<key>.svg).
alter table public.profiles drop constraint if exists profiles_avatar_key_check;
alter table public.profiles add constraint profiles_avatar_key_check check (
  avatar_key is null or avatar_key in (
    'shield', 'lock', 'key', 'terminal', 'fingerprint', 'robot',
    'bug', 'eye', 'firewall', 'chip', 'radar', 'wifi'
  )
);

-- 3. Column-level update grant: username and avatar_key only.
--    Revoking UPDATE on the table also clears every column-level UPDATE
--    grant, so the result is exactly the list below however often this runs.
revoke update on public.profiles from anon, authenticated;
grant update (username, avatar_key) on public.profiles to authenticated;

-- Row level security stays on; the update policy still limits users to their own row.
alter table public.profiles enable row level security;

commit;

-- Ask the API layer to pick up the new column immediately.
notify pgrst, 'reload schema';

-- Check the result (optional):
-- select column_name, privilege_type from information_schema.column_privileges
--   where table_schema = 'public' and table_name = 'profiles' and grantee = 'authenticated'
--   order by privilege_type, column_name;
