export interface BridgeToken {
  chainId: number
  tokenAddress: string
  wrappedTokens: any
  primaryBridgeContract: string
  secondaryBridgeContracts: any
  tokenSymbol: string
}

export const MOCK_TOKEN: BridgeToken = {
  chainId: 137,
  tokenAddress: '0x20b1E84DF32159e2e9f1e22216685F3a25075EA8',
  wrappedTokens: {
    100: '0x20B1662B1216c4F2751398C3FB4742C5eD128D76',
    56: '0x81239313b0c7b772eE39B85320eAC050F127B5ea'
  },
  primaryBridgeContract: '0x3Ad0968Df05b068E8A974e0B04D36ed561269544',
  secondaryBridgeContracts: {
    100: '0xF755e3125b171A70f24768d843AB75A50A045ea6',
    56: '0xE7Cca1Fd0705e80Cea6E910E2542EE19eF366664'
  },
  tokenSymbol: 'MOCK'
}
