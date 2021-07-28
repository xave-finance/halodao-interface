import React from 'react'
import SpinnerIcon from 'assets/svg/spinner-icon.svg'

export enum PrimaryActionButtonState {
  Enabled,
  Disabled,
  InProgress
}

interface PrimaryActionButtonProps {
  title: string
  state: PrimaryActionButtonState
  onClick: () => void
}

const PrimaryActionButton = ({ title, state, onClick }: PrimaryActionButtonProps) => {
  const isEnabled = state === PrimaryActionButtonState.Enabled
  const isLoading = state === PrimaryActionButtonState.InProgress

  return (
    <button
      disabled={!isEnabled}
      onClick={onClick}
      className={`
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        bg-gradient-to-tr from-primary-gradientFrom via-primary-gradientVia to-primary-gradientTo
        rounded
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
        ${isEnabled ? 'active:ring active:ring-purple-300' : ''}
      `}
    >
      {title}
      {isLoading && <img className="ml-2 animate-spin" src={SpinnerIcon} alt="Loading..." />}
    </button>
  )
}

export default PrimaryActionButton
