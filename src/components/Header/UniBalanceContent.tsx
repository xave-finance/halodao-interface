import { ChainId, TokenAmount } from '@halodao/sdk-poc'
import React from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
// import tokenLogo from '../../assets/images/token-logo.png'
import tokenLogo from '../../assets/svg/token-logo-new.svg'
import { HALO } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, TYPE, UniTokenAnimated } from '../../theme'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardSection, DataCard } from '../earn/styled'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.haloGradient};
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function UniBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const uni = chainId ? HALO[chainId] : undefined

  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)

  const totalSupply: TokenAmount | undefined = useTotalSupply(uni)
  const uniPrice = useUSDCPrice(uni)

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white" fontWeight="bold">
              Your HALO Breakdown
            </TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break style={{ backgroundColor: '#FFFFFF' }} />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.white
                  style={{
                    fontFamily: 'Fredoka One',
                    fontStyle: 'normal',
                    fontSize: '36px',
                    fontWeight: 'normal',
                    color: '#FFFFFF',
                    lineHeight: '44px'
                  }}
                >
                  {uniBalance?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white
                    style={{
                      color: '#FFFFFF',
                      width: '100%',
                      textAlign: 'center',
                      fontFamily: 'Open Sans',
                      fontStyle: 'normal',
                      fontWeight: 800,
                      fontSize: '18px',
                      lineHeight: '25px',
                      letterSpacing: '0.1em',
                      opacity: '0.4'
                    }}
                  >
                    BALANCE
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break style={{ backgroundColor: '#FFFFFF' }} />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white" opacity={0.7}>
                HALO price:
              </TYPE.white>
              <TYPE.white color="white">${uniPrice?.toFixed(2) ?? '-'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white" opacity={0.7}>
                HALO supply:
              </TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            {uni && uni.chainId === ChainId.MAINNET ? (
              <ExternalLink href={`https://analytics.sushi.com/tokens/${uni.address}`}>
                View HALO Analytics
              </ExternalLink>
            ) : null}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
