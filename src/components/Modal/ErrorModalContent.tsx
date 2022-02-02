import React from 'react'
import OrangeWarningIcon from '../../../src/assets/svg/orange-warning-icon.svg'

interface ErrorModalContentProps {
  message: string
  closeError: () => void
}

const ErrorModalContent = ({ message, closeError }: ErrorModalContentProps) => {
  return (
    <div id="error-handler-modal" className="p-4">
      <div className="pt-12 pb-6 flex justify-center">
        <img src={OrangeWarningIcon} alt="" />
      </div>
      <div className="text-center font-semibold text-2xl mb-2">Transaction Failed</div>
      <div className="text-center">
        <p className="font-semibold">Something went wrong. Please show this error message to the team.</p>
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
          onClick={() => {
            window.location.href = 'https://discord.com/invite/halodao'
          }}
        >
          <span className="mr-2">Report Error in Discord </span>
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          className="font-semibold text-orange"
          onClick={() => {
            closeError()
          }}
        >
          Retry Transaction
        </button>
      </div>
    </div>
  )
}

export default ErrorModalContent
