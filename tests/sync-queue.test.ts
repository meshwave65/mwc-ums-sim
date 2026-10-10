import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IndexedDbSyncQueueRepository } from '../src/persistence/sync/indexeddb'
import { SyncQueueProcessor, classifySyncError } from '../src/persistence/sync/processor'
import type { RemoteChainRepository } from '../src/persistence/sync/types'

const queueName = () => `mw-blockchain-test-${crypto.randomUUID()}`

function remoteMock(): RemoteChainRepository {
  return {
    saveMetadata: vi.fn().mockResolvedValue(undefined),
    saveBlock: vi.fn().mockResolvedValue(undefined),
    saveTransaction: vi.fn().mockResolvedValue(undefined),
    saveSnapshot: vi.fn().mockResolvedValue(undefined),
  }
}

async function deleteDatabase(name: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => resolve()
  })
}

afterEach(() => vi.restoreAllMocks())

describe('IndexedDbSyncQueueRepository', () => {
  it('persiste itens e os recupera em uma nova instância após refresh', async () => {
    const dbName = queueName()
    const first = new IndexedDbSyncQueueRepository({ dbName })
    await first.enqueue({ id: 'metadata:test', operation: 'upsert_metadata', chainId: 'test', payload: { chainId: 'test' } })

    const second = new IndexedDbSyncQueueRepository({ dbName })
    const items = await second.listReady(10)

    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ id: 'metadata:test', operation: 'upsert_metadata', chainId: 'test', status: 'pending', attempts: 0 })
    await deleteDatabase(dbName)
  })

  it('reabre locks abandonados como pending', async () => {
    const dbName = queueName()
    const queue = new IndexedDbSyncQueueRepository({ dbName })
    await queue.enqueue({ id: 'block:test', operation: 'upsert_block', chainId: 'test', payload: {} })
    await queue.markProcessing('block:test')
    await queue.resetStaleLocks(0)

    expect(await queue.listReady(10)).toHaveLength(1)
    await deleteDatabase(dbName)
  })
})

describe('SyncQueueProcessor', () => {
  it('processa as operações e remove a fila após sucesso', async () => {
    const dbName = queueName()
    const queue = new IndexedDbSyncQueueRepository({ dbName })
    const remote = remoteMock()
    const processor = new SyncQueueProcessor(queue, remote, { baseRetryMs: 1 })
    await queue.enqueue({ id: 'metadata:test', operation: 'upsert_metadata', chainId: 'test', payload: { chainId: 'test' } })

    await processor.flush()

    expect(remote.saveMetadata).toHaveBeenCalledWith({ chainId: 'test' })
    expect(await queue.countPending()).toBe(0)
    expect(await queue.countFailed()).toBe(0)
    await deleteDatabase(dbName)
  })

  it('mantém falha de rede como pending com backoff', async () => {
    const dbName = queueName()
    const queue = new IndexedDbSyncQueueRepository({ dbName })
    const remote = remoteMock()
    vi.mocked(remote.saveBlock).mockRejectedValue(new Error('network offline'))
    const processor = new SyncQueueProcessor(queue, remote, { baseRetryMs: 1 })
    await queue.enqueue({ id: 'block:test', operation: 'upsert_block', chainId: 'test', payload: {} })

    await processor.flush()

    expect(await queue.countPending()).toBe(1)
    expect(await queue.countFailed()).toBe(0)
    await deleteDatabase(dbName)
  })

  it('marca RLS como falha permanente sem retry', async () => {
    const dbName = queueName()
    const queue = new IndexedDbSyncQueueRepository({ dbName })
    const remote = remoteMock()
    vi.mocked(remote.saveSnapshot).mockRejectedValue({ code: '42501', message: 'RLS denied' })
    const processor = new SyncQueueProcessor(queue, remote)
    await queue.enqueue({ id: 'snapshot:test', operation: 'upsert_snapshot', chainId: 'test', payload: {} })

    await processor.flush()

    expect(await queue.countPending()).toBe(0)
    expect(await queue.countFailed()).toBe(1)
    expect(classifySyncError({ code: '42501' })).toBe('rls')
    await deleteDatabase(dbName)
  })

  it('impede dois flushes concorrentes', async () => {
    const dbName = queueName()
    const queue = new IndexedDbSyncQueueRepository({ dbName })
    const remote = remoteMock()
    await queue.enqueue({ id: 'transaction:test', operation: 'upsert_transaction', chainId: 'test', payload: {} })
    const processor = new SyncQueueProcessor(queue, remote)

    await Promise.all([processor.flush(), processor.flush()])

    expect(remote.saveTransaction).toHaveBeenCalledTimes(1)
    await deleteDatabase(dbName)
  })
})
