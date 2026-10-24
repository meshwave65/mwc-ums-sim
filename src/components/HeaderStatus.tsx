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
    <header className="topbar admin-topbar">
      <div className="topbar-heading">
        <span className="topbar-emblem">⌘</span>
        <div><h1>Painel Administrativo</h1><p>Visão geral da rede MeshWave</p></div>
      </div>
      <div className="topbar-metrics">
        <a className="storage-link" href="/storage-node.html" aria-label="Abrir MWC Storage Node">STORAGE NODE <span aria-hidden="true">↗</span></a>
        <div className="telemetry-item"><span>RODADA</span><strong>{formatNumber(state.round)}</strong><small>{targetRounds === Infinity ? 'modo infinito' : `de ${formatNumber(targetRounds)}`}</small></div>
        <div className={`status-pill ${statusClass}`}><span className="status-dot" />{status}</div>
      </div>
    </header>
  )
}
