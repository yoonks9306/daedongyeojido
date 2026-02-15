-- KorWiki Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jjdtxdsurkcuxwauusfc/sql

-- Wiki Articles
create table if not exists wiki_articles (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  category text not null check (category in ('Transport', 'Apps', 'Food', 'Culture', 'Places', 'Practical')),
  summary text not null,
  infobox jsonb,
  content text not null,
  related_articles text[] default '{}',
  tags text[] default '{}',
  last_updated date not null,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Community Posts
create table if not exists community_posts (
  id bigint generated always as identity primary key,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  category text not null check (category in ('review', 'question', 'free', 'tip')),
  upvotes integer default 0 not null,
  views integer default 0 not null,
  comment_count integer default 0 not null,
  tags text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Votes (one vote per user per post)
create table if not exists votes (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id bigint references community_posts(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, post_id)
);

-- Comments
create table if not exists comments (
  id bigint generated always as identity primary key,
  post_id bigint references community_posts(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger wiki_articles_updated_at
  before update on wiki_articles
  for each row execute function update_updated_at();

create trigger community_posts_updated_at
  before update on community_posts
  for each row execute function update_updated_at();

create trigger comments_updated_at
  before update on comments
  for each row execute function update_updated_at();

-- RLS (Row Level Security)
alter table wiki_articles enable row level security;
alter table community_posts enable row level security;
alter table votes enable row level security;
alter table comments enable row level security;

-- Public read access
create policy "wiki_articles_public_read" on wiki_articles for select using (true);
create policy "community_posts_public_read" on community_posts for select using (true);
create policy "comments_public_read" on comments for select using (true);

-- Authenticated write access
create policy "community_posts_auth_insert" on community_posts for insert with check (auth.uid() is not null);
create policy "community_posts_own_update" on community_posts for update using (auth.uid() = author_id);
create policy "votes_auth_insert" on votes for insert with check (auth.uid() = user_id);
create policy "votes_own_delete" on votes for delete using (auth.uid() = user_id);
create policy "comments_auth_insert" on comments for insert with check (auth.uid() is not null);
create policy "comments_own_update" on comments for update using (auth.uid() = author_id);

-- Wiki: any authenticated user can insert/update (community wiki model)
create policy "wiki_articles_auth_insert" on wiki_articles for insert with check (auth.uid() is not null);
create policy "wiki_articles_auth_update" on wiki_articles for update using (auth.uid() is not null);

-- Indexes for performance
create index if not exists wiki_articles_category_idx on wiki_articles(category);
create index if not exists wiki_articles_tags_idx on wiki_articles using gin(tags);
create index if not exists community_posts_created_at_idx on community_posts(created_at desc);
create index if not exists community_posts_upvotes_idx on community_posts(upvotes desc);
