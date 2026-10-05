-- Definitions match docs/product/impact-metrics.md. Admins and the snapshot job only.
-- The secret key reaches the database as the service_role claim; auth.role() is deprecated, so read the claim.
create function public.impact_summary() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not (public.is_admin() or coalesce((select auth.jwt() ->> 'role'), '') = 'service_role') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'measured_at', now(),
    'registered_learners', (select count(*) from public.profiles),
    'countries_reached', (select count(distinct country_code) from public.profiles where country_code is not null),
    'learners_started_a_lesson', (select count(distinct learner_id) from public.lesson_progress),
    'lessons_completed', (select count(*) from public.lesson_progress where status = 'completed'),
    'active_learners_28d', (select count(distinct learner_id) from public.learning_events where verb = 'lesson_completed' and occurred_at >= now() - interval '28 days'),
    'hours_of_learning', (select round(coalesce(sum(active_seconds), 0) / 3600.0, 1) from public.lesson_progress),
    'activation_rate_24h', (
      select round(100.0 * count(*) filter (where exists (
        select 1 from public.learning_events e where e.learner_id = p.id and e.verb = 'lesson_completed' and e.occurred_at < p.created_at + interval '24 hours'
      )) / nullif(count(*), 0), 1)
      from public.profiles p where p.created_at < now() - interval '24 hours'),
    'week4_retention', (
      select round(100.0 * count(*) filter (where exists (
        select 1 from public.learning_events e where e.learner_id = p.id and e.occurred_at >= p.created_at + interval '21 days' and e.occurred_at < p.created_at + interval '28 days'
      )) / nullif(count(*), 0), 1)
      from public.profiles p where p.created_at < now() - interval '28 days'),
    'module1_completion', (
      with m1 as (select id from public.lessons where track_slug = 'front-end-web-development' and module = 1),
      starters as (select distinct learner_id from public.lesson_progress where lesson_id in (select id from m1)),
      finishers as (
        select learner_id from public.lesson_progress
        where lesson_id in (select id from m1) and status = 'completed'
        group by learner_id having count(*) = (select count(*) from m1)
      )
      select round(100.0 * (select count(*) from finishers) / nullif((select count(*) from starters), 0), 1)),
    'offline_completions', (select count(*) from public.learning_events where verb = 'lesson_completed' and offline)
  );
end $$;

create function public.impact_countries() returns table (country_code char(2), learners bigint, active_learners_28d bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not (public.is_admin() or coalesce((select auth.jwt() ->> 'role'), '') = 'service_role') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query
    select p.country_code, count(*), count(*) filter (where exists (
      select 1 from public.learning_events e where e.learner_id = p.id and e.verb = 'lesson_completed' and e.occurred_at >= now() - interval '28 days'))
    from public.profiles p where p.country_code is not null group by p.country_code order by 2 desc;
end $$;

revoke execute on function public.impact_summary, public.impact_countries from public, anon;
grant execute on function public.impact_summary, public.impact_countries to authenticated, service_role;
