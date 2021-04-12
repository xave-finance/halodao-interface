import React, { useCallback, useEffect, useState } from 'react'
import { Text } from 'rebass'
import { ButtonOutlined, ButtonPrimaryNormal, ButtonSecondary } from '../Button'
import { AutoColumn } from '../Column'
import Row, { RowFixed, RowBetween } from '../Row'
import { FixedHeightRow } from '.'
import { CustomLightSpinner, ExternalLink, HideMedium } from 'theme'
import NumericalInput from 'components/NumericalInput'
import { GreyCard } from '../Card'
import { CardSection, DataCard } from 'components/earn/styled'
import styled from 'styled-components'
import { transparentize } from 'polished'
import HALO_REWARDS_ABI from '../../constants/haloAbis/Rewards.json'
import { useContract, useTokenContract } from 'hooks/useContract'
import { formatEther, parseEther } from 'ethers/lib/utils'
import Confetti from 'components/Confetti'
import Circle from '../../assets/images/blue-loader.svg'
import { HALO_REWARDS_ADDRESS, HALO_REWARDS_MESSAGE } from '../../constants/index'
import { useActiveWeb3React } from 'hooks'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { PoolInfo, TokenPrice } from 'halo-hooks/useBalancer'
import { getPoolLiquidity } from 'utils/balancer'
import { useTotalSupply } from 'data/TotalSupply'
import { toFormattedCurrency } from 'utils/currencyFormatter'

const BalanceCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.text4};
  overflow: hidden;
  text-align: center;
  margin-top: 10px;
`
const StyledFixedHeightRow = styled(FixedHeightRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
  `};
`
export const StyledCard = styled(GreyCard)<{ bgColor: any }>`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    background: ${({ theme }) => theme.bg3};
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 4px;
    box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
  `};
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: hidden;
  padding: .5rem;
  border-radius: 0px;
`

const StyledRowFixed = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
    margin-top: 0.5rem;
    align-items: flex-start;
    justify-content: flex-start;

    &:first-of-type {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 1rem;
      margin-bottom: 0.5rem;
      line-height: 16px;
      letter-spacing: 0.2rem;
    }
    &:last-of-type {
      width: 100%;
      margin-bottom: 0.5rem;
      margin-top: 1.5rem;
    }
  `};
`

const StyledText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    line-height: 16px;
    letter-spacing: 0.2rem;
  `};
  font-size: 12px;
`

const StyledTextForValue = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    font-size: 16px;
    line-height: 130%;
  `};
  font-size: 12px;
`

const StyledButton = styled(ButtonOutlined)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    background: ${({ theme }) => theme.bg2};
    color: white;
    width: 100%;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: 900;
    font-size: 16px;
    line-height: 150%;
  `};
  padding: 4px 8px;
  border-radius: 5px;
  width: fit-content;
  line-height: 130%;
`

const StyledButtonText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    font-size: 16px;
  `};
  font-weight: bold;
  font-size: 12px;
`

interface BalancerPoolCardProps {
  poolInfo: PoolInfo
  tokenPrice: TokenPrice
}

export default function BalancerPoolCard({ poolInfo, tokenPrice }: BalancerPoolCardProps) {
  const { chainId, account } = useActiveWeb3React()
  const [showMore, setShowMore] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [bptStaked, setBptStaked] = useState(0)
  const [bptStakedValue, setBptStakedValue] = useState(0)
  const [unclaimedHalo, setUnclaimedHalo] = useState(0)
  const [bptBalance, setBptBalance] = useState(0)
  const [loading, setLoading] = useState({
    staking: false,
    unstaking: false,
    claim: false,
    unstakeAndClaim: false,
    confetti: false
  })

  const rewardsContractAddress = chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined
  const rewardsContract = useContract(rewardsContractAddress, HALO_REWARDS_ABI)
  const lpTokenContract = useTokenContract(poolInfo.address)

  const backgroundColor = '#FFFFFF'

  const totalSupplyAmount = useTotalSupply(poolInfo.asToken)
  const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
  const bptPrice = totalSupply > 0 ? poolInfo.liquidity / totalSupply : 0

  // get bpt balance based on the token address in the poolInfo
  const getBptBalance = useCallback(async () => {
    const bptBalanceValue = lpTokenContract?.balanceOf(account)
    setBptBalance(+formatEther(await bptBalanceValue))
  }, [lpTokenContract, account])

  // checks the allowance and skips approval if already within the approved value
  const getAllowance = async () => {
    const currentAllowance = await lpTokenContract!.allowance(account, rewardsContractAddress)
    return +formatEther(currentAllowance)
  }

  const getUserTotalTokenslByPoolAddress = useCallback(async () => {
    const lpTokens = await rewardsContract?.getDepositedPoolTokenBalanceByUser(poolInfo.address, account)
    setBptStaked(+formatEther(lpTokens))

    // Get staked tokens value
    const stakedValue = +formatEther(lpTokens) * bptPrice
    setBptStakedValue(stakedValue)
  }, [rewardsContract, account, poolInfo.address, bptPrice])

  const getUnclaimedPoolReward = useCallback(async () => {
    const unclaimedHaloInPool = await rewardsContract?.getUnclaimedPoolRewardsByUserByPool(poolInfo.address, account)
    // we can leave this to monitor the whole big int
    console.log('Unclaimed HALO: ', unclaimedHaloInPool.toString())
    setUnclaimedHalo(+formatEther(unclaimedHaloInPool))
  }, [rewardsContract, account, poolInfo.address])

  useEffect(() => {
    getUserTotalTokenslByPoolAddress()
    getBptBalance()
    getUnclaimedPoolReward()
  }, [bptBalance, getUnclaimedPoolReward, getUserTotalTokenslByPoolAddress, getBptBalance])

  const stakeLpToken = async () => {
    setLoading({ ...loading, staking: true })
    const lpTokenAmount = parseEther(stakeAmount)
    try {
      const allowance = await getAllowance()
      if (allowance < +stakeAmount) {
        const approvalTxn = await lpTokenContract!.approve(rewardsContractAddress, lpTokenAmount.toString())
        await approvalTxn.wait()
      }

      const stakeLpTxn = await rewardsContract?.depositPoolTokens(poolInfo.address, lpTokenAmount.toString())
      const stakeLpTxnReceipt = await stakeLpTxn.wait()
      if (stakeLpTxnReceipt.status === 1) {
        setLoading({ ...loading, staking: false, confetti: true })
      } else {
        setLoading({ ...loading, staking: false })
      }
    } catch (e) {
      console.error('Stake error', e)
    }

    setStakeAmount('')
    getBptBalance()
    // make sure the confetti still activates without refereshing
    setTimeout(() => setLoading({ ...loading, confetti: false }), 3000)
  }

  const unstakeLpToken = async () => {
    setLoading({ ...loading, unstaking: true })
    const lpTokenAmount = parseEther(unstakeAmount)
    try {
      const unstakeLpTxn = await rewardsContract!.withdrawPoolTokens(poolInfo.address, lpTokenAmount.toString())
      await unstakeLpTxn.wait()
    } catch (e) {
      console.error(e)
    }

    setUnstakeAmount('')
    setLoading({ ...loading, unstaking: false })
    getBptBalance()
  }

  const claimPoolRewards = async () => {
    setLoading({ ...loading, claim: true })
    try {
      const claimPoolRewardsTxn = await rewardsContract!.withdrawUnclaimedPoolRewards(poolInfo.address)
      const claimPoolRewardsTxnReceipt = await claimPoolRewardsTxn.wait()
      if (claimPoolRewardsTxnReceipt.status === 1) {
        setLoading({ ...loading, claim: false, confetti: true })
      } else {
        setLoading({ ...loading, claim: false })
      }
    } catch (e) {
      console.error(e)
      setLoading({ ...loading, claim: false })
    }

    // make sure the confetti still activates without refereshing
    setTimeout(() => setLoading({ ...loading, confetti: false }), 3000)
  }

  const claimAndUnstakeRewards = async () => {
    setLoading({ ...loading, unstakeAndClaim: true })
    try {
      const unstakeLpTxn = await rewardsContract!.withdrawPoolTokens(poolInfo.address, parseEther(bptStaked.toString()))
      await unstakeLpTxn.wait()

      const claimPoolRewardsTxn = await rewardsContract!.withdrawUnclaimedPoolRewards(poolInfo.address)
      const claimPoolRewardsTxnReceipt = await claimPoolRewardsTxn.wait()
      if (claimPoolRewardsTxnReceipt.status === 1) {
        setLoading({ ...loading, claim: false, confetti: true })
      } else {
        setLoading({ ...loading, claim: false })
      }

      setLoading({ ...loading, unstakeAndClaim: false, confetti: true })
    } catch (e) {
      console.error(e)
      setLoading({ ...loading, unstakeAndClaim: false })
    }

    // make sure the confetti still activates without refereshing
    setTimeout(() => setLoading({ ...loading, confetti: false }), 3000)
  }

  return (
    <StyledCard bgColor={backgroundColor}>
      <AutoColumn gap="8px">
        <StyledFixedHeightRow>
          <StyledRowFixed gap="8px">
            <DoubleCurrencyLogo
              currency0={poolInfo.tokens[0].asToken}
              currency1={poolInfo.tokens[1].asToken}
              size={14}
            />
            &nbsp;
            <StyledTextForValue fontWeight={600}>
              {poolInfo.pair}
            </StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>
                Total Pool Value: 
              </StyledText> 
            </HideMedium>
            <StyledTextForValue>
              {toFormattedCurrency(getPoolLiquidity(poolInfo, tokenPrice))}
            </StyledTextForValue> 
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>
                Stakeable: 
              </StyledText>
            </HideMedium>
            <StyledTextForValue>
              {bptBalance.toFixed(2)} BPT
            </StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>
                Value Staked: 
              </StyledText>
            </HideMedium>
            <StyledTextForValue>
              {toFormattedCurrency(bptStakedValue)}
            </StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>
                Earned: 
              </StyledText>
            </HideMedium>
            <StyledTextForValue>
              {unclaimedHalo} HALO
            </StyledTextForValue>
          </StyledRowFixed>
          {account && (
            <StyledRowFixed>
              <StyledButton
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (
                  <>
                    <StyledButtonText>
                      Manage
                    </StyledButtonText>
                  </>
                ) : (
                  <>
                    <StyledButtonText>
                      Manage
                    </StyledButtonText>
                  </>
                )}
              </StyledButton>
            </StyledRowFixed>
          )}
        </StyledFixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <ButtonSecondary padding="8px" borderRadius="8px">
              <ExternalLink style={{ width: '100%', textAlign: 'center' }} href={poolInfo.balancerUrl}>
                To stake, get BPT tokens here <span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
            </ButtonSecondary>

            <FixedHeightRow>
              <Confetti start={loading.confetti} />
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
                disabled={!(parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) <= bptBalance) || loading.staking}
                onClick={stakeLpToken}
              >
                {loading.staking ? (
                  <>
                    {`${HALO_REWARDS_MESSAGE.staking}`}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
                ) : (
                  'Stake'
                )}
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={
                  !(parseFloat(unstakeAmount) > 0 && parseFloat(unstakeAmount) <= bptStaked) || loading.unstaking
                }
                onClick={unstakeLpToken}
              >
                {loading.unstaking ? (
                  <>
                    {`${HALO_REWARDS_MESSAGE.unstaking}`}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
                ) : (
                  'Unstake'
                )}
              </ButtonPrimaryNormal>
            </RowBetween>

            <Row justify="center">
              <BalanceCard>
                <CardSection>
                  <Text fontSize={16} fontWeight={500}>
                    Rewards earned: {unclaimedHalo.toFixed(2)} HALO
                  </Text>
                </CardSection>
              </BalanceCard>
            </Row>

            <RowBetween marginTop="10px">
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(unclaimedHalo > 0) || loading.claim}
                onClick={claimPoolRewards}
              >
                {loading.claim ? (
                  <>
                    {`${HALO_REWARDS_MESSAGE.claiming}`}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
                ) : (
                  'Claim Rewards'
                )}
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(unclaimedHalo > 0 && bptStaked > 0) || loading.unstakeAndClaim}
                onClick={claimAndUnstakeRewards}
              >
                {loading.unstakeAndClaim ? (
                  <>
                    {`${HALO_REWARDS_MESSAGE.unstakeAndClaim}`}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
                ) : (
                  'Unstake and claim rewards'
                )}
              </ButtonPrimaryNormal>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
