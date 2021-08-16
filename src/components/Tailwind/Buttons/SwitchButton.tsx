import React from 'react'
import SwitchIcon from 'assets/svg/switch-icon.svg'

interface SwitchButtonProps {
  onClick: () => void
}

const SwitchButton = ({ onClick }: SwitchButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        p-2
        bg-primary-lighter
        rounded
      `}
    >
      <img src={SwitchIcon} alt="Switch" />
    </button>
  )
}

export default SwitchButton
