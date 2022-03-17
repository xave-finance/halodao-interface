import React from 'react'
import BaseModal from './BaseModal'
import ModalErrorContent from '../ErrorContent/ModalErrorContent'

interface ErrorModalProps {
  isVisible: boolean
  errorObject: any // can be a blockchain tx hash or an Error
  onDismiss: () => void
}

const ErrorModal = ({ isVisible, onDismiss, errorObject }: ErrorModalProps) => {
  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      <ModalErrorContent errorObject={errorObject} onDismiss={onDismiss} />
    </BaseModal>
  )
}

export default ErrorModal
