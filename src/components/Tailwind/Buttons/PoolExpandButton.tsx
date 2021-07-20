import React from 'react'

interface PoolExpandButtonProps {
  title: string
  onClick: () => void
}

const PoolExpandButton = ({ title, onClick }: PoolExpandButtonProps) => {
  return (
    <button
      type="button"
      className="font-bold text-white w-full bg-primary hover:bg-primary-hover active:ring active:ring-purple-300 p-2 rounded transition-colors md:text-primary md:bg-transparent md:w-auto md:p-0 md:hover:text-primary-hover md:hover:bg-transparent"
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default PoolExpandButton
