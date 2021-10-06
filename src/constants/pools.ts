/**
 * Known pool addresses per provider (balancer, uni, sushi)
 */

const balancerPools = process.env.REACT_APP_BALANCER_POOLS_ADDRESSES || ''
const balancerPoolsAddresses = balancerPools !== '' ? balancerPools.split(',').map(a => a.toLowerCase()) : []
const balancerPoolsKovan = process.env.REACT_APP_BALANCER_POOLS_ADDRESSES_KOVAN || ''
const balancerPoolsAddressesKovan =
  balancerPoolsKovan !== '' ? balancerPoolsKovan.split(',').map(a => a.toLowerCase()) : []

const uniPools = process.env.REACT_APP_UNI_POOLS_ADDRESSES || ''
const uniPoolsAddresses = uniPools !== '' ? uniPools.split(',').map(a => a.toLowerCase()) : []
const uniPoolsKovan = process.env.REACT_APP_UNI_POOLS_ADDRESSES_KOVAN || ''
const uniPoolsAddressesKovan = uniPoolsKovan !== '' ? uniPoolsKovan.split(',').map(a => a.toLowerCase()) : []

const sushiPools = process.env.REACT_APP_SUSHI_POOLS_ADDRESSES || ''
const sushiPoolsAddresses = sushiPools !== '' ? sushiPools.split(',').map(a => a.toLowerCase()) : []
const sushiPoolsMatic = process.env.REACT_APP_SUSHI_POOLS_ADDRESSES_MATIC || ''
const sushiPoolsAddressesMatic = sushiPoolsMatic !== '' ? sushiPoolsMatic.split(',').map(a => a.toLowerCase()) : []
const sushiPoolsKovan = process.env.REACT_APP_SUSHI_POOLS_ADDRESSES_KOVAN || ''
const sushiPoolsAddressesKovan = sushiPoolsKovan !== '' ? sushiPoolsKovan.split(',').map(a => a.toLowerCase()) : []

const liquidityPools = process.env.REACT_APP_LIQUIDITY_POOL_ADDRESSES || ''
const liquidityPoolsAddresses = liquidityPools !== '' ? liquidityPools.split(',').map(a => a.toLowerCase()) : []
const liquidityPoolsMatic = process.env.REACT_APP_LIQUIDITY_POOL_ADDRESSES_MATIC || ''
const liquidityPoolsAddressesMatic =
  liquidityPoolsMatic !== '' ? liquidityPoolsMatic.split(',').map(a => a.toLowerCase()) : []
const liquidityPoolsKovan = process.env.REACT_APP_LIQUIDITY_POOL_ADDRESSES_KOVAN || ''
const liquidityPoolsAddressesKovan =
  liquidityPoolsKovan !== '' ? liquidityPoolsKovan.split(',').map(a => a.toLowerCase()) : []

export const BALANCER_POOLS_ADDRESSES = balancerPoolsAddresses
export const BALANCER_POOLS_ADDRESSES_KOVAN = balancerPoolsAddressesKovan
export const UNI_POOLS_ADDRESSES = uniPoolsAddresses
export const UNI_POOLS_ADDRESSES_KOVAN = uniPoolsAddressesKovan
export const SUSHI_POOLS_ADDRESSES = sushiPoolsAddresses
export const SUSHI_POOLS_ADDRESSES_KOVAN = sushiPoolsAddressesKovan
export const SUSHI_POOLS_ADDRESSES_MATIC = sushiPoolsAddressesMatic
export const LIQUIDITY_POOLS_ADDRESSES = liquidityPoolsAddresses
export const LIQUIDITY_POOLS_ADDRESSES_MATIC = liquidityPoolsAddressesMatic
export const LIQUIDITY_POOLS_ADDRESSES_KOVAN = liquidityPoolsAddressesKovan

/**
 * Balancer lpToken -> poolAddress mapping
 *
 * REACT_APP_BALANCER_LPTOKEN_POOL_MAP format:
 * <lpToken0>:<poolAddress0>,<lpToken1>:<poolAddress1>...
 */

const rawLpTokenPoolMap = process.env.REACT_APP_BALANCER_LPTOKEN_POOL_MAP || ''
const rawLpTokenPoolMapList = rawLpTokenPoolMap === '' ? [] : rawLpTokenPoolMap.split(',')
const lpTokenPoolMap: { [key: string]: string } = {}

rawLpTokenPoolMapList.forEach(rawLpTokenPool => {
  const elems = rawLpTokenPool.split(':')
  if (elems.length > 1) {
    lpTokenPoolMap[elems[0].toLowerCase()] = elems[1].toLowerCase()
  }
})

export const BALANCER_LPTOKEN_POOL_MAP = lpTokenPoolMap

const rawLpTokenPoolMapKovan = process.env.REACT_APP_BALANCER_LPTOKEN_POOL_MAP || ''
const rawLpTokenPoolMapListKovan = rawLpTokenPoolMapKovan === '' ? [] : rawLpTokenPoolMapKovan.split(',')
const lpTokenPoolMapKovan: { [key: string]: string } = {}

rawLpTokenPoolMapListKovan.forEach(rawLpTokenPool => {
  const elems = rawLpTokenPool.split(':')
  if (elems.length > 1) {
    lpTokenPoolMapKovan[elems[0].toLowerCase()] = elems[1].toLowerCase()
  }
})

export const BALANCER_LPTOKEN_POOL_MAP_KOVAN = lpTokenPoolMapKovan

/**
 * Misc
 */
export const PENDING_REWARD_FAILED = -99999

/**
 * Inactive pools
 */

const inactivePoolsRaw = process.env.REACT_APP_INACTIVE_POOLS || ''
const inactivePools = inactivePoolsRaw !== '' ? inactivePoolsRaw.split(',').map(a => a.toLowerCase()) : []
const inactivePoolsRawMatic = process.env.REACT_APP_INACTIVE_POOLS_MATIC || ''
const inactivePoolsMatic =
  inactivePoolsRawMatic !== '' ? inactivePoolsRawMatic.split(',').map(a => a.toLowerCase()) : []
const inactivePoolsRawKovan = process.env.REACT_APP_INACTIVE_POOLS_KOVAN || ''
const inactivePoolsKovan =
  inactivePoolsRawKovan !== '' ? inactivePoolsRawKovan.split(',').map(a => a.toLowerCase()) : []

export const INACTIVE_POOLS = inactivePools
export const INACTIVE_POOLS_MATIC = inactivePoolsMatic
export const INACTIVE_POOLS_KOVAN = inactivePoolsKovan

/**
 * Double estimate pools
 * Curves that produce double estimates on viewDeposit()
 */

const doubleEstimatePoolsRaw = process.env.REACT_APP_DOUBLE_ESTIMATE_POOLS || ''
const doubleEstimatePools =
  doubleEstimatePoolsRaw !== '' ? doubleEstimatePoolsRaw.split(',').map(a => a.toLowerCase()) : []
const doubleEstimatePoolsRawMatic = process.env.REACT_APP_DOUBLE_ESTIMATE_POOLS_MATIC || ''
const doubleEstimatePoolsMatic =
  doubleEstimatePoolsRawMatic !== '' ? doubleEstimatePoolsRawMatic.split(',').map(a => a.toLowerCase()) : []
const doubleEstimatePoolsRawKovan = process.env.REACT_APP_DOUBLE_ESTIMATE_POOLS_KOVAN || ''
const doubleEstimatePoolsKovan =
  doubleEstimatePoolsRawKovan !== '' ? doubleEstimatePoolsRawKovan.split(',').map(a => a.toLowerCase()) : []

export const DOUBLE_ESTIMATE_POOLS = doubleEstimatePools
export const DOUBLE_ESTIMATE_POOLS_MATIC = doubleEstimatePoolsMatic
export const DOUBLE_ESTIMATE_POOLS_KOVAN = doubleEstimatePoolsKovan
