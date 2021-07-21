import React from 'react'

interface PoolExpandButtonProps {
  title: string
  expandedTitle: string
  isExpanded: boolean
  onClick: () => void
}

const PoolExpandButton = ({ title, expandedTitle, isExpanded, onClick }: PoolExpandButtonProps) => {
  return (
    <div className={isExpanded ? 'hidden md:block' : ''}>
      <button
        type="button"
        className={`
          font-bold text-white
          w-full p-2
          bg-primary hover:bg-primary-hover
          active:ring active:ring-purple-300
          rounded
          transition-colors
          md:w-auto 
          md:text-primary
          md:bg-transparent
          ${isExpanded ? 'md:py-1 md:px-4' : 'md:p-0'}
          ${isExpanded ? 'md:hover:text-white' : 'md:hover:text-primary-hover'}
          ${isExpanded ? 'md:hover:bg-primary-hover' : 'md:hover:bg-transparent'}
          ${isExpanded && 'md:border md:border-primary'}
        `}
        onClick={onClick}
      >
        {isExpanded ? expandedTitle : title}
      </button>
    </div>
  )
}

export default PoolExpandButton
