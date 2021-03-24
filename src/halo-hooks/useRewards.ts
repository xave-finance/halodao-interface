import { HALO_REWARDS_ADDRESS } from '../constants'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { useCallback } from 'react'
import HALO_REWARDS_ABI from '../constants/haloAbis/Rewards.json'

export const useRewards = () => {
  const { chainId } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)

  const getAllPools = useCallback(async () => {
    if (!rewardsContract) return
    try {
      const pools = await rewardsContract.getWhitelistedAMMPoolAddresses()
      console.log('getWhitelistedAMMPoolAddresses: ', pools)
    } catch (err) {
      console.error('Error fetching AMM pools: ', err)
    }
  }, [rewardsContract])

  return { getAllPools }
}
