-- Add a unique reference per MWC acquisition and private proof submission.
alter table public.mwc_acquisitions
  add column if not exists payment_code text,
  add column if not exists payer_transaction_reference text,
  add column if not exists payment_proof_path text;

update public.mwc_acquisitions
set payment_code = 'MWC-' || upper(substr(replace(id::text, '-', ''), 1, 10))
where payment_code is null;

alter table public.mwc_acquisitions
  alter column payment_code set default ('MWC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  alter column payment_code set not null;

create unique index if not exists mwc_acquisitions_payment_code_uidx
  on public.mwc_acquisitions(payment_code);

create or replace function public.create_mwc_acquisition(p_currency text, p_amount numeric)
returns uuid language plpgsql security definer set search_path = public, auth as $$
declare
  v_user uuid := auth.uid();
  v_currency text := upper(trim(p_currency));
  v_price numeric(20,8);
  v_instructions text;
  v_quantity numeric(24,8);
  v_id uuid;
  v_code text;
begin
  if v_user is null then raise exception 'Autenticação necessária'; end if;
  if v_currency not in ('BRL','EUR') then raise exception 'Moeda inválida'; end if;
  if p_amount is null or p_amount <= 0 or p_amount > 10000000 then raise exception 'Informe um valor positivo dentro do limite permitido'; end if;
  if not exists (select 1 from public.mwc_meshwalker_profiles p where p.user_id = v_user) then raise exception 'Complete o cadastro fiscal antes de solicitar uma aquisição'; end if;
  select price_per_mwc, payment_instructions into v_price, v_instructions from public.mwc_sale_prices where currency = v_currency and enabled = true;
  if not found then raise exception 'Aquisições nesta moeda ainda não estão habilitadas'; end if;
  if nullif(trim(v_instructions), '') is null then raise exception 'A administração ainda não configurou as instruções de pagamento para esta moeda'; end if;
  v_quantity := round(p_amount / v_price, 8);
  if v_quantity <= 0 then raise exception 'O valor informado não gera quantidade válida de MWC'; end if;
  insert into public.mwc_acquisitions(user_id, currency, fiat_amount, price_per_mwc, mwc_quantity, status)
  values (v_user, v_currency, round(p_amount,2), v_price, v_quantity, 'pending_validation') returning id into v_id;
  v_code := 'MWC-' || upper(substr(replace(v_id::text, '-', ''), 1, 10));
  update public.mwc_acquisitions set payment_code = v_code where id = v_id;
  insert into public.mwc_acquisition_events(acquisition_id, actor_id, event_type, old_status, new_status, note)
  values (v_id, v_user, 'acquisition_requested', null, 'pending_validation', 'Solicitação registrada; aguarda conferência manual. Código de pagamento: ' || v_code);
  return v_id;
end;
$$;
revoke all on function public.create_mwc_acquisition(text,numeric) from public, anon;
grant execute on function public.create_mwc_acquisition(text,numeric) to authenticated;

create or replace function public.submit_mwc_payment_proof(
  p_acquisition_id uuid,
  p_payer_transaction_reference text,
  p_payment_proof_path text
) returns void language plpgsql security definer set search_path = public, auth as $$
declare v_row public.mwc_acquisitions%rowtype; v_reference text := nullif(trim(p_payer_transaction_reference), ''); v_path text := nullif(trim(p_payment_proof_path), '');
begin
  if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
  select * into v_row from public.mwc_acquisitions where id = p_acquisition_id and user_id = auth.uid() for update;
  if not found then raise exception 'Aquisição não encontrada'; end if;
  if v_row.status <> 'pending_validation' then raise exception 'Somente aquisições em validação podem receber comprovantes'; end if;
  if v_reference is null and v_path is null then raise exception 'Informe a referência da transação ou envie o comprovante'; end if;
  if v_path is not null and split_part(v_path, '/', 1) <> auth.uid()::text then raise exception 'Caminho de comprovante inválido'; end if;
  update public.mwc_acquisitions set payer_transaction_reference = v_reference, payment_proof_path = v_path where id = p_acquisition_id;
  insert into public.mwc_acquisition_events(acquisition_id, actor_id, event_type, old_status, new_status, note)
  values (p_acquisition_id, auth.uid(), 'payment_proof_submitted', v_row.status, v_row.status, concat_ws(' · ', case when v_reference is not null then 'Referência: ' || v_reference end, case when v_path is not null then 'Comprovante enviado' end));
end;
$$;
revoke all on function public.submit_mwc_payment_proof(uuid,text,text) from public, anon;
grant execute on function public.submit_mwc_payment_proof(uuid,text,text) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('mwc-payment-proofs', 'mwc-payment-proofs', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 10485760, allowed_mime_types = array['image/jpeg','image/png','image/webp','application/pdf'];

drop policy if exists "mwc_proof_upload_owner" on storage.objects;
create policy "mwc_proof_upload_owner" on storage.objects for insert to authenticated
with check (bucket_id = 'mwc-payment-proofs' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "mwc_proof_read_owner_admin" on storage.objects;
create policy "mwc_proof_read_owner_admin" on storage.objects for select to authenticated
using (bucket_id = 'mwc-payment-proofs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_mwc_sale_admin()));
drop policy if exists "mwc_proof_update_owner" on storage.objects;
create policy "mwc_proof_update_owner" on storage.objects for update to authenticated
using (bucket_id = 'mwc-payment-proofs' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'mwc-payment-proofs' and (storage.foldername(name))[1] = auth.uid()::text);
