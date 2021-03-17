import { Token } from '@sushiswap/sdk'
import { AutoColumn } from 'components/Column'
import { CardSection, DataCard } from 'components/earn/styled'
import { RowBetween } from 'components/Row'
import { transparentize } from 'polished'
import React, { useContext, useState } from 'react'
import { useTokenBalances } from 'state/wallet/hooks'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from 'theme'
import useUSDCPrice from 'utils/useUSDCPrice'

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.text4};
  overflow: hidden;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

interface PoolsSummaryProps {
  account?: string
  poolTokens: Token[]
}

const PoolsSummary = ({ account, poolTokens }: PoolsSummaryProps) => {
  const theme = useContext(ThemeContext)

  const balances = useTokenBalances(account, poolTokens)
  console.log('balances:', balances)

  // const price = useUSDCPrice(poolTokens[0])
  // console.log('price:', price)

  const [summary, setSummary] = useState({ stakableValue: '$ --', stakedValue: '$ --', haloEarned: '--' })

  // if (chainId && account) {
  // pools.forEach(pool => {
  //   // tokens.push(new Token(chainId, pool.address, 18, 'BPT', `BPT: ${pool.pair}`))
  //   const BPTToken = new Token(chainId, pool.address, 18, 'BPT', `BPT: ${pool.pair}`)
  //   const bptBalance = useTokenBalance(account, BPTToken)
  //   if (bptBalance) {
  //     console.log(`BTP balance for ${pool.pair}:`, bptBalance.toFixed(2))
  //   }
  // })
  // }

  return (
    <VoteCard>
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My Stakeable Value
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My Staked Value
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My HALO Earned
            </TYPE.white>
          </RowBetween>
          <RowBetween>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.stakableValue}
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.stakedValue}
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.haloEarned} HALO
            </TYPE.white>
          </RowBetween>
        </AutoColumn>
      </CardSection>
    </VoteCard>
  )
}

export default PoolsSummary
