import { ChainId, JSBI, Percent, Token, WETH } from '@sushiswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected, portis, lattice, walletconnect, walletlink } from '../connectors'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

type ChainAddressMap = {
  readonly [chainId in ChainId]?: string
}

type ChainCoinGeckoIdMap = {
  readonly [chainId in ChainId]?: { [key: string]: string }
}

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const MOCK: ChainTokenMap = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS,
    18,
    'W-MK',
    'Wrapped Mocked Token'
  ),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MATIC || ZERO_ADDRESS,
    18,
    'MK',
    'Mock Token'
  ),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    process.env.REACT_APP_MOCK_TOKEN_ADDRESS_XDAI || ZERO_ADDRESS,
    18,
    'W-MK',
    'Wrapped Mock Token'
  ),
  [ChainId.BSC]: new Token(
    ChainId.BSC,
    process.env.REACT_APP_MOCK_TOKEN_ADDRESS_BSC || ZERO_ADDRESS,
    18,
    'W-MK',
    'Wrapped Mock Token'
  )
}

export const MOCK_TOKEN_ADDRESS: ChainAddressMap = {
  [ChainId.MATIC]: process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MATIC || ZERO_ADDRESS,
  [ChainId.XDAI]: process.env.REACT_APP_MOCK_TOKEN_ADDRESS_XDAI || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_MOCK_TOKEN_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MAINNET]: process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS
}

export const RIO: ChainTokenMap = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    process.env.REACT_APP_RIO_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS,
    18,
    'W-RIO',
    'Wrapped Rio Token'
  ),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    process.env.REACT_APP_RIO_TOKEN_ADDRESS_MATIC || ZERO_ADDRESS,
    18,
    'RIO',
    'Rio Token'
  ),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    process.env.REACT_APP_RIO_TOKEN_ADDRESS_XDAI || ZERO_ADDRESS,
    18,
    'W-RIO',
    'Wrapped Rio Token'
  ),
  [ChainId.BSC]: new Token(
    ChainId.BSC,
    process.env.REACT_APP_RIO_TOKEN_ADDRESS_BSC || ZERO_ADDRESS,
    18,
    'W-RIO',
    'Wrapped Rio Token'
  )
}

export const RIO_TOKEN_ADDRESS: ChainAddressMap = {
  [ChainId.MATIC]: process.env.REACT_APP_RIO_TOKEN_ADDRESS_MATIC || ZERO_ADDRESS,
  [ChainId.XDAI]: process.env.REACT_APP_RIO_TOKEN_ADDRESS_XDAI || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_RIO_TOKEN_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MAINNET]: process.env.REACT_APP_RIO_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS
}

// HALO Token Instance
export const HALO: ChainTokenMap = {
  // Mainnets
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  [ChainId.BSC]: new Token(
    ChainId.BSC,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_BSC || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  // Testnets
  [ChainId.KOVAN]: new Token(
    ChainId.KOVAN,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_KOVAN || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_RINKEBY || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  [ChainId.GÖRLI]: new Token(
    ChainId.GÖRLI,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_GOERLI || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  ),
  [ChainId.MATIC_TESTNET]: new Token(
    ChainId.MATIC_TESTNET,
    process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS,
    18,
    'RNBW',
    'RNBWToken'
  )
}

// HALO Token Addresses
export const HALO_TOKEN_ADDRESS: ChainAddressMap = {
  // Mainnets
  [ChainId.MAINNET]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MATIC]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC || ZERO_ADDRESS,
  // Testnets
  [ChainId.KOVAN]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_KOVAN || ZERO_ADDRESS,
  [ChainId.RINKEBY]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_RINKEBY || ZERO_ADDRESS,
  [ChainId.GÖRLI]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_GOERLI || ZERO_ADDRESS,
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
  [ChainId.MATIC_TESTNET]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS
}

// HALO Rewards Addresses
export const HALO_REWARDS_ADDRESS: ChainAddressMap = {
  // Mainnets
  [ChainId.MAINNET]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_MAINNET || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MATIC]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_MATIC || ZERO_ADDRESS,
  // Testnets
  [ChainId.KOVAN]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_KOVAN || ZERO_ADDRESS,
  [ChainId.RINKEBY]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_RINKEBY || ZERO_ADDRESS,
  [ChainId.GÖRLI]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_GOERLI || ZERO_ADDRESS,
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
  [ChainId.MATIC_TESTNET]: process.env.REACT_APP_HALO_REWARDS_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS
}

export const HALO_REWARDS_V1_ADDRESS: ChainAddressMap = {
  // Mainnets
  [ChainId.MAINNET]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_MAINNET || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MATIC]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_MATIC || ZERO_ADDRESS,
  // Testnets
  [ChainId.KOVAN]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_KOVAN || ZERO_ADDRESS,
  [ChainId.RINKEBY]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_RINKEBY || ZERO_ADDRESS,
  [ChainId.GÖRLI]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_GOERLI || ZERO_ADDRESS,
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
  [ChainId.MATIC_TESTNET]: process.env.REACT_APP_HALO_REWARDS_V1_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS
}

// HALO RewardsManager Addresses
export const HALO_REWARDS_MANAGER_ADDRESS: ChainAddressMap = {
  // Mainnets
  [ChainId.MAINNET]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_MAINNET || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MATIC]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_MATIC || ZERO_ADDRESS,
  // Testnets
  [ChainId.KOVAN]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_KOVAN || ZERO_ADDRESS,
  [ChainId.RINKEBY]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_RINKEBY || ZERO_ADDRESS,
  [ChainId.GÖRLI]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_GOERLI || ZERO_ADDRESS,
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
  [ChainId.MATIC_TESTNET]: process.env.REACT_APP_HALO_REWARDS_MANAGER_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS
}

// HALOHALO Addressess
export const HALOHALO_ADDRESS: ChainAddressMap = {
  // Mainnets
  [ChainId.MAINNET]: process.env.REACT_APP_HALOHALO_ADDRESS_MAINNET || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_HALOHALO_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MATIC]: process.env.REACT_APP_HALOHALO_ADDRESS_MATIC || ZERO_ADDRESS,
  // Testnets
  [ChainId.KOVAN]: process.env.REACT_APP_HALOHALO_ADDRESS_KOVAN || ZERO_ADDRESS,
  [ChainId.RINKEBY]: process.env.REACT_APP_HALOHALO_ADDRESS_RINKEBY || ZERO_ADDRESS,
  [ChainId.GÖRLI]: process.env.REACT_APP_HALOHALO_ADDRESS_GOERLI || ZERO_ADDRESS,
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_HALOHALO_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
  [ChainId.MATIC_TESTNET]: process.env.REACT_APP_HALOHALO_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS
}

export const AMM_ZAP_ADDRESS: ChainAddressMap = {
  // Mainnets
  [ChainId.MAINNET]: process.env.REACT_APP_AMM_ZAP_ADDRESS_MAINNET || ZERO_ADDRESS,
  [ChainId.BSC]: process.env.REACT_APP_AMM_ZAP_ADDRESS_BSC || ZERO_ADDRESS,
  [ChainId.MATIC]: process.env.REACT_APP_AMM_ZAP_ADDRESS_MATIC || ZERO_ADDRESS,
  // Testnets
  [ChainId.KOVAN]: process.env.REACT_APP_AMM_ZAP_ADDRESS_KOVAN || ZERO_ADDRESS,
  [ChainId.RINKEBY]: process.env.REACT_APP_AMM_ZAP_ADDRESS_RINKEBY || ZERO_ADDRESS,
  [ChainId.GÖRLI]: process.env.REACT_APP_AMM_ZAP_ADDRESS_GOERLI || ZERO_ADDRESS,
  [ChainId.BSC_TESTNET]: process.env.REACT_APP_AMM_ZAP_ADDRESS_BSC_TESTNET || ZERO_ADDRESS,
  [ChainId.MATIC_TESTNET]: process.env.REACT_APP_AMM_ZAP_ADDRESS_MATIC_MUMBAI || ZERO_ADDRESS
}

// Balancer URLs
export const BALANCER_POOL_URL = process.env.REACT_APP_BALANCER_POOL_URL || 'https://pools.balancer.exchange/#/pool'
export const BALANCER_SUBGRAPH_URL =
  process.env.REACT_APP_BALANCER_SUBGRAPH_URL ||
  'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer/graphql'

// Coingecko API URL
export const COINGECKO_API_URL = process.env.REACT_APP_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3'
export const COINGECKO_KNOWN_TOKENS: ChainCoinGeckoIdMap = {
  // Mainnets
  [ChainId.MAINNET]: {},
  [ChainId.BSC]: {},
  [ChainId.MATIC]: {},
  // Testnets
  [ChainId.KOVAN]: {
    weth: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    dai: '0x1528F3FCc26d13F7079325Fb78D9442607781c8C',
    maker: '0xef13C0c8abcaf5767160018d268f9697aE4f5375',
    'usd-coin': '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5',
    augur: '0x8c9e6c40d3402480ACE624730524fACC5482798c',
    'wrapped-bitcoin': '0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb',
    'basic-attention-token': '0x1f1f156E0317167c11Aa412E3d1435ea29Dc3cCE',
    havven: '0x86436BcE20258a6DcfE48C9512d4d49A30C4d8c4',
    aragon: '0x37f03a12241E9FD3658ad6777d289c3fb8512Bc9',
    '0x': '0xccb0F4Cf5D3F97f4a55bb5f5cA321C3ED033f244',
    halo: '0xaA652e6aa1BC67A88e0e37a94fE856Be2e72e8cA'
  },
  [ChainId.RINKEBY]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.BSC_TESTNET]: {
    busd: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    xsgd: '0x70e8de73ce538da2beed35d14187f6959a8eca96'
  },
  [ChainId.MATIC_TESTNET]: {}
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  // [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.FANTOM]: [WETH[ChainId.FANTOM]],
  [ChainId.FANTOM_TESTNET]: [WETH[ChainId.FANTOM_TESTNET]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC]],
  [ChainId.MATIC_TESTNET]: [WETH[ChainId.MATIC_TESTNET]],
  [ChainId.XDAI]: [WETH[ChainId.XDAI]],
  [ChainId.BSC]: [WETH[ChainId.BSC]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
  [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
  [ChainId.MOONBASE]: [WETH[ChainId.MOONBASE]]
}

// Default Ethereum chain tokens
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const XSGD = new Token(
  ChainId.MAINNET,
  '0x70e8de73ce538da2beed35d14187f6959a8eca96',
  18,
  'XSGD',
  'Xfers: XSGD Token'
)

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin')
}

export const FANTOM: { [key: string]: Token } = {
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC, RUNE],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const USDP = new Token(
  ChainId.MAINNET,
  '0x1456688345527bE1f37E9e627DA0837D6f08C925',
  18,
  'USDP',
  'USDP Stablecoin'
)
export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const IBETH = new Token(
  ChainId.MAINNET,
  '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
  8,
  'ibETHv2',
  'Interest Bearing Ether v2'
)

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
    [DUCK.address]: [USDP, WETH[ChainId.MAINNET]],
    [BAB.address]: [BAC, WETH[ChainId.MAINNET]],
    [HBTC.address]: [CREAM, WETH[ChainId.MAINNET]],
    [FRAX.address]: [FXS, WETH[ChainId.MAINNET]],
    [IBETH.address]: [ALPHA, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [HALO[ChainId.MAINNET] as Token, WETH[ChainId.MAINNET]],
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  LATTICE: {
    connector: lattice,
    name: 'Lattice',
    iconName: 'gridPlusWallet.png',
    description: 'Connect to GridPlus Wallet.',
    href: null,
    color: '#40a9ff',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008'
]

export const HALO_REWARDS_MESSAGE = {
  approving: 'Approving token spend',
  staking: 'Staking token',
  unstaking: 'Unstaking token',
  claiming: 'Claiming your rewards',
  unstakeAndClaim: 'Unstaking and claiming'
}

export const ORACLE_ADDRESSES: { [key: string]: ChainAddressMap } = {
  CADC: {
    [ChainId.MAINNET]: '0xa34317DB73e77d453b1B8d04550c44D10e981C8e'
  },
  EURS: {
    [ChainId.MAINNET]: '0xb49f677943BC038e9857d61E7d053CaA2C1734C1',
    [ChainId.KOVAN]: '0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13'
  },
  XSGD: {
    [ChainId.MAINNET]: '0xe25277fF4bbF9081C75Ab0EB13B4A13a721f3E13'
  },
  USDC: {
    [ChainId.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    [ChainId.KOVAN]: '0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60'
  },
  AUD: {
    [ChainId.MAINNET]: '0x77F9710E7d0A19669A13c055F62cd80d313dF022',
    [ChainId.KOVAN]: '0x5813A90f826e16dB392abd2aF7966313fc1fd5B8'
  },
  CHF: {
    [ChainId.MAINNET]: '0x449d117117838fFA61263B61dA6301AA2a88B13A',
    [ChainId.KOVAN]: '0xed0616BeF04D374969f302a34AE4A63882490A8C'
  }
}
