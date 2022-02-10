import { BALANCER_POOL_URL, BALANCER_SUBGRAPH_URL } from '../constants'
import { useCallback } from 'react'
import { getBalancerLPTokenAddress, getBalancerPoolAddress, subgraphRequest } from 'utils/balancer'
import { ChainId, Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo, PoolProvider, PoolTokenInfo } from './usePoolInfo'
import { PoolIdLpTokenMap } from 'utils/poolInfo'

export const useBalancerPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const { chainId } = useActiveWeb3React()

  const balancerPoolUrl = chainId === ChainId.KOVAN ? BALANCER_POOL_URL[chainId] : BALANCER_POOL_URL[ChainId.MAINNET]
  const dAppPoolUrl = balancerPoolUrl ?? 'https://pools.balancer.exchange/#/pool'

  const balancerSubgraphUrl =
    chainId === ChainId.KOVAN ? BALANCER_SUBGRAPH_URL[chainId] : BALANCER_SUBGRAPH_URL[ChainId.MAINNET]
  const subgraphUrl = balancerSubgraphUrl ?? 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer/graphql'

  /**
   * Fetches pool info from balancer subgraph api everytime the poolAddresses changed
   */
  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId) return { poolsInfo, tokenAddresses }

    // Convert addresses to lowercase (cause subgraph api is case-sensitive)
    const balancerPoolIds = pidLpTokenMap.map(p => getBalancerPoolAddress(p.lpToken, chainId).toLowerCase())

    const query = {
      pools: {
        __args: {
          where: {
            id_in: balancerPoolIds // eslint-disable-line
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

    const result = await subgraphRequest(subgraphUrl, query)

    // Convert result to `poolsInfo` so we can easily use it in the components
    for (const pool of result.pools) {
      // Process pool tokens info
      const poolTokensInfo: PoolTokenInfo[] = []
      const tokenSymbols: string[] = []
      for (const token of pool.tokens) {
        tokenSymbols.push(token.symbol)
        const tokenAddress = getAddress(token.address)
        tokenAddresses.push(tokenAddress)

        poolTokensInfo.push({
          address: tokenAddress,
          mainnetAddress: tokenAddress,
          balance: parseFloat(token.balance),
          weightPercentage: (100 / pool.totalWeight) * token.denormWeight,
          asToken: new Token(chainId, tokenAddress, token.decimals, token.symbol, token.name)
        })
      }

      // Process pool info
      const pair = tokenSymbols.join('/')
      const lpTokenAddress = getAddress(getBalancerLPTokenAddress(pool.id, chainId))
      const LPToken = new Token(chainId, lpTokenAddress, 18, 'BPT', `BPT: ${pool.pair}`)

      poolsInfo.push({
        pid: pidLpTokenMap.filter(p => p.lpToken === lpTokenAddress)[0].pid,
        pair,
        address: lpTokenAddress,
        addLiquidityUrl: `${dAppPoolUrl}${pool.id}`,
        liquidity: parseFloat(pool.liquidity),
        tokens: poolTokensInfo,
        asToken: LPToken,
        allocPoint: 0,
        provider: PoolProvider.Balancer
      })
    }

    return { poolsInfo, tokenAddresses }
  }, [pidLpTokenMap, chainId, subgraphUrl, dAppPoolUrl])

  return fetchPoolInfo
}
