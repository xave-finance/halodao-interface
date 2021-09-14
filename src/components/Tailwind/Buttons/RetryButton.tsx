import React from 'react'

interface RetryButtonProps {
  title: string
  isEnabled: boolean
  onClick: () => void
}

const RetryButton = ({ title, isEnabled, onClick }: RetryButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        rounded
        bg-warning
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default RetryButton
