# ARCHITECTURE_FINAL.md

Last updated: 2026-02-17
Status: FINAL (Decision Frozen)
Scope: KorWiki production hardening for 20,000+ active users

## 0. Frozen Decisions (Owner Confirmed)

1. Pending revisions visibility: **private** (author + moderator + admin only)
2. Authority model: **role-first** for destructive actions; trust is supplemental
3. Admin scope: **full master console** (`/admin/users`, `/admin/moderation`, `/admin/tags`, `/admin/settings`)
4. Image strategy: **A** (upload system included now, not deferred)
5. Account deletion: **soft delete + retention + anonymization**
6. Concurrent editing: **optimistic locking (conflict response)**

## 1. Principles

- SSG/ISR first for read-heavy wiki traffic.
- Security and moderation before feature convenience.
- Keep architecture practical for small-team operations.
- Prefer PostgreSQL-native features first (FTS, GIN, trigram, RPC).
- Define operational policy and legal boundaries as product features.

## 2. Performance Targets (v1)

- Wiki article cached TTFB: < 300ms typical
- Search API p95: < 400ms
- Write API p95 (edit/post/comment): < 800ms
- Core route error rate: < 1%

## 3. Runtime Architecture

- Frontend: Next.js App Router on Vercel
- API: Next.js route handlers + Supabase RPC
- DB/Auth: Supabase Postgres + Auth
- Search: Postgres FTS (`tsvector`) + trigram
- Background jobs: `pg_cron` (trust recalc, cleanup tasks)
- Observability: Sentry + Vercel Analytics + Supabase dashboard

## 4. Data Model (Final)

Core existing tables remain (`wiki_articles`, `community_posts`, `comments`, `votes`, `user_identities`, `local_auth_users`).

Add:

### 4.1 `user_profiles`
- `user_id` uuid PK
- `username` unique
- `display_name`
- `trust_score` int default 0
- `role` enum-like text: `user|moderator|admin`
- `banned_until` timestamptz nullable
- `deleted_at` timestamptz nullable
- `created_at`, `updated_at`

### 4.2 `wiki_revisions`
- `id` bigint PK
- `article_id` FK -> `wiki_articles.id`
- `revision_number` int
- `content` text
- `content_hash` text
- `summary` text
- `author_id` uuid
- `author_name` text
- `status` text: `active|pending|hidden|deleted`
- `created_at`
- unique (`article_id`, `revision_number`)

### 4.3 `revision_votes`
- `revision_id`, `user_id`, `vote(1|-1)`
- unique (`revision_id`, `user_id`)

### 4.4 `reports`
- `reporter_id`
- `target_type` (`article|revision|post|comment|user`)
- `target_id` bigint
- `reason`, `detail`, `status`
- `resolved_by`, `resolved_at`

### 4.5 Tag normalization (hybrid)
- `tags` (master)
- `tag_aliases`
- `wiki_article_tags` (N:M)
- Existing `wiki_articles.tags` array kept temporarily for compatibility during migration

### 4.6 Uploads
- Supabase Storage bucket (`community-media`)
- Metadata table `media_uploads`:
  - `id`, `uploader_id`, `path`, `mime`, `size_bytes`, `width`, `height`, `status`, `created_at`

## 5. Search Architecture

- Add `search_vector` to `wiki_articles`
- Build with mixed config (`english` + `simple`) for EN/KR mixed query behavior
- Add GIN index for vector + trigram index on title

Ranking baseline:
1. title exact match
2. FTS rank
3. trigram similarity
4. freshness tiebreaker

## 6. Editor & Content Flow

Editor:
- CodeMirror-based raw HTML editor
- split preview pane
- sanitizer enforced in preview and save path

Validation before save:
- heading presence
- anchor integrity
- footnote pair integrity
- banned tags/attrs/protocols

Save flow:
1. Create new row in `wiki_revisions`
2. Check trust and role
3. If user is newcomer/low trust: `pending`
4. If policy permits: apply to `wiki_articles` as `active`

## 7. Access & Moderation Rules

### 7.1 Visibility
- Public reads only `active` wiki content
- Pending revisions visible to: author + moderator + admin

### 7.2 Authority matrix
- Trust score: affects low-risk workflow (auto-active vs pending)
- Role: required for destructive actions
  - `moderator/admin`: rollback, hide revision, resolve reports
  - `admin` only: role changes, emergency lock, hard moderation overrides

### 7.3 Anti-abuse
- 2-layer rate limit:
  - Edge-level (IP)
  - Server-side/API-level (user/action count)
- Write route safeguards for spam burst and repeat offenders

## 8. Admin Master Console

Routes:
- `/admin` dashboard
- `/admin/users`
- `/admin/moderation`
- `/admin/tags`
- `/admin/settings`

Must-have controls:
- ban/unban users
- role grant/revoke
- approve/reject/hide revisions
- report queue resolution
- emergency write lock toggle

Audit:
- immutable admin action logging required for all high-risk actions

## 9. Image Upload (In Scope Now)

This project adopts upload strategy A immediately.

v1 requirements:
- authenticated uploads only
- MIME allowlist (jpeg/png/webp/gif)
- file size cap (default 5MB)
- daily per-user quota
- upload metadata stored in DB
- report/removal flow for abusive media
- CSP and sanitizer allow only trusted storage domains

## 10. Account Deletion & Retention

- User deletion request => account soft-deleted immediately (`deleted_at`)
- Login/write blocked after deletion request
- Retention window: 30 days
- After retention, personal data hard-delete/anonymize
- Authored wiki/community content remains with anonymized author identity

## 11. Concurrent Edit Conflict Policy

- Editor saves with `base_revision_number`
- Server compares with current latest revision
- If mismatch: return `409 Conflict`
- Client shows merge/reload prompt

## 12. Caching & Invalidation

- Wiki pages use ISR/cache tags
- On approved edit:
  - invalidate `/wiki/[slug]`
  - invalidate `/wiki`
  - invalidate related tag pages
  - refresh related/suggestion caches

## 13. Security Baseline

- Strict HTML sanitize allowlist
- RLS hardened for all mutable content tables
- CSP with minimized unsafe directives
- External embeds/domain allowlist
- Admin-only emergency lock and override controls

## 14. Migration Sequence (Implementation Order)

1. Enable extensions (trigram etc.)
2. Create `user_profiles`
3. Create `wiki_revisions` + `revision_votes`
4. Add wiki search vectors/indexes/triggers
5. Create tag normalization tables
6. Create `reports`
7. Create upload metadata table + storage policies
8. Add RPC/functions (search, suggest_related, trust recalc)
9. Backfill existing articles to initial revisions
10. Backfill search vectors and tag links

## 15. 7-Day Sprint Plan (Aligned to Frozen Decisions)

Day 1: DB migrations + policies + type updates
Day 2: revision pipeline + optimistic locking + history API
Day 3: editor split preview + validator + sanitizer
Day 4: search API + suggestion dropdown + search results
Day 5: admin console core + report flow + moderation actions
Day 6: upload pipeline (storage, validation, quota, report/removal)
Day 7: hardening (rate limit dual layer, CSP, QA, perf checks, deploy gate)

## 16. Jira Ticketing Rule

Create tickets only from this final doc.
Each ticket must include:
- acceptance criteria
- API/DB impact
- security checklist
- rollback plan
- test plan

## 17. Platform Decision

Current recommendation remains:
- Continue with Vercel + Supabase for this phase.
- Re-evaluate only when metrics show clear capacity or economics pressure.

## 18. Handoff for Claude Code (UI Rebuild Track)

Owner intent:
- UI/UX full redesign will be led with Claude Code.
- Backend/domain architecture in this file is already frozen and must be preserved.
- Owner will provide finalized main/sub colors and reference directions separately.

### 18.1 Non-negotiable constraints (Do Not Change)

1. Keep Section 0 frozen decisions exactly as-is.
2. Do not weaken security/moderation policies to speed up UI work.
3. Do not remove revision, rollback, role-first authority, or optimistic locking requirements.
4. Keep upload strategy in-scope now (Section 9).
5. Keep Vercel + Supabase baseline unless explicitly re-approved by owner.

### 18.2 UI framework direction (approved)

- `shadcn/ui + Tailwind` migration is allowed and recommended for redesign velocity.
- Migration should be incremental (no big-bang rewrite in one PR).
- Temporary coexistence with existing CSS Modules is acceptable during transition.

### 18.3 Recommended execution order for UI track

1. Define tokens first: main/sub color + neutral/state scales + dark/light mapping.
2. Install and configure Tailwind + shadcn foundation.
3. Build/replace core primitives (`Button`, `Input`, `Textarea`, `Select`, `Dialog`, `Dropdown`, `Badge`, `Tabs`).
4. Rebuild shared shells first (`Navigation`, layout containers, base typography/spacing).
5. Rebuild key pages in this order:
   - Wiki read/edit surfaces
   - Community read/write surfaces
   - Admin surfaces (`/admin/*`)
6. Keep API contracts and DB assumptions untouched while replacing UI.

### 18.4 Regression checklist during UI migration

- Search flow still works (suggestion + results route contract).
- Revision history/rollback controls remain visible and role-gated.
- Report/moderation actions remain reachable from updated UI.
- Upload UX enforces MIME/size/quota feedback clearly.
- Accessibility baseline preserved (keyboard nav, focus states, contrast).

### 18.5 Delivery expectation for Claude Code

- Produce design-system-first implementation, not page-by-page ad hoc styling.
- Keep component APIs stable for future AI-assisted iteration.
- Update this file only if architectural behavior changes (not for purely visual changes).

## 19. Success Metrics (90-Day)

Primary success metrics:
- Registered users: 5,000+
- Monthly active users (MAU): 2,000+
- Approved wiki revisions: 2,500+
- Active contributors (30-day): 200+
- Search success rate (non-zero result): 85%+

Safety and quality metrics:
- Median report handling time: < 24h
- High-risk abuse response SLA: < 2h
- Rollback rate on approved revisions: < 8%
- False-positive moderation reversal rate: < 5%

Platform reliability metrics:
- Uptime target: 99.9%
- Core API error rate: < 1%
- p95 search latency: < 400ms
- p95 write latency: < 800ms

## 20. Core User Flow (One-Page)

Canonical flow:
1. Visitor lands on site.
2. User searches and reads wiki/community content.
3. User signs up or logs in.
4. User submits edit/post/comment.
5. System validates, sanitizes, and records revision immutably.
6. Moderation/role policy determines pending vs active visibility.
7. Community reports or moderator actions trigger review queue.
8. Moderator/admin resolves (approve/hide/rollback/ban as needed).
9. Cache invalidation and index refresh keep read path consistent.

Failure-path requirements:
- Any failed write must still be auditable.
- Any abuse event must be traceable to actor and action timestamp.
- Any incorrect active revision must be rollbackable with one admin/mod action.

## 21. Domain Model Snapshot (Text ERD)

Core domain entities and relationships:
- `Document (wiki_articles)` 1:N `Revision (wiki_revisions)`
- `User (auth.users + user_profiles)` 1:N `Revision`
- `User` 1:N `CommunityPost`
- `User` 1:N `Comment`
- `Revision` 1:N `RevisionVote`
- `Report` -> polymorphic target (`article|revision|post|comment|user`) with `target_id`
- `Tag` N:M `Document` via `wiki_article_tags`
- `User` 1:N `MediaUpload`

Invariant rules:
- Document body changes are revision-driven and rollbackable.
- Revisions are append-only records (immutability by policy).
- Role authority overrides trust authority for destructive actions.
- Pending content is never public.
- Every moderation action is attributable (actor + time + target).

## 22. Backup & Recovery Runbook

Backup policy:
- Use Supabase managed backups and PITR-capable plan.
- Daily backup verification check in ops routine.
- Retain operational snapshots per environment policy.

Recovery objectives:
- RTO target: <= 2 hours
- RPO target: <= 15 minutes (with PITR enabled)

Recovery procedure (minimum):
1. Detect incident and freeze risky writes if needed (`emergency lock`).
2. Identify blast radius (tables/routes/time window).
3. Restore to verified point-in-time copy.
4. Validate integrity of revisions, reports, users, and uploads metadata.
5. Re-open writes progressively after smoke tests.
6. Publish incident summary and action log.

Recovery drills:
- Quarterly restore rehearsal required.
- Drill must include one content-corruption scenario and one abuse-overwrite scenario.

## 23. Scope Control (MVP vs Deferred)

In-scope for this phase:
- Read/search, auth, edit+revision+rollback, moderation, admin core, uploads, rate limit, observability, backup/recovery runbook.

Deferred (not in this phase unless re-approved):
- Real-time collaborative editing
- Advanced recommendation ML ranking
- Native mobile apps
- Full multi-region active-active architecture
- Complex gamification/reputation economy beyond current trust+role model

## 24. UI Renewal Conflict Check (Post-Opus Session Review)

Source reviewed:
- `SESSION_LOG.md` entries on 2026-02-18 (Opus UI Redesign Phase 1-5)
- Current working tree (`git status --short`)

Conflict verdict:
- No architectural conflict with Sections 0-23.
- UI migration (Tailwind v4 + shadcn) is compatible with this architecture.

Confirmed aligned:
1. Design system is now centralized in `src/app/globals.css`.
2. `ThemeProvider` now uses `.dark` class (Tailwind-native), which is acceptable.
3. No core backend decisions were reverted by UI changes.
4. Upload/revision/moderation requirements remain unimplemented (still pending backend execution).

Detected risks (must be handled):
1. Documentation drift:
   - `MASTERPLAN.md` still describes CSS Modules and legacy `data-theme`.
   - `AGENT_INSTRUCTION.md` partially mentions legacy `data-theme` behavior.
2. Architecture execution not started before this update:
   - No DB migrations yet for `user_profiles`, `wiki_revisions`, `reports`, `media_uploads`, `search_vector`.
3. Large UI-only diff means backend work should be isolated and incremental to reduce regression risk.

Action:
- Treat UI migration as complete baseline.
- Continue with backend architecture rollout tickets below.

## 25. Execution Board (Architecture Final Rollout)

Status legend: `todo` | `in_progress` | `blocked` | `done`

| ID | Track | Ticket | Status | Depends On |
|---|---|---|---|---|
| AX-DB-001 | DB | Batch-1 schema migration (profiles/revisions/reports/uploads/search) | done | - |
| AX-DB-002 | DB | Tag normalization schema (`tags`, `tag_aliases`, `wiki_article_tags`) | done | AX-DB-001 |
| AX-DB-003 | DB | Backfill revisions + search vector + tag joins | done | AX-DB-001, AX-DB-002 |
| AX-BE-001 | API | Revision write pipeline + pending/active visibility enforcement | done | AX-DB-001 |
| AX-BE-002 | API | Optimistic locking (`base_revision_number`, 409 conflict) | done | AX-BE-001 |
| AX-BE-003 | API | Reports API + moderation action endpoints | done | AX-DB-001 |
| AX-BE-004 | API | Upload API + MIME/size/quota enforcement | done | AX-DB-001 |
| AX-BE-005 | API | Search API (FTS + trigram + ranking contract) | done | AX-DB-001 |
| AX-BE-006 | API | Admin settings API (`emergency_lock`) and global write guard | done | AX-DB-001 |
| AX-SEC-001 | Security | Harden RLS and remove unsafe direct update paths | done | AX-DB-001 |
| AX-SEC-002 | Security | Dual-layer rate limiting (edge + server checks) | done | AX-BE-001 |
| AX-OPS-001 | Ops | Sentry + analytics + core dashboard metrics wiring | in_progress | AX-BE-001 |
| AX-OPS-002 | Ops | Backup/PITR verification checklist + recovery drill script | in_progress | AX-DB-001 |
| AX-DOC-001 | Docs | Sync `MASTERPLAN.md` + `AGENT_INSTRUCTION.md` with Tailwind reality | done | - |
| AX-QA-001 | QA | End-to-end acceptance run against frozen decisions (Section 0) | in_progress | AX-BE-001..006 |

## 26. Detailed Tickets (Ready for Jira Import)

### AX-DB-001 (done)
- Title: Create architecture-final batch 1 migration.
- Delivered:
  - Added `supabase/migrations/2026-02-18-architecture-final-batch-1.sql`.
  - Includes `user_profiles`, `wiki_revisions`, `revision_votes`, `reports`, `media_uploads`, `site_settings`, `wiki_articles.search_vector`, indexes, triggers, and baseline RLS policies.
- Remaining to complete ticket operationally:
  - Apply migration in Supabase SQL Editor.
  - Verify objects/policies exist and no policy-name collision in production.

### AX-DB-002
- Title: Add tag normalization schema.
- Scope:
  - Create `tags`, `tag_aliases`, `wiki_article_tags`.
  - Add indexes and RLS read/write policy skeleton.
- Delivered:
  - Added `supabase/migrations/2026-02-18-architecture-final-batch-2-tags.sql`.
  - Includes table creation, indexes, update trigger, and staff-write/public-read RLS policies.
- Acceptance:
  1. New tables created and queryable.
  2. Existing `wiki_articles.tags` continues to work (hybrid mode).
  3. No breaking change to current wiki read path.

### AX-DB-003
- Title: Backfill data for revisions/search/tags.
- Scope:
  - Seed initial revision row per existing article.
  - Populate search vectors for existing content.
  - Backfill join-table tags from legacy array.
- Delivered:
  - Added `supabase/migrations/2026-02-18-architecture-final-batch-3-backfill.sql`.
  - Includes idempotent backfill for initial wiki revisions, normalized tags, and article-tag joins.
- Acceptance:
  1. 100% of current articles have revision #1.
  2. Search query on known keywords returns expected rows.
  3. Backfill script is idempotent.

### AX-BE-001
- Title: Revision-first write pipeline.
- Scope:
  - Refactor wiki create/update APIs to append revision records.
  - Enforce pending/active visibility policy from Section 0.
- Delivered:
  - Wiki create API now inserts initial revision (`revision_number=1`, `active`).
  - Wiki update API now appends revision first and applies trust/role gate (`active` vs `pending`).
  - Added profile bootstrap helper: `src/lib/user-profiles.ts`.
  - Public read path remains sourced from `wiki_articles` active state, so pending revisions are not publicly exposed.
- Acceptance:
  1. Direct body overwrite path is blocked for normal clients.
  2. All writes generate revision rows.
  3. Pending revisions are hidden from public.

### AX-BE-002
- Title: Implement optimistic locking on wiki edits.
- Scope:
  - Require `base_revision_number` in edit requests.
  - Return `409` on stale writes.
- Delivered:
  - Edit page now loads latest revision number and passes it to editor form.
  - Editor form sends `baseRevisionNumber` on PATCH.
  - PATCH API compares base vs current revision and returns `409` with `currentRevisionNumber` on mismatch.
- Acceptance:
  1. Concurrent edits produce deterministic conflict response.
  2. No silent overwrite of latest revision.

### AX-BE-003
- Title: Reports and moderation APIs.
- Scope:
  - Add report create/list endpoints.
  - Add moderation resolve/hide/rollback actions.
- Delivered:
  - Added `POST/GET /api/v1/reports`.
  - Added `PATCH /api/v1/reports/[id]` with staff-role guard.
  - Added explicit role checks to avoid service-role RLS bypass exposure.
  - Added `PATCH /api/v1/wiki/revisions/[id]` with staff-only moderation actions:
    - `approve` (promote revision and publish article content)
    - `reject` (mark revision `deleted`)
    - `hide` (mark revision `hidden`)
- Acceptance:
  1. Reporter can view own reports.
  2. Moderator/admin can resolve reports.
  3. All moderation actions are auditable.

### AX-BE-004
- Title: Upload pipeline v1 (in-scope now).
- Scope:
  - Authenticated upload endpoint.
  - MIME allowlist, size cap, per-user quota.
  - Metadata write to `media_uploads`.
- Delivered:
  - Added `POST /api/v1/uploads` (multipart file upload to Supabase Storage + metadata insert).
  - Added `PATCH /api/v1/uploads/[id]` for owner/staff status changes (`removed`, `blocked`).
  - Enforced MIME allowlist, 5MB size cap, and 24h quota check.
- Operational note:
  - Requires Supabase Storage bucket `community-media` to exist in project.
- Acceptance:
  1. Unsupported type/oversize returns explicit error.
  2. Daily quota is enforced.
  3. Uploaded assets can be reported/removed.

### AX-BE-005
- Title: Search API contract rollout.
- Scope:
  - Add `/api/v1/wiki/search` for suggestions/results.
  - Implement ranking order from Section 5.
- Delivered:
  - Added `GET /api/v1/wiki/search` endpoint.
  - Added DB RPC migration `2026-02-18-architecture-final-batch-5-search-rpc.sql`:
    - FTS (`english` + `simple`) + trigram + freshness weighting
    - title exact/prefix 우선 정렬
  - API now calls RPC and returns scored/reasoned results.
- Acceptance:
  1. Title-exact matches rank above body-only matches.
  2. EN/KR mixed query behavior is acceptable.
  3. p95 latency target measured in staging.

### AX-BE-006
- Title: Emergency lock and global write guard.
- Scope:
  - Add admin API to toggle `site_settings.emergency_lock`.
  - Enforce write blocking across mutable endpoints.
- Delivered:
  - Added `GET/PATCH /api/v1/admin/settings/emergency-lock` (admin-only).
  - Added shared lock helper `src/lib/emergency-lock.ts`.
  - Enforced write guard on major mutable APIs (wiki write, reports, uploads, community posts/comments/votes).
- Acceptance:
  1. Emergency lock blocks create/update/delete routes.
  2. Read routes remain available.
  3. Only admin can toggle lock.

### AX-SEC-001
- Title: RLS hardening pass.
- Scope:
  - Remove policy gaps that allow unsafe direct update.
  - Validate role checks on moderator/admin actions.
- Delivered:
  - Added security migration `2026-02-18-architecture-final-batch-4-security-hardening.sql`.
  - Hardened `wiki_articles` direct write policies (removed broad authenticated write).
  - Removed user self-update policy path that could enable privilege escalation.
  - Replaced community delete hardcoded admin-email check with role-based authorization.
- Acceptance:
  1. RLS audit passes for all mutable tables.
  2. Unauthorized updates are denied at DB layer.

### AX-SEC-002
- Title: Dual-layer rate limiting.
- Scope:
  - Edge throttle + server-side action-count checks.
  - Cover auth/register, edit, report, upload, comment paths.
- Delivered:
  - Added edge proxy rate-limiter: `src/proxy.ts` (IP-based throttling by route/method).
  - Added DB-backed server limiter helper: `src/lib/write-rate-limit.ts`.
  - Applied server-side action-count limits to wiki writes, reports, community posts/comments, uploads.
  - Kept emergency-lock guard as independent write-stop control.
- Acceptance:
  1. Burst abuse is throttled.
  2. Legitimate normal usage remains unaffected.

### AX-OPS-001
- Title: Observability baseline wiring.
- Scope:
  - Sentry client/server integration.
  - Track core product metrics (Section 19).
- Delivered (partial):
  - Installed dependencies: `@sentry/nextjs`, `@vercel/analytics`
  - Added Sentry wiring:
    - `next.config.ts` with `withSentryConfig`
    - `src/instrumentation.ts`
    - `src/instrumentation-client.ts`
    - `sentry.server.config.ts`, `sentry.edge.config.ts`
    - `src/app/global-error.tsx` exception capture
    - `POST /api/v1/admin/ops/sentry-test` admin-only manual event endpoint
  - Added Vercel Analytics component in root layout: `src/app/layout.tsx`
  - Added KPI SQL views migration:
    - `supabase/migrations/2026-02-18-architecture-final-batch-6-ops-kpi.sql`
    - `ops_kpi_daily`, `ops_kpi_realtime`
  - Added Sentry-related env templates in `.env.example`
- Acceptance:
  1. Errors are traceable with request context.
  2. Metrics dashboard shows key KPIs.

### AX-OPS-002
- Title: Backup and recovery operationalization.
- Scope:
  - Convert Section 22 into executable checklist.
  - Schedule quarterly drill cadence.
- Delivered (partial):
  - Added `OPERATIONS_PLAYBOOK.md` with:
    - weekly backup/PITR verification checklist
    - step-by-step recovery runbook
    - quarterly drill scenarios and evidence template
- Acceptance:
  1. RTO/RPO targets are testable.
  2. Drill evidence logged.

### AX-DOC-001
- Title: Documentation sync after UI migration.
- Scope:
  - Update `MASTERPLAN.md` stack/style sections from CSS Modules -> Tailwind/shadcn.
  - Fix any stale `data-theme` references in instructions.
- Delivered:
  - Updated `MASTERPLAN.md`:
    - Tech stack styling row corrected to Tailwind v4 + shadcn/ui
    - directory sample no longer references removed `.module.css` files
    - dark mode rule corrected to `.dark` class on `<html>`
    - quick coding rule updated (no new CSS Modules)
  - Updated `AGENT_INSTRUCTION.md`:
    - migration language corrected (CSS Modules migration complete)
    - removed legacy `data-theme` bridge instructions
- Acceptance:
  1. Docs reflect actual codebase.
  2. Incoming agents are not misled by outdated styling guidance.

### AX-QA-001
- Title: Frozen-decision compliance QA.
- Scope:
  - Validate all Section 0 frozen decisions in staging.
  - Run end-to-end checklist for edit/moderation/rollback/upload.
- Delivered (partial):
  - Added `QA_RELEASE_GATE.md` with:
    - decision-by-decision pass/fail checks (Q-001..Q-006)
    - security gate checks (S-001..S-003)
    - DB verification queries and release sign-off template
  - Added `QA_RUN_2026-02-18.md`:
    - code-level evidence mapping for frozen decisions and security gates
    - current gate verdict and remaining staging/manual actions
- Acceptance:
  1. Every frozen decision has a pass/fail check.
  2. Release gate blocks deploy on any critical fail.

## 19. Editor Transition Note (2026-02-19)

Current implementation has moved to **CommonMark + GFM base** with project-specific extensions.

### 19.1 Implemented now
- Editor runtime: CodeMirror 6
- Markdown renderer: `marked` (GFM enabled)
- Wiki link extension:
  - `[[slug]]`
  - `[[slug|Label]]`
- Embed extension:
  - `[YouTube|size|align](url)`
  - `[Google Map|size|align](url)`
- Infobox extension:
  - `::infobox ... ::` (key-value block)

### 19.2 Why this note exists
This editor stack is functionally stable but still in product-definition phase for long-term wiki syntax governance.
Open question remains whether to:
1. keep CommonMark + controlled extensions, or
2. formalize a stricter custom wiki dialect.

### 19.3 Required next freeze
Before large content expansion, freeze:
- infobox key schema (required/optional)
- embed option schema (size/align defaults)
- parser error behavior on invalid extension blocks
- compatibility policy for future syntax changes
