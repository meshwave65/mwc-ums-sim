import { describe, expect, it } from 'vitest'
import { buildBlockchain, validateBlockchain, ZERO_HASH } from '../src/simulation/blockchain'
import { runRounds } from './helpers'

describe('MWBlockchain observadora', () => {
  it('cria Chain 0, usuários iniciais e exchange a partir do estado real', () => {
    const chain = buildBlockchain(runRounds(0))

    expect(chain).toHaveLength(12)
    expect(chain[0]).toMatchObject({ index: 0, type: 'SYSTEM_INIT', previous_hash: ZERO_HASH, validator: 'SYSTEM' })
    expect(chain[0].machine_anchor).toMatch(/^[A-F0-9]{64}$/)
    expect(chain.slice(1, 11).map((block) => block.subject)).toEqual([
      'USER-01', 'USER-02', 'USER-03', 'USER-04', 'USER-05',
      'USER-06', 'USER-07', 'USER-08', 'USER-09', 'USER-10',
    ])
    expect(chain[1].state).toEqual({ ums: 10_000, brl: 0 })
    expect(chain[11]).toMatchObject({ index: 11, type: 'EXCHANGE_INIT', subject: 'EXCHANGE' })
    expect(validateBlockchain(chain).valid).toBe(true)
  })

  it('cria exatamente um bloco operacional por rodada', () => {
    const chain = buildBlockchain(runRounds(10))

    expect(chain).toHaveLength(22)
    expect(chain.slice(12).map((block) => block.type)).toEqual([
      'ROUND_1', 'ROUND_2', 'ROUND_3', 'ROUND_4', 'ROUND_5',
      'ROUND_6', 'ROUND_7', 'ROUND_8', 'ROUND_9', 'ROUND_10',
    ])
    expect(validateBlockchain(chain)).toEqual({ valid: true, message: 'CHAIN VALID · integridade verificada desde Chain 0' })
  })

  it('detecta corrupção do payload e quebra do encadeamento posterior', () => {
    const chain = buildBlockchain(runRounds(10))
    const corrupted = chain.map((block) => block.index === 5 ? { ...block, subject: 'CORRUPTED_USER' } : block)

    const result = validateBlockchain(corrupted)

    expect(result.valid).toBe(false)
    expect(result.blockIndex).toBe(5)
    expect(result.message).toContain('hash inválido')
  })
})
