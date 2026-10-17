import { buildBlockchain, type BlockchainBlock } from '../../simulation/blockchain'
import type { SimulationState } from '../../simulation/types'
import { syncQueue, supabasePersistenceAvailable } from './runtime'

export const SIMULATOR_CHAIN_ID = 'mwc-ums-simulator-v1'

export async function enqueueBlockchainState(state: SimulationState): Promise<void> {
  if (!supabasePersistenceAvailable) return
  const blocks = buildBlockchain(state)
  const latest = blocks[blocks.length - 1]
  const initial = blocks[0]
  await syncQueue.enqueue({
    id: `metadata:${SIMULATOR_CHAIN_ID}`,
    operation: 'upsert_metadata',
    chainId: SIMULATOR_CHAIN_ID,
    payload: {
      chain_id: SIMULATOR_CHAIN_ID,
      chain_name: 'MWC / UMS Simulator',
      network: 'simulation',
      schema_version: 1,
      genesis_hash: initial.hash,
      latest_block_number: latest.index,
      latest_block_hash: latest.hash,
      metadata: {
        source: 'mwc-ums-sim',
        machine_anchor: state.machineAnchor,
        simulator_round: state.round,
      },
    },
  })

  await Promise.all(blocks.map((block) => enqueueBlock(block)))

  const blockByIndex = new Map(blocks.map((block) => [block.index, block]))
  await Promise.all(state.history.map((snapshot, historyIndex) => {
    const blockNumber = state.history.length === 1 ? 11 : 11 + historyIndex
    const block = blockByIndex.get(blockNumber)
    return syncQueue.enqueue({
      id: `snapshot:${SIMULATOR_CHAIN_ID}:${blockNumber}`,
      operation: 'upsert_snapshot',
      chainId: SIMULATOR_CHAIN_ID,
      payload: {
        chain_id: SIMULATOR_CHAIN_ID,
        block_number: blockNumber,
        block_hash: block?.hash ?? null,
        state: snapshot,
        metadata: { source: 'simulation_history', round: snapshot.round },
      },
    })
  }))
}

async function enqueueBlock(block: BlockchainBlock): Promise<void> {
  await syncQueue.enqueue({
    id: `block:${SIMULATOR_CHAIN_ID}:${block.index}`,
    operation: 'upsert_block',
    chainId: SIMULATOR_CHAIN_ID,
    payload: {
      chain_id: SIMULATOR_CHAIN_ID,
      block_number: block.index,
      block_hash: block.hash,
      previous_hash: block.previous_hash,
      block_timestamp: block.timestamp,
      nonce: block.nonce,
      difficulty: null,
      payload: block,
    },
  })

  await Promise.all(block.transactions.map((transaction, transactionIndex) => syncQueue.enqueue({
    id: `transaction:${SIMULATOR_CHAIN_ID}:${transaction.id}`,
    operation: 'upsert_transaction',
    chainId: SIMULATOR_CHAIN_ID,
    payload: {
      chain_id: SIMULATOR_CHAIN_ID,
      block_id: null,
      transaction_hash: transaction.id,
      transaction_index: transactionIndex,
      transaction_type: transaction.type,
      sender: null,
      recipient: null,
      amount: null,
      status: 'observed',
      payload: { ...transaction, block_number: block.index, block_hash: block.hash },
    },
  })))
}
