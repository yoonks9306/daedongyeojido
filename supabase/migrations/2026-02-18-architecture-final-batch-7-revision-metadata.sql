-- Architecture Final Batch 7
-- Persist non-content wiki field changes inside revisions for pending/approval workflows

alter table public.wiki_revisions
  add column if not exists proposed_title text,
  add column if not exists proposed_category text,
  add column if not exists proposed_summary text,
  add column if not exists proposed_tags text[],
  add column if not exists proposed_related_articles text[];

-- Best-effort legacy backfill for initial revisions
update public.wiki_revisions wr
set
  proposed_title = coalesce(wr.proposed_title, wa.title),
  proposed_category = coalesce(wr.proposed_category, wa.category),
  proposed_summary = coalesce(wr.proposed_summary, wa.summary),
  proposed_tags = coalesce(wr.proposed_tags, wa.tags),
  proposed_related_articles = coalesce(wr.proposed_related_articles, wa.related_articles)
from public.wiki_articles wa
where wr.article_id = wa.id
  and wr.revision_number = 1;
