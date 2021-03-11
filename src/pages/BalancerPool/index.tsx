import React from 'react'
import styled from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import BalancerPoolCard, { BalancerPoolInfo } from 'components/PositionCard/BalancerPoolCard'

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
  const { account } = useActiveWeb3React()
  const pools: BalancerPoolInfo[] = [
    {
      // Kovan
      pair: 'WETH/DAI',
      address: '0x37f80ac90235ce0d3911952d0ce49071a0ffdb1e',
      balancerUrl: 'https://kovan.pools.balancer.exchange/#/pool/0x37f80ac90235ce0d3911952d0ce49071a0ffdb1e'
    }
  ]

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Pools</TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            {pools.map(pool => {
              return <BalancerPoolCard account={account} poolInfo={pool} />
            })}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BalancerPool
