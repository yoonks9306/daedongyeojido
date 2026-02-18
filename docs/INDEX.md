# Docs Index

Last updated: 2026-02-18

## Reading Order

1. `MASTERPLAN.md` for current status and immediate next task.
2. `AGENT_INSTRUCTION.md` for execution rules and handoff policy.
3. The specific document below for the active workstream.

## Core Docs

- Architecture blueprint: `docs/architecture/ARCHITECTURE_FINAL.md`
- Operations and recovery: `docs/ops/OPERATIONS_PLAYBOOK.md`
- QA gate checklist: `docs/qa/QA_RELEASE_GATE.md`
- Latest QA execution snapshot: `docs/qa/QA_RUN_2026-02-18.md`
- UI system guide: `docs/ui/UI_GUIDE.md`

## Ownership Rules

- `MASTERPLAN.md` = current state only (what was finished, blockers, exact next task).
- `SESSION_LOG.md` = chronological session history only.
- `AGENT_INSTRUCTION.md` = stable execution rules only.
- `docs/*` = detailed domain docs (architecture, qa, ops, ui).

## Mandatory Registration Rule

If any agent creates a new workstream markdown document:

1. Add it to this file (`docs/INDEX.md`) in the right section.
2. Mention it in `MASTERPLAN.md` Section 0 (Current State or Next Task).
3. Append a note in `SESSION_LOG.md` with file path and purpose.

If this rule is not followed, handover is considered incomplete.
