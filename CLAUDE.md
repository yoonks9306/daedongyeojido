# 대동여지도 (Daedong Yeojido) — Project Agent

## Project Overview

**대동여지도** is an English-language master travel guide website for foreigners visiting Korea.
Modeled after the design philosophy of **Namu Wiki (나무위키)** — community-driven, dense, well-structured documentation.

### Three-Tab Structure

| Tab | Purpose |
|-----|---------|
| **Travel Guide** | Curated, authoritative travel content for Korea |
| **Wiki** | Detailed topic-based articles (places, culture, food, transport, etc.) |
| **Community** | User posts, reviews, free board — with Daily / Weekly / Monthly Best sorting |

---

## Tech Stack Decisions

> Update this section as decisions are finalized.

- **Language**: English (primary), Korean (secondary/metadata)
- **Reference UI/UX**: Namu Wiki (나무위키) — dense information layout, sidebar ToC, wiki-style article pages
- **Frontend**: TBD
- **Backend**: TBD
- **Database**: TBD
- **Auth**: TBD

---

## Content Architecture

### Travel Guide Tab
- Top-level categories: Cities, Transportation, Food, Accommodation, Culture, Practical Info
- Each article follows the Namu Wiki format: structured headers, infoboxes, related links

### Wiki Tab
- Title-based lookup (like Wikipedia / Namu Wiki)
- Hierarchical category tree
- Article template: infobox → summary → detailed sections → see also → external links

### Community Tab
- Post types: Review, Free Board
- Best posts ranking:
  - **Daily Best**: top posts in last 24h
  - **Weekly Best**: top posts in last 7 days
  - **Monthly Best**: top posts in last 30 days
- Voting/upvote system for ranking

---

## Design Guidelines

- Reference: Namu Wiki (나무위키) — https://namu.wiki
- Dense, information-rich layout (not card-based)
- Wiki-style table of contents (sticky sidebar or top anchor links)
- Mobile responsive but desktop-first
- Dark mode support preferred
- Minimal ads / non-intrusive monetization

---

## Coding Conventions

- Component/file names: PascalCase for components, kebab-case for routes/pages
- All user-facing strings in English
- Korean content (place names, proper nouns) kept in Korean with English transliteration
- API routes: RESTful, `/api/v1/...`
- Write tests for core ranking logic (Best posts algorithm)

---

## Key Domain Rules

1. **Best Post Algorithm**: score = upvotes × recency_weight. Define recency windows clearly per tab (daily/weekly/monthly).
2. **Wiki articles** must have a canonical slug (URL-safe English title).
3. **Travel Guide** content is editorially controlled; **Wiki** and **Community** are community-contributed.
4. Spam/abuse: implement rate limiting and report system from day one.

---

## Folder Structure (Proposed)

```
대동여지도/
├── CLAUDE.md          ← this file
├── docs/              ← design specs, wireframes, research
├── frontend/          ← web app
├── backend/           ← API server
├── db/                ← schema, migrations
└── scripts/           ← utility/data scripts
```

---

## Reference Sites

- **Namu Wiki**: https://namu.wiki — UI/UX reference, content structure
- **Lonely Planet**: content depth reference
- **Reddit (r/korea, r/seoul)**: community tone reference
- **Tripadvisor**: review format reference

---

## Current Status

- [ ] Tech stack finalized
- [ ] Wireframes / mockups
- [ ] Database schema
- [ ] Frontend scaffold
- [ ] Backend scaffold
- [ ] First Travel Guide articles
- [ ] Community MVP
