-- Run this entire block in Supabase SQL Editor
-- It drops old tables and creates clean ones with no login required

-- Drop old tables
drop table if exists messages cascade;
drop table if exists notifications cascade;
drop table if exists profiles cascade;
drop table if exists reports cascade;
drop table if exists comments cascade;
drop table if exists posts cascade;

-- ── POSTS ──
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  pet_name text not null,
  photo_link text,
  animal_type text not null,
  color text not null,
  description text not null,
  date_missing date not null,
  last_seen_location text not null,
  contact_info text not null,
  pet_age text,
  pet_size text,
  urgency text default 'Normal',
  reward text,
  is_found boolean default false,
  view_count integer default 0
);

-- ── COMMENTS ──
create table comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  post_id uuid references posts(id) on delete cascade not null,
  commenter_name text not null,
  comment_text text not null
);

-- ── REPORTS ──
create table reports (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  post_id uuid references posts(id) on delete cascade not null,
  reason text
);

-- ── VIEW COUNT FUNCTION ──
create or replace function increment_view_count(post_id uuid)
returns void as $$
  update posts set view_count = view_count + 1 where id = post_id;
$$ language sql;

-- ── ROW LEVEL SECURITY ──
alter table posts enable row level security;
alter table comments enable row level security;
alter table reports enable row level security;

-- Posts: anyone can read and create, no login needed
create policy "Anyone can read posts"   on posts for select using (true);
create policy "Anyone can create posts" on posts for insert with check (true);
create policy "Anyone can update posts" on posts for update using (true);

-- Comments: anyone can read and post
create policy "Anyone can read comments"   on comments for select using (true);
create policy "Anyone can post a comment"  on comments for insert with check (true);

-- Reports: anyone can report a post
create policy "Anyone can file a report" on reports for insert with check (true);
create policy "Anyone can read reports"  on reports for select using (true);
