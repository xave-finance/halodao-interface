import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@sushiswap/sdk'

const RPC = {
  [ChainId.MAINNET]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY_MAINNET}`,
  [ChainId.ROPSTEN]: `https://eth-ropsten.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY_ROPSTEN}`,
  [ChainId.RINKEBY]: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY_RINKEBY}`,
  [ChainId.GÖRLI]: `https://eth-goerli.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY_GOERLI}`,
  [ChainId.KOVAN]: `https://eth-kovan.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY_KOVAN}`,
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBASE]: 'https://rpc.testnet.moonbeam.network'
}

// Use uniswap's infura URL for local development to prevent 403 error
if (process.env.NODE_ENV === 'development') {
  RPC[ChainId.MAINNET] = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
}

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    3, // ropsten
    4, // rinkeby
    5, // goreli
    42, // kovan
    250, // fantom
    4002, // fantom testnet
    137, // matic
    80001, // matic testnet
    100, // xdai
    56, // binance smart chain
    97, // binance smart chain testnet
    1287 // moonbase
  ]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: {
    [ChainId.MAINNET]: RPC[ChainId.MAINNET]
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const lattice = new LatticeConnector({
  chainId: 1,
  url: RPC[ChainId.MAINNET],
  appName: 'SushiSwap'
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.REACT_APP_PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[ChainId.MAINNET],
  appName: 'SushiSwap',
  appLogoUrl: 'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png'
})
