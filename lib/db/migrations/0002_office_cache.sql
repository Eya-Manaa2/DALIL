create table if not exists office_cache (
  key text primary key,
  offices jsonb not null,
  fetched_at timestamptz not null default now()
);
