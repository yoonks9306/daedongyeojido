# KorWiki (대동여지도)

Production-oriented travel wiki/community platform built with Next.js + Supabase.

## Start

```bash
cd /Users/jamesy/Documents/대동여지도
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Docs Entry

Read this order first:
1. `MASTERPLAN.md` (current state + next task)
2. `AGENT_INSTRUCTION.md` (execution rules)
3. `docs/INDEX.md` (all detailed docs map)

Detailed docs live under `docs/`:
- `docs/architecture/ARCHITECTURE_FINAL.md`
- `docs/ops/OPERATIONS_PLAYBOOK.md`
- `docs/qa/QA_RELEASE_GATE.md`
- `docs/ui/UI_GUIDE.md`

## Rule

If a new workstream markdown file is created, it must be registered in:
1. `docs/INDEX.md`
2. `MASTERPLAN.md` (Section 0)
3. `SESSION_LOG.md`
