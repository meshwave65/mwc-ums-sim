import type { SimulationState } from '../simulation/types'
import { formatBrl, formatNumber } from '../utils/format'

interface KpiStripProps {
  state: SimulationState
  brlPerMwc: number
}

export function KpiStrip({ state, brlPerMwc }: KpiStripProps) {
  const cards = [
    { label: 'Serviços executados', value: formatNumber(state.totals.servicesExecuted), detail: `${formatNumber(state.totals.servicesUnmet)} não atendidos`, tone: 'cyan', icon: '⌁' },
    { label: 'UMS reconhecida', value: formatNumber(state.totals.umsGenerated), detail: `${formatNumber(state.totals.umsUsed)} utilizadas`, tone: 'green', icon: '◈' },
    { label: 'MWC no mercado', value: formatNumber(state.market.mwcAvailable), detail: `${formatNumber(state.market.mwcGenerated)} gerados`, tone: 'amber', icon: '◆' },
    { label: 'Reconversões', value: formatNumber(state.market.mwcReconverted), detail: `${formatBrl(state.market.brlVolume)} movimentados`, tone: 'coral', icon: '↺' },
  ]
  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <article className={`kpi-card tone-${card.tone}`} key={card.label}>
          <div className="kpi-icon">{card.icon}</div>
          <div><span>{card.label}</span><strong>{card.value}</strong><small>{card.detail}</small></div>
        </article>
      ))}
      <article className="kpi-card tone-slate">
        <div className="kpi-icon">₿</div>
        <div><span>Preço de referência</span><strong>{formatBrl(brlPerMwc)}</strong><small>por 1 MWC · protótipo</small></div>
      </article>
      <article className="kpi-card tone-slate">
        <div className="kpi-icon">Σ</div>
        <div><span>UMS no ecossistema</span><strong>{formatNumber(state.users.reduce((sum, user) => sum + user.ums, 0))}</strong><small>{state.users.length} usuários observados</small></div>
      </article>
    </div>
  )
}
