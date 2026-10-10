import { IndexedDbSyncQueueRepository } from './indexeddb'
import { SyncQueueProcessor } from './processor'
import { createSupabaseClient, SupabaseRemoteChainRepository } from './supabase'
import type { RemoteChainRepository } from './types'

const remote: RemoteChainRepository = (() => {
  const client = createSupabaseClient()
  if (client) return new SupabaseRemoteChainRepository(client)

  return {
    async saveMetadata() { throw new Error('Supabase is not configured') },
    async saveBlock() { throw new Error('Supabase is not configured') },
    async saveTransaction() { throw new Error('Supabase is not configured') },
    async saveSnapshot() { throw new Error('Supabase is not configured') },
  }
})()

export const syncQueue = new IndexedDbSyncQueueRepository()
export const syncQueueProcessor = new SyncQueueProcessor(syncQueue, remote)
