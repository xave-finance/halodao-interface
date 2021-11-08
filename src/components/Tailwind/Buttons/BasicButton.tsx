import React from 'react'

interface BasicButtonProps {
  title: string
  isEnabled: boolean
  onClick: () => void
  variant?: BasicButtonVariant
  className?: string
}

export enum BasicButtonVariant {
  Default,
  Light,
  Dark,
  Outline
}

const BasicButton = ({ title, isEnabled, onClick, variant, className }: BasicButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center
        font-bold
        text-white
        py-1.5 w-full
        rounded
        ${className}
        ${variant === BasicButtonVariant.Default ? 'bg-primary hover:bg-primary-hover' : ''}
        ${variant === BasicButtonVariant.Dark ? 'bg-primary-hover hover:bg-primary' : ''}
        ${
          variant === BasicButtonVariant.Light
            ? 'text-primary bg-transparent md:mr-4 hover:bg-primary hover:text-white'
            : ''
        }
        ${
          variant === BasicButtonVariant.Outline
            ? 'text-primary-hover bg-transparent border border-primary-hover hover:bg-primary-hover hover:text-white'
            : ''
        }
        ${isEnabled ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'}
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default BasicButton
