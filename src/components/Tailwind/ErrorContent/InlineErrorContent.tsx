import { AnyRecord } from 'dns'
import useErrorMessage, { HaloError } from 'halo-hooks/useErrorMessage'
import React from 'react'

interface InlineErrorContentProps {
  errorObject: any
}

const InlineErrorContent = ({ errorObject }: InlineErrorContentProps) => {
  const { friendlyErrorMessage, getFriendlyErrorMessage } = useErrorMessage()

  const haloError: HaloError = {
    code: errorObject.code ?? 'Unknown',
    data: errorObject.data ?? '',
    message: errorObject.message ?? ''
  }

  getFriendlyErrorMessage(haloError)

  return (
    <div className="bg-error-light border-solid border-1 border-error-dark rounded">
      <div className="">ERROR #: {haloError.code}</div>
      <div className="text-center font-semibold text-xl mb-2">
        {friendlyErrorMessage}. Please show this error message: &quot;
        <span className="text-primary-red">{haloError.message} </span>&quot; to the team on Discord or email us at
        dev@halodao.com.
      </div>
    </div>
  )
}

export default InlineErrorContent
