import { describe, expect, it } from 'vitest'
import { buildBlockchain, validateBlockchain } from '../src/simulation/blockchain'
import { runRounds } from './helpers'
import baselineContract from './fixtures/baseline.json'

describe('baseline da simulação', () => {
  it('mede cenários de referência e preserva a cadeia válida', () => {
    const measurements = baselineContract.rounds.map((rounds) => {
      const started = performance.now()
      const state = runRounds(rounds)
      const simulationMs = performance.now() - started
      const validationStarted = performance.now()
      const chain = buildBlockchain(state)
      const validation = validateBlockchain(chain)
      const validationMs = performance.now() - validationStarted

      expect(validation.valid).toBe(true)
      expect(state.round).toBe(rounds)
      expect(state.history).toHaveLength(rounds + 1)
      expect(chain).toHaveLength(12 + rounds)

      return { rounds, simulationMs, validationMs, historyItems: state.history.length, blockchainBlocks: chain.length }
    })

    expect(measurements).toHaveLength(baselineContract.rounds.length)
    expect(measurements.every((item) => item.simulationMs >= 0 && item.validationMs >= 0)).toBe(true)
    console.info('Simulation baseline:', measurements)
  })
})
