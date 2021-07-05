import { ButtonOutlined } from 'components/Button'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ButtonText, CloseIcon, ExtraSmallOnly, HideSmall } from 'theme'
import warningLogo from '../../assets/svg/logo_warning.svg'
import { useIsDisclaimerVisible, useIsDisclaimerVisibleToggle } from 'state/user/hooks'
import DisclaimerModal from './DisclaimerModal'

const StyledAlert = styled.div<{ isVisible: any }>`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  align-items: center;
  position: fixed;
  width: 550px;
  bottom: 40px;
  left: calc((100vw - 550px) / 2);
  padding: 20px;
  z-index: 2;
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
    padding: 0;
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
    margin: 15px 0;
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

const StyledCloseWrapper = styled.div`
  .close-button {
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .close-icon {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 6px;
    right: 6px;
  }
`

const DisclaimerAlert = () => {
  const toggleVisibility = useIsDisclaimerVisibleToggle()
  const isVisible = useIsDisclaimerVisible()

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {isModalOpen && <DisclaimerModal onDismiss={() => setIsModalOpen(false)} />}

      <StyledAlert isVisible={isVisible}>
        <img src={warningLogo} alt="Warning logo" />
        <StyledText>
          This app is in beta, the contracts are currently undergoing last stage of audit. Supply liquidity at your own
          risk and do your own research.
        </StyledText>
        <StyledButton onClick={() => setIsModalOpen(true)}>Read our disclaimer</StyledButton>
        <StyledCloseWrapper>
          <ExtraSmallOnly>
            <ButtonText className="close-button" onClick={toggleVisibility}>
              Close
            </ButtonText>
          </ExtraSmallOnly>
          <HideSmall>
            <CloseIcon className="close-icon" onClick={toggleVisibility} color="white" />
          </HideSmall>
        </StyledCloseWrapper>
      </StyledAlert>
    </>
  )
}

export default DisclaimerAlert
