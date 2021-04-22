import React from 'react'
import styled from 'styled-components'

//import { WrapperNoPadding } from '../../components/swap/styleds'
//import { useDarkModeManager } from '../../state/user/hooks'
// import AppBody from '../AppBody'
import HaloChestHeader from './HaloHaloHeader'
import { Wrapper } from '../../components/swap/styleds'

import HaloDepositPanel from './HaloDepositPanel'
import HALOHALODepositPanel from './HALOHALODepositPanel'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
// import { TYPE } from '../../theme'
import { transparentize } from 'polished'

import HalohaloIngredients from '../../assets/svg/halohalo-ingredients.svg'

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
    color: #471BB2;
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

const VoteCardWrapper = styled.div`
  ${VoteCard} {
    max-width: 370px;
    width: 100%;
    float: left;
    border-radius: 0;
  }
`

export default function Saave() {
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
                        This is where your HALO token rewards go. We saved you some gas and sent it straight to the Dessert Pool
                        to earn daily.
                      </RowBetween>
                    </TokenRewardsExplainer>
                  </AutoColumn>
                </AutoColumnVesting>
              </CardSection>
            </CardSectionWrapper>
          </VoteCard>
        </VoteCardWrapper>
        <div
          style={{
            width: '440px',
            float: 'right',
            border: '1px solid #15006D',
            borderRadius: '4px',
            boxShadow: "0px 7px 14px rgba(0, 0, 0, 0.1)"
          }}
        >
          <HaloChestHeader />
          <Wrapper
            id="swap-page"
            style={{
              padding: '0 30px 0 30px'
            }}
          >
            <AutoColumn
              style={{
                padding: '10px 0 10px 0'
              }}
            >
              <HaloDepositPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to deposit: '}
                id="stake-liquidity-token"
                buttonText="Claim HALO"
                cornerRadiusBottomNone={true}
              />
              <HALOHALODepositPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to withdraw: '}
                id="withdraw-liquidity-token"
                buttonText="Withdraw"
                cornerRadiusTopNone={true}
              />
              <RowBetween
                style={{
                  padding: '30px 0 0 0'
                }}
              >
                <div
                  style={{
                    margin: 'auto'
                  }}
                >
                  <img
                    style={{
                      float: 'left'
                    }}
                    src={HalohaloIngredients}
                    alt="Halo Halo"
                  />
                  <div
                    style={{
                      margin: '8px 0 0 10px',
                      fontStyle: 'italic',
                      fontFamily: 'Open Sans',
                      fontWeight: 600,
                      lineHeight: '16px',
                      letterSpacing: '0.2em',
                      color: '#000000',
                      float: 'left'
                    }}
                  >
                    HALOHALO:HALO = x1.15
                  </div>
                </div>
              </RowBetween>
            </AutoColumn>
          </Wrapper>
        </div>
        <CardSection
          style={{
            width: '350px',
            marginTop: '28px',
            background: '#e9e4f7',
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '130%',
            color: '#333333',
            borderRadius: '8px',
            padding: '24px 27px 24px 40px'
          }}
        >
          <RowBetween
            style={{
              fontFamily: 'Open Sans',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: '16px',
              letterSpacing: '0.1em',
              color: '#15006D',
              margin: '0 0 20px 0'
            }}
          >
            DESSERT FACT
          </RowBetween>
          <RowBetween>
            The longer you keep HALOHALO, the more HALO you can claim later on (% APY). Claim anytime but lose out on
            daily HALO vesting multiples.
          </RowBetween>
        </CardSection>
      </PageWrapper>
    </>
  )
}
