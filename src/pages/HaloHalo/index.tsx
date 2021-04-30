import React from 'react'
import styled from 'styled-components'

//import { WrapperNoPadding } from '../../components/swap/styleds'
//import { useDarkModeManager } from '../../state/user/hooks'
// import AppBody from '../AppBody'
import HaloChestHeader from './HaloHaloHeader'
import { Wrapper } from '../../components/swap/styleds'

import HaloDepositPanel from './HaloDepositPanel'
import HaloHaloWithdrawPanel from './HaloHaloWithdrawPanel'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
// import { TYPE } from '../../theme'
import { transparentize } from 'polished'

import HalohaloIngredients from '../../assets/svg/halohalo-ingredients.svg'
import useHaloHalo from 'halo-hooks/useHaloHalo'

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

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const HaloHaloPairText = styled.div`
  margin: 8px 0 0 10px;
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

export default function Saave() {
  const { haloHaloAPY, haloHaloPrice } = useHaloHalo()

  console.log(haloHaloPrice)

  return (
    <>
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
                      <RowBetween>Dessert Pool</RowBetween>
                    </DessertPoolRow>
                    <TokenRewardsExplainer>
                      <RowBetween>
                        This is where your HALO token rewards go. We saved you some gas and sent it straight to the
                        Dessert Pool to earn daily.
                      </RowBetween>
                    </TokenRewardsExplainer>
                  </AutoColumn>
                </AutoColumnVesting>
              </CardSection>
            </CardSectionWrapper>
          </VoteCard>
        </VoteCardWrapper>
        <DepositWrapper>
          <HaloChestHeader />
          <Wrapper id="swap-page">
            <AutoColumnDeposit>
              <AutoColumn>
                <HaloDepositPanel
                  label={''}
                  disableCurrencySelect={true}
                  customBalanceText={'Available to deposit: '}
                  id="stake-liquidity-token"
                  buttonText="Claim HALO"
                  cornerRadiusBottomNone={true}
                />
                <HaloHaloWithdrawPanel
                  label={''}
                  disableCurrencySelect={true}
                  customBalanceText={'Available to withdraw: '}
                  id="withdraw-liquidity-token"
                  buttonText="Withdraw"
                  cornerRadiusTopNone={true}
                />
                <RowBetweenHaloPair>
                  <RowBetween>
                    <HaloPairCenterContainer>
                      <HaloIngredients src={HalohaloIngredients} alt="Halo Halo" />
                      <HaloHaloPairText id="haloHaloPrice">HALOHALO:HALO = x{haloHaloPrice} </HaloHaloPairText>
                    </HaloPairCenterContainer>
                  </RowBetween>
                </RowBetweenHaloPair>
              </AutoColumn>
            </AutoColumnDeposit>
          </Wrapper>
        </DepositWrapper>
        <CardSectionContainer>
          <CardSection>
            <RowBetweenCard>
              <RowBetween>DESSERT FACT</RowBetween>
            </RowBetweenCard>
            <RowBetween id="haloHaloAPY">
              The longer you keep HALOHALO, the more HALO you can claim later on ({haloHaloAPY} APY). Claim anytime but
              lose out on daily HALO vesting multiples.
            </RowBetween>
          </CardSection>
        </CardSectionContainer>
      </PageWrapper>
    </>
  )
}
