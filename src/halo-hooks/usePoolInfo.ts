import { Token } from '@sushiswap/sdk'
import { useCallback } from 'react'
import { groupByPoolProvider } from 'utils/poolInfo'
import { useBalancerPoolInfo } from './useBalancerPoolInfo'
import { useAllocPoints } from './useRewards'
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

export const usePoolInfo = (poolAddresses: string[]) => {
  console.log('poolAddresses', poolAddresses)
  const { balancer, uni, sushi } = groupByPoolProvider(poolAddresses)
  const fetchBalancerPoolInfo = useBalancerPoolInfo(balancer)
  const fetchSushiPoolInfo = useSushiPoolInfo(sushi)
  const fetchUniPoolInfo = useUniPoolInfo(uni)
  const allocPoints = useAllocPoints(poolAddresses)

  return useCallback(async () => {
    let poolsInfo: PoolInfo[] = []
    let tokenAddresses: string[] = []
    console.log('bal', balancer.length)
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

    poolsInfo.forEach(poolInfo => {
      poolInfo.allocPoint = allocPoints[poolInfo.pid]
    })

    return { poolsInfo, tokenAddresses }
  }, [balancer, uni, sushi, fetchBalancerPoolInfo, fetchSushiPoolInfo, fetchUniPoolInfo, allocPoints])
}
