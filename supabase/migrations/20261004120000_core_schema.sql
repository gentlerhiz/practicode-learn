-- Catalogue: written only by the content pipeline with the secret key. Everyone can read it.
create table public.tracks (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  status text not null check (status in ('live', 'coming_soon')),
  position int not null,
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id text primary key check (id ~ '^[a-z]{2}-\d{2}-\d{2}$'),
  track_slug text not null references public.tracks (slug),
  module int not null check (module between 1 and 99),
  lesson int not null check (lesson between 1 and 99),
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  description text not null,
  minutes int not null check (minutes between 1 and 60),
  free boolean not null default false,
  version int not null check (version >= 1),
  steps int not null check (steps between 1 and 60),
  bytes int not null check (bytes > 0),
  hash text not null,
  pack_path text not null,
  published_at timestamptz not null default now(),
  unique (track_slug, slug),
  unique (track_slug, module, lesson)
);

-- One row per learner. Country comes from the connection at sign-up (server only), never from the client.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  country_code char(2) check (country_code ~ '^[A-Z]{2}$'),
  role text not null default 'learner' check (role in ('learner', 'admin')),
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id),
  lesson_version int not null,
  status text not null check (status in ('started', 'completed')),
  steps_done int not null default 0 check (steps_done >= 0),
  active_seconds int not null default 0 check (active_seconds between 0 and 86400),
  attempts jsonb not null default '{}'::jsonb check (pg_column_size(attempts) < 2048),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, lesson_id)
);

-- Append-only learning record (xAPI-style). The id is generated on the device, so retries are idempotent.
create table public.learning_events (
  id uuid primary key,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  verb text not null check (verb in ('lesson_started', 'lesson_completed')),
  lesson_id text not null references public.lessons (id),
  lesson_version int not null,
  offline boolean not null default false,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now()
);
create index learning_events_learner_time on public.learning_events (learner_id, occurred_at);
create index learning_events_time on public.learning_events (occurred_at);

-- Monthly impact figures without personal data, so evidence survives account deletions.
create table public.impact_snapshots (
  month date primary key,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.tracks enable row level security;
alter table public.lessons enable row level security;
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.learning_events enable row level security;
alter table public.impact_snapshots enable row level security;

-- New Supabase projects no longer grant table access by default (changelog, 28 April 2026), so every
-- privilege is explicit. Grants decide which tables a role can reach; the policies below decide which rows.
revoke all on public.tracks, public.lessons, public.profiles, public.lesson_progress, public.learning_events,
  public.impact_snapshots from anon, authenticated;
grant select on public.tracks, public.lessons to anon, authenticated;
grant select on public.profiles, public.lesson_progress, public.learning_events, public.impact_snapshots to authenticated;
grant update (display_name) on public.profiles to authenticated;
-- The secret key (server code, the content pipeline and the snapshot job) works with every table.
grant select, insert, update, delete on public.tracks, public.lessons, public.profiles, public.lesson_progress,
  public.learning_events, public.impact_snapshots to service_role;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')
$$;
-- Only signed-in policies call it; visitors have no use for it.
revoke execute on function public.is_admin from public, anon;
grant execute on function public.is_admin to authenticated, service_role;

create policy "catalogue is public" on public.tracks for select to anon, authenticated using (true);
create policy "lessons are public" on public.lessons for select to anon, authenticated using (true);
create policy "learners read their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "learners rename themselves" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "learners read their own progress" on public.lesson_progress for select to authenticated using ((select auth.uid()) = learner_id);
create policy "learners read their own events" on public.learning_events for select to authenticated using ((select auth.uid()) = learner_id);
create policy "admins read snapshots" on public.impact_snapshots for select to authenticated using (public.is_admin());
-- No insert, update or delete policies on progress or events: writes go through record_progress().

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 80));
  return new;
end $$;
revoke execute on function public.handle_new_user from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
