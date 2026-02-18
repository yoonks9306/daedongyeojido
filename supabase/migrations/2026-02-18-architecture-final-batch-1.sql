-- Architecture Final Batch 1
-- Covers: user_profiles, revisions, reports, media uploads metadata, site settings, wiki FTS base
-- Safe to re-run (idempotent patterns where practical)

create extension if not exists pg_trgm;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  trust_score integer not null default 0,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  banned_until timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.update_updated_at();

create table if not exists public.wiki_revisions (
  id bigint generated always as identity primary key,
  article_id bigint not null references public.wiki_articles(id) on delete cascade,
  revision_number integer not null,
  content text not null,
  content_hash text not null,
  summary text,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  status text not null default 'pending' check (status in ('active', 'pending', 'hidden', 'deleted')),
  created_at timestamptz not null default now(),
  unique (article_id, revision_number)
);

create index if not exists wiki_revisions_article_idx on public.wiki_revisions(article_id, revision_number desc);
create index if not exists wiki_revisions_status_idx on public.wiki_revisions(status, created_at desc);
create index if not exists wiki_revisions_author_idx on public.wiki_revisions(author_id, created_at desc);

create table if not exists public.revision_votes (
  id bigint generated always as identity primary key,
  revision_id bigint not null references public.wiki_revisions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote smallint not null check (vote in (1, -1)),
  created_at timestamptz not null default now(),
  unique (revision_id, user_id)
);

create index if not exists revision_votes_revision_idx on public.revision_votes(revision_id);

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('article', 'revision', 'post', 'comment', 'user')),
  target_id bigint not null,
  reason text not null check (reason in ('spam', 'vandalism', 'inappropriate', 'misinformation', 'other')),
  detail text,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists reports_updated_at on public.reports;
create trigger reports_updated_at
before update on public.reports
for each row execute function public.update_updated_at();

create index if not exists reports_target_idx on public.reports(target_type, target_id);
create index if not exists reports_status_idx on public.reports(status, created_at desc);

create table if not exists public.media_uploads (
  id bigint generated always as identity primary key,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  path text not null unique,
  mime text not null,
  size_bytes integer not null check (size_bytes > 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  status text not null default 'active' check (status in ('active', 'removed', 'blocked')),
  created_at timestamptz not null default now()
);

create index if not exists media_uploads_uploader_idx on public.media_uploads(uploader_id, created_at desc);
create index if not exists media_uploads_status_idx on public.media_uploads(status, created_at desc);

create table if not exists public.site_settings (
  id boolean primary key default true,
  emergency_lock boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, emergency_lock)
values (true, false)
on conflict (id) do nothing;

alter table public.wiki_articles add column if not exists search_vector tsvector;

create or replace function public.wiki_articles_search_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(regexp_replace(new.content, '<[^>]+>', ' ', 'g'), '')), 'D') ||
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.summary, '')), 'B');
  return new;
end;
$$;

drop trigger if exists wiki_articles_search_trigger on public.wiki_articles;
create trigger wiki_articles_search_trigger
before insert or update of title, summary, content
on public.wiki_articles
for each row execute function public.wiki_articles_search_update();

create index if not exists wiki_articles_search_idx on public.wiki_articles using gin(search_vector);
create index if not exists wiki_articles_title_trgm_idx on public.wiki_articles using gin(title gin_trgm_ops);

update public.wiki_articles
set title = title
where search_vector is null;

alter table public.user_profiles enable row level security;
alter table public.wiki_revisions enable row level security;
alter table public.revision_votes enable row level security;
alter table public.reports enable row level security;
alter table public.media_uploads enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists user_profiles_public_read on public.user_profiles;
create policy user_profiles_public_read
on public.user_profiles for select
using (true);

drop policy if exists user_profiles_own_insert on public.user_profiles;
create policy user_profiles_own_insert
on public.user_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists user_profiles_own_update on public.user_profiles;
create policy user_profiles_own_update
on public.user_profiles for update
using (auth.uid() = user_id);

drop policy if exists wiki_revisions_public_active_read on public.wiki_revisions;
create policy wiki_revisions_public_active_read
on public.wiki_revisions for select
using (
  status = 'active'
  or (
    status = 'pending' and (
      auth.uid() = author_id
      or exists (
        select 1 from public.user_profiles up
        where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
      )
    )
  )
);

drop policy if exists wiki_revisions_auth_insert on public.wiki_revisions;
create policy wiki_revisions_auth_insert
on public.wiki_revisions for insert
with check (auth.uid() is not null and auth.uid() = author_id);

drop policy if exists wiki_revisions_staff_update on public.wiki_revisions;
create policy wiki_revisions_staff_update
on public.wiki_revisions for update
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists revision_votes_public_read on public.revision_votes;
create policy revision_votes_public_read
on public.revision_votes for select
using (true);

drop policy if exists revision_votes_own_insert on public.revision_votes;
create policy revision_votes_own_insert
on public.revision_votes for insert
with check (auth.uid() = user_id);

drop policy if exists revision_votes_own_delete on public.revision_votes;
create policy revision_votes_own_delete
on public.revision_votes for delete
using (auth.uid() = user_id);

drop policy if exists reports_auth_insert on public.reports;
create policy reports_auth_insert
on public.reports for insert
with check (auth.uid() = reporter_id);

drop policy if exists reports_view_own_or_staff on public.reports;
create policy reports_view_own_or_staff
on public.reports for select
using (
  auth.uid() = reporter_id
  or exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists reports_staff_update on public.reports;
create policy reports_staff_update
on public.reports for update
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists media_uploads_owner_or_staff_read on public.media_uploads;
create policy media_uploads_owner_or_staff_read
on public.media_uploads for select
using (
  auth.uid() = uploader_id
  or exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists media_uploads_owner_insert on public.media_uploads;
create policy media_uploads_owner_insert
on public.media_uploads for insert
with check (auth.uid() = uploader_id);

drop policy if exists media_uploads_owner_or_staff_update on public.media_uploads;
create policy media_uploads_owner_or_staff_update
on public.media_uploads for update
using (
  auth.uid() = uploader_id
  or exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists site_settings_staff_read on public.site_settings;
create policy site_settings_staff_read
on public.site_settings for select
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_admin_update
on public.site_settings for update
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role = 'admin'
  )
);
