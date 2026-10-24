import type { SimulationConfig, SimulationState } from '../simulation/types'
import { formatBrl, formatNumber } from '../utils/format'

interface MarketPanelProps { state: SimulationState; config: SimulationConfig }

export function MarketPanel({ state, config }: MarketPanelProps) {
  const market = state.market
  return (
    <section className="panel-surface market-panel">
      <div className="section-heading"><div><p className="eyebrow eyebrow-amber">Mercado externo</p><h2>Reserva de capacidade MWN</h2></div><div className="market-token"><span>MWN</span><strong>MW</strong></div></div>
      <div className="market-hero"><div><span>Disponível agora</span><strong>{formatNumber(market.mwcAvailable)} <em>MWN</em></strong></div><div className="reference-price"><span>Referência</span><strong>{formatBrl(config.brlPerMwc)}</strong><small>por MWN</small></div></div>
      <div className="market-stats"><div><span>Gerados</span><strong>{formatNumber(market.mwcGenerated)}</strong><small>UMS → MWN</small></div><div><span>Reconvertidos</span><strong>{formatNumber(market.mwcReconverted)}</strong><small>MWN → UMS</small></div><div><span>BRL movimentado</span><strong>{formatBrl(market.brlVolume)}</strong><small>referência contábil</small></div></div>
      <div className="market-callout"><span className="callout-icon">↔</span><p>O MWN fica neste universo externo. Quando um usuário precisa de capacidade, uma unidade pode retornar como <strong>{formatNumber(config.umsPerMwc)} UMS</strong>.</p></div>
    </section>
  )
}
