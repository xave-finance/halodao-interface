import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import WarningAlert from 'components/Tailwind/Alerts/WarningAlert'
import SwapSettingsModal from './modals/SwapSettingsModal'
import SwitchIcon from 'assets/svg/switch-swap-icon.svg'
import SettingsIcon from 'assets/svg/cog-icon.svg'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { shortenAddress } from '../../../utils'

import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'

export enum ButtonState {
  Default,
  EnterAmount,
  Approving,
  Approved,
  Next,
  Confirming,
  InsufficientBalance,
  Retry
}

const Swap = () => {
  const { account, error } = useWeb3React()
  const [fromInputValue, setFromInputValue] = useState('')
  const [toInputValue, setToInputValue] = useState('')
  const [slippage, setSlippage] = useState('')
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [buttonState, setButtonState] = useState(ButtonState.EnterAmount)

  const NotApproveContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.NotApproved}
            onClick={() => {
              if (fromInputValue && toInputValue) {
                setApproveState(ApproveButtonState.Approving)
                setButtonState(ButtonState.Approving)
                setTimeout(() => {
                  setApproveState(ApproveButtonState.Approved)
                  setButtonState(ButtonState.Approved)
                }, 2000)
                setTimeout(() => {
                  setButtonState(ButtonState.Next)
                }, 2000)
              }
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const NextContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Next"
          state={PrimaryButtonState.Enabled}
          onClick={() => {
            if (fromInputValue && toInputValue) {
              setButtonState(ButtonState.Confirming)
              setShowModal(true)
            }
          }}
        />
      </div>
    )
  }

  const ApprovingContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approving"
            state={ApproveButtonState.Approving}
            onClick={() => {
              console.log('clicked')
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ApprovedContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.Approved}
            onClick={() => {
              console.log('clicked')
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ConfirmingContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Confirming"
          state={PrimaryButtonState.InProgress}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }

  const EnterAmountContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Enter an amount"
          state={PrimaryButtonState.Disabled}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }

  const InsufficientBalanceContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Insufficient Balance"
          state={PrimaryButtonState.Disabled}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }

  const RetryContent = () => {
    return (
      <div className="mt-4">
        <RetryButton title="Retry" isEnabled={true} onClick={() => console.log('clicked')} />
      </div>
    )
  }

  const CurrentButtonContent = () => {
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.EnterAmount) {
      if (!fromInputValue || !toInputValue || parseFloat(fromInputValue) === 0 || parseFloat(toInputValue) === 0) {
        return <EnterAmountContent />
      } else if (fromInputValue && parseFloat(fromInputValue) > 0 && toInputValue && parseFloat(toInputValue) > 0) {
        return <NotApproveContent />
      }
    }
    if (approveState === ApproveButtonState.Approving) {
      return <ApprovingContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Default) {
      return <ApprovedContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Next) {
      return <NextContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Confirming) {
      return <ConfirmingContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Retry) {
      return <RetryContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.InsufficientBalance) {
      return <InsufficientBalanceContent />
    }
    return <></>
  }

  const MainContent = () => {
    const toggleWalletModal = useWalletModalToggle()

    if (!account && !error) {
      return (
        <div className="mt-2">
          <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
        </div>
      )
    } else {
      return (
        <>
          <CurrentButtonContent />
          <div className="flex flex-row justify-start mt-6 px-8 w-container text-sm font-bold">
            <div className="w-1/2 text-secondary-alternate">Price</div>
            <div className="w-1/2 flex justify-end">88.2412 DAI/ETH</div>
          </div>
          <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
            <div className="w-1/2 text-secondary-alternate">Minimum Received</div>
            <div className="w-1/2 flex justify-end">8.78 DAI</div>
          </div>
          <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
            <div className="w-1/2 text-secondary-alternate">Price Impact</div>
            <div className="w-1/2 flex justify-end">{`<0.01%`}</div>
          </div>
          <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
            <div className="w-1/2 text-secondary-alternate">Liquidity Provider Fee</div>
            <div className="w-1/2 flex justify-end">Price</div>
          </div>
        </>
      )
    }
  }

  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Swap"
          caption="Swap your ERC-20 tokens."
          link={{ text: 'Learn about swap', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
          <div className="w-full">
            <div className="flex flex:row mt-2 mb-2 md:mt-4 mb-4">
              <div className="w-1/2 flex justify-start">
                <p className="font-semibold text-secondary-alternate">From</p>
              </div>
              <div className="w-1/2 flex justify-end cursor-pointer">
                <img src={SettingsIcon} alt="Settings" onClick={() => setShowSettingsModal(true)} />
              </div>
            </div>

            <div className="mt-2">
              <CurrencyInput
                currency={HALO[ChainId.MAINNET]!}
                value={fromInputValue}
                canSelectToken={true}
                didChangeValue={val => setFromInputValue(val)}
                showBalance={true}
                showMax={true}
              />
            </div>

            <div className="flex flex:row mt-2 mb-2 md:mt-4 mb-4">
              <div className="w-1/2 flex justify-start">
                <p className="mt-2 font-semibold text-secondary-alternate">Swap to</p>
              </div>
              <div className="w-1/2 flex justify-end cursor-pointer">
                <img src={SwitchIcon} alt="Switch" />
              </div>
            </div>

            <div className="mt-2">
              <CurrencyInput
                currency={HALO[ChainId.MAINNET]!}
                value={toInputValue}
                canSelectToken={true}
                didChangeValue={val => setToInputValue(val)}
                showBalance={true}
                showMax={true}
              />
            </div>
            <MainContent />
          </div>
        </div>
      </div>
      <div className="flex items-start md:w-1/2">
        <InfoCard
          title="Some Extra Info"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Parturient id vitae morbi ipsum est maecenas tellus at. Consequat in justo"
        />
      </div>
      <SwapSettingsModal
        isVisible={showSettingsModal}
        onSlippageChanged={setSlippage}
        onDismiss={() => setShowSettingsModal(false)}
      />
    </PageWrapper>
  )
}

export default Swap