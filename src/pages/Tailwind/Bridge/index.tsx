import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ethers from 'ethers'
import { ChainId, Currency } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import SwitchButton from 'components/Tailwind/Buttons/SwitchButton'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import WarningAlert from 'components/Tailwind/Alerts/WarningAlert'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { shortenAddress } from '../../../utils'
import { AppState, AppDispatch } from '../../../state'

import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import BridgeTransactionModal from './modals/BridgeTransactionModal'

import { useFetchBridgeCallback } from '../../../state/bridge/hooks'
import { useAppoveBridgeDepositCallback } from '../../../halo-hooks/useBridgeActions'

export enum ButtonState {
  Default,
  Next,
  Confirming,
  EnterAmount,
  InsufficientBalance,
  Retry
}

const Bridge = () => {
  const { account, error, chainId } = useWeb3React()
  const [inputValue, setInputValue] = useState('')
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [buttonState, setButtonState] = useState(ButtonState.EnterAmount)
  const [showModal, setShowModal] = useState(false)

  const tokenAddress = useSelector<AppState, AppState['bridge']['tokenAddress']>(state => state.bridge.tokenAddress)
  const destinationChainId = useSelector<AppState, AppState['bridge']['destinationChainId']>(
    state => state.bridge.destinationChainId
  )
  const bridgeContract = useSelector<AppState, AppState['bridge']['bridgeContract']>(
    state => state.bridge.bridgeContract
  )

  const {
    giveBridgeAllowance,
    depositToPrimaryBridge,
    giveSecondaryBridgeAllowance,
    burnWrappedTokens
  } = useAppoveBridgeDepositCallback(
    tokenAddress,
    bridgeContract.parentBridgeContractAddress,
    bridgeContract.wrappedTokenContractAddress,
    bridgeContract.bridgeContractAddress
  )

  const approveAllowance = async (amount: ethers.BigNumber) => {
    setApproveState(ApproveButtonState.Approving)
    try {
      let tx
      if (chainId === destinationChainId) {
        tx = await giveSecondaryBridgeAllowance(amount)
      } else {
        tx = await giveBridgeAllowance(amount)
      }
      await tx.wait()
      setApproveState(ApproveButtonState.Approved)
      setButtonState(ButtonState.Next)
    } catch (e) {
      console.error(e)
    }

    /** @todo Add logging to google analytics */
  }

  const deposit = async (amount: ethers.BigNumber, chainId: number) => {
    setButtonState(ButtonState.Confirming)
    try {
      let tx
      if (chainId === destinationChainId) {
        tx = await burnWrappedTokens(amount)
      } else {
        tx = await depositToPrimaryBridge(amount, chainId)
      }
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchBridge = useFetchBridgeCallback()

  useEffect(() => {
    fetchBridge(tokenAddress, destinationChainId)
  }, [tokenAddress, chainId, destinationChainId])

  const NotApproveContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.NotApproved}
            onClick={() => approveAllowance(ethers.utils.parseEther(`${inputValue}`))}
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
            if (inputValue) {
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
    let content = <></>
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.Default) {
      console.log('a')
      content = <NotApproveContent />
    }
    if (approveState === ApproveButtonState.Approving && buttonState === ButtonState.Default) {
      console.log('b')
      content = <ApprovingContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Default) {
      console.log('c')
      content = <ApprovedContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Next) {
      console.log('d')
      content = <NextContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Confirming) {
      console.log('e')
      content = <ConfirmingContent />
    }
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.EnterAmount) {
      console.log('f')
      content = <EnterAmountContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Retry) {
      console.log('g')
      content = <RetryContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.InsufficientBalance) {
      content = <InsufficientBalanceContent />
    }
    return <>{content}</>
  }

  const MainContent = () => {
    const toggleWalletModal = useWalletModalToggle()
    const balance = useCurrencyBalance(account ?? undefined, HALO[ChainId.MAINNET])

    if (!account && !error) {
      return (
        <div className="mt-2">
          <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
        </div>
      )
    } else {
      return (
        <>
          <div className="mt-2">
            <p className="rounded-md p-2 w-full bg-primary-lightest"> {account && shortenAddress(account, 12)}</p>
          </div>
          <CurrentButtonContent />
        </>
      )
    }
  }

  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Bridge"
          caption="Move your ERC-20 token from EVM bridge to EVM bridge."
          link={{ text: 'Learn about bridge', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-dark shadow-md rounded-card">
          <div className="w-full">
            <div className="flex md:space-x-4 mt-2">
              <div className="mb-2 w-2/5">
                <p className="text-secondary font-semibold">From</p>
              </div>
              <div className="mb-2 w-1/5"></div>
              <div className="mb-2 w-2/5">
                <p className="text-secondary font-semibold">To</p>
              </div>
            </div>

            <div className="w-full flex md:space-x-4">
              <SelectedNetworkPanel mode={NetworkModalMode.PrimaryBridge} />
              <div className="mb-2 w-1/5 flex items-center justify-center">
                <SwitchButton onClick={() => console.log('clicked')} />
              </div>
              <SelectedNetworkPanel mode={NetworkModalMode.SecondaryBridge} />
            </div>

            <p className="mt-2 font-semibold text-secondary">Amount</p>

            <div className="mt-2">
              <CurrencyInput
                currency={HALO[ChainId.MAINNET]!}
                value={inputValue}
                canSelectToken={true}
                didChangeValue={val => setInputValue(val)}
                showBalance={true}
                showMax={true}
              />
            </div>

            <p className="mt-2 font-semibold text-secondary">Destination Address</p>
            <MainContent />

            <div className="flex justify-center mt-2">
              <WarningAlert message="Don’t use exchange address for cross-chain transfers" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start md:w-1/2">
        <InfoCard
          title="Some Extra Info"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Parturient id vitae morbi ipsum est maecenas tellus at. Consequat in justo"
        />
      </div>
      <BridgeTransactionModal
        isVisible={showModal}
        currency={{ symbol: bridgeContract.tokenSymbol, decimals: 18 } as Currency}
        amount={inputValue}
        account={account}
        confirmLogic={async () => await deposit(ethers.utils.parseEther(`${inputValue}`), bridgeContract.chainId)}
        onDismiss={() => setShowModal(false)}
      />
    </PageWrapper>
  )
}

export default Bridge
