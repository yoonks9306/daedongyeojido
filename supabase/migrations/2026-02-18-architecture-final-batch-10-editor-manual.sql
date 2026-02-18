-- Architecture Final Batch 10
-- Add dedicated wiki article: Editor Manual

with upserted as (
  insert into public.wiki_articles (
    slug,
    title,
    category,
    summary,
    content,
    content_format,
    tags,
    related_articles,
    last_updated
  ) values (
    'editor-manual',
    'Editor Manual',
    'Practical',
    'Detailed writing guide for markdown, wiki links, media embed, and editing workflow.',
$$## Overview
This document explains how to write wiki pages using the editor.

## Core Markdown
### Headings
Use:
- `## Section`
- `### Subsection`

### Text styles
- Bold: `**bold**`
- Italic: `*italic*`
- Strike: `~~strike~~`
- Inline code: `` `code` ``

### Quote and Code Block
Quote:
> your note

Code block:
```
code goes here
```

### Table (GFM)
| Column A | Column B |
| --- | --- |
| Value 1 | Value 2 |

## Links
### External link
`[Label](https://example.com)`

### Internal wiki link
- `[[kakaot]]`
- `[[kakaot|Kakao T Guide]]`

When you type `[[` in editor, autocomplete suggests existing wiki pages.

## Image
Upload via toolbar and editor inserts:
`![alt text](https://...)`

## YouTube and Map Embed
### YouTube
- Basic: `[YouTube](https://www.youtube.com/watch?v=VIDEO_ID)`
- Sized/aligned: `[YouTube|large|center](https://www.youtube.com/watch?v=VIDEO_ID)`

### Google Map
- Basic: `[Google Map](https://maps.google.com/?q=Seoul+Station)`
- Sized/aligned: `[Google Map|small|left](https://maps.google.com/?q=Gyeongbokgung)`

### Embed options
- Size: `small`, `medium`, `large`
- Align: `left`, `center`, `right`

## Writing Workflow
1. Write in Editor mode.
2. Check layout in Split View or Preview.
3. Save and verify rendered page.

## Tips
- Keep sections short and scannable.
- Prefer internal wiki links for related concepts.
- Use tables only when comparison is truly needed.
- For person/place pages, keep facts concise in opening sections.
$$,
    'markdown',
    ARRAY['manual', 'editing', 'markdown']::text[],
    ARRAY['kakaot', 'naver-map', 'kakao-map']::text[],
    current_date
  )
  on conflict (slug) do update
  set
    title = excluded.title,
    category = excluded.category,
    summary = excluded.summary,
    content = excluded.content,
    content_format = excluded.content_format,
    tags = excluded.tags,
    related_articles = excluded.related_articles,
    last_updated = excluded.last_updated
  returning id, slug, title, category, summary, content, tags, related_articles
),
next_rev as (
  select
    u.*,
    coalesce(
      (
        select max(wr.revision_number) + 1
        from public.wiki_revisions wr
        where wr.article_id = u.id
      ),
      1
    ) as revision_number
  from upserted u
)
insert into public.wiki_revisions (
  article_id,
  revision_number,
  content,
  content_hash,
  content_format,
  summary,
  proposed_title,
  proposed_category,
  proposed_summary,
  proposed_tags,
  proposed_related_articles,
  author_id,
  author_name,
  status
)
select
  n.id,
  n.revision_number,
  n.content,
  md5(n.content),
  'markdown',
  'Editor manual seed',
  n.title,
  n.category,
  n.summary,
  n.tags,
  n.related_articles,
  null,
  'system-seed',
  'active'
from next_rev n
on conflict (article_id, revision_number) do nothing;
