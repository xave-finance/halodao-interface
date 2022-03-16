import React, { useCallback, useState, useEffect } from 'react'
import { ChainId, Token } from '@halodao/sdk'
import { useWeb3React } from '@web3-react/core'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SwapSettingsModal from './modals/SwapSettingsModal'
import SwapTransactionModal from './modals/SwapTransactionModal'
import SwapDetails from './SwapDetails'
import SwitchIcon from 'assets/svg/switch-swap-icon.svg'
import SettingsIcon from 'assets/svg/cog-icon.svg'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { CurrencySide, useSwapToken } from 'halo-hooks/amm/useSwapToken'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import { SwapButtonState, ModalState } from '../../../constants/buttonStates'
import { HALO } from '../../../constants'
import PageWarning from 'components/Tailwind/Layout/PageWarning'
import { MetamaskProviderErrorCode } from 'constants/errors'
import ErrorModal from 'components/Tailwind/Modals/ErrorModal'
// import { ProviderErrorCode } from 'walletlink/dist/provider/Web3Provider'
import useTokenList from 'halo-hooks/amm-v2/useTokenList'
import FeatureNotSupported from 'components/Tailwind/Panels/FeatureNotSupported'
import useSwap from 'halo-hooks/amm-v2/useSwap'

const SwapPanel = () => {
  const { account, error, chainId } = useWeb3React()
  const { tokenList, tokenListLoading } = useTokenList()

  const [toCurrency, setToCurrency] = useState(tokenList.length > 0 ? tokenList[0] : (HALO[ChainId.MAINNET] as Token))
  const [fromCurrency, setFromCurrency] = useState(
    tokenList.length > 1 ? tokenList[1] : (HALO[ChainId.MAINNET] as Token)
  )
  const [fromAmountBalance, setFromAmountBalance] = useState('')
  const [fromInputValue, setFromInputValue] = useState('')
  const [toInputValue, setToInputValue] = useState('')
  const [txDeadline, setTxDeadline] = useState(10) // 10 minutes
  const [slippage, setSlippage] = useState(0.03) // 3%
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [buttonState, setButtonState] = useState(SwapButtonState.EnterAmount)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isExpired, setIsExpired] = useState(false)
  const [swapTransactionModalState, setSwapTransactionModalState] = useState(ModalState.NotConfirmed)
  const [txhash, setTxhash] = useState('')
  const [errorObject, setErrorObject] = useState<any>(undefined)

  useSwap()

  const {
    getPrice,
    getMinimumAmount,
    price,
    isLoadingPrice,
    toMinimumAmount,
    fromMinimumAmount,
    isLoadingMinimumAmount,
    approve,
    allowance,
    swapToken
  } = useSwapToken(toCurrency, fromCurrency, setButtonState)

  const handleApprove = useCallback(async () => {
    try {
      setApproveState(ApproveButtonState.Approving)
      const txHash: any = await approve()

      // user rejected tx or didn't go thru
      if (txHash.code === MetamaskProviderErrorCode.userRejectedRequest || !txHash) {
        setApproveState(ApproveButtonState.NotApproved)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve, setApproveState])

  useEffect(() => {
    if (fromCurrency.address === (HALO[ChainId.MAINNET] as Token).address && tokenList.length > 0) {
      setFromCurrency(tokenList[0])
    }
    if (toCurrency.address === (HALO[ChainId.MAINNET] as Token).address && tokenList.length > 1) {
      setToCurrency(tokenList[1])
    }
  }, [tokenList, fromCurrency.address, toCurrency.address])

  useEffect(() => {
    if (!timeLeft) return

    const intervalId = setInterval(() => {
      const decreaseTime = timeLeft - 1

      setTimeLeft(decreaseTime)
      if (decreaseTime === 0) {
        setIsExpired(true)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft])

  useEffect(() => {
    getPrice()
  }, [toCurrency, fromCurrency, getMinimumAmount, getPrice, fromInputValue])

  useEffect(() => {
    setToInputValue(toMinimumAmount || '')
  }, [toMinimumAmount])

  useEffect(() => {
    setFromInputValue(fromMinimumAmount || '')
  }, [fromMinimumAmount])

  useEffect(() => {
    if (chainId && tokenList) {
      if (tokenList.length > 0) {
        setFromCurrency(tokenList[0])
      }
      if (tokenList.length > 1) {
        setToCurrency(tokenList[1])
      }
      setToInputValue('')
      setFromInputValue('')
    }
  }, [chainId, tokenList])

  useEffect(() => {
    console.log(allowance)
    if (allowance && Number(allowance) > 0) {
      setApproveState(ApproveButtonState.Approved)
      setButtonState(SwapButtonState.Swap)
    } else {
      setApproveState(ApproveButtonState.NotApproved)
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
            setTimeLeft(60)
            setIsExpired(false)
            if (fromInputValue && toInputValue && Number(fromInputValue) > 0 && Number(toInputValue) > 0) {
              setButtonState(SwapButtonState.Confirming)
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
          <ApproveButton title="Approving" state={ApproveButtonState.Approving} />
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

  const InsufficientLiquidityContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Insufficient Pool Liquidity"
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

  const setButtonStates = useCallback(() => {
    if (!allowance || Number(allowance) === 0) {
      if (fromInputValue && parseFloat(fromInputValue) > 0 && toInputValue && parseFloat(toInputValue) > 0) {
        setButtonState(SwapButtonState.Default)
        setApproveState(ApproveButtonState.NotApproved)
      } else if (parseFloat(fromInputValue) >= parseFloat(fromAmountBalance)) {
        setButtonState(SwapButtonState.InsufficientBalance)
        setApproveState(ApproveButtonState.NotApproved)
      } else {
        setButtonState(SwapButtonState.Default)
      }
    } else if (Number(allowance) > 0) {
      if (parseFloat(fromInputValue) === 0 || parseFloat(toInputValue) === 0) {
        setButtonState(SwapButtonState.Swap)
      }
    }
  }, [allowance, fromInputValue, fromAmountBalance, toInputValue])

  useEffect(() => {
    setButtonStates()
  }, [setButtonStates])

  const CurrentButtonContent = () => {
    if (approveState === ApproveButtonState.NotApproved) {
      if (buttonState === SwapButtonState.Default) {
        return <NotApproveContent />
      } else if (buttonState === SwapButtonState.InsufficientBalance) {
        return <InsufficientBalanceContent />
      } else if (parseFloat(fromInputValue) === 0 || parseFloat(toInputValue) === 0) {
        return <EnterAmountContent />
      } else if (buttonState === SwapButtonState.InsufficientLiquidity) {
        return <InsufficientLiquidityContent />
      }
    } else if (approveState === ApproveButtonState.Approving) {
      return <ApprovingContent />
    } else if (approveState === ApproveButtonState.Approved) {
      if (buttonState === SwapButtonState.Default) {
        return <ApprovedContent />
      } else if (buttonState === SwapButtonState.Swap) {
        return <SwapContent />
      } else if (buttonState === SwapButtonState.Confirming) {
        return <ConfirmingContent />
      } else if (buttonState === SwapButtonState.Retry) {
        return <RetryContent />
      } else if (buttonState === SwapButtonState.InsufficientBalance) {
        return <InsufficientBalanceContent />
      } else if (buttonState === SwapButtonState.InsufficientLiquidity) {
        return <InsufficientLiquidityContent />
      }
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
    }

    return (
      <>
        <CurrentButtonContent />
        <SwapDetails
          price={price}
          isLoadingPrice={isLoadingPrice}
          toCurrency={toCurrency?.symbol}
          fromCurrency={fromCurrency?.symbol}
          minimumReceived={toMinimumAmount}
          isLoadingMinimumAmount={isLoadingMinimumAmount}
        />
      </>
    )
  }

  if (!tokenListLoading && tokenList.length === 0) {
    return <FeatureNotSupported isIsolated={true} />
  }

  return (
    <>
      <div className="w-full bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
        {account ? (
          <>
            <div className="flex flex:row mt-2 md:mt-4 mb-4">
              <div className="w-1/2 flex justify-start">
                <p className="font-semibold text-secondary-alternate">From {fromAmountBalance}</p>
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
                didChangeValue={async val => {
                  if (parseFloat(fromAmountBalance) >= parseFloat(val)) {
                    setButtonState(SwapButtonState.Swap)
                  } else if (parseFloat(fromAmountBalance) < parseFloat(val)) {
                    setButtonState(SwapButtonState.InsufficientBalance)
                  }
                  getMinimumAmount(val, CurrencySide.TO_CURRENCY)

                  setFromInputValue(val)
                }}
                showBalance={true}
                showMax={true}
                isLoading={tokenListLoading}
                tokenList={tokenList}
                onSelectToken={token => {
                  if (token !== toCurrency) {
                    setFromCurrency(token)
                    setToInputValue('')
                    setFromInputValue('')
                  }
                }}
                didUpdateBalance={balance => {
                  setFromAmountBalance(balance)
                }}
              />
            </div>

            <div className="flex flex:row mt-2 md:mt-4 mb-4">
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
                  getMinimumAmount(prevToInputValue, CurrencySide.TO_CURRENCY)
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
                didChangeValue={val => {
                  if (approveState === ApproveButtonState.Approved) {
                    setButtonState(SwapButtonState.Swap)
                  }
                  getMinimumAmount(val, CurrencySide.FROM_CURRENCY)
                  setToInputValue(val)
                }}
                showBalance={true}
                showMax={true}
                tokenList={tokenList}
                isLoading={tokenListLoading}
                onSelectToken={token => {
                  if (token !== fromCurrency) {
                    setToInputValue('')
                    setFromInputValue('')
                    setToCurrency(token)
                  }
                }}
              />
            </div>
          </>
        ) : (
          <PageWarning caption={'Connect your wallet to swap your tokens!'} />
        )}
        <MainContent />
      </div>
      <SwapSettingsModal
        txDeadline={txDeadline}
        isVisible={showSettingsModal}
        onSlippageChanged={setSlippage}
        onDismiss={() => setShowSettingsModal(false)}
        didChangeTxDeadline={val => setTxDeadline(Number(val))}
      />
      <SwapTransactionModal
        isVisible={showModal}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        fromAmount={fromInputValue}
        toAmount={toInputValue}
        minimumAmount={toMinimumAmount || '0'}
        isLoadingMinimumAmount={isLoadingMinimumAmount}
        price={price || 0}
        isLoadingPrice={isLoadingPrice}
        onSwap={async () => {
          try {
            const txn = await swapToken(fromInputValue, txDeadline, slippage)
            if (txn) {
              setTxhash(txn.hash)
              setSwapTransactionModalState(ModalState.Successful)
            }

            if (txn === 4001 || !txn) {
              setSwapTransactionModalState(ModalState.NotConfirmed)
            }
            // if (
            //   txn.code === ProviderErrorCode.USER_DENIED_REQUEST_ACCOUNTS ||
            //   txn.code === ProviderErrorCode.USER_DENIED_REQUEST_SIGNATURE
            // ) {
            //   setShowModal(false)
            //   setSwapTransactionModalState(ModalState.NotConfirmed)
            //   setErrorObject(txn)
            //   setButtonState(SwapButtonState.Swap)
            // }
          } catch (e) {
            console.error('Error catched! ', e)
            setShowModal(false)
            setSwapTransactionModalState(ModalState.NotConfirmed)
            setErrorObject(e)
            setButtonState(SwapButtonState.Swap)
          }
        }}
        onPriceUpdate={() => {
          setTimeLeft(60)
          getMinimumAmount(fromInputValue, CurrencySide.TO_CURRENCY)
          getPrice()
        }}
        onDismiss={() => {
          setButtonState(SwapButtonState.Swap)
          setShowModal(false)
        }}
        isExpired={isExpired}
        setIsExpired={setIsExpired}
        timeLeft={timeLeft}
        swapTransactionModalState={swapTransactionModalState}
        setSwapTransactionModalState={setSwapTransactionModalState}
        txnHash={txhash}
        chainId={chainId as number}
      />
      {errorObject && (
        <ErrorModal
          isVisible={errorObject !== undefined}
          onDismiss={() => setErrorObject(undefined)}
          errorObject={errorObject}
        />
      )}
    </>
  )
}

export default SwapPanel
