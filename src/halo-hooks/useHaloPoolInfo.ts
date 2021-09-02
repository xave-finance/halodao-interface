import { useCallback } from 'react'
import { PoolIdLpTokenMap } from 'utils/poolInfo'
import { PoolInfo } from './usePoolInfo'

export const useHaloPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const fetchPoolInfo = useCallback(() => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []
    return { poolsInfo, tokenAddresses }
  }, [pidLpTokenMap])

  return fetchPoolInfo
}
