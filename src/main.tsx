import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { SyncProvider } from './persistence/sync/SyncProvider'
import { syncQueueProcessor } from './persistence/sync/runtime'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SyncProvider processor={syncQueueProcessor}>
      <App />
    </SyncProvider>
  </StrictMode>,
)
