import { ChainId } from '@halodao/sdk'
import { getHaloAddresses } from 'halo-hooks/useHaloAddresses'
import { ZERO_ADDRESS } from '../constants'

export enum AmmRewardsVersion {
  Latest = 'latest', // V2
  V0 = 'v0',
  V1 = 'v1',
  V1_1 = 'v1.1'
}

export const getAmmRewardsContractAddress = (chainId?: ChainId, version = AmmRewardsVersion.Latest) => {
  const haloAddresses = getHaloAddresses(chainId)

  /**
   * Pre-V2, there used to be separate AMM for different versions, such as v0, v1 & v1.1
   */
  if (version === AmmRewardsVersion.V0 || version === AmmRewardsVersion.V1) {
    return ZERO_ADDRESS
  }

  return haloAddresses.rewards.ammRewards
}
