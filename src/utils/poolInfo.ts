import { BALANCER_POOLS_ADDRESSES, SUSHI_POOLS_ADDRESSES, UNI_POOLS_ADDRESSES } from 'constants/pools'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'

export type PoolIdAddressMap = {
  id: number
  address: string
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

export const groupByPoolProvider = (addresses: string[]) => {
  const balancerPools: PoolIdAddressMap[] = []
  const uniPools: PoolIdAddressMap[] = []
  const sushiPools: PoolIdAddressMap[] = []

  addresses.forEach((address, id) => {
    if (isBalancerPool(address)) {
      balancerPools.push({ id, address })
    } else if (isUniPool(address)) {
      uniPools.push({ id, address })
    } else if (isSushiPool(address)) {
      sushiPools.push({ id, address })
    }
  })

  return {
    balancer: balancerPools,
    uni: uniPools,
    sushi: sushiPools
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

  return 'LPT'
}

export const getPoolLiquidity = (poolInfo: PoolInfo, tokenPrice: TokenPrice) => {
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
