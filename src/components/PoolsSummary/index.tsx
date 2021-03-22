import { Token, TokenAmount } from '@sushiswap/sdk'
import { AutoColumn } from 'components/Column'
import { CardSection, DataCard } from 'components/earn/styled'
import { RowBetween } from 'components/Row'
import { HALO, HALO_REWARDS_ADDRESS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import { transparentize } from 'polished'
import React, { useContext, useEffect, useState } from 'react'
import { useTokenBalance, useTokenBalances } from 'state/wallet/hooks'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from 'theme'
import useUSDCPrice from 'utils/useUSDCPrice'
import { useContract } from 'sushi-hooks/useContract'
import HALO_REWARDS_ABI from '../../constants/haloAbis/Rewards.json'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

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

  const balances = useTokenBalances(account ?? undefined, poolTokens)
  console.log('balances:', balances)

  const [summary, setSummary] = useState({
    stakableValue: '$ --',
    stakedValue: '$ --',
    haloEarned: '--'
  })

  useEffect(() => {
    if (!rewardsContract || !account || !poolTokens.length) return

    const getTotalHaloRewards = async () => {
      // Get claimed halo
      const claimedHalo: BigNumber = await rewardsContract.getTotalRewardsClaimedByUser(account)
      let totalStakedValue = 0

      // Get unclaimed halo for each pool & add to claimed
      for (const pool of poolTokens) {
        const unclaimedHalo: BigNumber = await rewardsContract.getUnclaimedPoolRewardsByUserByPool(
          pool.address,
          account
        )
        claimedHalo.add(unclaimedHalo)

        const bptPrice = 1
        const staked: BigNumber = await rewardsContract.getDepositedPoolTokenBalanceByUser(pool.address, account)
        console.log('staked:', staked.toString())
        totalStakedValue += staked.mul(bptPrice).toNumber()
      }

      console.log('totalStakedValue:', totalStakedValue.toString())

      setSummary({
        ...summary,
        haloEarned: formatEther(claimedHalo)
      })
    }

    getTotalHaloRewards()
  }, [rewardsContract, account, poolTokens])

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
              {summary.stakableValue}
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
