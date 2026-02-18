# KorWiki UI/UX Design System Guide

Last updated: 2026-02-18
Status: ACTIVE (Migration Complete)
Owner: Claude Code (Opus) — UI/UX track lead

---

## 0. Design Philosophy

- **Reading-first**: UI stays invisible. Content is the interface.
- **Content-centered**: Typography and spacing create hierarchy, not decoration.
- **Minimal chrome**: No gradients, no heavy shadows, no rounded corners, no playful illustrations.
- **Knowledge archive tone**: Wikipedia structure + NamuWiki neutrality, slightly warmer and more human.
- **Two-mode accent**: Light and dark modes each have their own distinct accent color.

---

## 1. Color System

### 1.1 Light Mode

| Token                  | Value       | Usage                                       |
|------------------------|-------------|----------------------------------------------|
| `--primary`            | `#854D27`   | Links, active states, buttons, section highlights |
| `--primary-foreground` | `#FFFFFF`   | Text on primary-colored backgrounds          |
| `--background`         | `#F5F6F7`   | Page background                              |
| `--card`               | `#FFFFFF`   | Card/document surface                        |
| `--surface`            | `#FFFFFF`   | Alias for card (light mode identical)        |
| `--foreground`         | `#0A0A0A`   | Primary text                                 |
| `--muted-foreground`   | `#6B7280`   | Secondary text (gray-500)                    |
| `--border`             | `#E4E0DD`   | Dividers, borders                            |
| `--primary-subtle`     | `rgba(133,77,39,0.05)` | Infobox headers, code bg, accent tint |
| `--secondary`          | `#F0EBE7`   | Subtle highlight backgrounds                 |
| `--destructive`        | `#DC2626`   | Delete, ban, errors                          |
| `--success`            | `#16A34A`   | Approved, active states                      |
| `--warning`            | `#D97706`   | Pending, caution                             |

### 1.2 Dark Mode

| Token                  | Value       | Usage                                       |
|------------------------|-------------|----------------------------------------------|
| `--primary`            | `#5B82C4`   | Links, interactive elements                  |
| `--primary-foreground` | `#FFFFFF`   | Text on primary-colored backgrounds          |
| `--background`         | `#000000`   | Page background                              |
| `--card`               | `#161616`   | Card/document surface                        |
| `--surface`            | `#161616`   | Alias for card (dark mode identical)         |
| `--foreground`         | `#F5F5F5`   | Primary text                                 |
| `--muted-foreground`   | `#9CA3AF`   | Secondary text (gray-400)                    |
| `--border`             | `#2A2A2A`   | Dividers, borders                            |
| `--primary-subtle`     | `rgba(91,130,196,0.1)` | Accent tint at 10% opacity          |
| `--secondary`          | `#1C1C1C`   | Subtle highlight backgrounds                 |
| `--destructive`        | `#EF4444`   | Delete, ban, errors                          |
| `--success`            | `#22C55E`   | Approved, active states                      |
| `--warning`            | `#F59E0B`   | Pending, caution                             |

### 1.3 Color Rules

- Only ONE accent color per mode. No secondary accent.
- Accent must never dominate large surfaces (no accent-colored backgrounds on sections).
- Maximum functional colors per mode: primary, background, card/surface, foreground, border.
- Category badge colors (Transport, Food, Culture, etc.) are defined in `@theme` block as `--color-badge-*` tokens.

### 1.4 Wiki Category Badge Colors

| Category   | Color     | Tailwind class          |
|------------|-----------|-------------------------|
| Transport  | `#1A73E8` | `bg-badge-transport`    |
| Apps       | `#0F9D58` | `bg-badge-apps`         |
| Food       | `#F4511E` | `bg-badge-food`         |
| Culture    | `#9C27B0` | `bg-badge-culture`      |
| Places     | `#E67E22` | `bg-badge-places`       |
| Practical  | `#607D8B` | `bg-badge-practical`    |

### 1.5 Community Category Badge Colors

Use `CAT_STYLES` maps with light/dark variant classes:

```tsx
const CAT_STYLES: Record<string, string> = {
  review: 'bg-[#e8f5e9] text-[#2e7d32] dark:bg-[#1b3a1e] dark:text-[#66bb6a]',
  question: 'bg-[#e3f2fd] text-[#1565c0] dark:bg-[#1a2a3a] dark:text-[#64b5f6]',
  free: 'bg-[#fce4ec] text-[#880e4f] dark:bg-[#3a1a2a] dark:text-[#f48fb1]',
  tip: 'bg-[#fff8e1] text-[#f57f17] dark:bg-[#3a3010] dark:text-[#ffd54f]',
};
```

---

## 2. Typography

### 2.1 Font Stack

```
Primary: "Public Sans", "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif
Monospace: "JetBrains Mono", "Fira Code", ui-monospace, monospace
```

Defined in `@theme` block in `globals.css`.

### 2.2 Scale

| Name    | Size   | Weight | Line Height | Usage                    |
|---------|--------|--------|-------------|--------------------------|
| `h1`    | 2.5rem | 900    | 1.1         | Article title            |
| `h2`    | 1.5rem | 700    | 1.3         | Section heading          |
| `h3`    | 1.125rem| 700   | 1.4         | Subsection heading       |
| `body`  | 1rem   | 400    | 1.7         | Article body text        |
| `body-lg`| 1.125rem| 400  | 1.7         | Lead paragraph           |
| `small` | 0.875rem| 400   | 1.5         | Captions, metadata       |
| `xs`    | 0.75rem| 500    | 1.4         | Labels, timestamps       |

### 2.3 Typography Rules

- Section headings (`h2`) always have a bottom border (`--border` color, 1px) in `.wiki-content`.
- Article titles use `text-4xl font-bold`.
- Body text uses `leading-relaxed` (1.7 line height) for readability.
- Links are primary-colored with underline on hover only.

---

## 3. Spacing & Layout

### 3.1 Spacing Scale

Use Tailwind's default scale. Key reference points:
- Section gap: `mb-8` to `mb-12`
- Paragraph gap: `mb-6`
- Component internal padding: `p-4` to `p-6`
- Page horizontal padding: `px-4` to `px-6`

### 3.2 Layout Structure

```
Max content width: 1200px (max-w-[1200px])
Article content max: 860px (max-w-[860px])

Wiki article page (2-column):
+---------------------------------------------+
| Navigation (sticky top, h-14, full width)    |
+----------+----------------------------------+
| ToC      | Article Content                   |
| sidebar  | (max-w-[860px])                   |
| sticky   | + floating infobox                |
|          |                                   |
+----------+----------------------------------+
| Footer                                       |
+---------------------------------------------+

Guide page (3-column):
+---------------------------------------------+
| Navigation                                   |
+--------+----------------------+-------------+
| Left   | Main Content         | Right ToC   |
| Nav    | (entries list)       | (on-page)   |
+--------+----------------------+-------------+

Community/Login pages (single column):
+---------------------------------------------+
| Navigation                                   |
+---------------------------------------------+
| Content (centered, max-width)                |
+---------------------------------------------+
| Footer                                       |
+---------------------------------------------+
```

### 3.3 Layout Tokens

Two CSS custom properties are kept in `:root` for `calc()` expressions:
- `--nav-height: 56px`
- `--ad-banner-height: 106px`

Used in: `sticky top`, `scroll-margin-top`, `padding-top` calculations.

### 3.4 Responsive Breakpoints

| Breakpoint        | Width    | Behavior                                    |
|-------------------|----------|----------------------------------------------|
| `max-lg:` (< 1024px) | 1024px | Wiki sidebar hidden, single column        |
| `max-[1120px]:`   | 1120px   | Guide right ToC hidden                      |
| `max-[860px]:`    | 860px    | Guide left nav collapses to inline block    |
| `max-md:` (< 768px) | 768px  | Nav compact, mobile adjustments             |
| `max-[480px]:`    | 480px    | Search bar hidden in nav                    |

**Note**: We use mobile-last (`max-*:`) breakpoints, not mobile-first (`min-*:`).

---

## 4. Component Patterns

### 4.1 shadcn/ui Primitives (Installed)

Button, Input, Textarea, Select, Dialog, DropdownMenu, Tabs, Badge, Separator, Table, Tooltip, Sheet, Skeleton, Sonner, Avatar, Card

### 4.2 Class Composition

Always use `cn()` from `@/lib/utils` for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<button className={cn(
  'py-2 px-4 rounded-sm border cursor-pointer',
  isActive ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
)} />
```

### 4.3 Common Patterns

**Card backgrounds:**
```
bg-card dark:bg-surface
```

**Nav/footer backgrounds:**
```
bg-card dark:bg-background
```

**Form inputs:**
```
border border-border rounded-sm bg-background text-foreground font-sans py-2.5 px-3
```

**Primary buttons:**
```
bg-primary text-primary-foreground border-none rounded-sm py-2.5 px-3.5 font-sans cursor-pointer
```

**Secondary/cancel buttons:**
```
border border-border rounded-sm py-2.5 px-3.5 font-sans cursor-pointer bg-background text-muted-foreground
```

**Pill badges:**
```
inline-block py-0.5 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wide text-white bg-badge-*
```

**Links (pill style):**
```
inline-block py-1 px-3 bg-card dark:bg-surface border border-border rounded-full text-sm text-primary no-underline transition-colors hover:bg-primary/10 hover:border-primary
```

---

## 5. Border & Shadow Rules

### 5.1 Border Radius

```
Default: rounded-sm (0.125rem) — barely perceptible, almost square
Badges/pills: rounded-full
Avatars: rounded-full
```

This is intentional. Wiki aesthetic = sharp, structured, serious.

### 5.2 Shadows

- **Almost none.** Content surfaces use `border` instead of shadow.
- Dark mode: zero shadows. Borders only.

---

## 6. Interactive States

| State     | Implementation                                           |
|-----------|----------------------------------------------------------|
| Hover     | `hover:bg-primary/10` or `hover:bg-muted`               |
| Active    | `bg-primary/15 text-primary border-primary`              |
| Focus     | `focus-visible:outline-2 outline-primary outline-offset-2` |
| Disabled  | `disabled:opacity-50 disabled:cursor-not-allowed`        |
| Selected  | `border-b-primary text-primary font-semibold` (tabs)     |

---

## 7. Dark Mode Implementation

### 7.1 Strategy

- Tailwind v4 `@custom-variant dark (&:is(.dark *))` in globals.css.
- `ThemeProvider` toggles `.dark` class on `<html>` element.
- Theme persisted in `localStorage` key `korwiki-theme`.
- Default: system preference (`prefers-color-scheme`), then localStorage.

### 7.2 Usage in Components

Use Tailwind `dark:` variant:
```tsx
<div className="bg-card dark:bg-surface border border-border" />
```

No `data-theme` attribute. No separate dark mode CSS selectors. Only `.dark` class + Tailwind `dark:` variant.

---

## 8. Wiki-Specific Patterns

### 8.1 Article Header

```
[Category badge — rounded-full, uppercase, bg-badge-* color]
[Article Title — text-4xl font-bold]
[Edit Article link — pill style]
[2px primary border-bottom divider]
[Metadata — text-xs text-muted-foreground: last updated, tags]
```

### 8.2 Article Content (`.wiki-content`)

Typography for `dangerouslySetInnerHTML` content is defined in `globals.css` `@layer base`:
- `h2`: 1.5rem bold, bottom border, 2rem top margin
- `h3`: 1.125rem bold, 1.5rem top margin
- `p`: 1.25rem bottom margin, 1.7 line height
- `a`: primary color, underline on hover
- `blockquote`: 3px left primary border, italic, muted color
- `table`: collapse, 0.875rem, full width, bordered cells
- `code`: mono font, primary-subtle background
- `del`: line-through, muted, `::after` content " ✦"

### 8.3 Namu Wiki Heading Interactions

Headings in wiki content are parsed by `parseWikiContent()` and wrapped with these global classes:
- `.namu-wiki-heading` — flex container with gap, scroll-margin-top
- `.namu-wiki-num` — accent-colored number, clickable (jumps to ToC)
- `.namu-wiki-content-wrapper` — flex spacer, clickable (toggles collapse)
- `.namu-wiki-text` — bold heading text
- `.namu-wiki-toggle` — chevron SVG, rotates on collapse
- `.wiki-section-body` — section content below heading

These are plain global classes in `globals.css`, NOT CSS modules.

### 8.4 Infobox Pattern

```
[Floating right, 280px, border, rounded-sm]
[Primary-colored header bar with title]
[Key-value grid: 40%/60%, bordered rows]
[Responsive: full-width on max-lg:]
```

### 8.5 Table of Contents (SidebarToC)

- Left sidebar, sticky below nav
- Uses `bg-card dark:bg-surface border border-border rounded-sm p-4`
- Subsections indented with `pl-5` (level 3)
- "CONTENTS" label: `text-xs font-semibold uppercase tracking-widest text-primary`
- Uses `'wiki-section-body'` plain string class for DOM manipulation

---

## 9. Tailwind v4 Configuration

**No `tailwind.config.ts` file.** Tailwind v4 uses CSS-native configuration in `globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-sans: "Public Sans", "Pretendard", "Noto Sans KR", ...;
  --font-mono: "JetBrains Mono", "Fira Code", ...;
  --color-badge-transport: #1a73e8;
  --color-badge-apps: #0f9d58;
  /* ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... shadcn mapping ... */
  --color-surface: var(--surface);
}
```

Design tokens are CSS custom properties in `:root` (light) and `.dark` (dark), mapped to Tailwind via `@theme inline`.

---

## 10. Migration Status

All 5 phases are **COMPLETE** as of 2026-02-18.

| Phase | Status | Summary |
|-------|--------|---------|
| 1. Foundation | Done | Tailwind v4 + PostCSS + shadcn/ui installed |
| 2. Primitives | Done | 16 shadcn components + design tokens configured |
| 3. Shell Rebuild | Done | Navigation + layout + footer converted |
| 4. Page Rebuild | Done | All 10+ components converted, 7 .module.css deleted |
| 5. Cleanup | Done | Legacy bridge removed, data-theme removed, WikiIndexClient converted |

**Zero `.module.css` files remain. Zero `data-theme` references remain. Zero inline style objects remain.**

---

## 11. What NOT to Change (ARCHITECTURE_FINAL constraints)

- Data fetching logic, API routes, DB queries — untouched
- Auth flow (NextAuth providers, session handling) — untouched
- Component props interfaces — keep stable
- Route structure — keep all existing paths
- Security policies (sanitization, RLS, CSP) — do not weaken
- Ad slot positions — keep leaderboard + rectangle concept
- `globals.css` design tokens and base styles — stable
- `parseWikiContent` output class names — match globals.css
- `SidebarToC` DOM manipulation using `'wiki-section-body'` class

---

## 12. For New Components (CODEX Reference)

When building new components (admin pages, editor, search, upload UI), follow these rules:

1. **Use Tailwind utility classes only.** No CSS modules. No inline styles.
2. **Use `cn()` from `@/lib/utils`** for conditional classes.
3. **Follow established patterns** from Section 4.3 (card bg, inputs, buttons, etc.)
4. **Dark mode via `dark:` variant only.** No `data-theme`, no separate selectors.
5. **Responsive via `max-*:` breakpoints** (mobile-last).
6. **Use shadcn primitives** (Button, Dialog, etc.) where they fit.
7. **Keep layout tokens**: use `var(--nav-height)` and `var(--ad-banner-height)` in `calc()` for sticky/scroll positioning.
