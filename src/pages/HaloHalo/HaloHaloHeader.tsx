import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import XRNBW from '../../assets/svg/xrnbw-token.svg'

const StyledHaloHaloHeader = styled.div`
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

interface HaloHaloHeaderProps {
  vest?: boolean
}
export default function HaloHaloHeader({ vest }: HaloHaloHeaderProps) {
  return (
    <StyledHaloHaloHeader>
      <RowBetweenWrapper>
        <RowBetween>
          {vest && (
            <>
              <HaloImg src={XRNBW} alt="Halo Halo" width="84" height="84" />
              <HaloTitle>RNBW → xRNBW</HaloTitle>
            </>
          )}
          {!vest && (
            <div className="flex flex-col justify-center items-center w-full">
              <img src={XRNBW} alt="Halo Halo" width="58" height="58" />
              <HaloTitle className="text-center m-0">RNBW → xRNBW</HaloTitle>
            </div>
          )}
        </RowBetween>
      </RowBetweenWrapper>
    </StyledHaloHaloHeader>
  )
}
