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
import { useParams } from 'react-router'
import { useActiveWeb3React } from 'hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 1040px;
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
  const { address } = useParams<{ address: string | undefined }>()
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | undefined>(undefined)
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const [allTokenAddresses, setAllTokenAddresses] = useState<string[]>([])
  const tokenPrice = useTokenPrice(allTokenAddresses)

  const lpTokenAddresses = useLPTokenAddresses()
  const fetchPoolInfo = usePoolInfo(lpTokenAddresses)
  const [poolsInfo, setPoolsInfo] = useState<PoolInfo[]>([])
  const allocPoints = useAllocPoints(lpTokenAddresses)

  useEffect(() => {
    setPoolsInfo([])
  }, [chainId])

  useEffect(() => {
    fetchPoolInfo().then(result => {
      setPoolsInfo(result.poolsInfo)
      setAllTokenAddresses(prev => [...prev, ...result.tokenAddresses])
    })
  }, [lpTokenAddresses]) //eslint-disable-line

  useEffect(() => {
    const newPoolsInfo = poolsInfo
    newPoolsInfo.forEach(poolInfo => {
      poolInfo.allocPoint = allocPoints[poolInfo.pid]
    })
    setPoolsInfo(newPoolsInfo)
  }, [poolsInfo, allocPoints])

  useEffect(() => {
    setSelectedPoolAddress(address?.toLowerCase())
  }, [address])

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
        <FarmPoolTable
          poolsInfo={poolsInfo}
          v0PoolsInfo={[] as PoolInfo[]}
          v1PoolsInfo={[] as PoolInfo[]}
          tokenPrice={tokenPrice}
          selectedPool={selectedPoolAddress}
        />
      </PageWrapper>
    </>
  )
}

export default Farm
