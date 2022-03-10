import React, { useState } from 'react'
import OrangeWarningIcon from 'assets/svg/orange-warning-icon.svg'
import Copy from '../../AccountDetails/Copy'

interface ErrorProps {
  objectError: any
  onDismiss: () => void
}

const ErrorContent = ({ objectError, onDismiss }: ErrorProps) => {
  const [showMore, setShowMore] = useState(false)
  const [objectErrorMessage, setObjectErrorMessage] = useState({
    code: objectError.code ? objectError.code : '',
    data: objectError.data ? objectError.data : '',
    message: objectError.message ? objectError.message : ''
  })

  return (
    <footer className="p-4">
      <div className="pt-12 pb-6 flex justify-center hover:opacity-50">
        <img src={OrangeWarningIcon} alt="" />
      </div>
      <div className="flex justify-center font-semibold text-2xl mb-2">Transaction Failed</div>
      <div className="text-center font-semibold">
        {objectErrorMessage.message}
        <div
          className="text-gray-800 cursor-pointer"
          onClick={() => {
            setShowMore(!showMore)
          }}
        >
          {showMore ? '' : ' [...]'}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        {showMore && (
          <div className="flex flex-col justify-center items-center text-center rounded w-11/12 p-4 mt-4 bg-primary-midGray">
            <div className="flex justify-center items-center text-center">
              <p className="italic mb-2.5 text-sm">{objectErrorMessage.message}</p>
            </div>
            <div className="flex justify-center items-center w-full space-x-4">
              <div>
                <Copy toCopy={objectErrorMessage.message}>
                  <span>Copy</span>
                </Copy>
              </div>
              <div
                className="text-gray-800 cursor-pointer"
                onClick={() => {
                  setShowMore(false)
                }}
              >
                <span className="text-gray-800 cursor-pointe text-sm">Hide</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`
        ${!showMore ? 'mt-10' : 'mt-5'}
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        rounded
        bg-error
        cursor-pointer
        hover:bg-orange-hover`}
        onClick={() => {
          window.location.href = 'https://discord.com/invite/halodao'
        }}
      >
        Report Error on Discord
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <div
          className="mt-4 text-error font-bold text-center cursor-pointer"
          onClick={() => {
            onDismiss()
          }}
        >
          Retry Transaction
        </div>
      </div>
    </footer>
  )
}

export default ErrorContent
