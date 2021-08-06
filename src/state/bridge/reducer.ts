import { createReducer } from '@reduxjs/toolkit'
import { selectToken, selectOriginChain, selectDestinationChain, fetchBridgeContract } from './actions'

export interface BridgeState {
  readonly isLoading: boolean
  readonly tokenAddress: string
  readonly tokenName: string
  readonly originChainId: number
  readonly destinationChainId: number
  readonly bridgeContract: any
}

const initialState: BridgeState = {
  isLoading: false,
  tokenAddress: '0x727A401fdDb5cd6074FaF5Fa7cbd2BA7b3ae7aFd',
  tokenName: '',
  originChainId: 137,
  destinationChainId: 100,
  bridgeContract: ''
}

export default createReducer<BridgeState>(initialState, builder =>
  builder
    .addCase(selectToken, (state, action) => {
      return {
        ...state,
        tokenAddress: action.payload.tokenAddress,
        tokenName: action.payload.tokenName
      }
    })
    .addCase(selectOriginChain, (state, action) => {
      return {
        ...state,
        originChainId: action.payload.chainId
      }
    })
    .addCase(selectDestinationChain, (state, action) => {
      return {
        ...state,
        destinationChainId: action.payload.chainId
      }
    })
    .addCase(fetchBridgeContract.pending, state => {
      return {
        ...state,
        isLoading: true
      }
    })
    .addCase(fetchBridgeContract.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        // bridgeContract: action.payload.bridgeContract
        bridgeContract: action.payload.bridgeContract
      }
    })
    .addCase(fetchBridgeContract.rejected, state => {
      return {
        ...state,
        isLoading: false
      }
    })
)
