import React from 'react'
import styled from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import BalancerPoolCard from 'components/PositionCard/BalancerPoolCard'
import PoolsSummary from 'components/PoolsSummary'
import { useBalancer } from 'halo-hooks/useBalancer'
import { useRewards } from 'halo-hooks/useRewards'

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
  const { allPoolInfo, tokenPrice } = useBalancer(poolAddresses)

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <TitleRow>
          <HideSmall>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Pools</TYPE.mediumHeader>
          </HideSmall>
        </TitleRow>

        <PoolsSummary pools={allPoolInfo.map(poolInfo => poolInfo.asToken)} />

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <RowBetween>
              <div>Pool</div>
              <div>Total Pool Value</div>
              <div>Stakable</div>
              <div>Value Staked</div>
              <div>Earned</div>
              <div></div>
            </RowBetween>
            {allPoolInfo.map(poolInfo => {
              return <BalancerPoolCard key={poolInfo.address} poolInfo={poolInfo} tokenPrice={tokenPrice} />
            })}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BalancerPool
