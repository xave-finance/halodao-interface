import React, { useState } from 'react'
import styled from 'styled-components'
import OrangeWarningIcon from 'assets/svg/orange-warning-icon.svg'
import Copy from '../../AccountDetails/Copy'
import { ErrorMessageObject } from '../../../halo-hooks/useErrorMessage'

interface ErrorProps {
  objectError: ErrorMessageObject
  message: string
  closeError: () => void
}

// TODO: Tailwind?
const ReportOnDiscordButton = styled.button`
  background: #ff5f37;
  border-radius: 4px;
  width: 100%;
  margin: auto;
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
const FooterErrorModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const ExpandedContentContainer = styled(FooterErrorModal)`
  gap: unset;
`
const ExpandedContent = styled.code`
  margin-top: 1em;
  background: #f1f1f1;
  border-radius: 5px;
  padding: 1rem;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & p {
    font-style: italic;
    margin-bottom: 10px;
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtra2Small`
    padding: unset;
    width: 100%;
  `};
`
const ExpandedContentOption = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`

const HideBtn = styled.div`
  margin-top: -3px;
  color: #333333;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
    transition: 0.2s;
  }
`
const SeeMore = styled.small`
  color: #333333;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
    transition: 0.2s;
  }
`

const StyledErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const ErrorContent = ({ objectError, message, closeError }: ErrorProps) => {
  const [showMore, setShowMore] = useState(false)
  const ErrorMessage = `${objectError.code}: ${objectError.message}`

  return (
    <footer className="p-4">
      <div className="pt-12 pb-6 flex justify-center">
        <img src={OrangeWarningIcon} alt="" />
      </div>
      <div className="flex justify-center font-semibold text-2xl mb-2">Transaction Failed</div>
      <div className="text-center font-semibold">
        {message}
        <SeeMore
          onClick={() => {
            setShowMore(!showMore)
          }}
        >
          {showMore ? '' : ' [...]'}
        </SeeMore>
      </div>
      <ExpandedContentContainer>
        {showMore && (
          <ExpandedContent>
            <StyledErrorMessage>
              <p>{ErrorMessage}</p>
            </StyledErrorMessage>
            <ExpandedContentOption>
              <div>
                <Copy toCopy={ErrorMessage}>
                  <span>Copy</span>
                </Copy>
              </div>
              <HideBtn
                onClick={() => {
                  setShowMore(false)
                }}
              >
                <small>Hide</small>
              </HideBtn>
            </ExpandedContentOption>
          </ExpandedContent>
        )}
      </ExpandedContentContainer>
      <ReportOnDiscordButton
        className={`
        ${!showMore ? 'mt-10' : 'mt-5'}
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
      <FooterErrorModal>
        <RetryTransactionLink
          className="mt-4"
          onClick={() => {
            closeError()
          }}
        >
          Retry Transaction
        </RetryTransactionLink>
      </FooterErrorModal>
    </footer>
  )
}

export default ErrorContent
