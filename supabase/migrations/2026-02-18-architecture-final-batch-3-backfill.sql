-- Architecture Final Batch 3
-- Covers: backfill revisions + normalized tags from legacy wiki_articles data

-- 1) Backfill initial revision rows for existing wiki articles.
insert into public.wiki_revisions (
  article_id,
  revision_number,
  content,
  content_hash,
  summary,
  author_id,
  author_name,
  status
)
select
  wa.id,
  1 as revision_number,
  wa.content,
  md5(wa.content) as content_hash,
  'Initial backfill revision' as summary,
  wa.author_id,
  coalesce(wa.author_id::text, 'system-backfill') as author_name,
  'active' as status
from public.wiki_articles wa
where not exists (
  select 1
  from public.wiki_revisions wr
  where wr.article_id = wa.id
);

-- 2) Backfill tags master table from legacy text[] tags.
insert into public.tags (slug, display_name)
select distinct
  lower(trim(tag_raw)) as slug,
  initcap(replace(lower(trim(tag_raw)), '-', ' ')) as display_name
from public.wiki_articles wa
cross join lateral unnest(coalesce(wa.tags, '{}'::text[])) as tag_raw
where trim(tag_raw) <> ''
on conflict (slug) do nothing;

-- 3) Backfill article-tag joins.
insert into public.wiki_article_tags (article_id, tag_id)
select
  wa.id as article_id,
  t.id as tag_id
from public.wiki_articles wa
cross join lateral unnest(coalesce(wa.tags, '{}'::text[])) as tag_raw
join public.tags t
  on t.slug = lower(trim(tag_raw))
where trim(tag_raw) <> ''
on conflict (article_id, tag_id) do nothing;

-- 4) Ensure search vectors are filled for current rows.
update public.wiki_articles
set title = title
where search_vector is null;
