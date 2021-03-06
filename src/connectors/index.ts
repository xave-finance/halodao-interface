import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@halodao/sdk'

export const RPC = {
  [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.GÖRLI]: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: `https://polygon-mainnet.infura.io/v3${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.MATIC_TESTNET]: `https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBASE]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.ARBITRUM_TESTNET]: 'https://rinkeby.arbitrum.io/rpc'
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
    1287, // moonbase
    42161, // arbitrum
    421611 // arbitrum testnet
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
  appName: 'HaloDAO'
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
  appName: 'HaloDAO',
  appLogoUrl: 'https://dev.app.halodao.com/static/media/logo.4ca8f6ca.svg'
})
