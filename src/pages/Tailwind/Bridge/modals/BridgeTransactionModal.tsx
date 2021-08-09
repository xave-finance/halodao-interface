import React, { useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import { ChainId, Currency } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from 'constants/networks'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import SwitchIcon from 'assets/svg/switch-icon.svg'
import { shortenAddress } from '../../../../utils'

interface ConfirmTransactionModalProps {
  isVisible: boolean
  currency: Currency
  amount: string
  account: string | null | undefined
  confirmLogic: () => void
  onDismiss: () => void
}

enum ConfirmTransactionModalState {
  NotConfirmed,
  InProgress,
  Successful
}

const ConfirmTransactionModal = ({
  isVisible,
  currency,
  amount,
  account,
  confirmLogic,
  onDismiss
}: ConfirmTransactionModalProps) => {
  const [state, setState] = useState(ConfirmTransactionModalState.NotConfirmed)

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg text-primary-dark">Confirm Bridge Transaction</div>
          <div className="flex flex-row items-center justify-center space-x-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-secondary">From</span>
              <div className="mt-2">
                <img src={NETWORK_ICON[ChainId.MAINNET]} alt="Switch Network" className="logo h-7 rounded-2xl" />
              </div>
              <div className="mt-2">{NETWORK_LABEL[ChainId.MAINNET]}</div>
            </div>
            <div>
              <img src={SwitchIcon} alt="Switch" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-secondary">To</span>
              <div className="mt-2">
                <img src={NETWORK_ICON[ChainId.MAINNET]} alt="Switch Network" className="logo h-7 rounded-2xl" />
              </div>
              <div className="mt-2">{NETWORK_LABEL[ChainId.MAINNET]}</div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary">Asset</span>
            <div className="mt-1">
              <span>{amount} </span>
              <span>{currency.symbol}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary">Amount</span>
            <div className="mt-1">
              <span>{amount} </span>
              <span>{currency.symbol}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary">Destination Address</span>
            <div className="mt-1">
              <span>{account && shortenAddress(account)} </span>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-4">
          <div className="py-4 text-sm">
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary">Tax</div>
              <div>0 {currency.symbol}</div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary">Gas fee (estimated)</div>
              <div>1 {currency.symbol}</div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary">Shuttle fee (estimated)</div>
              <div>
                <div>1 {currency.symbol}</div>
              </div>
            </div>
            <div className="border-b border-black w-full"></div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary">Amount after transaction</div>
              <div>
                <div>299 {currency.symbol}</div>
              </div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm"
            state={PrimaryButtonState.Enabled}
            onClick={async () => {
              console.log('PrimaryButton #Confirm')
              setState(ConfirmTransactionModalState.InProgress)
              await confirmLogic()
              setState(ConfirmTransactionModalState.Successful)
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
              setState(ConfirmTransactionModalState.NotConfirmed)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      {state === ConfirmTransactionModalState.NotConfirmed && <ConfirmContent />}
      {state === ConfirmTransactionModalState.InProgress && <InProgressContent />}
      {state === ConfirmTransactionModalState.Successful && <SuccessContent />}
    </BaseModal>
  )
}

export default ConfirmTransactionModal
