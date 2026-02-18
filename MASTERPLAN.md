# KorWiki — Master Plan

Last updated: 2026-02-19

This file is the live handoff board for all agents.
Do not store long architecture/qa text here. Put details in `docs/` and reference links only.

## 0. Current State (must update every session)

### Last completed work
- Architecture stabilization baseline completed (DB migrations batch 1-6, revision pipeline, role-based moderation, emergency lock, dual rate limit, search RPC).
- Sentry + Vercel Analytics wiring completed.
- Admin Sentry verification endpoint added: `POST /api/v1/admin/ops/sentry-test`.
- Docs reorganized into `docs/` tree with index.
- v3 Phase A history/revision suite delivery:
  - Wiki history actions aligned to Namu-style flow: `View | RAW | Blame | Revert | Compare`
  - Revision pages added: `/wiki/[slug]/raw`, `/wiki/[slug]/blame`, `/wiki/[slug]/compare`
  - Old revision warning banner on article page via `?rev={n}`
  - Revert endpoint added: `POST /api/v1/wiki/revisions/[id]/revert` (creates new revision; low-trust => pending)
  - History UI polish: document title links to latest article, action/author text use theme primary color
- Initial write policy adjustment for early growth:
  - Wiki create/edit API rate limit removed (user request) to maximize early contribution velocity.
- v3 Phase B partial delivery (editor + format pivot):
  - Editor upgraded with `Edit / Preview / Split` modes and insertion toolbar in `src/app/wiki/WikiEditorForm.tsx`.
  - Markdown rendering pipeline added with HTML backward compatibility:
    - `src/lib/wiki-utils.ts` (`parseWikiContent(raw, contentFormat)`)
    - article type now carries `contentFormat`.
  - Wiki API/revision flow now persists `content_format` (`markdown` for new edits/writes).
  - Added prune migration to keep only 10 agreed docs:
    - `supabase/migrations/2026-02-18-architecture-final-batch-8-markdown-pivot-and-prune.sql`
- v3 Phase B continued delivery:
  - Editor image upload insertion wired:
    - toolbar `Image` button uploads via `/api/v1/uploads`
    - inserts markdown image syntax into content automatically
  - Moderation revision review page polish:
    - format badges (`live` vs `pending`)
    - quick links (`Live`, `Pending View`, `RAW`, `Blame`, `History`)
  - Keeper markdown seed migration added:
    - `supabase/migrations/2026-02-18-architecture-final-batch-9-keeper-markdown-seed.sql`
    - re-seeds 10 keeper docs in markdown template form and appends active revisions
- v3 Phase B editor re-architecture delivery:
  - Editor rebuilt on CodeMirror 6 (`@uiw/react-codemirror`) with line numbers, active line highlight, and wiki-link autocomplete trigger (`[[`).
  - Markdown pipeline switched to `marked` (GFM enabled), replacing ad-hoc markdown parsing.
  - Embed extensions stabilized:
    - YouTube/Map inline embed syntax with size/align options:
      - `[YouTube|small|medium|large|left|center|right](url)`
      - `[Google Map|small|medium|large|left|center|right](url)`
  - New wiki autocomplete API route added:
    - `GET /api/v1/wiki/autocomplete?q=...&limit=...`
  - Infobox custom block v1 added:
    - `::infobox ... ::` parser + renderer + styles
  - Editor helper UX updated:
    - Collapsed inline manual removed
    - Editor now points to dedicated `Editor Manual` wiki article.
  - Added manual seed migration:
    - `supabase/migrations/2026-02-18-architecture-final-batch-10-editor-manual.sql`
- Wiki page hotfix:
  - Profile dropdown switched to non-modal (`<DropdownMenu modal={false}>`) to prevent TOC visibility/layout side effects while menu is open.

### Currently blocked on
- No infrastructure blocker.
- Product decision pending:
  - Whether to continue with current custom wiki extensions (infobox/embed syntax) or formalize a stricter long-term markup spec.

### Next task for incoming agent
1. Validate editor autocomplete behavior in production-like environment (`[[` suggestions under real dataset).
2. Decide and freeze infobox spec v1:
   - required keys / optional keys / size-align defaults / error handling.
3. Expand `Editor Manual` content with advanced examples and policy-linked guidance.
4. Evaluate long-term markup direction:
   - keep CommonMark+extensions vs adopt a stricter wiki-dialect parser.
5. Continue moderation/report UX hardening and upload policy UX (license/source fields).
6. Keep QA gate and ops runbook aligned with new editor and parser behavior.

### Document pointers
- Docs index: `docs/INDEX.md`
- Architecture blueprint: `docs/architecture/ARCHITECTURE_FINAL.md`
- Ops runbook: `docs/ops/OPERATIONS_PLAYBOOK.md`
- QA gate: `docs/qa/QA_RELEASE_GATE.md`
- Latest QA run: `docs/qa/QA_RUN_2026-02-18.md`
- UI guide: `docs/ui/UI_GUIDE.md`

### Recent git commits
- `717b409` fix: flush sentry test event before response
- `f566a50` feat: finalize architecture rollout, moderation, and observability baseline
- Working tree includes uncommitted editor/parser migration and handoff-doc updates from latest session.

## 1. Handoff Protocol

### Incoming agent checklist
1. Read `MASTERPLAN.md` Section 0.
2. Read `AGENT_INSTRUCTION.md`.
3. Read `docs/INDEX.md` and then only relevant docs.
4. Continue from "Next task for incoming agent" unless user overrides.

### Outgoing agent checklist
1. Update Section 0 of this file.
2. Append an entry in `SESSION_LOG.md`.
3. If new markdown docs were created, register them in `docs/INDEX.md`.
4. Commit and push if user requested.

## 2. Document Governance (strict)

### Canonical ownership
- `MASTERPLAN.md`: live status + next action only.
- `SESSION_LOG.md`: chronological execution history only.
- `AGENT_INSTRUCTION.md`: stable coding and handoff rules only.
- `docs/architecture/*`: architecture decisions and ticket boards.
- `docs/ops/*`: operations, backup, monitoring.
- `docs/qa/*`: release gate and run records.
- `docs/ui/*`: design system and UI guidance.

### Mandatory rule for any new `.md`
If an agent creates a new workstream markdown file, they MUST:
1. Add it to `docs/INDEX.md`.
2. Mention it in Section 0 of this file.
3. Log it in `SESSION_LOG.md` with why it was created.

If any of the three is missing, handoff is incomplete.
