import { describe, expect, it } from 'vitest'
import { createDefaultConfig, createInitialState } from '../src/simulation/defaults'
import { runRound } from '../src/simulation/engine'
import { economicProjection, regressionConfig, runRounds } from './helpers'
import expectedRound10 from './fixtures/expected-round-10.json'

describe('contrato inicial do simulador', () => {
  it('cria os usuários e valores econômicos iniciais esperados', () => {
    const config = createDefaultConfig()
    const state = createInitialState(config)

    expect(state.round).toBe(0)
    expect(state.users).toHaveLength(10)
    expect(state.users.map((user) => user.id)).toEqual([
      'USER-01', 'USER-02', 'USER-03', 'USER-04', 'USER-05',
      'USER-06', 'USER-07', 'USER-08', 'USER-09', 'USER-10',
    ])
    expect(state.users.every((user) => user.ums === 10_000 && user.brl === 0)).toBe(true)
    expect(state.market).toEqual({ mwcAvailable: 0, mwcGenerated: 0, mwcReconverted: 0, brlReference: 0, brlVolume: 0 })
    expect(state.totals).toEqual({ servicesRequested: 0, servicesExecuted: 0, servicesUnmet: 0, umsGenerated: 0, umsUsed: 0, umsRejected: 0, mwcGenerated: 0, mwcReconverted: 0, brlVolume: 0 })
    expect(state.machineAnchor).toMatch(/^[A-F0-9]{64}$/)
  })
})

describe('regressão determinística do motor', () => {
  it('produz a mesma projeção econômica com a mesma seed', () => {
    const first = economicProjection(runRounds(10, regressionConfig('same-seed')))
    const second = economicProjection(runRounds(10, regressionConfig('same-seed')))

    expect(first).toEqual(second)
  })

  it('produz a fixture econômica aprovada após 10 rodadas', () => {
    expect(economicProjection(runRounds(10))).toEqual(expectedRound10)
  })

  it('avança uma rodada sem perder usuários ou produzir saldo negativo', () => {
    const config = regressionConfig()
    const initial = createInitialState(config)
    initial.machineAnchor = 'A'.repeat(64)
    const next = runRound(initial, config)

    expect(next.round).toBe(1)
    expect(next.users).toHaveLength(initial.users.length)
    expect(next.users.every((user) => user.ums >= 0 && user.brl >= 0)).toBe(true)
    expect(next.events.some((event) => event.label === 'RODADA ENCERRADA')).toBe(true)
    expect(next.history).toHaveLength(2)
  })
})
