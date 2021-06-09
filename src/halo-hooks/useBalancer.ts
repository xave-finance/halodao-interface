import { BALANCER_POOL_URL, BALANCER_SUBGRAPH_URL, COINGECKO_KNOWN_TOKENS } from '../constants'
import { useEffect, useState } from 'react'
import { subgraphRequest } from 'utils/balancer'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { useAllocPoint } from 'halo-hooks/useRewards'

export type PoolInfo = {
  pair: string
  address: string
  balancerUrl: string
  liquidity: number
  tokens: PoolTokenInfo[]
  asToken: Token
  allocPoint: number
}

type PoolTokenInfo = {
  address: string
  balance: number
  weightPercentage: number
  asToken: Token
}

export type TokenPrice = {
  [address: string]: number
}

export const useBalancer = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const [poolsInfo, setPoolsInfo] = useState<PoolInfo[]>([])
  const [poolTokensAddresses, setPoolTokensAddresses] = useState<string[]>([])
  const [tokenPrice, setTokenPrice] = useState<TokenPrice>({})
  const allocPoints = useAllocPoint()

  /**
   * Gets the price of some known tokens (e.g. weth, dai, usdc, etc)
   * This is a workaround so we can test with kovan addresses
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
   * Fetches pool info from balancer subgraph api everytime the poolAddresses changed
   */
  useEffect(() => {
    const fetchPoolInfo = async () => {
      if (!chainId) return

      // Convert addresses to lowercase (cause subgraph api is case-sensitive)
      const poolIds = poolAddresses.map(address => address.toLowerCase())

      const query = {
        pools: {
          __args: {
            where: {
              id_in: poolIds // eslint-disable-line
            }
          },
          id: true,
          totalWeight: true,
          liquidity: true,
          tokens: {
            symbol: true,
            address: true,
            decimals: true,
            denormWeight: true,
            balance: true
          }
        }
      }

      const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)

      const newPoolsInfo: PoolInfo[] = []
      const newPoolTokensAddresses: string[] = []

      console.log('xx', result)

      // Convert result to `poolsInfo` so we can easily use it in the components
      for (const [index, poolAddress] of poolAddresses.entries()) {
        // Find the pool info of each poolAddress from graphql response
        const matchingPools = result.pools.filter((p: any) => p.id.toLowerCase() === poolAddress.toLowerCase())
        const pool = matchingPools.length ? matchingPools[0] : undefined
        if (!pool) {
          continue
        }

        // Process pool tokens info
        const poolTokensInfo: PoolTokenInfo[] = []
        const tokenSymbols: string[] = []
        for (const token of pool.tokens) {
          tokenSymbols.push(token.symbol)
          const address = getAddress(token.address)
          newPoolTokensAddresses.push(address)

          poolTokensInfo.push({
            address,
            balance: parseFloat(token.balance),
            weightPercentage: (100 / pool.totalWeight) * token.denormWeight,
            asToken: new Token(chainId, address, token.decimals, token.symbol, token.name)
          })
        }

        // Process pool info
        const pair = tokenSymbols.join('/')
        const poolAsToken = new Token(chainId, getAddress(pool.id), 18, 'BPT', `BPT: ${pool.pair}`)

        newPoolsInfo.push({
          pair,
          address: getAddress(pool.id),
          balancerUrl: `${BALANCER_POOL_URL}${pool.id}`,
          liquidity: parseFloat(pool.liquidity),
          tokens: poolTokensInfo,
          asToken: poolAsToken,
          allocPoint: allocPoints[index]
        })
      }

      setPoolsInfo(newPoolsInfo)
      setPoolTokensAddresses(newPoolTokensAddresses)
    }

    if (chainId && poolAddresses.length) {
      fetchPoolInfo()
    } else {
      setPoolsInfo([])
    }
  }, [poolAddresses, chainId])

  /**
   * Gets the price of the all the pool tokens & stores it in `tokenPrice` state
   */
  useEffect(() => {
    if (!poolTokensAddresses.length) return
    getTokensUSDPrice(GetPriceBy.address, poolTokensAddresses).then(price => {
      setTokenPrice(previousPrice => {
        return { ...previousPrice, ...price }
      })
    })
  }, [poolTokensAddresses])

  return { poolsInfo, tokenPrice }
}
