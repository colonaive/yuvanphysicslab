create extension if not exists pgcrypto;

create table if not exists public.public_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  content_mdx text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.public_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null default 'note' check (type in ('note', 'paper', 'post')),
  title text not null,
  excerpt text not null default '',
  content_mdx text not null default '',
  published boolean not null default true,
  published_at date,
  updated_at timestamptz not null default now()
);

create index if not exists public_pages_slug_idx on public.public_pages(slug);
create index if not exists public_posts_type_idx on public.public_posts(type);
create index if not exists public_posts_published_idx on public.public_posts(published);
create index if not exists public_posts_published_at_idx on public.public_posts(published_at desc);

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
create policy "public can read pages"
on public.public_pages
for select
to anon, authenticated
using (true);

drop policy if exists "public can read published public posts" on public.public_posts;
create policy "public can read published public posts"
on public.public_posts
for select
to anon, authenticated
using (published = true);

-- Direct writes are intentionally blocked via RLS.
-- Admin writes are performed through server-side code using the service role key
-- after allowlist checks against ADMIN_EMAIL(S).
drop policy if exists "block direct page inserts" on public.public_pages;
create policy "block direct page inserts"
on public.public_pages
for insert
to authenticated
with check (false);

drop policy if exists "block direct page updates" on public.public_pages;
create policy "block direct page updates"
on public.public_pages
for update
to authenticated
using (false)
with check (false);

drop policy if exists "block direct page deletes" on public.public_pages;
create policy "block direct page deletes"
on public.public_pages
for delete
to authenticated
using (false);

drop policy if exists "block direct public post inserts" on public.public_posts;
create policy "block direct public post inserts"
on public.public_posts
for insert
to authenticated
with check (false);

drop policy if exists "block direct public post updates" on public.public_posts;
create policy "block direct public post updates"
on public.public_posts
for update
to authenticated
using (false)
with check (false);

drop policy if exists "block direct public post deletes" on public.public_posts;
create policy "block direct public post deletes"
on public.public_posts
for delete
to authenticated
using (false);

insert into public.public_pages (slug, title, content_mdx)
values
  (
    'home',
    'Precision Notes on Physics, Geometry, and Learning Systems',
    'Yuvan Physics Lab is a living research notebook for formal notes, ongoing investigations, and long-form analysis across gravity, symmetry, and machine intelligence.'
  ),
  (
    'research',
    'Research Focus',
    'Current focus areas include chronology protection, causal structure, and geometry-aware learning systems. This page can be edited instantly in the Lab CMS.'
  ),
  (
    'reading',
    'Reading List',
    'A focused bibliography that informs current work in spacetime geometry and causality.'
  ),
  (
    'paper',
    'Featured Paper',
    'Closed timelike curves challenge classical intuitions about chronology. This featured paper examines geometric mechanisms, causal pathologies, and energy-condition constraints.'
  ),
  (
    'about',
    'About',
    'Yuvan Physics Lab tracks research across geometry, causality, and machine learning. The project is maintained as a continuously updated knowledge base.'
  ),
  (
    'contact',
    'Contact',
    'For research discussions and collaborations, use the form below.'
  ),
  (
    'notes',
    'Research Notes',
    'Compact derivations, references, and conceptual summaries.'
  ),
  (
    'posts',
    'Posts',
    'Public notes and papers, rendered with consistent typography.'
  )
on conflict (slug) do nothing;

insert into public.public_posts (slug, type, title, excerpt, content_mdx, published, published_at)
values
  (
    'chronology-protection-energy-conditions',
    'note',
    'On the Tension Between Chronology Protection and Classical Energy Conditions',
    'A concise note on how semiclassical effects soften classical chronology arguments.',
    E'# Chronology Protection and Energy Conditions\n\nChronology protection can be viewed as a stability statement for causal structure.\n\n## Key thread\n\n- Classical energy conditions are often too rigid.\n- Semiclassical regimes suggest averaged constraints.\n- Backreaction may regulate chronology-violating geometries.\n',
    true,
    date '2026-02-13'
  ),
  (
    'maxwell',
    'note',
    'Maxwell Notes for Geometric PDE Intuition',
    'Working notes that connect Maxwell systems with geometric PDE techniques.',
    E'# Maxwell Notes\n\nThese notes collect identities and geometric intuition used as warm-up tools for curved-space analysis.',
    true,
    date '2026-02-10'
  ),
  (
    'closed-timelike-curves',
    'paper',
    'Investigating Spacetimes with Closed Timelike Curves',
    'A long-form manuscript on chronology, causality, and physical admissibility.',
    E'# Investigating Spacetimes with Closed Timelike Curves\n\nThis manuscript studies chronology-violating geometries and physical constraints from semiclassical gravity.',
    true,
    date '2026-02-08'
  )
on conflict (slug) do nothing;
