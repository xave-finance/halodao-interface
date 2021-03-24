import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import BalancerPoolCard from 'components/PositionCard/BalancerPoolCard'
import { Token } from '@sushiswap/sdk'
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
  const { chainId } = useActiveWeb3React()
  const { poolAddresses } = useRewards()
  const { poolInfo, toPoolTokens } = useBalancer(poolAddresses)

  const [poolTokens, setPoolTokens] = useState<Token[]>([])

  useEffect(() => {
    if (!chainId || !poolInfo.length) return
    setPoolTokens(toPoolTokens(poolInfo, chainId))
  }, [chainId, poolInfo])

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <TitleRow>
          <HideSmall>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Pools</TYPE.mediumHeader>
          </HideSmall>
        </TitleRow>

        <PoolsSummary poolTokens={poolTokens} />

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            {poolInfo.map(pool => {
              return <BalancerPoolCard key={pool.address} poolInfo={pool} />
            })}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BalancerPool
