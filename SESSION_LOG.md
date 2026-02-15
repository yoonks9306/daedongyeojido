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

## 2026-02-16 — Codex (GPT-5) — Phase 3: Community write/vote backend

- Added `POST /api/v1/community/posts` route with auth guard and Supabase insert
- Added `POST/DELETE /api/v1/community/posts/[id]/vote` route and upvote count sync to `community_posts.upvotes`
- Added `/community/new` page + `NewCommunityPostForm.tsx` (authenticated-only, redirect to login when unauthenticated)
- Updated `CommunityClient.tsx` vote button to call vote API and added `Write Post` entry point
- Added `src/lib/supabase-admin.ts` and `src/lib/community-auth-user.ts` for server-side writes
- Extended `supabase/schema.sql` with `user_identities` mapping table (NextAuth user → Supabase Auth user bridge)
- Build verified after changes: 29 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Phase 3: Wiki create/edit flow

- Added `POST /api/v1/wiki/articles` and `PATCH /api/v1/wiki/articles/[slug]` (auth required)
- Added protected routes `/wiki/new` and `/wiki/[slug]/edit`
- Added reusable `src/app/wiki/WikiEditorForm.tsx` + `wiki-editor.module.css`
- Added helper `src/lib/wiki-utils.ts` (category validation + slugify)
- Added UI entry points: `Write Article` on wiki index and `Edit Article` on wiki detail
- Build verified after changes: 31 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Phase 3: Community comments

- Added `/community/[id]` detail page with full post content and comment section
- Added `GET/POST /api/v1/community/posts/[id]/comments` routes
- Comment submission requires login; unauthenticated users are redirected to login with callback
- Synced `community_posts.comment_count` after each comment insert
- Updated community list: post title now links to detail page
- Build verified after changes: 32 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Phase 3: Best ranking + credentials auth

- Added Credentials auth path in NextAuth (`src/auth.ts`) alongside Google/GitHub OAuth
- Added email/password register API: `POST /api/v1/auth/register`
- Added local account storage + hashing (`local_auth_users`, `src/lib/password.ts`, `src/lib/local-auth-users.ts`)
- Updated `/login` page to support real sign-up/sign-in with callback URL handling
- Upgraded community Best ranking to score-based sort (`upvotes × recency_weight`)
- Added DB migration `supabase/migrations/2026-02-16-local-auth-users.sql`
- Updated `MASTERPLAN.md` tech stack + Phase 3 tracker to match code state
- Build verified after changes: 33 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Ops sync note

- User confirmed manual DB apply completed in Supabase SQL Editor:
  - `2026-02-16-user-identities.sql`
  - `2026-02-16-local-auth-users.sql`
  - full `supabase/schema.sql`
- User confirmed Vercel environment variables already configured with Claude Code.

## 2026-02-16 — Codex (GPT-5) — UI hotfix: visited link color

- Fixed global visited-link behavior to keep brand link color consistent (no purple visited state)
- Updated `src/app/globals.css`: `a:visited` now uses `var(--color-text-link)`

## 2026-02-16 — Codex (GPT-5) — Phase 4: SEO foundation

- Added `src/app/sitemap.ts` with static + wiki + community detail URLs
- Added `src/app/robots.ts` with host and sitemap settings
- Added base social preview image route: `src/app/opengraph-image.tsx`
- Added wiki per-article OG image route: `src/app/wiki/[slug]/opengraph-image.tsx`
- Updated root metadata (`layout.tsx`) with metadataBase, Open Graph/Twitter config, and Korean SEO keywords
- Updated wiki article metadata to include per-article OG/Twitter image
- Build verified after changes: 36 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Phase 4: Guide IA/UX expansion

- Redesigned Guide page into 8 top categories (`Start Here`, `Arrival & Transport`, `Money`, `Connectivity & Apps`, `Lifestyle`, `Accommodations`, `Health & Safety`, `Work & Study`)
- Implemented docs-style guide explorer (`GuideExplorer.tsx`): top tabs + left nav + right page TOC
- Replaced guide data model with scalable `tab -> group -> entry` structure (`src/data/guide-content.ts`)
- Added real-time money widget (`ExchangeRateWidget.tsx`) for USD/JPY/CNY with dropdown selector
- Added exchange-rate API proxy route: `GET /api/v1/exchange-rates`
- Updated shared guide types to align with the new structure
- Build verified after changes: 37 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — UI tweak: exchange widget input/flags

- Changed exchange amount input from numeric spinner to plain text input (`inputMode="decimal"`)
- Added flag indicators for USD/JPY/CNY in rate cards and dropdown options
- Build verified after changes: 37 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Guide nav model split + content enrichment

- Removed numbering in top guide tabs (plain text labels only)
- Changed left guide nav from `#` anchors to per-domain URLs via new route: `/guide/[groupId]`
- Kept right panel as true in-page TOC (entry headers within current domain page)
- Updated Guide explorer flow to render one selected domain document at a time
- Expanded guide content density with additional real-world friction entries across all major domains
- Build verified after changes: 37 routes generated, TypeScript pass

## 2026-02-16 — Codex (GPT-5) — Phase 4: Wiki expansion batch 1

- Added migration `supabase/migrations/2026-02-16-wiki-expansion-batch-1.sql`
- Insert/upsert payload includes 18 practical wiki articles targeting top foreigner pain points
- Each new article includes infobox, structured section headings, related article links, tags, and references section
- Updated `supabase/DB_APPLY_CHECKLIST.md` with the new migration run order and row-count verification query
- Migration designed idempotent (`on conflict (slug) do update`) for safe reruns

## 2026-02-16 — Claude (Opus) — Google OAuth + UX polish + live data

- Added Google OAuth credentials to `.env.local`; verified working locally and on Vercel
- Built profile dropdown menu (user info / IP for guests, dark/light toggle, sign out)
- Removed standalone theme toggle icon from nav bar
- Fixed wiki TOC: replaced IntersectionObserver with scroll-position-based active tracking (fixes multi-highlight bug)
- Switched exchange rate API from frankfurter.app → open.er-api.com (KRW support)
- Fixed wiki Last Updated to use actual DB `updated_at` timestamp
- Community polish: anonymous posting option, admin-only delete (server + client), SVG icons replacing emoji
- Made community post list items fully clickable (not just title)
- Added `force-dynamic` to community pages for live view/comment counts
- Changed community page to use Supabase aggregate join `comments(count)` for real comment counts
- Added `increment_views` RPC function (`supabase/migrations/2026-02-16-increment-views-rpc.sql`)
- Committed as `d3122ec`, pushed to `main`

## 2026-02-16 — Claude (Opus) — Phase 5: AdSense + Community voting features

- **Key decision**: 콘텐츠(위키 100+편 등)는 나중에 채워넣기로 하고, 구조/기능 완성에 집중하기로 결정
- Fixed view count: `void supabaseAdmin.rpc(...)` → `await` before fetch (fire-and-forget 버그 수정, `b019968`)
- Integrated Google AdSense (`ca-pub-1126883662685001`): `next/script` with `beforeInteractive` strategy
- Replaced ad placeholder divs with real `<ins class="adsbygoogle">` tags in `AdBanner.tsx`
- Removed leaderboard ad from layout (AdSense 승인 전 빈 공간 문제)
- **AdSense site verification 실패** — `beforeInteractive` 적용했으나 Google 크롤러가 인식 못함. 미해결 상태.
- Added anonymous comment option (checkbox in comment form + backend support)
- Added comment upvote/downvote system: `comment_votes` table, `recalculate_comment_score` RPC, vote API (`POST/DELETE /api/v1/community/comments/[commentId]/vote`)
- Added post upvote/downvote buttons at bottom of post detail content area
- DB migration required: `supabase/migrations/2026-02-16-comment-votes.sql`
- Commits: `b019968` (view count fix), `4d0f485` (AdSense), `8aafe8c` (AdSense fix), `a506672` (voting + anonymous)
