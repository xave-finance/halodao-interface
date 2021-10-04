import React, { useEffect } from 'react'
import { ChainId, Currency, Token } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from 'constants/networks'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import SwitchIcon from 'assets/svg/switch-icon.svg'
import { shortenAddress, getExplorerLink } from 'utils'
import { useShuttleFee } from 'halo-hooks/useBridge'
import useTransactionConfirmation from 'hooks/useTransactionConfirmation'
import { ModalState } from '../../../../constants/buttonStates'
import { consoleLog } from 'utils/simpleLogger'

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
  token: Token
  wrappedTokenSymbol: string
  state: ModalState
  setState: (state: ModalState) => void
  successHash: string
  estimatedGas: string
  primaryBridgeContract: any
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
  token,
  wrappedTokenSymbol,
  state,
  setState,
  successHash,
  estimatedGas,
  primaryBridgeContract
}: ConfirmTransactionModalProps) => {
  const { getFee, lowerBoundFee, upperBoundFee } = useShuttleFee(token.address, destinationChainId)

  useEffect(() => {
    getFee()
  }, [primaryBridgeContract, getFee])

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
              <span>{currency.name}</span>
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
              <span>{account && shortenAddress(account, 8)} </span>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-4">
          <div className="py-4 text-sm">
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Gas fee (estimated)</div>
              <div>
                {estimatedGas} {Currency.getNativeCurrencySymbol(originChainId)}{' '}
              </div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Estimated Lower Bound Shuttle fee</div>
              <div>
                <div>
                  {lowerBoundFee.toFixed(2)} {currency.symbol}
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Estimated Upper Bound Shuttle fee</div>
              <div>
                <div>
                  {upperBoundFee.toFixed(2)} {currency.symbol}
                </div>
              </div>
            </div>
            <div className="border-b border-black w-full"></div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Amount after fees</div>
              <div>
                <div>
                  {(Number(amount) - upperBoundFee).toFixed(2)} ~ {(Number(amount) - lowerBoundFee).toFixed(2)}{' '}
                  {currency.symbol}
                </div>
              </div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm"
            state={PrimaryButtonState.Enabled}
            onClick={async () => {
              setState(ModalState.InProgress)
              try {
                await confirmLogic()
              } catch (e) {
                setState(ModalState.NotConfirmed)
              }
            }}
          />
        </div>
      </>
    )
  }

  const InProgressContent = ({ amount, tokenSymbol }: InProgressContentProps) => {
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
    const { confirmations, requiredConfirmations, done } = useTransactionConfirmation(successHash)
    return (
      <div className="p-4">
        <div className="py-12 flex justify-center">
          <img src={ArrowIcon} alt="Confirmed" />
        </div>

        <div className="text-center font-semibold text-2xl mb-2">Transaction Confirmed</div>
        <div className="by-secondary-lighter text-center text-sm text-gray-500 mb-2 border border-bg-secondary-light radius-lg p-4">
          Your transaction is complete on {NETWORK_LABEL[originChainId]}. Please wait a few minutes for your balance to
          update on {NETWORK_LABEL[destinationChainId]}
        </div>
        <div className="text-center">
          {/* Temporary code */}
          {consoleLog('SuccessContent confirmations:', confirmations)}
          {consoleLog('SuccessContent requiredConfirmations:', requiredConfirmations)}
          {consoleLog('SuccessContent done:', done)}
          <a
            className="font-semibold text-link"
            href={getExplorerLink(chainId, successHash, 'transaction')}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Chain Explorer
          </a>
        </div>
        <div className="bg-secondary-lighter text-center text-sm font-semibold mb-2 border-2 border-secondary-light rounded-lg p-2">
          Your transaction is complete on {NETWORK_LABEL[originChainId]}. Please wait a few minutes for your balance to
          update on {NETWORK_LABEL[destinationChainId]}
        </div>
        <div className="mt-2">
          <PrimaryButton
            title="Close"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              onSuccessConfirm()
              setState(ModalState.NotConfirmed)
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
        setState(ModalState.NotConfirmed)
        onDismiss()
      }}
    >
      {state === ModalState.NotConfirmed && <ConfirmContent />}
      {state === ModalState.InProgress && (
        <InProgressContent
          amount={amount}
          tokenSymbol={token.symbol as string}
          wrappedTokenSymbol={wrappedTokenSymbol}
        />
      )}
      {state === ModalState.Successful && <SuccessContent chainId={originChainId} successHash={successHash} />}
    </BaseModal>
  )
}

export default ConfirmTransactionModal
