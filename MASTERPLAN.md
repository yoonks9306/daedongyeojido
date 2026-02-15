# KorWiki — Project Tracker

> **How to use this file**: Single source of truth for all contributors and AI agents.
> Before starting ANY work: read this file top to bottom.
> Before ending ANY session: update Section 0 (Current State) and relevant milestone checkboxes.
> Last updated: 2026-02-15

---

## 0. CURRENT STATE (Update this every session — AI agents must read + write here)

### Last completed work
- **Phase 2 Authentication**: FULLY COMPLETE — local + production verified
  - GitHub OAuth working on both `localhost:3000` and `daedongyeojido.vercel.app`
  - Vercel env vars set: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `NEXTAUTH_URL`
  - Google OAuth not set up (skipped — GitHub alone sufficient for now)

### Currently blocked on
- Nothing. Phase 2 done. Ready for Phase 3.

### Next task for incoming agent
**Phase 3 — Supabase Database**
1. Create Supabase project at supabase.com
2. Connect Supabase to Vercel (via Vercel Integration or env vars)
3. Design schema: `User`, `WikiArticle`, `CommunityPost`, `Vote`, `Comment`
4. Install `@supabase/supabase-js` + `@supabase/ssr`
5. Create `src/lib/supabase.ts` client
6. Seed DB from existing static data files in `src/data/`
7. Replace static data imports with Supabase queries

### Recent git commits
- `49ab0d9` chore: update MASTERPLAN + SESSION_LOG — Phase 2 local OAuth verified
- `6306655` docs: add SESSION_LOG.md and fix stale path in AGENT_INSTRUCTION.md
- `04d2b2a` chore: add agent handoff protocol + fix page title
- `285045d` feat: add NextAuth.js v5 authentication (Google + GitHub OAuth)

---

## AGENT HANDOFF PROTOCOL

> This section defines how AI agents hand off work to each other across context windows.

### For the incoming agent (you, reading this)

1. **Read Section 0** (above) — this tells you exactly where the previous agent stopped
2. **Read `AGENT_INSTRUCTION.md`** — coding conventions and architecture rules
3. **Read the specific files** mentioned in "Last completed work"
4. **Do NOT re-do completed work** — check the milestone checkboxes carefully
5. **Start with "Next task for incoming agent"** unless the user gives new instructions

### For the outgoing agent (you, finishing a session)

Before your context runs out, update Section 0:
- Move completed items to "Last completed work"
- Update "Currently blocked on" with any blockers
- Update "Next task for incoming agent" with the precise next step
- Update the "Recent git commits" list
- Update milestone checkboxes below
- Commit + push everything (never leave uncommitted work)

### Handoff message template (for the user to give to the next agent)

```
Read MASTERPLAN.md Section 0 first, then AGENT_INSTRUCTION.md.
The previous agent stopped at: [paste "Next task" from Section 0]
Continue from there.
```

---

## 1. What Is This?

**KorWiki** is an English-language travel wiki for foreigners visiting Korea.
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
| Framework | Next.js 16 (App Router) | TypeScript, `src/` dir, `@/*` alias |
| Styling | Custom CSS Modules | No Tailwind. CSS custom properties for theming |
| Auth | NextAuth.js v5 (Auth.js) | Google + GitHub OAuth — credentials pending |
| Data (MVP) | Static `.ts` files | No DB yet — swap in Phase 3 |
| Database | Not yet implemented | Planned: Supabase (recommended for Vercel) |
| Hosting | Vercel | Connected to GitHub `main` branch, auto-deploy |
| Ads | Placeholder slots | Planned: Google AdSense |
| Node | v25.6.1 at `/opt/homebrew/bin` | Requires `export PATH="/opt/homebrew/bin:$PATH"` |

---

## 3. Directory Structure

```
daedongyeojido/             ← git root = Next.js app root
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (AuthProvider + ThemeProvider + Navigation + footer)
│   │   ├── page.tsx            ← Guide tab (landing page)
│   │   ├── globals.css         ← Full design system (CSS custom properties)
│   │   ├── api/auth/[...nextauth]/route.ts  ← NextAuth handler
│   │   ├── wiki/
│   │   │   ├── page.tsx        ← Wiki index (search + category filter)
│   │   │   └── [slug]/page.tsx ← Individual wiki article (SSG, 20 pages)
│   │   ├── community/
│   │   │   ├── page.tsx        ← Community board (tabs: All/Daily/Weekly/Monthly Best)
│   │   │   └── community.module.css
│   │   ├── login/
│   │   │   └── page.tsx        ← Login page (Google + GitHub OAuth wired up)
│   │   └── guide/
│   │       └── guide.module.css
│   ├── components/
│   │   ├── Navigation.tsx      ← Sticky nav: logo, tabs, search, theme toggle, user avatar/login
│   │   ├── Navigation.module.css
│   │   ├── ThemeProvider.tsx   ← Dark/light mode context (localStorage + prefers-color-scheme)
│   │   ├── AuthProvider.tsx    ← SessionProvider wrapper (client component)
│   │   ├── WikiArticle.tsx     ← Article renderer (sidebar ToC + infobox + body)
│   │   ├── WikiArticle.module.css
│   │   ├── SidebarToC.tsx      ← IntersectionObserver ToC (active section tracking)
│   │   ├── AdBanner.tsx        ← Ad placeholder (leaderboard 728×90, rectangle 300×250)
│   │   └── AdBanner.module.css
│   ├── data/
│   │   ├── wiki-articles.ts    ← 20 seed articles (static, no DB)
│   │   ├── guide-content.ts    ← 7 guide sections
│   │   └── community-posts.ts  ← 15 mock community posts
│   ├── auth.ts                 ← NextAuth config (Google + GitHub providers)
│   └── types/
│       └── index.ts            ← Shared TypeScript interfaces
├── public/
├── package.json                ← name: "korwiki", next-auth@beta installed
├── next.config.ts
├── tsconfig.json
├── vercel.json                 ← Explicit Vercel build config
├── .env.local                  ← NEVER commit — fill in OAuth credentials
├── .env.example                ← Template for .env.local (safe to commit)
├── .gitignore
├── MASTERPLAN.md               ← YOU ARE HERE — central tracker
├── AGENT_INSTRUCTION.md        ← AI agent coding instructions
└── .claude/
    ├── agents/                 ← Custom AI sub-agents
    └── settings.json
```

---

## 4. Design System (Key Tokens)

Defined in `src/app/globals.css`.

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
- [x] Repo initialized, pushed to GitHub
- [x] Next.js 16 scaffold (TypeScript, App Router, `src/` dir)
- [x] CSS design system (globals.css with full token set)
- [x] ThemeProvider (dark/light, localStorage persistence)
- [x] Navigation component (sticky, 3 tabs, search, theme toggle, login icon)
- [x] Vercel connected (auto-deploy from `main`)
- [x] Professional repo structure (Next.js at root, no subdirectory)

### Phase 1 — MVP Content ✅ COMPLETE
- [x] Guide tab (7 sections, sticky sidebar, emergency numbers)
- [x] Wiki tab (index with search + category filter)
- [x] Wiki article pages (20 seed articles, SSG with `generateStaticParams`)
- [x] WikiArticle renderer (infobox, sidebar ToC, internal links, `<del>` tips)
- [x] SidebarToC (IntersectionObserver active section tracking)
- [x] Community tab (posts list, Daily/Weekly/Monthly Best tabs, upvote UI)
- [x] Ad slots (leaderboard below nav, rectangle in wiki sidebar)
- [x] Login page UI (email/pass stub, Google + GitHub OAuth buttons)

### Phase 2 — Authentication ✅ COMPLETE
- [x] Install NextAuth.js v5 (`next-auth@beta`)
- [x] Create `src/auth.ts` with Google + GitHub providers
- [x] Create `/api/auth/[...nextauth]/route.ts`
- [x] Add `SessionProvider` to root layout (via `AuthProvider.tsx`)
- [x] Update `/login/page.tsx` to use real `signIn()` (OAuth) + error message for email
- [x] Session-aware Navigation (avatar when logged in, click to sign out)
- [x] Fill OAuth credentials in `.env.local` (GitHub OAuth verified locally)
- [x] Add env vars to Vercel dashboard + configure production callback URL (verified working)
- [ ] Protected routes: community posting, wiki editing
- [ ] User profile page (`/profile/[username]`) — Phase 3 dependency

### Phase 3 — Database & Backend 🔴 NOT STARTED
- [ ] Choose DB: **Supabase** (recommended — easy Vercel integration)
- [ ] Schema: User, WikiArticle, CommunityPost, Vote, Comment
- [ ] Migrate static data files → DB seed scripts
- [ ] API routes: `/api/v1/wiki/`, `/api/v1/community/`, `/api/v1/auth/`
- [ ] Community post submission form + POST endpoint
- [ ] Upvote persistence (currently UI-only, no backend)
- [ ] Best posts algorithm (score = upvotes × recency_weight)
- [ ] Wiki article create/edit form (for authenticated users)
- [ ] Comment system
- [ ] Email/password auth (requires User table in DB)

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

### Phase 6 — Deployment 🟡 IN PROGRESS
- [x] Vercel project connected (auto-deploy from GitHub `main`)
- [x] `vercel.json` with explicit build config
- [ ] OAuth callback URLs configured in Google + GitHub (needs credentials)
- [ ] `AUTH_SECRET` + OAuth env vars set in Vercel dashboard
- [ ] Custom domain setup

### Phase 7 — Polish & Mobile 🟡 PARTIAL
- [x] Responsive CSS (collapses at 768px, 480px)
- [ ] Mobile nav: hamburger menu or bottom navigation bar
- [ ] PWA manifest
- [ ] Loading states / skeleton screens
- [ ] Error boundaries
- [ ] 404 page with suggestions
- [ ] Accessibility audit (keyboard nav, ARIA labels)

---

## 6. Known Issues

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 1 | OAuth credentials not filled | Blocked | `.env.local` needs AUTH_SECRET, Google, GitHub credentials |
| 2 | No DB | Open | All data is static `.ts` files. Votes, posts, edits not persisted |
| 3 | Community upvote is UI-only | Open | State is local, resets on refresh. Needs Phase 3 |
| 4 | Mobile: no hamburger nav | Open | Tabs shrink but no dedicated mobile nav pattern |
| 5 | Best post algorithm is client-side sort | Open | Needs recency weighting + DB |
| 6 | Email/password login disabled | By design | Stubbed until DB is ready (Phase 3) |

---

## 7. Environment & Commands

```bash
# Always prefix with this on this machine:
export PATH="/opt/homebrew/bin:$PATH"

# Build (from repo root):
npm run build

# Dev server:
npm run dev

# Project root:
/Users/jamesy/Documents/대동여지도/

# Git remote:
https://github.com/yoonks9306/daedongyeojido
```

Node.js: v25.6.1 at `/opt/homebrew/bin/node`
Claude's primary working dir: `/Users/jamesy/Documents/Study` (always use absolute paths)

---

## 8. AI Agent Coding Rules

See `AGENT_INSTRUCTION.md` for full coding conventions.

Quick reference:
- No Tailwind. CSS Modules + CSS custom properties only.
- Never add a DB without updating Section 2 (Tech Stack) above.
- Build must pass: `export PATH="/opt/homebrew/bin:$PATH" && npm run build`
- Update Section 0 before ending any session.
