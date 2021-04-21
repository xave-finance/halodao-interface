import React, { useEffect, useState } from 'react'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { ButtonOutlined, ButtonPrimaryNormal } from '../Button'
import { AutoColumn } from '../Column'
import { RowFixed, RowBetween } from '../Row'
import { FixedHeightRow } from '.'
import { CustomLightSpinner, HideMedium } from 'theme'
import NumericalInput from 'components/NumericalInput'
import { GreyCard } from '../Card'
import { CardSection, DataCard } from 'components/earn/styled'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { formatEther, parseEther } from 'ethers/lib/utils'
import Circle from '../../assets/images/blue-loader.svg'
import BunnyMoon from '../../assets/svg/bunny-with-moon.svg'
import BunnyRewards from '../../assets/svg/bunny-rewards.svg'
import Molecule from '../../assets/svg/molecule.svg'
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

const StyledFixedHeightRowCustom = styled(FixedHeightRow)`
  padding: 0 0 0 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    padding: 0 0 0 30px;
  `};
`
export const StyledCard = styled(GreyCard)<{ bgColor: any }>`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    background: ${({ theme }) => theme.bg3};
    padding: 5px 0 0 0;
    border-radius: 4px;
    box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
  `};
  border: none
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: hidden;
  padding: 5px 0 5px 0;
  border-radius: 0px;
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
      margin-top: 1.5rem;
    }
  `};
`

const StyledRowFixedWeb = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
`};
`

const StyledRowFixedMobile = styled(RowFixed)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    width: 100%;
    padding: 0 30px 0 0;
  `};
`

const StyledText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    line-height: 16px;
    letter-spacing: 0.2rem;
  `};
  font-size: 14px;
`

const StyledTextForValue = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    font-size: 16px;
    line-height: 130%;
  `};
  font-size: 14px;
`

const StyledButtonWeb = styled(ButtonOutlined)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    display: none;
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

const StyledButtonMobile = styled(ButtonOutlined)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
    background: ${({ theme }) => theme.bg2};
    color: white;
    width: 100%;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: 900;
    font-size: 16px;
    line-height: 150%;
  `};
  display: none;
`

const StyledButtonText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    font-size: 16px;
  `};
  font-weight: bold;
  font-size: 14px;
`

const StyledClose = styled(Text)`
  display: inline;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const StyledBorderBottom = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: inline;
    border-bottom: 1px solid #471BB2;
    width: 100%;
    color: transparent;
  `};
`

const StyledBalanceStakeWeb = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
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

const AutoColumnCustom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #f8f8f8;
  border-radius: 4px;
  margin-top: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: none;
    border-radius: 0;
    margin-top: 0;
  `}
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
  const bptStaked = stakedBPTs[poolInfo.address] ?? 0

  // Staked BPT value calculation
  const totalSupplyAmount = useTotalSupply(poolInfo.asToken)
  const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
  const bptPrice = totalSupply > 0 ? poolInfo.liquidity / totalSupply : 0
  const bptStakedValue = bptStaked * bptPrice

  // Get user earned HALO
  const unclaimedHALOs = useUnclaimedHALOPerPool([poolInfo.address])
  const unclaimedHalo = unclaimedHALOs[poolInfo.address] ?? 0

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
      <AutoColumn>
        <StyledFixedHeightRowCustom>
          <StyledRowFixed width="25%" gap="8px">
            <DoubleCurrencyLogo
              currency0={poolInfo.tokens[0].asToken}
              currency1={poolInfo.tokens[1].asToken}
              size={14}
            />
            &nbsp;
            <StyledTextForValue fontWeight={600}>{poolInfo.pair}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="21%">
            <HideMedium>
              <StyledText fontWeight={600}>{t('totalPoolValue')}:</StyledText>
            </HideMedium>
            <StyledTextForValue>{toFormattedCurrency(getPoolLiquidity(poolInfo, tokenPrice))}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="18%">
            <HideMedium>
              <StyledText fontWeight={600} marginTop="10px">
                {t('stakeable')}:
              </StyledText>
            </HideMedium>
            <StyledTextForValue>{bptBalance.toFixed(2)} BPT</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="18%">
            <HideMedium>
              <StyledText fontWeight={600} marginTop="10px">
                {t('valueStaked')}
              </StyledText>
            </HideMedium>
            <StyledTextForValue>{toFormattedCurrency(bptStakedValue)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
            <HideMedium>
              <StyledText fontWeight={600} marginTop="10px">
                {t('earned')}:
              </StyledText>
            </HideMedium>
            <StyledTextForValue>{unclaimedHalo} HALO</StyledTextForValue>
          </StyledRowFixed>
          {/* Manage and Close buttons for web and mobile */}
          {account && (
            <>
              <StyledRowFixedWeb>
                <StyledButtonWeb onClick={() => setShowMore(!showMore)}>
                  {showMore ? (
                    <>
                      <StyledButtonText width="74px">{t('closeTxt')}</StyledButtonText>
                    </>
                  ) : (
                    <>
                      <StyledButtonText width="74px">{t('manage')}</StyledButtonText>
                    </>
                  )}
                </StyledButtonWeb>
              </StyledRowFixedWeb>
              <StyledRowFixedMobile>
                <div onClick={() => setShowMore(!showMore)}>
                  {showMore ? (
                    <StyledCardBoxWeb>
                      <StyledButtonMobile>
                        <StyledButtonText width="74px">{t('closeTxt')}</StyledButtonText>
                      </StyledButtonMobile>
                    </StyledCardBoxWeb>
                  ) : (
                    <StyledButtonMobile
                      style={{
                        margin: '20px 0 20px 0'
                      }}
                    >
                      <StyledButtonText width="74px">{t('manage')}</StyledButtonText>
                    </StyledButtonMobile>
                  )}
                </div>
              </StyledRowFixedMobile>
            </>
          )}
        </StyledFixedHeightRowCustom>

        {showMore && (
          <AutoColumnCustom>
            <HideMedium>
              <RowBetween>
                <StyledBorderBottom
                  style={{
                    margin: '0 30px 0 30px'
                  }}
                >
                  .
                </StyledBorderBottom>
              </RowBetween>
            </HideMedium>
            <div
              style={{
                padding: '20px 30px 0 30px'
              }}
            >
              <StyledCardBoxWeb>
                <StyledFixedHeightRowWeb>
                  <StyledBalanceStakeWeb
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <StyledRowFixed>
                      <Text
                        style={{
                          fontFamily: 'Open Sans',
                          fontStyle: 'normal',
                          fontWeight: 800,
                          fontSize: '14px',
                          lineHeight: '16px',
                          letterSpacing: '0.2em'
                        }}
                      >
                        BALANCE: {bptBalance.toFixed(2)} BPT
                      </Text>
                    </StyledRowFixed>
                    <StyledRowFixed>
                      <Text
                        style={{
                          fontFamily: 'Open Sans',
                          fontStyle: 'normal',
                          fontWeight: 800,
                          fontSize: '14px',
                          lineHeight: '16px',
                          letterSpacing: '0.2em'
                        }}
                      >
                        STAKED: {bptStaked.toFixed(2)} BPT
                      </Text>
                    </StyledRowFixed>
                  </StyledBalanceStakeWeb>
                </StyledFixedHeightRowWeb>
                <RowBetween
                  style={{
                    marginTop: '10px',
                    display: 'block',
                    width: '48%',
                    float: 'left'
                  }}
                >
                  <NumericalInput
                    style={{
                      width: '100%'
                    }}
                    value={stakeAmount}
                    onUserInput={amount => setStakeAmount(amount)}
                    id="stake-input"
                  />
                  <ButtonPrimaryNormal
                    id="stake-button"
                    padding="8px"
                    borderRadius="8px"
                    width="100%"
                    disabled={[
                      StakeButtonStates.Disabled,
                      StakeButtonStates.Approving,
                      StakeButtonStates.Staking
                    ].includes(stakeButtonState)}
                    onClick={() => {
                      if (stakeButtonState === StakeButtonStates.Approved) {
                        stakeLpToken()
                      } else {
                        approveStakeAmount()
                      }
                    }}
                    style={{
                      background: '#471BB2',
                      color: '#FFFFFF',
                      fontWeight: 900
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
                </RowBetween>
                <RowBetween
                  style={{
                    marginTop: '10px',
                    display: 'block',
                    width: '48%',
                    float: 'right'
                  }}
                >
                  <NumericalInput
                    style={{
                      width: '100%'
                    }}
                    value={unstakeAmount}
                    onUserInput={amount => setUnstakeAmount(amount)}
                    id="unstake-input"
                  />
                  <ButtonPrimaryNormal
                    id="unstake-button"
                    padding="8px"
                    borderRadius="8px"
                    width="100%"
                    disabled={[UnstakeButtonStates.Disabled, UnstakeButtonStates.Unstaking].includes(
                      unstakeButtonState
                    )}
                    onClick={unstakeLpToken}
                    style={{
                      color: '#471BB2',
                      fontWeight: 900,
                      border: '1px solid #471BB2'
                    }}
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
                <RowBetween marginTop="10px">
                  <BalanceCard
                    style={{
                      backgroundColor: '#D5CDEA',
                      boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.1)',
                      borderRadius: '10px',
                      border: '0',
                      color: '#000000',
                      marginTop: '20px'
                    }}
                  >
                    <CardSection
                      style={{
                        display: 'block',
                        padding: 0,
                        margin: '15px 25px 15px 25px'
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          textAlign: 'left',
                          width: '80%',
                          float: 'left',
                          marginTop: '7px'
                        }}
                      >
                        {t('tokenCardRewardDescription')}
                      </Text>
                      <img
                        width={'40px'}
                        src={BunnyMoon}
                        alt="Bunny Moon"
                        style={{
                          float: 'right'
                        }}
                      />
                    </CardSection>
                  </BalanceCard>
                </RowBetween>
              </StyledCardBoxWeb>
              <HideMedium>
                <StyledFixedHeightRow>
                  <StyledRowFixed
                    style={{
                      padding: 0,
                      display: 'block'
                    }}
                  >
                    <StyledTextForValue fontSize={16} fontWeight={800}>
                      Balance: {bptBalance.toFixed(2)} BPT
                    </StyledTextForValue>
                    <br />
                    <NumericalInput
                      style={{ width: '100%' }}
                      value={stakeAmount}
                      onUserInput={amount => setStakeAmount(amount)}
                      id="stake-input"
                    />
                    <ButtonPrimaryNormal
                      id="stake-button"
                      padding="8px"
                      borderRadius="8px"
                      width="48%"
                      disabled={[
                        StakeButtonStates.Disabled,
                        StakeButtonStates.Approving,
                        StakeButtonStates.Staking
                      ].includes(stakeButtonState)}
                      onClick={() => {
                        if (stakeButtonState === StakeButtonStates.Approved) {
                          stakeLpToken()
                        } else {
                          approveStakeAmount()
                        }
                      }}
                      style={{
                        background: '#471BB2',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        width: '100%',
                        margin: '4% 0 4% 0',
                        height: '38px'
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
                    <StyledTextForValue fontSize={16} fontWeight={800}>
                      Staked: {bptStaked.toFixed(2)} BPT
                    </StyledTextForValue>
                    <NumericalInput
                      style={{ width: '100%' }}
                      value={unstakeAmount}
                      onUserInput={amount => setUnstakeAmount(amount)}
                      id="unstake-input"
                    />
                    <ButtonPrimaryNormal
                      id="unstake-button"
                      padding="8px"
                      borderRadius="8px"
                      width="48%"
                      disabled={[UnstakeButtonStates.Disabled, UnstakeButtonStates.Unstaking].includes(
                        unstakeButtonState
                      )}
                      onClick={unstakeLpToken}
                      style={{
                        color: '#471BB2',
                        fontWeight: 900,
                        border: '1px solid #471BB2',
                        width: '100%',
                        margin: '4% 0 4% 0',
                        height: '38px'
                      }}
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
                    <BalanceCard
                      style={{
                        backgroundColor: '#D5CDEA',
                        boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                        border: '0',
                        color: '#000000'
                      }}
                    >
                      <CardSection
                        style={{
                          display: 'block'
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'normal',
                            fontStyle: 'normal',
                            textAlign: 'left',
                            lineHeight: '160%',
                            letterSpacing: 'normal'
                          }}
                        >
                          {t('tokenCardRewardDescription')}
                        </Text>
                      </CardSection>
                    </BalanceCard>
                  </StyledRowFixed>
                </StyledFixedHeightRow>
              </HideMedium>
            </div>
            <HideMedium>
              <BalanceCard
                style={{
                  background: '#15006D',
                  borderRadius: '0px 0px 4px 4px'
                }}
              >
                <StyledFixedHeightRow
                  style={{
                    padding: '0 0 0 8%'
                  }}
                >
                  <StyledRowFixed
                    style={{
                      display: 'block',
                      padding: 0
                    }}
                  >
                    <img style={{ float: 'left' }} src={BunnyRewards} alt="Bunny Rewards" />
                  </StyledRowFixed>
                  <StyledRowFixed
                    style={{
                      marginTop: '2%',
                      padding: 0
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFFFFF',
                        textAlign: 'left',
                        letterSpacing: 'normal'
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Open Sans',
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          lineHeight: '130%'
                        }}
                      >
                        {poolInfo.pair} Rewards:
                      </div>

                      <div
                        style={{
                          marginTop: '5px',
                          fontFamily: 'Fredoka One',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          fontSize: '36px',
                          lineHeight: '44px'
                        }}
                      >
                        {unclaimedHalo.toFixed(2)} HALO
                      </div>
                    </Text>
                    <ButtonPrimaryNormal
                      padding="8px"
                      borderRadius="8px"
                      width="48%"
                      style={{
                        marginTop: '5px',
                        width: '90%',
                        height: '53px',
                        background: '#FFFFFF',
                        borderRadius: '10px',
                        float: 'right',
                        fontWeight: 'bold'
                      }}
                    >
                      <div>
                        <img
                          style={{
                            marginBottom: '-5px'
                          }}
                          src={Molecule}
                          alt="Molecule"
                        />
                        Claim
                      </div>
                    </ButtonPrimaryNormal>
                    <StyledClose
                      style={{
                        display: 'block',
                        width: '90%'
                      }}
                    >
                      <StyledTextForValue
                        onClick={() => setShowMore(!showMore)}
                        style={{
                          marginTop: '10px',
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: 900,
                          fontSize: '16px',
                          lineHeight: '150%',
                          textDecorationLine: 'underline',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          float: 'right',
                          letterSpacing: 'normal'
                        }}
                      >
                        Close X
                      </StyledTextForValue>
                    </StyledClose>
                  </StyledRowFixed>
                </StyledFixedHeightRow>
              </BalanceCard>
            </HideMedium>
            <StyledCardBoxWeb>
              <RowBetween marginTop="10px">
                <BalanceCard
                  style={{
                    background: '#15006D',
                    borderRadius: '0px 0px 4px 4px'
                  }}
                >
                  <StyledFixedHeightRow
                    style={{
                      display: 'block',
                      height: '100%',
                      padding: '20px 0'
                    }}
                  >
                    <StyledRowFixed
                      style={{
                        float: 'left',
                        marginLeft: '30px',
                        height: '100%'
                      }}
                    >
                      <img src={BunnyRewards} alt="Bunny Rewards" />
                    </StyledRowFixed>
                    <StyledRowFixed
                      style={{
                        float: 'left',
                        marginLeft: '30px',
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 800,
                        textAlign: 'left',
                        height: '100%'
                      }}
                    >
                      <Text>
                        <div
                          style={{
                            fontFamily: 'Open Sans',
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            lineHeight: '130%'
                          }}
                        >
                          {poolInfo.pair} Rewards:
                        </div>
                        <div
                          style={{
                            fontFamily: 'Fredoka One',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '36px',
                            lineHeight: '44px'
                          }}
                        >
                          {unclaimedHalo.toFixed(2)} HALO
                        </div>
                      </Text>
                    </StyledRowFixed>
                    <StyledRowFixed
                      style={{
                        float: 'right',
                        marginRight: '30px',
                        height: '100%'
                      }}
                    >
                      <ButtonPrimaryNormal
                        padding="8px"
                        borderRadius="8px"
                        width="48%"
                        style={{
                          width: '234px',
                          height: '53px',
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          float: 'right',
                          fontWeight: 'bold'
                        }}
                      >
                        <div
                          style={{
                            color: '#333333'
                          }}
                        >
                          <img
                            style={{
                              marginBottom: '-5px'
                            }}
                            src={Molecule}
                            alt="Molecule"
                          />
                          Claim
                        </div>
                      </ButtonPrimaryNormal>
                    </StyledRowFixed>
                  </StyledFixedHeightRow>
                </BalanceCard>
              </RowBetween>
            </StyledCardBoxWeb>
          </AutoColumnCustom>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
