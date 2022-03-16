import { useEffect, useState } from 'react'
import { BalancerSDK, Network } from '@balancer-labs/sdk'
import { RPC } from 'connectors'
import { ChainId } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'

const getBalancerNetwork = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.ARBITRUM:
      return Network.ARBITRUM
    case ChainId.MATIC:
      return Network.POLYGON
    case ChainId.RINKEBY:
      return Network.RINKEBY
    case ChainId.KOVAN:
      return Network.KOVAN
    case ChainId.ROPSTEN:
      return Network.ROPSTEN
    case ChainId.GÖRLI:
      return Network.GÖRLI
    default:
      return Network.MAINNET
  }
}

const useBalancerSDK = () => {
  const { chainId } = useActiveWeb3React()

  const [balancer, setBalancer] = useState(() => {
    return new BalancerSDK({
      network: Network.MAINNET,
      rpcUrl: RPC[ChainId.MAINNET]
    })
  })

  useEffect(() => {
    if (!chainId) return

    setBalancer(
      new BalancerSDK({
        network: getBalancerNetwork(chainId),
        rpcUrl: RPC[chainId]
      })
    )
  }, [chainId])

  return balancer
}

export default useBalancerSDK
