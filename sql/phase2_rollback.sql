-- Only run this to undo Phase 2. It permanently deletes all daily answers, streaks, inventory, and unlocked titles.
--
-- =====================================================================
--  SyntaxSec — Phase 2 rollback
--  Paste this whole file into Supabase Dashboard → SQL Editor → Run.
--  Reverses exactly what sql/phase2_daily_progression.sql added:
--    1. drops the Phase 2 functions,
--    2. drops the profiles.selected_title_id column,
--    3. drops the Phase 2 tables (with their policies, indexes and data).
--  Phase 1 objects (profiles, avatar_key, their policies and grants) are
--  not touched; Phase 1 has its own rollback script.
--  It is safe to run more than once, and safe to run if the upgrade was
--  only partly applied.
-- =====================================================================

begin;

-- 1. Functions: public API first, then the internal helpers.
drop function if exists public.set_selected_title(integer);
drop function if exists public.restore_streak(date);
drop function if exists public.get_daily_progress();
drop function if exists public.get_daily_archive();
drop function if exists public.submit_past_answer(date, integer);
drop function if exists public.get_past_question(date);
drop function if exists public.submit_daily_answer(integer, integer);
drop function if exists public.get_daily_question();

drop function if exists public.daily_submit(date, integer, boolean);
drop function if exists public.daily_progress(uuid);
drop function if exists public.daily_grant_item(uuid, date, text, text, text);
drop function if exists public.daily_roll_item(text, text);
drop function if exists public.daily_unlock_titles(uuid);
drop function if exists public.daily_sync_streak(uuid);
drop function if exists public.daily_streak_calc(uuid, date);
drop function if exists public.daily_day_done(uuid, date);
drop function if exists public.daily_question_payload(uuid, date);
drop function if exists public.daily_ensure_question(date);
drop function if exists public.daily_today();

-- 2. The column on profiles (this also drops its foreign key to titles).
alter table if exists public.profiles drop column if exists selected_title_id;

-- 3. Tables, children before parents so every foreign key is respected.
drop table if exists public.user_titles;
drop table if exists public.user_inventory;
drop table if exists public.streak_restores;
drop table if exists public.user_streaks;
drop table if exists public.daily_answers;
drop table if exists public.daily_questions;
drop table if exists public.questions;
drop table if exists public.titles;
drop table if exists public.reward_items;
drop table if exists public.progression_settings;
drop table if exists public.reward_rarity_weights;

commit;

-- Ask the API layer to forget the dropped objects immediately.
notify pgrst, 'reload schema';
