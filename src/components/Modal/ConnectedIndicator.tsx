import React from 'react'
import styled from 'styled-components'
import Connected from '../../assets/svg/connected-indicator.svg'

const StyledWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;
  font-style: italic;
  color: ${({ theme }) => theme.text2};

  .icon {
    width: 20px;
    height: auto;
    margin-left: 8px;
  }
`

const ConnectedIndicator = () => {
  return (
    <StyledWrapper>
      <div className="connected">Connected</div>
      <img className="icon" src={Connected} alt="connected" />
    </StyledWrapper>
  )
}

export default ConnectedIndicator
