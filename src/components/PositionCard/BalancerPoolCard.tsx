import React, { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import { ButtonEmpty, ButtonPrimaryNormal, ButtonSecondary } from '../Button'
import { AutoColumn } from '../Column'
import Row, { RowFixed, AutoRow, RowBetween } from '../Row'
import { FixedHeightRow, StyledPositionCard } from '.'
import { ExternalLink } from 'theme'
import NumericalInput from 'components/NumericalInput'
import { CardSection, DataCard } from 'components/earn/styled'
import styled from 'styled-components'
import { transparentize } from 'polished'
import HALO_REWARDS_ABI from '../../constants/haloAbis/Rewards.json'
import { useContract, useTokenContract } from 'hooks/useContract'
import { formatEther, parseEther } from 'ethers/lib/utils'

const HALO_REWARDS_ADDRESS = process.env.REACT_APP_HALO_REWARDS_ADDRESS

const BalanceCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.text4};
  overflow: hidden;
  text-align: center;
  margin-top: 10px;
`

export interface BalancerPoolInfo {
  pair: string
  address: string
  balancerUrl: string
  tokenAddress: string
}

interface BalancerPoolCardProps {
  account: string | null | undefined
  poolInfo: BalancerPoolInfo
}

export default function BalancerPoolCard({ account, poolInfo }: BalancerPoolCardProps) {
  const [showMore, setShowMore] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [allowance, setAllowance] = useState(0)
  const [bptStaked, setBptStaked] = useState(0)
  const [unclaimedHalo, setUnclaimedHalo] = useState(0)
  const [bptBalance, setBptBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  const LP_TOKEN_ADDRESS = poolInfo.tokenAddress
  const rewardsContract = useContract(HALO_REWARDS_ADDRESS, HALO_REWARDS_ABI)
  const lpTokenContract = useTokenContract(LP_TOKEN_ADDRESS)
  const backgroundColor = '#FFFFFF'

  // get bpt balance based on the token address in the poolInfo
  const getBptBalance = useCallback(async () => {
    const bptBalanceValue = lpTokenContract?.balanceOf(account)
    setBptBalance(+formatEther(await bptBalanceValue))
  }, [lpTokenContract, account])

  // checks the allowance and skips approval if already within the approved value
  const getAllowance = useCallback(async () => {
    const currentAllowance = await lpTokenContract!.allowance(account, HALO_REWARDS_ADDRESS)
    setAllowance(+formatEther(currentAllowance))
  }, [lpTokenContract, account])

  const getUserTotalTokenslByPoolAddress = useCallback(async () => {
    const lpTokens = await rewardsContract?.getUserLpTokens(poolInfo.address, account)

    setBptStaked(+formatEther(lpTokens))
  }, [rewardsContract, account, poolInfo.address])

  const getUnclaimedPoolReward = useCallback(async () => {
    const unclaimedHaloInPool = await rewardsContract?.pendingAmmLpUserRewards(poolInfo.address, account)
    console.log(unclaimedHaloInPool.toString())
    setUnclaimedHalo(+formatEther(unclaimedHaloInPool))
  }, [rewardsContract, account, poolInfo.address])

  useEffect(() => {
    getUserTotalTokenslByPoolAddress()
    getAllowance()
    getUnclaimedPoolReward()
    getBptBalance()
  }, [bptBalance, getAllowance, getUnclaimedPoolReward, getUserTotalTokenslByPoolAddress, getBptBalance])

  const stakeLpToken = async () => {
    setLoading(true)
    const lpTokenAmount = parseEther(stakeAmount)

    if (allowance < +stakeAmount) {
      const approvalTxn = await lpTokenContract!.approve(HALO_REWARDS_ADDRESS, lpTokenAmount)
      await approvalTxn.wait()
    }

    const stakeLpTxn = await rewardsContract?.depositAmmLpTokens(poolInfo.address, lpTokenAmount.toString())
    const stakeLpResponse = await stakeLpTxn.wait()
    console.log('StakeLpResponse: ', stakeLpResponse)
    setStakeAmount('')
    setLoading(false)
    getBptBalance()
  }

  const unstakeLpToken = async () => {
    setLoading(true)
    const lpTokenAmount = parseEther(unstakeAmount)

    const unstakeLpTxn = await rewardsContract!.withdrawAmmLpTokens(poolInfo.address, lpTokenAmount.toString())
    const unstakeLpResponse = await unstakeLpTxn.wait()

    console.log('UnstakeLpResponse: ', unstakeLpResponse)
    setUnstakeAmount('')
    setLoading(false)
    getBptBalance()
  }

  const claimPoolRewards = async () => {
    setLoading(true)
    const claimPoolRewardsTxn = await rewardsContract!.withdrawPendingAmmLpRewards(poolInfo.address)
    const claimPoolRewardsResponse = await claimPoolRewardsTxn.wait()

    console.log('ClaimPoolRewardsResponse: ', claimPoolRewardsResponse)
    setLoading(false)
  }

  return (
    <StyledPositionCard bgColor={backgroundColor}>
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <Text fontWeight={500} fontSize={20}>
              {poolInfo.pair}
            </Text>
          </AutoRow>
          {account && (
            <RowFixed gap="8px">
              <ButtonEmpty
                padding="6px 8px"
                borderRadius="20px"
                width="fit-content"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (
                  <>
                    Manage
                    <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                  </>
                ) : (
                  <>
                    Manage
                    <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                  </>
                )}
              </ButtonEmpty>
            </RowFixed>
          )}
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <ButtonSecondary padding="8px" borderRadius="8px">
              <ExternalLink style={{ width: '100%', textAlign: 'center' }} href={poolInfo.balancerUrl}>
                To stake, get BPT tokens here <span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
            </ButtonSecondary>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Balance: {bptBalance.toFixed(2)} BPT
              </Text>
              <Text fontSize={16} fontWeight={500}>
                Staked: {bptStaked.toFixed(2)} BPT
              </Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <NumericalInput value={stakeAmount} onUserInput={amount => setStakeAmount(amount)} />
              <NumericalInput value={unstakeAmount} onUserInput={amount => setUnstakeAmount(amount)} />
            </RowBetween>

            <RowBetween marginTop="10px">
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(parseInt(stakeAmount) > 0 && parseInt(stakeAmount) <= bptBalance) || loading}
                onClick={stakeLpToken}
              >
                Stake
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(parseInt(unstakeAmount) > 0 && parseInt(unstakeAmount) <= bptStaked) || loading}
                onClick={unstakeLpToken}
              >
                Unstake
              </ButtonPrimaryNormal>
            </RowBetween>

            <Row justify="center">
              <BalanceCard>
                <CardSection>
                  <Text fontSize={16} fontWeight={500}>
                    Rewards earned: {unclaimedHalo} HALO
                  </Text>
                </CardSection>
              </BalanceCard>
            </Row>

            <RowBetween marginTop="10px">
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(unclaimedHalo > 0) || loading}
                onClick={claimPoolRewards}
              >
                Claim rewards
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(unclaimedHalo > 0 && bptStaked > 0)}
              >
                Unstake and claim rewards
              </ButtonPrimaryNormal>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
