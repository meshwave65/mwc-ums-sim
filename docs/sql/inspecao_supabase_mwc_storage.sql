-- MWC Storage Node V0 — diagnóstico somente leitura do Supabase
-- Execute no SQL Editor do projeto Supabase que o simulador já utiliza.
-- Este arquivo NÃO cria nem altera tabelas, buckets, permissões ou dados.
-- Compartilhe os resultados sem incluir tokens, chaves ou dados pessoais.

-- 1) Existência e colunas das tabelas envolvidas no simulador atual.
select
  table_schema,
  table_name,
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'clients',
    'mw_chain_metadata',
    'mw_blocks',
    'mw_transactions',
    'mw_state_snapshots'
  )
order by table_name, ordinal_position;

-- 2) Constraints e índices únicos usados para upsert idempotente.
select
  ns.nspname as schema_name,
  tbl.relname as table_name,
  idx.relname as index_name,
  pg_get_indexdef(i.indexrelid) as index_definition,
  i.indisunique as is_unique,
  i.indisprimary as is_primary
from pg_index i
join pg_class tbl on tbl.oid = i.indrelid
join pg_namespace ns on ns.oid = tbl.relnamespace
join pg_class idx on idx.oid = i.indexrelid
where ns.nspname = 'public'
  and tbl.relname in (
    'clients',
    'mw_chain_metadata',
    'mw_blocks',
    'mw_transactions',
    'mw_state_snapshots'
  )
order by tbl.relname, idx.relname;

-- 3) RLS e políticas das tabelas públicas relevantes.
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  p.policyname,
  p.permissive,
  p.roles,
  p.cmd,
  p.qual as using_expression,
  p.with_check as check_expression
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p
  on p.schemaname = n.nspname
 and p.tablename = c.relname
where n.nspname = 'public'
  and c.relkind in ('r', 'p')
  and c.relname in (
    'clients',
    'mw_chain_metadata',
    'mw_blocks',
    'mw_transactions',
    'mw_state_snapshots'
  )
order by c.relname, p.policyname;

-- 4) Existência e configuração do bucket usado atualmente pelo simulador.
select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id = 'sofia_storage_user';

-- 5) Políticas RLS aplicadas aos objetos do Storage.
-- As expressões podem conter nomes internos; revise antes de compartilhar publicamente.
select
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check as check_expression
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;

-- 6) Somente metadados dos objetos já existentes no prefixo MWC do bucket.
-- Não retorna o conteúdo dos arquivos.
select
  bucket_id,
  name,
  owner_id,
  created_at,
  updated_at,
  metadata
from storage.objects
where bucket_id = 'sofia_storage_user'
  and name like 'mwc-ums/%'
order by name
limit 100;
