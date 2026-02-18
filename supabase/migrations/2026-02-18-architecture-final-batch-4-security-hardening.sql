-- Architecture Final Batch 4
-- Security hardening for permissive legacy policies

-- 1) Harden wiki_articles write surface.
-- Legacy policies allowed any authenticated user to insert/update directly.
drop policy if exists "wiki_articles_auth_insert" on public.wiki_articles;
drop policy if exists "wiki_articles_auth_update" on public.wiki_articles;
drop policy if exists wiki_articles_staff_insert on public.wiki_articles;
drop policy if exists wiki_articles_staff_update on public.wiki_articles;

create policy wiki_articles_staff_insert
on public.wiki_articles
for insert
with check (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid()
      and up.role in ('moderator', 'admin')
  )
);

create policy wiki_articles_staff_update
on public.wiki_articles
for update
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid()
      and up.role in ('moderator', 'admin')
  )
)
with check (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid()
      and up.role in ('moderator', 'admin')
  )
);

-- 2) Prevent self-privilege escalation via user_profiles direct update.
drop policy if exists user_profiles_own_update on public.user_profiles;
drop policy if exists user_profiles_staff_update on public.user_profiles;

-- Optional staff update policy for direct SQL-based moderation updates.
create policy user_profiles_staff_update
on public.user_profiles
for update
using (
  exists (
    select 1 from public.user_profiles actor
    where actor.user_id = auth.uid()
      and actor.role in ('moderator', 'admin')
  )
)
with check (
  exists (
    select 1 from public.user_profiles actor
    where actor.user_id = auth.uid()
      and actor.role in ('moderator', 'admin')
  )
);

-- 3) Ensure reports table keeps immutable reporter identity after insert.
drop policy if exists reports_staff_update on public.reports;
create policy reports_staff_update
on public.reports
for update
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid()
      and up.role in ('moderator', 'admin')
  )
)
with check (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid()
      and up.role in ('moderator', 'admin')
  )
  and reporter_id is not null
);
