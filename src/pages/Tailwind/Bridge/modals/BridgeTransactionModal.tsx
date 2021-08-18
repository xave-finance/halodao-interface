import React from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import { ChainId, Currency } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from 'constants/networks'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import SwitchIcon from 'assets/svg/switch-icon.svg'
import { shortenAddress, getExplorerLink } from '../../../../utils'

interface ConfirmTransactionModalProps {
  isVisible: boolean
  currency: Currency
  amount: string
  account: string | null | undefined
  confirmLogic: () => void
  onDismiss: () => void
  onSuccessConfirm: () => void
  originChainId: ChainId
  destinationChainId: ChainId
  tokenSymbol: string
  wrappedTokenSymbol: string
  state: ConfirmTransactionModalState
  setState: (state: ConfirmTransactionModalState) => void
  successHash: string
}

enum ConfirmTransactionModalState {
  NotConfirmed,
  InProgress,
  Successful
}

interface InProgressContentProps {
  amount: string
  tokenSymbol: string
  wrappedTokenSymbol: string
}

const ConfirmTransactionModal = ({
  isVisible,
  currency,
  amount,
  account,
  confirmLogic,
  onDismiss,
  onSuccessConfirm,
  originChainId,
  destinationChainId,
  tokenSymbol,
  wrappedTokenSymbol,
  state,
  setState,
  successHash
}: ConfirmTransactionModalProps) => {
  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg text-primary-hover">Confirm Bridge Transaction</div>
          <div className="flex flex-row items-center justify-center space-x-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-secondary-alternate">From</span>
              <div className="mt-2">
                <img src={NETWORK_ICON[originChainId]} alt="Switch Network" className="logo h-7 rounded-2xl" />
              </div>
              <div className="mt-2">{NETWORK_LABEL[originChainId]}</div>
            </div>
            <div>
              <img src={SwitchIcon} alt="Switch" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-secondary-alternate">To</span>
              <div className="mt-2">
                <img src={NETWORK_ICON[destinationChainId]} alt="Switch Network" className="logo h-7 rounded-2xl" />
              </div>
              <div className="mt-2">{NETWORK_LABEL[destinationChainId]}</div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary-alternate">Asset</span>
            <div className="mt-1">
              <span>{amount} </span>
              <span>{currency.symbol}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary-alternate">Amount</span>
            <div className="mt-1">
              <span>{amount} </span>
              <span>{currency.symbol}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary-alternate">Destination Address</span>
            <div className="mt-1">
              <span>{account && shortenAddress(account)} </span>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-4">
          <div className="py-4 text-sm">
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Tax</div>
              <div>0 {currency.symbol}</div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Gas fee (estimated)</div>
              <div>0 {currency.symbol}</div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Shuttle fee (estimated)</div>
              <div>
                <div>0 {currency.symbol}</div>
              </div>
            </div>
            <div className="border-b border-black w-full"></div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Amount after transaction</div>
              <div>
                <div>
                  {amount} {currency.symbol}
                </div>
              </div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm"
            state={PrimaryButtonState.Enabled}
            onClick={async () => {
              setState(ConfirmTransactionModalState.InProgress)
              try {
                await confirmLogic()
                // setState(ConfirmTransactionModalState.Successful)
              } catch (e) {
                setState(ConfirmTransactionModalState.NotConfirmed)
              }
            }}
          />
        </div>
      </>
    )
  }

  const InProgressContent = ({ amount, tokenSymbol, wrappedTokenSymbol }: InProgressContentProps) => {
    return (
      <div className="p-4">
        <div className="py-12 flex justify-center">
          <img className="animate-spin" src={SpinnerIcon} alt="In progress..." />
        </div>
        <div className="text-center font-semibold text-2xl mb-2">Waiting for confirmation</div>
        <div className="text-center font-bold mb-2">
          Bridging{' '}
          <b>
            {amount} {tokenSymbol}
          </b>{' '}
          for{' '}
          <b>
            {' '}
            {amount} {wrappedTokenSymbol}{' '}
          </b>
        </div>
        <div className="text-center text-sm text-gray-500">Confirm this transaction in your wallet</div>
      </div>
    )
  }

  interface SuccessContentProps {
    chainId: ChainId
    successHash: string
  }

  const SuccessContent = ({ chainId, successHash }: SuccessContentProps) => {
    return (
      <div className="p-4">
        <div className="py-12 flex justify-center">
          <img src={ArrowIcon} alt="Confirmed" />
        </div>

        <div className="text-center font-semibold text-2xl mb-2">Transaction Confirmed</div>
        <div className="text-center">
          <a
            className="font-semibold text-link"
            href={getExplorerLink(chainId, successHash, 'transaction')}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Chain Explorer
          </a>
        </div>
        <div className="mt-12">
          <PrimaryButton
            title="Close"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              onSuccessConfirm()
              setState(ConfirmTransactionModalState.NotConfirmed)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <BaseModal
      isVisible={isVisible}
      onDismiss={() => {
        setState(ConfirmTransactionModalState.NotConfirmed)
        onDismiss()
      }}
    >
      {state === ConfirmTransactionModalState.NotConfirmed && <ConfirmContent />}
      {state === ConfirmTransactionModalState.InProgress && (
        <InProgressContent amount={amount} tokenSymbol={tokenSymbol} wrappedTokenSymbol={wrappedTokenSymbol} />
      )}
      {state === ConfirmTransactionModalState.Successful && (
        <SuccessContent chainId={originChainId} successHash={successHash} />
      )}
    </BaseModal>
  )
}

export default ConfirmTransactionModal
