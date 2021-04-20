import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import Halohalo from '../../assets/svg/halohalo-2.svg'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader
      style={{
        // background: 'blue'
      }}
    >
      <RowBetween>
        <img src={Halohalo} alt="Halo Halo" />
        <TYPE.black
          style={{
            fontFamily: "Open Sans",
            fontStyle: "normal",
            fontWeight: 800,
            fontSize: "18px",
            lineHeight: "25px",
            letterSpacing: "0.2em",
            color: "#15006D",
            display: "block",
            width: "100%",
            marginLeft: "30px"
          }}
          fontWeight={500}>HALO → HALOHALO</TYPE.black>
      </RowBetween>
    </StyledSwapHeader>
  )
}
