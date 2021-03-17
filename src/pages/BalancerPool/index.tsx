import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import BalancerPoolCard, { BalancerPoolInfo } from 'components/PositionCard/BalancerPoolCard'
import { BALANCER_POOLS } from '../../constants'
import { CardSection, DataCard } from 'components/earn/styled'
import { transparentize } from 'polished'
import { Token } from '@sushiswap/sdk'
import useUSDCPrice from 'utils/useUSDCPrice'
import { useTokenBalance } from 'state/wallet/hooks'
import PoolsSummary from 'components/PoolsSummary'

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
  const { account, chainId } = useActiveWeb3React()
  const pools: BalancerPoolInfo[] = chainId ? BALANCER_POOLS[chainId] ?? [] : []
  const [poolTokens, setPoolTokens] = useState<Token[]>([])

  useEffect(() => {
    if (!chainId) return
    const tokens: Token[] = []
    pools.forEach(pool => {
      const token = new Token(chainId, pool.address, 18, 'BPT', `BPT: ${pool.pair}`)
      tokens.push(token)
    })
    setPoolTokens(tokens)
    console.log('poolTokens assigned!', tokens)
  }, [chainId])

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <TitleRow>
          <HideSmall>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Pools</TYPE.mediumHeader>
          </HideSmall>
        </TitleRow>

        <PoolsSummary account={account ?? undefined} poolTokens={poolTokens} />

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            {pools.map(pool => {
              return <BalancerPoolCard key={pool.address} account={account} poolInfo={pool} />
            })}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BalancerPool
