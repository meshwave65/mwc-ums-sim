import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { RemoteChainRepository } from './types'

type SupabaseRuntimeClient = SupabaseClient<any>

export function createSupabaseClient(): SupabaseRuntimeClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined
  if (!url || !key) return null

  return createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
}

export class SupabaseRemoteChainRepository implements RemoteChainRepository {
  constructor(private readonly client: SupabaseRuntimeClient) {}

  async saveMetadata(payload: unknown): Promise<void> {
    await this.upsert('mw_chain_metadata', toMetadataRow(payload), 'chain_id')
  }

  async saveBlock(payload: unknown): Promise<void> {
    await this.upsert('mw_blocks', toBlockRow(payload), 'chain_id,block_number')
  }

  async saveTransaction(payload: unknown): Promise<void> {
    await this.upsert('mw_transactions', toTransactionRow(payload), 'chain_id,transaction_hash')
  }

  async saveSnapshot(payload: unknown): Promise<void> {
    await this.upsert('mw_state_snapshots', toSnapshotRow(payload), 'chain_id,block_number')
  }

  private async upsert(table: string, row: Record<string, unknown>, onConflict: string): Promise<void> {
    const { error } = await this.client.from(table).upsert(row, { onConflict })
    if (error) throw error
  }
}

function objectPayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Sync payload must be an object')
  return payload as Record<string, unknown>
}

function value(row: Record<string, unknown>, snake: string, camel: string): unknown {
  return row[snake] ?? row[camel]
}

function toMetadataRow(payload: unknown): Record<string, unknown> {
  const row = objectPayload(payload)
  return {
    chain_id: value(row, 'chain_id', 'chainId'),
    chain_name: value(row, 'chain_name', 'chainName') ?? null,
    network: row.network ?? null,
    schema_version: value(row, 'schema_version', 'schemaVersion') ?? 1,
    genesis_hash: value(row, 'genesis_hash', 'genesisHash') ?? null,
    latest_block_number: value(row, 'latest_block_number', 'latestBlockNumber') ?? row.lastBlockIndex ?? 0,
    latest_block_hash: value(row, 'latest_block_hash', 'latestBlockHash') ?? row.lastBlockHash ?? null,
    metadata: row.metadata ?? {},
  }
}

function toBlockRow(payload: unknown): Record<string, unknown> {
  const row = objectPayload(payload)
  return {
    id: row.id ?? undefined,
    chain_id: value(row, 'chain_id', 'chainId'),
    block_number: value(row, 'block_number', 'blockNumber') ?? row.index,
    block_hash: value(row, 'block_hash', 'blockHash') ?? row.hash,
    previous_hash: value(row, 'previous_hash', 'previousHash') ?? null,
    block_timestamp: value(row, 'block_timestamp', 'blockTimestamp') ?? row.timestamp,
    merkle_root: row.merkle_root ?? row.merkleRoot ?? null,
    nonce: row.nonce ?? null,
    difficulty: row.difficulty ?? null,
    payload: row.payload ?? row,
  }
}

function toTransactionRow(payload: unknown): Record<string, unknown> {
  const row = objectPayload(payload)
  return {
    id: row.id ?? undefined,
    chain_id: value(row, 'chain_id', 'chainId'),
    block_id: value(row, 'block_id', 'blockId') ?? null,
    transaction_hash: value(row, 'transaction_hash', 'transactionHash') ?? row.id,
    transaction_index: value(row, 'transaction_index', 'transactionIndex') ?? null,
    transaction_type: value(row, 'transaction_type', 'transactionType') ?? row.type ?? null,
    sender: row.sender ?? null,
    recipient: row.recipient ?? null,
    amount: row.amount ?? null,
    status: row.status ?? 'confirmed',
    payload: row.payload ?? row,
  }
}

function toSnapshotRow(payload: unknown): Record<string, unknown> {
  const row = objectPayload(payload)
  return {
    id: row.id ?? undefined,
    chain_id: value(row, 'chain_id', 'chainId'),
    block_number: value(row, 'block_number', 'blockNumber'),
    block_hash: value(row, 'block_hash', 'blockHash') ?? null,
    state: row.state ?? {},
    metadata: row.metadata ?? {},
  }
}
