import type { SimulationState } from '../simulation/types'

export type SpeedKey = 'slow' | 'normal' | 'fast' | 'turbo'

interface SimulationControlsProps {
  state: SimulationState
  speed: SpeedKey
  targetRounds: number
  onSpeedChange: (speed: SpeedKey) => void
  onTargetRoundsChange: (target: number) => void
  onStart: () => void
  onPause: () => void
  onContinue: () => void
  onStop: () => void
  onReset: () => void
}

const speedLabels: Record<SpeedKey, string> = {
  slow: 'Lenta',
  normal: 'Normal',
  fast: 'Rápida',
  turbo: 'Muito rápida',
}

export function SimulationControls({ state, speed, targetRounds, onSpeedChange, onTargetRoundsChange, onStart, onPause, onContinue, onStop, onReset }: SimulationControlsProps) {
  const isRunning = state.status === 'running'
  const isPaused = state.status === 'paused'
  return (
    <section className="controls-panel panel-surface">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Controle de observação</p>
          <h2>Assista ao ciclo acontecer</h2>
        </div>
        <span className="live-indicator"><span /> atualização ao vivo</span>
      </div>
      <div className="control-row">
        <div className="segmented-control" role="group" aria-label="Velocidade da simulação">
          {(Object.keys(speedLabels) as SpeedKey[]).map((key) => (
            <button key={key} className={speed === key ? 'is-selected' : ''} onClick={() => onSpeedChange(key)} type="button">
              {speedLabels[key]}
            </button>
          ))}
        </div>
        <label className="select-control">
          <span>Rodadas</span>
          <select value={targetRounds === Infinity ? 'infinite' : targetRounds} onChange={(event) => onTargetRoundsChange(event.target.value === 'infinite' ? Infinity : Number(event.target.value))}>
            <option value={100}>100</option>
            <option value={1000}>1.000</option>
            <option value={10000}>10.000</option>
            <option value={100000}>100.000</option>
            <option value="infinite">∞ infinito</option>
          </select>
        </label>
      </div>
      <div className="button-row">
        {!isRunning && !isPaused && <button className="button button-primary" type="button" onClick={onStart}><span>▶</span> Iniciar</button>}
        {isRunning && <button className="button button-secondary" type="button" onClick={onPause}><span>Ⅱ</span> Pausar</button>}
        {isPaused && <button className="button button-primary" type="button" onClick={onContinue}><span>▶</span> Continuar</button>}
        <button className="button button-quiet" type="button" onClick={onStop} disabled={!isRunning && !isPaused}><span>■</span> Parar</button>
        <button className="button button-quiet" type="button" onClick={onReset}><span>↺</span> Resetar</button>
      </div>
      <p className="helper-text">A velocidade controla o intervalo entre rodadas para manter a dinâmica legível. O modo infinito segue até você pressionar parar.</p>
    </section>
  )
}
