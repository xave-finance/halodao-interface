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
const liquidityPoolsArb = process.env.REACT_APP_LIQUIDITY_POOL_ADDRESSES_ARB || ''
const liquidityPoolsAddressesArb =
  liquidityPoolsArb !== '' ? liquidityPoolsArb.split(',').map(a => a.toLowerCase()) : []
const liquidityPoolsArbRinkeby = process.env.REACT_APP_LIQUIDITY_POOL_ADDRESSES_ARB_RINKEBY || ''
const liquidityPoolsAddressesArbRinkeby =
  liquidityPoolsArbRinkeby !== '' ? liquidityPoolsArbRinkeby.split(',').map(a => a.toLowerCase()) : []

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
export const LIQUIDITY_POOLS_ADDRESSES_ARB = liquidityPoolsAddressesArb
export const LIQUIDITY_POOLS_ADDRESSES_ARB_RINKEBY = liquidityPoolsAddressesArbRinkeby

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
const inactivePoolsRawArb = process.env.REACT_APP_INACTIVE_POOLS_ARB || ''
const inactivePoolsArb = inactivePoolsRawArb !== '' ? inactivePoolsRawArb.split(',').map(a => a.toLowerCase()) : []
const inactivePoolsRawArbRinkeby = process.env.REACT_APP_INACTIVE_POOLS_ARB_RINKEBY || ''
const inactivePoolsArbRinkeby =
  inactivePoolsRawArbRinkeby !== '' ? inactivePoolsRawArbRinkeby.split(',').map(a => a.toLowerCase()) : []

export const INACTIVE_POOLS = inactivePools
export const INACTIVE_POOLS_MATIC = inactivePoolsMatic
export const INACTIVE_POOLS_KOVAN = inactivePoolsKovan
export const INACTIVE_POOLS_ARB = inactivePoolsArb
export const INACTIVE_POOLS_ARB_RINKEBY = inactivePoolsArbRinkeby

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

// NOTE: add the pool address and its first deposit tx here for other chain
export const DEPOSIT_TXHASH: Record<string, string> = {
  '0x64dcbdeb83e39f152b7faf83e5e5673faca0d42a': '0xead0a9717cb13feff2ee58d78786b7b2eac68eafe61809d7bfecf67986222ba8', // xSGD:USDC mainnet
  '0xe15e50ff9d52bec41d53d3173f2ed40834d455f4': '0x6038346288968a18c766987b8a7811a2df17a25316edeb23800bb2125ba5902f', // TCAD:USDC mainnet
  // '0x2ed09e2961d72659e4002ba8c2badfedc7db19b7': '0xe1ba04f32987d607980ad89260942e16642ea74b23f1175a06dbc90ad0a30f28', // TGBP:USDC mainnet
  '0x20e1d8daf58358cf11be5616946e1df55f1ef8b0': '0x6dc4b1c61c00004c85ec953a0d00bd680bb42109977fb19bf4f4cfa7382910dc', // fxPHP:USDC mainnet
  '0x868084406449bda10a5bd556fb33cef5086b0797': '0xa605e6a3bf8c64b1a9f3e835dda1e61a77027789a6bde64dab43f91657d29081', // UST:USDC mainnet
  '0x8123c64d6607412c7ac9e880f12245ef22558b14': '0x1baa65bca924e1a189ae68c0a57768d49f17e661de231566a2236383663f3fc7', // xSGD:USDC matic
  '0x6156f030b877344470bac075a708d7e27602cc17': '0xafb8144ceea36323878efa628cbfcd41a01e91d931a61edb771d912fe2173920', // tagPHP:USDC matic
  '0x90b48bb20048786b167473dfeec443142d043cf7': '0xfcd8f45dd905646eea3e1f237bd6cc6f46ba30984a051ebc8817918e67fee7a8', // tagPHP:USDC arbitrum
  '0xd5ad9eed5c5f28d83933779cd7e677e112991f51': '0x87a70c2da9a0ffb2c2caae7f94820f8d07eeb031472dda03968f055665cbf18d' // fxAUD:USDC arbitrum
}

export const TRANSFER_EVENT_HASH = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
