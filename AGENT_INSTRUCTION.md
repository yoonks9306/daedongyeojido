# 대동여지도 — AI Agent Instructions

> **Project tracker**: See `MASTERPLAN.md` for milestones, status, and current tasks.
> This file contains coding conventions and architecture rules for AI agents.

---

## Agent Personas

Three custom sub-agents live in `.claude/agents/`:

| File | Persona | Model | Specialty |
|------|---------|-------|-----------|
| `CTO.md` | `senior-clean-architect` | opus / blue | React components, Next.js, TypeScript, architecture |
| `CEO.md` | `wiki-operations-veteran` | sonnet / red | Content strategy, wiki articles, seed data, community |
| `CDO.md` | `ui-ux-visual-master` | sonnet / yellow | CSS, design system, layout, visual polish |

Note: These personas cannot be invoked via `subagent_type` in the Task tool — use `general-purpose` agents with their philosophy embedded in the prompt.

---

## Coding Conventions

- **Framework**: Next.js 15 App Router, TypeScript strict mode
- **Styling**: CSS Modules + CSS custom properties. **No Tailwind. No Bootstrap. No styled-components.**
- **Components**: `PascalCase.tsx` in `src/components/`
- **Routes/pages**: kebab-case directories in `src/app/`
- **Data**: TypeScript interfaces in `src/types/index.ts`, data files in `src/data/`
- **API routes**: RESTful, `/api/v1/...`
- **Imports**: Always use `@/*` alias (e.g., `import { wikiArticles } from '@/data/wiki-articles'`)
- **Client components**: Add `'use client'` only when needed (state, events, browser APIs)
- **No emojis** in code comments or component text unless explicitly in spec

---

## Architecture Rules

1. **Dark mode** via `[data-theme='dark']` on `<html>` — never toggle via JS class switches
2. **ThemeProvider** owns theme state — access via `useTheme()` hook
3. **Navigation** renders the leaderboard ad slot globally — never add another leaderboard per-page
4. **Static data files** are MVP placeholders — when DB is added, keep the same TypeScript interfaces
5. **WikiArticle** component handles all article rendering — don't duplicate article layout logic in pages
6. **SSG first**: default to `generateStaticParams` + static rendering; only use `'use client'` where necessary
7. **`<del>` convention**: strikethrough = insider tip (styled by `del::after { content: ' ✦' }` in globals.css)

---

## CSS / Design Rules (CDO)

- All design tokens are in `src/app/globals.css`
- Color: `--color-accent: #c0392b` (Korean red) — do not introduce other accent colors
- Dark mode is the **default** theme
- Layout: desktop-first, responsive breakpoints at 1024px and 768px
- Ad slots: leaderboard (728×90) below nav, rectangle (300×250) in sidebar/content

---

## Content Rules (CEO)

- Wiki article slugs: URL-safe English, kebab-case (e.g., `naver-map`, `korean-bbq`)
- Internal links: `<a href="/wiki/slug">anchor text</a>` inside `dangerouslySetInnerHTML` content
- Insider tips: wrap in `<del>` tags — the CSS will handle the strikethrough + ✦ marker
- Categories: Transport, Apps, Money, SIM/Data, Food, Culture, Entertainment, Shopping, Places, Practical

---

## Build Command

```bash
cd /Users/jamesy/Documents/대동여지도
export PATH="/opt/homebrew/bin:$PATH"
npm run build
```

Expected output: 26 static pages, 0 TypeScript errors.

---

## File Reading Order (new agent onboarding)

1. `MASTERPLAN.md` — current status and what to work on next
2. `SESSION_LOG.md` — chronological history of what each session did
3. `AGENT_INSTRUCTION.md` — this file (conventions)
4. `src/app/globals.css` — design tokens
5. The specific file(s) you're about to edit

---

## Key Domain Rules

1. **Best Post Algorithm**: `score = upvotes × recency_weight`. Define recency windows per tab (daily=24h, weekly=7d, monthly=30d).
2. **Wiki slugs** must be canonical and URL-safe.
3. **Guide** content = editorially controlled. **Wiki** + **Community** = community-contributed.
4. **Spam/abuse**: implement rate limiting and report system when backend is added.
5. **Auth**: use NextAuth.js with Google + GitHub providers (OAuth buttons already exist on login page).
