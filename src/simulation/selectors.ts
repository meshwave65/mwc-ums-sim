import type { SimulationState, UserState, UserStatus } from './types'

export function totalUms(state: SimulationState): number {
  return state.users.reduce((total, user) => total + user.ums, 0)
}

export function usersByUms(users: UserState[]): UserState[] {
  return [...users].sort((left, right) => right.ums - left.ums)
}

export function statusTone(status: UserStatus): 'positive' | 'negative' | 'neutral' | 'warning' {
  if (status === 'SUPERÁVIT') return 'positive'
  if (status === 'DÉFICIT') return 'negative'
  if (status === 'NÃO ATENDIDO') return 'warning'
  return 'neutral'
}

export function statusLabel(user: UserState): string {
  if (user.lastMwcCreated > 0) return 'MWC GERADO'
  if (user.lastMwcUsed > 0) return 'USOU MERCADO'
  return user.status
}

export function roundStatusLabel(status: SimulationState['status']): string {
  const labels: Record<SimulationState['status'], string> = { idle: 'PARADO', running: 'EXECUTANDO', paused: 'PAUSADO', stopped: 'PARADO', completed: 'CONCLUÍDO' }
  return labels[status]
}
