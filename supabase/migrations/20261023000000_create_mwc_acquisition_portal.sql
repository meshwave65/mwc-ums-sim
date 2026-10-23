-- MWC acquisition portal: manual validation, per-operation ledger, private tax identity.
-- The BRL reference price follows the documented launch-price hypothesis; payment instructions
-- intentionally remain empty until the administrator configures the receiving account.
create table if not exists public.mwc_sale_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.mwc_sale_admins enable row level security;
revoke all on public.mwc_sale_admins from anon, authenticated;

create or replace function public.is_mwc_sale_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.mwc_sale_admins a where a.user_id = auth.uid()
  );
$$;
revoke all on function public.is_mwc_sale_admin() from public, anon;
grant execute on function public.is_mwc_sale_admin() to authenticated;

create table if not exists public.mwc_meshwalker_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  country_code text not null check (country_code in ('BR','PT','OTHER')),
  tax_id_type text not null check (tax_id_type in ('CPF','NIF','OTHER')),
  tax_id text not null check (length(trim(tax_id)) between 3 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mwc_meshwalker_profiles enable row level security;
create policy "mwc_profile_select_owner_admin" on public.mwc_meshwalker_profiles
  for select to authenticated using (user_id = auth.uid() or public.is_mwc_sale_admin());
create policy "mwc_profile_insert_owner" on public.mwc_meshwalker_profiles
  for insert to authenticated with check (user_id = auth.uid());
create policy "mwc_profile_update_owner" on public.mwc_meshwalker_profiles
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update on public.mwc_meshwalker_profiles to authenticated;

create table if not exists public.mwc_sale_prices (
  currency text primary key check (currency in ('BRL','EUR')),
  price_per_mwc numeric(20,8) not null check (price_per_mwc > 0),
  enabled boolean not null default false,
  payment_instructions text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.mwc_sale_prices enable row level security;
create policy "mwc_prices_select_enabled_or_admin" on public.mwc_sale_prices
  for select to authenticated using (enabled or public.is_mwc_sale_admin());
grant select on public.mwc_sale_prices to authenticated;

insert into public.mwc_sale_prices (currency, price_per_mwc, enabled, payment_instructions)
values ('BRL', 0.02160500, true, '')
on conflict (currency) do nothing;

create table if not exists public.mwc_acquisitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mwc_meshwalker_profiles(user_id) on delete restrict,
  currency text not null check (currency in ('BRL','EUR')),
  fiat_amount numeric(20,2) not null check (fiat_amount > 0),
  price_per_mwc numeric(20,8) not null check (price_per_mwc > 0),
  mwc_quantity numeric(24,8) not null check (mwc_quantity > 0),
  status text not null default 'pending_validation' check (status in ('pending_validation','validated','rejected')),
  payment_reference text,
  admin_note text,
  blockchain_tx_hash text,
  created_at timestamptz not null default now(),
  validated_at timestamptz,
  validated_by uuid references auth.users(id)
);
create index if not exists mwc_acquisitions_user_created_idx
  on public.mwc_acquisitions(user_id, created_at desc);
create index if not exists mwc_acquisitions_status_created_idx
  on public.mwc_acquisitions(status, created_at);
alter table public.mwc_acquisitions enable row level security;
create policy "mwc_acquisitions_select_owner_admin" on public.mwc_acquisitions
  for select to authenticated using (user_id = auth.uid() or public.is_mwc_sale_admin());
grant select on public.mwc_acquisitions to authenticated;
revoke insert, update, delete on public.mwc_acquisitions from anon, authenticated;

create table if not exists public.mwc_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  acquisition_id uuid not null unique references public.mwc_acquisitions(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  amount_mwc numeric(24,8) not null check (amount_mwc > 0),
  created_at timestamptz not null default now()
);
create index if not exists mwc_wallet_ledger_user_created_idx
  on public.mwc_wallet_ledger(user_id, created_at desc);
alter table public.mwc_wallet_ledger enable row level security;
create policy "mwc_ledger_select_owner_admin" on public.mwc_wallet_ledger
  for select to authenticated using (user_id = auth.uid() or public.is_mwc_sale_admin());
grant select on public.mwc_wallet_ledger to authenticated;
revoke insert, update, delete on public.mwc_wallet_ledger from anon, authenticated;

create table if not exists public.mwc_acquisition_events (
  id uuid primary key default gen_random_uuid(),
  acquisition_id uuid not null references public.mwc_acquisitions(id) on delete restrict,
  actor_id uuid references auth.users(id),
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists mwc_acquisition_events_acquisition_idx
  on public.mwc_acquisition_events(acquisition_id, created_at);
alter table public.mwc_acquisition_events enable row level security;
create policy "mwc_events_select_owner_admin" on public.mwc_acquisition_events
  for select to authenticated using (
    public.is_mwc_sale_admin() or exists (
      select 1 from public.mwc_acquisitions a
      where a.id = acquisition_id and a.user_id = auth.uid()
    )
  );
grant select on public.mwc_acquisition_events to authenticated;
revoke insert, update, delete on public.mwc_acquisition_events from anon, authenticated;

create or replace function public.create_mwc_acquisition(p_currency text, p_amount numeric)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user uuid := auth.uid();
  v_currency text := upper(trim(p_currency));
  v_price numeric(20,8);
  v_instructions text;
  v_quantity numeric(24,8);
  v_id uuid;
begin
  if v_user is null then raise exception 'Autenticação necessária'; end if;
  if v_currency not in ('BRL','EUR') then raise exception 'Moeda inválida'; end if;
  if p_amount is null or p_amount <= 0 or p_amount > 10000000 then
    raise exception 'Informe um valor positivo dentro do limite permitido';
  end if;
  if not exists (select 1 from public.mwc_meshwalker_profiles p where p.user_id = v_user) then
    raise exception 'Complete o cadastro fiscal antes de solicitar uma aquisição';
  end if;
  select price_per_mwc, payment_instructions into v_price, v_instructions
  from public.mwc_sale_prices
  where currency = v_currency and enabled = true;
  if not found then raise exception 'Aquisições nesta moeda ainda não estão habilitadas'; end if;
  if nullif(trim(v_instructions), '') is null then
    raise exception 'A administração ainda não configurou as instruções de pagamento para esta moeda';
  end if;
  v_quantity := round(p_amount / v_price, 8);
  if v_quantity <= 0 then raise exception 'O valor informado não gera quantidade válida de MWC'; end if;
  insert into public.mwc_acquisitions
    (user_id, currency, fiat_amount, price_per_mwc, mwc_quantity, status)
  values
    (v_user, v_currency, round(p_amount,2), v_price, v_quantity, 'pending_validation')
  returning id into v_id;
  insert into public.mwc_acquisition_events
    (acquisition_id, actor_id, event_type, old_status, new_status, note)
  values
    (v_id, v_user, 'acquisition_requested', null, 'pending_validation', 'Solicitação registrada; aguarda conferência manual.');
  return v_id;
end;
$$;
revoke all on function public.create_mwc_acquisition(text,numeric) from public, anon;
grant execute on function public.create_mwc_acquisition(text,numeric) to authenticated;

create or replace function public.admin_set_mwc_sale_price(
  p_currency text,
  p_price_per_mwc numeric,
  p_enabled boolean,
  p_payment_instructions text
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_currency text := upper(trim(p_currency));
begin
  if not public.is_mwc_sale_admin() then raise exception 'Acesso administrativo necessário'; end if;
  if v_currency not in ('BRL','EUR') then raise exception 'Moeda inválida'; end if;
  if p_price_per_mwc is null or p_price_per_mwc <= 0 then raise exception 'Preço deve ser positivo'; end if;
  insert into public.mwc_sale_prices(currency, price_per_mwc, enabled, payment_instructions, updated_at, updated_by)
  values (v_currency, round(p_price_per_mwc,8), coalesce(p_enabled,false), coalesce(p_payment_instructions,''), now(), auth.uid())
  on conflict (currency) do update set
    price_per_mwc = excluded.price_per_mwc,
    enabled = excluded.enabled,
    payment_instructions = excluded.payment_instructions,
    updated_at = now(),
    updated_by = auth.uid();
end;
$$;
revoke all on function public.admin_set_mwc_sale_price(text,numeric,boolean,text) from public, anon;
grant execute on function public.admin_set_mwc_sale_price(text,numeric,boolean,text) to authenticated;

create or replace function public.admin_decide_mwc_acquisition(
  p_acquisition_id uuid,
  p_decision text,
  p_admin_note text default null,
  p_blockchain_tx_hash text default null
)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.mwc_acquisitions%rowtype;
  v_decision text := lower(trim(p_decision));
begin
  if not public.is_mwc_sale_admin() then raise exception 'Acesso administrativo necessário'; end if;
  if v_decision not in ('validated','rejected') then raise exception 'Decisão inválida'; end if;
  select * into v_row from public.mwc_acquisitions where id = p_acquisition_id for update;
  if not found then raise exception 'Aquisição não encontrada'; end if;
  if v_row.status <> 'pending_validation' then raise exception 'A aquisição já foi processada'; end if;

  update public.mwc_acquisitions
  set status = v_decision,
      admin_note = nullif(trim(p_admin_note),''),
      blockchain_tx_hash = nullif(trim(p_blockchain_tx_hash),''),
      validated_at = case when v_decision = 'validated' then now() else null end,
      validated_by = auth.uid()
  where id = p_acquisition_id;

  if v_decision = 'validated' then
    insert into public.mwc_wallet_ledger(acquisition_id, user_id, amount_mwc)
    values (v_row.id, v_row.user_id, v_row.mwc_quantity);
  end if;

  insert into public.mwc_acquisition_events
    (acquisition_id, actor_id, event_type, old_status, new_status, note)
  values
    (v_row.id, auth.uid(), 'admin_decision', v_row.status, v_decision, nullif(trim(p_admin_note),''));
  return v_decision;
end;
$$;
revoke all on function public.admin_decide_mwc_acquisition(uuid,text,text,text) from public, anon;
grant execute on function public.admin_decide_mwc_acquisition(uuid,text,text,text) to authenticated;
