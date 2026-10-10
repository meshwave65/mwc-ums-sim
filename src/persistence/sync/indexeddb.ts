import type { SyncQueueItem, SyncQueueRepository } from './types'

const DB_NAME = 'mw-blockchain'
const DB_VERSION = 1
const STORE_NAME = 'sync_queue'

interface IndexedDbSyncQueueOptions {
  dbName?: string
}

export class IndexedDbSyncQueueRepository implements SyncQueueRepository {
  private readonly dbName: string
  private dbPromise?: Promise<IDBDatabase>

  constructor(options: IndexedDbSyncQueueOptions = {}) {
    this.dbName = options.dbName ?? DB_NAME
  }

  async enqueue(item: Omit<SyncQueueItem, 'status' | 'attempts' | 'createdAt' | 'nextAttemptAt'> & Partial<Pick<SyncQueueItem, 'createdAt'>>): Promise<void> {
    const now = item.createdAt ?? new Date().toISOString()
    const value: SyncQueueItem = {
      ...item,
      status: 'pending',
      attempts: 0,
      createdAt: now,
      nextAttemptAt: now,
    }

    const db = await this.open()
    await this.request(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value))
  }

  async listReady(limit: number): Promise<SyncQueueItem[]> {
    const now = new Date().toISOString()
    const db = await this.open()
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).getAll()
    const items = await this.request(request)

    return (items as SyncQueueItem[])
      .filter((item) => item.status === 'pending' && item.nextAttemptAt <= now)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .slice(0, limit)
  }

  async markProcessing(id: string): Promise<void> {
    const item = await this.get(id)
    if (!item) return
    item.status = 'processing'
    item.lockedAt = new Date().toISOString()
    await this.put(item)
  }

  async markSucceeded(id: string): Promise<void> {
    const db = await this.open()
    await this.request(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id))
  }

  async markRetry(id: string, error: unknown, nextAttemptAt: string): Promise<void> {
    const item = await this.get(id)
    if (!item) return
    item.status = 'pending'
    item.attempts += 1
    item.nextAttemptAt = nextAttemptAt
    item.lastError = serializeError(error)
    delete item.lockedAt
    await this.put(item)
  }

  async markFailed(id: string, error: unknown): Promise<void> {
    const item = await this.get(id)
    if (!item) return
    item.status = 'failed'
    item.attempts += 1
    item.lastError = serializeError(error)
    delete item.lockedAt
    await this.put(item)
  }

  async resetStaleLocks(staleAfterMs: number): Promise<void> {
    const db = await this.open()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const items = await this.request(store.getAll()) as SyncQueueItem[]
    const threshold = Date.now() - staleAfterMs

    for (const item of items) {
      if (item.status === 'processing' && item.lockedAt && Date.parse(item.lockedAt) < threshold) {
        item.status = 'pending'
        delete item.lockedAt
        item.nextAttemptAt = new Date().toISOString()
        store.put(item)
      }
    }

    await transactionDone(transaction)
  }

  async countPending(): Promise<number> {
    return this.countByStatus('pending')
  }

  async countFailed(): Promise<number> {
    return this.countByStatus('failed')
  }

  async clear(): Promise<void> {
    const db = await this.open()
    await this.request(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear())
  }

  private async countByStatus(status: SyncQueueItem['status']): Promise<number> {
    const db = await this.open()
    const items = await this.request(db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()) as SyncQueueItem[]
    return items.filter((item) => item.status === status).length
  }

  private async get(id: string): Promise<SyncQueueItem | undefined> {
    const db = await this.open()
    return this.request(db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id)) as Promise<SyncQueueItem | undefined>
  }

  private async put(item: SyncQueueItem): Promise<void> {
    const db = await this.open()
    await this.request(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(item))
  }

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise
    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB is not available in this environment'))
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, DB_VERSION)
      request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB'))
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('by_status_next_attempt', ['status', 'nextAttemptAt'])
          store.createIndex('by_chain', 'chainId')
        }
      }
    })

    return this.dbPromise
  }

  private request<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
    })
  }
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'))
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'))
  })
}

function serializeError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  try { return JSON.stringify(error) } catch { return String(error) }
}
