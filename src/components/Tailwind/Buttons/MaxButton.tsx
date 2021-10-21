import React from 'react'

interface MaxButtonProps {
  title: string
  isEnabled: boolean
  onClick: () => void
}

const MaxButton = ({ title, isEnabled, onClick }: MaxButtonProps) => {
  return (
    <button
      disabled={!isEnabled}
      onClick={onClick}
      className={`
        uppercase text-xs font-bold text-primary-hover
        px-6 py-1
        bg-transparent border border-primary
        rounded-button
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
        ${isEnabled ? 'hover:bg-primary hover:text-white' : ''}
        ${isEnabled ? 'active:ring active:ring-purple-300' : ''}
      `}
    >
      {title}
    </button>
  )
}

export default MaxButton
