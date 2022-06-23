import React, { useEffect } from 'react'
import useErrorMessage from 'halo-hooks/useErrorMessage'

interface InlineErrorContentProps {
  error: Error
  displayDetails?: boolean
}

const InlineErrorContent = ({ error, displayDetails }: InlineErrorContentProps) => {
  const { friendlyErrorMessage, getFriendlyErrorMessage } = useErrorMessage()

  useEffect(() => {
    getFriendlyErrorMessage(error)
  }, [error, displayDetails]) // eslint-disable-line

  return (
    <div className="bg-error-light border-solid border border-red-600 rounded">
      <div className="text-center text-sm py-2">
        {displayDetails ? (
          <>
            {(error as any).code && <div className="font-semibold ">ERROR #: {(error as any).code}</div>}
            <div className="text-center text-sm mb-2">
              {friendlyErrorMessage}. Please show this error message: &quot;
              <span className="text-primary-red">{error.message} </span>&quot; to the team on Discord or email us at
              dev@halodao.com.
            </div>
          </>
        ) : (
          <span className="text-primary-red"> {friendlyErrorMessage} </span>
        )}
      </div>
    </div>
  )
}

export default InlineErrorContent
