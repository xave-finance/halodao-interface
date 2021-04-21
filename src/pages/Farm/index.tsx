import React from 'react'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'
import { TYPE, ExternalLink, LinkIcon, HideLarge, HideSmall } from '../../theme'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import BalancerPoolCard from 'components/PositionCard/BalancerPoolCard'
import PoolsSummary from 'components/PoolsSummary'
import Card from 'components/Card'
import { useBalancer } from 'halo-hooks/useBalancer'
import { useWhitelistedPoolAddresses } from 'halo-hooks/useRewards'

const PageWrapper = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
`

const PoolsSummaryRow = styled(Row)`
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
  const poolAddresses = useWhitelistedPoolAddresses()
  const { poolsInfo, tokenPrice } = useBalancer(poolAddresses)
  const { t } = useTranslation()

  return (
    <>
      <PageWrapper id={`farm-page`}>
        <PoolsSummaryRow>
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
              <StyledExternalLink href="#" style={{ fontSize: '16px' }}>
                {t('getBPTTokens')}
                <HideLarge>
                  <LinkIcon></LinkIcon>
                </HideLarge>
              </StyledExternalLink>
            </Row>
            <Row>
              <StyledExternalLink href="#" style={{ fontSize: '16px' }}>
                {t('learnAboutStaking')}
                <HideLarge>
                  <LinkIcon></LinkIcon>
                </HideLarge>
              </StyledExternalLink>
            </Row>
          </HeaderRow>
          <Row>
            <PoolsSummary poolsInfo={poolsInfo} />
          </Row>
        </PoolsSummaryRow>

        <AutoColumn
          gap="sm"
          style={{
            width: '100%'
          }}
        >
          <HideSmall>
            <Card
              style={{
                padding: '10px 0 0 0'
              }}
            >
              <AutoColumn>
                <RowBetween>
                  <RowFixed width="22%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('pool')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="19%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('totalPoolValue')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('stakeable')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('valueStaked')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('earned')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="9%"></RowFixed>
                </RowBetween>
              </AutoColumn>
            </Card>
          </HideSmall>
          {poolsInfo.map(poolInfo => {
            return <BalancerPoolCard key={poolInfo.address} poolInfo={poolInfo} tokenPrice={tokenPrice} />
          })}
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default Farm
