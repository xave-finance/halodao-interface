import { BALANCER_POOL_URL, BALANCER_SUBGRAPH_URL } from '../constants'
import { useCallback } from 'react'
import { subgraphRequest } from 'utils/balancer'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo, PoolTokenInfo } from './usePoolInfo'
import { useAllocPoints } from './useRewards'

export const useBalancerPoolInfo = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const allocPoints = useAllocPoints(poolAddresses)

  /**
   * Fetches pool info from balancer subgraph api everytime the poolAddresses changed
   */
  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId) return { poolsInfo, tokenAddresses }

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
    // console.log('[useBalancerPoolInfo] subgraph response received!')

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
        tokenAddresses.push(address)

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

      poolsInfo.push({
        pair,
        address: getAddress(pool.id),
        addLiquidityUrl: `${BALANCER_POOL_URL}${pool.id}`,
        liquidity: parseFloat(pool.liquidity),
        tokens: poolTokensInfo,
        asToken: poolAsToken,
        allocPoint: allocPoints[index]
      })
    }

    return { poolsInfo, tokenAddresses }
  }, [poolAddresses, chainId, allocPoints])

  return fetchPoolInfo
}
