import { useState } from 'react'
import type { SimulationConfig } from '../simulation/types'
import { formatNumber } from '../utils/format'

interface ConfigPanelProps {
  config: SimulationConfig
  onChange: (config: SimulationConfig) => void
  onApply: () => void
}

export function ConfigPanel({ config, onChange, onApply }: ConfigPanelProps) {
  const [open, setOpen] = useState(false)
  const updateRoot = (field: keyof SimulationConfig, value: number | string) => onChange({ ...config, [field]: value })
  const updateService = (index: number, field: 'cost' | 'demand', value: number) => onChange({ ...config, services: config.services.map((service, serviceIndex) => serviceIndex === index ? { ...service, [field]: value } : service) })
  return <section className={`config-panel panel-surface ${open ? 'is-open' : ''}`}>
    <button className="config-toggle" type="button" onClick={() => setOpen((current) => !current)}><span className="config-gear">⚙</span><span><strong>Parâmetros do protótipo</strong><small>Ajuste a economia e reinicie para aplicar</small></span><b>{open ? '−' : '+'}</b></button>
    {open && <div className="config-body">
      <div className="config-grid">
        <label><span>UMS inicial</span><input type="number" min="0" step="100" value={config.initialUms} onChange={(event) => updateRoot('initialUms', Number(event.target.value))} /></label>
        <label><span>UMS por MWC</span><input type="number" min="1" step="100" value={config.umsPerMwc} onChange={(event) => updateRoot('umsPerMwc', Number(event.target.value))} /></label>
        <label><span>BRL por MWC</span><input type="number" min="0" step="0.1" value={config.brlPerMwc} onChange={(event) => updateRoot('brlPerMwc', Number(event.target.value))} /></label>
        <label><span>Seed (opcional)</span><input type="text" placeholder="aleatório" value={config.seed} onChange={(event) => updateRoot('seed', event.target.value)} /></label>
      </div>
      <div className="config-subsection"><div className="config-subtitle"><span>Perfil por rodada</span><small>sorteio independente entre −30% e +30%</small></div><p className="config-note">Cada usuário recebe um novo percentual aleatório a cada rodada. Não há perfil persistente nem tendência acumulada.</p></div>
      <div className="config-subsection"><div className="config-subtitle"><span>Demanda e custo por operação</span><small>parâmetros em UMS</small></div><div className="service-edit-list">{config.services.map((service, index) => <div className="service-edit-row" key={service.id}><span>{service.shortName}</span><label><small>demanda</small><input type="number" min="0" value={service.demand} onChange={(event) => updateService(index, 'demand', Number(event.target.value))} /></label><label><small>custo</small><input type="number" min="0" value={service.cost} onChange={(event) => updateService(index, 'cost', Number(event.target.value))} /></label></div>)}</div></div>
      <div className="config-foot"><span>Validação PoUW: <strong>{formatNumber(config.validationRate * 100, 0)}%</strong> · faixa do perfil efetivo: <strong>−{config.variationRange}% a +{config.variationRange}%</strong></span><button className="button button-primary" type="button" onClick={onApply}>Aplicar e resetar</button></div>
    </div>}
  </section>
}
