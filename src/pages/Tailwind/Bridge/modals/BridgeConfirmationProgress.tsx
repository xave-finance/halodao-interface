import React, { useState } from 'react'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import PendingIcon from 'assets/svg/gray-circle.svg'
import CompleteIcon from 'assets/svg/check-circle-icon.svg'
import { ChainId } from '@sushiswap/sdk'
import { ModalState } from '../../../../constants/buttonStates'
import { getExplorerLink } from 'utils'
import { NETWORK_LABEL } from 'constants/networks'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import useTransactionConfirmation from 'hooks/useTransactionConfirmation'
import { formatNumber, NumberFormat } from 'utils/formatNumber'

interface BridgeConfirmationProgressProps {
  originChainId: ChainId
  destinationChainId: ChainId
  state: ModalState
  successHash: string
  setProgressState: (isVisible: boolean) => void
}

const BridgeConfirmationProgress = ({
  originChainId,
  destinationChainId,
  state,
  successHash,
  setProgressState
}: BridgeConfirmationProgressProps) => {
  interface InProgressContentProps {
    chainId: ChainId
  }

  const [finalityValue, setFinalityValue] = useState(false)

  interface NewTransactionButtonProps {
    type: PrimaryButtonType
    state: PrimaryButtonState
    onClick?: () => void
  }

  const NewTransactionButton = ({ type, state, onClick }: NewTransactionButtonProps) => {
    return (
      <div className="mt-6">
        <PrimaryButton type={type} title="New Transaction" state={state} onClick={onClick} />
      </div>
    )
  }

  const InProgressContent = () => {
    return (
      <>
        <div className="flex flex-col justify-center mt-4 bg-secondary-lightest rounded-lg p-4 w-full">
          <div className="flex flex-row">
            <div className="w-4/5">
              <div className="text-sm text-primary-hover font-bold mb-2 rounded-lg p-2 uppercase tracking-wide">
                Transaction Pending
              </div>
              <div className="text-lg text-primary-gray pl-2">Waiting for confirmation </div>
            </div>
            <div className="w-1/5">
              <img className="animate-spin" src={SpinnerIcon} width="64px" alt="In progress..." />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-4 bg-primary-grayLight rounded-lg p-4 w-full">
          <div className="flex flex-row">
            <div className="w-4/5">
              <div className="text-sm text-primary-hover font-bold mb-2 rounded-lg p-2 uppercase tracking-wide">
                Block Confirmation
              </div>
              <div className="text-lg text-primary-gray pl-2">
                Please wait a few minutes for your balance to update on {NETWORK_LABEL[destinationChainId]}
              </div>
            </div>
            <div className="flex items-center justify-center w-1/5">
              <img src={PendingIcon} alt="Not Started" />
            </div>
          </div>
        </div>
        {<NewTransactionButton type={PrimaryButtonType.Gradient} state={PrimaryButtonState.Disabled} />}
      </>
    )
  }

  interface SuccessContentProps {
    chainId: ChainId
    successHash: string
  }
  const TxCompleteContent = ({ chainId, successHash }: SuccessContentProps) => {
    const { confirmations, requiredConfirmations, done } = useTransactionConfirmation(successHash)
    const percentProgress = confirmations / requiredConfirmations
    if (done) setFinalityValue(done)
    return (
      <>
        {/* Temporary code */}
        {console.log('SuccessContent confirmations:', confirmations)}
        {console.log('SuccessContent requiredConfirmations:', requiredConfirmations)}
        {console.log('SuccessContent done:', done)}
        <div className="flex flex-col justify-center mt-4 bg-primary-green rounded-lg p-4 w-full">
          <div className="flex flex-row">
            <div className="w-4/5">
              <div className="text-sm text-primary-hover font-bold mb-2 rounded-lg p-2 uppercase tracking-wide">
                Complete
              </div>
              <div className="text-lg text-primary-gray pl-2">
                Transaction complete on {NETWORK_LABEL[originChainId]}
              </div>
              <a
                className="font-semibold text-link pl-2"
                href={getExplorerLink(chainId, successHash, 'transaction')}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Chain Explorer
              </a>
            </div>
            <div className="flex items-center justify-center w-1/5">
              <img src={CompleteIcon} alt="Complete" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-4 bg-secondary-lightest rounded-lg p-4 w-full">
          <div className="flex flex-row">
            <div className="w-4/5">
              <div className="text-sm text-primary-hover font-bold mb-2 rounded-lg p-2 uppercase tracking-wide">
                Block Confirmation
              </div>
              <div className="text-lg text-primary-gray pl-2">
                Please wait a few minutes for your balance to update on {NETWORK_LABEL[destinationChainId]}
              </div>
            </div>
            <div className="flex items-center justify-center w-1/5">
              <img className="animate-spin" src={SpinnerIcon} width="64px" alt="In progress..." />
              <div className="absolute m-10 mr-10 z-10 text-primary-hover font-bold">
                {formatNumber(percentProgress, NumberFormat.percentShort)}
              </div>
            </div>
          </div>
        </div>
        {<NewTransactionButton type={PrimaryButtonType.Gradient} state={PrimaryButtonState.Disabled} />}
      </>
    )
  }

  const FinalityContent = ({ chainId, successHash }: SuccessContentProps) => {
    return (
      <>
        <div className="flex flex-col justify-center mt-4 bg-primary-green rounded-lg p-4 w-full">
          <div className="flex flex-row">
            <div className="w-4/5">
              <div className="text-sm text-primary-hover font-bold mb-2 rounded-lg p-2 uppercase tracking-wide">
                Complete
              </div>
              <div className="text-lg text-primary-gray pl-2">
                Transaction complete on {NETWORK_LABEL[originChainId]}{' '}
              </div>
              <a
                className="font-semibold text-link pl-2"
                href={getExplorerLink(chainId, successHash, 'transaction')}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Chain Explorer
              </a>
            </div>
            <div className="flex items-center justify-center w-1/5">
              <img src={CompleteIcon} alt="Complete" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-4 bg-primary-green rounded-lg p-4 w-full">
          <div className="flex flex-row">
            <div className="w-4/5">
              <div className="text-sm text-primary-hover font-bold mb-2 rounded-lg p-2 uppercase tracking-wide">
                Block Confirmation
              </div>
              <div className="text-lg text-primary-gray pl-2">
                Block finality reached. You may check your balance now.
              </div>
            </div>
            <div className="flex items-center justify-center w-1/5">
              <img src={CompleteIcon} alt="Complete" />
            </div>
          </div>
        </div>
        {
          <NewTransactionButton
            type={PrimaryButtonType.Default}
            state={PrimaryButtonState.Enabled}
            onClick={async () => {
              setProgressState(false)
            }}
          />
        }
      </>
    )
  }

  return (
    <>
      {!finalityValue && state === ModalState.InProgress && <InProgressContent />}
      {!finalityValue && state === ModalState.Successful && (
        <TxCompleteContent chainId={originChainId} successHash={successHash} />
      )}
      {finalityValue && <FinalityContent chainId={originChainId} successHash={successHash} />}
    </>
  )
}

export default BridgeConfirmationProgress
