import { createAction, ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { retrieveBridgeContract } from './BridgeAPI'
import { BridgeToken } from 'constants/bridge'

export const selectToken = createAction<BridgeToken>('bridge/selectToken')
export const setTokenAddress = createAction<{ tokenAddress: string }>('bridge/setTokenAddress')
export const setDestinationChain = createAction<{ chainId: number }>('bridge/selectDestinationChain')
export const setWrappedTokenAddress = createAction<{ tokenAddress: string }>('bridge/setWrappedTokenAddress')
export const setPrimaryBridgeContract = createAction<{ contractAddress: string }>('bridge/setPrimaryBridgeContract')
export const setSecondaryBridgeContract = createAction<{ contractAddress: string }>('bridge/setSecondaryBridgeContract')

export const fetchBridgeContract: Readonly<{
  pending: ActionCreatorWithPayload<{ tokenAddress: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{ tokenAddress: string; bridgeContract: string; requestId: string }>
  rejected: ActionCreatorWithPayload<{ tokenAddress: string; error: string; requestId: string }>
}> = {
  pending: createAction('bridge/fetchBridgeContract/pending'),
  fulfilled: createAction('bridge/fetchBridgeContract/fulfilled'),
  rejected: createAction('bridge/fetchBridgeContract/rejected')
}
