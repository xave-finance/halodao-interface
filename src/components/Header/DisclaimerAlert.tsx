import { ButtonOutlined } from 'components/Button'
import React from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'
import warningLogo from '../../assets/svg/logo_warning.svg'

const StyledAlert = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  width: 550px;
  bottom: 40px;
  left: calc((100vw - 550px) / 2);
  padding: 20px;
  z-index: 99999;
  background-color: ${({ theme }) => theme.modalBGAlt};
  border-radius: 3px;
  box-shadow: 0px 4px 6px rgba(122, 122, 122, 0.3);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    bottom: 80px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    width: calc(100vw - 20px);
    left: 10px;

    img {
      display: none;
    }
  `};
`

const StyledText = styled.div`
  color: white;
  font-size: 12px;
  padding: 0 30px 0 15px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 0 15px 0;
  `};
`

const StyledButton = styled(ButtonOutlined)`
  background: white;
  color: ${({ theme }) => theme.text4};
  padding: 10px 0;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};

  &:focus {
    box-shadow: 0 0 0 1px #2700ce;
  }
  &:hover {
    box-shadow: 0 0 0 1px #2700ce;
  }
  &:active {
    box-shadow: 0 0 0 1px #2700ce;
  }
`

const DisclaimerAlert = () => {
  return (
    <StyledAlert>
      <img src={warningLogo} alt="Warning logo" />
      <StyledText>
        This app is in beta and the contracts have been audited, supply liquidity at your own risk and do your own
        research.
      </StyledText>
      <StyledButton>Read our disclaimer</StyledButton>
    </StyledAlert>
  )
}

export default DisclaimerAlert
