import React, { useEffect, useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import { PoolData } from '../models/PoolData'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { getExplorerLink } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { useZap } from 'halo-hooks/amm/useZap'
import { useSwap } from 'halo-hooks/amm/useSwap'
import { useTime } from 'halo-hooks/useTime'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import { ZapErrorCode, ZapErrorMessage, MetamaskErrorCode } from 'constants/errors'

enum AddLiquityModalState {
  NotConfirmed,
  InProgress,
  Successful
}

interface AddLiquityModalProps {
  isMultisided: boolean
  isGivenBase?: boolean
  pool: PoolData
  baseAmount?: string
  quoteAmount?: string
  zapAmount?: string
  slippage: string
  isVisible: boolean
  onDismiss: () => void
  onError: (errorObject: any) => void
}

const AddLiquityModal = ({
  isMultisided,
  isGivenBase,
  pool,
  baseAmount,
  quoteAmount,
  zapAmount,
  slippage,
  isVisible,
  onDismiss,
  onError
}: AddLiquityModalProps) => {
  const { chainId } = useActiveWeb3React()
  const { getFutureTime } = useTime()
  const [state, setState] = useState(AddLiquityModalState.NotConfirmed)
  const [txHash, setTxHash] = useState('')
  const [tokenAmounts, setTokenAmounts] = useState([0, 0])
  const [tokenPrices, setTokenPrices] = useState([0, 0])
  const [lpAmount, setLpAmount] = useState({
    target: 0,
    min: 0
  })
  const [poolShare, setPoolShare] = useState(0)
  const [depositAmount, setDepositAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const { t } = useTranslation()

  const { calcSwapAmountForZapFromBase, calcSwapAmountForZapFromQuote, zapFromBase, zapFromQuote } = useZap(
    pool.address,
    pool.token0,
    pool.token1
  )
  const { viewOriginSwap, viewTargetSwap } = useSwap(pool)
  const { deposit, previewDepositGivenBase, previewDepositGivenQuote } = useAddRemoveLiquidity(
    pool.address,
    pool.token0,
    pool.token1
  )

  /**
   * Main logic for updating confirm add liquidity UI
   **/
  const calculate = async () => {
    if (!isVisible) return
    if (isMultisided && (!baseAmount || !quoteAmount || baseAmount === '' || quoteAmount === '')) return
    if (!isMultisided && (!zapAmount || zapAmount === '')) return

    setIsLoading(true)
    setErrorMessage(undefined)
    let baseTokenAmount = 0
    let quoteTokenAmount = 0

    if (isMultisided) {
      baseTokenAmount = Number(baseAmount)
      quoteTokenAmount = Number(quoteAmount)
    } else {
      if (isGivenBase) {
        try {
          const swapAmount = await calcSwapAmountForZapFromBase(zapAmount!) // eslint-disable-line
          quoteTokenAmount = Number(await viewOriginSwap(swapAmount))
          baseTokenAmount = Number(zapAmount) - Number(swapAmount)
        } catch (e) {
          console.log('error calculate', e)
          if ((e as any).code === MetamaskErrorCode.Reverted) {
            setErrorMessage(t('error-vm-exception'))
          } else {
            setErrorMessage((e as any).message)
          }
        }
      } else {
        try {
          const swapAmount = await calcSwapAmountForZapFromQuote(zapAmount!) // eslint-disable-line
          baseTokenAmount = Number(await viewTargetSwap(swapAmount))
          quoteTokenAmount = Number(zapAmount) - Number(swapAmount)
        } catch (e) {
          console.log('error calculate', e)
          if ((e as any).code === MetamaskErrorCode.Reverted) {
            setErrorMessage(t('error-vm-exception'))
          } else {
            setErrorMessage((e as any).message)
          }
        }
      }
    }

    setTokenAmounts([baseTokenAmount, quoteTokenAmount])

    let res: any
    if (isGivenBase) {
      try {
        res = await previewDepositGivenBase(`${baseTokenAmount}`, pool.rates.token0, pool.weights.token0)

        if (Number(res.base) > Number(baseTokenAmount)) {
          setErrorMessage(t('error-liquidity-estimates-changed'))
        }
      } catch (e) {
        console.log('error calculate', e)
        if ((e as any).code === MetamaskErrorCode.Reverted) {
          setErrorMessage(t('error-vm-exception'))
        } else {
          setErrorMessage((e as any).message)
        }
        onDismiss()
      }
    } else {
      try {
        res = await previewDepositGivenQuote(`${quoteTokenAmount}`)

        if (Number(res.quote) > Number(quoteTokenAmount)) {
          setErrorMessage(t('error-liquidity-estimates-changed'))
        }
      } catch (e) {
        console.log('error calculate', e)
        console.log('error calculate', e)
        if ((e as any).code === MetamaskErrorCode.Reverted) {
          setErrorMessage(t('error-vm-exception'))
        } else {
          setErrorMessage((e as any).message)
        }
        onDismiss()
      }
    }
    if (!res) return

    const maxDeposit = `${res.deposit}`
    const lpAmount = res.lpToken
    const basePrice = Number(res.quote) / Number(res.base)
    const quotePrice = Number(res.base) / Number(res.quote)

    setDepositAmount(maxDeposit)
    setTokenPrices([basePrice, quotePrice])

    const maxLpAmount = Number(lpAmount)
    setLpAmount({
      target: maxLpAmount,
      min: maxLpAmount - maxLpAmount * (slippage !== '' ? Number(slippage) / 100 : 0)
    })

    setPoolShare(maxLpAmount / (pool.pooled.total + maxLpAmount))
    setIsLoading(false)
  }

  useEffect(() => {
    if (isVisible) calculate()
  }, [isVisible]) //eslint-disable-line

  const dismissGracefully = () => {
    setState(AddLiquityModalState.NotConfirmed)
    setTxHash('')
    setTokenAmounts([0, 0])
    setTokenPrices([0, 0])
    setLpAmount({
      target: 0,
      min: 0
    })
    setPoolShare(0)
    setErrorMessage(undefined)
    onDismiss()
  }

  const logGAEvent = () => {
    ReactGA.event({
      category: 'Liquidity',
      action: `Add Liquidity - ${isMultisided ? 'Multisided' : 'Singlesided'}`,
      label: pool.name,
      value: lpAmount.target
    })
  }

  /**
   * Multi-sided add liquidity logic
   **/
  const confirmDeposit = async () => {
    setState(AddLiquityModalState.InProgress)

    try {
      const deadline = getFutureTime()
      const tx = await deposit(parseEther(depositAmount), deadline)
      setTxHash(tx.hash)
      await tx.wait()
      setState(AddLiquityModalState.Successful)
      logGAEvent()
    } catch (err) {
      console.error(err)
      setTxHash('')
      setState(AddLiquityModalState.NotConfirmed)
      onError(err as any)
      onDismiss()
    }
  }

  /**
   * Single-sided add liquidity logic
   **/
  const confirmZap = async () => {
    setState(AddLiquityModalState.InProgress)
    setErrorMessage(undefined)

    try {
      const deadline = getFutureTime()
      const func = isGivenBase ? zapFromBase : zapFromQuote
      const tx = await func(zapAmount!, deadline, parseEther(`${lpAmount.min}`)) // eslint-disable-line
      setTxHash(tx.hash)
      await tx.wait()
      setState(AddLiquityModalState.Successful)
      logGAEvent()
    } catch (err) {
      console.error(err)
      setTxHash('')
      setState(AddLiquityModalState.NotConfirmed)

      if (
        (err as any).code === ZapErrorCode.SlippageTooLow ||
        (err as any).message.includes(ZapErrorMessage.NotEnoughLpAmount)
      ) {
        onError({ message: t('error-liquidity-zap-reverted') })
      } else {
        onError(err as any)
        onDismiss()
      }
    }
  }

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg">You will receive</div>
          <div
            className={`
              ${isLoading && 'animate-pulse bg-primary h-8 w-40'}
              mt-4 font-semibold text-2xl rounded
            `}
          >
            {!isLoading && <>{formatNumber(lpAmount.target, NumberFormat.long)} HLP</>}
          </div>
          <div className="mt-1 text-xl">
            {pool.token0.symbol}/{pool.token1.symbol} Pool Tokens
          </div>
          {!isMultisided && (
            <div className="mt-4 text-sm italic">
              Output is estimated. You will receive at least{' '}
              <span className="font-bold">{formatNumber(lpAmount.min, NumberFormat.long)} amount of LP</span> or the
              transaction will revert.
            </div>
          )}
        </div>
        <div className="bg-white px-4 pb-4">
          <div className="py-4 text-sm">
            <div className="flex justify-between mb-2">
              <div className="font-bold">{pool.token0.symbol} Deposited</div>
              <div className={isLoading ? 'animate-pulse bg-primary h-4 w-36 rounded' : ''}>
                {!isLoading && (
                  <>
                    {formatNumber(tokenAmounts[0], NumberFormat.long)} {pool.token0.symbol}
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">{pool.token1.symbol} Deposited</div>
              <div className={isLoading ? 'animate-pulse bg-primary h-4 w-36 rounded' : ''}>
                {!isLoading && (
                  <>
                    {formatNumber(tokenAmounts[1], NumberFormat.long)} {pool.token1.symbol}
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">Rates</div>
              <div>
                <div className={isLoading ? 'animate-pulse bg-primary h-4 w-52 rounded mb-1' : ''}>
                  {!isLoading && (
                    <>
                      1 {pool.token0.symbol} = {formatNumber(tokenPrices[0])} {pool.token1.symbol}
                    </>
                  )}
                </div>
                <div className={isLoading ? 'animate-pulse bg-primary h-4 w-52 rounded' : ''}>
                  {!isLoading && (
                    <>
                      1 {pool.token1.symbol} = {formatNumber(tokenPrices[1])} {pool.token0.symbol}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold">Share of Pool</div>
              <div className={isLoading ? 'animate-pulse bg-primary h-4 w-24 rounded' : ''}>
                {!isLoading && <>{formatNumber(poolShare, NumberFormat.percent)}</>}
              </div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm Supply"
            state={isLoading || errorMessage !== undefined ? PrimaryButtonState.Disabled : PrimaryButtonState.Enabled}
            onClick={() => {
              isMultisided ? confirmDeposit() : confirmZap()
            }}
          />
          {errorMessage && <div className="mt-4 text-red-600 text-center text-sm">{errorMessage}</div>}
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
          Adding{' '}
          <b>
            {formatNumber(isMultisided ? Number(baseAmount) : tokenAmounts[0])} {pool.token0.symbol}
          </b>{' '}
          and{' '}
          <b>
            {formatNumber(isMultisided ? Number(quoteAmount) : tokenAmounts[1])} {pool.token1.symbol}
          </b>
        </div>
        <div className="text-center text-sm text-gray-500">Confirm this transaction in your wallet</div>
      </div>
    )
  }

  const SuccessContent = () => {
    const explorerLink = chainId ? getExplorerLink(chainId, txHash, 'transaction') : 'https://etherscan.io'
    return (
      <div className="p-4">
        <div className="py-12 flex justify-center">
          <img src={ArrowIcon} alt="Confirmed" />
        </div>
        <div className="text-center font-semibold text-2xl mb-2">Transaction Confirmed</div>
        <div className="text-center">
          <a className="font-semibold text-link" href={explorerLink} target="_blank" rel="noopener noreferrer">
            View on Block Explorer
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
      {state === AddLiquityModalState.NotConfirmed && <ConfirmContent />}
      {state === AddLiquityModalState.InProgress && <InProgressContent />}
      {state === AddLiquityModalState.Successful && <SuccessContent />}
    </BaseModal>
  )
}

export default AddLiquityModal
