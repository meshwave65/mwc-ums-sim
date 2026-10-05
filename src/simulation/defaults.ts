import type { MarketState, ServiceDefinition, SimulationConfig, SimulationState, SimulationTotals, UserState } from './types'
import { createMachineAnchor } from './blockchain'

export const DEFAULT_PROFILES = [20, -10, 5, -25, 15, -5, 30, -15, 10, -20]

export const DEFAULT_SERVICES: ServiceDefinition[] = [
  { id: 'routing', name: 'Roteamento de pacote', shortName: 'Roteamento', unit: 'operação', cost: 1, demand: 3000 },
  { id: 'temp-storage', name: 'Armazenamento temporário', shortName: 'Temp. storage', unit: 'operação', cost: 2, demand: 1000 },
  { id: 'permanent-storage', name: 'Armazenamento permanente', shortName: 'Perm. storage', unit: 'operação', cost: 5, demand: 300 },
  { id: 'bandwidth', name: 'Uso de banda', shortName: 'Banda', unit: 'operação', cost: 3, demand: 2000 },
  { id: 'cpu', name: 'Processamento CPU', shortName: 'CPU', unit: 'operação', cost: 4, demand: 800 },
  { id: 'gpu', name: 'Processamento GPU', shortName: 'GPU', unit: 'operação', cost: 12, demand: 400 },
  { id: 'replication', name: 'Replicação de dados', shortName: 'Replicação', unit: 'operação', cost: 6, demand: 300 },
  { id: 'retrieval', name: 'Recuperação de dados', shortName: 'Recuperação', unit: 'operação', cost: 3, demand: 300 },
  { id: 'cache', name: 'Cache distribuído', shortName: 'Cache', unit: 'operação', cost: 2, demand: 600 },
  { id: 'transfer', name: 'Transferência entre nós', shortName: 'Transferência', unit: 'operação', cost: 4, demand: 500 },
]

export function createDefaultConfig(): SimulationConfig {
  return {
    initialUms: 10000,
    umsPerMwc: 1000,
    conversionThreshold: 10000,
    brlPerMwc: 1,
    validationRate: 1,
    profileMin: -30,
    profileMax: 30,
    seed: '',
    users: DEFAULT_PROFILES.map((profile, index) => ({ id: `USER-${String(index + 1).padStart(2, '0')}`, profile })),
    services: DEFAULT_SERVICES.map((service) => ({ ...service })),
  }
}

export function createInitialUser(id: string, profile: number, initialUms: number): UserState {
  return {
    id,
    profile,
    roundProfile: profile,
    ums: initialUms,
    brl: 0,
    servicesExecuted: 0,
    servicesUnmet: 0,
    generated: 0,
    used: 0,
    validated: 0,
    invalid: 0,
    mwcCreated: 0,
    mwcUsed: 0,
    unmetUms: 0,
    lastGenerated: 0,
    lastUsed: 0,
    lastVariation: 0,
    lastValidated: 0,
    lastInvalid: 0,
    lastMwcCreated: 0,
    lastMwcUsed: 0,
    status: 'ESTÁVEL',
    lastActivity: 'Aguardando a primeira rodada',
  }
}

export function createInitialMarket(): MarketState {
  return { mwcAvailable: 0, mwcGenerated: 0, mwcReconverted: 0, brlReference: 0, brlVolume: 0 }
}

export function createInitialTotals(): SimulationTotals {
  return { servicesRequested: 0, servicesExecuted: 0, servicesUnmet: 0, umsGenerated: 0, umsUsed: 0, umsRejected: 0, mwcGenerated: 0, mwcReconverted: 0, brlVolume: 0 }
}

export function createInitialState(config: SimulationConfig): SimulationState {
  const users = config.users.map((user) => createInitialUser(user.id, user.profile, config.initialUms))
  const market = createInitialMarket()
  const totals = createInitialTotals()
  return {
    round: 0,
    status: 'idle',
    machineAnchor: createMachineAnchor(),
    users,
    market,
    totals,
    events: [],
    history: [{ round: 0, timestamp: new Date().toISOString(), users: users.map((user) => ({ ...user })), market: { ...market }, totals: { ...totals } }],
    report: null,
  }
}
