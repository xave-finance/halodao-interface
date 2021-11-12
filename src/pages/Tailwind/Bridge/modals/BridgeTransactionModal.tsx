import React, { useEffect } from 'react'
import { ChainId, Currency, Token } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from 'constants/networks'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import SwitchIcon from 'assets/svg/switch-icon.svg'
import { shortenAddress } from 'utils'
import { useShuttleFee } from 'halo-hooks/useBridge'
import { ModalState } from '../../../../constants/buttonStates'

interface BridgeTransactionModalProps {
  isVisible: boolean
  amount: string
  account: string | null | undefined
  confirmLogic: () => void
  onDismiss: () => void
  onSuccessConfirm: () => void
  originChainId: ChainId
  destinationChainId: ChainId
  token: Token
  state: ModalState
  setState: (state: ModalState) => void
  estimatedGas: string
  primaryBridgeContract: any
  setProgressState: (isProgressVisible: boolean) => void
}

const BridgeTransactionModal = ({
  isVisible,
  amount,
  account,
  confirmLogic,
  onDismiss,
  onSuccessConfirm,
  originChainId,
  destinationChainId,
  token,
  state,
  setState,
  estimatedGas,
  primaryBridgeContract,
  setProgressState
}: BridgeTransactionModalProps) => {
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
              <span>{token.name}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-secondary-alternate">Amount</span>
            <div className="mt-1">
              <span>{amount} </span>
              <span>{token.symbol}</span>
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
              <div className="text-secondary-alternate">Estimated lower bound shuttle fee</div>
              <div>
                <div>
                  {lowerBoundFee.toFixed(2)} {token.symbol}
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Estimated upper bound shuttle fee</div>
              <div>
                <div>
                  {upperBoundFee.toFixed(2)} {token.symbol}
                </div>
              </div>
            </div>
            <div className="border-b border-black w-full"></div>
            <div className="flex justify-between mb-2 font-bold">
              <div className="text-secondary-alternate">Amount after fees</div>
              <div>
                <div>
                  {(Number(amount) - upperBoundFee).toFixed(2)} ~ {(Number(amount) - lowerBoundFee).toFixed(2)}{' '}
                  {token.symbol}
                </div>
              </div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm"
            state={PrimaryButtonState.Enabled}
            onClick={async () => {
              setState(ModalState.InProgress)
              onSuccessConfirm()
              setProgressState(true)
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

  return (
    <BaseModal
      isVisible={isVisible}
      onDismiss={() => {
        setState(ModalState.NotConfirmed)
        onDismiss()
      }}
    >
      {state === ModalState.NotConfirmed && <ConfirmContent />}
    </BaseModal>
  )
}

export default BridgeTransactionModal
