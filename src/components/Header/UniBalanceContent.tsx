import { ChainId, TokenAmount } from '@halodao/sdk'
import React, { useEffect, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/svg/rnbw-token.svg'
import { HALO, HALO_TOKEN_ADDRESS, ZERO_ADDRESS } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE, UniTokenAnimated } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardSection, DataCard } from '../earn/styled'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { getAddress } from 'ethers/lib/utils'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.haloGradient};
  padding: 0.5rem;
  border-radius: 4px;
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

  const [rnbwPrice, setRnbwPrice] = useState<number>(0)

  // Refresh RNBW price on every component load
  useEffect(() => {
    const address = getAddress(HALO_TOKEN_ADDRESS[ChainId.MAINNET] ?? ZERO_ADDRESS)
    getTokensUSDPrice(GetPriceBy.address, [address]).then(tokenPrice => {
      if (tokenPrice[address]) {
        setRnbwPrice(tokenPrice[address])
      }
    })
  }, [])

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white" fontWeight="bold">
              Your RNBW Breakdown
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
                RNBW price:
              </TYPE.white>
              <TYPE.white color="white">{rnbwPrice > 0 ? formatNumber(rnbwPrice, NumberFormat.usd) : '$ -'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white" opacity={0.7}>
                RNBW supply:
              </TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            {/* {uni && uni.chainId === ChainId.MAINNET ? (
              <ExternalLink href={`https://analytics.sushi.com/tokens/${uni.address}`}>
                View RNBW Analytics
              </ExternalLink>
            ) : null} */}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
