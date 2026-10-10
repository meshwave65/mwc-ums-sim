export type SyncOperation =
  | 'upsert_metadata'
  | 'upsert_block'
  | 'upsert_transaction'
  | 'upsert_snapshot'

export type SyncStatus = 'pending' | 'processing' | 'failed'

export interface SyncQueueItem {
  id: string
  operation: SyncOperation
  chainId: string
  payload: unknown
  status: SyncStatus
  attempts: number
  createdAt: string
  nextAttemptAt: string
  lockedAt?: string
  lastError?: string
}

export interface SyncQueueRepository {
  enqueue(item: Omit<SyncQueueItem, 'status' | 'attempts' | 'createdAt' | 'nextAttemptAt'> & Partial<Pick<SyncQueueItem, 'createdAt'>>): Promise<void>
  listReady(limit: number): Promise<SyncQueueItem[]>
  markProcessing(id: string): Promise<void>
  markSucceeded(id: string): Promise<void>
  markRetry(id: string, error: unknown, nextAttemptAt: string): Promise<void>
  markFailed(id: string, error: unknown): Promise<void>
  resetStaleLocks(staleAfterMs: number): Promise<void>
  countPending(): Promise<number>
  countFailed(): Promise<number>
}

export interface RemoteChainRepository {
  saveMetadata(payload: unknown): Promise<void>
  saveBlock(payload: unknown): Promise<void>
  saveTransaction(payload: unknown): Promise<void>
  saveSnapshot(payload: unknown): Promise<void>
}

export type SyncErrorKind = 'retryable' | 'permanent' | 'authentication' | 'rls'

export interface SyncProcessorState {
  running: boolean
  pendingCount: number
  failedCount: number
  lastRunAt?: string
  lastSuccessAt?: string
  lastError?: string
}
