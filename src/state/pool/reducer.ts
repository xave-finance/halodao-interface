import { createReducer } from '@reduxjs/toolkit'
import { updatePools } from './actions'

export interface Pool {
  pid: number
  lpTokenAddress: string
}

export interface PoolState {
  pools: Pool[]
}

const initialState: PoolState = {
  pools: []
}

export default createReducer(initialState, builder =>
  builder.addCase(updatePools, (state, { payload: pools }) => {
    state.pools = pools
  })
)
