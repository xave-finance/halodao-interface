import React from 'react'
import SpinnerIcon from 'assets/svg/spinner-icon.svg'
import SuccessIcon from 'assets/svg/success-icon.svg'

export enum ApproveButtonState {
  Approved,
  NotApproved,
  Approving,
  Disabled
}

interface ApproveButtonProps {
  title: string
  state: ApproveButtonState
  onClick?: () => void
  className?: string
}

const ApproveButton = ({ title, state, onClick, className }: ApproveButtonProps) => {
  const isEnabled = state === ApproveButtonState.NotApproved || state !== ApproveButtonState.Disabled
  const isApproving = state === ApproveButtonState.Approving
  const isApproved = state === ApproveButtonState.Approved

  return (
    <button
      disabled={!isEnabled}
      onClick={onClick}
      className={`
        flex items-center justify-center
        font-bold
        py-2 w-full
        bg-transparent border border-primary-hover
        rounded
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
        ${isEnabled ? 'hover:bg-primary hover:text-white' : ''}
        ${isEnabled ? 'active:ring active:ring-purple-300' : ''}
        ${isApproved ? 'border-success text-success' : ''}
        ${!className ? 'text-primary-hover' : 'text-white'}
        ${className}
      `}
    >
      {title}
      {isApproving && <img className="ml-2 animate-spin" src={SpinnerIcon} alt="Loading..." />}
      {isApproved && <img className="ml-2" src={SuccessIcon} alt="Success!" />}
    </button>
  )
}

export default ApproveButton
