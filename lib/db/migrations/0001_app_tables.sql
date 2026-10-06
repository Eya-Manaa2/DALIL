create table if not exists rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (key, window_start)
);
create index if not exists rate_limits_window_start_idx on rate_limits (window_start);

create table if not exists usage_events (
  id serial primary key,
  created_at timestamptz not null default now(),
  source text not null,
  audience text,
  needs text[] not null default '{}',
  governorate text,
  results_count integer
);
create index if not exists usage_events_created_at_idx on usage_events (created_at);

create table if not exists field_reports (
  id serial primary key,
  created_at timestamptz not null default now(),
  office_name text not null,
  governorate text not null,
  kind text not null,
  details text,
  status text not null default 'new'
);
create index if not exists field_reports_status_created_at_idx on field_reports (status, created_at desc);
