import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SwitchIcon from 'assets/svg/switch-swap-icon.svg'
// import SettingsIcon from 'assets/svg/cog-icon.svg'
import { useWalletModalToggle } from '../../../state/application/hooks'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import { SwapButtonState } from '../../../constants/buttonStates'
import PageWarning from 'components/Tailwind/Layout/PageWarning'
import ErrorModal from 'components/Tailwind/Modals/ErrorModal'
import useTokenList from 'halo-hooks/amm-v2/useTokenList'
import FeatureNotSupported from 'components/Tailwind/Panels/FeatureNotSupported'
import useSwap from 'halo-hooks/amm-v2/useSwap'
import { SwapTypes } from '@balancer-labs/sdk'
import { Web3Provider } from '@ethersproject/providers'
import InlineErrorContent from 'components/Tailwind/ErrorContent/InlineErrorContent'

const SwapPanel = () => {
  const { account, chainId } = useWeb3React<Web3Provider>()
  const toggleWalletModal = useWalletModalToggle()
  const { tokenList, tokenListLoading, tokenListError } = useTokenList()

  const [fromCurrency, setFromCurrency] = useState(tokenList.length > 1 ? tokenList[1] : undefined)
  const [toCurrency, setToCurrency] = useState(tokenList.length > 0 ? tokenList[0] : undefined)
  const { previewSwap, swap } = useSwap(fromCurrency, toCurrency)
  const [fromInputValue, setFromInputValue] = useState('')
  const [toInputValue, setToInputValue] = useState('')
  const [swapButtonState, setSwapButtonState] = useState(SwapButtonState.EnterAmount)
  const [minorError, setMinorError] = useState<any>(undefined)
  const [criticalError, setCriticalError] = useState<any>(undefined)

  /**
   * State management
   */
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
    if (!fromCurrency && tokenList.length > 0) {
      setFromCurrency(tokenList[0])
    }
    if (!toCurrency && tokenList.length > 1) {
      setToCurrency(tokenList[1])
    }
  }, [tokenList, fromCurrency, toCurrency])

  useEffect(() => {
    if (
      (fromInputValue === '' && toInputValue === '') ||
      (Number(fromInputValue) === 0 && Number(toInputValue) === 0)
    ) {
      setSwapButtonState(SwapButtonState.EnterAmount)
    } else {
      setSwapButtonState(SwapButtonState.Swap)
    }
  }, [fromInputValue, toInputValue])

  /**
   * Action handlers
   */
  const onInputChange = async (amount: string, isFromCurrency: boolean) => {
    if (!fromCurrency || !toCurrency) return
    let swapType = isFromCurrency ? SwapTypes.SwapExactIn : SwapTypes.SwapExactOut

    try {
      const amounts = await previewSwap(amount, swapType)

      if (isFromCurrency) {
        setToInputValue(amounts[1])
      } else {
        setFromInputValue(amounts[0])
      }
    } catch (e) {
      setMinorError(e)
    }
  }

  const onSwap = async () => {
    if (!fromCurrency || !toCurrency) return
    setSwapButtonState(SwapButtonState.Confirming)

    try {
      await swap(fromInputValue, SwapTypes.SwapExactIn)
    } catch (e) {
      console.error('Swap error:', e)
      setCriticalError(e)
    } finally {
      setSwapButtonState(SwapButtonState.Swap)
    }
  }

  /**
   * Account not connected
   */
  if (!account) {
    return (
      <div className="w-full bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
        <PageWarning caption={'Connect your wallet to swap your tokens!'} />
        <div className="mt-2">
          <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
        </div>
      </div>
    )
  }

  /**
   * Unable to fetch token list or empty token list
   */
  if (!tokenListLoading && (tokenList.length === 0 || tokenListError)) {
    return <FeatureNotSupported isIsolated={true} />
  }

  return (
    <>
      <div className="w-full bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
        <div className="flex flex:row mb-4">
          <div className="w-1/2 flex justify-start">
            <p className="font-semibold text-secondary-alternate">From</p>
          </div>
          <div className="w-1/2 flex justify-end cursor-pointer">
            {/* <img src={SettingsIcon} alt="Settings" onClick={() => setShowSettingsModal(true)} /> */}
          </div>
        </div>

        <div className="mt-2">
          <CurrencyInput
            currency={fromCurrency}
            value={fromInputValue}
            canSelectToken={true}
            didChangeValue={async val => {
              setFromInputValue(val)
              onInputChange(val, true)
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
              setToInputValue(val)
              onInputChange(val, false)
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

        <div className="mt-4">
          <PrimaryButton
            type={PrimaryButtonType.Gradient}
            title="Swap"
            state={
              swapButtonState === SwapButtonState.Confirming
                ? PrimaryButtonState.InProgress
                : [SwapButtonState.EnterAmount].includes(swapButtonState)
                ? PrimaryButtonState.Disabled
                : PrimaryButtonState.Enabled
            }
            onClick={onSwap}
          />
        </div>

        {minorError && <InlineErrorContent errorObject={minorError} />}
      </div>

      {criticalError && (
        <ErrorModal
          isVisible={criticalError !== undefined}
          onDismiss={() => setCriticalError(undefined)}
          errorObject={criticalError}
        />
      )}
    </>
  )
}

export default SwapPanel
