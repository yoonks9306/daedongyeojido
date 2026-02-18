-- Architecture Final Batch 2
-- Covers: tag normalization schema (tags, tag_aliases, wiki_article_tags) + RLS policies

create table if not exists public.tags (
  id bigint generated always as identity primary key,
  slug text not null unique,
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tags_updated_at on public.tags;
create trigger tags_updated_at
before update on public.tags
for each row execute function public.update_updated_at();

create table if not exists public.tag_aliases (
  id bigint generated always as identity primary key,
  alias text not null unique,
  tag_id bigint not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wiki_article_tags (
  article_id bigint not null references public.wiki_articles(id) on delete cascade,
  tag_id bigint not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (article_id, tag_id)
);

create index if not exists tags_is_active_idx on public.tags(is_active);
create index if not exists tag_aliases_tag_id_idx on public.tag_aliases(tag_id);
create index if not exists wiki_article_tags_tag_id_idx on public.wiki_article_tags(tag_id);
create index if not exists wiki_article_tags_article_id_idx on public.wiki_article_tags(article_id);

alter table public.tags enable row level security;
alter table public.tag_aliases enable row level security;
alter table public.wiki_article_tags enable row level security;

drop policy if exists tags_public_read on public.tags;
create policy tags_public_read
on public.tags for select
using (true);

drop policy if exists tag_aliases_public_read on public.tag_aliases;
create policy tag_aliases_public_read
on public.tag_aliases for select
using (true);

drop policy if exists wiki_article_tags_public_read on public.wiki_article_tags;
create policy wiki_article_tags_public_read
on public.wiki_article_tags for select
using (true);

drop policy if exists tags_staff_write on public.tags;
create policy tags_staff_write
on public.tags for all
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
)
with check (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists tag_aliases_staff_write on public.tag_aliases;
create policy tag_aliases_staff_write
on public.tag_aliases for all
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
)
with check (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);

drop policy if exists wiki_article_tags_staff_write on public.wiki_article_tags;
create policy wiki_article_tags_staff_write
on public.wiki_article_tags for all
using (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
)
with check (
  exists (
    select 1 from public.user_profiles up
    where up.user_id = auth.uid() and up.role in ('moderator', 'admin')
  )
);
