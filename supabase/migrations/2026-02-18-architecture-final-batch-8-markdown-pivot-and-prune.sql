-- Architecture Final Batch 8
-- Markdown pivot (with HTML backward-compat) + wiki prune to 10 keeper docs

alter table public.wiki_articles
  add column if not exists content_format text not null default 'markdown'
  check (content_format in ('markdown', 'html'));

alter table public.wiki_revisions
  add column if not exists content_format text not null default 'markdown'
  check (content_format in ('markdown', 'html'));

-- Mark legacy HTML-ish rows explicitly as html for safe rendering.
update public.wiki_articles
set content_format = 'html'
where content ~ '<[a-zA-Z/][^>]*>';

update public.wiki_revisions
set content_format = 'html'
where content ~ '<[a-zA-Z/][^>]*>';

-- Keep only specified core wiki documents.
-- Titles from product decision:
-- KakaoT, KTX, T-Money, Naver Map, Kakao Map, Convenience Store, Soju, PC Bang, Noraebang, Hongdae
with keepers as (
  select lower(x.title) as title
  from (values
    ('KakaoT'),
    ('KTX'),
    ('T-Money'),
    ('Naver Map'),
    ('Kakao Map'),
    ('Convenience Store'),
    ('Soju'),
    ('PC Bang'),
    ('Noraebang'),
    ('Hongdae')
  ) as x(title)
)
delete from public.wiki_articles wa
where lower(wa.title) not in (select title from keepers)
  and lower(wa.slug) not in (
    'kakaot', 'kakao-t',
    'ktx',
    't-money', 'tmoney',
    'naver-map',
    'kakao-map',
    'convenience-store',
    'soju',
    'pc-bang',
    'noraebang',
    'hongdae'
  );
