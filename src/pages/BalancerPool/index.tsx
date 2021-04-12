import React from 'react'
import styled from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, ExternalLink, LinkIcon, HideLarge, HideSmall } from '../../theme'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import BalancerPoolCard from 'components/PositionCard/BalancerPoolCard'
import PoolsSummary from 'components/PoolsSummary'
import { useBalancer } from 'halo-hooks/useBalancer'
import { useWhitelistedPoolAddresses } from 'halo-hooks/useRewards'
import Card from 'components/Card'

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
`

const BalancerPool = () => {
  const poolAddresses = useWhitelistedPoolAddresses()
  const { poolsInfo, tokenPrice } = useBalancer(poolAddresses)

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <PoolsSummaryRow>
          <HeaderRow>
            <TitleRow>
              <TYPE.largeHeader style={{ justifySelf: 'flex-start' }}>Farm</TYPE.largeHeader>
            </TitleRow>
            <Row>
              <TYPE.darkGray style={{ marginRight: '0.5rem', marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                Stake your Balancer Pool Tokens (BPT) to earn Halo!
              </TYPE.darkGray>
            </Row>
            <Row>
              <StyledExternalLink href="https://google.com" style={{ fontSize: '14px' }}>
                Learn about staking
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

        <AutoColumn gap="sm" style={{ width: '100%' }}>
          <HideSmall>
            <Card>
              <AutoColumn>
                <RowBetween>
                  <RowFixed width="24%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>Pool</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="19%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>Total Pool Value</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>Stakable</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>Value Staked</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>Earned</TYPE.thHeader>
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

export default BalancerPool
