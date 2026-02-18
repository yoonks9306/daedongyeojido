# KorWiki — Project Tracker

> **How to use this file**: Single source of truth for all contributors and AI agents.
> Before starting ANY work: read this file top to bottom.
> Before ending ANY session: update Section 0 (Current State) and relevant milestone checkboxes.
> Last updated: 2026-02-16

---

## 0. CURRENT STATE (Update this every session — AI agents must read + write here)

### Last completed work
- **Wiki heading first-load bind bug resolved (사용자 확인)**:
  - 위키 문서 간 client-side navigation에서도 collapse/jump 동작 정상
  - 뒤로가기 히스토리 오염(헤더 이동 스택) 개선 로직 유지
- **AdSense verification resolved**:
  - 사이트 검증 단계 완료
  - 현재는 계정/사이트 승인 대기 상태
- DB 마이그레이션 실행 완료 확인:
  - `2026-02-16-comment-votes.sql`
  - `2026-02-16-kakao-t-footnotes-sample.sql`

### Currently blocked on
- **AdSense approval pending (OPEN)**:
  - verification 완료, 승인 대기 중
  - 승인 후 실제 fill rate/노출 안정성 점검 필요

### Key decision
- 콘텐츠(위키 100+편 확장 등)는 나중에 채워넣기로 하고, **구조/기능 완성에 먼저 집중**하기로 결정

### Uncommitted changes in working tree
- 현재 기준 없음 (worktree clean 전제; 시작 전 `git status` 재확인)

### Next task for incoming agent
1. **AdSense 운영 상태 점검 (최우선)**:
   - 승인 완료 여부 확인
   - 승인 시 leaderboard 재도입 여부 + 위치/빈도 정책 확정
2. Product backlog 구체화 착수:
   - Editor 고도화 (Raw/Preview split, 미리보기 안전 렌더)
   - See Also 자동 추천 규칙
   - Tag 정책(강화 vs 제거) 결정
   - Search suggestions + ranking 정책
   - 문서 버전 관리/검수 정책
3. Phase 7 polish backlog:
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
| Styling | Tailwind CSS v4 + shadcn/ui | Design tokens in `globals.css`, utility-first styling |
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
│   │   │   └── page.tsx        ← Community board (tabs: All/Daily/Weekly/Monthly Best)
│   │   ├── login/
│   │   │   └── page.tsx        ← Login page (Google + GitHub OAuth wired up)
│   │   └── guide/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Navigation.tsx      ← Sticky nav: logo, tabs, search, theme toggle, user avatar/login
│   │   ├── ThemeProvider.tsx   ← Dark/light mode context (localStorage + prefers-color-scheme)
│   │   ├── AuthProvider.tsx    ← SessionProvider wrapper (client component)
│   │   ├── WikiArticle.tsx     ← Article renderer (sidebar ToC + infobox + body)
│   │   ├── SidebarToC.tsx      ← IntersectionObserver ToC (active section tracking)
│   │   ├── AdBanner.tsx        ← Ad placeholder (leaderboard 728×90, rectangle 300×250)
│   │   └── ui/                 ← shadcn/ui primitives
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

**Dark mode**: `.dark` class on `<html>` (Tailwind v4).
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
- [x] AdSense site verification (완료)
- [ ] AdSense 승인 후 leaderboard 광고 layout에 재추가

### Phase 6 — Deployment 🟡 IN PROGRESS
- [x] Vercel project connected (auto-deploy from GitHub `main`)
- [x] `vercel.json` with explicit build config
- [x] OAuth callback URLs configured in Google + GitHub (needs credentials)
- [x] `AUTH_SECRET` + OAuth env vars set in Vercel dashboard
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

## 9. Product Backlog (Elaborated)

### A. Wiki Editor 고도화
- 목표: 현재 단순 편집기에서 `RAW 편집` + `실시간 Preview` 동시 작업 흐름으로 개선.
- 요구사항:
  - 좌/우 split view (raw html / preview)
  - 미리보기 sanitize 정책 명시 (`iframe`, `img`, `a`, `sup` 허용 범위)
  - 저장 전 validator (필수 heading, broken anchor, footnote 짝 검사)
  - 에디터 보조 기능: 템플릿 삽입(References, YouTube embed, footnote block)

### B. See Also 자동화
- 문제: 수동 입력 의존도가 높고 누락 시 품질 편차 발생.
- 정책:
  - 수동 입력 우선 (editor 지정값)
  - 미입력/부족 시 자동 채움 후보 생성:
    1) 공통 tags
    2) category 일치
    3) 본문 키워드 유사도
  - 노출 규칙: 최대 N개, 자기 문서 제외, 품질 score 하한선
  - fallback: 자동 후보가 임계치 미달이면 섹션 숨김

### C. Tag 기능 방향 결정
- 옵션 1 (강화):
  - `/wiki/tags/[tag]` 페이지 추가
  - 태그별 최신/인기 문서 정렬
  - 태그 표준화(동의어 매핑)
- 옵션 2 (제거):
  - UI에서 태그 노출 제거
  - 내부 분류는 category + related만 유지
- 의사결정 필요: 운영 목적상 정보 탐색 확장을 원하면 옵션 1 권장.

### D. Search 고도화
- 현재: 단순 검색창 기반 결과 이동.
- 목표 기능:
  - 입력 중 suggestion dropdown
  - typo tolerance(부분 일치, 오탈자 허용)
  - ranking 기준 정의:
    1) 제목 일치도
    2) 요약/본문 일치도
    3) 최신성 가중치
    4) 신뢰도/편집품질 가중치(추후)
  - 검색 결과 페이지 표준:
    - snippet
    - matched field badge
    - sort 옵션 (relevance/latest/popular)

### E. 버전 관리 시스템
- 요구사항:
  - 문서 저장 시 revision 이력 생성 (작성자, 시각, 변경 요약)
  - diff 보기 (전체 본문 저장 또는 patch 저장)
  - 악의 편집 대응:
    - 신고/롤백
    - 검수 대기 상태
    - 신뢰 낮은 revision 비노출
- 저장 전략:
  - 초기: full snapshot 방식 (구현 단순)
  - 고도화: delta/patch + 주기 snapshot 혼합으로 스토리지 최적화
- 참고: revision voting은 나중 단계에서 도입 (우선 롤백/검수 우선)

### F. Low-Token Content Pipeline (중요)
- 목표: 외부 모델로 대량 콘텐츠 생산 시 토큰/인건비 절감.
- 권장 파이프라인:
  1) 외부 저비용 모델로 `문서 리스트 + 초안 html` 생산
  2) 내부 validator로 형식 자동 검사
  3) 자동 태깅/see-also 후보 생성
  4) 최종 검수 후 DB 반영
- 대량 반영 형식:
  - 문서 100개를 1개 SQL로 몰지 말고 batch(예: 10~20개) 분할
  - 공통 템플릿 기반으로 문서 길이/구조 균일화
  - 실패 재시도 가능한 idempotent upsert 유지

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
- Tailwind CSS v4 + shadcn/ui only. Do not add new CSS Modules.
- Never add a DB without updating Section 2 (Tech Stack) above.
- Build must pass: `export PATH="/opt/homebrew/bin:$PATH" && npm run build`
- Update Section 0 before ending any session.
