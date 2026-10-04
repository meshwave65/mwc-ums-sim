import type { FinalReport } from '../simulation/types'

function download(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function csvCell(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`
}

export function exportReportJson(report: FinalReport): void {
  download(JSON.stringify(report, null, 2), `relatorio-mwc-ums-${report.round}.json`, 'application/json;charset=utf-8')
}

export function exportReportCsv(report: FinalReport): void {
  const summary: Array<Array<string | number>> = [
    ['Relatório', 'Simulador MWC / UMS'],
    ['Rodada final', report.round],
    ['Serviços solicitados', report.totals.servicesRequested],
    ['Serviços executados', report.totals.servicesExecuted],
    ['Serviços não atendidos', report.totals.servicesUnmet],
    ['UMS reconhecida', report.totals.umsGenerated],
    ['UMS rejeitada pelo PoUW', report.totals.umsRejected],
    ['MWC disponível', report.market.mwcAvailable],
    ['MWC gerado', report.market.mwcGenerated],
    ['MWC reconvertido', report.market.mwcReconverted],
    ['BRL movimentado', report.market.brlVolume],
    [],
  ]
  const header = ['Usuário', 'Perfil', 'UMS final', 'BRL', 'UMS gerada', 'UMS utilizada', 'PoUW rejeitado', 'Serviços executados', 'Não atendidos', 'UMS não atendida', 'MWC criado', 'MWC usado', 'Status']
  const lines = [...summary.map((row) => row.map(csvCell).join(';')), header.map(csvCell).join(';')]
  report.users.forEach((user) => {
    lines.push([
      user.id, `${user.roundProfile}%`, user.ums, user.brl.toFixed(2).replace('.', ','), user.generated, user.used, user.invalid,
      user.servicesExecuted, user.servicesUnmet, user.unmetUms, user.mwcCreated, user.mwcUsed, user.status,
    ].map(csvCell).join(';'))
  })
  download(`\uFEFF${lines.join('\n')}`, `relatorio-mwc-ums-${report.round}.csv`, 'text/csv;charset=utf-8')
}
