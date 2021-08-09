import { createReducer } from '@reduxjs/toolkit'
import {
  selectToken,
  setTokenAddress,
  setWrappedTokenAddress,
  setDestinationChain,
  setPrimaryBridgeContract,
  setSecondaryBridgeContract,
  fetchBridgeContract
} from './actions'
import { BridgeToken, MOCK_TOKEN } from 'constants/bridge'

export interface BridgeState {
  readonly isLoading: boolean
  readonly bridgeToken: BridgeToken
  readonly tokenAddress: string
  readonly wrappedTokenAddress: string
  readonly originChainId: number
  readonly destinationChainId: number
  readonly primaryBridgeContract: any
  readonly secondaryBridgeContract: any
}

const initialState: BridgeState = {
  isLoading: false,
  tokenAddress: '0x727A401fdDb5cd6074FaF5Fa7cbd2BA7b3ae7aFd',
  wrappedTokenAddress: '',
  bridgeToken: MOCK_TOKEN,
  originChainId: 137,
  destinationChainId: 100,
  primaryBridgeContract: '',
  secondaryBridgeContract: ''
}

export default createReducer<BridgeState>(initialState, builder =>
  builder
    .addCase(selectToken, (state, action) => {
      return {
        ...state,
        bridgeToken: action.payload
      }
    })
    .addCase(setTokenAddress, (state, action) => {
      return {
        ...state,
        tokenAddress: action.payload.tokenAddress
      }
    })
    .addCase(setWrappedTokenAddress, (state, action) => {
      return {
        ...state,
        tokenAddress: action.payload.tokenAddress
      }
    })
    .addCase(setDestinationChain, (state, action) => {
      return {
        ...state,
        destinationChainId: action.payload.chainId
      }
    })
    .addCase(setPrimaryBridgeContract, (state, action) => {
      return {
        ...state,
        primaryBridgeContract: action.payload.contractAddress
      }
    })
    .addCase(setSecondaryBridgeContract, (state, action) => {
      return {
        ...state,
        secondaryBridgeContract: action.payload.contractAddress
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
