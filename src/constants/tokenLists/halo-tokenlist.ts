import { ChainId, Token } from '@halodao/sdk'
import { ethers } from 'ethers'
import { ChainAddressMap, USDC } from '../../constants'

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
  XSGD = 'XSGD',
  LUSDC = 'LUSDC',
  LEUR = 'LEUR',
  LPHP = 'LPHP',
  LSGD = 'LSGD',
  LfxPHP = 'LfxPHP',
  LtagPHP = 'LtagPHP',
  LLEUR = 'LLEUR'
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
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x42ca36D100776d61E0D0444EAAB2F10729bf1f84', 6, 'USDC', 'USDC')
}

// Token Lists
// Add tokens here to support, divided into different networks
// Adding new pairs step 2: Add token in tokenList
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
  new Token(ChainId.KOVAN, '0xbd0b2de0bfB25b78d65Ff5c667E5231fbDF42cda', 18, 'fxAUD', 'fxAUD'),
  new Token(ChainId.KOVAN, '0xE9958574866587c391735b7e7CE0D79432d3b9d0', 18, 'CHF', 'Jarvis Synthetic Swiss Franc')
]

const polygonTokenList: Token[] = [
  new Token(ChainId.MATIC, '0x42ca36D100776d61E0D0444EAAB2F10729bf1f84', 6, 'LUSDC', 'LolliDAO USD'),
  new Token(ChainId.MATIC, '0x2c35134D5De43c68fdB96E0F4464d6f18B8360b9', 2, 'LEUR', 'LolliDAO EUR'),
  new Token(ChainId.MATIC, '0x5e26C7DC36041D4784EbBF5142674859003Ce57d', 18, 'LPHP', 'LolliDAO PHP'),
  new Token(ChainId.MATIC, '0x953258D6aAb315c61fD3ebE4c5D76685f77d33cD', 6, 'LSGD', 'LolliDAO SGD'),
  new Token(ChainId.MATIC, '0xEcA94DCa500c188FFA2C99A4Ee78F7507C88d878', 18, 'LfxPHP', 'LolliDAO fxPHP'),
  new Token(ChainId.MATIC, '0xacd7c06cBfe3FF0Ec786D6f27D7dd2f91c886e12', 18, 'LtagPHP', 'LolliDAO tagPHP'),
  new Token(ChainId.MATIC, '0x54c24314949DB0F4fB7da387cc22c78d7C18e9b9', 2, 'LLEUR', 'LolliDAO EUR 2')
]

// allows switch of token list when changing networks
export const haloTokenList: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: mainNetTokenList,
  [ChainId.KOVAN]: kovanTokenList,
  [ChainId.MATIC]: polygonTokenList
  // [ChainId.ARBITRUM]: arbTokenList,
  // [ChainId.ARBITRUM_TESTNET]: arbRinkebyTokenList
}

// Assimilators
// Add assimilators here to support. These are arranged per base currency per network
// Adding new pairs step 3: Add assimilator
const mainNetAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.LUSDC]: ethers.constants.AddressZero,
  [TokenSymbol.LEUR]: ethers.constants.AddressZero,
  [TokenSymbol.LPHP]: '0xdEe6071B55Af127cb6399dce407A6864Ce8b0107',
  [TokenSymbol.LSGD]: ethers.constants.AddressZero,
  [TokenSymbol.LfxPHP]: ethers.constants.AddressZero,
  [TokenSymbol.LtagPHP]: ethers.constants.AddressZero,
  [TokenSymbol.LLEUR]: ethers.constants.AddressZero,
  [TokenSymbol.USDC]: '0xDB70e4cF1eE40Ed01A6eE3E4a200AabBf0facCbC',
  [TokenSymbol.EURS]: '0x30A67BCbDC32c0882D8730F17ee3Ee15FCCcee18',
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TCAD]: ethers.constants.AddressZero,
  [TokenSymbol.TGBP]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: ethers.constants.AddressZero,
  [TokenSymbol.XSGD]: '0xd58845Be9D194b5d071Ca1422cE3756A9711784D'
}

const kovanAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.LUSDC]: ethers.constants.AddressZero,
  [TokenSymbol.LEUR]: ethers.constants.AddressZero,
  [TokenSymbol.LPHP]: ethers.constants.AddressZero,
  [TokenSymbol.LSGD]: ethers.constants.AddressZero,
  [TokenSymbol.LfxPHP]: ethers.constants.AddressZero,
  [TokenSymbol.LtagPHP]: ethers.constants.AddressZero,
  [TokenSymbol.LLEUR]: ethers.constants.AddressZero,
  [TokenSymbol.USDC]: ethers.constants.AddressZero,
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TCAD]: ethers.constants.AddressZero,
  [TokenSymbol.TGBP]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: ethers.constants.AddressZero,
  [TokenSymbol.XSGD]: ethers.constants.AddressZero
}

const polygonAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.LUSDC]: '0x58713ebBe790b76c0b311901F7e61403319cBE88',
  [TokenSymbol.LEUR]: '0x1bF1B29b4C8Ce5C2e37c829a1d93d513dE1C8496',
  [TokenSymbol.LPHP]: '0xc020d12B69BD37a6de78AE0AeDE56e8CbDb700Fd',
  [TokenSymbol.LSGD]: '0x9b460B09DBC8590Ef6e190B1Da1995bd558e97a1',
  [TokenSymbol.LfxPHP]: '0x6FedC22EF8d8dD595f4D1D06A076AbcC5bADA972',
  [TokenSymbol.LtagPHP]: '0xbD82D06ea44EBd2F5df01c4384128C74067253B3',
  [TokenSymbol.LLEUR]: '0x54534C49A7Ee7e1e084878B28941Dea35FC7790e',
  [TokenSymbol.USDC]: ethers.constants.AddressZero,
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TCAD]: ethers.constants.AddressZero,
  [TokenSymbol.TGBP]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: ethers.constants.AddressZero,
  [TokenSymbol.XSGD]: ethers.constants.AddressZero
}

// Allows switching in between assimilators when chainging network to be used by the useSwapToken() hook
export const haloAssimilators: { [chainId in ChainId]?: AssimilatorAddressMap } = {
  [ChainId.MAINNET]: mainNetAssimilators,
  [ChainId.KOVAN]: kovanAssimilators,
  [ChainId.MATIC]: polygonAssimilators
  // [ChainId.ARBITRUM]: arbAssimilators,
  // [ChainId.ARBITRUM_TESTNET]: arbRinkebyAssimilators
}
