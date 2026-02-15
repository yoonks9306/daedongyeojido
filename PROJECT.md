# KorWiki — Project Tracker

> **How to use this file**: This is the single source of truth for all contributors and AI agents.
> Before starting any work, read this file top to bottom. Update relevant sections when you complete tasks.
> Last updated: 2026-02-15

---

## 1. What Is This?

**KorWiki** (가칭, codename) is an English-language travel wiki for foreigners visiting Korea.
Modeled after **Namu Wiki (나무위키)** — dense, community-driven, well-structured.

Brand voice: helpful, dense, insider-knowledge-forward. Not a tourist brochure — more like a Reddit power user's guide.

**Three tabs:**
| Tab | Route | Purpose |
|-----|-------|---------|
| Guide | `/` | Curated editorial travel essentials (non-community) |
| Wiki | `/wiki` | Namu-style articles with ToC, infobox, internal links |
| Community | `/community` | Free board, reviews, Best post ranking (daily/weekly/monthly) |

---

## 2. Tech Stack (Finalized)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router) | TypeScript, `src/` dir, `@/*` alias |
| Styling | Custom CSS Modules | No Tailwind. CSS custom properties for theming |
| Data (MVP) | Static `.ts` files | No DB yet — swap in Phase 2 |
| Auth | Not yet implemented | Planned: NextAuth.js (Google + GitHub providers) |
| Database | Not yet implemented | Planned: Prisma + PostgreSQL (or Supabase) |
| Hosting | Not yet deployed | Planned: Vercel |
| Ads | Placeholder slots | Planned: Google AdSense |
| Node | v25.6.1 at `/opt/homebrew/bin` | Requires `export PATH="/opt/homebrew/bin:$PATH"` |

---

## 3. Directory Structure

```
대동여지도/
├── PROJECT.md              ← YOU ARE HERE — central tracker
├── CLAUDE.md               ← AI agent coding instructions
├── frontend/               ← Next.js 15 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          ← Root layout (ThemeProvider + Navigation + footer)
│   │   │   ├── page.tsx            ← Guide tab (landing page)
│   │   │   ├── globals.css         ← Full design system (CSS custom properties)
│   │   │   ├── wiki/
│   │   │   │   ├── page.tsx        ← Wiki index (search + category filter)
│   │   │   │   └── [slug]/page.tsx ← Individual wiki article (SSG, 20 pages)
│   │   │   ├── community/
│   │   │   │   ├── page.tsx        ← Community board (tabs: All/Daily/Weekly/Monthly Best)
│   │   │   │   └── community.module.css
│   │   │   ├── login/
│   │   │   │   └── page.tsx        ← Login + signup toggle (auth NOT connected)
│   │   │   └── guide/
│   │   │       └── guide.module.css
│   │   ├── components/
│   │   │   ├── Navigation.tsx      ← Sticky nav: logo, tabs, search, theme toggle, login icon
│   │   │   ├── Navigation.module.css
│   │   │   ├── ThemeProvider.tsx   ← Dark/light mode context (localStorage + prefers-color-scheme)
│   │   │   ├── WikiArticle.tsx     ← Article renderer (sidebar ToC + infobox + body)
│   │   │   ├── WikiArticle.module.css
│   │   │   ├── SidebarToC.tsx      ← IntersectionObserver ToC (active section tracking)
│   │   │   ├── AdBanner.tsx        ← Ad placeholder (leaderboard 728×90, rectangle 300×250)
│   │   │   └── AdBanner.module.css
│   │   ├── data/
│   │   │   ├── wiki-articles.ts    ← 20 seed articles (static, no DB)
│   │   │   ├── guide-content.ts    ← 7 guide sections
│   │   │   └── community-posts.ts  ← 15 mock community posts
│   │   └── types/
│   │       └── index.ts            ← Shared TypeScript interfaces
│   ├── package.json
│   └── next.config.ts
├── docs/
│   └── decisions/          ← Architecture Decision Records (ADR)
└── .claude/
    ├── agents/             ← Custom AI sub-agents
    │   ├── CTO.md          ← senior-clean-architect (blue, opus)
    │   ├── CEO.md          ← wiki-operations-veteran (red, sonnet)
    │   └── CDO.md          ← ui-ux-visual-master (yellow, sonnet)
    └── settings.json       ← Project-level Claude permissions
```

---

## 4. Design System (Key Tokens)

Defined in `frontend/src/app/globals.css`.

| Token | Value | Use |
|-------|-------|-----|
| `--color-accent` | `#c0392b` | Korean red — CTAs, active states, logo |
| `--color-bg-primary` | dark: `#0d1117` / light: `#ffffff` | Page background |
| `--color-bg-nav` | dark: `#161b22` / light: `#f8f9fa` | Nav background |
| `--nav-height` | `56px` | Fixed nav height |
| `--ad-banner-height` | `106px` | Fixed leaderboard ad slot height |
| `--sidebar-width` | `240px` | Wiki/Guide sidebar |
| `--content-max-width` | `1280px` | Max content width |
| Default theme | **dark** | Set via `ThemeProvider` → localStorage |

**Dark mode**: `[data-theme='dark']` on `<html>` element.
**Namu Wiki `<del>` convention**: strikethrough text = insider tip → `del::after { content: ' ✦'; color: var(--color-accent); }`

---

## 5. Milestone Tracker

### Phase 0 — Project Setup ✅ COMPLETE
- [x] Repo initialized
- [x] Next.js 15 scaffold (`npx create-next-app@latest`)
- [x] TypeScript + ESLint configured
- [x] CSS design system (globals.css with full token set)
- [x] ThemeProvider (dark/light, localStorage persistence)
- [x] Navigation component (sticky, 3 tabs, search, theme toggle, login icon)
- [x] 26 static pages building successfully (`npm run build`)

### Phase 1 — MVP Content ✅ COMPLETE
- [x] Guide tab (7 sections, sticky sidebar, emergency numbers)
- [x] Wiki tab (index with search + category filter)
- [x] Wiki article pages (20 seed articles, SSG with `generateStaticParams`)
- [x] WikiArticle renderer (infobox, sidebar ToC, internal links, `<del>` tips)
- [x] SidebarToC (IntersectionObserver active section tracking)
- [x] Community tab (posts list, Daily/Weekly/Monthly Best tabs, upvote UI)
- [x] Ad slots (leaderboard below nav, rectangle in wiki sidebar)
- [x] Login page UI (email/pass, Google OAuth stub, GitHub OAuth stub)

### Phase 2 — Authentication 🔴 NOT STARTED
- [ ] Install NextAuth.js (`npm install next-auth`)
- [ ] Configure Google OAuth provider (needs Google Cloud Console credentials)
- [ ] Configure GitHub OAuth provider (needs GitHub App credentials)
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Add `SessionProvider` to root layout
- [ ] Update `/login/page.tsx` to use `signIn()` / `signUp()`
- [ ] Protected routes: community posting, wiki editing
- [ ] User profile page (`/profile/[username]`)
- [ ] Session-aware Navigation (show username/avatar when logged in)

### Phase 3 — Database & Backend 🔴 NOT STARTED
- [ ] Choose DB: Supabase (recommended for Vercel) or Prisma + PostgreSQL
- [ ] Schema: User, WikiArticle, CommunityPost, Vote, Comment
- [ ] Migrate static data files → DB seed scripts
- [ ] API routes: `/api/v1/wiki/`, `/api/v1/community/`, `/api/v1/auth/`
- [ ] Community post submission form + POST endpoint
- [ ] Upvote persistence (currently UI-only, no backend)
- [ ] Best posts algorithm (score = upvotes × recency_weight)
- [ ] Wiki article create/edit form (for authenticated users)
- [ ] Comment system

### Phase 4 — Content & SEO 🟡 PARTIAL
- [ ] `sitemap.ts` (Next.js built-in)
- [ ] `robots.ts`
- [ ] `opengraph-image` per wiki article
- [ ] Expand wiki articles (target: 100+)
- [ ] Expand guide sections
- [x] Internal hyperlinks between wiki articles
- [ ] Korean-language metadata for SEO

### Phase 5 — Monetization 🔴 NOT STARTED
- [x] Ad slot placeholders (leaderboard 728×90, rectangle 300×250)
- [ ] Google AdSense account setup
- [ ] Replace placeholder divs with `<Script>` + AdSense code
- [ ] Verify ad slots don't break layout on mobile

### Phase 6 — Deployment 🔴 NOT STARTED
- [ ] Vercel project setup (`vercel link`)
- [ ] Environment variables: `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GITHUB_CLIENT_ID`, DB URL
- [ ] Custom domain setup
- [ ] CI/CD (GitHub Actions or Vercel auto-deploy from main)

### Phase 7 — Polish & Mobile 🟡 PARTIAL
- [x] Responsive CSS (collapses at 768px, 480px)
- [ ] Mobile nav: hamburger menu or bottom navigation bar
- [ ] PWA manifest
- [ ] Loading states / skeleton screens
- [ ] Error boundaries
- [ ] 404 page with suggestions
- [ ] Accessibility audit (keyboard nav, ARIA labels)

---

## 6. Known Issues & Decisions

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 1 | Auth not connected | Open | `/login/page.tsx` shows `alert()` stub. Needs NextAuth.js |
| 2 | No DB | Open | All data is static `.ts` files. Votes, posts, edits are not persisted |
| 3 | Community upvote is UI-only | Open | Button exists, state is local, resets on refresh |
| 4 | AdBanner import unused in community/page.tsx | Minor | `import AdBanner` left in file but not used — safe to remove |
| 5 | `page.module.css` from create-next-app | Minor | Default file exists, unused, harmless |
| 6 | Mobile: no hamburger nav | Open | Tabs shrink but no dedicated mobile nav pattern |
| 7 | Best post algorithm is client-side sort | Open | Currently just `sort by upvotes`. Real algorithm needs recency weighting |

---

## 7. AI Agent Guide

> For Claude, Gemini, Codex, or any AI picking up this project:

### How to get context fast
1. Read `PROJECT.md` (this file) — current state
2. Read `CLAUDE.md` — coding conventions and architecture rules
3. Read `frontend/src/app/globals.css` — design tokens
4. Read the relevant component/page file before editing it

### Agent roles (`.claude/agents/`)
- **CTO.md** (`senior-clean-architect`) — React components, Next.js architecture, TypeScript
- **CEO.md** (`wiki-operations-veteran`) — Content, data files, wiki articles, community strategy
- **CDO.md** (`ui-ux-visual-master`) — CSS, design system, layout, visual polish

### Critical rules
- Never use Tailwind. Always use CSS Modules + CSS custom properties.
- Never add a DB without updating the tech stack section above.
- Always mark tasks complete in this file when done.
- When adding new pages/components, add them to the directory structure above.
- Build must pass: `cd frontend && export PATH="/opt/homebrew/bin:$PATH" && npm run build`

### Environment
- Node.js: v25.6.1 at `/opt/homebrew/bin/node`
- Always prefix npm/npx/node commands with: `export PATH="/opt/homebrew/bin:$PATH" &&`
- Primary working dir: `/Users/jamesy/Documents/Study` (Claude's default)
- Project root: `/Users/jamesy/Documents/대동여지도/`

---

## 8. Recommended Next Step

**Phase 2 — Authentication** is the highest-value unblocked task.

```bash
cd frontend && npm install next-auth
```

The login UI at `/login/page.tsx` is already built. Just needs:
1. `next-auth` package
2. Google + GitHub OAuth credentials (from Google Cloud Console + GitHub Apps)
3. `/api/auth/[...nextauth]/route.ts` config file
4. `signIn()` calls replacing the `alert()` stubs

This unlocks community posting, wiki editing, and user-level features.
