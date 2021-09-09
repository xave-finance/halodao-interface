import React, { useCallback, useState, useEffect } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { useWeb3React } from '@web3-react/core'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SwapSettingsModal from './modals/SwapSettingsModal'
import SwapTransactionModal from './modals/SwapTransactionModal'
import SwapDetails from './SwapDetails'
import SwitchIcon from 'assets/svg/switch-swap-icon.svg'
import SettingsIcon from 'assets/svg/cog-icon.svg'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { useSwapToken } from 'halo-hooks/amm/useSwapToken'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import { haloTokenList } from 'constants/tokenLists/halo-tokenlist'
import { ButtonState, ModalState } from '../../../constants/buttonStates'

const SwapPanel = () => {
  const { account, error, chainId } = useWeb3React()

  const [toCurrency, setToCurrency] = useState(haloTokenList[chainId as ChainId]![0])
  const [fromCurrency, setFromCurrency] = useState(haloTokenList[chainId as ChainId]![1])

  const { getPrice, getMinimumAmount, price, minimumAmount, approve, allowance, swapToken } = useSwapToken(
    toCurrency,
    fromCurrency
  )
  const [fromInputValue, setFromInputValue] = useState('')
  const [toInputValue, setToInputValue] = useState('')
  const [txDeadline, setTxDeadline] = useState('')
  const [slippage, setSlippage] = useState('')
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [buttonState, setButtonState] = useState(ButtonState.EnterAmount)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isExpired, setIsExpired] = useState(false)
  const [swapTransactionModalState, setSwapTransactionModalState] = useState(ModalState.NotConfirmed)

  const handleApprove = useCallback(async () => {
    try {
      setApproveState(ApproveButtonState.Approving)
      const txHash: any = await approve()

      // user rejected tx or didn't go thru
      if (txHash.code == 4001 || !txHash) {
        setApproveState(ApproveButtonState.NotApproved)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve, setApproveState])

  const startTimer = () => {
    let maxTime = timeLeft
    const timer = setInterval(() => {
      maxTime -= 1
      setTimeLeft(maxTime)
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setTimeLeft(60)
      getMinimumAmount(fromInputValue)
      setIsExpired(true)
      getPrice()
    }, 60000)
  }

  useEffect(() => {
    getPrice()
    getMinimumAmount(fromInputValue ? fromInputValue : '0')
    setToInputValue(minimumAmount || '0')
  }, [toCurrency, fromCurrency, getMinimumAmount, getPrice, fromInputValue, minimumAmount])

  useEffect(() => {
    setToCurrency(haloTokenList[chainId as ChainId]![0])
    setFromCurrency(haloTokenList[chainId as ChainId]![1])
  }, [chainId])

  useEffect(() => {
    if (allowance !== '' && Number(allowance) > 0) {
      //if (ApproveButtonState.Approving) return
      setApproveState(ApproveButtonState.Approved)
      setButtonState(ButtonState.Swap)
    } else {
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.EnterAmount)
    }
  }, [allowance])

  const NotApproveContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.NotApproved}
            onClick={() => {
              if (fromInputValue && toInputValue) {
                handleApprove()
              }
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Swap" state={PrimaryButtonState.Disabled} />
        </div>
      </div>
    )
  }

  const SwapContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Swap"
          state={PrimaryButtonState.Enabled}
          onClick={() => {
            if (fromInputValue && toInputValue && Number(fromInputValue) > 0 && Number(toInputValue) > 0) {
              setButtonState(ButtonState.Confirming)
              startTimer()
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
          <ApproveButton title="Approving" state={ApproveButtonState.Approving} onClick={() => {}} />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Swap" state={PrimaryButtonState.Disabled} />
        </div>
      </div>
    )
  }

  const ApprovedContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton title="Approve" state={ApproveButtonState.Approved} />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Swap" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ConfirmingContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton type={PrimaryButtonType.Gradient} title="Confirming" state={PrimaryButtonState.InProgress} />
      </div>
    )
  }

  const EnterAmountContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton type={PrimaryButtonType.Gradient} title="Enter an amount" state={PrimaryButtonState.Disabled} />
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
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Swap) {
      return <SwapContent />
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
          <SwapDetails
            price={price}
            toCurrency={toCurrency.symbol}
            fromCurrency={fromCurrency.symbol}
            minimumReceived={minimumAmount}
          />
        </>
      )
    }
  }

  return (
    <>
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
            currency={fromCurrency}
            value={fromInputValue}
            canSelectToken={true}
            didChangeValue={val => {
              setFromInputValue(val)
            }}
            showBalance={true}
            showMax={true}
            tokenList={haloTokenList[chainId as ChainId] || []}
            onSelectToken={token => {
              if (token !== toCurrency) {
                setFromCurrency(token)
              }
            }}
            isSufficientBalance={(isSufficient: boolean) => {
              if (!isSufficient) {
                setButtonState(ButtonState.InsufficientBalance)
              }
            }}
          />
        </div>

        <div className="flex flex:row mt-2 mb-2 md:mt-4 mb-4">
          <div className="w-1/2 flex justify-start">
            <p className="mt-2 font-semibold text-secondary-alternate">Swap to</p>
          </div>
          <div
            className="w-1/2 flex justify-end cursor-pointer"
            onClick={() => {
              const prevToInputValue = toInputValue
              const prevToCurrency = toCurrency
              setToInputValue(fromInputValue)
              setFromInputValue(prevToInputValue)
              setToCurrency(fromCurrency)
              setFromCurrency(prevToCurrency)
            }}
          >
            <img src={SwitchIcon} alt="Switch" />
          </div>
        </div>

        <div className="mt-2">
          <CurrencyInput
            currency={toCurrency}
            value={toInputValue}
            canSelectToken={true}
            didChangeValue={val => setToInputValue(val)}
            showBalance={false}
            showMax={false}
            tokenList={haloTokenList[chainId as ChainId] || []}
            onSelectToken={token => {
              if (token !== fromCurrency) {
                setToCurrency(token)
              }
            }}
          />
        </div>
        <MainContent />
      </div>
      <SwapSettingsModal
        txDeadline={txDeadline}
        isVisible={showSettingsModal}
        onSlippageChanged={setSlippage}
        onDismiss={() => setShowSettingsModal(false)}
        didChangeTxDeadline={val => setTxDeadline(val)}
      />
      <SwapTransactionModal
        isVisible={showModal}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        fromAmount={fromInputValue}
        toAmount={toInputValue}
        minimumAmount={minimumAmount || '0'}
        price={price || 0}
        onSwap={async () => {
          if (await swapToken(fromInputValue)) {
            setSwapTransactionModalState(ModalState.Successful)
          }
        }}
        onPriceUpdate={() => {
          getMinimumAmount(fromInputValue)
          getPrice()
          startTimer()
        }}
        onDismiss={() => {
          setButtonState(ButtonState.Swap)
          setShowModal(false)
        }}
        isExpired={isExpired}
        setIsExpired={setIsExpired}
        timeLeft={timeLeft}
        swapTransactionModalState={swapTransactionModalState}
        setSwapTransactionModalState={setSwapTransactionModalState}
      />
    </>
  )
}

export default SwapPanel
