import { useState, useEffect } from 'react'
import { useActiveWeb3React } from 'hooks'
import { COINGECKO_KNOWN_TOKENS, HALO_TOKEN_ADDRESS } from '../constants'
import { getTokensUSDPrice, GetPriceBy } from 'utils/coingecko'
import { ChainId } from '@halodao/sdk'

export type TokenPrice = {
  [address: string]: number
}

export const useTokenPrice = (tokenAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const [tokenPrice, setTokenPrice] = useState<TokenPrice>({})

  /**
   * Gets the price of some known tokens (e.g. weth, dai, usdc, etc)
   */
  useEffect(() => {
    if (!chainId) return

    // Get Mainnet RNBW price
    getTokensUSDPrice(GetPriceBy.address, [HALO_TOKEN_ADDRESS[ChainId.MAINNET] ?? '']).then(price => {
      setTokenPrice(previousPrice => {
        return { ...previousPrice, ...price }
      })
    })

    // Get other known token prices
    const knownTokens = COINGECKO_KNOWN_TOKENS[chainId]
    if (!knownTokens) return

    const tokenIds = Object.keys(knownTokens)
    if (!tokenIds.length) return

    getTokensUSDPrice(GetPriceBy.id, tokenIds).then(price => {
      const newPrice: TokenPrice = {}
      for (const key in price) {
        newPrice[knownTokens[key]] = price[key]
      }

      setTokenPrice(previousPrice => {
        return { ...previousPrice, ...newPrice }
      })
    })
  }, [chainId])

  /**
   * Gets the price of the all the pool tokens & stores it in `tokenPrice` state
   */
  useEffect(() => {
    if (!tokenAddresses.length) return
    getTokensUSDPrice(GetPriceBy.address, tokenAddresses).then(price => {
      setTokenPrice(previousPrice => {
        return { ...previousPrice, ...price }
      })
    })
  }, [tokenAddresses])

  return tokenPrice
}
