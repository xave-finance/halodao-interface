import React, { useEffect, useState } from 'react'
import useErrorMessage, { HaloError } from 'halo-hooks/useErrorMessage'

interface InlineErrorContentProps {
  errorObject: HaloError
  displayDetails?: boolean
}

const InlineErrorContent = ({ errorObject, displayDetails }: InlineErrorContentProps) => {
  const { friendlyErrorMessage, getFriendlyErrorMessage } = useErrorMessage()

  useEffect(() => {
    getFriendlyErrorMessage(errorObject)
  }, [errorObject]) // eslint-disable-line

  return (
    <div className="bg-error-light border-solid border border-red-600 rounded">
      <div className="text-center text-sm mb-2">
        {displayDetails && (
          <>
            <div className="font-semibold ">ERROR #: {errorObject.code}</div>
            <div className="text-center text-sm mb-2">
              {friendlyErrorMessage}. Please show this error message: &quot;
              <span className="text-primary-red">{errorObject.message} </span>&quot; to the team on Discord or email us
              at dev@halodao.com.
            </div>
          </>
        )}
        {!displayDetails && <span className="text-primary-red"> {friendlyErrorMessage} </span>}
      </div>
    </div>
  )
}

export default InlineErrorContent
