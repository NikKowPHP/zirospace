create table case_studies (
  id text primary key,
  title text not null,
  description text not null,
  tags text[] not null,
  images jsonb not null,
  cta_text text not null,
  cta_text_name text not null,
  cta_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS (Row Level Security) policies
alter table case_studies enable row level security;

-- Allow public read access
create policy "Allow public read access"
  on case_studies for select
  using (true); 