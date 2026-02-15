-- RPC function to atomically increment community post views
create or replace function increment_views(row_id bigint)
returns void as $$
begin
  update community_posts
  set views = views + 1
  where id = row_id;
end;
$$ language plpgsql security definer;
