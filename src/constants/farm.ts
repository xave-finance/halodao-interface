import { ChainId } from '@sushiswap/sdk'

type ChainAdressesMap = {
  readonly [chainId in ChainId]?: string[]
}

export const POOL_ADDRESSES: ChainAdressesMap = {
  [ChainId.KOVAN]: [
    '0x37f80ac90235ce0d3911952d0ce49071a0ffdb1e', // DAI/WETH
    '0x65850ecd767e7ef71e4b78a348bb605343bd87c3' // ANT/WETH
  ],
  [ChainId.GÖRLI]: [
    '0xBea012aaF56949a95759B9CE0B494A97edf389e6', // DUMMY TOKEN#1
    '0x9C303C18397cB5Fa62D9e68a0C7f2Cc6e00F0066' // DUMMY TOKEN#2
  ],
  [ChainId.MATIC]: [
    '0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E' // SUSHISWAP LP TOKEN
  ]
}
