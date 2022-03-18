import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@halodao/sdk'
import { mainnet, rinkeby, kovan, matic, arb, arbTestnet } from '@halodao/halodao-contract-addresses'
import { AddressCollection } from '@halodao/halodao-contract-addresses/dist/types'

const getHaloAddresses = (chainId?: ChainId) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return mainnet
    case ChainId.KOVAN:
      return kovan
    case ChainId.RINKEBY:
      return rinkeby
    case ChainId.MATIC:
      return matic
    case ChainId.ARBITRUM:
      return arb
    case ChainId.ARBITRUM_TESTNET:
      return arbTestnet
    default:
      return mainnet
  }
}

const useHaloAddresses = () => {
  const [haloAddresses, setHaloAddresses] = useState<AddressCollection>(getHaloAddresses(ChainId.MAINNET))
  const { chainId } = useWeb3React()

  useEffect(() => {
    if (!chainId) return
    setHaloAddresses(getHaloAddresses(chainId))
  }, [chainId])

  return haloAddresses
}

export default useHaloAddresses
