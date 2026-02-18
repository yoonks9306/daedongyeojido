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

## 2026-02-16 — Codex (GPT-5) — AdSense verification follow-up

- Added `public/ads.txt` for AdSense ownership verification
- ads.txt content: `google.com, pub-1126883662685001, DIRECT, f08c47fec0942fa0`
- Next step: redeploy and verify `https://daedongyeojido.vercel.app/ads.txt` is publicly reachable

## 2026-02-16 — Codex (GPT-5) — Wiki ToC/heading refactor + handoff hardening

- Refined wiki heading UX in `SidebarToC.tsx`:
  - Added stable in-page jump handling via `replaceState` so heading clicks do not stack browser history entries
  - Preserved collapse toggle behavior (header field jump + right-side arrow collapse split)
  - Added heading ID normalization to avoid duplicate React keys (`heading-2` warning fix)
- Synced Guide right-side `On this page` behavior with wiki TOC conventions (visited color + active highlight consistency)
- Removed inline wiki body ad and kept sidebar ad under `CONTENTS` as requested
- Added/updated `supabase/migrations/2026-02-16-kakao-t-footnotes-sample.sql`:
  - Namu-style superscript/reference sample
  - Reference label formatting changed to plain `[n]` hyperlink style (no auto-number or bullet marker)
- Verified builds after each major patch (`npm run build` pass)
- Remaining unresolved issue carried forward:
  - On first document entry (without refresh), heading collapse/jump binding can still fail intermittently on some route transitions
  - Next agent should prioritize root-cause fix for this initialization race
- Monetization handoff note:
  - AdSense wiring is present, but incoming agent must verify real approval + live ad fill status on production

## 2026-02-16 — Claude (Opus) — Wiki first-load heading bind bug 수정 시도 (미해결, 인수인계)

### 증상 (사용자 보고)
- 위키 문서 간 **페이지 전환**(Next.js client-side navigation)시, heading collapse/jump 기능이 **첫 로드에 작동하지 않음**
- **새로고침(F5)하면 정상 작동** — 즉 full page load에서는 문제 없음
- 각주 링크(`#fn-1`, `#fn-2`) 클릭시 `pushState`로 히스토리에 쌓여서 **뒤로가기가 전 페이지가 아닌 앵커 히스토리를 순회**
- 목차(TOC) 클릭이나 heading 클릭 시 smooth scroll 되는데, **나무위키처럼 instant jump로 바꿔달라는 요청**

### 시도 1: 땜빵 수정 (실패)
- `SidebarToC`에 `key={article.slug}` 추가 → React remount 강제
- `requestAnimationFrame` + `MutationObserver` 조합으로 DOM 준비 감지
- `scroll-margin-top` 셀렉터를 `h2[id], h3[id]` → `.articleBody [id]`로 확장 (각주 커버)
- **결과**: 사용자 테스트 후 "수정 안됨, 아직도 새로고침해야 작동" 확인. 근본 해결 아님.

### 시도 2: SidebarToC 전면 재작성 (빌드 통과, 사용자 미확인)
변경 내용:
1. **`SidebarToC.tsx` 전면 재작성**:
   - `useCallback` 의존성 체인 전부 제거 → 순수 함수 `jumpTo()`, `getScrollOffset()`로 변경
   - `MutationObserver` 제거 → `requestAnimationFrame` 폴링 루프 (최대 120회 ≈ 2초)
   - 폴링 조건: `document.getElementById(contentId)`가 존재하고, 그 안에 `h2`가 1개 이상 있을 때 초기화
   - `contentEl` 위에 **클릭 이벤트 위임** 추가: `a[href^="#"]` 모든 클릭을 가로채서 `replaceState` + instant jump 처리
   - heading collapse toggle과 heading label click을 분리 (버튼=토글, label=점프)
   - 모든 in-page navigation을 `history.replaceState`로 통일
   - `behavior: 'instant'` 적용

2. **`WikiArticle.tsx`**: `<div id="article-body">`에 `key={article.slug}` 추가 → 문서 전환시 DOM 완전 재생성 강제

3. **`WikiArticle.module.css`**: `.articleBody [id]`에 `scroll-margin-top` 적용 (각주 포함)

4. **`GuideExplorer.tsx`**: 가이드 페이지도 `behavior: 'instant'`로 통일

- **빌드**: `npm run build` 통과 (54 pages)
- **상태**: 미커밋, 사용자 확인 전 세션 종료

### 근본 원인 분석 (다음 에이전트를 위한 추정)

**핵심 문제**: Next.js App Router의 client-side navigation에서 `SidebarToC`의 `useEffect`가 실행되는 시점에 `article-body` DOM이 아직 준비되지 않았을 가능성.

구체적으로:

1. **Next.js RSC streaming + hydration 타이밍**:
   - Server Component(`WikiArticlePage`)가 `dangerouslySetInnerHTML`로 content를 렌더링
   - Client Component(`SidebarToC`)의 `useEffect`가 먼저 실행될 수 있음
   - rAF 폴링으로 이를 해결하려 했으나, `key` prop에 의한 React remount가 DOM 재생성과 동기화되지 않을 수 있음

2. **`key` prop의 한계**:
   - `key={article.slug}`로 SidebarToC를 remount해도, 같은 렌더 사이클에서 `article-body` div도 `key`로 재생성되므로 **두 컴포넌트의 mount 순서가 보장되지 않음**
   - SidebarToC의 effect가 article-body보다 먼저 실행되면, 폴링 시작 시점에 article-body가 아직 DOM에 없음

3. **가능한 근본 해결 방향**:
   - **방향 A**: `SidebarToC`를 Server Component 내부에서 article content와 같은 레벨에서 렌더링하되, TOC 데이터를 서버에서 파싱하여 props로 전달 (DOM 의존성 제거)
   - **방향 B**: `article-body` div에 `ref` callback을 사용하여, DOM이 실제로 mount된 후 SidebarToC에 signal을 보내는 방식 (예: Context, state lift, 또는 custom event)
   - **방향 C**: `useEffect` 대신 `useLayoutEffect` + DOM readiness check 조합
   - **방향 D**: Next.js의 `useSearchParams`나 route change event를 감지하여 re-init 트리거

4. **클릭 이벤트 위임이 안 걸리는 이유**:
   - 폴링이 `contentEl`을 찾지 못하면 `addEventListener('click', onAnchorClick)`가 실행 안 됨
   - 즉 heading collapse도, 각주 replaceState 처리도, TOC 엔트리 빌드도 전부 안 됨
   - → 이것이 "새로고침하면 되는데 네비게이션하면 안 되는" 현상의 직접 원인

5. **검증해야 할 것**:
   - `console.log`로 `tryInit` 폴링이 몇 번 도는지, `contentEl`을 찾는 시점이 언제인지 확인
   - React DevTools에서 SidebarToC의 mount/unmount 타이밍과 article-body의 DOM 존재 시점 비교
   - `key` prop이 실제로 remount를 유발하는지 (같은 slug로 같은 페이지 재진입 시 key가 안 바뀔 수 있음)

### 현재 워킹 트리 상태
미커밋 변경 파일 4개:
- `src/components/SidebarToC.tsx` (전면 재작성)
- `src/components/WikiArticle.tsx` (key prop 추가)
- `src/components/WikiArticle.module.css` ([id] scroll-margin-top)
- `src/app/guide/GuideExplorer.tsx` (instant scroll)

→ 시도 2의 코드가 워킹 트리에 있음. 빌드는 통과하나 사용자 확인 전. 다음 에이전트가 이 코드를 기반으로 디버깅하거나, 근본적으로 다른 접근(방향 A~D)을 시도할 것을 권장.

## 2026-02-16 — Antigravity — Visual Polish & UX Refinements

- Implemented Namu Wiki-style header visuals (Right-aligned SVG icons, Bold text, specific click areas)
- Refined `SidebarToC` and `GuideExplorer` interactions (Number jumps to TOC, content wrapper toggles section) and fixed the issue where you first enter the document, jump/collapse won't work. It works now.
- Fixed scroll offset issues for sticky nav/ad banner to prevent content occlusion
- Removed Sidebar TOC active section highlighting to reduce visual clutter (user request)
- Verified consistency across Wiki and Guide pages and updated internal documentation
- Removed Help Cursor on Strikethrough (User request)

## 2026-02-18 — Claude (Opus) — UI Redesign Foundation (Phase 1+2)

### Context
- Owner decided on full UI redesign: CSS Modules → Tailwind v4 + shadcn/ui
- Design direction from Stitch mockups (Wikipedia/NamuWiki knowledge archive aesthetic)
- Light accent: `#854D27` (warm brown), Dark accent: `#5B82C4` (steel blue)
- Font: Public Sans. Minimal border-radius (0.25rem). Almost no shadows.

### Completed
- Installed Tailwind CSS v4 + `@tailwindcss/postcss` + autoprefixer
- Created `postcss.config.mjs`
- Installed shadcn/ui (new-york style, neutral base)
- Installed 16 shadcn primitives: Button, Input, Textarea, Select, Dialog, DropdownMenu, Tabs, Badge, Separator, Table, Tooltip, Sheet, Skeleton, Sonner, Avatar, Card
- Created `src/lib/utils.ts` (`cn()` function for class merging)
- Rewrote `src/app/globals.css`:
  - Tailwind v4 `@import` + `@theme` + `@theme inline` (shadcn mapping)
  - KorWiki brand `#854D27` mapped to shadcn `--primary` (not `--accent`)
  - shadcn `--accent` = subtle highlight background
  - Legacy CSS variable bridge preserved (all `--color-*` vars still work for existing CSS modules)
  - `.wiki-content` typography for dangerouslySetInnerHTML articles
  - `del` insider tip convention, scrollbar, focus, selection styles preserved
- Updated `ThemeProvider.tsx`: toggles both `.dark` class (Tailwind) and `data-theme` attribute (legacy bridge)
- Updated `AGENT_INSTRUCTION.md`: new styling rules, framework version, design token docs
- Created `UI_GUIDE.md`: comprehensive design system reference (colors, typography, spacing, layout, component inventory, migration plan)
- Build verified: 54 pages, 0 TypeScript errors, 3 consecutive successful builds

### Key Design Decision
- shadcn `--accent` vs KorWiki brand color conflict resolved:
  - `--primary` = our brand color (links, buttons, active states)
  - `--accent` = shadcn's subtle highlight (hover backgrounds)
  - `--primary-subtle` = brand at 5% opacity (infobox headers, code backgrounds)

### Next Steps (Phase 3+)
1. **Navigation rebuild**: Replace `Navigation.module.css` (243 lines) with Tailwind classes
2. **Footer rebuild**: Replace inline styles in `layout.tsx`
3. **Layout rebuild**: New shell structure with Tailwind
4. **Page-by-page rebuild**: Wiki → Community → Guide → Login
5. **Cleanup**: Delete all `*.module.css` files, remove legacy variable bridge

### Files Changed
- `package.json` (new devDeps: tailwindcss, @tailwindcss/postcss, postcss, autoprefixer + shadcn deps)
- `postcss.config.mjs` (new)
- `components.json` (new, shadcn config)
- `src/app/globals.css` (full rewrite)
- `src/lib/utils.ts` (new, cn() utility)
- `src/components/ThemeProvider.tsx` (added .dark class toggle)
- `src/components/ui/*.tsx` (16 new shadcn components)
- `AGENT_INSTRUCTION.md` (updated conventions)
- `UI_GUIDE.md` (new, design system reference)

## 2026-02-18 — Claude (Opus) — UI Redesign Phase 3-5 (Shell + Page Rebuild + Cleanup) — COMPLETE

### Summary
Completed the full CSS Modules → Tailwind v4 migration. Every component now uses Tailwind utility classes exclusively. Zero `.module.css` files remain. Zero `data-theme` selectors remain. Zero inline style objects remain. Build: 54 pages, 0 errors.

### Phase 3: Shell Rebuild
- Rewrote `Navigation.tsx`: replaced 243-line CSS module with Tailwind classes + shadcn `DropdownMenu`
- Updated `layout.tsx`: footer and main content wrapper → Tailwind classes
- Deleted `Navigation.module.css`

### Phase 4: Page Rebuild (all components)
- **WikiArticle.tsx + SidebarToC.tsx**: CSS module → Tailwind. Moved `:global()` namu-wiki heading styles to `globals.css` as plain classes (`.namu-wiki-heading`, `.namu-wiki-num`, `.namu-wiki-content-wrapper`, `.namu-wiki-text`, `.namu-wiki-toggle`, `.wiki-section-body`). `styles.sectionBody` → `'wiki-section-body'` plain string for runtime DOM manipulation in SidebarToC.
- **CommunityClient.tsx**: Added `CAT_STYLES` map using Tailwind `dark:` variants for category badge colors (replaces `[data-theme='dark']` CSS selectors)
- **CommunityDetailClient.tsx**: Same `CAT_STYLES` pattern, vote buttons with `cn()` conditional classes
- **GuideExplorer.tsx + ExchangeRateWidget.tsx**: Full Tailwind rewrite of 3-column docs grid layout
- **WikiEditorForm.tsx**: Form inputs → shared `inputClass` string + Tailwind
- **NewCommunityPostForm.tsx**: Same pattern as WikiEditorForm
- **AdBanner.tsx**: `SLOT_SIZE` map for Tailwind width/height, `cn()` composition
- **Login page.tsx**: All 7 inline `CSSProperties` objects removed → Tailwind classes + `cn()` for mode toggle
- Deleted all 7 `.module.css` files: `WikiArticle`, `AdBanner`, `guide`, `wiki-editor`, `community`, `detail`, `new`

### Phase 5: Cleanup
- **WikiIndexClient.tsx**: Last remaining inline-style component → full Tailwind rewrite. Badge pills now use `bg-badge-*` theme tokens directly.
- **WikiArticle.tsx badges**: `badge badge-transport` global class → `inline-block py-0.5 px-2.5 rounded-full ... bg-badge-transport`
- **ThemeProvider.tsx**: Removed `root.setAttribute('data-theme', t)` — only `.dark` class toggle remains
- **globals.css**: Removed all 3 `[data-theme="dark"]` selectors. Deleted entire legacy variable bridge (~90 lines of `--color-bg-*`, `--color-text-*`, `--font-size-*`, `--spacing-*`, `--border-radius-*`, `--shadow-*`, `--transition-*` etc). Deleted Section 7 legacy layout classes (`.main-content`, `.container`, `.badge`, `.badge-*`).
- **Kept**: `--nav-height: 56px` and `--ad-banner-height: 106px` in `:root` (still used in `calc()` expressions across multiple components for sticky positioning and scroll-margin-top).

### Design Token Architecture (final state for CODEX reference)

**globals.css structure:**
1. Tailwind v4 imports (`tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`)
2. `@custom-variant dark (&:is(.dark *))` — Tailwind dark mode via `.dark` class
3. `@theme` block — fonts + badge colors (`--color-badge-transport` etc.)
4. `@theme inline` block — shadcn radius + color mapping (`--color-background: var(--background)` etc.)
5. `:root` — light mode shadcn tokens (`--background`, `--foreground`, `--primary: #854d27`, etc.)
6. `.dark` — dark mode shadcn tokens (`--primary: #5b82c4`, etc.)
7. `:root` — layout tokens (`--nav-height`, `--ad-banner-height`)
8. `@layer base` — html/body, `.wiki-content` typography, `del` convention, focus/selection/scrollbar
9. Reduced motion media query
10. `.dark img` dimming
11. `.namu-wiki-*` heading interaction classes + `.wiki-section-body`

**Color system:**
- Light primary: `#854d27` (warm brown)
- Dark primary: `#5b82c4` (steel blue)
- Background: `#f5f6f7` light / `#000000` dark
- Card/surface: `#ffffff` light / `#161616` dark
- Border: `#e4e0dd` light / `#2a2a2a` dark

**Pattern conventions CODEX must follow:**
- Use `cn()` from `@/lib/utils` for conditional classes (not ternary string concatenation)
- Card backgrounds: `bg-card dark:bg-surface`
- Nav/footer backgrounds: `bg-card dark:bg-background`
- Inputs: `border border-border rounded-sm bg-background text-foreground font-sans py-2.5 px-3`
- Primary buttons: `bg-primary text-primary-foreground`
- Responsive: use `max-lg:`, `max-md:`, `max-[860px]:`, `max-[480px]:` (mobile-last approach)
- Dark mode: Tailwind `dark:` variant only (no `data-theme`, no separate dark selectors)
- Category badge colors: use `CAT_STYLES` maps with `dark:` variant classes (see CommunityClient.tsx pattern)
- Wiki category badges: use `bg-badge-*` theme tokens (defined in `@theme` block)

### What CODEX should NOT change during ARCHITECTURE_FINAL work
- `globals.css` Sections 1-7 (design tokens, base styles, namu-wiki classes) — stable and complete
- Component className patterns — all use Tailwind now, no CSS modules to worry about
- `ThemeProvider.tsx` — only toggles `.dark` class, no `data-theme`
- `parseWikiContent` output — generates `.namu-wiki-*` class names that match globals.css
- `SidebarToC.tsx` — uses `'wiki-section-body'` plain string class for DOM manipulation

### What CODEX WILL add (from ARCHITECTURE_FINAL.md)
- New pages: `/admin/*` routes (dashboard, users, moderation, tags, settings)
- New components: CodeMirror editor, revision history, report flow, upload UI
- New DB tables: `user_profiles`, `wiki_revisions`, `revision_votes`, `reports`, `tags`, `media_uploads`
- Search: FTS + trigram on `wiki_articles`
- These additions should use the established Tailwind patterns above, NOT introduce new CSS modules or inline styles

### Files changed this session
- `src/components/Navigation.tsx` (rewritten)
- `src/components/Navigation.module.css` (deleted)
- `src/app/layout.tsx` (footer/main Tailwind)
- `src/components/WikiArticle.tsx` (rewritten)
- `src/components/WikiArticle.module.css` (deleted)
- `src/components/SidebarToC.tsx` (rewritten)
- `src/components/AdBanner.tsx` (rewritten)
- `src/components/AdBanner.module.css` (deleted)
- `src/components/ThemeProvider.tsx` (removed data-theme)
- `src/app/guide/GuideExplorer.tsx` (rewritten)
- `src/app/guide/ExchangeRateWidget.tsx` (rewritten)
- `src/app/guide/guide.module.css` (deleted)
- `src/app/wiki/WikiEditorForm.tsx` (rewritten)
- `src/app/wiki/wiki-editor.module.css` (deleted)
- `src/app/wiki/WikiIndexClient.tsx` (rewritten)
- `src/app/community/CommunityClient.tsx` (rewritten)
- `src/app/community/community.module.css` (deleted)
- `src/app/community/[id]/CommunityDetailClient.tsx` (rewritten)
- `src/app/community/[id]/detail.module.css` (deleted)
- `src/app/community/new/NewCommunityPostForm.tsx` (rewritten)
- `src/app/community/new/new.module.css` (deleted)
- `src/app/login/page.tsx` (rewritten)
- `src/app/globals.css` (legacy bridge removed, [data-theme] removed)
- `src/lib/utils.ts` (unchanged, created in Phase 1+2)

## 2026-02-18 — Codex (GPT-5) — Architecture rollout kickoff (DB + API start)

- Reviewed Opus UI renewal logs and validated no direct conflict with frozen architecture decisions
- Updated `ARCHITECTURE_FINAL.md` with:
  - UI conflict-check section
  - execution board (AX-* tickets with dependency graph)
  - detailed ticket templates/status notes
- Added migration batch 1: `2026-02-18-architecture-final-batch-1.sql`
  - user_profiles, wiki_revisions, revision_votes, reports, media_uploads, site_settings, wiki FTS base + RLS/policies
- Added migration batch 2: `2026-02-18-architecture-final-batch-2-tags.sql`
  - tags, tag_aliases, wiki_article_tags + RLS/policies
- Added migration batch 3: `2026-02-18-architecture-final-batch-3-backfill.sql`
  - idempotent backfill for initial revisions + normalized tags + search vector fill
- Started AX-BE-001 implementation:
  - Added `src/lib/user-profiles.ts` profile bootstrap helper
  - Updated wiki create/update APIs to append revisions and apply trust/role pending-vs-active gate
- Build verified after changes: 54 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-BE-002 optimistic locking implementation

- Added optimistic-lock payload contract on wiki edit flow:
  - Edit page fetches latest revision number and passes `baseRevisionNumber` into editor initial state
  - Editor PATCH payload now includes `baseRevisionNumber`
- Updated `PATCH /api/v1/wiki/articles/[slug]`:
  - validates `baseRevisionNumber`
  - compares against latest stored revision number
  - returns `409` with `currentRevisionNumber` when stale
- Added conflict-aware client error messaging for edit form (reload/merge guidance)
- Build verified after changes: 54 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-BE-003 reports/moderation API rollout

- Added report routes:
  - `POST/GET /api/v1/reports` for creation and scoped listing (`mine` / `all` for staff)
  - `PATCH /api/v1/reports/[id]` for moderator/admin status resolution
- Added user-profile role helper exports in `src/lib/user-profiles.ts` (`getUserProfile`, `isStaffRole`)
- Enforced explicit staff-role checks in API layer because service-role client bypasses RLS
- Build verified after changes: 55 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-BE-004 upload API rollout

- Added upload routes:
  - `POST /api/v1/uploads` (auth required, MIME allowlist, 5MB cap, daily quota, storage upload + metadata insert)
  - `PATCH /api/v1/uploads/[id]` (owner/staff status updates: `removed`, `blocked`; `blocked` staff-only)
- Uses Supabase Storage bucket `community-media` and DB table `media_uploads`
- Added explicit role checks in API layer for moderation-style upload status changes
- Build verified after changes: 56 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-BE-005 search API rollout (partial)

- Added `GET /api/v1/wiki/search` route
- Implemented ranking heuristic:
  - title exact > title prefix > title like
  - FTS blend on `search_vector` (`english` + `simple`)
  - summary match boost + freshness bonus
- Endpoint returns scored result list for suggestion/results UI integration
- Remaining for full ticket close: trigram-weight tuning + staging latency measurement
- Build verified after changes: 57 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-BE-006 emergency lock + write guards

- Added admin settings route: `GET/PATCH /api/v1/admin/settings/emergency-lock` (admin-only)
- Added shared guard helper: `src/lib/emergency-lock.ts`
- Applied emergency write lock checks to key mutable routes:
  - wiki create/update
  - reports create/update
  - uploads create/update
  - community post create/delete, comments create, post/comment votes
- Build verified after changes: 58 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-SEC-001 RLS/policy hardening

- Added DB security migration:
  - `supabase/migrations/2026-02-18-architecture-final-batch-4-security-hardening.sql`
- Hardened legacy permissive policy surface:
  - removed broad authenticated write policies on `wiki_articles`
  - added staff-only direct insert/update policies for `wiki_articles`
  - removed `user_profiles` self-update policy path (privilege escalation risk)
- Replaced hardcoded admin-email auth in community delete API with profile role-based admin check
- Build verified after changes: 58 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-SEC-002 dual-layer rate limiting

- Added edge-layer throttling with Next.js 16 proxy convention:
  - `src/proxy.ts` (route+method IP buckets, 429 with retry headers)
- Added server-layer write throttle helper:
  - `src/lib/write-rate-limit.ts` (DB action-count checks on recent window)
- Integrated server-side limits into major write routes:
  - wiki write, reports create, community post create, comment create, uploads create
- Kept emergency lock independent and active for write-stop scenarios
- Build verified after changes: 62 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-BE-005 search ranking finalization

- Added search ranking RPC migration:
  - `supabase/migrations/2026-02-18-architecture-final-batch-5-search-rpc.sql`
  - `search_wiki_advanced(query, max_results)` implements FTS+trigram+freshness weighting
- Updated `GET /api/v1/wiki/search` to call RPC instead of local in-route heuristic
- Preserved title exact/prefix priority and returned ranking reasons for UI display
- Build verified after changes: 62 routes generated, TypeScript pass

## 2026-02-18 — Codex (GPT-5) — AX-DOC-001 complete + AX-OPS-002 runbook start

- Synced architecture docs with Tailwind/shadcn reality:
  - `MASTERPLAN.md` styling stack, dark-mode rule, and quick coding rule updated
  - `AGENT_INSTRUCTION.md` removed stale `data-theme` bridge guidance
- Made security migration rerunnable:
  - `supabase/migrations/2026-02-18-architecture-final-batch-4-security-hardening.sql`
  - added `drop policy if exists` for already-created staff policies
- Added operations runbook:
  - `OPERATIONS_PLAYBOOK.md` with backup/PITR weekly checklist, recovery steps, drill scenarios, evidence template
- Updated `ARCHITECTURE_FINAL.md` execution board:
  - AX-DOC-001 -> `done`
  - AX-OPS-002 -> `in_progress`

## 2026-02-18 — Codex (GPT-5) — AX-QA-001 gate definition + AX-BE-001 close

- Added `QA_RELEASE_GATE.md`:
  - frozen decision compliance checks (`Q-001`..`Q-006`)
  - security gate checks (`S-001`..`S-003`)
  - SQL verification queries and sign-off template
- Re-validated wiki public read path uses `wiki_articles` and does not expose pending revisions.
- Updated `ARCHITECTURE_FINAL.md`:
  - AX-BE-001 status -> `done`
  - AX-QA-001 status -> `in_progress` (checklist ready, staging run pending)

## 2026-02-18 — Codex (GPT-5) — AX-QA-001 evidence run (local)

- Added `QA_RUN_2026-02-18.md` with code-level evidence for Q-001..Q-006 and S-001..S-003.
- Marked current gate decision as `NOT READY` until staging runtime validation is completed.
- Explicitly captured Q-005 (account deletion policy) as blocked/pending feature delivery.
- Updated `ARCHITECTURE_FINAL.md` AX-QA-001 delivered section with evidence-run artifact.

## 2026-02-18 — Codex (GPT-5) — Pending revision moderation endpoint

- Fixed profile dropdown overlap issue by raising menu z-index:
  - `src/components/Navigation.tsx` (`DropdownMenuContent` now uses `z-[200]`)
- Added staff-only wiki revision moderation route:
  - `PATCH /api/v1/wiki/revisions/[id]`
  - actions: `approve`, `reject`, `hide`
- `approve` now promotes pending revision and applies revision content to `wiki_articles`.
- Updated `ARCHITECTURE_FINAL.md` AX-BE-003 delivered details accordingly.
- Build verified after changes: 64 routes generated (new revision moderation route included).

## 2026-02-18 — Codex (GPT-5) — Account soft-delete flow (frozen decision #5 progress)

- Added account deletion endpoint:
  - `POST /api/v1/account/delete` (`confirm=true` required)
  - marks `user_profiles.deleted_at` and anonymizes display name to `Deleted User`
- Added deleted/banned write guard utility in `src/lib/user-profiles.ts`:
  - `assertProfileWritable`, `DeletedAccountError`, `BannedAccountError`
- Enforced deleted/banned checks in identity bridge:
  - `src/lib/community-auth-user.ts` now validates mapped profile state before returning actor id
- Added sign-in gate in `src/auth.ts`:
  - blocks login for soft-deleted or currently banned identities (when linked profile exists)
- Build verified after changes: 64 routes generated, TypeScript pass.

## 2026-02-18 — Codex (GPT-5) — AX-OPS-001 observability wiring (partial)

- Installed observability dependencies:
  - `@sentry/nextjs`, `@vercel/analytics`
- Added Sentry integration files:
  - `next.config.ts` (`withSentryConfig`)
  - `src/instrumentation.ts`
  - `src/instrumentation-client.ts` (includes router transition hook)
  - `sentry.server.config.ts`, `sentry.edge.config.ts`
  - `src/app/global-error.tsx` with `Sentry.captureException`
- Added Vercel Analytics component to root layout (`src/app/layout.tsx`)
- Updated `.env.example` with Sentry variables (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`)
- Build verified after changes: 64 routes generated, TypeScript pass.

## 2026-02-18 — Codex (GPT-5) — AX-OPS-001 verification accelerators

- Added admin-only Sentry verification endpoint:
  - `POST /api/v1/admin/ops/sentry-test` (returns `eventId`)
- Added ops KPI views migration:
  - `supabase/migrations/2026-02-18-architecture-final-batch-6-ops-kpi.sql`
  - views: `ops_kpi_daily`, `ops_kpi_realtime`
- Updated `OPERATIONS_PLAYBOOK.md` with fast verification steps for env setup, Sentry event check, and KPI SQL checks.
