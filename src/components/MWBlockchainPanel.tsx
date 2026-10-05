import { useMemo, useState } from 'react'
import type { SimulationState } from '../simulation/types'
import { buildBlockchain, validateBlockchain } from '../simulation/blockchain'
import { formatNumber } from '../utils/format'

interface Props { state: SimulationState }

function shortHash(value: string): string { return `${value.slice(0, 10)}…${value.slice(-8)}` }

export function MWBlockchainPanel({ state }: Props) {
  const blocks = useMemo(() => buildBlockchain(state), [state])
  const [corruptedIndex, setCorruptedIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const visibleBlocks = corruptedIndex === null ? blocks : blocks.map((block) => block.index === corruptedIndex ? { ...block, transactions: [...block.transactions, { id: `CORRUPTED-${block.index}`, type: 'POUW' as const, user: 'DEMO', count: 50000, details: 'dado alterado deliberadamente para demonstração' }] } : block)
  const validation = validateBlockchain(visibleBlocks)
  const selected = selectedIndex === null ? null : visibleBlocks.find((block) => block.index === selectedIndex) ?? null
  const transactionCount = blocks.reduce((total, block) => total + block.transactions.reduce((sum, transaction) => sum + transaction.count, 0), 0)
  const corrupt = () => setCorruptedIndex(blocks.length > 5 ? 5 : Math.max(1, blocks.length - 1))
  const restore = () => setCorruptedIndex(null)

  return <section className="mw-blockchain-section">
    <div className="section-heading"><div><p className="eyebrow">Observador do simulador</p><h2>MWBlockchain</h2></div><span className="table-note">blocos derivados do estado real</span></div>
    <div className="mw-chain-layout">
      <div className="panel-surface mw-explorer-panel">
        <div className="section-heading compact"><div><p className="eyebrow">Block explorer</p><h3>Histórico da cadeia</h3></div><span className="event-count">{blocks.length} blocos</span></div>
        <div className="mw-table-wrap"><table><thead><tr><th>Block</th><th>TX</th><th>Validator</th><th>Hash</th><th>Previous hash</th><th>Status</th></tr></thead><tbody>{visibleBlocks.slice().reverse().map((block) => <tr key={block.index} className={block.index === corruptedIndex ? 'mw-corrupted-row' : ''} onClick={() => setSelectedIndex(block.index)}><td><strong>Chain {block.index}</strong><small>{block.type}{block.subject ? ` · ${block.subject}` : ''}</small></td><td>{block.transactions.length ? formatNumber(block.transactions.reduce((sum, tx) => sum + tx.count, 0)) : '—'}</td><td>{block.validator}</td><td className="mw-hash">{shortHash(block.hash)}</td><td className="mw-hash">{shortHash(block.previous_hash)}</td><td><span className={`mw-status ${block.index === corruptedIndex ? 'is-invalid' : 'is-valid'}`}>{block.index === corruptedIndex ? 'INVALID' : 'VALID'}</span></td></tr>)}</tbody></table></div>
        {selected && <div className="mw-detail"><p className="eyebrow">Detalhamento · Chain {selected.index}</p><div className="mw-detail-grid"><span>timestamp<strong>{new Date(selected.timestamp).toLocaleString('pt-BR')}</strong></span><span>validator<strong>{selected.validator}</strong></span><span>hash<strong>{shortHash(selected.hash)}</strong></span><span>previous_hash<strong>{shortHash(selected.previous_hash)}</strong></span></div>{selected.state && <div className="mw-transactions"><b>estado observado · {selected.subject}</b><span>UMS: {formatNumber(selected.state.ums ?? 0)} · BRL: R$ {formatNumber(selected.state.brl ?? 0)}</span></div>}<div className="mw-transactions"><b>transactions</b>{selected.transactions.length === 0 ? <span>nenhuma transação · estado de inicialização</span> : selected.transactions.map((tx) => <span key={tx.id}><em>{tx.type}</em> · {tx.user ?? 'simulador'} · {formatNumber(tx.count)} · {tx.details}</span>)}</div></div>}
      </div>
      <aside className="panel-surface mw-status-panel">
        <div className="section-heading compact"><div><p className="eyebrow eyebrow-amber">Status / validação</p><h3>Integridade da cadeia</h3></div><span className={`mw-chain-dot ${validation.valid ? 'is-valid' : 'is-invalid'}`} /></div>
        <div className={`mw-chain-result ${validation.valid ? 'is-valid' : 'is-invalid'}`}><strong>{validation.valid ? 'CHAIN VALID' : 'CHAIN CORRUPTED'}</strong><span>{validation.message}</span></div>
        <div className="mw-metrics"><div><span>Blocks</span><strong>{formatNumber(blocks.length)}</strong></div><div><span>Transactions</span><strong>{formatNumber(transactionCount)}</strong></div><div><span>Hash</span><strong>SHA-256</strong></div><div><span>Validators</span><strong>5</strong></div></div>
        <div className="mw-anchor"><span>MACHINE_ANCHOR · Chain 0</span><strong>{shortHash(state.machineAnchor)}</strong><small>somente o resultado criptográfico é armazenado</small></div>
        <div className="button-row mw-actions"><button className="button button-primary" type="button" onClick={() => undefined}>✓ Validar cadeia</button><button className="button button-quiet" type="button" onClick={corrupt} disabled={corruptedIndex !== null}>⚠ Simular corrupção</button><button className="button button-secondary" type="button" onClick={restore} disabled={corruptedIndex === null}>↺ Restaurar cadeia</button></div>
        <p className="helper-text">A blockchain observa usuários, serviços, PoUW e mercado já produzidos pelo simulador. Não possui saldos nem lógica econômica própria.</p>
      </aside>
    </div>
  </section>
}
