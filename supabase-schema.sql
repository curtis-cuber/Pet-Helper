-- Run this SQL in your Supabase project under SQL Editor

-- ── POSTS ──
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  owner_email text not null,
  pet_name text not null,
  photo_link text,
  animal_type text not null,
  color text not null,
  description text not null,
  date_missing date not null,
  last_seen_location text not null,
  contact_info text not null,
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

-- ── PROFILES ──
create table profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users unique not null,
  display_name text,
  avatar_url text
);

-- ── NOTIFICATIONS ──
create table notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  message text not null,
  is_read boolean default false,
  post_id uuid references posts(id) on delete cascade
);

-- ── MESSAGES ──
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  sender_id uuid references auth.users not null,
  receiver_id uuid references auth.users not null,
  post_id uuid references posts(id) on delete cascade not null,
  message_text text not null,
  is_read boolean default false
);

-- ── REPORTS ──
create table reports (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  post_id uuid references posts(id) on delete cascade not null
);

-- ── VIEW COUNT FUNCTION ──
create or replace function increment_view_count(post_id uuid)
returns void as $$
  update posts set view_count = view_count + 1 where id = post_id;
$$ language sql;

-- ── ROW LEVEL SECURITY ──
alter table posts enable row level security;
alter table comments enable row level security;
alter table profiles enable row level security;
alter table notifications enable row level security;
alter table messages enable row level security;

-- Posts
create policy "Anyone can read posts" on posts for select using (true);
create policy "Logged-in users can create posts" on posts for insert with check (auth.uid() = user_id);
create policy "Owners can update their own posts" on posts for update using (auth.uid() = user_id);
create policy "Owners can delete their own posts" on posts for delete using (auth.uid() = user_id);

-- Comments
create policy "Anyone can read comments" on comments for select using (true);
create policy "Anyone can post a comment" on comments for insert with check (true);

-- Profiles
create policy "Anyone can read profiles" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = user_id);
create policy "Users can delete their own profile" on profiles for delete using (auth.uid() = user_id);

-- Notifications
create policy "Users can read their own notifications" on notifications for select using (auth.uid() = user_id);
create policy "System can insert notifications" on notifications for insert with check (true);
create policy "Users can update their own notifications" on notifications for update using (auth.uid() = user_id);
create policy "Users can delete their own notifications" on notifications for delete using (auth.uid() = user_id);

-- Messages
create policy "Users can read their own messages" on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Logged-in users can send messages" on messages for insert with check (auth.uid() = sender_id);
