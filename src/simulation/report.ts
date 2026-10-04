import { usersByUms } from './selectors'
import type { FinalReport, SimulationConfig, SimulationState } from './types'

export function createFinalReport(state: SimulationState, config: SimulationConfig): FinalReport {
  const orderedUsers = usersByUms(state.users)
  const topUser = orderedUsers[0]
  const marketUsers = state.users.filter((user) => user.mwcUsed > 0).length
  const deficitUsers = state.users.filter((user) => user.status === 'DÉFICIT' || user.status === 'NÃO ATENDIDO').length
  const narrative = [
    `${state.round} rodadas observadas com ${state.totals.servicesExecuted.toLocaleString('pt-BR')} serviços executados de ${state.totals.servicesRequested.toLocaleString('pt-BR')} solicitados; ${state.totals.servicesUnmet.toLocaleString('pt-BR')} ficaram não atendidos.`,
    `${state.totals.umsGenerated.toLocaleString('pt-BR')} UMS foram reconhecidas após PoUW, ${state.totals.umsRejected.toLocaleString('pt-BR')} UMS foram rejeitadas e ${state.totals.mwcGenerated} MWC foram criados no mercado.`,
    marketUsers > 0 ? `${marketUsers} usuários recorreram ao mercado externo para recuperar capacidade em ${state.totals.mwcReconverted} reconversões.` : 'Nenhum usuário precisou recorrer ao mercado externo.',
    deficitUsers > 0 ? `${deficitUsers} usuários terminaram em déficit ou com alguma operação não atendida.` : 'Nenhum usuário terminou em déficit operacional.',
    topUser ? `${topUser.id} encerrou com o maior saldo de UMS: ${topUser.ums.toLocaleString('pt-BR')}.` : 'Ainda não há usuários no relatório.',
    `Referência do protótipo: ${config.umsPerMwc.toLocaleString('pt-BR')} UMS = 1 MWC = R$ ${config.brlPerMwc.toFixed(2).replace('.', ',')}.`,
  ]
  return {
    round: state.round,
    generatedAt: new Date().toISOString(),
    users: orderedUsers.map((user) => ({
      id: user.id, profile: user.profile, ums: user.ums, brl: user.brl, generated: user.generated, used: user.used,
      validated: user.validated, invalid: user.invalid, servicesExecuted: user.servicesExecuted, servicesUnmet: user.servicesUnmet,
      mwcCreated: user.mwcCreated, mwcUsed: user.mwcUsed, unmetUms: user.unmetUms, status: user.status,
    })),
    market: { ...state.market },
    totals: { ...state.totals },
    narrative,
  }
}
