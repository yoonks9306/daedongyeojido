# KorWiki — Agent Instruction

Last updated: 2026-02-18

## 1. First Read Order

Every incoming agent must read in this exact order:
1. `MASTERPLAN.md` (Section 0 only first)
2. `AGENT_INSTRUCTION.md` (this file)
3. `docs/INDEX.md`
4. The specific doc linked for the active task

## 2. Document Map Rules

### Where to find what
- Live status and next task: `MASTERPLAN.md`
- Session history: `SESSION_LOG.md`
- Architecture and ticket board: `docs/architecture/ARCHITECTURE_FINAL.md`
- Operations and backup/recovery: `docs/ops/OPERATIONS_PLAYBOOK.md`
- QA gate and run logs: `docs/qa/QA_RELEASE_GATE.md`, `docs/qa/QA_RUN_*.md`
- UI design system: `docs/ui/UI_GUIDE.md`

### If an agent creates a new markdown file
They MUST do all three before ending session:
1. Register path and purpose in `docs/INDEX.md`.
2. Mention it in `MASTERPLAN.md` Section 0.
3. Append it to `SESSION_LOG.md` with a short reason.

If any item is missing, handoff is invalid.

## 3. Coding Conventions

- Framework: Next.js 16 App Router + TypeScript strict.
- Styling: Tailwind CSS v4 + shadcn/ui only.
- Do not reintroduce `.module.css` files.
- Use `cn()` from `@/lib/utils` for class merging.
- API routes stay under `/api/v1/...`.
- Use `@/*` imports.
- Add `'use client'` only when necessary.

## 4. Architecture Constraints

1. Role-based authorization is canonical (`user_profiles.role`).
2. Revision workflow is append-only (`wiki_revisions`) with rollback/moderation.
3. Emergency lock can block writes globally.
4. Search contract uses RPC-based ranking (`search_wiki_advanced`).
5. Uploads are policy-controlled (`media_uploads` + storage bucket).

## 5. Build and Verification

```bash
cd /Users/jamesy/Documents/대동여지도
npm run build
```

Before ending a significant change:
1. Build must pass.
2. Relevant doc pointers must be updated.
3. Session summary must be appended to `SESSION_LOG.md`.
