import { createReducer } from '@reduxjs/toolkit'
import { updatePools, addOrUpdatePool } from './actions'

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

export default createReducer(initialState, builder =>
  builder
    .addCase(updatePools, (state, { payload: pools }) => {
      state.pools = pools
    })
    .addCase(addOrUpdatePool, (state, { payload: pool }) => {
      let index = -1
      for (const [i, p] of state.pools.entries()) {
        if (p.lpTokenAddress === pool.lpTokenAddress) {
          index = i
          break
        }
      }

      if (index !== -1) {
        state.pools[index] = pool
      } else {
        state.pools.push(pool)
      }
    })
)
