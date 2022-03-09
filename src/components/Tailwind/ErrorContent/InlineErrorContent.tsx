import useErrorMessage, { ErrorMessageObject } from 'halo-hooks/useErrorMessage'
import React from 'react'

interface ErrorProps {
  errorObject: ErrorMessageObject
}

const InlineErrorContent = ({ errorObject }: ErrorProps) => {
  const { getErrorMessage, message } = useErrorMessage()
  getErrorMessage(errorObject)
  return (
    <div className="bg-error-light border-solid border-1 border-error-dark rounded">
      <div className="">ERROR:</div>
      <div className="text-center font-semibold text-xl mb-2">
        {message}. Please show this error message: "<span className="text-primary-red">{errorObject.message} </span>"
        to the team on Discord or email us at dev@halodao.com.
      </div>
    </div>
  )
}

export default InlineErrorContent
