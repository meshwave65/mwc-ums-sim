import { createDefaultConfig, createInitialState } from '../src/simulation/defaults'
import { runRound } from '../src/simulation/engine'
import type { SimulationConfig, SimulationState } from '../src/simulation/types'

export function regressionConfig(seed = 'regression-seed-001'): SimulationConfig {
  const config = createDefaultConfig()
  config.seed = seed
  return config
}

export function runRounds(rounds: number, config = regressionConfig()): SimulationState {
  let state = createInitialState(config)
  // Fixtures não devem depender da âncora momentânea da máquina.
  state.machineAnchor = 'A'.repeat(64)
  for (let index = 0; index < rounds; index += 1) state = runRound(state, config)
  return state
}

export function economicProjection(state: SimulationState) {
  return {
    round: state.round,
    users: state.users.map((user) => ({
      id: user.id,
      profile: user.profile,
      roundProfile: user.roundProfile,
      ums: user.ums,
      brl: user.brl,
      servicesExecuted: user.servicesExecuted,
      servicesUnmet: user.servicesUnmet,
      generated: user.generated,
      used: user.used,
      validated: user.validated,
      invalid: user.invalid,
      mwcCreated: user.mwcCreated,
      mwcUsed: user.mwcUsed,
      unmetUms: user.unmetUms,
      lastGenerated: user.lastGenerated,
      lastUsed: user.lastUsed,
      lastVariation: user.lastVariation,
      lastValidated: user.lastValidated,
      lastInvalid: user.lastInvalid,
      lastMwcCreated: user.lastMwcCreated,
      lastMwcUsed: user.lastMwcUsed,
      status: user.status,
    })),
    market: state.market,
    totals: state.totals,
  }
}
