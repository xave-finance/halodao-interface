import useErrorMessage, { ErrorMessageObject } from 'halo-hooks/useErrorMessage'
import React from 'react'
import BunnyAnnouncement from 'assets/svg/bunny-announcement.svg'

interface ErrorProps {
  errorObject: ErrorMessageObject
}
const ErrorContent = ({ errorObject }: ErrorProps) => {
  const { getErrorMessage, message } = useErrorMessage()
  getErrorMessage(errorObject)
  return (
    <div className="p-4">
      <div className="flex justify-center">
        <img src={BunnyAnnouncement} alt="Error" />
      </div>
      <div className="text-center font-semibold text-xl mb-2">{message}</div>
      <div className="text-center font-bold mb-2">
        <b>Error Code:</b> {errorObject.code || 'App/error'}
      </div>
      <div className="text-center text-sm text-gray-500">Please include the error code when reporting to the team.</div>
    </div>
  )
}

export default ErrorContent
