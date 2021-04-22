import { useTranslation } from 'react-i18next'
import React from 'react'

import Row from '../../components/Row'
import { IndigoCard } from '../../components/Card'
import { RowBetween } from 'components/Row'
import { transparentize } from 'polished'
import styled from 'styled-components'
import { TYPE, HideSmall } from 'theme'
import usePoolsSummary from 'halo-hooks/usePoolsSummary'
import { PoolInfo } from 'halo-hooks/useBalancer'

import HaloHalo from '../../assets/svg/halohalo.svg'

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

const EarnedTitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text4};
`

const StakeCard = styled(IndigoCard)`
  background: ${({ theme }) => transparentize(0.9, theme.primary1)};
  overflow: hidden;
  margin-bottom: 0.5rem;
`

const EarnCard = styled(IndigoCard)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    height: 100%;
  `};
  background: ${({ theme }) => transparentize(0.9, theme.primary1)};
  overflow: hidden;
  margin-bottom: 0.5rem;
  height: 190px;
`

interface PoolsSummaryProps {
  poolsInfo: PoolInfo[]
}

const PoolsSummary = ({ poolsInfo }: PoolsSummaryProps) => {
  const summary = usePoolsSummary(poolsInfo)
  const { t } = useTranslation()

  return (
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
              {t('poolSummaryStakeable')}
            </TYPE.subHeader>
          </InfoTitleRow>
          <Row>
            <TYPE.body
              style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '1.5rem', justifySelf: 'flex-start' }}
              id="text-stakeable-value"
            >
              {summary.stakeableValue}
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
              {t('poolSummaryStaked')}
            </TYPE.subHeader>
          </InfoTitleRow>
          <Row>
            <TYPE.body
              style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '1.5rem', justifySelf: 'flex-start' }}
              id="text-staked-value"
            >
              {summary.stakedValue}
            </TYPE.body>
          </Row>
        </StakeCard>
      </InfoRow>
      <Row>
        <EarnCard>
          <HideSmall>
            <Row>
              <img style={{ marginBottom: '0.5rem' }} width={'85px'} src={HaloHalo} alt="Halo halo" />
            </Row>
          </HideSmall>
          <EarnedTitleRow>
            <TYPE.subHeader
              style={{
                letterSpacing: '0.1em',
                fontWeight: 800,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                justifySelf: 'flex-start'
              }}
            >
              {t('poolSummaryHaloEarned')}
            </TYPE.subHeader>
          </EarnedTitleRow>
          <Row>
            <TYPE.body
              style={{ marginTop: '0.1rem', fontWeight: 600, fontSize: '1.5rem', justifySelf: 'flex-start' }}
              id="text-halo-earned"
            >
              {summary.haloEarned}
            </TYPE.body>
          </Row>
        </EarnCard>
      </Row>
    </DashboardRow>
  )
}

export default PoolsSummary
