import { BalancerPoolInfo } from 'components/PositionCard/BalancerPoolCard'
import { BALANCER_SUBGRAPH_URL } from '../constants'
import { useEffect, useState } from 'react'
import { subgraphRequest } from 'utils/balancer'

export const useBalancer = (poolAddresses: string[]) => {
  const [poolInfo, setPoolInfo] = useState<BalancerPoolInfo[]>([])

  // Convert addresses to lowercase (cause subgraph api is case-sensitive)
  poolAddresses = poolAddresses.map(address => address.toLowerCase())

  useEffect(() => {
    const fetchPoolInfo = async () => {
      const query = {
        pools: {
          __args: {
            where: {
              id_in: poolAddresses
            }
          },
          tokens: {
            symbol: true,
            address: true
          }
        }
      }

      console.log('query:', query)
      const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)
      console.log('result:', result)
    }

    fetchPoolInfo()
  }, [poolAddresses])

  return poolInfo
}
