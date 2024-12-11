-- Enable the UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop existing policies if they exist
drop policy if exists "Allow anonymous access to business_info" on public.business_info;
drop policy if exists "Allow authenticated users to update business_info" on public.business_info;
drop policy if exists "Allow insert access to business_info" on public.business_info;

-- Create the business_info table
create table if not exists public.business_info (
  id uuid default uuid_generate_v4() primary key,
  business_id text,
  name text,
  address text,
  city text,
  state text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.business_info enable row level security;

-- Create policy to allow anonymous access
create policy "Allow anonymous access to business_info"
  on public.business_info
  for select
  to anon
  using (true);

-- Create policy to allow authenticated users to update
create policy "Allow authenticated users to update business_info"
  on public.business_info
  for update
  to authenticated
  using (true)
  with check (true);

-- Create policy to allow insert
create policy "Allow insert access to business_info"
  on public.business_info
  for insert
  to anon
  with check (true); 