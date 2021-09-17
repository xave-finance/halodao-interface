import {
  BALANCER_POOLS_ADDRESSES,
  DOUBLE_ESTIMATE_POOLS,
  INACTIVE_POOLS,
  LIQUIDITY_POOLS_ADDRESSES,
  LIQUIDITY_POOLS_ADDRESSES_MATIC,
  SUSHI_POOLS_ADDRESSES,
  UNI_POOLS_ADDRESSES
} from 'constants/pools'
import { PoolInfo, PoolProvider } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import { getAddress } from 'ethers/lib/utils'
import { ChainId } from '@sushiswap/sdk'

export type PoolIdLpTokenMap = {
  pid: number
  lpToken: string
}

const isBalancerPool = (address: string) => {
  return BALANCER_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isUniPool = (address: string) => {
  return UNI_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isSushiPool = (address: string) => {
  return SUSHI_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isHaloPool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.MATIC) {
    return LIQUIDITY_POOLS_ADDRESSES_MATIC.includes(address.toLocaleLowerCase())
  }
  return LIQUIDITY_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isInactivePool = (address: string) => {
  return INACTIVE_POOLS.includes(address.toLocaleLowerCase())
}

export const groupByPoolProvider = (addresses: string[], chainId: ChainId | undefined) => {
  const balancerPools: PoolIdLpTokenMap[] = []
  const uniPools: PoolIdLpTokenMap[] = []
  const sushiPools: PoolIdLpTokenMap[] = []
  const haloPools: PoolIdLpTokenMap[] = []

  for (const [pid, address] of addresses.entries()) {
    if (address) {
      if (isBalancerPool(address)) {
        balancerPools.push({ pid, lpToken: getAddress(address) })
      } else if (isUniPool(address)) {
        uniPools.push({ pid, lpToken: getAddress(address) })
      } else if (isSushiPool(address)) {
        sushiPools.push({ pid, lpToken: getAddress(address) })
      } else if (isHaloPool(address, chainId)) {
        haloPools.push({ pid, lpToken: getAddress(address) })
      }
    }
  }

  return {
    balancer: balancerPools,
    uni: uniPools,
    sushi: sushiPools,
    halo: haloPools
  }
}

export const tokenSymbolForPool = (address: string) => {
  if (isBalancerPool(address)) {
    return 'BPT'
  } else if (isUniPool(address)) {
    return 'UNI-V2'
  } else if (isSushiPool(address)) {
    return 'SLP'
  }

  return 'HLP'
}

export const getPoolLiquidity = (poolInfo: PoolInfo, tokenPrice: TokenPrice) => {
  // No need to compute for $ liquidity if a HALO pool
  if (poolInfo.provider === PoolProvider.Halo) {
    return poolInfo.liquidity
  }

  let sumWeight = 0
  let sumValue = 0
  // console.log(`Calculating liquidity for: ${poolInfo.pair}...`)
  // console.log('PoolInfo: ', poolInfo)
  for (const tokenInfo of poolInfo.tokens) {
    const price = tokenPrice[tokenInfo.address]
    if (!price) {
      continue
    }
    sumWeight += tokenInfo.weightPercentage / 100
    sumValue += price * tokenInfo.balance
    // console.log('SUM weight, value: ', sumWeight, sumValue)
  }
  // console.log('FINAL SUM weight, value: ', sumWeight, sumValue)
  if (sumWeight > 0) {
    // console.log('Returned calculated value: ', sumValue / sumWeight)
    return sumValue / sumWeight
  } else {
    // console.log('Returned balancer data: ', poolInfo.liquidity)
    return poolInfo.liquidity
  }
}

export const groupPoolsInfo = (poolInfos: PoolInfo[]) => {
  const activePools: PoolInfo[] = []
  const inactivePools: PoolInfo[] = []

  for (const poolInfo of poolInfos) {
    if (isInactivePool(poolInfo.asToken.address)) {
      inactivePools.push(poolInfo)
    } else {
      activePools.push(poolInfo)
    }
  }

  return {
    activePools,
    inactivePools
  }
}

export const isDoubleEstimatePool = (address: string) => {
  return DOUBLE_ESTIMATE_POOLS.includes(address.toLocaleLowerCase())
}
