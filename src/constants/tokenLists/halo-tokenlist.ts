import { ChainId, Token } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { USDC, ZERO_ADDRESS } from '../../constants'

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

export const haloUSDC: { [chainId in ChainId]?: Token } = {
  [ChainId.MAINNET]: USDC,
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x12513dd17ae75af37d9eb21124f98b04705be906', 6, 'USDC', 'USDC'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USDC')
}

// Token Lists
const mainNetTokenList: Token[] = [
  // new Token(ChainId.MAINNET, process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET || ZERO_ADDRESS, 18, 'RNBW', 'RNBWToken'),
  USDC,
  new Token(ChainId.MAINNET, '0x00000100F2A2bd000715001920eB70D229700085', 18, 'TCAD', 'True CAD'),
  new Token(ChainId.MAINNET, '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96', 6, 'XSGD', 'Xfers SGD'),
  new Token(ChainId.MAINNET, '0x00006100F7090010005F1bd7aE6122c3C2CF0090', 18, 'TAUD', 'True AUD'),
  new Token(ChainId.MAINNET, '0x00000000441378008EA67F4284A57932B1c000a5', 18, 'TGBP', 'True GBP'),
  new Token(ChainId.MAINNET, '0x0000000000085d4780B73119b644AE5ecd22b376', 18, 'TUSD', 'True USD')
]

const kovanTokenList: Token[] = [
  haloUSDC[ChainId.KOVAN] as Token,
  new Token(ChainId.KOVAN, '0x7bcFAF04C9BAD18e3A823740E0683A36426BB0Fe', 2, 'EURS', 'EURS Stasis Coin'),
  new Token(ChainId.KOVAN, '0x6d2dCe898dC56B1F26B8053995E7096804cd3fD5', 18, 'GBP', 'GBP'),
  new Token(ChainId.KOVAN, '0xE9958574866587c391735b7e7CE0D79432d3b9d0', 18, 'CHF', 'Jarvis Synthetic Swiss Franc')
]

const polygonTokenList: Token[] = [
  haloUSDC[ChainId.MATIC] as Token,
  new Token(ChainId.MATIC, '0xe4F7761b541668f88d04fe9F2E9DF10CA613aEf7', 18, 'TAUD', 'Wrapped True AUD'),
  new Token(ChainId.MATIC, '0x6d3cC56DFC016151eE2613BdDe0e03Af9ba885CC', 18, 'TCAD', 'Wrapped True CAD'),
  new Token(ChainId.MATIC, '0x81A123f10C78216d32F8655eb1A88B5E9A3e9f2F', 18, 'TGBP', 'Wrapped True GBP'),
  new Token(ChainId.MATIC, '0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756', 18, 'TUSD', 'Wrapped True USD'),
  new Token(ChainId.MATIC, '0x769434dcA303597C8fc4997Bf3DAB233e961Eda2', 6, 'XSGD', 'Xfers SGD')
]

export const haloTokenList: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: mainNetTokenList,
  [ChainId.KOVAN]: kovanTokenList,
  [ChainId.MATIC]: polygonTokenList
}

// Assimilators
// TODO: to change
const mainNetAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: '0x4a6EF0be792F8C2Ff2f3477Fb9354d0Dbc7797f9',
  [TokenSymbol.EURS]: '0x3Af71eC189cf9de106b7C4DAC269d6C6d3d37a97',
  [TokenSymbol.GBP]: '0x6500ACbaF819C520aDA1B5C91cc8aFe0cD91008f',
  [TokenSymbol.CHF]: '0xa6b02260754c506403E12e9b09211848F6BC9Cc0',
  [TokenSymbol.TUSD]: ZERO_ADDRESS,
  [TokenSymbol.TAUD]: ZERO_ADDRESS,
  [TokenSymbol.TCAD]: ZERO_ADDRESS,
  [TokenSymbol.TGBP]: ZERO_ADDRESS,
  [TokenSymbol.XSGD]: ZERO_ADDRESS
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
  [TokenSymbol.USDC]: '0x20a590c339a5A6EA0bd6817b832847067377ecfb',
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: '0xc33745C6cD00C4097faE924CB7e2594FfF4b7d7E',
  [TokenSymbol.TAUD]: '0x6360a8Adb883CA076e7F2c6d2fF37531A771e414',
  [TokenSymbol.TCAD]: '0xf5b0b3b50328B2595BC6a31A526A8A3568CEa42d',
  [TokenSymbol.TGBP]: '0xB9f4E777491bb848578B6FBa5c8A744A40d11128',
  [TokenSymbol.XSGD]: '0x4159d4279BAc010ef4E4c1a7e085f6103956a95a'
}

export const haloAssimilators: { [chainId in ChainId]?: AssimilatorAddressMap } = {
  [ChainId.MAINNET]: mainNetAssimilators,
  [ChainId.KOVAN]: kovanAssimilators,
  [ChainId.MATIC]: polygonAssimilators
}
