import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useTokenBalances, useTokenTotalSuppliesWithLoadingIndicator } from 'state/wallet/hooks'
import { PoolInfo } from './useBalancer'
import { toFormattedCurrency } from 'utils/currencyFormatter'
import { useStakedBPTPerPool, useTotalClaimedHALO, useUnclaimedHALOPerPool } from './useRewards'

const usePoolsSummary = (poolsInfo: PoolInfo[]) => {
  // Get user balance for each pool
  const { account } = useActiveWeb3React()
  const poolsAsTokens = poolsInfo.map(poolInfo => poolInfo.asToken)
  const balances = useTokenBalances(account ?? undefined, poolsAsTokens)

  // Get totalSupply of each pool
  const totalSupplies = useTokenTotalSuppliesWithLoadingIndicator(poolsAsTokens)[0]

  // Get user total claimed HALO (all pools)
  const claimedHALO = useTotalClaimedHALO()

  // Get user unclaimed HALO per pool
  const poolAddresses = poolsInfo.map(poolInfo => poolInfo.address)
  const unclaimedHALOs = useUnclaimedHALOPerPool(poolAddresses)

  // Get user staked BPT per pool
  const stakedBPTs = useStakedBPTPerPool(poolAddresses)

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
    let totalHALOEarned = claimedHALO

    for (const poolInfo of poolsInfo) {
      // Add unclaimed HALO per pool to totalHALOEarned
      const unclaimed = unclaimedHALOs[poolInfo.address]
      if (unclaimed) {
        totalHALOEarned += unclaimed
      }

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
      const stakedValue = stakedBPTs[poolInfo.address]
      if (stakedValue) {
        totalStakedValue += stakedValue * bptPrice
      }
    }

    return {
      stakeableValue: toFormattedCurrency(totalStakeableValue, 4),
      stakedValue: toFormattedCurrency(totalStakedValue, 4),
      haloEarned: totalHALOEarned.toFixed(2)
    }
  }, [poolsInfo, balances, totalSupplies, claimedHALO, unclaimedHALOs, stakedBPTs])
}

export default usePoolsSummary
