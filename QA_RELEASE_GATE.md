# QA_RELEASE_GATE

Last updated: 2026-02-18
Owner: backend/platform

## 1) Gate Rule

- Release is blocked if any `Critical` test fails.
- `High` failures require explicit admin sign-off with mitigation note.
- All checks are run against staging first, then production smoke.

## 2) Frozen Decision Compliance (Section 0)

### Q-001 Pending revision visibility (Critical)
- Decision: pending revisions are private (author + moderator + admin only)
- Steps:
  1. Login as low-trust normal user and submit wiki edit.
  2. Confirm API returns `status: pending`.
  3. Open article in anonymous session and confirm pending content is not visible.
  4. Open moderation/staff view and confirm pending revision exists.
- Pass condition:
  - Public read path shows only `wiki_articles` active content.

### Q-002 Role-first destructive authority (Critical)
- Decision: destructive actions require role (`moderator|admin`), trust is supplemental only.
- Steps:
  1. Try report resolution with normal user.
  2. Try same with moderator/admin.
  3. Try upload `blocked` transition with normal user vs staff.
- Pass condition:
  - Normal user denied, staff allowed.

### Q-003 Admin master scope (Critical)
- Decision: admin can operate emergency lock + moderation master functions.
- Steps:
  1. `GET /api/v1/admin/settings/emergency-lock` as non-admin -> 403.
  2. Same as admin -> 200.
  3. Toggle lock as admin -> 200, state changed.
- Pass condition:
  - Only admin can read/write emergency lock control.

### Q-004 Upload strategy A in-scope (High)
- Decision: upload pipeline is active now.
- Steps:
  1. Upload valid image (jpeg/png/webp/gif, <= 5MB) as authenticated user.
  2. Upload invalid mime file.
  3. Upload oversize file.
  4. Repeated upload to exceed daily quota.
- Pass condition:
  - Valid upload succeeds + metadata row exists.
  - Invalid/oversize/quota cases return explicit 4xx error.

### Q-005 Account deletion policy (High)
- Decision: soft delete + retention + anonymization.
- Steps:
  1. Call `POST /api/v1/account/delete` with body `{ "confirm": true }` as authenticated user.
  2. Verify `user_profiles.deleted_at` is set and display name is anonymized.
  3. Retry write APIs (wiki/community/reports/uploads) and verify blocked response.
  4. Try signing in again and verify login is denied for linked identity.
- Pass condition:
  - Soft-delete request is persisted and login/write are blocked.

### Q-006 Optimistic locking (Critical)
- Decision: save requires `baseRevisionNumber`; stale edits return 409.
- Steps:
  1. Open same article in two browser sessions.
  2. Save session A first.
  3. Save session B with stale base revision.
- Pass condition:
  - Session B gets `409` and current revision number payload.

## 3) Security/Abuse Gate

### S-001 Emergency lock write-stop (Critical)
- Toggle lock on, verify writes blocked for:
  - wiki create/update
  - reports create/update
  - uploads create/update
  - community post/comment/vote
- Pass condition:
  - Blocked routes return 503.

### S-002 Rate limits dual layer (High)
- Validate edge throttle and server write-count throttle.
- Pass condition:
  - burst calls produce 429 while normal usage remains stable.

### S-003 RLS hardening (Critical)
- Verify no broad authenticated write remains on `wiki_articles`.
- Verify `user_profiles` self-role escalation path is blocked.
- Pass condition:
  - unauthorized SQL updates denied.

## 4) DB Verification Queries

```sql
-- 1) Every article has at least one revision
select count(*) as articles_without_revision
from public.wiki_articles wa
where not exists (
  select 1 from public.wiki_revisions wr where wr.article_id = wa.id
);

-- 2) Pending revisions exist but are not reflected in public body until approved
select status, count(*) from public.wiki_revisions group by status order by status;

-- 3) Policy presence check (batch-4)
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('wiki_articles', 'user_profiles', 'reports')
order by tablename, policyname;
```

## 5) Sign-Off Template

- Date (UTC):
- Environment:
- Operator:
- Critical checks: pass/fail
- High checks: pass/fail
- Known risks:
- Release decision:
