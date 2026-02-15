-- Phase 3 follow-up: bridge NextAuth users to Supabase auth.users IDs
-- Safe to run multiple times.

create table if not exists public.user_identities (
  nextauth_subject text primary key,
  email text not null,
  supabase_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null
);

alter table public.user_identities enable row level security;
