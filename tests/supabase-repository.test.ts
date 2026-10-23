import { describe, expect, it, vi } from 'vitest'
import { SupabaseRemoteChainRepository } from '../src/persistence/sync/supabase'

function makeClient() {
  const calls: Array<{ table: string; row: Record<string, unknown>; options: Record<string, unknown> }> = []
  const upload = vi.fn().mockResolvedValue({ data: { path: 'snapshot.json' }, error: null })
  const client = {
    from: (table: string) => ({
      upsert: vi.fn(async (row: Record<string, unknown>, options: Record<string, unknown>) => {
        calls.push({ table, row, options })
        return { data: null, error: null }
      }),
    }),
    storage: { from: vi.fn(() => ({ upload })) },
  }
  return { client, calls, upload }
}

describe('SupabaseRemoteChainRepository — contrato de persistência', () => {
  it('mapeia metadados e usa upsert idempotente por chain_id', async () => {
    const { client, calls } = makeClient()
    const repository = new SupabaseRemoteChainRepository(client as never)

    await repository.saveMetadata({ chainId: 'chain-test', chainName: 'Test', latestBlockNumber: 4, latestBlockHash: 'HASH4' })

    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({
      table: 'mw_chain_metadata',
      row: { chain_id: 'chain-test', chain_name: 'Test', latest_block_number: 4, latest_block_hash: 'HASH4' },
      options: { onConflict: 'chain_id' },
    })
  })

  it('mapeia blocos e transações para as chaves de conflito declaradas', async () => {
    const { client, calls } = makeClient()
    const repository = new SupabaseRemoteChainRepository(client as never)

    await repository.saveBlock({ chainId: 'chain-test', index: 7, hash: 'BLOCK7', previousHash: 'BLOCK6', timestamp: '2026-01-01T00:00:00Z' })
    await repository.saveTransaction({ chainId: 'chain-test', id: 'TX7', type: 'SERVICE', amount: 10 })

    expect(calls).toHaveLength(2)
    expect(calls[0]).toMatchObject({
      table: 'mw_blocks',
      row: { chain_id: 'chain-test', block_number: 7, block_hash: 'BLOCK7', previous_hash: 'BLOCK6' },
      options: { onConflict: 'chain_id,block_number' },
    })
    expect(calls[1]).toMatchObject({
      table: 'mw_transactions',
      row: { chain_id: 'chain-test', transaction_hash: 'TX7', transaction_type: 'SERVICE', amount: 10 },
      options: { onConflict: 'chain_id,transaction_hash' },
    })
  })

  it('persiste snapshot em tabela e storage e propaga falha do storage', async () => {
    const first = makeClient()
    const repository = new SupabaseRemoteChainRepository(first.client as never)
    await repository.saveSnapshot({ chainId: 'chain-test', blockNumber: 8, blockHash: 'BLOCK8', state: { ums: 120 } })

    expect(first.calls[0]).toMatchObject({
      table: 'mw_state_snapshots',
      row: { chain_id: 'chain-test', block_number: 8, block_hash: 'BLOCK8', state: { ums: 120 } },
      options: { onConflict: 'chain_id,block_number' },
    })
    expect(first.client.storage.from).toHaveBeenCalledWith('sofia_storage_user')
    expect(first.upload).toHaveBeenCalledWith(
      'mwc-ums/chain-test/snapshots/8.json',
      expect.any(Blob),
      expect.objectContaining({ upsert: true, contentType: 'application/json' }),
    )

    const second = makeClient()
    second.upload.mockResolvedValue({ data: null, error: { message: 'storage denied', code: '42501' } } as never)
    const failingRepository = new SupabaseRemoteChainRepository(second.client as never)
    await expect(failingRepository.saveSnapshot({ chainId: 'chain-test', blockNumber: 9, state: {} }))
      .rejects.toMatchObject({ message: 'storage denied', code: '42501' })
  })

  it('rejeita payloads que não são objetos', async () => {
    const { client, calls } = makeClient()
    const repository = new SupabaseRemoteChainRepository(client as never)

    await expect(repository.saveBlock(null)).rejects.toThrow('Sync payload must be an object')
    expect(calls).toHaveLength(0)
  })
})
