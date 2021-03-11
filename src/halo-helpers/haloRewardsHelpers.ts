// TODO: Check sushi implementation
import { ethers } from 'ethers'
import { useTokenContract } from 'hooks/useContract'
import { useContract } from 'sushi-hooks/useContract'
import HALO_REWARDS_ABI from '../constants/haloAbis/Rewards/Rewards.json'

// Kovan addresses
const HALO_REWARDS_ADDRESS = '0xA48e6bCcE78C99e7C2dd60a639bF81c55FA73857'

// useContract uses current account
const rewardsContract = useContract(HALO_REWARDS_ADDRESS, HALO_REWARDS_ABI)

export const stakeLpToken = (lpAddress: string, lpTokenAddress: string, amount: number) => {
  const lpTokenContract = useTokenContract(lpTokenAddress)
  const lpTokenAmount = ethers.utils.parseEther(`${amount}`)
  try {
    // TODO: Check if needed, the LP Token Dummy contract from the rewards contract does not need to be approved
    // Reference: https://github.com/HaloDAO/halo-rewards/blob/80839425a9abe08357c072953c81913ed9414280/hardhat/contracts/Rewards.sol#L210
    lpTokenContract!.approve(HALO_REWARDS_ADDRESS, lpTokenAmount)
    rewardsContract!.depositAmmLpTokens(lpAddress, lpTokenAmount)
  } catch (error) {
    console.error(error)
  }
}

export const unStakeLpToken = (lpAddress: string, amount: number) => {
  try {
    rewardsContract!.withdrawAmmLpTokens(lpAddress, ethers.utils.parseEther(`${amount}`))
  } catch (error) {
    console.error(error)
  }
}

export const claimLpHALORewards = (lpAddress: string) => {
  try {
    rewardsContract!.withdrawPendingAmmLpRewards(lpAddress)
  } catch (error) {
    console.error(error)
  }
}

// TODO: change account address from the hook that this repo use
export const getUnclaimedHALORewardForPool = (lpAddress: string, accountAddress: string) => {
  try {
    const unclaimedHaloInPool = rewardsContract!.pendingAmmLpUserRewards(lpAddress, accountAddress)

    return unclaimedHaloInPool
  } catch (error) {
    console.error(error)
  }
}
