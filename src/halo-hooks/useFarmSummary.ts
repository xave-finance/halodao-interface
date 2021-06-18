import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useTokenBalances, useTokenTotalSuppliesWithLoadingIndicator } from 'state/wallet/hooks'
import { PoolInfo } from './usePoolInfo'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { useUnclaimedRewardsPerPool, useStakedBPTPerPool } from './useRewards'
import useHaloHalo from './useHaloHalo'

const useFarmSummary = (poolsInfo: PoolInfo[]) => {
  // Get user balance for each pool
  const { account } = useActiveWeb3React()
  const { haloHaloPrice } = useHaloHalo()
  const poolsAsTokens = poolsInfo.map(poolInfo => poolInfo.asToken)
  const balances = useTokenBalances(account ?? undefined, poolsAsTokens)

  // Get totalSupply of each pool
  const totalSupplies = useTokenTotalSuppliesWithLoadingIndicator(poolsAsTokens)[0]

  // Get user total claimed HALO (claimeed + unclaimed on all pools)
  const poolIds = poolsInfo.map((_, index) => index)
  const unclaimedRewards = useUnclaimedRewardsPerPool(poolIds)

  // Get user staked BPT per pool
  const stakedBPTs = useStakedBPTPerPool(poolIds)

  // Denotes how many rewards token in 1 HALO
  const rewardsToHALOPrice = Number.parseFloat(haloHaloPrice)

  /**
   * Main logic to calculate pool summary based on the inputs above
   */
  return useMemo(() => {
    if (!poolsInfo.length) {
      return {
        stakeableValue: '$ --',
        stakedValue: '$ --',
        haloEarned: '--'
      }
    }

    let totalStakeableValue = 0
    let totalStakedValue = 0
    let totalHALOEarned = 0

    for (const [index, poolInfo] of poolsInfo.entries()) {
      // Add unclaimed HALO per pool to totalHALOEarned
      const unclaimedPoolRewards = unclaimedRewards[index] ?? 0
      totalHALOEarned += unclaimedPoolRewards * rewardsToHALOPrice

      // Calculate BPT price per pool
      // FORMULA: BPT price = liquidity / totalSupply
      const totalSupplyAmount = totalSupplies[poolInfo.address]
      const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
      const bptPrice = totalSupply > 0 ? poolInfo.liquidity / totalSupply : 0

      // Add steakeable value for this pool to totalStakeableValue
      // FORMULA: Stakeable value = BPT price * BPT balance
      const poolBalanceAmount = balances[poolInfo.address]
      const poolBalance = poolBalanceAmount ? parseFloat(formatEther(`${poolBalanceAmount.raw}`)) : 0
      const stakeableValue = poolBalance * bptPrice
      totalStakeableValue += stakeableValue

      // Add staked value for this pool to totalStakedValue
      // FORMULA: Staked value = BPT price * BPT staked
      const stakedValue = stakedBPTs[index]
      if (stakedValue) {
        totalStakedValue += stakedValue * bptPrice
      }
    }

    return {
      stakeableValue: formatNumber(totalStakeableValue, NumberFormat.usd),
      stakedValue: formatNumber(totalStakedValue, NumberFormat.usd),
      haloEarned: formatNumber(totalHALOEarned)
    }
  }, [poolsInfo, balances, totalSupplies, unclaimedRewards, stakedBPTs, rewardsToHALOPrice])
}

export default useFarmSummary
