import useErrorMessage, { ErrorMessageObject } from 'halo-hooks/useErrorMessage'
import React from 'react'
import BunnyAnnouncement from 'assets/svg/bunny-announcement.svg'
import styled from 'styled-components'

interface ErrorProps {
  errorObject: ErrorMessageObject
}

// TODO: Tailwind?
const ReportOnDiscordButton = styled.button`
  background: #fa6f44;
  border-radius: 4px;
`

const RetryTransactionLink = styled.button`
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 130%;
  /* identical to box height, or 21px */

  text-align: center;

  color: #fa6f44;
  background: transparent;
`

const ErrorContent = ({ errorObject }: ErrorProps) => {
  const { getErrorMessage, message } = useErrorMessage()
  getErrorMessage(errorObject)
  return (
    <div className="p-4">
      <div className="flex justify-center">Transaction Failed</div>
      <div className="text-center font-semibold text-xl mb-2">
        {message} Please show this error message {errorObject.message} to the team on Discord.
      </div>

      <ReportOnDiscordButton onClick={() => {}}>Report Error on Discord</ReportOnDiscordButton>
      <RetryTransactionLink onClick={() => {}}>Retry Transaction</RetryTransactionLink>
    </div>
  )
}

export default ErrorContent
