import React from 'react'
import DropdownIcon from '../../../assets/svg/dropdown-arrow-icon.svg'

interface SelectButtonProps {
  onClick: () => void
}

const SelectButton = ({ onClick }: SelectButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
      `}
    >
      <img src={DropdownIcon} alt="Select" />
    </button>
  )
}

export default SelectButton
