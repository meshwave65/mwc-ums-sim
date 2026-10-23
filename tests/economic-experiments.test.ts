import { describe, expect, it } from 'vitest'
import { createDefaultConfig } from '../src/simulation/defaults'
import type { SimulationConfig, SimulationState } from '../src/simulation/types'
import { runRounds } from './helpers'

const SEEDS = ['exp-001', 'exp-002', 'exp-003', 'exp-004', 'exp-005', 'exp-006', 'exp-007', 'exp-008', 'exp-009', 'exp-010']
const ROUNDS = 40

type ScenarioName = 'baseline' | 'demand_150pct' | 'validation_90pct' | 'initial_ums_1000' | 'conversion_threshold_5000'

interface ExperimentMetric {
  scenario: ScenarioName
  seed: string
  rounds: number
  requestedOperations: number
  executedOperations: number
  unmetOperations: number
  unmetRate: number
  umsGenerated: number
  umsUsed: number
  umsRejected: number
  mwcGenerated: number
  mwcReconverted: number
  mwcAvailable: number
  usersWithUnmetDemand: number
  usersWithZeroUms: number
}

function configureScenario(name: ScenarioName, seed: string): SimulationConfig {
  const config = createDefaultConfig()
  config.seed = seed
  if (name === 'demand_150pct') config.services = config.services.map((service) => ({ ...service, demand: service.demand * 1.5 }))
  if (name === 'validation_90pct') config.validationRate = 0.9
  if (name === 'initial_ums_1000') config.initialUms = 1000
  if (name === 'conversion_threshold_5000') config.conversionThreshold = 5000
  return config
}

function measure(state: SimulationState, scenario: ScenarioName, seed: string): ExperimentMetric {
  const totals = state.totals
  return {
    scenario,
    seed,
    rounds: state.round,
    requestedOperations: totals.servicesRequested,
    executedOperations: totals.servicesExecuted,
    unmetOperations: totals.servicesUnmet,
    unmetRate: totals.servicesRequested > 0 ? totals.servicesUnmet / totals.servicesRequested : 0,
    umsGenerated: totals.umsGenerated,
    umsUsed: totals.umsUsed,
    umsRejected: totals.umsRejected,
    mwcGenerated: state.market.mwcGenerated,
    mwcReconverted: state.market.mwcReconverted,
    mwcAvailable: state.market.mwcAvailable,
    usersWithUnmetDemand: state.users.filter((user) => user.servicesUnmet > 0).length,
    usersWithZeroUms: state.users.filter((user) => user.ums === 0).length,
  }
}

function quantile(values: number[], fraction: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) return 0
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))]
}

function summarize(rows: ExperimentMetric[]) {
  const fields: Array<keyof Pick<ExperimentMetric, 'unmetRate' | 'umsGenerated' | 'umsUsed' | 'umsRejected' | 'mwcGenerated' | 'mwcReconverted' | 'mwcAvailable' | 'usersWithUnmetDemand' | 'usersWithZeroUms'>> = [
    'unmetRate', 'umsGenerated', 'umsUsed', 'umsRejected', 'mwcGenerated',
    'mwcReconverted', 'mwcAvailable', 'usersWithUnmetDemand', 'usersWithZeroUms',
  ]
  return Object.fromEntries(fields.map((field) => {
    const values = rows.map((row) => row[field] as number)
    return [field, {
      min: Math.min(...values),
      p10: quantile(values, 0.1),
      median: quantile(values, 0.5),
      p90: quantile(values, 0.9),
      max: Math.max(...values),
    }]
  }))
}

function assertAccountingInvariants(state: SimulationState, config: SimulationConfig): void {
  expect(state.totals.umsGenerated).toBe(state.users.reduce((sum, user) => sum + user.generated, 0))
  expect(state.totals.umsUsed).toBe(state.users.reduce((sum, user) => sum + user.used, 0))
  expect(state.totals.umsRejected).toBe(state.users.reduce((sum, user) => sum + user.invalid, 0))
  expect(state.market.mwcGenerated).toBe(state.market.mwcAvailable + state.market.mwcReconverted)
  expect(state.market.brlReference).toBe(state.market.mwcAvailable * config.brlPerMwc)
  expect(state.totals.servicesRequested).toBe(
    config.services.reduce((sum, service) => sum + Math.max(0, Math.floor(service.demand)), 0) * state.round,
  )
  expect(state.users.every((user) =>
    Number.isFinite(user.ums) && user.ums >= 0 &&
    Number.isFinite(user.generated) && user.generated >= 0 &&
    Number.isFinite(user.used) && user.used >= 0 &&
    Number.isFinite(user.invalid) && user.invalid >= 0 &&
    Number.isFinite(user.mwcCreated) && user.mwcCreated >= 0 &&
    Number.isFinite(user.mwcUsed) && user.mwcUsed >= 0,
  )).toBe(true)
}

describe('experimentos econômicos exploratórios MWC/UMS', () => {
  it('executa cenários pareados por seed, resume distribuições e mantém invariantes', () => {
    const scenarios: ScenarioName[] = [
      'baseline',
      'demand_150pct',
      'validation_90pct',
      'initial_ums_1000',
      'conversion_threshold_5000',
    ]
    const rows: ExperimentMetric[] = []

    for (const scenario of scenarios) {
      for (const seed of SEEDS) {
        const config = configureScenario(scenario, seed)
        const state = runRounds(ROUNDS, config)
        assertAccountingInvariants(state, config)
        rows.push(measure(state, scenario, seed))
      }
    }

    const summaries = scenarios.map((scenario) => {
      const group = rows.filter((row) => row.scenario === scenario)
      return { scenario, runs: group.length, roundsPerRun: ROUNDS, distribution: summarize(group) }
    })

    expect(rows).toHaveLength(scenarios.length * SEEDS.length)
    expect(rows.every((row) => row.rounds === ROUNDS)).toBe(true)
    expect(rows.every((row) => row.requestedOperations >= row.executedOperations)).toBe(true)
    expect(rows.every((row) => row.unmetOperations >= 0 && row.unmetRate >= 0 && row.unmetRate <= 1)).toBe(true)
    console.info('MWC_UMS_EXPERIMENT_SUMMARY=' + JSON.stringify({
      methodology: 'exploratory one-factor-at-a-time; paired seeds across scenarios',
      seeds: SEEDS,
      roundsPerRun: ROUNDS,
      totalRuns: rows.length,
      metrics: summaries,
      interpretation: 'Simulation outputs under configured assumptions; not real-world forecasts, market prices, or proof of economic viability.',
    }))
  })
})
