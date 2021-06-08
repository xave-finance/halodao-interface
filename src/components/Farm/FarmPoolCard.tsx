import React, { useEffect, useState } from 'react'
import { Card, Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { ChainId } from '@sushiswap/sdk'

import { ButtonHalo, ButtonHaloOutlined, ButtonOutlined, ButtonHaloStates, ButtonHaloSimpleStates } from '../Button'
import Column, { AutoColumn } from '../Column'
import Row, { RowFixed, RowBetween, RowFlat } from '../Row'
import { FixedHeightRow } from '../PositionCard'
import { CustomLightSpinner, ExternalLink, HideSmall, TYPE, ButtonText } from 'theme'
import NumericalInput from 'components/NumericalInput'
import { GreyCard } from '../Card'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { formatEther, parseEther } from 'ethers/lib/utils'
import Spinner from '../../assets/images/spinner.svg'
import SpinnerPurple from '../../assets/images/spinner-purple.svg'
import BunnyMoon from '../../assets/svg/bunny-with-moon.svg'
import BunnyRewards from '../../assets/svg/bunny-rewards.svg'
import ArrowRight from '../../assets/svg/arrow-right.svg'
import LinkIcon from '../../assets/svg/link-icon.svg'
import { HALO_REWARDS_ADDRESS, HALO_REWARDS_MESSAGE } from '../../constants/index'
import { useActiveWeb3React } from 'hooks'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { PoolInfo, TokenPrice } from 'halo-hooks/useBalancer'
import { getPoolLiquidity } from 'utils/balancer'
import { useTotalSupply } from 'data/TotalSupply'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { JSBI, TokenAmount } from '@sushiswap/sdk'
import {
  useDepositWithdrawHarvestCallback,
  useStakedBPTPerPool,
  useUnclaimedRewardsPerPool,
  useRewardTokenPerSecond,
  useTotalAllocPoint
} from 'halo-hooks/useRewards'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import { ErrorText } from 'components/Alerts'
import { updatePoolToHarvest } from 'state/user/actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import useHaloHalo from 'halo-hooks/useHaloHalo'
import { HALO_TOKEN_ADDRESS } from '../../constants/index'

const StyledFixedHeightRowCustom = styled(FixedHeightRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    padding: 0 30px 20px;
  `};
`

const StyledCard = styled(GreyCard)<{ bgColor: any }>`
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: visible;
  padding: 5px 0 5px 0;
  border-radius: 0px;

  ${({ theme }) => theme.mediaWidth.upToSmall`  
    background: #ffffff;
    padding: 5px 0 0 0;
    border-radius: 4px;
    box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    border-radius: 5px;
    border: 1px solid #15006d;

    &.expanded {
      border-bottom: none;
    }
  `};
`

const StyledRowFixed = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
    margin-top: 0.5rem;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;

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
    }
  `};
`

const StyledTextForValue = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    line-height: 130%;
  `};
  font-size: 16px;
`

const LabelText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px !important;
  text-transform: uppercase;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    display: block;
  `};
  &.first {
    margin-top: 0 !important;
  }
`

const ManageCloseButton = styled(ButtonOutlined)`
  width: 100%;
  padding: 4px 8px;
  border-radius: 5px;
  font-weight: 700;
  font-size: 16px;

  :hover {
    background: ${({ theme }) => theme.bg2};
    color: white;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: ${({ theme }) => theme.bg2};
    color: white;
    width: 100%;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: 900;
  `};
`

const LineSeparator = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    border-bottom: 1px solid #471BB2;
    margin: 10px 30px 0;
  `};
`

export const StyledFixedHeightRowWeb = styled(RowBetween)`
  height: 24px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 0;
  `};
`

export const StyledCardBoxWeb = styled(RowBetween)`
  display: inline;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const StyledButtonWidth = styled(ButtonOutlined)`
  margin: 0,
  minWidth: 0,
  display: "flex",
  padding: 0

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    border: 0;
  `}
`

const ExpandedCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #15006d;
  margin-top: 12px;
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border: none;
    margin-top: 0;
  `}
`

const GetBPTButton = styled(ExternalLink)`
  color: #518cff;
  text-decoration-line: underline;
  line-height: 130%;
  font-weight: 600;
  margin-bottom: 4px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border: 1px solid #518CFF;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 0.5rem;
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: center;
    text-decoration: none;
  `};

  & img {
    margin-left: 6px;
    height: 14px;
    margin-bottom: -2px;
  }
`

const StakeUnstakeContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 30px 0 30px;
  justify-content: space-between;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const StakeUnstakeChild = styled.div`
  width: 48%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-bottom: 20px;
  `};
`

const HideSmallFullWidth = styled(HideSmall)`
  width: 100%;
`

const BannerContainer = styled(RowFlat)`
  padding: 20px 30px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 0;
  `};
`

const Banner = styled(Card)`
  background: rgba(255, 128, 128, 0.2);
  border-radius: 10px;
  border: 0;
  color: #000000;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & div {
    font-weight: 500;
    width: 80%;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
    `};
  }

  & img {
    width: 40px;
  }
`

const RewardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 30px;
  justify-content: space-between;
  background: #15006d;
  color: white;
  align-items: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
  `};
`

const RewardsChild = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};

  &.main {
    flex: 1;
    padding-left: 30px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 15px 0;
    `};
  }

  &.close {
    display: none;
    text-align: right;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: block;
    `};

    & button {
      color: white;
      font-weight: 900;
      text-decoration: underline;
      margin-top: 10px;
    }
  }

  img {
    width: 35px;
  }

  & .label {
    font-weight: bold;
  }

  & .balance {
    font-family: 'Fredoka One';
    font-size: 36px;
  }

  a {
    text-decoration: none;
  }
`

const ClaimButton = styled(ButtonOutlined)`
  background: white;
  color: ${({ theme }) => theme.text1};
  border-radius: 10px;
  font-weight: bold;
  width: 234px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};

  &:focus {
    box-shadow: 0 0 0 1px #2700ce;
  }
  &:hover {
    box-shadow: 0 0 0 1px #2700ce;
  }
  &:active {
    box-shadow: 0 0 0 1px #2700ce;
  }

  img {
    width: 17px;
  }
`

interface FarmPoolCardProps {
  poolId: number
  poolInfo: PoolInfo
  tokenPrice: TokenPrice
}

export default function FarmPoolCard({ poolId, poolInfo, tokenPrice }: FarmPoolCardProps) {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const { haloHaloPrice } = useHaloHalo()

  const [showMore, setShowMore] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [stakeButtonState, setStakeButtonState] = useState(ButtonHaloStates.Disabled)
  const [unstakeButtonState, setUnstakeButtonState] = useState(ButtonHaloSimpleStates.Disabled)
  const [harvestButtonState, setHarvestButtonState] = useState(ButtonHaloSimpleStates.Disabled)
  const [isTxInProgress, setIsTxInProgress] = useState(false)

  // Get user BPT balance
  const bptBalanceAmount = useTokenBalance(poolInfo.address)
  const bptBalance = parseFloat(formatEther(bptBalanceAmount.value.toString()))

  // Get user staked BPT
  const stakedBPTs = useStakedBPTPerPool([poolId])
  const bptStaked = stakedBPTs[poolId] ?? 0

  // Staked BPT value calculation
  const totalSupplyAmount = useTotalSupply(poolInfo.asToken)
  const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
  const bptPrice = totalSupply > 0 ? poolInfo.liquidity / totalSupply : 0
  const bptStakedValue = bptStaked * bptPrice

  // Denotes how many rewards token in 1 HALO
  const rewardsToHALOPrice = Number.parseFloat(haloHaloPrice)

  // Get user earned HALO
  const unclaimedRewards = useUnclaimedRewardsPerPool([poolId])
  const unclaimedPoolRewards = unclaimedRewards[poolId] ?? 0
  const unclaimedHALO = unclaimedPoolRewards * rewardsToHALOPrice

  // Make use of `useApproveCallback` for checking & setting allowance
  const rewardsContractAddress = chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined
  const tokenAmount = new TokenAmount(poolInfo.asToken, JSBI.BigInt(parseEther(stakeAmount === '' ? '0' : stakeAmount)))
  const [approveState, approveCallback] = useApproveCallback(tokenAmount, rewardsContractAddress)

  // Makse use of `useDepositWithdrawPoolTokensCallback` for deposit & withdraw poolTokens methods
  const { deposit, withdraw, harvest } = useDepositWithdrawHarvestCallback()

  // Pool Liquidity
  const poolLiquidity = getPoolLiquidity(poolInfo, tokenPrice)

  // APY
  const rewardTokenPerSecond = useRewardTokenPerSecond()

  // 1 month in seconds
  // (days * hrs * min * s) * reward token per second
  const monthlyReward = rewardTokenPerSecond ? 30 * 24 * 60 * 60 * rewardTokenPerSecond : 0
  const totalAllocPoint = useTotalAllocPoint()
  const USDPrice = tokenPrice[HALO_TOKEN_ADDRESS[ChainId.KOVAN]!]
  const rewardMonthUSDValue = (poolInfo.allocPoint / totalAllocPoint) * (monthlyReward * USDPrice)
  const monthlyInterest = rewardMonthUSDValue / poolLiquidity
  const _apy = monthlyInterest ? parseFloat((monthlyInterest * 100 * 12).toFixed(2)) : 0

  /**
   * Updating the state of stake button
   */
  useEffect(() => {
    if (isTxInProgress) return

    const amountAsFloat = parseFloat(stakeAmount)
    if (amountAsFloat > 0 && amountAsFloat <= bptBalance) {
      if (approveState === ApprovalState.APPROVED) {
        setStakeButtonState(ButtonHaloStates.Approved)
      } else if (approveState === ApprovalState.PENDING) {
        setStakeButtonState(ButtonHaloStates.Approving)
      } else {
        setStakeButtonState(ButtonHaloStates.NotApproved)
      }
    } else {
      setStakeButtonState(ButtonHaloStates.Disabled)
    }
  }, [approveState, stakeAmount, bptBalance, isTxInProgress])

  /**
   * Updating the state of unstake button
   */
  useEffect(() => {
    if (isTxInProgress) return

    const amountAsFloat = parseFloat(unstakeAmount)
    if (amountAsFloat > 0 && amountAsFloat <= bptStaked) {
      setUnstakeButtonState(ButtonHaloSimpleStates.Enabled)
    } else {
      setUnstakeButtonState(ButtonHaloSimpleStates.Disabled)
    }
  }, [unstakeAmount, bptStaked, isTxInProgress])

  /**
   * Updating the state of harvest button
   */
  useEffect(() => {
    if (isTxInProgress) return

    if (unclaimedHALO > 0) {
      setHarvestButtonState(ButtonHaloSimpleStates.Enabled)
    } else {
      setHarvestButtonState(ButtonHaloSimpleStates.Disabled)
    }
  }, [unclaimedHALO, isTxInProgress])

  /**
   * Approves the stake amount
   */
  const approveStakeAmount = async () => {
    setIsTxInProgress(true)
    setStakeButtonState(ButtonHaloStates.Approving)

    await approveCallback()

    setIsTxInProgress(false)
  }

  /**
   * Stakes the LP token to Rewards contract
   */
  const stakeLpToken = async () => {
    setIsTxInProgress(true)
    setStakeButtonState(ButtonHaloStates.TxInProgress)

    try {
      const tx = await deposit(poolId, parseFloat(stakeAmount) ?? 0)
      await tx.wait()
    } catch (e) {
      console.error('Stake error: ', e)
    }

    setStakeAmount('')
    setStakeButtonState(ButtonHaloStates.Disabled)
    setIsTxInProgress(false)
  }

  /**
   * Unstake LP token from Rewards contract
   */
  const unstakeLpToken = async () => {
    setIsTxInProgress(true)
    setUnstakeButtonState(ButtonHaloSimpleStates.TxInProgress)

    try {
      const tx = await withdraw(poolId, parseFloat(unstakeAmount) ?? 0)
      await tx.wait()
    } catch (e) {
      console.error('Unstake error: ', e)
    }

    setUnstakeAmount('')
    setUnstakeButtonState(ButtonHaloSimpleStates.Disabled)
    setIsTxInProgress(false)
  }

  /**
   * Handles the user clicking "Harvest" button
   */
  const handleClaim = async () => {
    setIsTxInProgress(true)
    setHarvestButtonState(ButtonHaloSimpleStates.TxInProgress)

    // Claim/withdraw rewards
    try {
      const tx = await harvest(poolId)
      await tx.wait()
      setHarvestButtonState(ButtonHaloSimpleStates.Disabled)
    } catch (e) {
      console.error('Claim error: ', e)
      setHarvestButtonState(ButtonHaloSimpleStates.Enabled)
      return
    }

    // Redirect to vesting page
    const vestingInfo = {
      name: poolInfo.pair,
      balance: {
        rewardToken: unclaimedPoolRewards,
        halo: unclaimedHALO
      }
    }

    // Updates `AppState.user.poolToHarvest` so Vesting page can display the Harvest modal
    dispatch(updatePoolToHarvest({ vestingInfo }))

    history.push('/vesting')
  }

  return (
    <StyledCard bgColor="#ffffff" className={'pool-card ' + (showMore ? 'expanded' : 'default')}>
      <AutoColumn>
        {/* Pool Row default */}
        <StyledFixedHeightRowCustom>
          <StyledRowFixed width="17%">
            <DoubleCurrencyLogo
              currency0={poolInfo.tokens[0].asToken}
              currency1={poolInfo.tokens[1].asToken}
              size={16}
            />
            &nbsp;
            <StyledTextForValue fontWeight={600}>{poolInfo.pair}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
            <LabelText className="first">{t('apy')}:</LabelText>
            <StyledTextForValue>{formatNumber(_apy, NumberFormat.long)}%</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="19%">
            <LabelText className="first">{t('totalPoolValue')}:</LabelText>
            <StyledTextForValue>{formatNumber(poolLiquidity, NumberFormat.usd)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="12%">
            <LabelText>{t('stakeable')}:</LabelText>
            <StyledTextForValue>{formatNumber(bptBalance)} BPT</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
            <LabelText>{t('valueStaked')}</LabelText>
            <StyledTextForValue>{formatNumber(bptStakedValue, NumberFormat.usd)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="10%">
            <LabelText>{t('earned')}:</LabelText>
            <StyledTextForValue>{formatNumber(unclaimedHALO)} HALO</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="10%">
            {account && (
              <>
                {showMore ? (
                  <HideSmallFullWidth>
                    <ManageCloseButton onClick={() => setShowMore(!showMore)}>{t('closeTxt')}</ManageCloseButton>
                  </HideSmallFullWidth>
                ) : (
                  <ManageCloseButton onClick={() => setShowMore(!showMore)}>{t('manage')}</ManageCloseButton>
                )}
              </>
            )}
          </StyledRowFixed>
        </StyledFixedHeightRowCustom>

        {/* Pool Row expanded */}
        {showMore && (
          <ExpandedCard>
            <LineSeparator />

            <StakeUnstakeContainer>
              <StakeUnstakeChild>
                <FixedHeightRow>
                  <TYPE.label>BALANCE: {formatNumber(bptBalance)} BPT</TYPE.label>
                </FixedHeightRow>
                <RowFlat>
                  <GetBPTButton href={poolInfo.balancerUrl}>
                    {t('getBPTTokens')}
                    <img src={LinkIcon} alt="Link Icon" />
                  </GetBPTButton>
                </RowFlat>
                <RowFlat>
                  <NumericalInput
                    style={{
                      width: '100%'
                    }}
                    value={stakeAmount}
                    onUserInput={amount => setStakeAmount(amount)}
                    id="stake-input"
                  />
                </RowFlat>
                <Column>
                  <ButtonHalo
                    id="stake-button"
                    disabled={[
                      ButtonHaloStates.Disabled,
                      ButtonHaloStates.Approving,
                      ButtonHaloStates.TxInProgress
                    ].includes(stakeButtonState)}
                    onClick={() => {
                      if (stakeButtonState === ButtonHaloStates.Approved) {
                        stakeLpToken()
                      } else {
                        approveStakeAmount()
                      }
                    }}
                  >
                    {(stakeButtonState === ButtonHaloStates.Disabled ||
                      stakeButtonState === ButtonHaloStates.Approved) && <>{t('stake')}</>}
                    {stakeButtonState === ButtonHaloStates.NotApproved && <>{t('approve')}</>}
                    {stakeButtonState === ButtonHaloStates.Approving && (
                      <>
                        {HALO_REWARDS_MESSAGE.approving}&nbsp;
                        <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                      </>
                    )}
                    {stakeButtonState === ButtonHaloStates.TxInProgress && (
                      <>
                        {HALO_REWARDS_MESSAGE.staking}&nbsp;
                        <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                      </>
                    )}
                  </ButtonHalo>
                  {parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) > bptBalance && (
                    <ErrorText>{t('insufficientFunds')}</ErrorText>
                  )}
                </Column>
              </StakeUnstakeChild>
              <StakeUnstakeChild>
                <FixedHeightRow>
                  <TYPE.label>STAKED: {formatNumber(bptStaked)} BPT</TYPE.label>
                </FixedHeightRow>
                <HideSmallFullWidth>
                  <Row height={23}>&nbsp;</Row>
                </HideSmallFullWidth>
                <RowFlat>
                  <NumericalInput
                    style={{
                      width: '100%'
                    }}
                    value={unstakeAmount}
                    onUserInput={amount => setUnstakeAmount(amount)}
                    id="unstake-input"
                  />
                </RowFlat>
                <Column>
                  <ButtonHaloOutlined
                    id="unstake-button"
                    disabled={[ButtonHaloSimpleStates.Disabled, ButtonHaloSimpleStates.TxInProgress].includes(
                      unstakeButtonState
                    )}
                    onClick={unstakeLpToken}
                  >
                    {(unstakeButtonState === ButtonHaloSimpleStates.Disabled ||
                      unstakeButtonState === ButtonHaloSimpleStates.Enabled) && <>{t('unstake')}</>}
                    {unstakeButtonState === ButtonHaloSimpleStates.TxInProgress && (
                      <>
                        {HALO_REWARDS_MESSAGE.unstaking}&nbsp;
                        <CustomLightSpinner src={SpinnerPurple} alt="loader" size={'15px'} />{' '}
                      </>
                    )}
                  </ButtonHaloOutlined>
                  {parseFloat(unstakeAmount) > 0 && parseFloat(unstakeAmount) > bptStaked && (
                    <ErrorText>{t('insufficientFunds')}</ErrorText>
                  )}
                </Column>
              </StakeUnstakeChild>
            </StakeUnstakeContainer>

            <BannerContainer>
              <Banner>
                <Text>{t('tokenCardRewardDescription')}</Text>
                <HideSmall>
                  <img src={BunnyMoon} alt="Bunny Moon" />
                </HideSmall>
              </Banner>
            </BannerContainer>

            <RewardsContainer>
              <RewardsChild>
                <img src={BunnyRewards} alt="Bunny Rewards" />
              </RewardsChild>
              <RewardsChild className="main">
                <Text className="label">{poolInfo.pair} Rewards:</Text>
                <Text className="balance">{formatNumber(unclaimedHALO)} HALO</Text>
              </RewardsChild>
              <RewardsChild>
                <ClaimButton
                  onClick={handleClaim}
                  disabled={[ButtonHaloSimpleStates.Disabled, ButtonHaloSimpleStates.TxInProgress].includes(
                    harvestButtonState
                  )}
                >
                  {t('harvest')}&nbsp;&nbsp;
                  {harvestButtonState === ButtonHaloSimpleStates.TxInProgress ? (
                    <CustomLightSpinner src={SpinnerPurple} alt="loader" size={'15px'} />
                  ) : (
                    <img src={ArrowRight} alt="Harvest icon" />
                  )}
                </ClaimButton>
              </RewardsChild>
              <RewardsChild className="close">
                <ButtonText onClick={() => setShowMore(!showMore)}>Close X</ButtonText>
              </RewardsChild>
            </RewardsContainer>
          </ExpandedCard>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
