import React from 'react'

interface BasicButtonProps {
  title: string
  isEnabled: boolean
  onClick: () => void
  className?: string
}

const BasicButton = ({ title, isEnabled, onClick, className }: BasicButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center
        font-bold
        text-white
        py-1.5 w-full
        rounded
        bg-primary
        ${className}
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default BasicButton
