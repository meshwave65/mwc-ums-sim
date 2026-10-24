import { useEffect, useRef, useState } from 'react'
import { ConfigPanel } from './components/ConfigPanel'
import { CycleFlow } from './components/CycleFlow'
import { EventLog } from './components/EventLog'
import { FinalReport } from './components/FinalReport'
import { HeaderStatus } from './components/HeaderStatus'
import { KpiStrip } from './components/KpiStrip'
import { MarketPanel } from './components/MarketPanel'
import { SimulationCharts } from './components/SimulationCharts'
import { SimulationControls, type SpeedKey } from './components/SimulationControls'
import { UserTable } from './components/UserTable'
import { MWBlockchainPanel } from './components/MWBlockchainPanel'
import { createDefaultConfig, createInitialState } from './simulation/defaults'
import { runRound } from './simulation/engine'
import { createFinalReport } from './simulation/report'
import type { SimulationConfig, SimulationState } from './simulation/types'
import { exportReportCsv, exportReportJson } from './utils/export'
import { enqueueBlockchainState } from './persistence/sync/chainPersistence'
import { useSupabaseAuth } from './persistence/auth/SupabaseAuthProvider'

const speedIntervals: Record<SpeedKey, number> = { slow: 1500, normal: 720, fast: 330, turbo: 170 }

const navigation = [
  { href: '#overview', icon: '◫', label: 'Dashboard' },
  { href: '#users', icon: '♙', label: 'Usuários' },
  { href: '#market', icon: '◇', label: 'Mercado' },
  { href: '#events', icon: '⌁', label: 'Eventos' },
  { href: '#reports', icon: '▥', label: 'Relatórios' },
  { href: '#settings', icon: '⚙', label: 'Configurações' },
]

function App() {
  const { user, loading: authLoading } = useSupabaseAuth()
  const [config, setConfig] = useState<SimulationConfig>(() => createDefaultConfig())
  const [draftConfig, setDraftConfig] = useState<SimulationConfig>(() => createDefaultConfig())
  const [state, setState] = useState<SimulationState>(() => createInitialState(createDefaultConfig()))
  const [speed, setSpeed] = useState<SpeedKey>('normal')
  const [targetRounds, setTargetRounds] = useState<number>(100)
  const stateRef = useRef(state)

  useEffect(() => { stateRef.current = state }, [state])
  useEffect(() => {
    if (authLoading || !user) return
    void enqueueBlockchainState(state).catch(() => undefined)
  }, [authLoading, state, user])

  useEffect(() => {
    if (state.status !== 'running') return undefined
    const timer = window.setInterval(() => {
      const current = stateRef.current
      if (targetRounds !== Infinity && current.round >= targetRounds) {
        const completed = { ...current, status: 'completed' as const, report: createFinalReport(current, config) }
        stateRef.current = completed
        setState(completed)
        return
      }
      const next = runRound(current, config)
      const reachedTarget = targetRounds !== Infinity && next.round >= targetRounds
      const resolved = reachedTarget ? { ...next, status: 'completed' as const, report: createFinalReport(next, config) } : { ...next, status: 'running' as const }
      stateRef.current = resolved
      setState(resolved)
    }, speedIntervals[speed])
    return () => window.clearInterval(timer)
  }, [config, speed, state.status, targetRounds])

  const start = () => setState((current) => ({ ...current, status: 'running', report: null }))
  const pause = () => setState((current) => ({ ...current, status: 'paused' }))
  const continueSimulation = () => setState((current) => ({ ...current, status: 'running', report: null }))
  const stop = () => setState((current) => ({ ...current, status: 'stopped', report: createFinalReport(current, config) }))
  const reset = () => setState(createInitialState(config))
  const applyConfig = () => { setConfig(draftConfig); setState(createInitialState(draftConfig)) }

  return (
    <div className="app-shell admin-app-shell">
      <div className="background-grid" aria-hidden="true" />
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#overview" aria-label="MeshWave Dashboard">
          <span className="brand-mark"><span>MW</span><i /></span>
          <span><strong>MeshWave</strong><small>MWN / UMS SIMULATOR</small></span>
        </a>
        <nav className="admin-nav" aria-label="Navegação administrativa">
          {navigation.map((item, index) => <a className={index === 0 ? 'is-current' : ''} href={item.href} key={item.href}><span className="nav-icon">{item.icon}</span>{item.label}</a>)}
        </nav>
        <div className="sidebar-status">
          <span className={state.status === 'running' ? 'sidebar-live-dot is-live' : 'sidebar-live-dot'} />
          <strong>{state.status === 'running' ? 'Simulação ativa' : state.status === 'paused' ? 'Simulação pausada' : 'Simulação pronta'}</strong>
          <dl><div><dt>Rodada atual</dt><dd>{state.round}</dd></div><div><dt>Meta</dt><dd>{targetRounds === Infinity ? '∞' : targetRounds.toLocaleString('pt-BR')}</dd></div><div><dt>Modo</dt><dd>Automático</dd></div></dl>
        </div>
        <div className="sidebar-foot"><span className="network-orbit">⌘</span><strong>MeshWave</strong><p>Conectando capacidade ao que importa.</p></div>
      </aside>
      <div className="admin-main">
        <HeaderStatus state={state} targetRounds={targetRounds} />
        <main className="dashboard admin-dashboard">
          <section id="overview" className="admin-overview">
            <div className="admin-page-title"><div><p className="eyebrow">CENTRO DE OPERAÇÕES · MESHWAVE</p><h2>Painel Administrativo</h2><p>Visão geral da economia simulada e da atividade da rede.</p></div><span className="system-online"><i /> Sistema operacional</span></div>
            <KpiStrip state={state} brlPerMwc={config.brlPerMwc} />
          </section>
          <section className="admin-control-row" aria-label="Controles da simulação">
            <SimulationControls state={state} speed={speed} targetRounds={targetRounds} onSpeedChange={setSpeed} onTargetRoundsChange={setTargetRounds} onStart={start} onPause={pause} onContinue={continueSimulation} onStop={stop} onReset={reset} />
            <CycleFlow state={state} config={config} />
          </section>
          <div className="workspace-grid admin-workspace">
            <div id="users" className="admin-anchor"><UserTable users={state.users} /></div>
            <aside className="side-stack">
              <div id="market" className="admin-anchor"><MarketPanel state={state} config={config} /></div>
              <div id="events" className="admin-anchor"><EventLog events={state.events} /></div>
            </aside>
          </div>
          <section id="analytics" className="admin-anchor"><SimulationCharts state={state} /></section>
          <section id="reports" className="admin-anchor"><FinalReport report={state.report} onExportJson={() => state.report && exportReportJson(state.report)} onExportCsv={() => state.report && exportReportCsv(state.report)} /></section>
          <section id="settings" className="admin-anchor"><ConfigPanel config={draftConfig} onChange={setDraftConfig} onApply={applyConfig} /></section>
          <section className="admin-anchor"><MWBlockchainPanel state={state} /></section>
          <footer className="footer-note"><span className="brand-mark mini"><span>MW</span><i /></span><p><strong>MWN / UMS Simulator</strong> · Protótipo educacional. Nenhum valor representa moeda, investimento ou operação financeira real.</p><span className="footer-version">v0.1 · em memória</span></footer>
        </main>
      </div>
    </div>
  )
}

export default App
