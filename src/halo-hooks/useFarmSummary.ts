import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useTokenBalances, useTokenTotalSuppliesWithLoadingIndicator } from 'state/wallet/hooks'
import { PoolInfo } from './usePoolInfo'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { useUnclaimedRewardsPerPool, useStakedBPTPerPool } from './useRewards'
import { getPoolLiquidity } from 'utils/poolInfo'
import { TokenPrice } from './useTokenPrice'
import { PENDING_REWARD_FAILED } from 'constants/pools'

const useFarmSummary = (poolsInfo: PoolInfo[], tokenPrice: TokenPrice) => {
  // Get user balance for each pool
  const { account } = useActiveWeb3React()
  const poolsAsTokens = poolsInfo.map(poolInfo => poolInfo.asToken)
  const balances = useTokenBalances(account ?? undefined, poolsAsTokens)

  // Get totalSupply of each pool
  const totalSupplies = useTokenTotalSuppliesWithLoadingIndicator(poolsAsTokens)[0]

  // Get user total claimed HALO (claimed + unclaimed on all pools)
  const poolIds = poolsInfo.map(pool => pool.pid)
  const unclaimedRewards = useUnclaimedRewardsPerPool(poolIds)

  // Get user staked BPT per pool
  const stakedBPTs = useStakedBPTPerPool(poolIds)

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

    for (const poolInfo of poolsInfo) {
      // Add unclaimed HALO per pool to totalHALOEarned
      let unclaimedPoolRewards = unclaimedRewards[poolInfo.pid] ?? 0
      unclaimedPoolRewards = unclaimedPoolRewards === PENDING_REWARD_FAILED ? 0 : unclaimedPoolRewards
      totalHALOEarned += unclaimedPoolRewards

      // Calculate LPToken price per pool
      // FORMULA: LPToken price = liquidity / totalSupply
      const totalSupplyAmount = totalSupplies[poolInfo.address]
      const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
      const liquidity = getPoolLiquidity(poolInfo, tokenPrice)
      const lpTokenPrice = totalSupply > 0 && liquidity > 0 ? liquidity / totalSupply : 0

      // Add steakeable value for this pool to totalStakeableValue
      // FORMULA: Stakeable value = LPToken price * LPToken balance
      const poolBalanceAmount = balances[poolInfo.address]
      const poolBalance = poolBalanceAmount ? parseFloat(formatEther(`${poolBalanceAmount.raw}`)) : 0
      const stakeableValue = poolBalance * lpTokenPrice
      totalStakeableValue += stakeableValue

      // Add staked value for this pool to totalStakedValue
      // FORMULA: Staked value = LPToken price * LPToken staked
      const stakedValue = stakedBPTs[poolInfo.pid]
      if (stakedValue) {
        totalStakedValue += stakedValue * lpTokenPrice
      }
    }

    return {
      stakeableValue: formatNumber(totalStakeableValue, NumberFormat.usd),
      stakedValue: formatNumber(totalStakedValue, NumberFormat.usd),
      haloEarned: formatNumber(totalHALOEarned)
    }
  }, [poolsInfo, balances, totalSupplies, unclaimedRewards, stakedBPTs, tokenPrice])
}

export default useFarmSummary
