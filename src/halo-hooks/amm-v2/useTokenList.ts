import { ChainId, Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { useState, useCallback, useEffect } from 'react'
import { getHaloAddresses } from 'utils/haloAddresses'
import { consoleLog } from 'utils/simpleLogger'
import useToken from '../tokens/useToken'

const ETH: { [key in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'ETH', 'Ether')
}

const WETH: { [key in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    18,
    'WETH',
    'Wrapped ETH'
  ),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped ETH'),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped ETH'
  )
}

const WBTC: { [key in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    8,
    'WBTC',
    'Wrapped BTC'
  )
}

const useTokenList = () => {
  const { chainId } = useActiveWeb3React()
  const haloAddresses = getHaloAddresses(chainId)
  const { addressesToTokens } = useToken()

  const [tokenList, setTokenList] = useState<Token[]>([])
  const [tokenListLoading, setTokenListLoading] = useState(false)
  const [tokenListError, setTokenListError] = useState<unknown | null>(null)

  const commonTokens = useCallback(() => {
    const commonTokens: Token[] = []
    if (!chainId) return commonTokens

    if (ETH[chainId]) {
      commonTokens.push(ETH[chainId]!)
    }
    if (WETH[chainId]) {
      commonTokens.push(WETH[chainId]!)
    }
    if (WBTC[chainId]) {
      commonTokens.push(WBTC[chainId]!)
    }

    return commonTokens
  }, [chainId])

  const fetchTokenList = useCallback(async () => {
    consoleLog('[useTokenList] fetching token list...')

    setTokenListLoading(true)
    setTokenListError(null)

    try {
      // Get all token addresses from all pools
      const poolTokenAddresses: string[] = []
      for (const pool of haloAddresses.ammV2.pools.enabled) {
        for (const asset of pool.assets) {
          if (!poolTokenAddresses.includes(asset)) {
            poolTokenAddresses.push(asset)
          }
        }
      }

      // Transform all token addresses to tokens
      const poolTokens = await addressesToTokens(poolTokenAddresses)

      // Add commonly used tokens
      const allTokens = [...commonTokens(), ...poolTokens]

      setTokenList(allTokens)
    } catch (error) {
      console.error('[useTokenList] fetchTokenList() throws an error: ', error)
      setTokenListError(error)
    } finally {
      setTokenListLoading(false)
    }
  }, [haloAddresses, addressesToTokens, commonTokens])

  useEffect(() => {
    fetchTokenList()
  }, [haloAddresses]) // eslint-disable-line

  return {
    tokenList,
    tokenListLoading,
    tokenListError,
    fetchTokenList
  }
}

export default useTokenList
