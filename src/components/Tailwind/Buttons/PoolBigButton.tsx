import React from 'react'
import ArrowRight from '../../../assets/svg/arrow-right.svg'

interface PoolBigButtonProps {
  title: string
  isEnabled: boolean
  onClick: () => void
}

const PoolBigButton = ({ title, isEnabled, onClick }: PoolBigButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center md:justify-start
        py-3 px-6 w-full md:w-auto
        text-black font-bold
        rounded-card
        bg-white
        ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isEnabled ? 'opacity-100' : 'opacity-50'}
        ${isEnabled ? 'hover:bg-gray-200' : ''}
        ${isEnabled ? 'active:ring active:ring-purple-300' : ''}
      `}
      onClick={onClick}
    >
      {title}
      <img className="inline ml-2" src={ArrowRight} alt="arrow right" />
    </button>
  )
}

export default PoolBigButton
