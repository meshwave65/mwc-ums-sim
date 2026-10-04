import type { SimulationConfig, SimulationState } from '../simulation/types'
import { formatBrl, formatNumber } from '../utils/format'

interface CycleFlowProps { state: SimulationState; config: SimulationConfig }

const stages = [
  { key: 'service', label: 'Serviços', detail: 'demanda' },
  { key: 'proof', label: 'Execução / PoUW', detail: 'validação' },
  { key: 'ums', label: 'UMS', detail: 'capacidade interna' },
  { key: 'market', label: 'Mercado MWC', detail: 'representação externa' },
  { key: 'return', label: 'Retorno', detail: 'capacidade interna' },
]

export function CycleFlow({ state, config }: CycleFlowProps) {
  const activeIndex = state.status === 'idle' ? 0 : state.round % stages.length
  return (
    <section className="cycle-panel panel-surface">
      <div className="section-heading compact"><div><p className="eyebrow">Ciclo econômico</p><h2>Capacidade circulando entre os universos</h2></div><span className="cycle-rule">{formatNumber(config.umsPerMwc)} UMS <b>→</b> 1 MWC <b>→</b> {formatBrl(config.brlPerMwc)}</span></div>
      <div className="cycle-track">{stages.map((stage, index) => <div className={`cycle-stage ${index === activeIndex && state.status === 'running' ? 'is-active' : ''} ${index < activeIndex ? 'is-complete' : ''}`} key={stage.key}><div className="cycle-node"><span>{String(index + 1).padStart(2, '0')}</span></div><div><strong>{stage.label}</strong><small>{stage.detail}</small></div>{index < stages.length - 1 && <div className="cycle-connector"><i /></div>}</div>)}</div>
      <p className="cycle-caption">MWC representa externamente capacidade originalmente expressa em UMS. Serviços continuam sempre cobrados em UMS.</p>
    </section>
  )
}
