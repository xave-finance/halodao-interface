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
import { AmmRewardsVersion } from 'utils/ammRewards'
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
  width: 40%;
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

  const v0LpTokenAddresses = useLPTokenAddresses(AmmRewardsVersion.V0)
  const fetchV0PoolInfo = usePoolInfo(v0LpTokenAddresses)
  const [v0PoolsInfo, setV0PoolsInfo] = useState<PoolInfo[]>([])
  const v0AllocPoints = useAllocPoints(v0LpTokenAddresses, AmmRewardsVersion.V0)

  const v1LpTokenAddresses = useLPTokenAddresses(AmmRewardsVersion.V1)
  const fetchV1PoolInfo = usePoolInfo(v1LpTokenAddresses)
  const [v1PoolsInfo, setV1PoolsInfo] = useState<PoolInfo[]>([])
  const v1AllocPoints = useAllocPoints(v1LpTokenAddresses, AmmRewardsVersion.V1)

  const lpTokenAddresses = useLPTokenAddresses()
  const fetchPoolInfo = usePoolInfo(lpTokenAddresses)
  const [poolsInfo, setPoolsInfo] = useState<PoolInfo[]>([])
  const allocPoints = useAllocPoints(lpTokenAddresses)

  useEffect(() => {
    setPoolsInfo([])
    setV0PoolsInfo([])
    setV1PoolsInfo([])
  }, [chainId])

  useEffect(() => {
    fetchPoolInfo().then(result => {
      setPoolsInfo(result.poolsInfo)
      setAllTokenAddresses(prev => [...prev, ...result.tokenAddresses])
    })
  }, [lpTokenAddresses]) //eslint-disable-line

  useEffect(() => {
    fetchV0PoolInfo().then(result => {
      setV0PoolsInfo(result.poolsInfo)
      setAllTokenAddresses(prev => [...prev, ...result.tokenAddresses])
    })
  }, [v0LpTokenAddresses]) //eslint-disable-line

  useEffect(() => {
    fetchV1PoolInfo().then(result => {
      setV1PoolsInfo(result.poolsInfo)
      setAllTokenAddresses(prev => [...prev, ...result.tokenAddresses])
    })
  }, [v1LpTokenAddresses]) //eslint-disable-line

  useEffect(() => {
    const newPoolsInfo = poolsInfo
    newPoolsInfo.forEach(poolInfo => {
      poolInfo.allocPoint = allocPoints[poolInfo.pid]
    })
    setPoolsInfo(newPoolsInfo)
  }, [poolsInfo, allocPoints])

  useEffect(() => {
    const newPoolsInfo = v0PoolsInfo
    newPoolsInfo.forEach(poolInfo => {
      poolInfo.allocPoint = v0AllocPoints[poolInfo.pid]
    })
    setV0PoolsInfo(newPoolsInfo)
  }, [v0PoolsInfo, v0AllocPoints])

  useEffect(() => {
    const newPoolsInfo = v1PoolsInfo
    newPoolsInfo.forEach(poolInfo => {
      poolInfo.allocPoint = v1AllocPoints[poolInfo.pid]
    })
    setV1PoolsInfo(newPoolsInfo)
  }, [v1PoolsInfo, v1AllocPoints])

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
          v0PoolsInfo={v0PoolsInfo}
          v1PoolsInfo={v1PoolsInfo}
          tokenPrice={tokenPrice}
          selectedPool={selectedPoolAddress}
        />
      </PageWrapper>
    </>
  )
}

export default Farm
