import { useTranslation } from 'react-i18next'
import React from 'react'

import Row from '../Row'
import { IndigoCard } from '../Card'
import { RowBetween } from 'components/Row'
import { transparentize } from 'polished'
import styled from 'styled-components'
import useFarmSummary from 'halo-hooks/useFarmSummary'
import { PoolInfo } from 'halo-hooks/usePoolInfo'

import { TokenPrice } from 'halo-hooks/useTokenPrice'
import GradientCard from './GradientCard'

const DashboardRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
    margin-bottom: 10px;
  `};
  flex-direction: row;
  align-items: start;
  gap: 6px;
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

interface FarmSummaryProps {
  poolsInfo: PoolInfo[]
  tokenPrice: TokenPrice
}

const FarmCardParent = styled.div`
  max-width: 175px;
  ${({ theme }) => theme.mediaWidth.upToSmall`  
      max-width: unset;
    `};
  height: 118px;
  ${({ theme }) => theme.mediaWidth.upToSmall`  
      height: calc(118px - 54px);
    `};
  width: 100%;
`

const FarmSummary = ({ poolsInfo, tokenPrice }: FarmSummaryProps) => {
  const summary = useFarmSummary(poolsInfo, tokenPrice)
  const { t } = useTranslation()

  return (
    <DashboardRow>
      <Row>
        <FarmCardParent>
          <GradientCard title="Total Value Locked (USD)" value={'5000.003'} header={true} />
        </FarmCardParent>
      </Row>
      <Row>
        <FarmCardParent>
          <GradientCard title={t('poolSummaryHaloEarned')} value={summary.haloEarned} header={true} />
        </FarmCardParent>
      </Row>
      <Row>
        <FarmCardParent>
          <GradientCard title={t('poolSummaryStakeable')} value={summary.stakeableValue} header={true} />
        </FarmCardParent>
      </Row>
      <Row>
        <FarmCardParent>
          <GradientCard title={t('poolSummaryStaked')} value={summary.stakedValue} header={true} />
        </FarmCardParent>
      </Row>
    </DashboardRow>
  )
}

export default FarmSummary
