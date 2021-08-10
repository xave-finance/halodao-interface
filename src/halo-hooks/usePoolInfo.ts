import { Token } from '@sushiswap/sdk'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { updatePools } from 'state/pool/actions'
import { CachedPool } from 'state/pool/reducer'
import { groupByPoolProvider } from 'utils/poolInfo'
import { useBalancerPoolInfo } from './useBalancerPoolInfo'
import { useSushiPoolInfo } from './useSushiPoolInfo'
import { useUniPoolInfo } from './useUniPoolInfo'

export enum PoolProvider {
  Balancer,
  Uni,
  Sushi
}

export type PoolInfo = {
  pid: number
  pair: string
  address: string
  addLiquidityUrl: string
  liquidity: number
  tokens: PoolTokenInfo[]
  asToken: Token
  allocPoint: number
  provider: PoolProvider
}

export type PoolTokenInfo = {
  address: string
  balance: number
  weightPercentage: number
  asToken: Token
}

export const usePoolInfo = (lpTokenAddresses: string[]) => {
  const { balancer, uni, sushi } = groupByPoolProvider(lpTokenAddresses)
  const fetchBalancerPoolInfo = useBalancerPoolInfo(balancer)
  const fetchSushiPoolInfo = useSushiPoolInfo(sushi)
  const fetchUniPoolInfo = useUniPoolInfo(uni)

  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    let poolsInfo: PoolInfo[] = []
    let tokenAddresses: string[] = []

    if (balancer.length) {
      const balancerResult = await fetchBalancerPoolInfo()
      poolsInfo = [...poolsInfo, ...balancerResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...balancerResult.tokenAddresses]
    }

    if (sushi.length) {
      const sushiResult = await fetchSushiPoolInfo()
      poolsInfo = [...poolsInfo, ...sushiResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...sushiResult.tokenAddresses]
    }

    if (uni.length) {
      const uniResult = await fetchUniPoolInfo()
      poolsInfo = [...poolsInfo, ...uniResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...uniResult.tokenAddresses]
    }

    // Store pools info to app cache
    const pools: CachedPool[] = []
    for (const poolInfo of poolsInfo) {
      pools.push({
        pid: poolInfo.pid,
        lpTokenAddress: poolInfo.address
      })
    }
    dispatch(updatePools(pools))

    return { poolsInfo, tokenAddresses }
  }, [balancer, uni, sushi, fetchBalancerPoolInfo, fetchSushiPoolInfo, fetchUniPoolInfo, dispatch])
}
