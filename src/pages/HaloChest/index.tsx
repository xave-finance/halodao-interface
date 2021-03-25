import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

//import { WrapperNoPadding } from '../../components/swap/styleds'
//import { useDarkModeManager } from '../../state/user/hooks'
import AppBody from '../AppBody'
import HaloChestHeader from './HaloChestHeader'
import { Wrapper } from '../../components/swap/styleds'

import HaloDepositPanel from './HaloDepositPanel'
import XHaloWithdrawlPanel from './XHaloWithdrawlPanel'

import { CardSection, DataCard } from '../../components/earn/styled'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { TYPE } from '../../theme'
import { transparentize } from 'polished'

//import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 420px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  overflow: hidden;
  margin-bottom: 10px;
`

export default function Saave() {
  const theme = useContext(ThemeContext)
  //const { account } = useActiveWeb3React()
  //const darkMode = useDarkModeManager()

  return (
    <>
      <PageWrapper>
        <VoteCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600} color={theme.text1}>
                  HALO: Make HALO work for you
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                <div>
                  <TYPE.white fontSize={14} color={theme.text2} style={{ paddingBottom: '10px' }}>
                    {`Stake your HALO into xHALO for ~% APY. No impermanent loss, no loss of governance rights. Continuously compounding.`}
                  </TYPE.white>
                </div>
              </RowBetween>
              {/*

              // Enable when we have analytics already

              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                target="_blank"
                href="https://analytics.sushi.com/bar"
              >
           
                <TYPE.white fontSize={14} color={theme.text1}>
                  View SushiBar Stats <span style={{ fontSize: '11px' }}>↗</span>
                </TYPE.white>
              </ExternalLink>

              
              {account && (
                
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  target="_blank"
                  href={'http://analytics.sushi.com/users/' + account}
                >
                  <TYPE.white fontSize={14} color={theme.text1}>
                    View your SushiBar Portfolio <span style={{ fontSize: '11px' }}>↗</span>
                  </TYPE.white>
                </ExternalLink>
              )}
                 */}
            </AutoColumn>
          </CardSection>
        </VoteCard>
        <AppBody>
          <HaloChestHeader />
          <Wrapper id="swap-page">
            <AutoColumn style={{ paddingBottom: '10px' }}>
              <HaloDepositPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to deposit: '}
                id="stake-liquidity-token"
                buttonText="Deposit"
                cornerRadiusBottomNone={true}
              />
              <XHaloWithdrawlPanel
                label={''}
                disableCurrencySelect={true}
                customBalanceText={'Available to withdraw: '}
                id="withdraw-liquidity-token"
                buttonText="Withdraw"
                cornerRadiusTopNone={true}
              />
            </AutoColumn>
          </Wrapper>
        </AppBody>
      </PageWrapper>
    </>
  )
}
