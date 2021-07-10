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
const balancerPoolsAddresses = balancerPools.split(',').map(a => a.toLowerCase())

const uniPools = process.env.REACT_APP_UNI_POOLS_ADDRESSES || ''
const uniPoolsAddresses = uniPools.split(',').map(a => a.toLowerCase())

const sushiPools = process.env.REACT_APP_SUSHI_POOLS_ADDRESSES || ''
const sushiPoolsAddresses = sushiPools.split(',').map(a => a.toLowerCase())

export const BALANCER_POOLS_ADDRESSES = balancerPoolsAddresses
export const UNI_POOLS_ADDRESSES = uniPoolsAddresses
export const SUSHI_POOLS_ADDRESSES = sushiPoolsAddresses

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

/**
 * Misc
 */
export const PENDING_REWARD_FAILED = -99999

/**
 * Inactive pools
 */

const inactivePoolsRaw = process.env.REACT_APP_INACTIVE_POOLS || ''
export const INACTIVE_POOLS = inactivePoolsRaw.split(',').map(a => a.toLowerCase())
