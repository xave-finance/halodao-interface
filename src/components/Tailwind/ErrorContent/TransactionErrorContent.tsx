import React from 'react'
import styled from 'styled-components'
import OrangeWarningIcon from 'assets/svg/orange-warning-icon.svg'

interface ErrorProps {
  message: string
  closeError: () => void
}

// TODO: Tailwind?
const ReportOnDiscordButton = styled.button`
  background: #ff5f37;
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
  color: #ff5f37;
  background: transparent;
`

const ErrorContent = ({ message, closeError }: ErrorProps) => {
  return (
    <div className="p-4">
      <div className="pt-12 pb-6 flex justify-center">
        <img src={OrangeWarningIcon} alt="" />
      </div>
      <div className="flex justify-center font-semibold text-2xl mb-2">Transaction Failed</div>
      <div className="text-center font-semibold">{message}</div>

      <ReportOnDiscordButton
        className={`
        mt-10
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        rounded
        bg-orange
        cursor-pointer
        hover:bg-orange-hover`}
        onClick={() => {
          window.location.href = 'https://discord.com/invite/halodao'
        }}
      >
        Report Error on Discord
      </ReportOnDiscordButton>
      <div className="flex justify-center items-center">
        <RetryTransactionLink
          className="mt-4"
          onClick={() => {
            closeError()
          }}
        >
          Retry Transaction
        </RetryTransactionLink>
      </div>
    </div>
  )
}

export default ErrorContent
