-- The AI tutor (ADR 0006): one row per question a learner asks. The rows are the daily quota and the
-- 30-day log for safety review; nothing here is used to train models. Learners read their own rows, and
-- write only through the functions below, so nobody can ask past their cap.
create table public.tutor_questions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^[a-z]{2}-\d{2}-\d{2}$'),
  step int not null check (step between 0 and 99),
  question text not null check (char_length(question) between 1 and 500),
  answer text check (char_length(answer) <= 4000),
  created_at timestamptz not null default now()
);
create index tutor_questions_learner_day on public.tutor_questions (learner_id, created_at desc);
create index tutor_questions_age on public.tutor_questions (created_at);

alter table public.tutor_questions enable row level security;
revoke all on public.tutor_questions from anon, authenticated;
grant select on public.tutor_questions to authenticated;
grant select, insert, update, delete on public.tutor_questions to service_role;
create policy "learners read their own tutor questions" on public.tutor_questions for select to authenticated
  using ((select auth.uid()) = learner_id);

-- The daily caps. Change them here (create or replace), with no deploy: Free 5, Pro 20 for the beta.
create function public.tutor_daily_cap() returns int
language sql stable security definer set search_path = '' as $$
  select case when public.is_pro() then 20 else 5 end
$$;

-- Today starts at midnight in Lagos, where most learners are.
create function public.tutor_quota() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'used', (
      select count(*) from public.tutor_questions
      where learner_id = (select auth.uid())
        and created_at >= (date_trunc('day', now() at time zone 'Africa/Lagos') at time zone 'Africa/Lagos')
    ),
    'cap', public.tutor_daily_cap()
  )
$$;

-- Takes one question from today's quota and returns its id, or a null id when the cap is reached. A lock
-- per learner stops two tabs racing past the cap. Logs older than 30 days are deleted as we go.
create function public.tutor_claim(p_lesson text, p_step int, p_question text) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  quota jsonb;
  new_id uuid;
begin
  if me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(hashtext('tutor:' || me::text));
  delete from public.tutor_questions where created_at < now() - interval '30 days';
  quota := public.tutor_quota();
  if (quota->>'used')::int >= (quota->>'cap')::int then
    return quota || jsonb_build_object('id', null);
  end if;
  insert into public.tutor_questions (learner_id, lesson_id, step, question)
    values (me, p_lesson, p_step, p_question) returning id into new_id;
  return jsonb_build_object('id', new_id, 'used', (quota->>'used')::int + 1, 'cap', (quota->>'cap')::int);
end
$$;

-- Saves the answer to a claimed question, or, with no answer (the AI was unavailable), gives the question
-- back to the learner's quota.
create function public.tutor_settle(p_id uuid, p_answer text) returns void
language plpgsql volatile security definer set search_path = '' as $$
begin
  if p_answer is null then
    delete from public.tutor_questions where id = p_id and learner_id = (select auth.uid()) and answer is null;
  else
    update public.tutor_questions set answer = left(p_answer, 4000)
      where id = p_id and learner_id = (select auth.uid()) and answer is null;
  end if;
end
$$;

revoke all on function public.tutor_daily_cap(), public.tutor_quota(), public.tutor_claim(text, int, text),
  public.tutor_settle(uuid, text) from public, anon;
grant execute on function public.tutor_daily_cap(), public.tutor_quota(), public.tutor_claim(text, int, text),
  public.tutor_settle(uuid, text) to authenticated;
