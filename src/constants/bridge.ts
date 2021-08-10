import { ChainId, Token } from '@sushiswap/sdk'

import { MOCK, ZERO_ADDRESS } from '../constants/'

// export interface BridgeToken {
//   chainId: number
//   [chainId in ChainId]?: Token
//   wrappedTokens: any
//   primaryBridgeContract: string
//   secondaryBridgeContracts: any
//   tokenSymbol: string
// }

// export const MOCK_TOKEN: BridgeToken = {
//   token: MOCK,
//   wrappedTokens: {
//     100: '0x20B1662B1216c4F2751398C3FB4742C5eD128D76',
//     56: '0x81239313b0c7b772eE39B85320eAC050F127B5ea'
//   },
//   primaryBridgeContract: '0x3Ad0968Df05b068E8A974e0B04D36ed561269544',
//   secondaryBridgeContracts: {
//     100: '0xF755e3125b171A70f24768d843AB75A50A045ea6',
//     56: '0xE7Cca1Fd0705e80Cea6E910E2542EE19eF366664'
//   },
//   tokenSymbol: 'MOCK'
// }

type ChainBridgeMap = {
  readonly [chainId in ChainId]?: string
}

type BridgeContractMap = {
  readonly symbol: ChainBridgeMap
}

export const BRIDGE_CONTRACTS: any = {
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MATIC as string]:
    process.env.REACT_APP_MOCK_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_XDAI as string]:
    process.env.REACT_APP_MOCK_XDAI_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_BSC as string]:
    process.env.REACT_APP_MOCK_BSC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS
  // MOCK: {
  //   [ChainId.MATIC]: process.env.REACT_APP_MOCK_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  //   [ChainId.XDAI]: process.env.REACT_APP_MOCK_XDAI_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  //   [ChainId.BSC]: process.env.REACT_APP_MOCK_BSC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS
  // }
}

export const ORIGINAL_TOKEN_CHAIN_ID = {
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MATIC as string]: ChainId.MATIC,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_XDAI as string]: ChainId.MATIC,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_BSC as string]: ChainId.MATIC
}
