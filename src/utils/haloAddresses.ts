import { mainnet, rinkeby, kovan, matic, arb, arbTestnet } from '@halodao/halodao-contract-addresses'
import { ChainId } from '@halodao/sdk'

export const getHaloAddresses = (chainId?: ChainId) => {
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
