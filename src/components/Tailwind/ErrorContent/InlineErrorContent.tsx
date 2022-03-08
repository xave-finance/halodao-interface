import useErrorMessage, { ErrorMessageObject } from 'halo-hooks/useErrorMessage'
import React from 'react'
import styled from 'styled-components'

interface ErrorProps {
  errorObject: ErrorMessageObject
}

// TODO: Tailwind?
const Wrapper = styled.div`
  background: #fdd9d7;
  border: 1px solid #da1a0f;
  box-sizing: border-box;
  border-radius: 5px;
`

const InlineErrorContent = ({ errorObject }: ErrorProps) => {
  const { getErrorMessage, message } = useErrorMessage()
  getErrorMessage(errorObject)
  return (
    <div className="bg-error-light border-solid border-1 border-error-dark rounded">
      <div className="">ERROR:</div>
      <div className="text-center font-semibold text-xl mb-2">
        {message} Please show this error message <span className='text-primary-red'>{errorObject.message} </span>
        to the team on Discord or email us at dev@halodao.com.
      </div>
    </div>
  )
}

export default InlineErrorContent
