-- Pro membership. One row per learner who has (or had) Pro; no row means Free. Written only with the secret
-- key: by hand for now (npm run pro -- grant <email>), and by the Paystack webhook once subscriptions open.
-- Statuses follow Paystack's subscription states, so a webhook can copy them across as they are.
create table public.memberships (
  learner_id uuid primary key references public.profiles (id) on delete cascade,
  plan text not null default 'pro' check (plan in ('pro')),
  source text not null check (source in ('granted', 'paystack')),
  billing text check (billing in ('monthly', 'yearly')),
  status text not null default 'active'
    check (status in ('active', 'non_renewing', 'attention', 'completed', 'cancelled')),
  -- Pro lasts until this moment (the end of the paid period). Empty means no end, for granted memberships.
  current_period_end timestamptz,
  provider_customer text,
  provider_subscription text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memberships enable row level security;
revoke all on public.memberships from anon, authenticated;
grant select on public.memberships to authenticated;
grant select, insert, update, delete on public.memberships to service_role;
create policy "learners read their own membership" on public.memberships for select to authenticated
  using ((select auth.uid()) = learner_id);
-- No insert, update or delete policies: nobody can give themselves Pro.

-- True while the signed-in learner has Pro. A cancelled or failing subscription keeps Pro until the period
-- it was paid for ends; 'completed' and 'cancelled' with no period left mean Free.
create function public.is_pro() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.memberships
    where learner_id = (select auth.uid())
      and plan = 'pro'
      and (current_period_end is null or current_period_end > now())
      and (status in ('active', 'non_renewing', 'attention') or current_period_end > now())
  )
$$;
revoke execute on function public.is_pro from public, anon;
grant execute on function public.is_pro to authenticated, service_role;

-- Pro lesson packs: readable by Pro members only. The app downloads them with the learner's own session, so
-- the database makes the final decision, not the app.
create policy "pro members read pro packs" on storage.objects for select to authenticated
  using (bucket_id = 'lessons-pro' and (select public.is_pro()));
