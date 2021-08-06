import { createAction, ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { retrieveBridgeContract } from './BridgeAPI'

export const selectToken = createAction<{ tokenName: string; tokenAddress: string }>('bridge/selectToken')
export const selectOriginChain = createAction<{ chainId: number }>('bridge/selectOriginChain')
export const selectDestinationChain = createAction<{ chainId: number }>('bridge/selectDestinationChain')
export const setPrimaryBridgeContract = createAction<{ contractAddress: string }>('bridge/setPrimaryBridgeContract')

export const fetchBridgeContract: Readonly<{
  pending: ActionCreatorWithPayload<{ tokenAddress: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{ tokenAddress: string; bridgeContract: string; requestId: string }>
  rejected: ActionCreatorWithPayload<{ tokenAddress: string; error: string; requestId: string }>
}> = {
  pending: createAction('bridge/fetchBridgeContract/pending'),
  fulfilled: createAction('bridge/fetchBridgeContract/fulfilled'),
  rejected: createAction('bridge/fetchBridgeContract/rejected')
}
