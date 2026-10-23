import { describe, expect, it } from 'vitest'
import { buildBlockchain, validateBlockchain } from '../src/simulation/blockchain'
import { createInitialState, createDefaultConfig } from '../src/simulation/defaults'
import { runRound } from '../src/simulation/engine'
import type { SimulationConfig, SimulationState } from '../src/simulation/types'

function runScenario(config: SimulationConfig, rounds: number): SimulationState {
  let state = createInitialState(config)
  state.machineAnchor = 'B'.repeat(64)
  for (let round = 0; round < rounds; round += 1) state = runRound(state, config)
  return state
}

function expectAccountingInvariants(state: SimulationState, config: SimulationConfig): void {
  expect(state.users.every((user) =>
    Number.isFinite(user.ums) && user.ums >= 0 &&
    Number.isFinite(user.brl) &&
    Number.isFinite(user.generated) && user.generated >= 0 &&
    Number.isFinite(user.used) && user.used >= 0 &&
    Number.isFinite(user.validated) && user.validated >= 0 &&
    Number.isFinite(user.invalid) && user.invalid >= 0 &&
    Number.isFinite(user.mwcCreated) && user.mwcCreated >= 0 &&
    Number.isFinite(user.mwcUsed) && user.mwcUsed >= 0 &&
    Number.isFinite(user.unmetUms) && user.unmetUms >= 0,
  )).toBe(true)

  expect(state.totals.umsGenerated).toBe(state.users.reduce((sum, user) => sum + user.generated, 0))
  expect(state.totals.umsUsed).toBe(state.users.reduce((sum, user) => sum + user.used, 0))
  expect(state.totals.umsRejected).toBe(state.users.reduce((sum, user) => sum + user.invalid, 0))
  expect(state.totals.mwcGenerated).toBe(state.users.reduce((sum, user) => sum + user.mwcCreated, 0))
  expect(state.totals.mwcReconverted).toBe(state.users.reduce((sum, user) => sum + user.mwcUsed, 0))
  expect(state.market.mwcAvailable).toBe(state.market.mwcGenerated - state.market.mwcReconverted)
  expect(state.market.mwcGenerated).toBe(state.totals.mwcGenerated)
  expect(state.market.mwcReconverted).toBe(state.totals.mwcReconverted)
  expect(state.market.brlReference).toBe(state.market.mwcAvailable * config.brlPerMwc)
  expect(state.round).toBe(state.history.length - 1)
  expect(state.history).toHaveLength(state.round + 1)
}

describe('robustez do modelo econômico — invariantes entre cenários', () => {
  it.each(['seed-a', 'seed-b', 'seed-c', 'seed-d', 'seed-e'])(
    'preserva invariantes contábeis com %s ao longo de 40 rodadas',
    (seed) => {
      const config = createDefaultConfig()
      config.seed = seed
      const state = runScenario(config, 40)
      expectAccountingInvariants(state, config)
      expect(state.totals.servicesRequested).toBe(
        config.services.reduce((sum, service) => sum + Math.max(0, Math.floor(service.demand)), 0) * 40,
      )
    },
  )

  it('preserva invariantes em cenário de demanda zero', () => {
    const config = createDefaultConfig()
    config.seed = 'zero-demand'
    config.services = config.services.map((service) => ({ ...service, demand: 0 }))
    const state = runScenario(config, 8)

    expectAccountingInvariants(state, config)
    expect(state.totals.servicesRequested).toBe(0)
    expect(state.totals.servicesExecuted).toBe(0)
    expect(state.totals.servicesUnmet).toBe(0)
    expect(state.totals.umsUsed).toBe(0)
  })

  it('preserva invariantes com saldos iniciais baixos e validação PoUW reduzida', () => {
    const config = createDefaultConfig()
    config.seed = 'stress-low-balance'
    config.initialUms = 25
    config.conversionThreshold = 25
    config.validationRate = 0.9
    config.services = config.services.map((service) => ({ ...service, demand: service.demand * 3 }))
    const state = runScenario(config, 30)

    expectAccountingInvariants(state, config)
    expect(state.totals.servicesUnmet).toBeGreaterThan(0)
    expect(state.totals.umsRejected).toBeGreaterThan(0)
  })
})

describe('robustez da cadeia observadora', () => {
  it('valida cadeias em diferentes comprimentos de execução', () => {
    for (const rounds of [0, 1, 10, 100]) {
      const chain = buildBlockchain(runScenario(createDefaultConfig(), rounds))
      expect(validateBlockchain(chain).valid).toBe(true)
      expect(chain).toHaveLength(12 + rounds)
    }
  })

  it('detecta remoção de bloco intermediário e alteração do hash anterior', () => {
    const chain = buildBlockchain(runScenario(createDefaultConfig(), 5))
    const missingBlock = chain.filter((block) => block.index !== 4)
    const alteredLink = chain.map((block, index) =>
      index === 5 ? { ...block, previous_hash: 'C'.repeat(64) } : block,
    )

    expect(validateBlockchain(missingBlock).valid).toBe(false)
    expect(validateBlockchain(alteredLink).valid).toBe(false)
  })
})
