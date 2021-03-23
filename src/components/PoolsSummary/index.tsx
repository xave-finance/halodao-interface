import { Token } from '@sushiswap/sdk'
import { AutoColumn } from 'components/Column'
import { CardSection, DataCard } from 'components/earn/styled'
import { RowBetween } from 'components/Row'
import { BALANCER_SUBGRAPH_URL, HALO_REWARDS_ADDRESS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import { transparentize } from 'polished'
import React, { useContext, useEffect, useState } from 'react'
import { useTokenBalances, useTokenTotalSuppliesWithLoadingIndicator } from 'state/wallet/hooks'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from 'theme'
import useUSDCPrice from 'utils/useUSDCPrice'
import { useContract } from 'sushi-hooks/useContract'
import HALO_REWARDS_ABI from '../../constants/haloAbis/Rewards.json'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { subgraphRequest } from 'utils/balancer'

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.text4};
  overflow: hidden;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

interface PoolsSummaryProps {
  poolTokens: Token[]
}

const PoolsSummary = ({ poolTokens }: PoolsSummaryProps) => {
  const { account, chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)
  const [summary, setSummary] = useState({
    stakeableValue: '$ --',
    stakedValue: '$ --',
    haloEarned: '--'
  })

  // Get user balance for each pool token
  const balances = useTokenBalances(account ?? undefined, poolTokens)
  console.log('balances:', balances)

  // Get totalSupply of each pool token
  const totalSupplies = useTokenTotalSuppliesWithLoadingIndicator(poolTokens)[0]
  console.log('totalSupplies:', totalSupplies)

  useEffect(() => {
    if (!chainId || !rewardsContract || !account || !poolTokens.length) return

    const getPoolSummary = async () => {
      console.log('getPoolSummary triggerd!')
      let totalStakeableValue = 0
      let totalStakedValue = 0
      const claimedHalo: BigNumber = await rewardsContract.getTotalRewardsClaimedByUser(account)

      for (const pool of poolTokens) {
        // Get unclaimed HALO earned per pool (then add to total HALO earnings)
        const unclaimedHalo: BigNumber = await rewardsContract.getUnclaimedPoolRewardsByUserByPool(
          pool.address,
          account
        )
        claimedHalo.add(unclaimedHalo)

        // Get BPT price per pool
        // (this is required to calculate both stakeable & staked value)
        // formula: liquidity / totalSupply
        const query = {
          pool: {
            __args: {
              id: pool.address.toLowerCase()
            },
            id: true,
            liquidity: true
          }
        }
        const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)
        const liquidity = parseFloat(result.pool.liquidity)
        const totalSupplyAmount = totalSupplies[pool.address]
        const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
        const bptPrice = totalSupply > 0 ? liquidity / totalSupply : 0

        // Get BPT stakeable value per pool (BPT price * BPT balance)
        const poolBalanceAmount = balances[pool.address]
        const poolBalance = poolBalanceAmount ? parseFloat(formatEther(`${poolBalanceAmount.raw}`)) : 0
        const stakeableValue = poolBalance * bptPrice
        totalStakeableValue += stakeableValue

        // Get BPT staked value per pool (BPT price * BPT staked)
        const staked: BigNumber = await rewardsContract.getDepositedPoolTokenBalanceByUser(pool.address, account)
        const stakedValue = parseFloat(formatEther(`${staked}`)) * bptPrice
        totalStakedValue += stakedValue
      }

      setSummary({
        stakeableValue: `$ ${totalStakeableValue.toFixed(4)}`,
        stakedValue: `$ ${totalStakedValue.toFixed(4)}`,
        haloEarned: formatEther(claimedHalo)
      })
    }

    getPoolSummary()
  }, [chainId, rewardsContract, account, poolTokens, totalSupplies])

  return (
    <VoteCard>
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My Stakeable Value
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My Staked Value
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My HALO Earned
            </TYPE.white>
          </RowBetween>
          <RowBetween>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.stakeableValue}
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.stakedValue}
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.haloEarned} HALO
            </TYPE.white>
          </RowBetween>
        </AutoColumn>
      </CardSection>
    </VoteCard>
  )
}

export default PoolsSummary
