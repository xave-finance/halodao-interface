import React, { useCallback, useEffect, useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import { BigNumber } from 'ethers'
import { PoolData } from '../models/PoolData'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { getExplorerLink } from 'utils'
import { useActiveWeb3React } from 'hooks'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

export enum AddLiquidityMode {
  MultiSided,
  SingleSided
}

enum AddLiquityModalState {
  NotConfirmed,
  InProgress,
  Successful
}

interface AddLiquityModalProps {
  mode: AddLiquidityMode
  pool: PoolData
  token0Amount: string
  token1Amount: string
  slippage: string
  isVisible: boolean
  onDismiss: () => void
}

const AddLiquityModal = ({
  mode,
  pool,
  token0Amount,
  token1Amount,
  slippage,
  isVisible,
  onDismiss
}: AddLiquityModalProps) => {
  const { chainId } = useActiveWeb3React()
  const currentBlockTime = useCurrentBlockTimestamp()
  const [state, setState] = useState(AddLiquityModalState.NotConfirmed)
  const [lpAmount, setLpAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const { viewDeposit, deposit } = useAddRemoveLiquidity(pool.address, pool.token0, pool.token1)

  const amount0 = Number(token0Amount)
  const amount1 = Number(token1Amount)
  const amount0Price = 1 * (pool.rates.token0 * 100) * (pool.weights.token0 / pool.weights.token1)
  const amount1Price =
    (1 * (pool.rates.token1 * 100) * (pool.weights.token1 / pool.weights.token0)) / (pool.rates.token0 * 100)

  const targetLpAmount = lpAmount !== '' ? Number(formatEther(lpAmount)) : 0
  const minLpAmout = targetLpAmount - targetLpAmount * (slippage !== '' ? Number(slippage) / 100 : 0)
  const poolShare = targetLpAmount / pool.pooled.total

  const previewDeposit = useCallback(async () => {
    if (!isVisible) return
    if (amount0 === 0 || amount1 === 0) return

    const totalNumeraire =
      amount0 * (pool.rates.token0 * 100) * (pool.weights.token0 / pool.weights.token1) +
      amount1 * (pool.rates.token1 * 100) * (pool.weights.token1 / pool.weights.token0)

    const amount = await viewDeposit(parseEther(`${totalNumeraire}`))
    setLpAmount(amount.toString())
  }, [isVisible, pool, amount0, amount1, viewDeposit])

  useEffect(() => {
    previewDeposit()
  }, [previewDeposit])

  const dismissGracefully = () => {
    setState(AddLiquityModalState.NotConfirmed)
    setTxHash('')
    onDismiss()
  }

  const confirmDeposit = async () => {
    setState(AddLiquityModalState.InProgress)

    try {
      const deadline = currentBlockTime ? currentBlockTime.add(60) : BigNumber.from(60)
      const tx = await deposit(BigNumber.from(lpAmount), deadline)
      setTxHash(tx.hash)
      await tx.wait()
      setState(AddLiquityModalState.Successful)
    } catch (err) {
      setTxHash('')
      setState(AddLiquityModalState.NotConfirmed)
    }
  }

  const ConfirmContent = () => {
    return (
      <>
        <div className="bg-primary-lightest p-4">
          <div className="font-semibold text-lg">You will receive</div>
          <div className="mt-4 font-semibold text-2xl">{formatNumber(targetLpAmount)} LPT</div>
          <div className="mt-1 text-xl">
            {pool.token0.symbol}/{pool.token1.symbol} Pool Tokens
          </div>
          {mode === AddLiquidityMode.SingleSided && (
            <div className="mt-4 text-sm italic">
              Output is estimated. You will receive at least{' '}
              <span className="font-bold">{formatNumber(minLpAmout)} amount of LP</span> or the transaction will revert.
            </div>
          )}
        </div>
        <div className="bg-white px-4 pb-4">
          <div className="py-4 text-sm">
            <div className="flex justify-between mb-2">
              <div className="font-bold">{pool.token0.symbol} Deposited</div>
              <div>
                {formatNumber(amount0)} {pool.token0.symbol}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">{pool.token1.symbol} Deposited</div>
              <div>
                {formatNumber(amount1)} {pool.token1.symbol}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="font-bold">Rates</div>
              <div>
                <div>
                  1 {pool.token0.symbol} = {formatNumber(amount0Price)} {pool.token1.symbol}
                </div>
                <div>
                  1 {pool.token1.symbol} = {formatNumber(amount1Price)} {pool.token0.symbol}
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
              confirmDeposit()
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
            {formatNumber(Number(token0Amount))} {pool.token0.symbol}
          </b>{' '}
          and{' '}
          <b>
            {formatNumber(Number(token1Amount))} {pool.token1.symbol}
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
