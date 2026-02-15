# Supabase DB Apply Checklist

Use this after pulling the latest code for Phase 3 and wiki content expansion.

## 1) Apply migration SQL

In Supabase Dashboard:

1. Open `SQL Editor`
2. Run `supabase/migrations/2026-02-16-user-identities.sql`
3. Run `supabase/migrations/2026-02-16-local-auth-users.sql`
4. Run `supabase/migrations/2026-02-16-wiki-expansion-batch-1.sql` (wiki content batch)

## 2) Verify table exists

Run this query in `SQL Editor`:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('user_identities', 'local_auth_users', 'wiki_articles');
```

Expected: three rows including `wiki_articles`.

## 3) Verify wiki expansion rows

Run this query in `SQL Editor`:

```sql
select count(*) as expanded_rows
from wiki_articles
where slug in (
  'airport-rail-vs-limousine',
  'airport-arrival-checklist',
  'trash-and-recycling-korea',
  'late-night-transport-seoul',
  'papago-and-translation-stack',
  'delivery-apps-korea',
  'kakao-talk-etiquette',
  'weather-and-air-quality-korea',
  'banking-for-foreigners-korea',
  'mobile-payments-korea',
  'hospital-visit-korea',
  'pharmacy-in-korea',
  'emergency-numbers-korea',
  'accommodation-contract-basics',
  'goshiwon-reality',
  'workplace-culture-korea',
  'study-abroad-korea-basics',
  'health-insurance-basics-korea'
);
```

Expected: `18`.

## 4) Verify app env vars

Local `.env.local` must have:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Vercel must also have:

- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 5) Smoke test

1. Sign in with Google or GitHub
2. Go to `/wiki`
3. Search one new slug keyword (example: `airport` or `pharmacy`)
4. Open the article and verify body/related links render
5. Go to `/community/new` and verify write flow still works

Expected:

- New wiki documents are visible
- Existing community write/vote flow still passes
