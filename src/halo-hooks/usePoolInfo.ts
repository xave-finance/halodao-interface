import { Token } from '@sushiswap/sdk'
import { useCallback } from 'react'
import { groupByPoolProvider } from 'utils/poolInfo'
import { useBalancerPoolInfo } from './useBalancerPoolInfo'
import { useHaloPoolInfo } from './useHaloPoolInfo'
import { useSushiPoolInfo } from './useSushiPoolInfo'
import { useUniPoolInfo } from './useUniPoolInfo'

export enum PoolProvider {
  Balancer,
  Uni,
  Sushi,
  Halo
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
  const { balancer, uni, sushi, halo } = groupByPoolProvider(lpTokenAddresses)
  const fetchBalancerPoolInfo = useBalancerPoolInfo(balancer)
  const fetchSushiPoolInfo = useSushiPoolInfo(sushi)
  const fetchUniPoolInfo = useUniPoolInfo(uni)
  const fetchHaloPoolInfo = useHaloPoolInfo(halo)

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

    if (halo.length) {
      const haloResult = await fetchHaloPoolInfo()
      poolsInfo = [...poolsInfo, ...haloResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...haloResult.tokenAddresses]
    }

    return { poolsInfo, tokenAddresses }
  }, [balancer, uni, sushi, fetchBalancerPoolInfo, fetchSushiPoolInfo, fetchUniPoolInfo, fetchHaloPoolInfo])
}
