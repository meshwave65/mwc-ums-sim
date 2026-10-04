export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits }).format(value)
}

export function formatUms(value: number): string {
  return `${formatNumber(value)} UMS`
}

export function formatBrl(value: number, signed = false): string {
  const prefix = signed && value > 0 ? '+' : ''
  return `${prefix}${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`
}
