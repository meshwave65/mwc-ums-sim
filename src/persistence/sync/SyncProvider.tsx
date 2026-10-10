import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import type { SyncProcessorState } from './types'
import { SyncQueueProcessor } from './processor'

interface SyncContextValue {
  state: SyncProcessorState
  flush: () => Promise<void>
}

const SyncContext = createContext<SyncContextValue | null>(null)

export function SyncProvider({ processor, children, intervalMs = 30_000 }: { processor: SyncQueueProcessor; children: ReactNode; intervalMs?: number }) {
  useEffect(() => {
    processor.start()
    const flush = () => { void processor.flush().catch(() => undefined) }
    const onOnline = () => flush()
    const onVisibility = () => { if (document.visibilityState === 'visible') flush() }

    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisibility)
    const interval = window.setInterval(flush, intervalMs)
    flush()

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisibility)
      processor.stop()
    }
  }, [processor, intervalMs])

  const state = useSyncExternalStore(
    (listener) => processor.subscribe(listener),
    () => processor.getState(),
    () => processor.getState(),
  )
  const value = useMemo(() => ({ state, flush: () => processor.flush() }), [processor, state])

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
}

export function useSyncQueue(): SyncContextValue {
  const context = useContext(SyncContext)
  if (!context) throw new Error('useSyncQueue must be used inside SyncProvider')
  return context
}
