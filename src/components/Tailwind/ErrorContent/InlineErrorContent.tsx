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

const ErrorObjectMessageSpan = styled.span`
  color: #ff0000;
`

const InlineErrorContent = ({ errorObject }: ErrorProps) => {
  const { getErrorMessage, message } = useErrorMessage()
  getErrorMessage(errorObject)
  return (
    <Wrapper>
      <div className="">ERROR:</div>
      <div className="text-center font-semibold text-xl mb-2">
        {message} Please show this error message <ErrorObjectMessageSpan>{errorObject.message} </ErrorObjectMessageSpan>
        to the team on Discord or email us at dev@halodao.com.
      </div>
    </Wrapper>
  )
}

export default InlineErrorContent
