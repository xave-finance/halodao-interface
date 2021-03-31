import React from 'react'
import styled from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, HideSmall } from '../../theme'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import BalancerPoolCard from 'components/PositionCard/BalancerPoolCard'
import PoolsSummary from 'components/PoolsSummary'
import { useBalancer } from 'halo-hooks/useBalancer'
import { useRewards } from 'halo-hooks/useRewards'
import Card from 'components/Card'

const PageWrapper = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const BalancerPool = () => {
  const { poolAddresses } = useRewards()
  const { poolsInfo, tokenPrice } = useBalancer(poolAddresses)

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <TitleRow>
          <HideSmall>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Pools</TYPE.mediumHeader>
          </HideSmall>
        </TitleRow>

        <PoolsSummary poolsInfo={poolsInfo} />

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <Card>
              <AutoColumn>
                <RowBetween>
                  <RowFixed width="24%">Pool</RowFixed>
                  <RowFixed width="19%">Total Pool Value</RowFixed>
                  <RowFixed width="16%">Stakable</RowFixed>
                  <RowFixed width="16%">Value Staked</RowFixed>
                  <RowFixed width="16%">Earned</RowFixed>
                  <RowFixed width="9%"></RowFixed>
                </RowBetween>
              </AutoColumn>
            </Card>
            {poolsInfo.map(poolInfo => {
              return <BalancerPoolCard key={poolInfo.address} poolInfo={poolInfo} tokenPrice={tokenPrice} />
            })}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BalancerPool
