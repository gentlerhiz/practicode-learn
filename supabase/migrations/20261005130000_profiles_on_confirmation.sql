-- A learner counts from the moment they confirm their email, not when they ask for a sign-up code.
-- Unconfirmed sign-ups get no profile, so the impact figures never count them and we keep no data about
-- people who never finished signing up. Google accounts arrive confirmed, so they get one straight away.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is null then return new; end if;
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 80))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.handle_new_user();
