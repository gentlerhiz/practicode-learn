-- Paystack payments. One row per successful charge, keyed by Paystack's reference, so the same payment
-- reported twice (the checkout callback and the webhook, or a webhook retry) extends Pro only once.
-- Written only with the secret key, after the server has verified the charge with Paystack.
create table public.payments (
  reference text primary key,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  billing text not null check (billing in ('monthly', 'yearly')),
  -- In the currency's smallest unit (kobo for NGN), as Paystack reports it.
  amount bigint not null check (amount > 0),
  currency text not null,
  channel text,
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index payments_learner on public.payments (learner_id, paid_at desc);

alter table public.payments enable row level security;
revoke all on public.payments from anon, authenticated;
grant select on public.payments to authenticated;
grant select, insert, update, delete on public.payments to service_role;
create policy "learners read their own payments" on public.payments for select to authenticated
  using ((select auth.uid()) = learner_id);

-- Records a verified payment and gives (or extends) Pro by one billing period, counted from when the
-- current period ends, or from now if it already has. Returns the new end, or null if this reference was
-- already recorded. A subscription's code arrives separately (subscription.create), so it isn't set here.
create function public.record_payment(
  p_reference text,
  p_learner uuid,
  p_billing text,
  p_amount bigint,
  p_currency text,
  p_channel text,
  p_paid_at timestamptz,
  p_customer text
) returns timestamptz
language plpgsql volatile security definer set search_path = '' as $$
declare
  period interval := case p_billing when 'yearly' then interval '1 year' else interval '1 month' end;
  new_end timestamptz;
begin
  insert into public.payments (reference, learner_id, billing, amount, currency, channel, paid_at)
    values (p_reference, p_learner, p_billing, p_amount, p_currency, p_channel, p_paid_at)
    on conflict (reference) do nothing;
  if not found then return null; end if;

  insert into public.memberships as m (learner_id, source, billing, status, current_period_end, provider_customer)
    values (p_learner, 'paystack', p_billing, 'active', now() + period, p_customer)
  on conflict (learner_id) do update set
    source = 'paystack',
    billing = excluded.billing,
    status = 'active',
    current_period_end = greatest(coalesce(m.current_period_end, now()), now()) + period,
    provider_customer = coalesce(excluded.provider_customer, m.provider_customer),
    updated_at = now()
  returning current_period_end into new_end;
  return new_end;
end
$$;

revoke all on function public.record_payment(text, uuid, text, bigint, text, text, timestamptz, text) from public, anon, authenticated;
grant execute on function public.record_payment(text, uuid, text, bigint, text, text, timestamptz, text) to service_role;
