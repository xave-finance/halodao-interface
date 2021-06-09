import { useState, useEffect } from 'react'
import { useActiveWeb3React } from 'hooks'
import { COINGECKO_KNOWN_TOKENS } from '../constants'
import { getTokensUSDPrice, GetPriceBy } from 'utils/coingecko'

export type TokenPrice = {
  [address: string]: number
}

export const useTokenPrice = (tokenAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const [tokenPrice, setTokenPrice] = useState<TokenPrice>({})

  /**
   * Gets the price of some known tokens (e.g. weth, dai, usdc, etc)
   * This is a workaround so we can test with testnet addresses
   */
  useEffect(() => {
    if (!chainId) return

    const knownTokens = COINGECKO_KNOWN_TOKENS[chainId]
    if (!knownTokens) return

    const tokenIds = Object.keys(knownTokens)
    if (!tokenIds.length) return

    getTokensUSDPrice(GetPriceBy.id, tokenIds).then(price => {
      const newPrice: TokenPrice = {}
      for (const key in price) {
        newPrice[knownTokens[key]] = price[key]
      }
      setTokenPrice(newPrice)
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
