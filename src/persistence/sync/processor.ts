import type {
  RemoteChainRepository,
  SyncErrorKind,
  SyncProcessorState,
  SyncQueueItem,
  SyncQueueRepository,
} from './types'

export interface SyncQueueProcessorOptions {
  batchSize?: number
  staleLockMs?: number
  maxAttempts?: number
  baseRetryMs?: number
  maxRetryMs?: number
}

const defaultOptions: Required<SyncQueueProcessorOptions> = {
  batchSize: 25,
  staleLockMs: 5 * 60_000,
  maxAttempts: 10,
  baseRetryMs: 1_000,
  maxRetryMs: 5 * 60_000,
}

export class SyncQueueProcessor {
  private readonly options: Required<SyncQueueProcessorOptions>
  private running = false
  private stopped = false
  private readonly listeners = new Set<() => void>()
  private state: SyncProcessorState = { running: false, pendingCount: 0, failedCount: 0 }

  constructor(
    private readonly queue: SyncQueueRepository,
    private readonly remote: RemoteChainRepository,
    options: SyncQueueProcessorOptions = {},
  ) {
    this.options = { ...defaultOptions, ...options }
  }

  start(): void { this.stopped = false }
  stop(): void { this.stopped = true }
  getState(): SyncProcessorState { return this.state }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  async flush(): Promise<void> {
    if (this.stopped || this.running) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      await this.refreshCounts()
      return
    }

    const run = () => this.flushInternal()
    if (typeof navigator !== 'undefined' && 'locks' in navigator) {
      await navigator.locks.request('mw-blockchain-sync-queue', { ifAvailable: true }, async (lock) => {
        if (!lock) return
        await run()
      })
      return
    }
    await run()
  }

  private async flushInternal(): Promise<void> {
    if (this.running || this.stopped) return
    this.running = true
    this.updateState({ running: true, lastRunAt: new Date().toISOString(), lastError: undefined })

    try {
      await this.queue.resetStaleLocks(this.options.staleLockMs)
      while (!this.stopped) {
        const items = await this.queue.listReady(this.options.batchSize)
        if (!items.length) break
        for (const item of items) {
          if (this.stopped) break
          await this.processItem(item)
        }
      }
      this.updateState({ lastSuccessAt: new Date().toISOString() })
    } catch (error) {
      this.updateState({ lastError: serializeError(error) })
      throw error
    } finally {
      this.running = false
      await this.refreshCounts()
      this.updateState({ running: false })
    }
  }

  private async processItem(item: SyncQueueItem): Promise<void> {
    await this.queue.markProcessing(item.id)
    try {
      await this.dispatch(item)
      await this.queue.markSucceeded(item.id)
    } catch (error) {
      await this.handleFailure(item, error)
    }
  }

  private async dispatch(item: SyncQueueItem): Promise<void> {
    switch (item.operation) {
      case 'upsert_metadata': return this.remote.saveMetadata(item.payload)
      case 'upsert_block': return this.remote.saveBlock(item.payload)
      case 'upsert_transaction': return this.remote.saveTransaction(item.payload)
      case 'upsert_snapshot': return this.remote.saveSnapshot(item.payload)
      default: throw new Error(`Unsupported sync operation: ${String(item.operation)}`)
    }
  }

  private async handleFailure(item: SyncQueueItem, error: unknown): Promise<void> {
    const kind = classifySyncError(error)
    const attempts = item.attempts + 1
    if (kind !== 'retryable' || attempts >= this.options.maxAttempts) {
      await this.queue.markFailed(item.id, { kind, attempts, error: serializeError(error) })
      return
    }

    const delay = Math.min(this.options.maxRetryMs, this.options.baseRetryMs * 2 ** Math.min(attempts - 1, 8) + Math.floor(Math.random() * 500))
    await this.queue.markRetry(item.id, error, new Date(Date.now() + delay).toISOString())
  }

  private async refreshCounts(): Promise<void> {
    const [pendingCount, failedCount] = await Promise.all([this.queue.countPending(), this.queue.countFailed()])
    this.updateState({ pendingCount, failedCount })
  }

  private updateState(patch: Partial<SyncProcessorState>): void {
    this.state = { ...this.state, ...patch }
    for (const listener of this.listeners) listener()
  }
}

export function classifySyncError(error: unknown): SyncErrorKind {
  const code = String((error as { code?: unknown } | null)?.code ?? '')
  if (!code) return 'retryable'
  if (['408', '429', '500', '502', '503', '504', '40001', '40P01'].includes(code)) return 'retryable'
  if (['401', '403', 'PGRST301'].includes(code)) return 'authentication'
  if (code === '42501') return 'rls'
  return 'permanent'
}

function serializeError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  try { return JSON.stringify(error) } catch { return String(error) }
}
