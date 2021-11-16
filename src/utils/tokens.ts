import { ChainId } from '@sushiswap/sdk'
import { TAGPHP } from '../constants'

const CUSTOM_TOKEN_SYMBOLS: {
  readonly [chainId in ChainId]?: { [key: string]: string }
} = {
  [ChainId.MAINNET]: {
    [TAGPHP[ChainId.MAINNET]!.toLowerCase()]: 'tagPHP'
  },
  [ChainId.MATIC]: {
    [TAGPHP[ChainId.MATIC]!.toLowerCase()]: 'tagPHP'
  }
}

export const getCustomTokenSymbol = (chainId: ChainId, tokenAddr: string) => {
  if (!chainId) {
    return undefined
  }

  const customTokens = CUSTOM_TOKEN_SYMBOLS[chainId]
  const tokenAddrLower = tokenAddr.toLowerCase()

  if (customTokens && customTokens[tokenAddrLower]) {
    return customTokens[tokenAddrLower]
  }
  return undefined
}
