import { ChainId } from '@halodao/sdk'
import { HALO_REWARDS_V1_ADDRESS, HALO_REWARDS_ADDRESS, HALO_REWARDS_V1_1_ADDRESS } from '../constants'

export enum AmmRewardsVersion {
  Latest = 'latest',
  V0 = 'v0',
  V1 = 'v1'
}

export const getAmmRewardsContractAddress = (chainId?: ChainId, version = AmmRewardsVersion.Latest) => {
  let address: string | undefined = undefined

  if (chainId === ChainId.MATIC || chainId === ChainId.ARBITRUM || chainId === ChainId.ARBITRUM_TESTNET) {
    /**
     * On MATIC & RBITRUM latest & "ONLY" version is AmmRewards v1.0
     *
     * AmmRewards Changelog:
     * v1.0 - (halo AMM) initial release
     **/
    if (version === AmmRewardsVersion.Latest) {
      address = HALO_REWARDS_V1_ADDRESS[chainId]
    }
  } else {
    /**
     * On MAINNET/KOVAN, latest version is AmmRewards v1.1
     *
     * AmmRewards Changelog:
     * v1.1 - (halo AMM, UNI) correct rewardToken
     * v1.0 - (halo AMM, UNI) wrong rewardToken
     * v0 - (balancer, UNI) initial release
     **/
    address = chainId
      ? version === AmmRewardsVersion.V0
        ? HALO_REWARDS_ADDRESS[chainId]
        : version === AmmRewardsVersion.V1
        ? HALO_REWARDS_V1_ADDRESS[chainId]
        : HALO_REWARDS_V1_1_ADDRESS[chainId]
      : undefined
  }

  return address
}
