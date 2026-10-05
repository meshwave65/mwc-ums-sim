import type { RoundSnapshot, SimulationState, UserState } from './types'

export type BlockchainTransactionType = 'SERVICE' | 'POUW' | 'MWC_ISSUANCE' | 'MWC_RECONVERSION'

export interface BlockchainTransaction {
  id: string
  type: BlockchainTransactionType
  user?: string
  count: number
  details: string
}

export interface BlockchainBlock {
  index: number
  type: string
  timestamp: string
  chain: 'MWBlockchain'
  version: '0.1'
  machine_anchor?: string
  previous_hash: string
  transactions: BlockchainTransaction[]
  validator: string
  nonce: number
  subject?: string
  state?: { ums?: number; brl?: number; mwcAvailable?: number; reconversions?: number }
  hash: string
}

export interface ChainValidation {
  valid: boolean
  blockIndex?: number
  message: string
}

const ZERO_HASH = '0'.repeat(64)
const VALIDATORS = ['VAL-01', 'VAL-02', 'VAL-03', 'VAL-04', 'VAL-05']

function rotr(value: number, bits: number): number { return (value >>> bits) | (value << (32 - bits)) }
function sha256(input: string): string {
  const bytes = new TextEncoder().encode(input)
  const words = new Uint32Array(Math.ceil((bytes.length + 9) / 64) * 16)
  for (let index = 0; index < bytes.length; index += 1) words[index >> 2] |= bytes[index] << (24 - (index % 4) * 8)
  const bitLength = bytes.length * 8
  words[bytes.length >> 2] |= 0x80 << (24 - (bytes.length % 4) * 8)
  words[words.length - 2] = Math.floor(bitLength / 0x100000000)
  words[words.length - 1] = bitLength >>> 0
  const hash = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]
  for (let offset = 0; offset < words.length; offset += 16) {
    const w = new Uint32Array(64)
    for (let i = 0; i < 16; i += 1) w[i] = words[offset + i]
    for (let i = 16; i < 64; i += 1) { const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3); const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0 }
    let [a, b, c, d, e, f, g, h] = hash
    for (let i = 0; i < 64; i += 1) { const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25); const ch = (e & f) ^ (~e & g); const temp1 = (h + S1 + ch + k[i] + w[i]) >>> 0; const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22); const maj = (a & b) ^ (a & c) ^ (b & c); const temp2 = (S0 + maj) >>> 0; h = g; g = f; f = e; e = (d + temp1) >>> 0; d = c; c = b; b = a; a = (temp1 + temp2) >>> 0 }
    hash[0] = (hash[0] + a) >>> 0; hash[1] = (hash[1] + b) >>> 0; hash[2] = (hash[2] + c) >>> 0; hash[3] = (hash[3] + d) >>> 0; hash[4] = (hash[4] + e) >>> 0; hash[5] = (hash[5] + f) >>> 0; hash[6] = (hash[6] + g) >>> 0; hash[7] = (hash[7] + h) >>> 0
  }
  return Array.from(hash, (value) => value.toString(16).padStart(8, '0')).join('').toUpperCase()
}

function canonical(block: Omit<BlockchainBlock, 'hash'>): string { return JSON.stringify(block) }
function hashBlock(block: Omit<BlockchainBlock, 'hash'>): string { return sha256(canonical(block)) }
function createBlock(index: number, type: string, timestamp: string, previousHash: string, transactions: BlockchainTransaction[], validator: string, machineAnchor?: string, subject?: string, state?: BlockchainBlock['state']): BlockchainBlock {
  const data = { index, type, timestamp, chain: 'MWBlockchain' as const, version: '0.1' as const, ...(machineAnchor ? { machine_anchor: machineAnchor } : {}), previous_hash: previousHash, transactions, validator, nonce: 0, ...(subject ? { subject } : {}), ...(state ? { state } : {}) }
  return { ...data, hash: hashBlock(data) }
}
function diff(current: UserState, previous?: UserState): { service: number; pouw: number; issuance: number; reconversion: number } {
  return { service: current.servicesExecuted - (previous?.servicesExecuted ?? 0), pouw: current.validated - (previous?.validated ?? 0), issuance: current.mwcCreated - (previous?.mwcCreated ?? 0), reconversion: current.mwcUsed - (previous?.mwcUsed ?? 0) }
}
function roundTransactions(snapshot: RoundSnapshot, previous: RoundSnapshot | undefined): BlockchainTransaction[] {
  const transactions: BlockchainTransaction[] = []
  snapshot.users.forEach((user) => {
    const prior = previous?.users.find((item) => item.id === user.id)
    const changes = diff(user, prior)
    if (changes.service > 0) transactions.push({ id: `TX-${snapshot.round}-SERVICE-${user.id}`, type: 'SERVICE', user: user.id, count: changes.service, details: `${changes.service} operações de serviços executadas pelo simulador` })
    if (changes.pouw > 0) transactions.push({ id: `TX-${snapshot.round}-POUW-${user.id}`, type: 'POUW', user: user.id, count: changes.pouw, details: `${changes.pouw} UMS reconhecidas pelo PoUW do simulador` })
    if (changes.issuance > 0) transactions.push({ id: `TX-${snapshot.round}-ISSUANCE-${user.id}`, type: 'MWC_ISSUANCE', user: user.id, count: changes.issuance, details: `${changes.issuance} MWC criados por conversão real` })
    if (changes.reconversion > 0) transactions.push({ id: `TX-${snapshot.round}-RECONVERSION-${user.id}`, type: 'MWC_RECONVERSION', user: user.id, count: changes.reconversion, details: `${changes.reconversion} MWC reconvertidos pelo mercado` })
  })
  return transactions
}

export function createMachineAnchor(): string {
  let cpuPulse = 0
  const started = performance.now()
  for (let i = 0; i < 12000; i += 1) cpuPulse = (cpuPulse + Math.sqrt(i + started)) % 100000
  const fingerprint = `${Date.now()}|${performance.now()}|${cpuPulse}|${navigator.hardwareConcurrency ?? 'na'}|${(navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 'na'}|${screen.width}x${screen.height}`
  return sha256(fingerprint)
}

export function buildBlockchain(state: SimulationState): BlockchainBlock[] {
  const snapshots = state.history
  const initial = snapshots[0]
  const blocks: BlockchainBlock[] = [createBlock(0, 'SYSTEM_INIT', initial.timestamp, ZERO_HASH, [], 'SYSTEM', state.machineAnchor)]
  initial.users.forEach((user, index) => blocks.push(createBlock(index + 1, 'USER_INIT', initial.timestamp, blocks[blocks.length - 1].hash, [], 'SYSTEM', undefined, user.id, { ums: user.ums, brl: user.brl })))
  const exchangeIndex = initial.users.length + 1
  blocks.push(createBlock(exchangeIndex, 'EXCHANGE_INIT', initial.timestamp, blocks[blocks.length - 1].hash, [], 'SYSTEM', undefined, 'EXCHANGE', { mwcAvailable: initial.market.mwcAvailable, reconversions: initial.market.mwcReconverted, brl: initial.market.brlVolume }))
  snapshots.slice(1).forEach((snapshot, roundIndex) => {
    const previous = snapshots[roundIndex]
    const transactions = roundTransactions(snapshot, previous)
    blocks.push(createBlock(exchangeIndex + roundIndex + 1, `ROUND_${snapshot.round}`, snapshot.timestamp, blocks[blocks.length - 1].hash, transactions, VALIDATORS[roundIndex % VALIDATORS.length]))
  })
  return blocks
}

export function validateBlockchain(blocks: BlockchainBlock[]): ChainValidation {
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (block.index !== index) return { valid: false, blockIndex: index, message: `CHAIN CORRUPTED · sequência inválida no bloco ${index}` }
    if (index > 0 && block.previous_hash !== blocks[index - 1].hash) return { valid: false, blockIndex: index, message: `CHAIN CORRUPTED · previous_hash inconsistente após o bloco ${index - 1}` }
    const { hash, ...data } = block
    if (hashBlock(data) !== hash) return { valid: false, blockIndex: index, message: `CHAIN CORRUPTED · hash inválido no bloco ${index}` }
  }
  return { valid: true, message: 'CHAIN VALID · integridade verificada desde Chain 0' }
}

export { ZERO_HASH }
