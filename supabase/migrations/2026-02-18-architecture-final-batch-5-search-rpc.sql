-- Architecture Final Batch 5
-- Search ranking RPC (FTS + trigram + freshness weighting)

create or replace function public.search_wiki_advanced(
  search_query text,
  max_results integer default 20
)
returns table (
  slug text,
  title text,
  category text,
  summary text,
  updated_at timestamptz,
  score double precision,
  trigram_similarity double precision
)
language sql
stable
as $$
  with base as (
    select
      wa.slug,
      wa.title,
      wa.category,
      wa.summary,
      wa.updated_at,
      ts_rank_cd(wa.search_vector, websearch_to_tsquery('english', search_query)) as rank_en,
      ts_rank_cd(wa.search_vector, websearch_to_tsquery('simple', search_query)) as rank_simple,
      similarity(lower(wa.title), lower(search_query)) as sim_title,
      similarity(lower(wa.summary), lower(search_query)) as sim_summary
    from public.wiki_articles wa
    where
      wa.search_vector @@ websearch_to_tsquery('english', search_query)
      or wa.search_vector @@ websearch_to_tsquery('simple', search_query)
      or similarity(lower(wa.title), lower(search_query)) > 0.2
  )
  select
    b.slug,
    b.title,
    b.category,
    b.summary,
    b.updated_at,
    (
      (b.rank_en * 0.55) +
      (b.rank_simple * 0.20) +
      (greatest(b.sim_title, b.sim_summary * 0.6) * 0.20) +
      (
        case
          when b.updated_at >= now() - interval '7 days' then 0.05
          when b.updated_at >= now() - interval '30 days' then 0.03
          when b.updated_at >= now() - interval '90 days' then 0.01
          else 0
        end
      )
    )::double precision as score,
    b.sim_title::double precision as trigram_similarity
  from base b
  order by
    (lower(b.title) = lower(search_query)) desc,
    (lower(b.title) like lower(search_query) || '%') desc,
    score desc,
    b.updated_at desc
  limit greatest(1, least(max_results, 50));
$$;

grant execute on function public.search_wiki_advanced(text, integer) to anon, authenticated, service_role;
