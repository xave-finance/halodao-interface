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

//import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 760px;
  width: 100%;
  display: block;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  overflow: hidden;
  margin-bottom: 10px;
`

export default function Saave() {
  // const theme = useContext(ThemeContext)
  //const { account } = useActiveWeb3React()
  //const darkMode = useDarkModeManager()

  return (
    <>
      <PageWrapper>
        <VoteCard
          style={{
            maxWidth: "300px",
            width: "100%",
            float: "left",
            borderRadius: 0
          }}
        >
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween
                style={{
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontWeight: 800,
                  lineHeight: "16px",
                  letterSpacing: "0.2em",
                  color: "#000000"
                }}
              >
                VESTING
              </RowBetween>
              <RowBetween
                style={{
                  fontFamily: "Fredoka One",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "36px",
                  lineHeight: "44px",
                  color: "#471BB2"
                }}
              >
                Dessert Pool
              </RowBetween>
              <RowBetween
                style={{
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "16px",
                  lineHeight: "130%",
                  color: "#333333"
                }}
              >
                This is where your HALO token rewards go. We saved you some gas and sent it straight to the Dessert Pool to earn daily.
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardSection
            style={{
              width: "300px",
              height: "200px",
              marginTop: "28px",
              background: "#e9e4f7",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "16px",
              lineHeight: "130%",
              color: "#333333",
              borderRadius: "8px",
              paddingLeft: "40px"
            }}
          >
            <RowBetween
              style={{
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "16px",
                letterSpacing: "0.1em",
                color: "#15006D"
              }}
            >DESSERT FACT</RowBetween>
            <RowBetween>
              The longer you keep HALOHALO, the more HALO you can claim later on (% APY). Claim anytime but lose out on daily HALO vesting multiples.
            </RowBetween>
          </CardSection>
        </VoteCard>
        <div
          style={{
            width: "440px",
            float: "right"
          }}
        >
          <HaloChestHeader />
          <Wrapper id="swap-page"
            style={{
              background: "yellow"
            }}
          >
            <AutoColumn style={{
              paddingBottom: '10px',
              background: "green"
            }}>
              <HaloDepositPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to deposit: '}
                id="stake-liquidity-token"
                buttonText="Deposit"
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
            </AutoColumn>
          </Wrapper>
        </div>
      </PageWrapper>
    </>
  )
}
