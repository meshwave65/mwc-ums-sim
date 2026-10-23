import type { SimulationState } from '../simulation/types'
import { roundStatusLabel } from '../simulation/selectors'
import { formatNumber } from '../utils/format'

interface HeaderStatusProps {
  state: SimulationState
  targetRounds: number
}

export function HeaderStatus({ state, targetRounds }: HeaderStatusProps) {
  const status = roundStatusLabel(state.status)
  const statusClass = state.status === 'running' ? 'is-running' : state.status === 'paused' ? 'is-paused' : ''
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true"><span>MW</span><i /></div>
        <div>
          <p className="eyebrow">MWC / UMS · PROTÓTIPO 0.1</p>
          <h1>MeshWave <strong>Economia em observação</strong></h1>
        </div>
      </div>
      <div className="topbar-metrics">
        <a
          href="/storage-node.html"
          aria-label="Abrir MWC Storage Node"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', border: '1px solid rgba(84, 226, 208, .48)', borderRadius: 10, background: 'rgba(84, 226, 208, .08)', color: '#54e2d0', fontSize: 11, fontWeight: 750, letterSpacing: '.06em', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          STORAGE-NODE <span aria-hidden="true">↗</span>
        </a>
        <div className="telemetry-item">
          <span>RODADA</span>
          <strong>{formatNumber(state.round)}</strong>
          <small>{targetRounds === Infinity ? 'modo infinito' : `de ${formatNumber(targetRounds)}`}</small>
        </div>
        <div className={`status-pill ${statusClass}`}><span className="status-dot" />{status}</div>
      </div>
    </header>
  )
}
