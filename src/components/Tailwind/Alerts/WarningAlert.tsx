import React from 'react'
import WarningIcon from '../../../assets/svg/warning-icon.svg'

interface WarningAlertProps {
  message: string
}

const WarningAlert = ({ message }: WarningAlertProps) => {
  return (
    <div
      className={`
        flex items-center justify-center
      `}
    >
      <img src={WarningIcon} alt="warning" /> <span className="font-normal text-xs text-warning">{message}</span>
    </div>
  )
}

export default WarningAlert
