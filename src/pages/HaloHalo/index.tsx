import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

//import { WrapperNoPadding } from '../../components/swap/styleds'
//import { useDarkModeManager } from '../../state/user/hooks'
// import AppBody from '../AppBody'
import HaloHaloHeader from './HaloHaloHeader'
import { Wrapper } from '../../components/swap/styleds'

import HaloDepositPanel from './HaloDepositPanel'
import HaloHaloWithdrawPanel from './HaloHaloWithdrawPanel'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
// import { TYPE } from '../../theme'
import { transparentize } from 'polished'

import xRnbwTokenIcon from '../../assets/svg/xrnbw-token.svg'
import RnbwTokenIcon from '../../assets/svg/rnbw-token.svg'
import useHaloHalo from 'halo-hooks/useHaloHalo'
import VestingModal from 'components/VestingModal'
import { useVestingModalToggle } from 'state/application/hooks'
import { PoolVestingInfo, removePoolToHarvest } from 'state/user/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'
import EmptyState from 'components/EmptyState'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { ChainId } from '@halodao/sdk'
import { NETWORK_SUPPORTED_FEATURES } from '../../constants/networks'
import { useActiveWeb3React } from '../../hooks'
import DepositOnUnsupportedNetwork from './DepositOnUnsupportedNetwork'
import WithdrawOnUnsupportedNetwork from './WithdrawOnUnsupportedNetwork'

const PageWrapper = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
  display: block;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  overflow: hidden;
  margin-bottom: 10px;
`

const CardSectionWrapper = styled.div`
  ${CardSection} {
    padding: 0 0 20px 0;
  }
`

const VestingRow = styled.div`
  ${RowBetween} {
    font-family: Open Sans;
    font-style: normal;
    font-weight: 800;
    line-height: 16px;
    letter-spacing: 0.2em;
    color: #000000;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const DessertPoolRow = styled.div`
  ${RowBetween} {
    font-family: Fredoka One;
    font-style: normal;
    font-weight: normal;
    line-height: 44px;
    color: #471bb2;
    font-size: 36px;
  }
`

const TokenRewardsExplainer = styled.div`
  ${RowBetween} {
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: #333333;
  }
`

const AutoColumnVesting = styled.div`
  ${AutoColumn} {
    grid-row-gap: 5px;
  }
`

const AutoColumnDeposit = styled.div`
  ${AutoColumn} {
    padding: '10px 0 10px 0';
  }
`

const VoteCardWrapper = styled.div`
  ${VoteCard} {
    max-width: 370px;
    width: 100%;
    float: left;
    border-radius: 0;
  }
`

const DepositWrapper = styled.div`
  width: 440px;
  float: right;
  border: 1px solid #15006d;
  border-radius: 4px;
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-bottom: 50px;
  `};
`

const RowBetweenHaloPair = styled.div`
  ${RowBetween} {
    padding: 20px 0 0 0;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 0;
    `};
  }
`

const HaloIngredients = styled.img`
  float: left;
  margin-left: 5px;
  width: 1.1rem;
  height: 1.1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const HaloHaloPairText = styled.div`
  margin: 0 0 0 0px;
  font-style: italic;
  font-family: Open Sans;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.2em;
  color: #000000;
  float: left;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 16px 0 0 0;
  `};
`

const HaloPairCenterContainer = styled.div`
  margin: auto;
  margin-top: 8px;
`

const CardSectionContainer = styled.div`
  ${CardSection} {
    width: 350px;
    margin-top: 28px;
    background: #e9e4f7;
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: #333333;
    border-radius: 8px;
    padding: 24px 24px 24px 24px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
    `};
  }
`

const RowBetweenCard = styled.div`
  ${RowBetween} {
    font-family: Open Sans;
    font-style: normal;
    font-weight: 800;
    line-height: 16px;
    letter-spacing: 0.1em;
    color: #15006d;
    margin: 0 0 20px 0;
  }
`

export default function HaloHalo() {
  const { haloHaloAPY, haloHaloPrice } = useHaloHalo()
  const toggleVestingModal = useVestingModalToggle()
  const dispatch = useDispatch<AppDispatch>()
  const poolToHarvest = useSelector<AppState, PoolVestingInfo | undefined>(state => state.user.poolToHarvest)
  const [poolVestingInfo, setPoolVestingInfo] = useState<PoolVestingInfo | undefined>()
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const features = NETWORK_SUPPORTED_FEATURES[chainId as ChainId]

  useEffect(() => {
    // Load vesting modal if user clicks "Harvest" button from Farm page
    if (poolToHarvest) {
      setPoolVestingInfo(poolToHarvest)
      toggleVestingModal()
      dispatch(removePoolToHarvest()) // remove from AppState after copying the value to poolVestingInfo
    }
  }, [poolToHarvest, dispatch, toggleVestingModal])

  return (
    <>
      <VestingModal poolVestingInfo={poolVestingInfo} />
      <PageWrapper>
        <VoteCardWrapper>
          <VoteCard>
            <CardSectionWrapper>
              <CardSection>
                <AutoColumnVesting>
                  <AutoColumn gap="md">
                    <VestingRow>
                      <RowBetween>VESTING</RowBetween>
                    </VestingRow>
                    <DessertPoolRow>
                      <RowBetween>Rainbow Pool</RowBetween>
                    </DessertPoolRow>
                    <TokenRewardsExplainer>
                      <RowBetween>
                        This is where your RNBW vesting rewards will go. We saved you some gas and sent it straight to
                        the Rainbow Pool to earn monthly vesting rewards and a share of network profits.
                      </RowBetween>
                    </TokenRewardsExplainer>
                  </AutoColumn>
                </AutoColumnVesting>
              </CardSection>
            </CardSectionWrapper>
          </VoteCard>
        </VoteCardWrapper>
        <DepositWrapper>
          <HaloHaloHeader vest={features?.vest} />
          <Wrapper id="swap-page">
            <AutoColumnDeposit>
              <AutoColumn>
                {features?.vest && (
                  <HaloDepositPanel
                    label={''}
                    disableCurrencySelect={true}
                    customBalanceText={'Available to deposit: '}
                    id="stake-liquidity-token"
                    buttonText="Claim RNBW"
                    cornerRadiusBottomNone={true}
                  />
                )}
                {!features?.vest && <DepositOnUnsupportedNetwork chainId={chainId as ChainId} />}
                {features?.vest && (
                  <HaloHaloWithdrawPanel
                    label={''}
                    disableCurrencySelect={true}
                    customBalanceText={'Available to withdraw: '}
                    id="withdraw-liquidity-token"
                    buttonText="Withdraw"
                    cornerRadiusTopNone={true}
                  />
                )}
                {!features?.vest && (
                  <div className="mt-4">
                    <WithdrawOnUnsupportedNetwork chainId={chainId as ChainId} />
                  </div>
                )}
                <RowBetweenHaloPair>
                  <RowBetween>
                    <HaloPairCenterContainer>
                      <HaloIngredients src={xRnbwTokenIcon} alt="RNBW" />
                      <HaloHaloPairText id="haloHaloPrice">xRNBW : </HaloHaloPairText>
                      <HaloIngredients src={RnbwTokenIcon} alt="RNBW" />
                      <HaloHaloPairText id="haloHaloPrice">RNBW = x{haloHaloPrice}</HaloHaloPairText>
                    </HaloPairCenterContainer>
                  </RowBetween>
                </RowBetweenHaloPair>
                {!features?.vest && (
                  <HaloPairCenterContainer>
                    <HaloHaloPairText>(Ethereum mainnet)</HaloHaloPairText>
                  </HaloPairCenterContainer>
                )}
              </AutoColumn>
            </AutoColumnDeposit>
          </Wrapper>
        </DepositWrapper>
        <CardSectionContainer>
          <CardSection>
            <RowBetweenCard>
              <RowBetween>RAINBOW FACT</RowBetween>
            </RowBetweenCard>
            <RowBetween id="haloHaloAPY">
              The longer you keep xRNBW, the more RNBW you can claim later on (
              {haloHaloAPY > 0 ? formatNumber(haloHaloAPY, NumberFormat.percent) + ' APR' : 'APR pending'}). Claim
              anytime but lose out on monthly RNBW vesting multiples.
            </RowBetween>
          </CardSection>
        </CardSectionContainer>
        <EmptyState header={t('emptyStateTitleInVest')} subHeader={t('emptyStateSubTitleInVest')} />
      </PageWrapper>
    </>
  )
}
