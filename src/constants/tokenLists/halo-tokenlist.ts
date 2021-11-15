import { ChainId, Token } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { ChainAddressMap, USDC, ZERO_ADDRESS } from '../../constants'

// Supported token symbols
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
  [ChainId.MAINNET]: '0xEcDB730E5a58AC94fbAc7d0E216727D1732DD554',
  [ChainId.KOVAN]: '0xa02dCeB15cc32249beC33C2808b4799a44F8B0D5',
  [ChainId.MATIC]: '0xC651c36b0EA5bED3AA2AaA6101e543A3f8345B03'
}

// USDC in between chains
export const haloUSDC: { [chainId in ChainId]?: Token } = {
  [ChainId.MAINNET]: USDC,
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x12513dd17ae75af37d9eb21124f98b04705be906', 6, 'USDC', 'USDC'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USDC')
}

// Token Lists
// Add tokens here to support, divided into different networks
const mainNetTokenList: Token[] = [
  USDC,
  new Token(ChainId.MAINNET, '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96', 6, 'XSGD', 'Xfers SGD'),
  new Token(ChainId.MAINNET, '0xdb25f211ab05b1c97d595516f45794528a807ad8', 2, 'EUR', 'EUR Stasis'),
  new Token(ChainId.MAINNET, '0xB0beF52B81cBB44ED42F4B873B06152A8E9A0b72', 18, 'LPHP', 'LolliDAO PHP')
]

const kovanTokenList: Token[] = [
  haloUSDC[ChainId.KOVAN] as Token,
  new Token(ChainId.KOVAN, '0x7bcFAF04C9BAD18e3A823740E0683A36426BB0Fe', 2, 'EURS', 'EURS Stasis Coin'),
  new Token(ChainId.KOVAN, '0x6d2dCe898dC56B1F26B8053995E7096804cd3fD5', 18, 'GBP', 'GBP'),
  new Token(ChainId.KOVAN, '0xE9958574866587c391735b7e7CE0D79432d3b9d0', 18, 'CHF', 'Jarvis Synthetic Swiss Franc')
]

const polygonTokenList: Token[] = [
  new Token(ChainId.MATIC, '0x42ca36D100776d61E0D0444EAAB2F10729bf1f84', 6, 'LUSDC', 'LolliDAO USD'),
  new Token(ChainId.MATIC, '0x2c35134D5De43c68fdB96E0F4464d6f18B8360b9', 2, 'LEUR', 'LolliDAO EUR'),
  new Token(ChainId.MATIC, '0x5e26C7DC36041D4784EbBF5142674859003Ce57d', 18, 'LPHP', 'LolliDAO PHP'),
  new Token(ChainId.MATIC, '0x953258D6aAb315c61fD3ebE4c5D76685f77d33cD', 6, 'LSGD', 'LolliDAO SGD'),
  new Token(ChainId.MATIC, '0x46399488146845E94562F067a178C18dF12473a4', 18, 'LfxPHP', 'LolliDAO fxPHP'),
  new Token(ChainId.MATIC, '0x6459e4d690AF945c370191e518d3b447f99a7150', 18, 'LtagPHP', 'LolliDAO tagPHP')
]

// allows switch of token list when changing networks
export const haloTokenList: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: mainNetTokenList,
  [ChainId.KOVAN]: kovanTokenList,
  [ChainId.MATIC]: polygonTokenList
}

// Assimilators
// Add assimilators here to support. These are arranged per base currency per network
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
