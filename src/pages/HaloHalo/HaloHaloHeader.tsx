import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import XRNBW from '../../assets/svg/xrnbw-token.svg'
import { ChainId } from '@sushiswap/sdk'
import { NETWORK_SUPPORTED_FEATURES } from '../../constants/networks'
import { useActiveWeb3React } from '../../hooks'

const StyledHaloHaloHeader = styled.div`
  padding: 30px 0 0 30px;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0
  `};
`

const HaloTitle = styled.div`
  font-family: Open Sans;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 0.2em;
  color: #15006d;
  display: block;
  width: 100%;
  margin-left: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    text-align: center;
    margin: 0;
  `};
`
const HaloImg = styled.img`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    margin: auto;
    padding: 10px 0 10px 0;
  `};
`

const RowBetweenWrapper = styled.div`
  ${RowBetween} {
    display: flex;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: block;
    `};
  }
`

const HeaderContent = () => {
  const { chainId } = useActiveWeb3React()
  if (chainId === ChainId.MATIC || chainId === ChainId.MATIC_TESTNET) {
    return (
      <>
        <HaloImg src={XRNBW} alt="Halo Halo" width="84" height="84" />
        <HaloTitle>RNBW → xRNBW</HaloTitle>
      </>
    )
  }
  return (
    <>
      <HaloImg src={XRNBW} alt="Halo Halo" width="84" height="84" />
      <HaloTitle>RNBW → xRNBW</HaloTitle>
    </>
  )
}
export default function HaloHaloHeader() {
  return (
    <StyledHaloHaloHeader>
      <RowBetweenWrapper>
        <RowBetween>
          <HeaderContent />
        </RowBetween>
      </RowBetweenWrapper>
    </StyledHaloHaloHeader>
  )
}
