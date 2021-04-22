import React from 'react'
import styled from 'styled-components'

//import { WrapperNoPadding } from '../../components/swap/styleds'
//import { useDarkModeManager } from '../../state/user/hooks'
// import AppBody from '../AppBody'
import HaloChestHeader from './HaloHaloHeader'
import HaloChestHeaderMobile from './HaloHaloHeaderMobile'
import { Wrapper } from '../../components/swap/styleds'

import HaloDepositPanel from './HaloDepositPanel'
import HaloDepositPanelMobile from './HaloDepositPanelMobile'
import HALOHALODepositPanel from './HALOHALODepositPanel'
import HALOHALODepositPanelMobile from './HALOHALODepositPanelMobile'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
// import { TYPE } from '../../theme'
import { transparentize } from 'polished'

import HalohaloIngredients from '../../assets/svg/halohalo-ingredients.svg'

const PageWrapperWeb = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
  display: block;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const PageWrapperMobile = styled(AutoColumn)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: inline;
  `};
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
      <PageWrapperWeb>
        <VoteCard
          style={{
            maxWidth: '370px',
            width: '100%',
            float: 'left',
            borderRadius: 0
          }}
        >
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween
                style={{
                  fontFamily: 'Open Sans',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  lineHeight: '16px',
                  letterSpacing: '0.2em',
                  color: '#000000'
                }}
              >
                VESTING
              </RowBetween>
              <RowBetween
                style={{
                  fontFamily: 'Fredoka One',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '36px',
                  lineHeight: '44px',
                  color: '#471BB2'
                }}
              >
                Dessert Pool
              </RowBetween>
              <RowBetween
                style={{
                  fontFamily: 'Open Sans',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '16px',
                  lineHeight: '130%',
                  color: '#333333'
                }}
              >
                This is where your HALO token rewards go. We saved you some gas and sent it straight to the Dessert Pool
                to earn daily.
              </RowBetween>
            </AutoColumn>
          </CardSection>
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
        </VoteCard>
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
      </PageWrapperWeb>
      <PageWrapperMobile>
        <VoteCard
          style={{
            width: '100%',
            float: 'left',
            borderRadius: 0
          }}
        >
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween
                style={{
                  fontFamily: 'Fredoka One',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '36px',
                  lineHeight: '44px',
                  color: '#471BB2'
                }}
              >
                Dessert Pool
              </RowBetween>
              <RowBetween
                style={{
                  fontFamily: 'Open Sans',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '16px',
                  lineHeight: '130%',
                  color: '#333333'
                }}
              >
                This is where your HALO token rewards go. We saved you some gas and sent it straight to the Dessert Pool
                to earn daily.
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <div
            style={{
              width: '100%',
              border: '1px solid #15006D',
              borderRadius: '4px',
              padding: '20px 20px 0 20px',
              boxShadow: "0px 7px 14px rgba(0, 0, 0, 0.1)"
            }}
          >
            <HaloChestHeaderMobile />
            <HaloDepositPanelMobile
              label={''}
              disableCurrencySelect={true}
              customBalanceText={'Available to deposit: '}
              id="stake-liquidity-token"
              buttonText="Claim HALO"
              cornerRadiusBottomNone={true}
            />
            <HALOHALODepositPanelMobile
              label={''}
              disableCurrencySelect={true}
              customBalanceText={'Available to withdraw: '}
              id="withdraw-liquidity-token"
              buttonText="Withdraw"
              cornerRadiusTopNone={true}
            />
            <RowBetween
              style={{
                padding: '20px 0 20px 0'
              }}
            >
              <div
                style={{
                  width: '100%',
                  fontStyle: 'italic',
                  fontFamily: 'Open Sans',
                  fontWeight: 600,
                  lineHeight: '16px',
                  letterSpacing: '0.2em',
                  color: '#000000',
                  textAlign: 'center'
                }}
              >
                HALOHALO:HALO = x1.15
              </div>
            </RowBetween>
          </div>
          <CardSection
            style={{
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
        </VoteCard>
      </PageWrapperMobile>
    </>
  )
}
