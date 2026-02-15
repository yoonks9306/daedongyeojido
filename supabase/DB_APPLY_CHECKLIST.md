# Supabase DB Apply Checklist

Use this once after pulling the latest code for Phase 3 community write/vote.

## 1) Apply migration SQL

In Supabase Dashboard:

1. Open `SQL Editor`
2. Run `supabase/migrations/2026-02-16-user-identities.sql`
3. Run `supabase/migrations/2026-02-16-local-auth-users.sql`

## 2) Verify table exists

Run this query in `SQL Editor`:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('user_identities', 'local_auth_users');
```

Expected: two rows: `user_identities`, `local_auth_users`.

## 3) Verify app env vars

Local `.env.local` must have:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Vercel must also have:

- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 4) Smoke test

1. Sign in with Google or GitHub
2. Go to `/community/new`
3. Submit a post
4. Back on `/community`, click `▲` on a post
5. Verify email/password sign-up + log-in from `/login`

Expected:

- Post creation succeeds (no `Missing table public.user_identities` error)
- Upvote toggles and persists after refresh
