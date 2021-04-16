import React, { useCallback, useEffect, useState } from 'react'
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
import HALO_REWARDS_ABI from '../../constants/haloAbis/Rewards.json'
import { useContract, useTokenContract } from 'hooks/useContract'
import { formatEther, parseEther } from 'ethers/lib/utils'
import Confetti from 'components/Confetti'
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
  font-size: 14px;
`

const StyledTextForValue = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    font-size: 16px;
    line-height: 130%;
  `};
  font-size: 14px;
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

interface BalancerPoolCardProps {
  poolInfo: PoolInfo
  tokenPrice: TokenPrice
}

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
  const { t } = useTranslation()

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

  return (
    <StyledCard bgColor={backgroundColor}>
      <AutoColumn>
        <StyledFixedHeightRow
          style={{
            padding: "0 0 0 10px"
          }}
        >
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
              <StyledText fontWeight={600}>{t('stakeable')}:</StyledText>
            </HideMedium>
            <StyledTextForValue>{bptBalance.toFixed(2)} BPT</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="18%">
            <HideMedium>
              <StyledText fontWeight={600}>{t('valueStaked')}</StyledText>
            </HideMedium>
            <StyledTextForValue>{toFormattedCurrency(bptStakedValue)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
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
                    <StyledButtonText width="74px">{t('closeTxt')}</StyledButtonText>
                  </>
                ) : (
                  <>
                    <StyledButtonText width="74px">{t('manage')}</StyledButtonText>
                  </>
                )}
              </StyledButton>
            </StyledRowFixed>
          )}
        </StyledFixedHeightRow>

        {showMore && (
          <AutoColumn
            gap="8px"
            style={{
              background: '#F8F8F8',
              borderRadius: '4px',
              marginTop: "10px"
            }}
          >
            <div
              style={{
                padding: '20px 30px 0 30px'
              }}
            >
              <HideMedium>
                <RowBetween>
                  <StyledFixedHeightRow
                    style={{
                      marginBottom: '20px'
                    }}
                  >
                    <StyledRowFixed>
                      <DoubleCurrencyLogo
                        currency0={poolInfo.tokens[0].asToken}
                        currency1={poolInfo.tokens[1].asToken}
                        size={14}
                      />
                      &nbsp;
                      <StyledTextForValue fontWeight={600}>{poolInfo.pair}</StyledTextForValue>
                    </StyledRowFixed>
                    <StyledRowFixed>
                      <StyledText fontWeight={600}>{t('totalPoolValue')}:</StyledText>
                      <StyledTextForValue>
                        {toFormattedCurrency(getPoolLiquidity(poolInfo, tokenPrice))}
                      </StyledTextForValue>
                    </StyledRowFixed>
                    <StyledRowFixed>
                      <StyledText fontWeight={600}>Stakeable:</StyledText>
                      <StyledTextForValue>{bptBalance.toFixed(2)} BPT</StyledTextForValue>
                    </StyledRowFixed>
                    <StyledRowFixed>
                      <StyledText fontWeight={600}>Value Staked:</StyledText>
                      <StyledTextForValue>{toFormattedCurrency(bptStakedValue)}</StyledTextForValue>
                    </StyledRowFixed>
                    <StyledRowFixed>
                      <StyledText fontWeight={600}>Earned:</StyledText>
                      <StyledTextForValue>{unclaimedHalo} HALO</StyledTextForValue>
                    </StyledRowFixed>
                    <StyledBorderBottom>.</StyledBorderBottom>
                  </StyledFixedHeightRow>
                </RowBetween>
              </HideMedium>
              <StyledCardBoxWeb>
                <StyledFixedHeightRowWeb>
                  <Confetti start={loading.confetti} />
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
                  />
                  <ButtonPrimaryNormal
                    padding="8px"
                    borderRadius="8px"
                    width="100%"
                    disabled={
                      !(parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) <= bptBalance) || loading.staking
                    }
                    onClick={stakeLpToken}
                    style={{
                      background: '#471BB2',
                      color: '#FFFFFF',
                      fontWeight: 900
                    }}
                  >
                    {loading.staking ? (
                      <>
                        {`${HALO_REWARDS_MESSAGE.staking}`}&nbsp;
                        <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                      </>
                    ) : (
                      t('stake')
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
                  />
                  <ButtonPrimaryNormal
                    padding="8px"
                    borderRadius="8px"
                    width="100%"
                    disabled={
                      !(parseFloat(unstakeAmount) > 0 && parseFloat(unstakeAmount) <= bptStaked) || loading.unstaking
                    }
                    onClick={unstakeLpToken}
                    style={{
                      color: '#471BB2',
                      fontWeight: 900,
                      border: '1px solid #471BB2'
                    }}
                  >
                    {loading.unstaking ? (
                      <>
                        {`${HALO_REWARDS_MESSAGE.unstaking}`}&nbsp;
                        <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                      </>
                    ) : (
                      t('unstake')
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
                      color: '#000000'
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
                          float: 'left'
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
                    />
                    <ButtonPrimaryNormal
                      padding="8px"
                      borderRadius="8px"
                      width="48%"
                      disabled={
                        !(parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) <= bptBalance) || loading.staking
                      }
                      onClick={stakeLpToken}
                      style={{
                        background: '#471BB2',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        width: '100%',
                        margin: '4% 0 4% 0',
                        height: '38px'
                      }}
                    >
                      {loading.staking ? (
                        <>
                          {`${HALO_REWARDS_MESSAGE.staking}`}&nbsp;
                          <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                        </>
                      ) : (
                        t('stake')
                      )}
                    </ButtonPrimaryNormal>
                    <StyledTextForValue fontSize={16} fontWeight={800}>
                      Staked: {bptStaked.toFixed(2)} BPT
                    </StyledTextForValue>
                    <NumericalInput
                      style={{ width: '100%' }}
                      value={unstakeAmount}
                      onUserInput={amount => setUnstakeAmount(amount)}
                    />
                    <ButtonPrimaryNormal
                      padding="8px"
                      borderRadius="8px"
                      width="48%"
                      disabled={
                        !(parseFloat(unstakeAmount) > 0 && parseFloat(unstakeAmount) <= bptStaked) || loading.unstaking
                      }
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
                      {loading.unstaking ? (
                        <>
                          {`${HALO_REWARDS_MESSAGE.unstaking}`}&nbsp;
                          <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                        </>
                      ) : (
                        t('unstake')
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
                    <BalanceCard
                      style={{
                        background: '#15006D',
                        borderRadius: '0px 0px 4px 4px'
                      }}
                    >
                      <StyledFixedHeightRow>
                        <StyledRowFixed
                          style={{
                            display: 'block',
                            paddingBottom: 0
                          }}
                        >
                          <img style={{ float: 'left' }} src={BunnyRewards} alt="Bunny Rewards" />
                        </StyledRowFixed>
                        <StyledRowFixed
                          style={{
                            marginTop: '2%',
                            paddingLeft: '7%'
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
                            disabled={!(unclaimedHalo > 0) || loading.claim}
                            onClick={claimPoolRewards}
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
                            {loading.claim ? (
                              <>
                                {`${HALO_REWARDS_MESSAGE.claiming}`}&nbsp;
                                <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                              </>
                            ) : (
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
                            )}
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
                  </StyledRowFixed>
                </StyledFixedHeightRow>
              </HideMedium>
            </div>
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
                        marginLeft: '50px',
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
                        disabled={!(unclaimedHalo > 0) || loading.claim}
                        onClick={claimPoolRewards}
                        style={{
                          width: '234px',
                          height: '53px',
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          float: 'right',
                          fontWeight: 'bold'
                        }}
                      >
                        {loading.claim ? (
                          <>
                            {`${HALO_REWARDS_MESSAGE.claiming}`}&nbsp;
                            <CustomLightSpinner src={Circle} alt="loader" size={'15px'} />{' '}
                          </>
                        ) : (
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
                        )}
                      </ButtonPrimaryNormal>
                    </StyledRowFixed>
                  </StyledFixedHeightRow>
                </BalanceCard>
              </RowBetween>
            </StyledCardBoxWeb>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
