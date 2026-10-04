import type { RoundSnapshot, SimulationState } from '../simulation/types'
import { formatNumber } from '../utils/format'

const userColors = ['#54e2d0', '#89b4ff', '#f1b85b', '#ef8d7d', '#b19cff', '#62d69b', '#ff8ec9', '#93d2e9', '#d4df73', '#f5a36d']

function linePath(values: number[], max: number, width: number, height: number, left: number, top: number): string {
  if (values.length === 0) return ''
  const xStep = values.length === 1 ? 0 : (width - left - 16) / (values.length - 1)
  return values.map((value, index) => {
    const x = left + index * xStep
    const y = top + height - (value / Math.max(1, max)) * height
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
}

function ChartFrame({ children, max, label, lastLabel }: { children: React.ReactNode; max: number; label: string; lastLabel: string }) {
  return <div className="chart-frame">
    <svg viewBox="0 0 620 240" role="img" aria-label={label}>
      <g className="chart-grid"><line x1="48" y1="22" x2="604" y2="22" /><line x1="48" y1="108" x2="604" y2="108" /><line x1="48" y1="194" x2="604" y2="194" /></g>
      <text x="8" y="28">{formatNumber(max)}</text><text x="8" y="114">{formatNumber(max / 2)}</text><text x="8" y="200">0</text>
      {children}
      <text className="chart-end-label" x="604" y="222" textAnchor="end">{lastLabel}</text>
    </svg>
  </div>
}

function EmptyChart({ message }: { message: string }) {
  return <div className="chart-empty"><span>◌</span><p>{message}</p></div>
}

interface SimulationChartsProps { state: SimulationState }

export function SimulationCharts({ state }: SimulationChartsProps) {
  const history = state.history
  const userMax = Math.max(11000, ...history.flatMap((snapshot) => snapshot.users.map((user) => user.ums)))
  const marketMax = Math.max(1, ...history.map((snapshot) => Math.max(snapshot.market.mwcGenerated, snapshot.market.mwcAvailable, snapshot.market.mwcReconverted)))
  const hasRounds = history.length > 1
  const lastLabel = `rodada ${formatNumber(state.round)}`
  return <section className="charts-section">
    <div className="section-heading"><div><p className="eyebrow">Visualizações dinâmicas</p><h2>O comportamento emerge na linha do tempo</h2></div><span className="table-note">{hasRounds ? `${formatNumber(history.length - 1)} pontos de observação` : 'aguardando dados'}</span></div>
    <div className="chart-grid-layout">
      <article className="panel-surface chart-card">
        <div className="chart-title"><div><span className="chart-kicker">ECOSSISTEMA</span><h3>Evolução dos saldos UMS</h3></div><span className="chart-unit">UMS</span></div>
        {hasRounds ? <ChartFrame max={userMax} label="Evolução dos saldos UMS por usuário" lastLabel={lastLabel}>
          {state.users.map((user, userIndex) => <path key={user.id} className="chart-line" stroke={userColors[userIndex % userColors.length]} d={linePath(history.map((snapshot) => snapshot.users.find((item) => item.id === user.id)?.ums ?? 0), userMax, 620, 172, 48, 22)} />)}
        </ChartFrame> : <EmptyChart message="Inicie uma rodada para ver os dez usuários se separarem por perfil." />}
        <div className="chart-legend">{state.users.slice(0, 5).map((user, index) => <span key={user.id}><i style={{ background: userColors[index] }} />{user.id}</span>)}<span className="legend-more">+ 5 usuários</span></div>
      </article>
      <article className="panel-surface chart-card">
        <div className="chart-title"><div><span className="chart-kicker amber">MERCADO EXTERNO</span><h3>MWC em circulação</h3></div><span className="chart-unit">unidades</span></div>
        {hasRounds ? <ChartFrame max={marketMax} label="Evolução do MWC gerado, reconvertido e disponível" lastLabel={lastLabel}>
          <path className="chart-line" stroke="#f1b85b" d={linePath(history.map((snapshot) => snapshot.market.mwcGenerated), marketMax, 620, 172, 48, 22)} />
          <path className="chart-line" stroke="#ef8d7d" d={linePath(history.map((snapshot) => snapshot.market.mwcReconverted), marketMax, 620, 172, 48, 22)} />
          <path className="chart-line" stroke="#54e2d0" d={linePath(history.map((snapshot) => snapshot.market.mwcAvailable), marketMax, 620, 172, 48, 22)} />
        </ChartFrame> : <EmptyChart message="O mercado inicia vazio e começa a receber MWC quando surgem blocos completos." />}
        <div className="chart-legend"><span><i className="legend-line amber" />Gerado</span><span><i className="legend-line coral" />Reconvertido</span><span><i className="legend-line cyan" />Disponível</span></div>
      </article>
    </div>
  </section>
}

export function reportHistory(history: RoundSnapshot[]): number {
  return history.length
}
