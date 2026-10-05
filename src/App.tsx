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

const speedIntervals: Record<SpeedKey, number> = { slow: 1500, normal: 720, fast: 330, turbo: 170 }

function App() {
  const [config, setConfig] = useState<SimulationConfig>(() => createDefaultConfig())
  const [draftConfig, setDraftConfig] = useState<SimulationConfig>(() => createDefaultConfig())
  const [state, setState] = useState<SimulationState>(() => createInitialState(createDefaultConfig()))
  const [speed, setSpeed] = useState<SpeedKey>('normal')
  const [targetRounds, setTargetRounds] = useState<number>(100)
  const stateRef = useRef(state)

  useEffect(() => { stateRef.current = state }, [state])

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
    <div className="app-shell">
      <div className="background-grid" aria-hidden="true" />
      <HeaderStatus state={state} targetRounds={targetRounds} />
      <main className="dashboard">
        <section className="intro-grid">
          <div className="hero-copy">
            <div className="hero-label"><span className="pulse-mark" /> simulação em memória · sem mercado real</div>
            <h2>Veja a capacidade<br /><em>ganhar forma.</em></h2>
            <p>Um modelo mínimo para observar como serviços úteis, saldos UMS e o mercado externo MWC se relacionam rodada a rodada.</p>
            <div className="hero-note"><span>i</span><p><strong>Como ler:</strong> usuários com perfil positivo tendem a gerar excedente; usuários deficitários podem recorrer às reservas do mercado.</p></div>
          </div>
          <div className="hero-diagram" aria-label="Resumo visual do fluxo econômico">
            <div className="diagram-orbit orbit-one" /><div className="diagram-orbit orbit-two" /><div className="diagram-core"><span>MW</span><small>capacidade<br />em fluxo</small></div>
            <div className="diagram-node node-top"><b>UMS</b><small>interno</small></div><div className="diagram-node node-right"><b>MWC</b><small>externo</small></div><div className="diagram-node node-bottom"><b>BRL</b><small>referência</small></div>
            <div className="diagram-arrow arrow-one">↗</div><div className="diagram-arrow arrow-two">↘</div><div className="diagram-arrow arrow-three">↙</div>
          </div>
        </section>
        <SimulationControls state={state} speed={speed} targetRounds={targetRounds} onSpeedChange={setSpeed} onTargetRoundsChange={setTargetRounds} onStart={start} onPause={pause} onContinue={continueSimulation} onStop={stop} onReset={reset} />
        <CycleFlow state={state} config={config} />
        <KpiStrip state={state} brlPerMwc={config.brlPerMwc} />
        <div className="workspace-grid"><UserTable users={state.users} /><aside className="side-stack"><MarketPanel state={state} config={config} /><EventLog events={state.events} /></aside></div>
        <SimulationCharts state={state} />
        <FinalReport report={state.report} onExportJson={() => state.report && exportReportJson(state.report)} onExportCsv={() => state.report && exportReportCsv(state.report)} />
        <ConfigPanel config={draftConfig} onChange={setDraftConfig} onApply={applyConfig} />
        <MWBlockchainPanel state={state} />
        <footer className="footer-note"><span className="brand-mark mini"><span>MW</span><i /></span><p><strong>MWC / UMS Simulator</strong> · Protótipo educacional. Nenhum valor representa moeda, investimento ou operação financeira real.</p><span className="footer-version">v0.1 · em memória</span></footer>
      </main>
    </div>
  )
}

export default App
