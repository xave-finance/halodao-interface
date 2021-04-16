import React, { useEffect, useState } from 'react'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
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
import { formatEther, parseEther } from 'ethers/lib/utils'
import Circle from '../../assets/images/blue-loader.svg'
import { HALO_REWARDS_ADDRESS, HALO_REWARDS_MESSAGE } from '../../constants/index'
import { useActiveWeb3React } from 'hooks'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { PoolInfo, TokenPrice } from 'halo-hooks/useBalancer'
import { getPoolLiquidity } from 'utils/balancer'
import { useTotalSupply } from 'data/TotalSupply'
import { toFormattedCurrency } from 'utils/currencyFormatter'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { JSBI, TokenAmount } from '@sushiswap/sdk'
import {
  useDepositWithdrawPoolTokensCallback,
  useStakedBPTPerPool,
  useUnclaimedHALOPerPool
} from 'halo-hooks/useRewards'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'

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
  :hover {
    background: ${({ theme }) => theme.bg2};
    color: white;
  }
`

const StyledButtonText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    font-size: 16px;
  `};
  font-weight: bold;
  font-size: 12px;
`

enum StakeButtonStates {
  Disabled,
  NotApproved,
  Approving,
  Approved,
  Staking
}

enum UnstakeButtonStates {
  Disabled,
  Enabled,
  Unstaking
}

interface BalancerPoolCardProps {
  poolInfo: PoolInfo
  tokenPrice: TokenPrice
}

export default function BalancerPoolCard({ poolInfo, tokenPrice }: BalancerPoolCardProps) {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [stakeButtonState, setStakeButtonState] = useState(StakeButtonStates.Disabled)
  const [unstakeButtonState, setUnstakeButtonState] = useState(UnstakeButtonStates.Disabled)
  const [isTxInProgress, setIsTxInProgress] = useState(false)

  // Get user BPT balance
  const bptBalanceAmount = useTokenBalance(poolInfo.address)
  const bptBalance = parseFloat(formatEther(bptBalanceAmount.value.toString()))

  // Get user staked BPT
  const stakedBPTs = useStakedBPTPerPool([poolInfo.address])
  const bptStaked = stakedBPTs[poolInfo.address]

  // Staked BPT value calculation
  const totalSupplyAmount = useTotalSupply(poolInfo.asToken)
  const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
  const bptPrice = totalSupply > 0 ? poolInfo.liquidity / totalSupply : 0
  const bptStakedValue = (bptStaked ?? 0) * bptPrice

  // Get user earned HALO
  const unclaimedHALOs = useUnclaimedHALOPerPool([poolInfo.address])
  const unclaimedHalo = unclaimedHALOs[poolInfo.address]

  // Make use of `useApproveCallback` for checking & setting allowance
  const rewardsContractAddress = chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined
  const tokenAmount = new TokenAmount(poolInfo.asToken, JSBI.BigInt(parseEther(stakeAmount === '' ? '0' : stakeAmount)))
  const [approveState, approveCallback] = useApproveCallback(tokenAmount, rewardsContractAddress)

  // Makse use of `useDepositWithdrawPoolTokensCallback` for deposit & withdraw poolTokens methods
  const [depositPoolTokens, withdrawPoolTokens] = useDepositWithdrawPoolTokensCallback()

  /**
   * Updating the state of stake button
   */
  useEffect(() => {
    if (isTxInProgress) return

    const amountAsFloat = parseFloat(stakeAmount)
    if (amountAsFloat > 0 && amountAsFloat <= bptBalance) {
      if (approveState === ApprovalState.APPROVED) {
        setStakeButtonState(StakeButtonStates.Approved)
      } else if (approveState === ApprovalState.PENDING) {
        setStakeButtonState(StakeButtonStates.Approving)
      } else {
        setStakeButtonState(StakeButtonStates.NotApproved)
      }
    } else {
      setStakeButtonState(StakeButtonStates.Disabled)
    }
  }, [approveState, stakeAmount, bptBalance, isTxInProgress])

  /**
   * Updating the state of unstake button
   */
  useEffect(() => {
    if (isTxInProgress) return

    const amountAsFloat = parseFloat(unstakeAmount)
    if (amountAsFloat > 0 && amountAsFloat <= bptStaked) {
      setUnstakeButtonState(UnstakeButtonStates.Enabled)
    } else {
      setUnstakeButtonState(UnstakeButtonStates.Disabled)
    }
  }, [unstakeAmount, bptStaked, isTxInProgress])

  /**
   * Approves the stake amount
   */
  const approveStakeAmount = async () => {
    setIsTxInProgress(true)
    setStakeButtonState(StakeButtonStates.Approving)

    await approveCallback()

    setIsTxInProgress(false)
  }

  /**
   * Stakes the LP token to Rewards contract
   */
  const stakeLpToken = async () => {
    setIsTxInProgress(true)
    setStakeButtonState(StakeButtonStates.Staking)

    try {
      const tx = await depositPoolTokens(poolInfo.address, parseFloat(stakeAmount) ?? 0)
      await tx.wait()
    } catch (e) {
      console.error('Stake error: ', e)
    }

    setStakeAmount('')
    setStakeButtonState(StakeButtonStates.Disabled)
    setIsTxInProgress(false)
  }

  /**
   * Unstake LP token from Rewards contract
   */
  const unstakeLpToken = async () => {
    setIsTxInProgress(true)
    setUnstakeButtonState(UnstakeButtonStates.Unstaking)

    try {
      const tx = await withdrawPoolTokens(poolInfo.address, parseFloat(unstakeAmount) ?? 0)
      await tx.wait()
    } catch (e) {
      console.error('Unstake error: ', e)
    }

    setUnstakeAmount('')
    setUnstakeButtonState(UnstakeButtonStates.Disabled)
    setIsTxInProgress(false)
  }

  return (
    <StyledCard bgColor="#FFFFFF" className="pool-card">
      <AutoColumn gap="8px">
        <StyledFixedHeightRow>
          <StyledRowFixed gap="8px">
            <DoubleCurrencyLogo
              currency0={poolInfo.tokens[0].asToken}
              currency1={poolInfo.tokens[1].asToken}
              size={14}
            />
            &nbsp;
            <StyledTextForValue fontWeight={600}>{poolInfo.pair}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>{t('totalPoolValue')}:</StyledText>
            </HideMedium>
            <StyledTextForValue>{toFormattedCurrency(getPoolLiquidity(poolInfo, tokenPrice))}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>{t('stakeable')}:</StyledText>
            </HideMedium>
            <StyledTextForValue>{bptBalance.toFixed(2)} BPT</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>{t('valueStaked')}</StyledText>
            </HideMedium>
            <StyledTextForValue>{toFormattedCurrency(bptStakedValue)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed>
            <HideMedium>
              <StyledText fontWeight={600}>{t('earned')}:</StyledText>
            </HideMedium>
            <StyledTextForValue>{unclaimedHalo} HALO</StyledTextForValue>
          </StyledRowFixed>
          {account && (
            <StyledRowFixed>
              <StyledButton onClick={() => setShowMore(!showMore)}>
                {showMore ? (
                  <>
                    <StyledButtonText>{t('manage')}</StyledButtonText>
                  </>
                ) : (
                  <>
                    <StyledButtonText>{t('manage')}</StyledButtonText>
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
                disabled={[StakeButtonStates.Disabled, StakeButtonStates.Approving, StakeButtonStates.Staking].includes(
                  stakeButtonState
                )}
                onClick={() => {
                  if (stakeButtonState === StakeButtonStates.Approved) {
                    stakeLpToken()
                  } else {
                    approveStakeAmount()
                  }
                }}
              >
                {(stakeButtonState === StakeButtonStates.Disabled ||
                  stakeButtonState === StakeButtonStates.Approved) && <>{t('stake')}</>}
                {stakeButtonState === StakeButtonStates.NotApproved && <>{t('approve')}</>}
                {stakeButtonState === StakeButtonStates.Approving && (
                  <>
                    {HALO_REWARDS_MESSAGE.approving}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
                )}
                {stakeButtonState === StakeButtonStates.Staking && (
                  <>
                    {HALO_REWARDS_MESSAGE.staking}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
                )}
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={[UnstakeButtonStates.Disabled, UnstakeButtonStates.Unstaking].includes(unstakeButtonState)}
                onClick={unstakeLpToken}
              >
                {(unstakeButtonState === UnstakeButtonStates.Disabled ||
                  unstakeButtonState === UnstakeButtonStates.Enabled) && <>{t('unstake')}</>}
                {unstakeButtonState === UnstakeButtonStates.Unstaking && (
                  <>
                    {HALO_REWARDS_MESSAGE.unstaking}&nbsp;
                    <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                  </>
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
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
