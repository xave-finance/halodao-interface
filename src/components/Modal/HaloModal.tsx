import React from 'react'
import styled from 'styled-components'
import { CloseIcon } from 'theme'
import Modal from '.'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #828282;

  h2 {
    flex: 1;
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  }
`

const StyledBody = styled.div`
  padding: 20px;
`

interface HaloModalProps {
  isOpen: boolean
  onDismiss: () => void
  title: string
  children?: React.ReactNode
}

const HaloModal = ({ isOpen, onDismiss, title, children }: HaloModalProps) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <StyledWrapper>
        <StyledHeader>
          <h2>{title}</h2>
          <CloseIcon size={20} onClick={onDismiss} />
        </StyledHeader>
        <StyledBody>{children}</StyledBody>
      </StyledWrapper>
    </Modal>
  )
}

export default HaloModal
