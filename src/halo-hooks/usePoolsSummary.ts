import { HALO_REWARDS_ADDRESS } from '../constants'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { useTokenBalances, useTokenTotalSuppliesWithLoadingIndicator } from 'state/wallet/hooks'
import { useContract } from 'sushi-hooks/useContract'
import HALO_REWARDS_ABI from '../constants/haloAbis/Rewards.json'
import { PoolInfo } from './useBalancer'
import { toFormattedCurrency } from 'utils/currencyFormatter'

const usePoolsSummary = (poolsInfo: PoolInfo[]) => {
  const { account, chainId } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)
  const [summary, setSummary] = useState({
    stakeableValue: '$ --',
    stakedValue: '$ --',
    haloEarned: '--'
  })

  // Get user balance for each pool token
  const poolsAsTokens = poolsInfo.map(poolInfo => poolInfo.asToken)
  const balances = useTokenBalances(account ?? undefined, poolsAsTokens)

  // Get totalSupply of each pool token
  const totalSupplies = useTokenTotalSuppliesWithLoadingIndicator(poolsAsTokens)[0]

  useEffect(() => {
    if (
      !chainId ||
      !account ||
      !rewardsContract ||
      !poolsInfo.length ||
      !Object.keys(balances).length ||
      !Object.keys(totalSupplies).length
    ) {
      return
    }

    const getPoolSummary = async () => {
      let totalStakeableValue = 0
      let totalStakedValue = 0
      const claimedHalo: BigNumber = await rewardsContract.getTotalRewardsClaimedByUser(account)

      for (const poolInfo of poolsInfo) {
        // Get unclaimed HALO earned per pool (then add to total HALO earnings)
        const unclaimedHalo: BigNumber = await rewardsContract.getUnclaimedPoolRewardsByUserByPool(
          poolInfo.address,
          account
        )
        claimedHalo.add(unclaimedHalo)

        // Get BPT price per pool
        // (this is required to calculate both stakeable & staked value)
        // formula: price = liquidity / totalSupply
        const totalSupplyAmount = totalSupplies[poolInfo.address]
        const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
        const bptPrice = totalSupply > 0 ? poolInfo.liquidity / totalSupply : 0

        // Get BPT stakeable value per pool (BPT price * BPT balance)
        const poolBalanceAmount = balances[poolInfo.address]
        const poolBalance = poolBalanceAmount ? parseFloat(formatEther(`${poolBalanceAmount.raw}`)) : 0
        const stakeableValue = poolBalance * bptPrice
        totalStakeableValue += stakeableValue

        // Get BPT staked value per pool (BPT price * BPT staked)
        const staked: BigNumber = await rewardsContract.getDepositedPoolTokenBalanceByUser(poolInfo.address, account)
        const stakedValue = parseFloat(formatEther(`${staked}`)) * bptPrice
        totalStakedValue += stakedValue
      }

      setSummary({
        stakeableValue: toFormattedCurrency(totalStakeableValue, 4),
        stakedValue: toFormattedCurrency(totalStakedValue, 4),
        haloEarned: formatEther(claimedHalo)
      })
    }

    getPoolSummary()
  }, [chainId, rewardsContract, account, poolsInfo, balances, totalSupplies])

  return summary
}

export default usePoolsSummary
