-- MWC Storage Node V0 — shared object metadata and private object storage.
-- Applied to Supabase project ufylccbdjfzydbwhpmpp on 2026-10-22.
-- Existing tables and the existing sofia_storage_user bucket are intentionally untouched.

create table if not exists public.mwc_storage_objects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  node_id uuid not null,
  object_hash text not null check (object_hash ~ '^[0-9a-f]{64}$'),
  storage_path text not null unique,
  original_name text not null,
  content_type text,
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now(),
  constraint mwc_storage_objects_node_hash_unique unique (node_id, object_hash)
);

create index if not exists mwc_storage_objects_hash_idx
  on public.mwc_storage_objects (object_hash);
create index if not exists mwc_storage_objects_owner_created_idx
  on public.mwc_storage_objects (owner_id, created_at desc);

alter table public.mwc_storage_objects enable row level security;

drop policy if exists "mwc_storage_objects_read_authenticated" on public.mwc_storage_objects;
create policy "mwc_storage_objects_read_authenticated"
  on public.mwc_storage_objects for select to authenticated
  using (true);

drop policy if exists "mwc_storage_objects_insert_owner" on public.mwc_storage_objects;
create policy "mwc_storage_objects_insert_owner"
  on public.mwc_storage_objects for insert to authenticated
  with check (owner_id = (select auth.uid()));

grant select, insert on public.mwc_storage_objects to authenticated;
revoke all on public.mwc_storage_objects from anon;

insert into storage.buckets (id, name, public, file_size_limit)
values ('mwc-storage-objects', 'mwc-storage-objects', false, 20971520)
on conflict (id) do nothing;

drop policy if exists "mwc_storage_objects_bucket_read_authenticated" on storage.objects;
create policy "mwc_storage_objects_bucket_read_authenticated"
  on storage.objects for select to authenticated
  using (bucket_id = 'mwc-storage-objects');

drop policy if exists "mwc_storage_objects_bucket_insert_authenticated" on storage.objects;
create policy "mwc_storage_objects_bucket_insert_authenticated"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'mwc-storage-objects');
