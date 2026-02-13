create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  excerpt text,
  content_md text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_status_idx on public.posts(status);
create index if not exists posts_published_at_idx on public.posts(published_at desc);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_posts_updated_at();

alter table public.posts enable row level security;

drop policy if exists "public can read published posts" on public.posts;
create policy "public can read published posts"
on public.posts
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "authenticated can read own posts" on public.posts;
create policy "authenticated can read own posts"
on public.posts
for select
to authenticated
using (author_id = auth.uid());

drop policy if exists "authenticated can insert own posts" on public.posts;
create policy "authenticated can insert own posts"
on public.posts
for insert
to authenticated
with check (author_id = auth.uid());

drop policy if exists "authenticated can update own posts" on public.posts;
create policy "authenticated can update own posts"
on public.posts
for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "authenticated can delete own posts" on public.posts;
create policy "authenticated can delete own posts"
on public.posts
for delete
to authenticated
using (author_id = auth.uid());
