import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { SyncProvider } from './persistence/sync/SyncProvider'
import { syncQueueProcessor } from './persistence/sync/runtime'
import { SupabaseAuthProvider } from './persistence/auth/SupabaseAuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseAuthProvider>
      <SyncProvider processor={syncQueueProcessor}>
        <App />
      </SyncProvider>
    </SupabaseAuthProvider>
  </StrictMode>,
)
