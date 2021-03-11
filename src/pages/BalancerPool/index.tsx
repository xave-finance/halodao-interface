import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { TYPE, HideSmall } from '../../theme'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import { Dots } from '../../components/swap/styleds'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
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

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const BalancerPool = () => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const isLoading = false
  const pools: string[] = ['0x37f80ac90235ce0d3911952d0ce49071a0ffdb1e']

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

            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : isLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : pools?.length > 0 ? (
              <>
                {pools.map(pool => {
                  return <p>{pool}</p>
                })}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  No liquidity found.
                </TYPE.body>
              </EmptyProposals>
            )}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default BalancerPool
