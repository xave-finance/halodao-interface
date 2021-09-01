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
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useZap } from 'halo-hooks/amm/useZap'
import { useSwap } from 'halo-hooks/amm/useSwap'

enum AddLiquityModalState {
  NotConfirmed,
  InProgress,
  Successful
}

interface AddLiquityModalProps {
  isMultisided: boolean
  isZappingFromBase?: boolean
  pool: PoolData
  baseAmount?: string
  quoteAmount?: string
  zapAmount?: string
  slippage: string
  isVisible: boolean
  onDismiss: () => void
}

const AddLiquityModal = ({
  isMultisided,
  isZappingFromBase,
  pool,
  baseAmount,
  quoteAmount,
  zapAmount,
  slippage,
  isVisible,
  onDismiss
}: AddLiquityModalProps) => {
  const { chainId } = useActiveWeb3React()
  const currentBlockTime = useCurrentBlockTimestamp()
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

  const {
    calcSwapAmountForZapFromBase,
    calcSwapAmountForZapFromQuote,
    calcMaxDepositAmountGivenQuote,
    zapFromBase,
    zapFromQuote
  } = useZap(pool.address, pool.token0, pool.token1)
  const { viewOriginSwap, viewTargetSwap } = useSwap(pool)
  const { deposit } = useAddRemoveLiquidity(pool.address, pool.token0, pool.token1)

  /**
   * Helper function to calculate tx deadline
   **/
  const futureTime = () => {
    if (currentBlockTime) {
      return currentBlockTime.add(60).toNumber()
    } else {
      return new Date().getTime() + 60
    }
  }

  /**
   * Main logic for updating confirm add liquidity UI
   **/
  const calculate = async () => {
    if (!isVisible) return
    if (isMultisided && (!baseAmount || !quoteAmount || baseAmount === '' || quoteAmount === '')) return
    if (!isMultisided && (!zapAmount || zapAmount === '')) return

    let baseTokenAmount = 0
    let quoteTokenAmount = 0

    if (isMultisided) {
      baseTokenAmount = Number(baseAmount)
      quoteTokenAmount = Number(quoteAmount)
    } else {
      if (isZappingFromBase) {
        const swapAmount = await calcSwapAmountForZapFromBase(zapAmount!)
        quoteTokenAmount = Number(await viewOriginSwap(swapAmount))
        baseTokenAmount = Number(zapAmount) - Number(swapAmount)
      } else {
        const swapAmount = await calcSwapAmountForZapFromQuote(zapAmount!)
        baseTokenAmount = Number(await viewTargetSwap(swapAmount))
        quoteTokenAmount = Number(zapAmount) - Number(swapAmount)
      }
    }

    setTokenAmounts([baseTokenAmount, quoteTokenAmount])

    const { maxDeposit, lpAmount } = await calcMaxDepositAmountGivenQuote(`${quoteTokenAmount}`)
    setDepositAmount(maxDeposit)

    const maxLpAmount = Number(lpAmount)
    setLpAmount({
      target: maxLpAmount,
      min: maxLpAmount - maxLpAmount * (slippage !== '' ? Number(slippage) / 100 : 0)
    })

    const basePrice = 1 * (pool.rates.token0 * 100) * (pool.weights.token0 / pool.weights.token1)
    const quotePrice =
      (1 * (pool.rates.token1 * 100) * (pool.weights.token1 / pool.weights.token0)) / (pool.rates.token0 * 100)
    setTokenPrices([basePrice, quotePrice])

    setPoolShare(maxLpAmount / pool.pooled.total)
  }

  useEffect(() => {
    if (isVisible) calculate()
  }, [isVisible]) //eslint-disable-line

  const dismissGracefully = () => {
    setState(AddLiquityModalState.NotConfirmed)
    setTxHash('')
    onDismiss()
  }

  /**
   * Multi-sided add liquidity logic
   **/
  const confirmDeposit = async () => {
    setState(AddLiquityModalState.InProgress)
    try {
      const deadline = futureTime()
      const tx = await deposit(parseEther(depositAmount), deadline)
      setTxHash(tx.hash)
      await tx.wait()
      setState(AddLiquityModalState.Successful)
    } catch (err) {
      console.error(err)
      setTxHash('')
      setState(AddLiquityModalState.NotConfirmed)
    }
  }

  /**
   * Single-sided add liquidity logic
   **/
  const confirmZap = async () => {
    setState(AddLiquityModalState.InProgress)
    try {
      const deadline = futureTime()
      const func = isZappingFromBase ? zapFromBase : zapFromQuote
      console.log('zapAmount: ', zapAmount)
      const tx = await func(zapAmount!, deadline, parseEther(`${lpAmount.min}`))
      setTxHash(tx.hash)
      await tx.wait()
      setState(AddLiquityModalState.Successful)
    } catch (err) {
      console.error(err)
      setTxHash('')
      setState(AddLiquityModalState.NotConfirmed)
    }
  }

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg">You will receive</div>
          <div className="mt-4 font-semibold text-2xl">{formatNumber(lpAmount.target, NumberFormat.long)} HLP</div>
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
              <div>
                {formatNumber(tokenAmounts[0], NumberFormat.long)} {pool.token0.symbol}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">{pool.token1.symbol} Deposited</div>
              <div>
                {formatNumber(tokenAmounts[1], NumberFormat.long)} {pool.token1.symbol}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">Rates</div>
              <div>
                <div>
                  1 {pool.token0.symbol} = {formatNumber(tokenPrices[0])} {pool.token1.symbol}
                </div>
                <div>
                  1 {pool.token1.symbol} = {formatNumber(tokenPrices[1])} {pool.token0.symbol}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold">Share of Pool</div>
              <div>{formatNumber(poolShare, NumberFormat.percent)}</div>
            </div>
          </div>
          <PrimaryButton
            title="Confirm Supply"
            state={PrimaryButtonState.Enabled}
            onClick={() => {
              isMultisided ? confirmDeposit() : confirmZap()
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
          Adding{' '}
          <b>
            {formatNumber(Number(baseAmount))} {pool.token0.symbol}
          </b>{' '}
          and{' '}
          <b>
            {formatNumber(Number(quoteAmount))} {pool.token1.symbol}
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
      {state === AddLiquityModalState.NotConfirmed && <ConfirmContent />}
      {state === AddLiquityModalState.InProgress && <InProgressContent />}
      {state === AddLiquityModalState.Successful && <SuccessContent />}
    </BaseModal>
  )
}

export default AddLiquityModal
