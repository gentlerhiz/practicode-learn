insert into storage.buckets (id, name, public) values ('lessons-free', 'lessons-free', true), ('lessons-pro', 'lessons-pro', false)
on conflict (id) do nothing;
-- Free packs are public through the bucket's public URL. Pro packs are only reachable through signed URLs
-- created on the server after a plan check (slice 4), so no select policy is granted on lessons-pro.
