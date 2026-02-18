-- Architecture Final Batch 9
-- Re-seed the 10 keeper wiki docs with markdown-first content templates
-- Assumes batch 7 and batch 8 have been applied.

with seed as (
  select *
  from (
    values
      (
        'kakaot',
        'KakaoT',
        'Apps',
        'Practical guide to using Kakao T for taxis in Korea.',
        ARRAY['transport', 'taxi', 'apps']::text[],
        ARRAY['t-money', 'naver-map', 'kakao-map']::text[],
$$## Overview
KakaoT is the most common ride-hailing app for local taxis.

## Setup
1. Install Kakao T.
2. Sign in with Kakao account.
3. Add a card if needed.

## Practical Tips
- Pin your pickup point exactly.
- Short rides may get fewer accepts at peak time.
- For airport runs, compare with buses and AREX.

## Related
- See also: T-Money, Naver Map, Kakao Map.
$$
      ),
      (
        'ktx',
        'KTX',
        'Transport',
        'How to book and ride Korea Train Express (KTX).',
        ARRAY['transport', 'rail', 'intercity']::text[],
        ARRAY['t-money', 'naver-map']::text[],
$$## Overview
KTX is Korea's high-speed rail network for major city-to-city travel.

## Booking
1. Use Korail app/site or station kiosks.
2. Reserve early for holidays/weekends.

## Station Flow
- Arrive 15 to 20 minutes early.
- Car and seat numbers are on ticket and platform signs.

## Practical Tips
- Keep your ticket QR ready.
- Last trains sell out first on busy routes.
$$
      ),
      (
        't-money',
        'T-Money',
        'Transport',
        'Transit card basics: where to buy, top up, and use T-Money.',
        ARRAY['transport', 'payment', 'card']::text[],
        ARRAY['kakaot', 'ktx', 'convenience-store']::text[],
$$## Overview
T-Money is a stored-value card used for buses, subways, and some taxis.

## Where to Buy
- Convenience stores
- Subway stations

## How to Use
1. Tap in on entry.
2. Tap out on exit.

## Tips
- Keep balance above your next fare.
- Use convenience stores for quick top-up.
$$
      ),
      (
        'naver-map',
        'Naver Map',
        'Apps',
        'Navigation and local search with Naver Map.',
        ARRAY['apps', 'maps', 'navigation']::text[],
        ARRAY['kakao-map', 'kakaot']::text[],
$$## Overview
Naver Map is strong for local place data and public transit routes.

## Core Use Cases
- Subway/bus routing
- Walking directions
- Place reviews and hours

## Tips
- Check last-train times before late-night travel.
- Save frequent places for quick access.
$$
      ),
      (
        'kakao-map',
        'Kakao Map',
        'Apps',
        'Navigation and place search with Kakao Map.',
        ARRAY['apps', 'maps', 'navigation']::text[],
        ARRAY['naver-map', 'kakaot']::text[],
$$## Overview
Kakao Map is popular for quick map lookup and place discovery.

## Core Use Cases
- Fast place search
- Simple routing
- Neighborhood exploration

## Tips
- Compare routes with Naver Map when unsure.
- Use map links in chat for easier meetup coordination.
$$
      ),
      (
        'convenience-store',
        'Convenience Store',
        'Practical',
        'How to use Korean convenience stores efficiently.',
        ARRAY['daily-life', 'shopping', 'practical']::text[],
        ARRAY['t-money', 'soju']::text[],
$$## Overview
Convenience stores are key for quick food, transit top-up, and essentials.

## What You Can Do
- Buy snacks and drinks
- Top up T-Money
- Pick up basic toiletries

## Tips
- Look for 1+1 or 2+1 promotions.
- Night hours vary by neighborhood.
$$
      ),
      (
        'soju',
        'Soju',
        'Culture',
        'Basic social etiquette and practical notes about soju culture.',
        ARRAY['culture', 'food-drink', 'social']::text[],
        ARRAY['noraebang', 'hongdae']::text[],
$$## Overview
Soju is one of Korea's most common alcoholic drinks in social settings.

## Social Basics
- Pour for others before yourself in group settings.
- Pace yourself and drink water.

## Practical Notes
- Pairing with food is common.
- Last train planning matters after late gatherings.
$$
      ),
      (
        'pc-bang',
        'PC Bang',
        'Culture',
        'What to expect at Korean PC bangs and how to use them.',
        ARRAY['culture', 'gaming', 'practical']::text[],
        ARRAY['hongdae']::text[],
$$## Overview
PC bangs are gaming cafes with hourly seat pricing.

## First Visit
1. Register/login at counter or kiosk.
2. Start time from your seat.
3. Order snacks if available.

## Tips
- Peak hours can be crowded.
- Keep track of your remaining time.
$$
      ),
      (
        'noraebang',
        'Noraebang',
        'Culture',
        'How karaoke rooms work in Korea and common etiquette.',
        ARRAY['culture', 'nightlife', 'social']::text[],
        ARRAY['hongdae', 'soju']::text[],
$$## Overview
Noraebang means private karaoke room, common for friend groups and team outings.

## Typical Flow
1. Choose room size.
2. Pay by time.
3. Use remote/songbook to queue songs.

## Tips
- Extend time before your slot ends.
- Keep voice volume respectful in shared buildings.
$$
      ),
      (
        'hongdae',
        'Hongdae',
        'Places',
        'Quick orientation guide to Hongdae for food, nightlife, and transit.',
        ARRAY['places', 'seoul', 'nightlife']::text[],
        ARRAY['noraebang', 'soju', 'kakaot']::text[],
$$## Overview
Hongdae is a high-energy district known for nightlife, street culture, and youth-oriented venues.

## What to Expect
- Dense restaurant and bar clusters
- Live busking and weekend crowds
- Late-night transport considerations

## Tips
- Save your return route before midnight.
- Use ride-hailing if subway closing time is near.
$$
      )
  ) as t(slug, title, category, summary, tags, related_articles, content)
),
upserted as (
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
  )
  select
    s.slug,
    s.title,
    s.category,
    s.summary,
    s.content,
    'markdown',
    s.tags,
    s.related_articles,
    current_date
  from seed s
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
  'Keeper markdown seed',
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
