import { BalancerPoolInfo } from 'components/PositionCard/BalancerPoolCard'
import { BALANCER_POOL_URL, BALANCER_SUBGRAPH_URL } from '../constants'
import { useEffect, useState } from 'react'
import { subgraphRequest } from 'utils/balancer'
import { ChainId, Token } from '@sushiswap/sdk'

export const useBalancer = (poolAddresses: string[]) => {
  const [poolInfo, setPoolInfo] = useState<BalancerPoolInfo[]>([])

  useEffect(() => {
    const fetchPoolInfo = async () => {
      // Convert addresses to lowercase (cause subgraph api is case-sensitive)
      const poolIds = poolAddresses.map(address => address.toLowerCase())

      const query = {
        pools: {
          __args: {
            where: {
              id_in: poolIds
            }
          },
          id: true,
          tokens: {
            symbol: true,
            address: true
          }
        }
      }

      console.log('query:', query)
      const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)
      console.log('result:', result)

      const currentPoolInfo: BalancerPoolInfo[] = []
      for (const pool of result.pools) {
        currentPoolInfo.push({
          pair: `${pool.tokens[0].symbol}/${pool.tokens[1].symbol}`,
          address: pool.id,
          balancerUrl: `${BALANCER_POOL_URL}${pool.id}`
        })
      }

      setPoolInfo(currentPoolInfo)
    }

    fetchPoolInfo()
  }, [poolAddresses])

  const toPoolTokens = (poolInfo: BalancerPoolInfo[], chainId: ChainId) => {
    const tokens: Token[] = []
    poolInfo.forEach(pool => {
      const token = new Token(chainId, pool.address, 18, 'BPT', `BPT: ${pool.pair}`)
      tokens.push(token)
    })
    return tokens
  }

  return { poolInfo, toPoolTokens }
}
