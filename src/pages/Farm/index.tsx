import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TYPE, ExternalLink, LinkIcon, HideLarge } from '../../theme'
import Row, { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import FarmSummary from 'components/Farm/FarmSummary'
import EmptyState from 'components/EmptyState'
import { usePoolAddresses } from 'halo-hooks/useRewards'
import { PoolInfo, usePoolInfo } from 'halo-hooks/usePoolInfo'
import FarmPoolTable from 'components/Farm/FarmPoolTable'

const PageWrapper = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
`

const FarmSummaryRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
  `};
  flex-direction: row;
  align-items: start;
`

const HeaderRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column;
  `};
  flex-direction: column;
  width: 60%;
  padding-right: 0.5rem;
`

const TitleRow = styled(RowBetween)`
  font-family: 'Fredoka One', cursive;
  color: #471bb2;
`

const StyledExternalLink = styled(ExternalLink)`
  ${({ theme }) => theme.mediaWidth.upToSmall` 
    border: 1px solid #518CFF;
    box-sizing: border-box;
    border-radius: 20px; 
    padding: 0.5rem;
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: center;
    text-decoration: none;
  `};
  color: #518cff;
  text-decoration-line: underline;
  line-height: 130%;
`

const Farm = () => {
  const poolAddresses = usePoolAddresses()
  const fetchPoolInfo = usePoolInfo(poolAddresses)
  const { t } = useTranslation()
  const [poolsInfo, setPoolsInfo] = useState<PoolInfo[]>([])
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([])

  useEffect(() => {
    fetchPoolInfo().then(result => {
      setPoolsInfo(result.poolsInfo)
      setTokenAddresses(result.tokenAddresses)
    })
  }, [poolAddresses]) // eslint-disable-line

  return (
    <>
      <PageWrapper id={`farm-page`}>
        <FarmSummaryRow>
          <HeaderRow>
            <TitleRow>
              <TYPE.largeHeader style={{ justifySelf: 'flex-start' }}>Farm</TYPE.largeHeader>
            </TitleRow>
            <Row>
              <TYPE.darkGray
                style={{ fontSize: '16px', margin: '2px 0', lineHeight: '130%', justifySelf: 'flex-start' }}
              >
                {t('stakeToEarn')}
              </TYPE.darkGray>
            </Row>
            <Row>
              <StyledExternalLink href="https://docs.halodao.com/v0-guide/how-to-farm" style={{ fontSize: '16px' }}>
                {t('learnAboutStaking')}
                <HideLarge>
                  <LinkIcon></LinkIcon>
                </HideLarge>
              </StyledExternalLink>
            </Row>
          </HeaderRow>
          <Row>
            <FarmSummary poolsInfo={poolsInfo} />
          </Row>
        </FarmSummaryRow>
        <EmptyState header={t('emptyStateTitleInFarm')} subHeader={t('emptyStateSubTitleInFarm')} />
        <FarmPoolTable poolsInfo={poolsInfo} tokenAddresses={tokenAddresses} />
      </PageWrapper>
    </>
  )
}

export default Farm
