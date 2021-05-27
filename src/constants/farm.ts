import { ChainId } from '@sushiswap/sdk'

type ChainAdressesMap = {
  readonly [chainId in ChainId]?: string[]
}

const poolAddressesMainnet = (process.env.REACT_APP_POOL_ADDRESSES_MAINNET || '').split(',')
const poolAddressesKovan = (process.env.REACT_APP_POOL_ADDRESSES_KOVAN || '').split(',')
const poolAddressesGoerli = (process.env.REACT_APP_POOL_ADDRESSES_GOERLI || '').split(',')
const poolAddressesMatic = (process.env.REACT_APP_POOL_ADDRESSES_MATIC || '').split(',')
const poolAddressesBSC = (process.env.REACT_APP_POOL_ADDRESSES_BSC || '').split(',')
const poolAddressesBSCTestnet = (process.env.REACT_APP_POOL_ADDRESSES_BSC_TESTNET || '').split(',')
const poolAddressesMoonbase = (process.env.REACT_APP_POOL_ADDRESSES_MOONBASE || '').split(',')

export const POOL_ADDRESSES: ChainAdressesMap = {
  [ChainId.MAINNET]: poolAddressesMainnet,
  [ChainId.KOVAN]: poolAddressesKovan,
  [ChainId.GÖRLI]: poolAddressesGoerli,
  [ChainId.MATIC]: poolAddressesMatic,
  [ChainId.BSC]: poolAddressesBSC,
  [ChainId.BSC_TESTNET]: poolAddressesBSCTestnet,
  [ChainId.MOONBASE]: poolAddressesMoonbase
}
