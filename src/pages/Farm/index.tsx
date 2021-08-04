import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TYPE, ExternalLink, LinkIcon } from '../../theme'
import Row, { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import FarmSummary from 'components/Farm/FarmSummary'
import EmptyState from 'components/EmptyState'
import { useLPTokenAddresses, useAllocPoints } from 'halo-hooks/useRewards'
import { PoolInfo, usePoolInfo } from 'halo-hooks/usePoolInfo'
import FarmPoolTable from 'components/Farm/FarmPoolTable'
import { useTokenPrice } from 'halo-hooks/useTokenPrice'
import { updatePools } from 'state/pool/actions'
import { Pool } from 'state/pool/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'

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
  padding-right: 2rem;
`

const TitleRow = styled(RowBetween)`
  font-family: 'Fredoka One', cursive;
  color: #471bb2;
`

const StyledExternalLink = styled(ExternalLink)`
  color: #518cff;
  text-decoration-line: underline;
  line-height: 130%;

  .link-icon {
    display: none;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border: 1px solid #518CFF;
    box-sizing: border-box;
    border-radius: 20px; 
    padding: 0.5rem;
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: center;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;

    .link-icon {
      display: inline;
    }
  `};
`

const Farm = () => {
  const lpTokenAddresses = useLPTokenAddresses()
  const fetchPoolInfo = usePoolInfo(lpTokenAddresses)
  const { t } = useTranslation()
  const [poolsInfo, setPoolsInfo] = useState<PoolInfo[]>([])
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([])
  const tokenPrice = useTokenPrice(tokenAddresses)
  const allocPoints = useAllocPoints(lpTokenAddresses)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    fetchPoolInfo().then(result => {
      setPoolsInfo(result.poolsInfo)
      setTokenAddresses(result.tokenAddresses)

      const pools: Pool[] = []
      for (const poolInfo of result.poolsInfo) {
        pools.push({
          pid: poolInfo.pid,
          lpTokenAddress: poolInfo.address
        })
      }
      dispatch(updatePools(pools))
    })
  }, [lpTokenAddresses]) //eslint-disable-line

  useEffect(() => {
    const newPoolsInfo = poolsInfo
    newPoolsInfo.forEach(poolInfo => {
      poolInfo.allocPoint = allocPoints[poolInfo.pid]
    })
    setPoolsInfo(newPoolsInfo)
  }, [poolsInfo, allocPoints])

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
                <LinkIcon className="link-icon"></LinkIcon>
              </StyledExternalLink>
            </Row>
          </HeaderRow>
          <Row>
            <FarmSummary poolsInfo={poolsInfo} tokenPrice={tokenPrice} />
          </Row>
        </FarmSummaryRow>
        <EmptyState header={t('emptyStateTitleInFarm')} subHeader={t('emptyStateSubTitleInFarm')} />
        <FarmPoolTable poolsInfo={poolsInfo} tokenPrice={tokenPrice} />
      </PageWrapper>
    </>
  )
}

export default Farm
