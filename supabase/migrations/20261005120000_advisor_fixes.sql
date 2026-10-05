-- Follow-ups from Supabase's security and performance advisors (5 October 2026).

-- The impact figures and lesson lookups filter progress and events by lesson.
create index lesson_progress_lesson on public.lesson_progress (lesson_id);
create index learning_events_lesson on public.learning_events (lesson_id);

-- Projects created with "RLS on by default" get public.rls_auto_enable(), an event-trigger function that the
-- API lists as callable. It only ever runs as an event trigger and nobody needs to call it, so close it.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
