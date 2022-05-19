import React, { useEffect, useState } from 'react'
import useErrorMessage, { HaloError } from 'halo-hooks/useErrorMessage'

interface InlineErrorContentProps {
  errorObject: any,
  displayDetails: Boolean,
}

const InlineErrorContent = ({ errorObject, displayDetails }: InlineErrorContentProps) => {
  const { friendlyErrorMessage, getFriendlyErrorMessage } = useErrorMessage()

  const [haloError] = useState<HaloError>({
    code: errorObject?.code ?? 'Unknown',
    data: errorObject?.data ?? 'Unknown',
    message: errorObject?.message ?? 'Unknown'
  })

  useEffect(() => {
    getFriendlyErrorMessage(haloError)
  }, [haloError]) // eslint-disable-line

  return (
    <div className="bg-error-light border-solid border border-red-600 rounded">
      <div className="text-center text-sm mb-2">
        {displayDetails && (
          <div className="font-semibold ">ERROR #: {haloError.code}</div>
        )}
        {displayDetails && (
          <div className="text-center text-sm mb-2">
            {friendlyErrorMessage}. Please show this error message: &quot;
            <span className="text-primary-red">{haloError.message} </span>&quot; to the team on Discord or email us at
            dev@halodao.com.
          </div>

        )}
        {!displayDetails && (
          <span className="text-primary-red"> {friendlyErrorMessage} </span>
        )}
      </div>
    </div>
  )
}

export default InlineErrorContent
