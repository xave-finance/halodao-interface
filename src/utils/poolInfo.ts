import { BALANCER_POOLS_ADDRESSES, SUSHI_POOLS_ADDRESSES, UNI_POOLS_ADDRESSES } from 'constants/pools'

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
