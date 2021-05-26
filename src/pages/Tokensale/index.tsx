import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import Row, { RowBetween } from '../../components/Row'
import { IndigoCard } from '../../components/Card'
import { TYPE } from 'theme'
import { transparentize } from 'polished'
import useMisoDutchAuction from 'halo-hooks/useMisoDutchAuction'
import TokenSalePanel from './TokenSalePanel'

const PageWrapper = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
`

const HeaderRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column;
  `};
  flex-direction: column;
  width: 100%;
  padding-right: 0.5rem;
  text-align: left;
`

const TitleRow = styled(RowBetween)`
  font-family: 'Fredoka One', cursive;
  color: #471bb2;
  text-align: left;
`

const DashboardRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
  `};
  flex-direction: row;
  align-items: start;
  margin: 1.5 rem;
`

const InfoRow = styled(Row)`
  flex-direction: column;
  margin-right: 0.5rem;
`

const InfoTitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.bg2};
`

const StakeCard = styled(IndigoCard)`
  background: ${({ theme }) => transparentize(0.9, theme.primary1)};
  overflow: hidden;
  margin-bottom: 0.5rem;
`

export default function TokenSale() {
  const {
    endTime,
    marketParticipationAgreement,
    currentTokenPrice,
    userTokensClaimable,
    tokenAveragePrice
  } = useMisoDutchAuction()

  return (
    <PageWrapper gap="lg" justify="center">
      <HeaderRow>
        <TitleRow>
          <TYPE.largeHeader style={{ justifySelf: 'flex-start' }}>Token Sale</TYPE.largeHeader>
        </TitleRow>
        <br />
        <TYPE.darkGray style={{ fontSize: '16px', margin: '2px 0', lineHeight: '130%', justifySelf: 'flex-start' }}>
          <b>Proceeding means you agree to this Market Participation Agreement </b>
        </TYPE.darkGray>
        <p> {marketParticipationAgreement}</p>
      </HeaderRow>

      <DashboardRow>
        <InfoRow>
          <StakeCard>
            <InfoTitleRow>
              <TYPE.subHeader
                style={{
                  letterSpacing: '0.1em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  justifySelf: 'flex-start'
                }}
              >
                End Time
              </TYPE.subHeader>
            </InfoTitleRow>
            <Row>
              <TYPE.body
                style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '0.77rem', justifySelf: 'flex-start' }}
                id="text-stakeable-value"
              >
                {endTime || 'not active'}
              </TYPE.body>
            </Row>
          </StakeCard>
          <StakeCard>
            <InfoTitleRow>
              <TYPE.subHeader
                style={{
                  letterSpacing: '0.1em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  justifySelf: 'flex-start'
                }}
              >
                Total user claimable HALO:
              </TYPE.subHeader>
            </InfoTitleRow>
            <Row>
              <TYPE.body
                style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '1.5rem', justifySelf: 'flex-start' }}
                id="text-stakeable-value"
              >
                {userTokensClaimable} HALO
              </TYPE.body>
            </Row>
          </StakeCard>
        </InfoRow>
        <InfoRow>
          <StakeCard>
            <InfoTitleRow>
              <TYPE.subHeader
                style={{
                  letterSpacing: '0.1em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  justifySelf: 'flex-start'
                }}
              >
                Current Price
              </TYPE.subHeader>
            </InfoTitleRow>
            <Row>
              <TYPE.body
                style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '1.5rem', justifySelf: 'flex-start' }}
                id="text-stakeable-value"
              >
                {currentTokenPrice} USDC
              </TYPE.body>
            </Row>
          </StakeCard>

          <StakeCard>
            <InfoTitleRow>
              <TYPE.subHeader
                style={{
                  letterSpacing: '0.1em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  justifySelf: 'flex-start'
                }}
              >
                Average Price
              </TYPE.subHeader>
            </InfoTitleRow>
            <Row>
              <TYPE.body
                style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '1.5rem', justifySelf: 'flex-start' }}
                id="text-stakeable-value"
              >
                {tokenAveragePrice} USDC
              </TYPE.body>
            </Row>
          </StakeCard>
        </InfoRow>{' '}
      </DashboardRow>

      <TokenSalePanel label={''} disableCurrencySelect={true} id="token-sale" cornerRadiusBottomNone={true} />
    </PageWrapper>
  )
}
