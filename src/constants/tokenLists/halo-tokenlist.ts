import { ChainId, Token } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { ChainAddressMap, USDC, ZERO_ADDRESS } from '../../constants'

// Supported token symbols
// Adding new pairs step 1: Add tokensymbol enum
export enum TokenSymbol {
  USDC = 'USDC',
  EURS = 'EURS',
  GBP = 'GBP',
  CHF = 'CHF',
  TUSD = 'TUSD',
  TCAD = 'TCAD',
  TGBP = 'TGBP',
  TAUD = 'TAUD',
  XSGD = 'XSGD'
}

export type AssimilatorAddressMap = {
  [token in TokenSymbol]: string
}
// Router addresses
export const routerAddress: ChainAddressMap = {
  [ChainId.MAINNET]: '0x585B52fE4712a74404abA83dEB09A0E087D80802',
  [ChainId.KOVAN]: '0xa02dCeB15cc32249beC33C2808b4799a44F8B0D5',
  [ChainId.MATIC]: '0x26f2860cdeB7cC785eE5d59a5Efb2D0D3842C39D'
}

// USDC in between chains
export const haloUSDC: { [chainId in ChainId]?: Token } = {
  [ChainId.MAINNET]: USDC,
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x12513dd17ae75af37d9eb21124f98b04705be906', 6, 'USDC', 'USDC'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USDC')
}

// Token Lists
// Add tokens here to support, divided into different networks
// Adding new pairs step 2: Add token in tokenList
const mainNetTokenList: Token[] = [
  USDC,
  new Token(ChainId.MAINNET, '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96', 6, 'XSGD', 'Xfers SGD'),
  new Token(ChainId.MAINNET, '0x00000100F2A2bd000715001920eB70D229700085', 18, 'TCAD', 'True CAD'),
  new Token(ChainId.MAINNET, '0x00006100F7090010005F1bd7aE6122c3C2CF0090', 18, 'TAUD', 'True AUD'),
  new Token(ChainId.MAINNET, '0x00000000441378008EA67F4284A57932B1c000a5', 18, 'TGBP', 'True GBP')
  // new Token(ChainId.MAINNET, '0x0000000000085d4780B73119b644AE5ecd22b376', 18, 'TUSD', 'True USD')
]

const kovanTokenList: Token[] = [
  haloUSDC[ChainId.KOVAN] as Token,
  new Token(ChainId.KOVAN, '0x7bcFAF04C9BAD18e3A823740E0683A36426BB0Fe', 2, 'EURS', 'EURS Stasis Coin'),
  new Token(ChainId.KOVAN, '0x6d2dCe898dC56B1F26B8053995E7096804cd3fD5', 18, 'GBP', 'GBP'),
  new Token(ChainId.KOVAN, '0xE9958574866587c391735b7e7CE0D79432d3b9d0', 18, 'CHF', 'Jarvis Synthetic Swiss Franc')
]

const polygonTokenList: Token[] = [
  haloUSDC[ChainId.MATIC] as Token,
  new Token(ChainId.MATIC, '0x769434dcA303597C8fc4997Bf3DAB233e961Eda2', 6, 'XSGD', 'Xfers SGD'),
  new Token(ChainId.MATIC, '0xe4F7761b541668f88d04fe9F2E9DF10CA613aEf7', 18, 'TAUD', 'Wrapped True AUD'),
  new Token(ChainId.MATIC, '0x6d3cC56DFC016151eE2613BdDe0e03Af9ba885CC', 18, 'TCAD', 'Wrapped True CAD'),
  new Token(ChainId.MATIC, '0x81A123f10C78216d32F8655eb1A88B5E9A3e9f2F', 18, 'TGBP', 'Wrapped True GBP'),
  new Token(ChainId.MATIC, '0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756', 18, 'TUSD', 'Wrapped True USD')
]

// allows switch of token list when changing networks
export const haloTokenList: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: mainNetTokenList,
  [ChainId.KOVAN]: kovanTokenList,
  [ChainId.MATIC]: polygonTokenList
}

// Assimilators
// Add assimilators here to support. These are arranged per base currency per network
// Adding new pairs step 3: Add assimilator
const mainNetAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: ZERO_ADDRESS,
  [TokenSymbol.EURS]: ZERO_ADDRESS,
  [TokenSymbol.GBP]: ZERO_ADDRESS,
  [TokenSymbol.CHF]: ZERO_ADDRESS,
  [TokenSymbol.TUSD]: ZERO_ADDRESS,
  [TokenSymbol.TAUD]: '0x17c3A12F68C95c637055ea65aA90D72813F430d4',
  [TokenSymbol.TCAD]: '0x70bA0482FD6343e8fcbd2480C8b4C11d6c654DF5',
  [TokenSymbol.TGBP]: '0x9Ec9C7215F936Ef0C5eFb8383a98354F5AcEFDd7',
  [TokenSymbol.XSGD]: '0xCaE2502093413290bc0E5c2CfA1039C661103bf1'
}

const kovanAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: '0x4a6EF0be792F8C2Ff2f3477Fb9354d0Dbc7797f9',
  [TokenSymbol.EURS]: '0x3Af71eC189cf9de106b7C4DAC269d6C6d3d37a97',
  [TokenSymbol.GBP]: '0x6500ACbaF819C520aDA1B5C91cc8aFe0cD91008f',
  [TokenSymbol.CHF]: '0xa6b02260754c506403E12e9b09211848F6BC9Cc0',
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: ethers.constants.AddressZero,
  [TokenSymbol.TCAD]: ethers.constants.AddressZero,
  [TokenSymbol.TGBP]: ethers.constants.AddressZero,
  [TokenSymbol.XSGD]: ethers.constants.AddressZero
}

const polygonAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: '0xbf7455b83fd4c6dcF4f544e68DD38670b4Ff07D6',
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: '0x7aBF5B0183631fb7537523c6627D8016408e1509',
  [TokenSymbol.TAUD]: '0x1bF0990fDB4CABF88aB7f3D412691cE2B425F2Ef',
  [TokenSymbol.TCAD]: '0x5710FFcED6aEd86820da398E2925DAf5738cd4ce',
  [TokenSymbol.TGBP]: '0x57D63073C5d8c8f52C38779cf141365aC46aeD72',
  [TokenSymbol.XSGD]: '0xB80c3d54BF3A0E25B927a216F48ecE07dB1173Ed'
}

// Allows switching in between assimilators when chainging network to be used by the useSwapToken() hook
export const haloAssimilators: { [chainId in ChainId]?: AssimilatorAddressMap } = {
  [ChainId.MAINNET]: mainNetAssimilators,
  [ChainId.KOVAN]: kovanAssimilators,
  [ChainId.MATIC]: polygonAssimilators
}
