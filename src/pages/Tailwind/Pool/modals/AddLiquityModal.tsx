import React, { useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'

interface AddLiquityModalProps {
  isVisible: boolean
  onDismiss: () => void
}

enum AddLiquityModalState {
  NotConfirmed,
  InProgress,
  Successful
}

const AddLiquityModal = ({ isVisible, onDismiss }: AddLiquityModalProps) => {
  const [state, setState] = useState(AddLiquityModalState.NotConfirmed)

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg">You will receive</div>
          <div className="mt-4 font-semibold text-2xl">5 LPT</div>
          <div className="mt-1 text-xl">SXGD/USDT Pool Tokens</div>
          <div className="mt-4 text-sm italic">
            Output is estimated. You will receive at least <span className="font-bold">x amount of LP</span> or the
            transaction will revert.
          </div>
        </div>
        <div className="bg-white px-4 pb-4">
          <div className="py-4 text-sm">
            <div className="flex justify-between mb-2">
              <div className="font-bold">XSGD Deposited</div>
              <div>500 XGSD</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">USDT Deposited</div>
              <div>500 USDT</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">Rates</div>
              <div>
                <div>1 XSGD = 1 USDT</div>
                <div>1 USDT = 1 XSGD</div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold">Share of Pool</div>
              <div>3%</div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm Supply"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              setState(AddLiquityModalState.InProgress)
              setTimeout(() => {
                setState(AddLiquityModalState.Successful)
              }, 2000)
            }}
          />
        </div>
      </>
    )
  }

  const InProgressContent = () => {
    return (
      <div className="p-4">
        <div className="py-12 flex justify-center">
          <img className="animate-spin" src={SpinnerIcon} alt="In progress..." />
        </div>
        <div className="text-center font-semibold text-2xl mb-2">Waiting for confirmation</div>
        <div className="text-center font-bold mb-2">
          Swapping <b>0.1 ETH</b> for <b>8.82411 DAI</b>
        </div>
        <div className="text-center text-sm text-gray-500">Confirm this transaction in your wallet</div>
      </div>
    )
  }

  const SuccessContent = () => {
    return (
      <div className="p-4">
        <div className="py-12 flex justify-center">
          <img src={ArrowIcon} alt="Confirmed" />
        </div>

        <div className="text-center font-semibold text-2xl mb-2">Transaction Confirmed</div>
        <div className="text-center">
          <a className="font-semibold text-link" href="https://etherscan.io/" target="_blank" rel="noopener noreferrer">
            View on Etherscan
          </a>
        </div>
        <div className="mt-12">
          <PrimaryButton
            title="Close"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              onDismiss()
              setState(AddLiquityModalState.NotConfirmed)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      {state === AddLiquityModalState.NotConfirmed && <ConfirmContent />}
      {state === AddLiquityModalState.InProgress && <InProgressContent />}
      {state === AddLiquityModalState.Successful && <SuccessContent />}
    </BaseModal>
  )
}

export default AddLiquityModal
