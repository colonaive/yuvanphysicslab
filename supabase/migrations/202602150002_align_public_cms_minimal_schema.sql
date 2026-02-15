create extension if not exists pgcrypto;

create table if not exists public.public_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  content_md text not null default '',
  content_mdx text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.public_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  excerpt text,
  content_md text not null default '',
  content_mdx text not null default '',
  type text not null default 'post' check (type in ('note', 'paper', 'post')),
  published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.public_pages add column if not exists content_md text not null default '';
alter table public.public_pages add column if not exists content_mdx text not null default '';
alter table public.public_pages add column if not exists created_at timestamptz not null default now();
alter table public.public_pages add column if not exists updated_at timestamptz not null default now();

alter table public.public_posts add column if not exists excerpt text;
alter table public.public_posts add column if not exists content_md text not null default '';
alter table public.public_posts add column if not exists content_mdx text not null default '';
alter table public.public_posts add column if not exists type text not null default 'post';
alter table public.public_posts add column if not exists published boolean not null default true;
alter table public.public_posts add column if not exists created_at timestamptz not null default now();
alter table public.public_posts add column if not exists updated_at timestamptz not null default now();
alter table public.public_posts add column if not exists published_at timestamptz;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'public_posts'
      and column_name = 'published_at'
      and data_type = 'date'
  ) then
    alter table public.public_posts
      alter column published_at type timestamptz
      using published_at::timestamptz;
  end if;
end
$$;

alter table public.public_posts
  drop constraint if exists public_posts_type_check;

alter table public.public_posts
  add constraint public_posts_type_check
  check (type in ('note', 'paper', 'post'));

create or replace function public.set_public_pages_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_public_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists public_pages_set_updated_at on public.public_pages;
create trigger public_pages_set_updated_at
before update on public.public_pages
for each row
execute function public.set_public_pages_updated_at();

drop trigger if exists public_posts_set_updated_at on public.public_posts;
create trigger public_posts_set_updated_at
before update on public.public_posts
for each row
execute function public.set_public_posts_updated_at();

alter table public.public_pages enable row level security;
alter table public.public_posts enable row level security;

drop policy if exists "public can read pages" on public.public_pages;
drop policy if exists "public can read published public posts" on public.public_posts;
drop policy if exists "public can read posts" on public.public_posts;

create policy "public can read pages"
on public.public_pages
for select
to anon, authenticated
using (true);

create policy "public can read posts"
on public.public_posts
for select
to anon, authenticated
using (true);

drop policy if exists "block direct page inserts" on public.public_pages;
drop policy if exists "block direct page updates" on public.public_pages;
drop policy if exists "block direct page deletes" on public.public_pages;
drop policy if exists "block direct public post inserts" on public.public_posts;
drop policy if exists "block direct public post updates" on public.public_posts;
drop policy if exists "block direct public post deletes" on public.public_posts;

insert into public.public_pages (slug, title, content_md, content_mdx)
values (
  'home',
  'Home',
  '# Home\n\nPublic homepage placeholder content.',
  '# Home\n\nPublic homepage placeholder content.'
)
on conflict (slug) do nothing;

insert into public.public_posts (slug, title, excerpt, content_md, content_mdx, type, published, published_at)
values (
  'first-post',
  'First Post',
  'Initial seeded post.',
  '# First Post\n\nThis is the initial seeded post.',
  '# First Post\n\nThis is the initial seeded post.',
  'post',
  true,
  now()
)
on conflict (slug) do nothing;
