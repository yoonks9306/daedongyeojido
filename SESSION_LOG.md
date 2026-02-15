# KorWiki — Session Log

> **Purpose**: Chronological record of what each AI agent session did.
> Use alongside `MASTERPLAN.md` (current state) and `AGENT_INSTRUCTION.md` (conventions).
>
> **Rules for all AI agents:**
> 1. Read this file during onboarding to understand project history.
> 2. Append an entry at the END of every session before signing off.
> 3. Keep entries brief — 3-8 bullet points max per session.
> 4. Do NOT duplicate MASTERPLAN.md Section 0 — that tracks current state; this tracks history.
> 5. Format: `## YYYY-MM-DD — [Agent/Model] — [Phase focus]`

---

## 2026-02-10 — Claude (Sonnet) — Phase 0: Project Setup

- Initialized git repo; created Next.js 16 app with TypeScript + App Router at `frontend/`
- Set up CSS design system (`globals.css`) with Korean red (`#c0392b`) accent and dark mode default
- Built `ThemeProvider` (dark/light toggle, localStorage persistence)
- Built `Navigation` component (sticky, 3 tabs, search bar, theme toggle, login icon)
- Connected Vercel project (auto-deploy from `main` branch)

## 2026-02-11 — Claude (Sonnet) — Phase 1: MVP Content

- Built Guide tab (`/`) — 7 sections with sticky sidebar and emergency numbers
- Built Wiki tab — index with search + category filter; 20 seed articles with SSG (`generateStaticParams`)
- Built `WikiArticle` renderer — infobox, sidebar ToC, internal links, `<del>` insider tips
- Built `SidebarToC` — IntersectionObserver active section tracking
- Built Community tab — post list, Daily/Weekly/Monthly Best tabs, upvote UI (client-only)
- Added ad slots: leaderboard 728×90 below nav, rectangle 300×250 in wiki sidebar
- Built Login page — email/pass form (stubbed) + Google/GitHub OAuth button UI

## 2026-02-12 — Claude (Sonnet) — Repo restructure

- Moved Next.js app from `frontend/` subdirectory to repo root (`git mv` to preserve history)
- Removed `frontend/` directory; repo root is now also the Next.js app root
- Cleaned up `.gitignore`, merged path references
- Updated `vercel.json` with explicit build config; removed Root Directory override in Vercel
- Renamed `CLAUDE.md` → `AGENT_INSTRUCTION.md`, `PROJECT.md` → `MASTERPLAN.md`
- Build confirmed: 26 static pages, 0 TypeScript errors

## 2026-02-15 — Claude (Sonnet) — Phase 2: Authentication

- Installed `next-auth@beta` (NextAuth.js v5, App Router compatible)
- Created `src/auth.ts` — Google + GitHub OAuth providers configured
- Created `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API handler
- Created `src/components/AuthProvider.tsx` — `SessionProvider` wrapper (Client Component)
- Updated `src/app/layout.tsx` — wrapped with `AuthProvider`
- Updated `src/app/login/page.tsx` — real `signIn()` calls; email/pass stubbed with "coming soon"
- Updated `src/components/Navigation.tsx` — shows user avatar when logged in, click to sign out
- Created `.env.local` (template, not committed) and `.env.example` (committed)
- Added `!.env.example` exception to `.gitignore`
- Fixed page title: `src/app/page.tsx` metadata → `'KorWiki'`
- Rewrote `MASTERPLAN.md` — added Section 0 (Current State) and Agent Handoff Protocol
- Created `SESSION_LOG.md` (this file)
- GitHub OAuth App created; `.env.local` filled with AUTH_SECRET + GitHub credentials
- **GitHub OAuth verified working locally** (login → avatar in nav → sign out)
- Vercel env vars set; **production OAuth verified on daedongyeojido.vercel.app**
- **Phase 2 COMPLETE**

## 2026-02-16 — Claude (Sonnet) — Phase 3: Supabase Database

- Supabase project created (`jjdtxdsurkcuxwauusfc`); Vercel integration enabled (Production ON)
- `supabase/schema.sql`: tables `wiki_articles`, `community_posts`, `votes`, `comments` with RLS policies
- `supabase/seed.ts`: seeded 20 wiki articles + 15 community posts from static TypeScript data files
- `src/lib/supabase.ts`: Supabase client using `NEXT_PUBLIC_` env vars
- `wiki/[slug]/page.tsx`: SSG via `generateStaticParams` now queries Supabase (not static import)
- `wiki/page.tsx` + `WikiIndexClient.tsx`: server component fetches, client handles search/filter
- `community/page.tsx` + `CommunityClient.tsx`: server component fetches, client handles tabs
- Best post algorithm: recency window filter client-side (daily=24h, weekly=7d, monthly=30d)
- Build: 27 static pages, 0 TypeScript errors — `60ae5ce`
