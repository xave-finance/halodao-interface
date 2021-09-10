import React from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import SwapDetails from '../SwapDetails'
import { ChainId, Currency } from '@sushiswap/sdk'
import CurrencyLogo from 'components/CurrencyLogo'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import ArrowDownIcon from 'assets/svg/arrow-down-icon.svg'
import WarningIcon from 'assets/svg/warning-icon-purple.svg'
import { getExplorerLink } from '../../../../utils'
import { ModalState } from 'constants/buttonStates'

interface SwapTransactionModalProps {
  isVisible: boolean
  fromCurrency: Currency
  toCurrency: Currency
  fromAmount: string
  toAmount: string
  minimumAmount: string
  price: number
  onSwap: () => void
  onPriceUpdate: () => void
  onDismiss: () => void
  isExpired: boolean
  setIsExpired: (isExpired: boolean) => void
  timeLeft: number
  swapTransactionModalState: ModalState
  setSwapTransactionModalState: (state: ModalState) => void
  txnHash: string
  chainId: ChainId
}

const SwapTransactionModal = ({
  isVisible,
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
  minimumAmount,
  price,
  onSwap,
  onPriceUpdate,
  onDismiss,
  isExpired,
  setIsExpired,
  timeLeft,
  swapTransactionModalState,
  setSwapTransactionModalState,
  txnHash,
  chainId
}: SwapTransactionModalProps) => {
  const dismissGracefully = () => {
    setSwapTransactionModalState(ModalState.NotConfirmed)
    onDismiss()
  }

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg">Confirm Swap</div>
          <div className="flex justify-between items-center mt-6 px-4 space-x-2">
            <div className="flex flex-row space-x-2">
              <CurrencyLogo currency={fromCurrency} size="23px" />
              <span className="text-lg font-bold">{fromAmount}</span>
            </div>
            <span className="text-lg">{fromCurrency.symbol}</span>
          </div>
          <div className="mt-4 px-4">
            <img src={ArrowDownIcon} alt="Swap" />
          </div>
          <div className="flex justify-between items-center mt-4 pt-2 px-4 space-x-2">
            <div className="flex flex-row space-x-2">
              <CurrencyLogo currency={toCurrency} size="23px" />
              <span className="text-lg font-bold">{toAmount}</span>
            </div>
            <span className="text-lg">{toCurrency.symbol}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 px-4 space-x-2 text-sm text-secondary-alternate italic">
            Output is estimated. You will receive at least {minimumAmount} or the transaction will revert.
          </div>
          <div className="flex justify-between items-center mt-2 p-1.5 bg-primary bg-opacity-10 rounded-md">
            <div className="flex flex-row space-x-2 pl-2 text-primary-hover w-3/4">
              <img src={WarningIcon} alt="warning" />
              <span className="text-sm font-bold">
                {isExpired ? 'Price Update' : `Price valid for ${timeLeft.toString()}s`}
              </span>
            </div>
            <div className="w-1/4">
              <PrimaryButton
                type={PrimaryButtonType.Gradient}
                title="Accept"
                state={isExpired ? PrimaryButtonState.Enabled : PrimaryButtonState.Disabled}
                onClick={() => {
                  setIsExpired(false)
                  onPriceUpdate()
                }}
              />
            </div>
          </div>
        </div>
        <SwapDetails
          price={price}
          toCurrency={toCurrency.symbol}
          fromCurrency={fromCurrency.symbol}
          minimumReceived={minimumAmount}
        />
        <div className="bg-white p-4 pb-4">
          <PrimaryButton
            title="Confirm Swap"
            state={isExpired ? PrimaryButtonState.Disabled : PrimaryButtonState.Enabled}
            onClick={async () => {
              setSwapTransactionModalState(ModalState.InProgress)

              try {
                await onSwap()
              } catch (e) {
                setSwapTransactionModalState(ModalState.NotConfirmed)
              }
              setIsExpired(false)
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
          Swapping{' '}
          <b>
            {fromAmount} {fromCurrency.symbol}
          </b>{' '}
          for{' '}
          <b>
            {' '}
            {toAmount} {toCurrency.symbol}{' '}
          </b>
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
          <a
            className="font-semibold text-link"
            href={getExplorerLink(chainId, txnHash, 'transaction')}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
        </div>
        <div className="mt-12">
          <PrimaryButton title="Close" state={PrimaryButtonState.Enabled} onClick={dismissGracefully} />
        </div>
      </div>
    )
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={dismissGracefully}>
      {swapTransactionModalState === ModalState.NotConfirmed && <ConfirmContent />}
      {swapTransactionModalState === ModalState.InProgress && <InProgressContent />}
      {swapTransactionModalState === ModalState.Successful && <SuccessContent />}
    </BaseModal>
  )
}

export default SwapTransactionModal
