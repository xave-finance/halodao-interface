import React from 'react'
import SpinnerIcon from 'assets/svg/spinner-icon.svg'

export enum PrimaryButtonState {
  Enabled,
  Disabled,
  InProgress
}

export enum PrimaryButtonType {
  Default,
  Gradient
}

interface PrimaryButtonProps {
  type?: PrimaryButtonType
  title: string
  state: PrimaryButtonState
  onClick?: () => void
  onClick?: () => void
  icon?: any
}

const PrimaryButton = ({ type = PrimaryButtonType.Default, title, state, onClick, icon }: PrimaryButtonProps) => {
  const isDefaultType = type === PrimaryButtonType.Default
  const isEnabled = state === PrimaryButtonState.Enabled
  const isLoading = state === PrimaryButtonState.InProgress

  return (
    <div className={isEnabled && !isDefaultType ? 'hover:shadow-lg' : ''}>
      <button
        disabled={!isEnabled}
        onClick={onClick}
        className={`
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        rounded
        ${
          isDefaultType
            ? 'bg-primary'
            : 'bg-gradient-to-tr from-primary-hover via-primary-gradientVia to-primary-gradientTo'
        }
        ${isDefaultType ? 'border-primary' : ''}
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
        ${isEnabled ? 'active:ring active:ring-purple-300' : ''}
        ${isEnabled && isDefaultType ? 'hover:bg-primary-hover' : ''}
      `}
      >
        {title} <span className="mr-2" /> {icon}
        {isLoading && <img className="ml-2 animate-spin" src={SpinnerIcon} alt="Loading..." />}
      </button>
    </div>
  )
}

export default PrimaryButton
