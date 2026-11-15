-- Only run this to undo Phase 1. It deletes the avatar_key data.
--
-- =====================================================================
--  SyntaxSec — Phase 1 rollback
--  Paste this whole file into Supabase Dashboard → SQL Editor → Run.
--  Reverses exactly what sql/phase1_account_basics.sql added:
--    1. drops the profiles_avatar_key_check constraint,
--    2. drops the profiles.avatar_key column (and every saved avatar choice),
--    3. restores the original grant: update (username) only.
--  It is safe to run more than once, and safe to run if the upgrade was
--  only partly applied.
-- =====================================================================

begin;

alter table if exists public.profiles drop constraint if exists profiles_avatar_key_check;
alter table if exists public.profiles drop column if exists avatar_key;

-- Back to the grant from supabase-setup.sql.
revoke update on public.profiles from anon, authenticated;
grant update (username) on public.profiles to authenticated;

commit;

-- Ask the API layer to forget the dropped column immediately.
notify pgrst, 'reload schema';
