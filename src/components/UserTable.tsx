import type { MarketState, SimulationConfig, UserState } from '../simulation/types'
import { statusLabel, statusTone } from '../simulation/selectors'
import { formatBrl, formatNumber, formatPercent } from '../utils/format'

interface UserTableProps {
  users: UserState[]
  config: SimulationConfig
  market: MarketState
  onReconvert: (userId: string) => void
  onToggleAutoReconversion: (userId: string, enabled: boolean) => void
}

export function UserTable({ users, config, market, onReconvert, onToggleAutoReconversion }: UserTableProps) {
  const reserve = Math.max(0, config.conversionThreshold)
  return (
    <section className="panel-surface table-panel">
      <div className="section-heading">
        <div><p className="eyebrow">Ecossistema MeshWave</p><h2>Posição dos usuários</h2></div>
        <span className="table-note">UMS interna · BRL contábil</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Usuário</th><th>Perfil / rodada</th><th>UMS</th><th>BRL</th><th>Serviços</th><th>Gerado</th><th>Utilizado</th><th>Status</th><th>Decisão</th></tr></thead>
          <tbody>
            {users.map((user) => {
              const tone = statusTone(user.status)
              const canReconvert = market.mwcAvailable >= 1 && config.umsPerMwc > 0
              return <tr key={user.id}>
                <td><div className="user-cell"><span className={`user-avatar tone-${tone}`}>{user.id.slice(-2)}</span><div><strong>{user.id}</strong><small>{user.lastActivity}</small></div></div></td>
                <td><span className={`profile-value ${user.roundProfile >= 0 ? 'is-positive' : 'is-negative'}`}>{formatPercent(user.roundProfile)}</span></td>
                <td><strong className="number-cell">{formatNumber(user.ums)}</strong></td>
                <td><span className={user.brl < 0 ? 'money-negative' : user.brl > 0 ? 'money-positive' : 'money-neutral'}>{formatBrl(user.brl, true)}</span></td>
                <td><span className="muted-number">{formatNumber(user.servicesExecuted)}</span>{user.servicesUnmet > 0 && <small className="unmet-inline"> +{formatNumber(user.servicesUnmet)} não</small>}</td>
                <td><span className="metric-positive">+{formatNumber(user.lastGenerated)}</span><small className="metric-total">{formatNumber(user.generated)} total</small></td>
                <td><span className="metric-negative">−{formatNumber(user.lastUsed)}</span><small className="metric-total">{formatNumber(user.used)} total</small></td>
                <td><span className={`status-badge tone-${tone}`}>{statusLabel(user)}</span></td>
                <td><div className="conversion-actions"><span className="automatic-conversion-note">UMS → MWC automático acima de {formatNumber(reserve)} UMS</span><button className="reconvert-button" type="button" disabled={!canReconvert} onClick={() => onReconvert(user.id)} title={canReconvert ? `Adquirir 1 MWC no mercado e reconverter em ${formatNumber(config.umsPerMwc)} UMS` : "Não há MWC disponível no mercado"}>MWC → UMS</button><label className="auto-reconversion-toggle"><input type="checkbox" checked={user.autoReconversion} onChange={(event) => onToggleAutoReconversion(user.id, event.target.checked)} /> Auto-reconversão</label></div></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <div className="table-footer"><span><i className="legend-dot positive" /> Superávit / geração</span><span><i className="legend-dot negative" /> Déficit / consumo</span><span><i className="legend-dot market" /> Mercado externo</span><span>UMS → MWC automática acima do limiar · MWC → UMS manual ou automática</span></div>
    </section>
  )
}
