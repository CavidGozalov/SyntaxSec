-- =====================================================================
--  SyntaxSec — Supabase setup
--  Paste this whole file into Supabase Dashboard → SQL Editor → Run.
--  It is safe to run more than once.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILES  (one row per auth user; role is 'user' unless promoted)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text not null,
  email      text not null,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

-- Is the current user an admin?  (SECURITY DEFINER avoids recursive RLS checks.)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Lets the register form check a username without exposing the profiles table.
create or replace function public.username_available(p_username text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(trim(p_username)));
$$;
grant execute on function public.username_available(text) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- Create the profile automatically when someone registers.
-- The username comes from supabase.auth.signUp({ options: { data: { username } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_username text;
begin
  v_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  if v_username is null then
    v_username := split_part(new.email, '@', 1);
  end if;
  v_username := left(v_username, 24);
  if exists (select 1 from public.profiles where lower(username) = lower(v_username)) then
    v_username := left(v_username, 19) || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;
  insert into public.profiles (id, username, email)
  values (new.id, v_username, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profiles for accounts that already existed before this script was run.
do $$
declare
  u record;
  v_username text;
begin
  for u in select id, email, raw_user_meta_data from auth.users where id not in (select id from public.profiles) loop
    v_username := left(coalesce(nullif(trim(u.raw_user_meta_data ->> 'username'), ''), split_part(u.email, '@', 1)), 24);
    if exists (select 1 from public.profiles where lower(username) = lower(v_username)) then
      v_username := left(v_username, 19) || '_' || substr(replace(u.id::text, '-', ''), 1, 4);
    end if;
    insert into public.profiles (id, username, email) values (u.id, v_username, u.email);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- 2. TOPICS  (bilingual; "track" places a topic in a learning roadmap)
-- ---------------------------------------------------------------------
create table if not exists public.topics (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name_en        text not null default '',
  name_az        text not null default '',
  description_en text not null default '',
  description_az text not null default '',
  icon           text not null default '📘',
  track          text check (track in ('digital-hygiene', 'web-security', 'network-defense')),
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. TERMS  (short summary + full deep-dive content, in both languages)
-- ---------------------------------------------------------------------
create table if not exists public.terms (
  id         uuid primary key default gen_random_uuid(),
  topic_id   uuid not null references public.topics (id) on delete cascade,
  slug       text not null unique,
  term_en    text not null default '',
  term_az    text not null default '',
  summary_en text not null default '',
  summary_az text not null default '',
  content_en text not null default '',
  content_az text not null default '',
  example_en text not null default '',
  example_az text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists terms_topic_id_idx on public.terms (topic_id);

-- ---------------------------------------------------------------------
-- 4. BLOGS  (bilingual posts)
-- ---------------------------------------------------------------------
create table if not exists public.blogs (
  id         uuid primary key default gen_random_uuid(),
  title_en   text not null default '',
  title_az   text not null default '',
  tag_en     text not null default '',
  tag_az     text not null default '',
  summary_en text not null default '',
  summary_az text not null default '',
  content_en text not null default '',
  content_az text not null default '',
  published  boolean not null default true,
  author_id  uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. USER_PROGRESS  (bookmarks + "mastered"; also drives roadmap bars)
-- ---------------------------------------------------------------------
create table if not exists public.user_progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  term_id    uuid not null references public.terms (id) on delete cascade,
  bookmarked boolean not null default false,
  mastered   boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, term_id)
);

-- ---------------------------------------------------------------------
-- 6. BLOG COMMENTS + REACTIONS  (keeps the comment / like features of
--    the old News page, now tied to logged-in accounts)
-- ---------------------------------------------------------------------
create table if not exists public.blog_comments (
  id          uuid primary key default gen_random_uuid(),
  blog_id     uuid not null references public.blogs (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  author_name text not null default 'user',
  content     text not null check (char_length(content) between 1 and 2000),
  created_at  timestamptz not null default now()
);
create index if not exists blog_comments_blog_id_idx on public.blog_comments (blog_id);

create table if not exists public.blog_reactions (
  blog_id uuid not null references public.blogs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  value   smallint not null check (value in (-1, 1)),
  primary key (blog_id, user_id)
);

-- The comment author is always the logged-in user; the name is copied from profiles.
create or replace function public.set_comment_author()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  new.user_id := auth.uid();
  select username into new.author_name from public.profiles where id = new.user_id;
  new.author_name := coalesce(new.author_name, 'user');
  return new;
end;
$$;
drop trigger if exists blog_comments_set_author on public.blog_comments;
create trigger blog_comments_set_author
  before insert on public.blog_comments
  for each row execute function public.set_comment_author();

-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.topics         enable row level security;
alter table public.terms          enable row level security;
alter table public.blogs          enable row level security;
alter table public.user_progress  enable row level security;
alter table public.blog_comments  enable row level security;
alter table public.blog_reactions enable row level security;

-- profiles: you see your own row, the admin sees all. Nobody can change a
-- role from the browser: only the "username" column is updatable.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (username) on public.profiles to authenticated;

-- topics: everyone can read, only the admin can write.
drop policy if exists "topics_read_all" on public.topics;
create policy "topics_read_all" on public.topics
  for select to anon, authenticated using (true);
drop policy if exists "topics_admin_write" on public.topics;
create policy "topics_admin_write" on public.topics
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- terms: everyone can read, only the admin can write.
drop policy if exists "terms_read_all" on public.terms;
create policy "terms_read_all" on public.terms
  for select to anon, authenticated using (true);
drop policy if exists "terms_admin_write" on public.terms;
create policy "terms_admin_write" on public.terms
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- blogs: published posts are readable by everyone; drafts only by the admin.
drop policy if exists "blogs_read_published" on public.blogs;
create policy "blogs_read_published" on public.blogs
  for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "blogs_admin_write" on public.blogs;
create policy "blogs_admin_write" on public.blogs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- user_progress: each user reads and writes only their own rows.
drop policy if exists "progress_own_rows" on public.user_progress;
create policy "progress_own_rows" on public.user_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- blog_comments: logged-in users read all, add their own, delete their own (admin: any).
drop policy if exists "comments_read" on public.blog_comments;
create policy "comments_read" on public.blog_comments
  for select to authenticated using (true);
drop policy if exists "comments_insert_own" on public.blog_comments;
create policy "comments_insert_own" on public.blog_comments
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "comments_delete_own_or_admin" on public.blog_comments;
create policy "comments_delete_own_or_admin" on public.blog_comments
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- blog_reactions: logged-in users read all (for the counters) and manage their own.
drop policy if exists "reactions_read" on public.blog_reactions;
create policy "reactions_read" on public.blog_reactions
  for select to authenticated using (true);
drop policy if exists "reactions_own_rows" on public.blog_reactions;
create policy "reactions_own_rows" on public.blog_reactions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 8. MAKE YOURSELF THE ADMIN
--    Register on the site first, then run this ONE line with your email.
-- ---------------------------------------------------------------------
-- update public.profiles set role = 'admin' where email = 'YOUR_EMAIL_HERE';

-- Check who is admin:
-- select username, email, role from public.profiles order by created_at;

-- ---------------------------------------------------------------------
-- 9. OPTIONAL — copy posts from the old "articles" table into "blogs"
-- ---------------------------------------------------------------------
-- insert into public.blogs (title_en, tag_en, summary_en, content_en, created_at)
-- select title, coalesce(tag, 'General'), left(content, 180), content, created_at
-- from public.articles;
