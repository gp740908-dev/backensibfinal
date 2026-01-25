
-- Table to store admin push subscriptions
create table if not exists admin_push_subscriptions (
  endpoint text primary key,
  keys jsonb not null,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (optional, depending on your auth model for admin)
alter table admin_push_subscriptions enable row level security;

-- Allow insert/delete for authenticated users (admins)
create policy "Allow admins to manage subscriptions"
  on admin_push_subscriptions
  for all
  using (auth.role() = 'authenticated');
