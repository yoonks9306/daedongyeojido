-- Phase 3 completion: local email/password auth table
-- Safe to run multiple times.

create table if not exists public.local_auth_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text not null,
  password_hash text not null,
  created_at timestamptz default now() not null
);

alter table public.local_auth_users enable row level security;
