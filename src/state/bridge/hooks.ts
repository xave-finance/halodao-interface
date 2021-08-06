import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { fetchBridgeContract } from './actions'
import { AppDispatch } from '../'
import { retrieveBridgeContract } from './BridgeAPI'

export function useFetchBridgeCallback(): (tokenAddress: string, chainId: number) => Promise<any> {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    async (tokenAddress: string, chainId: number) => {
      const requestId = nanoid()
      dispatch(fetchBridgeContract.pending({ requestId, tokenAddress }))
      return retrieveBridgeContract(tokenAddress, chainId)
        .then(bridgeContract => {
          dispatch(fetchBridgeContract.fulfilled({ requestId, tokenAddress, bridgeContract: bridgeContract.data }))
        })
        .catch(e => {
          console.error(e)
          dispatch(fetchBridgeContract.rejected({ requestId, tokenAddress, error: e.message }))
        })
    },
    [dispatch]
  )
}
