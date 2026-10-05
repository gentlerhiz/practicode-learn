-- The only way to write progress. Validates every field so learners can't inflate their own record,
-- which keeps the impact figures trustworthy.
create function public.record_progress(
  p_event_id uuid,
  p_lesson_id text,
  p_lesson_version int,
  p_verb text,
  p_occurred_at timestamptz,
  p_steps_done int,
  p_active_seconds int,
  p_attempts jsonb,
  p_offline boolean default false
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_minutes int;
  v_steps int;
  v_version int;
begin
  if v_uid is null then raise exception 'sign in first' using errcode = '28000'; end if;
  select minutes, steps, version into v_minutes, v_steps, v_version from public.lessons where id = p_lesson_id;
  if not found then raise exception 'unknown lesson' using errcode = '22023'; end if;
  if p_verb not in ('lesson_started', 'lesson_completed') then raise exception 'unknown verb' using errcode = '22023'; end if;
  if p_lesson_version < 1 or p_lesson_version > v_version then raise exception 'unknown lesson version' using errcode = '22023'; end if;
  if p_occurred_at > now() + interval '5 minutes' or p_occurred_at < now() - interval '30 days' then
    raise exception 'event time out of range' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_attempts, '{}'::jsonb)) <> 'object' or pg_column_size(p_attempts) >= 2048 then
    raise exception 'bad attempts' using errcode = '22023';
  end if;

  insert into public.learning_events (id, learner_id, verb, lesson_id, lesson_version, offline, occurred_at)
  values (p_event_id, v_uid, p_verb, p_lesson_id, p_lesson_version, coalesce(p_offline, false), p_occurred_at)
  on conflict (id) do nothing;
  if not found then return; end if; -- a retried event changes nothing

  insert into public.lesson_progress as lp (learner_id, lesson_id, lesson_version, status, steps_done, active_seconds, attempts, completed_at)
  values (
    v_uid, p_lesson_id, p_lesson_version,
    case when p_verb = 'lesson_completed' then 'completed' else 'started' end,
    least(greatest(p_steps_done, 0), v_steps),
    least(greatest(p_active_seconds, 0), v_minutes * 60 * 3),
    coalesce(p_attempts, '{}'::jsonb),
    case when p_verb = 'lesson_completed' then p_occurred_at end
  )
  on conflict (learner_id, lesson_id) do update set
    lesson_version = greatest(lp.lesson_version, excluded.lesson_version),
    status = case when lp.status = 'completed' then 'completed' else excluded.status end,
    steps_done = greatest(lp.steps_done, excluded.steps_done),
    -- each event reports seconds since the last one; a lesson can't add more than ten times its length
    active_seconds = least(lp.active_seconds + excluded.active_seconds, v_minutes * 60 * 10),
    attempts = excluded.attempts,
    completed_at = coalesce(lp.completed_at, excluded.completed_at),
    updated_at = now();
end $$;

revoke execute on function public.record_progress from public, anon;
grant execute on function public.record_progress to authenticated;
