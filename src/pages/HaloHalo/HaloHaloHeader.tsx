import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import Halohalo from '../../assets/svg/halohalo-2.svg'

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

export default function HaloHaloHeader() {
  return (
    <StyledHaloHaloHeader>
      <RowBetweenWrapper>
        <RowBetween>
          <HaloImg src={Halohalo} alt="Halo Halo" />
          <HaloTitle>HALO → DESSERT (DSRT)</HaloTitle>
        </RowBetween>
      </RowBetweenWrapper>
    </StyledHaloHaloHeader>
  )
}
