import { useTranslation } from 'react-i18next'
import React from 'react'

import Row from '../Row'
import { IndigoCard } from '../Card'
import { RowBetween } from 'components/Row'
import { transparentize } from 'polished'
import styled from 'styled-components'
import { TYPE, HideSmall } from 'theme'
import useFarmSummary from 'halo-hooks/useFarmSummary'
import { PoolInfo } from 'halo-hooks/usePoolInfo'

import HaloHalo from '../../assets/images/xrnbw-token.png'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import FarmPoolCardNew from './FarmPoolCardNew'

const DashboardRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
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

const FarmSummary = ({ poolsInfo, tokenPrice }: FarmSummaryProps) => {
  const summary = useFarmSummary(poolsInfo, tokenPrice)
  const { t } = useTranslation()

  return (
    <DashboardRow>
      <Row>
        <FarmPoolCardNew title={'Total Value Locked (USD)'} tokenPrice={'test'} header={true} />
      </Row>
      <Row>
        <FarmPoolCardNew title={'sample'} tokenPrice={'test'} header={true} />
      </Row>
      <Row>
        <FarmPoolCardNew title={'sample'} tokenPrice={'test'} header={true} />
      </Row>
      <Row>
        <FarmPoolCardNew title={'sample'} tokenPrice={'test'} header={true} />
      </Row>
    </DashboardRow>
  )
}

export default FarmSummary
