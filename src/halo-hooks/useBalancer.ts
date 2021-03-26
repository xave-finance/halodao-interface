import { BalancerPoolInfo } from 'components/PositionCard/BalancerPoolCard'
import { BALANCER_POOL_URL, BALANCER_SUBGRAPH_URL } from '../constants'
import { useEffect, useState } from 'react'
import { subgraphRequest } from 'utils/balancer'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'

export const useBalancer = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const [poolInfo, setPoolInfo] = useState<BalancerPoolInfo[]>([])
  const [poolTokens, setPoolTokens] = useState<Token[]>([])

  console.log('poolInfo:', poolInfo)

  /**
   * Fetches pool info from balancer subgraph api everytime the poolAddresses changed
   */
  useEffect(() => {
    console.log('poolAddresses changed!', poolAddresses)
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
          liquidity: true,
          tokens: {
            name: true,
            symbol: true,
            address: true,
            decimals: true
          }
        }
      }

      const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)

      const currentPoolInfo: BalancerPoolInfo[] = []
      for (const pool of result.pools) {
        let tokenSymbols: string[] = []
        let tokens: Token[] = []

        for (const token of pool.tokens) {
          tokenSymbols.push(token.symbol)
          tokens.push(new Token(chainId, token.address, token.decimals, token.symbol, token.name))
        }

        currentPoolInfo.push({
          liquidity: parseFloat(pool.liquidity),
          pair: tokenSymbols.join('/'),
          address: pool.id,
          balancerUrl: `${BALANCER_POOL_URL}${pool.id}`,
          tokens
        })
      }

      setPoolInfo(currentPoolInfo)
    }

    if (chainId && poolAddresses.length) {
      fetchPoolInfo()
    } else {
      setPoolInfo([])
    }
  }, [poolAddresses, chainId])

  /**
   * Converts BalancerPoolInfo[] to Token[]
   *
   * A Token object will let us reuse uniswap's Token-related hooks which allows us
   * to query balanceOf, totalSupply and other ERC20 methods quite easily
   */
  useEffect(() => {
    if (!chainId || !poolInfo.length) {
      setPoolTokens([])
      return
    }

    const tokens: Token[] = []
    poolInfo.forEach(pool => {
      const token = new Token(chainId, pool.address, 18, 'BPT', `BPT: ${pool.pair}`)
      tokens.push(token)
    })

    setPoolTokens(tokens)
  }, [chainId, poolInfo])

  return { poolInfo, poolTokens }
}
