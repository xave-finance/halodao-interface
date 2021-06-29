import React from 'react'
import styled from 'styled-components'

const StyledLabel = styled.div`
  background-color: #fa6f44;
  color: #ffffff;
  text-transform: uppercase;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border-radius: 1rem;
`

const BetaLabel = () => {
  return <StyledLabel>Beta</StyledLabel>
}

export default BetaLabel
