import { ChainId, Token } from '@halodao/sdk'
import { ethers } from 'ethers'
import { ChainAddressMap, USDC } from '../index'

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
  fxPHP = 'fxPHP',
  tagPHP = 'tagPHP',
  XIDR = 'XIDR',
  fxAUD = 'fxAUD',
  UST = 'UST'
}

export type AssimilatorAddressMap = {
  [token in TokenSymbol]: string
}
// Router addresses
export const routerAddress: ChainAddressMap = {
  [ChainId.MAINNET]: '0x585B52fE4712a74404abA83dEB09A0E087D80802',
  [ChainId.KOVAN]: '0xa02dCeB15cc32249beC33C2808b4799a44F8B0D5',
  [ChainId.MATIC]: '0x26f2860cdeB7cC785eE5d59a5Efb2D0D3842C39D',
  [ChainId.ARBITRUM]: '0xDFEa5ECCbB7D61D49dFa702ed8FeC4EC48944719',
  [ChainId.ARBITRUM_TESTNET]: '0x303Fe605077f251a123A41b5241a164c49Eba9b5'
}

// USDC in between chains
export const haloUSDC: { [chainId in ChainId]?: Token } = {
  [ChainId.MAINNET]: USDC,
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x12513dd17ae75af37d9eb21124f98b04705be906', 6, 'USDC', 'USDC'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USDC'),
  [ChainId.ARBITRUM]: new Token(ChainId.MATIC, '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', 6, 'USDC', 'USDC'),
  [ChainId.ARBITRUM_TESTNET]: new Token(
    ChainId.MATIC,
    '0x85476aB9523168d8143A20Bb873e33Ee7E522FbF',
    6,
    'USDC',
    'Mock USDC'
  )
}

// Token Lists
// Add tokens here to support, divided into different networks
// Adding new pairs step 2: Add token in tokenList
const mainNetTokenList: Token[] = [
  USDC,
  new Token(ChainId.MAINNET, '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96', 6, 'XSGD', 'Xfers SGD'),
  new Token(ChainId.MAINNET, '0x00000100F2A2bd000715001920eB70D229700085', 18, 'TCAD', 'True CAD'),
  // new Token(ChainId.MAINNET, '0x00006100F7090010005F1bd7aE6122c3C2CF0090', 18, 'TAUD', 'True AUD'),
  new Token(ChainId.MAINNET, '0x00000000441378008EA67F4284A57932B1c000a5', 18, 'TGBP', 'True GBP'),
  new Token(ChainId.MAINNET, '0xa693b19d2931d498c5b318df961919bb4aee87a5', 6, 'UST', 'UST'),
  // new Token(ChainId.MAINNET, '0x0000000000085d4780B73119b644AE5ecd22b376', 18, 'TUSD', 'True USD')
  new Token(ChainId.MAINNET, '0x3d147cD9aC957B2a5F968dE9d1c6B9d0872286a0', 18, 'fxPHP', 'handlePHP')
  // new Token(ChainId.MAINNET, '0x7A87104dfeA51853472fFafaD00D43e73284a135', 18, 'tagPHP', 'PHP Stablecoin')
  // new Token(ChainId.MAINNET, '0xebF2096E01455108bAdCbAF86cE30b6e5A72aa52', 6, 'XIDR', 'StraitsX: XIDR Token')
]

const kovanTokenList: Token[] = [
  haloUSDC[ChainId.KOVAN] as Token,
  new Token(ChainId.KOVAN, '0x7bcFAF04C9BAD18e3A823740E0683A36426BB0Fe', 2, 'EURS', 'EURS Stasis Coin'),
  new Token(ChainId.KOVAN, '0x6d2dCe898dC56B1F26B8053995E7096804cd3fD5', 18, 'GBP', 'GBP'),
  new Token(ChainId.KOVAN, '0xbd0b2de0bfB25b78d65Ff5c667E5231fbDF42cda', 18, 'fxAUD', 'fxAUD'),
  new Token(ChainId.KOVAN, '0xE9958574866587c391735b7e7CE0D79432d3b9d0', 18, 'CHF', 'Jarvis Synthetic Swiss Franc')
]

const polygonTokenList: Token[] = [
  haloUSDC[ChainId.MATIC] as Token,
  new Token(ChainId.MATIC, '0x769434dcA303597C8fc4997Bf3DAB233e961Eda2', 6, 'XSGD', 'Xfers SGD'),
  new Token(ChainId.MATIC, '0xe4F7761b541668f88d04fe9F2E9DF10CA613aEf7', 18, 'TAUD', 'Wrapped True AUD'),
  new Token(ChainId.MATIC, '0x6d3cC56DFC016151eE2613BdDe0e03Af9ba885CC', 18, 'TCAD', 'Wrapped True CAD'),
  new Token(ChainId.MATIC, '0x81A123f10C78216d32F8655eb1A88B5E9A3e9f2F', 18, 'TGBP', 'Wrapped True GBP'),
  // new Token(ChainId.MATIC, '0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756', 18, 'TUSD', 'Wrapped True USD')
  new Token(ChainId.MATIC, '0x69a8Aaa4318f4803B3517F78a2ca6c859F5349f3', 18, 'tagPHP', 'PHP Stablecoin')
]

const arbTokenList: Token[] = [
  haloUSDC[ChainId.ARBITRUM] as Token,
  new Token(ChainId.ARBITRUM, '0x3d147cD9aC957B2a5F968dE9d1c6B9d0872286a0', 18, 'fxPHP', 'handlePHP'),
  new Token(ChainId.ARBITRUM, '0x7E141940932E3D13bfa54B224cb4a16510519308', 18, 'fxAUD', 'handleAUD')
]

const arbRinkebyTokenList: Token[] = [
  haloUSDC[ChainId.ARBITRUM_TESTNET] as Token,
  new Token(ChainId.ARBITRUM_TESTNET, '0xE950eC7Fc508dd86fD9B36671f6B1602007D5B72', 18, 'fxPHP', 'Mock fxPHP')
]

// allows switch of token list when changing networks
export const haloTokenList: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: mainNetTokenList,
  [ChainId.KOVAN]: kovanTokenList,
  [ChainId.MATIC]: polygonTokenList,
  [ChainId.ARBITRUM]: arbTokenList,
  [ChainId.ARBITRUM_TESTNET]: arbRinkebyTokenList
}

// Assimilators
// Add assimilators here to support. These are arranged per base currency per network
// Adding new pairs step 3: Add assimilator
const mainNetAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: '0x311FDdE361e6258e9730c6147aAf584aC0F9c59A',
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: '0x17c3A12F68C95c637055ea65aA90D72813F430d4',
  [TokenSymbol.TCAD]: '0x70bA0482FD6343e8fcbd2480C8b4C11d6c654DF5',
  [TokenSymbol.TGBP]: '0x9Ec9C7215F936Ef0C5eFb8383a98354F5AcEFDd7',
  [TokenSymbol.XSGD]: '0xCaE2502093413290bc0E5c2CfA1039C661103bf1',
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.fxPHP]: '0x8cfaae374f7617d76218c6FeCF97F818bd325071',
  [TokenSymbol.tagPHP]: '0x2575721EA3088C3e4247478ad1a99aB6905BBe3D',
  [TokenSymbol.XIDR]: '0xB80c3d54BF3A0E25B927a216F48ecE07dB1173Ed',
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.UST]: '0x89777df7E30B5eb02629BD71F41D12c2Fe93d10d'
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
  [TokenSymbol.XSGD]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: '0x06ccbFc8992a26c8CebDDd5a07fFCAf208b8b0B3',
  [TokenSymbol.fxPHP]: ethers.constants.AddressZero,
  [TokenSymbol.tagPHP]: ethers.constants.AddressZero,
  [TokenSymbol.XIDR]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.UST]: ethers.constants.AddressZero
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
  [TokenSymbol.XSGD]: '0xB80c3d54BF3A0E25B927a216F48ecE07dB1173Ed',
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.fxPHP]: ethers.constants.AddressZero,
  [TokenSymbol.tagPHP]: '0xAF329A1764cD25d47f088292f802b0c8751dCd19',
  [TokenSymbol.XIDR]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.UST]: ethers.constants.AddressZero
}

const arbAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: '0x48623292bD8293b747571934379B9D3E5423DBB6',
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: ethers.constants.AddressZero,
  [TokenSymbol.TCAD]: ethers.constants.AddressZero,
  [TokenSymbol.TGBP]: ethers.constants.AddressZero,
  [TokenSymbol.XSGD]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.fxPHP]: '0x9f555A3115C2Da9574c84C4Dfb1617193aA7AFE2',
  [TokenSymbol.tagPHP]: ethers.constants.AddressZero,
  [TokenSymbol.XIDR]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: '0x7Ab404C804Df8f9f8A44A63e3B546bC16E98b5bf',
  [TokenSymbol.UST]: ethers.constants.AddressZero
}

const arbRinkebyAssimilators: AssimilatorAddressMap = {
  [TokenSymbol.USDC]: '0xF5383deb3cEFE0f0812Be833DE31d92564F87157',
  [TokenSymbol.EURS]: ethers.constants.AddressZero,
  [TokenSymbol.GBP]: ethers.constants.AddressZero,
  [TokenSymbol.CHF]: ethers.constants.AddressZero,
  [TokenSymbol.TUSD]: ethers.constants.AddressZero,
  [TokenSymbol.TAUD]: ethers.constants.AddressZero,
  [TokenSymbol.TCAD]: ethers.constants.AddressZero,
  [TokenSymbol.TGBP]: ethers.constants.AddressZero,
  [TokenSymbol.XSGD]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.fxPHP]: '0x805103E7574E432790e4AdB81607864CB1645295',
  [TokenSymbol.tagPHP]: ethers.constants.AddressZero,
  [TokenSymbol.XIDR]: ethers.constants.AddressZero,
  [TokenSymbol.fxAUD]: ethers.constants.AddressZero,
  [TokenSymbol.UST]: ethers.constants.AddressZero
}

// Allows switching in between assimilators when chainging network to be used by the useSwapToken() hook
export const haloAssimilators: { [chainId in ChainId]?: AssimilatorAddressMap } = {
  [ChainId.MAINNET]: mainNetAssimilators,
  [ChainId.KOVAN]: kovanAssimilators,
  [ChainId.MATIC]: polygonAssimilators,
  [ChainId.ARBITRUM]: arbAssimilators,
  [ChainId.ARBITRUM_TESTNET]: arbRinkebyAssimilators
}

// NOTE: add the coingecko token symbol here for other chain
export const TOKEN_COINGECKO_NAME: Record<string, string> = {
  usdc: 'usd-coin',
  xsgd: 'xsgd',
  tcad: 'truecad',
  tgbp: 'truegbp',
  fxphp: 'fxphp'
}
