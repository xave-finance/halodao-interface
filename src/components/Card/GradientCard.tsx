import React from 'react'
import Card from './index'
import styled from 'styled-components'

const GradientCard = ({ children }: any) => {
  const Wrapper = styled(Card)`
    width: 100%;
    height: auto;
    background: linear-gradient(54.93deg, #15006d 12.16%, #15006d 33.28%, #5521b6 66.19%, #2db7c4 93.15%);
    border-radius: 10px;
    font-family: serif Open Sans;
    font-style: normal;
    color: #ffffff;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
       border-radius: 3px;
    `};
  `
  return (
    <>
      <Wrapper>{children}</Wrapper>
    </>
  )
}

export default GradientCard
