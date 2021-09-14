import Arbitrum from '../assets/networks/arbitrum-network.jpg'
//import Avalanche from '../assets/networks/avalanche-network.jpg'
import Bsc from '../assets/networks/bsc-network.jpg'
import { ChainId } from '@sushiswap/sdk'
import Fantom from '../assets/networks/fantom-network.jpg'
import Goerli from '../assets/networks/goerli-network.jpg'
// import Harmony from '../assets/networks/harmonyone-network.jpg'
// import Heco from '../assets/networks/heco-network.jpg'
import Kovan from '../assets/networks/kovan-network.jpg'
import Mainnet from '../assets/networks/mainnet-network.jpg'
import Matic from '../assets/networks/matic-network.jpg'
import Moonbeam from '../assets/networks/moonbeam-network.jpg'
//import OKEx from '../assets/networks/okex-network.jpg'
import Polygon from '../assets/networks/polygon-network.jpg'
import Rinkeby from '../assets/networks/rinkeby-network.jpg'
import Ropsten from '../assets/networks/ropsten-network.jpg'
import xDai from '../assets/networks/xdai-network.jpg'

export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.GÖRLI]: Goerli,
  [ChainId.KOVAN]: Kovan,
  [ChainId.FANTOM]: Fantom,
  [ChainId.FANTOM_TESTNET]: Fantom,
  [ChainId.BSC]: Bsc,
  [ChainId.BSC_TESTNET]: Bsc,
  [ChainId.MATIC]: Polygon,
  [ChainId.MATIC_TESTNET]: Matic,
  [ChainId.XDAI]: xDai,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.MOONBASE]: Moonbeam
  //[ChainId.AVALANCHE]: Avalanche,
  //[ChainId.FUJI]: Avalanche,
  //[ChainId.HECO]: Heco,
  //[ChainId.HECO_TESTNET]: Heco,
  //[ChainId.HARMONY]: Harmony,
  //[ChainId.HARMONY_TESTNET]: Harmony,
  //[ChainId.OKEX]: OKEx,
  //[ChainId.OKEX_TESTNET]: OKEx
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  //[ChainId.FANTOM]: 'Fantom',
  //[ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  [ChainId.MATIC]: 'Polygon (Matic)',
  [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  [ChainId.XDAI]: 'xDai',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.MOONBASE]: 'Moonbase'
  //[ChainId.AVALANCHE]: 'Avalanche',
  //[ChainId.FUJI]: 'Fuji',
  //[ChainId.HECO]: 'HECO',
  //[ChainId.HECO_TESTNET]: 'HECO Testnet',
  //[ChainId.HARMONY]: 'Harmony',
  //[ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
  //[ChainId.OKEX]: 'OKEx',
  //[ChainId.OKEX_TESTNET]: 'OKEx'
}

export const NETWORK_PARAMS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  /*
  [ChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  */
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic(Polygon) Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'], // see https://docs.matic.network/docs/develop/network-details/network/
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  // [ChainId.HECO]: {
  //   chainId: '0x80',
  //   chainName: 'Heco',
  //   nativeCurrency: {
  //     name: 'Heco Token',
  //     symbol: 'HT',
  //     decimals: 18
  //   },
  //   rpcUrls: ['https://http-mainnet.hecochain.com'],
  //   blockExplorerUrls: ['https://hecoinfo.com']
  // },
  [ChainId.XDAI]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai Token',
      symbol: 'xDai',
      decimals: 18
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet']
  },
  [ChainId.MOONBASE]: {
    chainId: '0x507',
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
      name: 'Dev',
      symbol: 'DEV',
      decimals: 18
    },
    rpcUrls: ['https://rpc.testnet.moonbeam.network'], //['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ['https://moonbase-blockscout.testnet.moonbeam.network']
  }
  /*
    [ChainId.HARMONY]: {
        chainId: '0x63564C40',
        chainName: 'Harmony One',
        nativeCurrency: {
            name: 'One Token',
            symbol: 'ONE',
            decimals: 18
        },
        rpcUrls: ['https://api.s0.t.hmny.io'],
        blockExplorerUrls: ['https://explorer.harmony.one/']
    },
    [ChainId.AVALANCHE]: {
        chainId: '0xA86A',
        chainName: 'Avalanche',
        nativeCurrency: {
            name: 'Avalanche Token',
            symbol: 'AVAX',
            decimals: 18
        },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://explorer.avax.network']
    },
    [ChainId.OKEX]: {
        chainId: '0x42',
        chainName: 'OKEx',
        nativeCurrency: {
            name: 'OKEx Token',
            symbol: 'OKT',
            decimals: 18
        },
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain']
    }
    */
}

export const NETWORK_SUPPORTED_FEATURES: {
  [chainId in ChainId]?: {
    vest: boolean
    farm: boolean
    pool: boolean
    swap: boolean
    lend: boolean
    borrow: boolean
    bridge: boolean
    bridgeCap: boolean
  }
} = {
  [ChainId.MAINNET]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: true,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.KOVAN]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.RINKEBY]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.GÖRLI]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.MATIC]: {
    vest: false,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: true,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.MATIC_TESTNET]: {
    vest: false,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.BSC]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.BSC_TESTNET]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  },
  [ChainId.XDAI]: {
    vest: true,
    farm: true,
    pool: true,
    swap: true,
    lend: true,
    borrow: true,
    bridge: false,
    bridgeCap: Boolean(process.env.BRIDGE_CAP as string) || true
  }
}
