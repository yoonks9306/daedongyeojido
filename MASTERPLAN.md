# KorWiki — Project Tracker

> **How to use this file**: Single source of truth for all contributors and AI agents.
> Before starting ANY work: read this file top to bottom.
> Before ending ANY session: update Section 0 (Current State) and relevant milestone checkboxes.
> Last updated: 2026-02-16

---

## 0. CURRENT STATE (Update this every session — AI agents must read + write here)

### Last completed work
- **Wiki heading bind bug 수정 2회 시도 (미해결)** — 상세 내역은 `SESSION_LOG.md` 최하단 참조
  - 시도 1: key prop + rAF + MutationObserver → 실패
  - 시도 2: SidebarToC 전면 재작성 (rAF 폴링, 클릭 위임, instant jump, replaceState 통일) → 빌드 통과, 사용자 미확인
  - `GuideExplorer.tsx`도 instant scroll로 통일
  - `.articleBody [id]` scroll-margin-top으로 각주 가림 이슈 수정
- DB 마이그레이션 2건 실행 완료 확인 (comment-votes, kakao-t-footnotes)

### Currently blocked on
- **Wiki heading interaction first-load bug (OPEN, 최우선)**:
  - 증상: 위키 문서 간 client-side navigation시 collapse/jump 안 됨. 새로고침하면 작동.
  - 추정 원인: Next.js RSC streaming에서 SidebarToC useEffect가 article-body DOM보다 먼저 실행
  - 2회 시도 모두 실패. rAF 폴링도 해결 못함. **근본적으로 다른 접근 필요**.
  - 후보 접근법: (A) 서버에서 TOC 데이터 파싱→props 전달, (B) ref callback으로 DOM ready signal, (C) useLayoutEffect, (D) route change event 감지
  - 상세 분석: `SESSION_LOG.md` 하단 "근본 원인 분석" 참조
- **AdSense approval pending**: 코드 wiring 완료, 승인 대기 중

### Key decision
- 콘텐츠(위키 100+편 확장 등)는 나중에 채워넣기로 하고, **구조/기능 완성에 먼저 집중**하기로 결정

### Uncommitted changes in working tree
4개 파일 수정됨 (시도 2 코드, 빌드 통과):
- `src/components/SidebarToC.tsx` — 전면 재작성
- `src/components/WikiArticle.tsx` — key prop 추가
- `src/components/WikiArticle.module.css` — [id] scroll-margin-top
- `src/app/guide/GuideExplorer.tsx` — instant scroll
→ 커밋 여부는 다음 에이전트/사용자 판단

### Next task for incoming agent
1. **Fix wiki first-load heading bind issue (최우선)**:
   - `SESSION_LOG.md` 하단의 시행착오 + 근본 원인 분석 반드시 읽을 것
   - 워킹 트리의 시도 2 코드를 기반으로 디버깅하거나, 근본적으로 다른 접근 시도
   - 핵심: SidebarToC의 useEffect 실행 시점에 article-body DOM이 존재하는지 확인
   - `console.log`로 tryInit 폴링 횟수, contentEl 발견 시점 확인부터 시작 권장
2. Phase 7 polish backlog:
   - Mobile hamburger nav
   - Loading states / skeleton screens
   - Error boundaries / 404 page

### Recent git commits
- `1c4f8da` fix: stabilize wiki toc behavior and handoff docs
- `a506672` feat: add comment voting, anonymous comments, post vote bar
- `8aafe8c` fix: AdSense beforeInteractive + remove empty leaderboard
- `4d0f485` feat: integrate Google AdSense
- `b019968` fix: await increment_views RPC before fetch
- `d3122ec` fix: polish community UX, live data, nav dropdown, and misc bug fixes

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
| Auth | NextAuth.js v5 (Auth.js) | Google + GitHub OAuth + Credentials (email/password) |
| Data | Supabase + seed data | Static `.ts` used as seed source, runtime reads DB |
| Database | Supabase | Project `jjdtxdsurkcuxwauusfc` live |
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
- [x] Protected routes: community posting, wiki editing
- [ ] User profile page (`/profile/[username]`) — Phase 3 dependency

### Phase 3 — Database & Backend ✅ COMPLETE
- [x] Choose DB: **Supabase** (Vercel integration active)
- [x] Schema: wiki_articles, community_posts, votes, comments (RLS enabled)
- [x] Migrate static data files → DB seed scripts (`supabase/seed.ts`, 20 articles + 15 posts)
- [x] `src/lib/supabase.ts` client created
- [x] wiki + community pages fetch from Supabase (SSG preserved)
- [x] API routes: `/api/v1/community/` POST (new post), `/api/v1/community/[id]/vote`
- [x] Community post submission form + POST endpoint
- [x] Upvote persistence (POST/DELETE vote API + UI wiring)
- [x] Best posts algorithm (score = upvotes × recency_weight)
- [x] Wiki article create/edit form (for authenticated users)
- [x] Comment system
- [x] Email/password auth (Credentials + local_auth_users)

### Phase 4 — Content & SEO 🟡 PARTIAL
- [x] `sitemap.ts` (Next.js built-in)
- [x] `robots.ts`
- [x] `opengraph-image` per wiki article
- [ ] Expand wiki articles (target: 100+)
- [x] Expand guide sections
- [x] Internal hyperlinks between wiki articles
- [x] Korean-language metadata for SEO

### Phase 5 — Monetization 🟡 IN PROGRESS
- [x] Ad slot placeholders (leaderboard 728×90, rectangle 300×250)
- [x] Google AdSense script integrated (`ca-pub-1126883662685001`)
- [x] AdBanner.tsx: real `<ins class="adsbygoogle">` tags replacing placeholders
- [ ] AdSense site verification (Google 크롤러 인식 실패, 미해결)
- [ ] AdSense 승인 후 leaderboard 광고 layout에 재추가

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
| 1 | OAuth credentials not filled | Mostly resolved | Local + production OAuth works; keep Vercel envs synced |
| 2 | No DB | Resolved | Supabase is live and pages read from DB |
| 3 | Community upvote is UI-only | Resolved | Vote API + DB persistence implemented (`/api/v1/community/posts/[id]/vote`) |
| 4 | Mobile: no hamburger nav | Open | Tabs shrink but no dedicated mobile nav pattern |
| 5 | Best post algorithm is client-side sort | Resolved | Score-based ranking (`upvotes × recency_weight`) implemented |
| 6 | Email/password login disabled | Resolved | Credentials auth + register API implemented |
| 7 | Wiki heading UX first-load bind instability | Open | 2회 수정 시도 실패. Next.js RSC streaming 타이밍 이슈 추정. SESSION_LOG.md 하단 상세 분석 참조 |
| 8 | AdSense approval/live fill status unclear | Open | Integration done; production approval/render state must be rechecked |

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
