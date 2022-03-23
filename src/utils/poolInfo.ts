import {
  BALANCER_POOLS_ADDRESSES,
  BALANCER_POOLS_ADDRESSES_KOVAN,
  DOUBLE_ESTIMATE_POOLS,
  DOUBLE_ESTIMATE_POOLS_KOVAN,
  DOUBLE_ESTIMATE_POOLS_MATIC,
  INACTIVE_POOLS,
  INACTIVE_POOLS_MATIC,
  INACTIVE_POOLS_KOVAN,
  LIQUIDITY_POOLS_ADDRESSES,
  LIQUIDITY_POOLS_ADDRESSES_KOVAN,
  LIQUIDITY_POOLS_ADDRESSES_MATIC,
  SUSHI_POOLS_ADDRESSES,
  SUSHI_POOLS_ADDRESSES_KOVAN,
  UNI_POOLS_ADDRESSES,
  UNI_POOLS_ADDRESSES_KOVAN,
  SUSHI_POOLS_ADDRESSES_MATIC,
  INACTIVE_POOLS_ARB,
  INACTIVE_POOLS_ARB_RINKEBY,
  LIQUIDITY_POOLS_ADDRESSES_ARB,
  LIQUIDITY_POOLS_ADDRESSES_ARB_RINKEBY
} from 'constants/pools'
import { PoolInfo, PoolProvider } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import { getAddress } from 'ethers/lib/utils'
import { ChainId } from '@halodao/sdk'

export type PoolIdLpTokenMap = {
  pid: number
  lpToken: string
}

const isBalancerPool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.KOVAN) {
    return BALANCER_POOLS_ADDRESSES_KOVAN.includes(address.toLocaleLowerCase())
  }
  return BALANCER_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isUniPool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.KOVAN) {
    return UNI_POOLS_ADDRESSES_KOVAN.includes(address.toLocaleLowerCase())
  }
  return UNI_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isSushiPool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.MATIC) {
    return SUSHI_POOLS_ADDRESSES_MATIC.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.KOVAN) {
    return SUSHI_POOLS_ADDRESSES_KOVAN.includes(address.toLocaleLowerCase())
  }
  return SUSHI_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

const isHaloPool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.MATIC) {
    return LIQUIDITY_POOLS_ADDRESSES_MATIC.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.KOVAN) {
    return LIQUIDITY_POOLS_ADDRESSES_KOVAN.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.ARBITRUM) {
    return LIQUIDITY_POOLS_ADDRESSES_ARB.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.ARBITRUM_TESTNET) {
    return LIQUIDITY_POOLS_ADDRESSES_ARB_RINKEBY.includes(address.toLocaleLowerCase())
  }
  return LIQUIDITY_POOLS_ADDRESSES.includes(address.toLocaleLowerCase())
}

export const isInactivePool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.MATIC) {
    return INACTIVE_POOLS_MATIC.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.KOVAN) {
    return INACTIVE_POOLS_KOVAN.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.ARBITRUM) {
    return INACTIVE_POOLS_ARB.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.ARBITRUM_TESTNET) {
    return INACTIVE_POOLS_ARB_RINKEBY.includes(address.toLocaleLowerCase())
  }
  return INACTIVE_POOLS.includes(address.toLocaleLowerCase())
}

export const groupByPoolProvider = (addresses: string[], chainId: ChainId | undefined) => {
  const balancerPools: PoolIdLpTokenMap[] = []
  const uniPools: PoolIdLpTokenMap[] = []
  const sushiPools: PoolIdLpTokenMap[] = []
  const haloPools: PoolIdLpTokenMap[] = []

  for (const [pid, address] of addresses.entries()) {
    if (address) {
      if (isBalancerPool(address, chainId)) {
        balancerPools.push({ pid, lpToken: getAddress(address) })
      } else if (isUniPool(address, chainId)) {
        uniPools.push({ pid, lpToken: getAddress(address) })
      } else if (isSushiPool(address, chainId)) {
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

export const tokenSymbolForPool = (address: string, chainId: ChainId | undefined) => {
  if (isBalancerPool(address, chainId)) {
    return 'BPT'
  } else if (isUniPool(address, chainId)) {
    return 'UNI-V2'
  } else if (isSushiPool(address, chainId)) {
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

  for (const tokenInfo of poolInfo.tokens) {
    const price = tokenPrice[tokenInfo.mainnetAddress]
    if (!price) {
      continue
    }
    sumWeight += tokenInfo.weightPercentage / 100
    sumValue += price * tokenInfo.balance
  }

  if (sumWeight > 0) {
    return sumValue / sumWeight
  } else {
    return poolInfo.liquidity
  }
}

export const groupPoolsInfo = (poolInfos: PoolInfo[], chainId: ChainId | undefined) => {
  const activePools: PoolInfo[] = []
  const inactivePools: PoolInfo[] = []

  for (const poolInfo of poolInfos) {
    if (isInactivePool(poolInfo.asToken.address, chainId)) {
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

export const isDoubleEstimatePool = (address: string, chainId: ChainId | undefined) => {
  if (chainId === ChainId.MATIC) {
    return DOUBLE_ESTIMATE_POOLS_MATIC.includes(address.toLocaleLowerCase())
  } else if (chainId === ChainId.KOVAN) {
    return DOUBLE_ESTIMATE_POOLS_KOVAN.includes(address.toLocaleLowerCase())
  }
  return DOUBLE_ESTIMATE_POOLS.includes(address.toLocaleLowerCase())
}
