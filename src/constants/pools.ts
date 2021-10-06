/**
 * Hardcoded SUSHI pool addresses
 */

// ETH Mainnet
export const SUSHI_RNBW_ETH_ADDRESS = '0xdb30d3f9b55bd57271d171fec708b575aa940082'

// BSC Testnet
export const SUSHI_BUSD_BNB_ADDRESS = '0x71e3c96C21D734bFA64D652EA99611Aa64F7D9F6'
export const SUSHI_BUSD_XSGD_ADDRESS = '0x9A0eeceDA5c0203924484F5467cEE4321cf6A189'
export const BUSD_TOKEN_ADDRESS = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'
export const BNB_TOKEN_ADDRESS = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
export const XSGD_TOKEN_ADDRESS = '0x979b00492a1cbf691b1fae867936c01bab0b8c4d'

// Matic Testnet
export const SUSHI_XSGD_ADDRESS = '0xDbcc6EA9C5C2B62f6226a99B1E0EC089B0927a59'

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
