import React, { useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import { ChainId, Currency } from '@halodao/sdk'
import { HALO } from '../../../../constants'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyLogo from 'components/CurrencyLogo'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import { getExplorerLink } from '../../../../utils'

interface CollateralModalProps {
  isVisible: boolean
  currency: Currency
  onDismiss: () => void
}

enum CollateralModalState {
  NotConfirmed,
  InProgress,
  Successful
}

const CollateralModal = ({ isVisible, currency, onDismiss }: CollateralModalProps) => {
  const [state, setState] = useState(CollateralModalState.NotConfirmed)

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4 border-b border-black">
          <div className="font-semibold text-lg text-primary-hover">Usage as Collateral</div>
        </div>
        <div className="flex flex-auto bg-white px-4 py-8 flex flex-col items-center">
          <div className="mb-4">
            <CurrencyLogo currency={HALO[ChainId.MAINNET]} size="64px" />
          </div>
          <div className="text-center font-semibold text-2xl mb-2">Use {currency.symbol} as collateral</div>
          <div className="text-center">Future {currency.symbol} you lend out will be used as collateral</div>
        </div>
        <div className="pb-4 px-4">
          <PrimaryButton
            title="Confirm"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              setState(CollateralModalState.InProgress)
              setTimeout(() => {
                setState(CollateralModalState.Successful)
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

        <div className="text-center font-semibold text-2xl mb-2">Collateral Confirmed</div>
        <div className="text-center">
          <a
            className="font-semibold text-link"
            href={getExplorerLink(ChainId.MAINNET, '', 'transaction')}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
        </div>
        <div className="mt-12">
          <PrimaryButton
            title="Close"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              onDismiss()
              setState(CollateralModalState.NotConfirmed)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      {state === CollateralModalState.NotConfirmed && <ConfirmContent />}
      {state === CollateralModalState.InProgress && <InProgressContent />}
      {state === CollateralModalState.Successful && <SuccessContent />}
    </BaseModal>
  )
}

export default CollateralModal
