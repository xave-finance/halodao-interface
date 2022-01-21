import React from 'react'
import OrangeWarningIcon from '../../../assets/svg/orange-warning-icon.svg'

interface ErrorModalContentProps {
  message: string
}

const ErrorModalContent = ({ message }: ErrorModalContentProps) => {
  return (
    <div id="error-handler-modal" className="p-4">
      <div className="pt-12 pb-6 flex justify-center">
        <img src={OrangeWarningIcon} alt="" />
      </div>
      <div className="text-center font-semibold text-2xl mb-2">Transaction Failed</div>
      <div className="text-center font-semibold">
        <p>{message}</p>
      </div>
      <div className="mt-10">
        <button
          className={`
            flex items-center justify-center
            font-bold text-white
            py-2 w-full
            rounded
            bg-orange
            cursor-pointer
            hover:bg-orange-hover
            `}
        >
          <span className="mr-2">Report Error in Discord </span>
        </button>
      </div>
      <div className="mt-4 text-center">
        <a className="font-semibold text-orange" href="#" target="_blank" rel="noopener noreferrer">
          Retry Transaction
        </a>
      </div>
    </div>
  )
}

export default ErrorModalContent
