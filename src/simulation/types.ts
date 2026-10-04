export type SimulationStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'completed'

export type UserStatus = 'SUPERÁVIT' | 'DÉFICIT' | 'ESTÁVEL' | 'NÃO ATENDIDO'

export type EventTone = 'info' | 'success' | 'warning' | 'danger' | 'market'

export interface ServiceDefinition {
  id: string
  name: string
  shortName: string
  unit: string
  cost: number
  demand: number
}

export interface UserConfig {
  id: string
  profile: number
}

export interface SimulationConfig {
  initialUms: number
  umsPerMwc: number
  brlPerMwc: number
  validationRate: number
  variationRange: number
  seed: string
  users: UserConfig[]
  services: ServiceDefinition[]
}

export interface UserState extends UserConfig {
  ums: number
  brl: number
  servicesExecuted: number
  servicesUnmet: number
  generated: number
  used: number
  validated: number
  invalid: number
  mwcCreated: number
  mwcUsed: number
  unmetUms: number
  lastGenerated: number
  lastUsed: number
  lastVariation: number
  lastValidated: number
  lastInvalid: number
  lastMwcCreated: number
  lastMwcUsed: number
  status: UserStatus
  lastActivity: string
}

export interface MarketState {
  mwcAvailable: number
  mwcGenerated: number
  mwcReconverted: number
  brlReference: number
  brlVolume: number
}

export interface SimulationTotals {
  servicesRequested: number
  servicesExecuted: number
  servicesUnmet: number
  umsGenerated: number
  umsUsed: number
  umsRejected: number
  mwcGenerated: number
  mwcReconverted: number
  brlVolume: number
}

export interface SimulationEvent {
  id: string
  round: number
  time: string
  tone: EventTone
  label: string
  message: string
}

export interface RoundSnapshot {
  round: number
  timestamp: string
  users: UserState[]
  market: MarketState
  totals: SimulationTotals
}

export interface UserReport {
  id: string
  profile: number
  ums: number
  brl: number
  generated: number
  used: number
  validated: number
  invalid: number
  servicesExecuted: number
  servicesUnmet: number
  mwcCreated: number
  mwcUsed: number
  unmetUms: number
  status: UserStatus
}

export interface FinalReport {
  round: number
  generatedAt: string
  users: UserReport[]
  market: MarketState
  totals: SimulationTotals
  narrative: string[]
}

export interface SimulationState {
  round: number
  status: SimulationStatus
  users: UserState[]
  market: MarketState
  totals: SimulationTotals
  events: SimulationEvent[]
  history: RoundSnapshot[]
  report: FinalReport | null
}
