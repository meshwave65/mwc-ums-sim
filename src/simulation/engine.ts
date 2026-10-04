import { clamp, createRandom, randomBetween } from './random'
import type { EventTone, ServiceDefinition, SimulationConfig, SimulationEvent, SimulationState, UserState } from './types'

const MAX_EVENTS = 360

interface UsageBucket { cost: number; operations: number }

function nowLabel(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function pushEvent(events: SimulationEvent[], round: number, tone: EventTone, label: string, message: string): void {
  events.push({ id: `${round}-${events.length}-${label}`, round, time: nowLabel(), tone, label, message })
}

function cloneUsers(users: UserState[]): UserState[] { return users.map((user) => ({ ...user })) }

function allocateService(service: ServiceDefinition, users: UserState[], buckets: Map<string, UsageBucket>, random: ReturnType<typeof createRandom>): void {
  const factors = users.map((user) => Math.max(0.35, 1 - user.profile / 100 + randomBetween(random, -0.05, 0.05)))
  const factorTotal = factors.reduce((total, factor) => total + factor, 0)
  let remaining = Math.max(0, Math.floor(service.demand))
  users.forEach((user, index) => {
    const operations = index === users.length - 1
      ? remaining
      : Math.min(remaining, Math.max(0, Math.round((service.demand * factors[index]) / factorTotal)))
    remaining -= operations
    const current = buckets.get(user.id) ?? { cost: 0, operations: 0 }
    current.cost += operations * service.cost
    current.operations += operations
    buckets.set(user.id, current)
  })
}

function snapshotState(state: SimulationState, timestamp: string): SimulationState['history'][number] {
  return { round: state.round, timestamp, users: cloneUsers(state.users), market: { ...state.market }, totals: { ...state.totals } }
}

function addRoundEvent(events: SimulationEvent[], round: number, tone: EventTone, label: string, message: string): void {
  pushEvent(events, round, tone, label, message)
}

export function runRound(state: SimulationState, config: SimulationConfig): SimulationState {
  const nextRound = state.round + 1
  const timestamp = new Date().toISOString()
  const random = createRandom(config.seed ? `${config.seed}:${nextRound}` : undefined)
  const users = cloneUsers(state.users)
  const market = { ...state.market }
  const totals = { ...state.totals }
  const events = [...state.events]
  const buckets = new Map<string, UsageBucket>()
  addRoundEvent(events, nextRound, 'info', `RODADA ${String(nextRound).padStart(3, '0')}`, 'Rodada iniciada: demanda distribuída entre os usuários.')
  config.services.forEach((service) => allocateService(service, users, buckets, random))
  totals.servicesRequested += config.services.reduce((total, service) => total + Math.max(0, Math.floor(service.demand)), 0)

  users.forEach((user) => {
    const usage = buckets.get(user.id) ?? { cost: 0, operations: 0 }
    user.lastMwcCreated = 0
    user.lastMwcUsed = 0
    let availableCapacity = user.ums
    let mwcUsed = 0
    let unmetUms = 0

    if (usage.cost > availableCapacity) {
      const neededUms = usage.cost - availableCapacity
      const requiredMwc = Math.ceil(neededUms / Math.max(1, config.umsPerMwc))
      mwcUsed = Math.min(requiredMwc, market.mwcAvailable)
      if (mwcUsed > 0) {
        const restoredUms = mwcUsed * config.umsPerMwc
        availableCapacity += restoredUms
        market.mwcAvailable -= mwcUsed
        market.mwcReconverted += mwcUsed
        market.brlVolume += mwcUsed * config.brlPerMwc
        user.brl -= mwcUsed * config.brlPerMwc
        user.mwcUsed += mwcUsed
        user.lastMwcUsed = mwcUsed
        addRoundEvent(events, nextRound, 'market', 'RECONVERSÃO', `${user.id} recebeu ${restoredUms.toLocaleString('pt-BR')} UMS via ${mwcUsed} MWC do mercado.`)
      }
      unmetUms = Math.max(0, usage.cost - availableCapacity)
    }

    const actualUsed = Math.min(usage.cost, availableCapacity)
    const estimatedUnmetOperations = unmetUms > 0
      ? Math.min(usage.operations, Math.ceil((usage.operations * unmetUms) / Math.max(1, usage.cost),))
      : 0
    const executedOperations = Math.max(0, usage.operations - estimatedUnmetOperations)
    const variation = randomBetween(random, -config.variationRange, config.variationRange) / 100
    const effectiveProfile = user.profile / 100 + variation
    const grossGenerated = Math.max(0, Math.round(actualUsed * (1 + effectiveProfile)))
    const validationRate = clamp(config.validationRate + randomBetween(random, -0.01, 0.01), 0.9, 1)
    const validated = Math.round(grossGenerated * validationRate)
    const invalid = Math.max(0, grossGenerated - validated)

    user.ums = Math.max(0, availableCapacity - actualUsed) + validated
    user.generated += validated
    user.used += actualUsed
    user.validated += validated
    user.invalid += invalid
    user.servicesExecuted += executedOperations
    user.servicesUnmet += estimatedUnmetOperations
    user.unmetUms += unmetUms
    user.lastGenerated = validated
    user.lastUsed = actualUsed
    user.lastVariation = validated - actualUsed
    user.lastValidated = validated
    user.lastInvalid = invalid
    user.lastActivity = unmetUms > 0 ? `Déficit operacional de ${unmetUms.toLocaleString('pt-BR')} UMS` : `${executedOperations.toLocaleString('pt-BR')} operações processadas`

    totals.servicesExecuted += executedOperations
    totals.servicesUnmet += estimatedUnmetOperations
    totals.umsGenerated += validated
    totals.umsUsed += actualUsed
    totals.umsRejected += invalid
    totals.mwcReconverted += mwcUsed
    totals.brlVolume += mwcUsed * config.brlPerMwc

    addRoundEvent(events, nextRound, validated > 0 ? 'success' : 'warning', 'PoUW', `${user.id}: ${validated.toLocaleString('pt-BR')} UMS reconhecidas; ${invalid.toLocaleString('pt-BR')} UMS rejeitadas na validação.`)
    if (unmetUms > 0) addRoundEvent(events, nextRound, 'danger', 'NÃO ATENDIDO', `${user.id}: ${unmetUms.toLocaleString('pt-BR')} UMS ficaram sem cobertura; nenhuma capacidade foi fabricada.`)

    const conversionBlocks = Math.max(0, Math.floor((user.ums - config.initialUms) / Math.max(1, config.umsPerMwc)))
    if (conversionBlocks > 0) {
      const convertedUms = conversionBlocks * config.umsPerMwc
      user.ums -= convertedUms
      user.brl += conversionBlocks * config.brlPerMwc
      user.mwcCreated += conversionBlocks
      user.lastMwcCreated = conversionBlocks
      market.mwcAvailable += conversionBlocks
      market.mwcGenerated += conversionBlocks
      market.brlVolume += conversionBlocks * config.brlPerMwc
      totals.mwcGenerated += conversionBlocks
      totals.brlVolume += conversionBlocks * config.brlPerMwc
      addRoundEvent(events, nextRound, 'market', 'UMS → MWC', `${user.id}: ${convertedUms.toLocaleString('pt-BR')} UMS convertidas em ${conversionBlocks} MWC.`)
    }

    if (unmetUms > 0) user.status = 'NÃO ATENDIDO'
    else if (user.lastVariation > 0) user.status = 'SUPERÁVIT'
    else if (user.lastVariation < 0) user.status = 'DÉFICIT'
    else user.status = 'ESTÁVEL'
  })

  market.brlReference = market.mwcAvailable * config.brlPerMwc
  totals.mwcReconverted = market.mwcReconverted
  totals.mwcGenerated = market.mwcGenerated
  totals.brlVolume = market.brlVolume
  const nextState: SimulationState = {
    round: nextRound,
    status: state.status,
    users,
    market,
    totals,
    events: events.slice(-MAX_EVENTS),
    history: [...state.history, snapshotState({ ...state, round: nextRound, users, market, totals }, timestamp)],
    report: null,
  }
  addRoundEvent(nextState.events, nextRound, 'info', 'RODADA ENCERRADA', `Rodada ${String(nextRound).padStart(3, '0')} concluída: ${totals.umsGenerated.toLocaleString('pt-BR')} UMS reconhecidas no acumulado.`)
  return nextState
}
