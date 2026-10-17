import { useMemo, useState } from 'react'
import type { SimulationState } from '../simulation/types'
import { buildBlockchain, validateBlockchain } from '../simulation/blockchain'
import { formatNumber } from '../utils/format'
import { useSyncQueue } from '../persistence/sync/SyncProvider'
import { SIMULATOR_CHAIN_ID } from '../persistence/sync/chainPersistence'
import { supabasePersistenceAvailable } from '../persistence/sync/runtime'
import { useSupabaseAuth } from '../persistence/auth/SupabaseAuthProvider'

interface Props { state: SimulationState }

function shortHash(value: string): string { return `${value.slice(0, 10)}…${value.slice(-8)}` }

export function MWBlockchainPanel({ state }: Props) {
  const { state: syncState, flush } = useSyncQueue()
  const { available: authAvailable, loading: authLoading, user, error: authError, signIn, signOut } = useSupabaseAuth()
  const blocks = useMemo(() => buildBlockchain(state), [state])
  const [corruptedIndex, setCorruptedIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const visibleBlocks = corruptedIndex === null ? blocks : blocks.map((block) => block.index === corruptedIndex ? { ...block, transactions: [...block.transactions, { id: `CORRUPTED-${block.index}`, type: 'POUW' as const, user: 'DEMO', count: 50000, details: 'dado alterado deliberadamente para demonstração' }] } : block)
  const validation = validateBlockchain(visibleBlocks)
  const selected = selectedIndex === null ? null : visibleBlocks.find((block) => block.index === selectedIndex) ?? null
  const transactionCount = blocks.reduce((total, block) => total + block.transactions.reduce((sum, transaction) => sum + transaction.count, 0), 0)
  const corrupt = () => setCorruptedIndex(blocks.length > 5 ? 5 : Math.max(1, blocks.length - 1))
  const restore = () => setCorruptedIndex(null)
  const login = async () => {
    setAuthBusy(true)
    try {
      await signIn(identifier.trim(), password)
      await flush()
      setPassword('')
    } catch {
      // O erro detalhado permanece no estado do provedor e é mostrado abaixo.
    } finally {
      setAuthBusy(false)
    }
  }

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
        <div className="mw-anchor"><span>CHAIN_ID</span><strong>{SIMULATOR_CHAIN_ID}</strong><small>identificador estável para recuperação entre recargas</small></div>
        <div className="mw-anchor"><span>MACHINE_ANCHOR · Chain 0</span><strong>{shortHash(state.machineAnchor)}</strong><small>somente o resultado criptográfico é armazenado</small></div>
        <div className="mw-anchor"><span>SESSÃO SUPABASE</span><strong>{!authAvailable ? 'NÃO CONFIGURADA' : authLoading ? 'CARREGANDO' : user ? 'AUTENTICADA' : 'LOGIN NECESSÁRIO'}</strong><small>{user?.email ?? 'Use o mesmo usuário do AppAndroidSWE-Start.'}</small></div>
        {!user && authAvailable && !authLoading && <div className="mw-auth-form"><input aria-label="Usuário ou e-mail" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Usuário ou e-mail" /><input aria-label="Senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" /><button className="button button-primary" type="button" onClick={() => void login()} disabled={authBusy || !identifier || !password}>{authBusy ? 'Entrando…' : 'Entrar com Supabase'}</button>{(authError || !supabasePersistenceAvailable) && <small className="mw-auth-error">{authError ?? 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.'}</small>}</div>}
        <div className="mw-anchor"><span>PERSISTÊNCIA</span><strong>{!supabasePersistenceAvailable ? 'NÃO CONFIGURADA' : !user ? 'AGUARDANDO LOGIN' : syncState.failedCount > 0 ? 'FALHA' : syncState.pendingCount > 0 ? 'PENDENTE' : 'CONFIRMAÇÃO NECESSÁRIA'}</strong><small>{!supabasePersistenceAvailable ? 'Supabase não configurado; nenhum sucesso remoto foi simulado.' : !user ? 'A fila só será enviada após autenticação.' : `${syncState.pendingCount} pendentes · ${syncState.failedCount} falhas`}</small></div>
        <div className="button-row mw-actions"><button className="button button-primary" type="button" onClick={() => undefined}>✓ Validar cadeia</button><button className="button button-secondary" type="button" onClick={() => void flush()} disabled={!user}>↥ Sincronizar</button>{user && <button className="button button-quiet" type="button" onClick={() => void signOut()}>Sair</button>}<button className="button button-quiet" type="button" onClick={corrupt} disabled={corruptedIndex !== null}>⚠ Simular corrupção</button><button className="button button-secondary" type="button" onClick={restore} disabled={corruptedIndex === null}>↺ Restaurar cadeia</button></div>
        <p className="helper-text">A blockchain observa usuários, serviços, PoUW e mercado já produzidos pelo simulador. Não possui saldos nem lógica econômica própria. Persistência só é considerada confirmada após resposta positiva do Supabase.</p>
      </aside>
    </div>
  </section>
}
