-- Projects can now be programs (Python or SQL) as well as pages. A program has no page to check for
-- accessibility or screen sizes, so the workspace reports its brief's checks plus one built-in check (it
-- runs without errors) instead of four. pass_project() now asks for the brief's checks plus at least one,
-- which a page's results (the brief's checks plus four) still meet. Everything else is unchanged.
create or replace function public.pass_project(p_project text, p_results jsonb, p_review jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_project public.projects%rowtype;
  v_site text;
begin
  if v_uid is null then raise exception 'sign in first' using errcode = '28000'; end if;
  select * into v_project from public.projects where id = p_project;
  if not found then raise exception 'unknown project' using errcode = '22023'; end if;
  if jsonb_typeof(p_results) <> 'array' or jsonb_array_length(p_results) < v_project.checks + 1
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
