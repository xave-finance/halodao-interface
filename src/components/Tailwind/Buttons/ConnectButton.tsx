import React from 'react'

interface ConnectButtonProps {
  title: string
  onClick: () => void
}

const ConnectButton = ({ title, onClick }: ConnectButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        rounded
        text-primary font-bold
        bg-primary bg-opacity-20
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default ConnectButton
