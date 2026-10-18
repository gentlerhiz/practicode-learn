-- Courses, daily review and projects.

-- 1. Courses a learner has joined. Starting a lesson joins its course, so nobody has to sign up twice.
create table public.enrollments (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  track_slug text not null references public.tracks (slug),
  enrolled_at timestamptz not null default now(),
  primary key (learner_id, track_slug)
);
alter table public.enrollments enable row level security;
revoke all on public.enrollments from anon, authenticated;
grant select, insert, delete on public.enrollments to authenticated;
grant select, insert, update, delete on public.enrollments to service_role;
create policy "learners read their courses" on public.enrollments for select to authenticated
  using ((select auth.uid()) = learner_id);
create policy "learners join live courses" on public.enrollments for insert to authenticated
  with check (
    (select auth.uid()) = learner_id
    and exists (select 1 from public.tracks t where t.slug = track_slug and t.status = 'live')
  );
create policy "learners leave courses" on public.enrollments for delete to authenticated
  using ((select auth.uid()) = learner_id);

create function public.enroll_on_progress() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.enrollments (learner_id, track_slug)
  select new.learner_id, l.track_slug from public.lessons l where l.id = new.lesson_id
  on conflict do nothing;
  return new;
end $$;
revoke execute on function public.enroll_on_progress from public, anon, authenticated;
create trigger lesson_progress_enrolls after insert on public.lesson_progress
  for each row execute function public.enroll_on_progress();

insert into public.enrollments (learner_id, track_slug, enrolled_at)
select p.learner_id, l.track_slug, min(p.started_at)
from public.lesson_progress p join public.lessons l on l.id = p.lesson_id
group by p.learner_id, l.track_slug
on conflict do nothing;

-- 2. Review cards: each lesson's recap cards, written by the content pipeline. A learner can read a
-- card once they've completed its lesson, so Pro cards stay with Pro lessons.
create table public.lesson_cards (
  id text primary key check (id ~ '^[a-z]{2}-\d{2}-\d{2}:[0-9a-f]{8}$'),
  lesson_id text not null references public.lessons (id) on delete cascade,
  position int not null check (position between 0 and 20),
  front text not null check (char_length(front) between 1 and 600),
  back text not null check (char_length(back) between 1 and 1200)
);
create index lesson_cards_lesson on public.lesson_cards (lesson_id);
alter table public.lesson_cards enable row level security;
revoke all on public.lesson_cards from anon, authenticated;
grant select on public.lesson_cards to authenticated;
grant select, insert, update, delete on public.lesson_cards to service_role;
create policy "learners read cards from lessons they finished" on public.lesson_cards for select to authenticated
  using (
    exists (
      select 1 from public.lesson_progress p
      where p.lesson_id = lesson_cards.lesson_id
        and p.learner_id = (select auth.uid())
        and p.status = 'completed'
    )
  );

-- Each learner's memory of each card, scheduled by FSRS (ts-fsrs field names). It only affects the
-- learner's own review, so learners write their own rows; nothing here feeds the impact figures.
create table public.review_cards (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  card_id text not null references public.lesson_cards (id) on delete cascade,
  due timestamptz not null default now(),
  stability double precision not null default 0 check (stability >= 0),
  difficulty double precision not null default 0 check (difficulty >= 0 and difficulty <= 10),
  elapsed_days int not null default 0 check (elapsed_days >= 0),
  scheduled_days int not null default 0 check (scheduled_days >= 0),
  learning_steps int not null default 0 check (learning_steps >= 0),
  reps int not null default 0 check (reps >= 0),
  lapses int not null default 0 check (lapses >= 0),
  state smallint not null default 0 check (state between 0 and 3),
  last_review timestamptz,
  created_at timestamptz not null default now(),
  primary key (learner_id, card_id)
);
create index review_cards_due on public.review_cards (learner_id, due);
alter table public.review_cards enable row level security;
revoke all on public.review_cards from anon, authenticated;
grant select, insert, update on public.review_cards to authenticated;
grant select, insert, update, delete on public.review_cards to service_role;
create policy "learners read their review" on public.review_cards for select to authenticated
  using ((select auth.uid()) = learner_id);
create policy "learners start reviewing cards they can read" on public.review_cards for insert to authenticated
  with check (
    (select auth.uid()) = learner_id
    and exists (select 1 from public.lesson_cards c where c.id = card_id)
  );
create policy "learners update their review" on public.review_cards for update to authenticated
  using ((select auth.uid()) = learner_id) with check ((select auth.uid()) = learner_id);

create table public.review_log (
  id bigint generated always as identity primary key,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  card_id text not null references public.lesson_cards (id) on delete cascade,
  rating smallint not null check (rating between 1 and 4),
  reviewed_at timestamptz not null default now()
);
create index review_log_learner_time on public.review_log (learner_id, reviewed_at);
alter table public.review_log enable row level security;
revoke all on public.review_log from anon, authenticated;
grant select, insert on public.review_log to authenticated;
grant select, insert, update, delete on public.review_log to service_role;
create policy "learners read their review log" on public.review_log for select to authenticated
  using ((select auth.uid()) = learner_id);
create policy "learners log their reviews" on public.review_log for insert to authenticated
  with check ((select auth.uid()) = learner_id and reviewed_at <= now() + interval '1 minute');

-- 3. Projects: one per module, briefed like a client job. The catalogue is written by the content
-- pipeline; packs live in the lesson buckets under projects/.
create table public.projects (
  id text primary key check (id ~ '^[a-z]{2}-p\d{2}$'),
  track_slug text not null references public.tracks (slug),
  module int not null check (module between 1 and 99),
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  description text not null,
  free boolean not null default false,
  version int not null check (version >= 1),
  -- The checks the brief defines; every project also has the accessibility and screen-size checks.
  checks int not null check (checks between 1 and 30),
  -- Projects that are published on the web need the learner's address before they pass.
  needs_site boolean not null default false,
  bytes int not null check (bytes > 0),
  hash text not null,
  pack_path text not null,
  published_at timestamptz not null default now(),
  unique (track_slug, module),
  unique (track_slug, slug)
);
alter table public.projects enable row level security;
revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select, insert, update, delete on public.projects to service_role;
create policy "projects are public" on public.projects for select to anon, authenticated using (true);

-- A learner's work on a project: drafts autosave here. Learners can write their files, site address and
-- latest check results, but only pass_project() can mark the work passed.
create table public.project_work (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  project_id text not null references public.projects (id),
  project_version int not null check (project_version >= 1),
  files jsonb not null default '[]'::jsonb
    check (jsonb_typeof(files) = 'array' and pg_column_size(files) < 262144),
  site_url text check (site_url ~ '^https://[^\s]{4,280}$'),
  status text not null default 'draft' check (status in ('draft', 'passed')),
  results jsonb check (results is null or (jsonb_typeof(results) = 'array' and pg_column_size(results) < 16384)),
  review jsonb check (review is null or (jsonb_typeof(review) = 'array' and pg_column_size(review) < 4096)),
  updated_at timestamptz not null default now(),
  passed_at timestamptz,
  primary key (learner_id, project_id)
);
alter table public.project_work enable row level security;
revoke all on public.project_work from anon, authenticated;
grant select on public.project_work to authenticated;
grant insert (learner_id, project_id, project_version, files, site_url, results, updated_at) on public.project_work to authenticated;
grant update (project_version, files, site_url, results, updated_at) on public.project_work to authenticated;
grant select, insert, update, delete on public.project_work to service_role;
create policy "learners read their projects" on public.project_work for select to authenticated
  using ((select auth.uid()) = learner_id);
create policy "learners start projects" on public.project_work for insert to authenticated
  with check ((select auth.uid()) = learner_id);
create policy "learners save their projects" on public.project_work for update to authenticated
  using ((select auth.uid()) = learner_id) with check ((select auth.uid()) = learner_id);

-- Marks a project passed, once every check passed and the self-review is complete. The checks run in the
-- learner's browser, like lesson tests: this is practice, not an exam, so the results are taken as sent,
-- but their shape is checked, and so are the project's module lessons and its site address.
create function public.pass_project(p_project text, p_results jsonb, p_review jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_project public.projects%rowtype;
  v_site text;
begin
  if v_uid is null then raise exception 'sign in first' using errcode = '28000'; end if;
  select * into v_project from public.projects where id = p_project;
  if not found then raise exception 'unknown project' using errcode = '22023'; end if;
  if jsonb_typeof(p_results) <> 'array' or jsonb_array_length(p_results) < v_project.checks + 2
    or exists (select 1 from jsonb_array_elements(p_results) r where (r ->> 'pass') is distinct from 'true') then
    raise exception 'every check has to pass' using errcode = '22023';
  end if;
  if jsonb_typeof(p_review) <> 'array' or jsonb_array_length(p_review) = 0
    or exists (select 1 from jsonb_array_elements(p_review) r where r::text <> 'true') then
    raise exception 'answer every self-review question' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.lessons l
    where l.track_slug = v_project.track_slug and l.module = v_project.module
      and not exists (
        select 1 from public.lesson_progress p
        where p.learner_id = v_uid and p.lesson_id = l.id and p.status = 'completed'
      )
  ) then
    raise exception 'finish the module''s lessons first' using errcode = '22023';
  end if;
  select site_url into v_site from public.project_work where learner_id = v_uid and project_id = p_project;
  if not found then raise exception 'save the project first' using errcode = '22023'; end if;
  if v_project.needs_site and v_site is null then
    raise exception 'add the address where the project is live' using errcode = '22023';
  end if;
  update public.project_work set
    status = 'passed',
    results = p_results,
    review = p_review,
    passed_at = coalesce(passed_at, now()),
    updated_at = now()
  where learner_id = v_uid and project_id = p_project;
end $$;
revoke execute on function public.pass_project from public, anon;
grant execute on function public.pass_project to authenticated;
