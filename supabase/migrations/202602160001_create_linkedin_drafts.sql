create extension if not exists pgcrypto;

create table if not exists public.linkedin_drafts (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text,
  body text not null,
  hashtags text[] not null default '{}',
  link_url text,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists linkedin_drafts_updated_at_idx
on public.linkedin_drafts(updated_at desc);

create index if not exists linkedin_drafts_created_at_idx
on public.linkedin_drafts(created_at desc);

create or replace function public.set_linkedin_drafts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists linkedin_drafts_set_updated_at on public.linkedin_drafts;
create trigger linkedin_drafts_set_updated_at
before update on public.linkedin_drafts
for each row
execute function public.set_linkedin_drafts_updated_at();

alter table public.linkedin_drafts enable row level security;

drop policy if exists "block linkedin draft selects" on public.linkedin_drafts;
create policy "block linkedin draft selects"
on public.linkedin_drafts
for select
to anon, authenticated
using (false);

drop policy if exists "block linkedin draft inserts" on public.linkedin_drafts;
create policy "block linkedin draft inserts"
on public.linkedin_drafts
for insert
to anon, authenticated
with check (false);

drop policy if exists "block linkedin draft updates" on public.linkedin_drafts;
create policy "block linkedin draft updates"
on public.linkedin_drafts
for update
to anon, authenticated
using (false)
with check (false);

drop policy if exists "block linkedin draft deletes" on public.linkedin_drafts;
create policy "block linkedin draft deletes"
on public.linkedin_drafts
for delete
to anon, authenticated
using (false);

grant all privileges on table public.linkedin_drafts to service_role;

