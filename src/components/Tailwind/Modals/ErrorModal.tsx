import React from 'react'
import BaseModal from './BaseModal'
import ModalErrorContent from '../ErrorContent/ModalErrorContent'

interface ErrorModalProps {
  isVisible: boolean
  error: any // Error | HaloError | a blockchain tx hash
  onDismiss: () => void
}

const ErrorModal = ({ isVisible, onDismiss, error }: ErrorModalProps) => {
  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      <ModalErrorContent error={error} onDismiss={onDismiss} />
    </BaseModal>
  )
}

export default ErrorModal
