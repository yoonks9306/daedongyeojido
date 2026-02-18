# OPERATIONS_PLAYBOOK

Last updated: 2026-02-18
Owner: platform/admin

## 1) Observability Baseline (AX-OPS-001)

### 1.1 Required tooling
- Error tracking: Sentry (Next.js server + browser)
- Product analytics: Vercel Analytics
- DB/infra monitoring: Supabase dashboard (CPU, connections, storage, slow queries)

### 1.2 Minimum implementation checklist
- Add Sentry SDK and initialize for server/browser runtime.
- Capture API errors with route + actor context (user id when present, no PII payloads).
- Enable Vercel Analytics in production.
- Create an admin KPI view (or SQL dashboard) for:
  - DAU
  - wiki revision count/day
  - report queue size
  - moderation median handling time
  - rollback count/day

### 1.3 Alert thresholds
- Core API 5xx error rate >= 1% for 5 minutes.
- Search p95 latency >= 400ms for 15 minutes.
- Write API p95 latency >= 800ms for 15 minutes.
- Report queue older than 24h exists.

### 1.4 Exit criteria
- At least 1 forced test error is captured in Sentry from production runtime.
- KPI dashboard visible to admin account.
- Alert route (email/slack) tested once.

### 1.5 Fast verification steps
1. Ensure Sentry env vars are set in Vercel/Supabase runtime:
   - `SENTRY_DSN`
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN`
2. Trigger admin test event:
   - `POST /api/v1/admin/ops/sentry-test`
   - Expect `200` with `eventId`.
3. In Sentry dashboard:
   - confirm the event is visible.
4. Apply KPI migration:
   - `supabase/migrations/2026-02-18-architecture-final-batch-6-ops-kpi.sql`
5. Verify KPI views:
   - `select * from public.ops_kpi_realtime;`
   - `select * from public.ops_kpi_daily limit 30;`

## 2) Backup/PITR Runbook (AX-OPS-002)

### 2.1 Prerequisites
- Supabase plan with PITR enabled.
- Confirm retention window configured.
- Confirm least-privilege service role handling.

### 2.2 Weekly checklist
- Verify latest successful automated backup timestamp.
- Verify storage growth and table bloat trend.
- Verify `wiki_revisions`, `reports`, `media_uploads` row deltas are sane.
- Export incident/audit snapshot for admin actions.

### 2.3 Recovery procedure (tabletop + live drill)
1. Activate emergency lock (`/api/v1/admin/settings/emergency-lock` => `locked=true`).
2. Record incident start time and suspected blast window.
3. Identify target restore point (UTC timestamp).
4. Restore clone/database to target point.
5. Validate integrity:
   - latest 20 `wiki_revisions` continuity
   - pending/active moderation state consistency
   - report queue row counts
   - upload metadata row counts
6. Smoke-test critical APIs in staging clone.
7. Cutover decision and reopen writes progressively.
8. Publish incident summary + remediation tasks.

### 2.4 Quarterly drill script
- Scenario A: malicious wiki overwrite wave
- Scenario B: accidental moderation bulk-update

For each scenario, log:
- Detection time
- Lock activation time
- Restore start/end time
- Total recovery time (RTO)
- Data loss window (RPO)
- Follow-up action items

### 2.5 Targets
- RTO <= 2 hours
- RPO <= 15 minutes

### 2.6 Evidence template
- Date/time (UTC):
- Scenario:
- Operator:
- Restore point:
- RTO measured:
- RPO measured:
- Validation queries run:
- Decision:
- Postmortem link:
