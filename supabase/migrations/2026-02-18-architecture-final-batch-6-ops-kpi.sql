-- Architecture Final Batch 6
-- Ops KPI views for AX-OPS-001 dashboard baseline

create or replace view public.ops_kpi_daily as
with
  revision_daily as (
    select date_trunc('day', created_at)::date as day, count(*)::bigint as revision_count
    from public.wiki_revisions
    group by 1
  ),
  report_daily as (
    select date_trunc('day', created_at)::date as day, count(*)::bigint as report_count
    from public.reports
    group by 1
  ),
  rollback_daily as (
    select date_trunc('day', created_at)::date as day, count(*)::bigint as rollback_count
    from public.wiki_revisions
    where status in ('hidden', 'deleted')
    group by 1
  )
select
  coalesce(r.day, p.day, b.day) as day,
  coalesce(r.revision_count, 0) as revision_count,
  coalesce(p.report_count, 0) as report_count,
  coalesce(b.rollback_count, 0) as rollback_count
from revision_daily r
full join report_daily p on p.day = r.day
full join rollback_daily b on b.day = coalesce(r.day, p.day)
order by 1 desc;

create or replace view public.ops_kpi_realtime as
select
  (select count(*)::bigint from public.reports where status = 'open') as report_queue_open,
  (
    select coalesce(
      percentile_cont(0.5) within group (order by extract(epoch from (resolved_at - created_at))),
      0
    )::double precision
    from public.reports
    where status in ('resolved', 'dismissed')
      and resolved_at is not null
      and created_at >= now() - interval '30 days'
  ) as report_resolution_p50_seconds,
  (select count(*)::bigint from public.wiki_revisions where status = 'pending') as pending_revision_count;

grant select on public.ops_kpi_daily to authenticated, service_role;
grant select on public.ops_kpi_realtime to authenticated, service_role;
