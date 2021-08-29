import { createReducer } from '@reduxjs/toolkit'
import { updatePools } from './actions'

export interface CachedPool {
  pid?: number
  lpTokenAddress: string
  lpTokenBalance?: number
  lpTokenStaked?: number
  lpTokenPrice?: number
  pendingRewards?: number
}

export interface PoolState {
  pools: CachedPool[]
}

const initialState: PoolState = {
  pools: []
}

const mergePools = (oldPools: CachedPool[], newPools: CachedPool[]) => {
  const mergedPools: CachedPool[] = []
  for (const nPool of newPools) {
    const matches = oldPools.filter(p => p.pid === nPool.pid || p.lpTokenAddress === nPool.lpTokenAddress)
    if (matches.length) {
      mergedPools.push({ ...matches[0], ...nPool })
    } else {
      mergedPools.push(nPool)
    }
  }
  return mergedPools
}

export default createReducer(initialState, builder =>
  builder.addCase(updatePools, (state, { payload: pools }) => {
    state.pools = mergePools(state.pools, pools)
  })
)
