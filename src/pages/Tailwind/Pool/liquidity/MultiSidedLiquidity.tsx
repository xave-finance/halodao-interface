import React, { useEffect, useState } from 'react'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonType, PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { PoolData } from '../models/PoolData'
import { useZap } from 'halo-hooks/amm/useZap'
import { TokenAmount, JSBI } from '@sushiswap/sdk'
import { parseEther } from 'ethers/lib/utils'

enum AddLiquidityState {
  NoAmount,
  InsufficientBalance,
  NotApproved,
  Approved,
  Depositing
}

interface MultiSidedLiquidityProps {
  pool: PoolData
  balances: Array<TokenAmount | undefined>
  onBaseAmountChanged: (baseAmount: string) => void
  onQuoteAmountChanged: (quoteAmount: string) => void
  onDeposit: () => void
}

const MultiSidedLiquidity = ({
  pool,
  balances,
  onBaseAmountChanged,
  onQuoteAmountChanged,
  onDeposit
}: MultiSidedLiquidityProps) => {
  const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  const [baseInput, setBaseInput] = useState('')
  const [quoteInput, setQuoteInput] = useState('')

  const { calcQuoteAmountGivenBase, calcBaseAmountGivenQuote } = useZap(pool.address, pool.token0, pool.token1)

  const baseTokenAmount = new TokenAmount(pool.token0, JSBI.BigInt(parseEther(baseInput !== '' ? baseInput : '0')))
  const [baseApproveState, baseApproveCallback] = useApproveCallback(baseTokenAmount, pool.address)
  const quoteTokenAmount = new TokenAmount(pool.token1, JSBI.BigInt(parseEther(quoteInput !== '' ? quoteInput : '0')))
  const [quoteApproveState, quoteApproveCallback] = useApproveCallback(quoteTokenAmount, pool.address)
  const baseApproved = baseApproveState === ApprovalState.APPROVED
  const quoteApproved = quoteApproveState === ApprovalState.APPROVED

  /**
   * Update quote amount upon entering base amount
   **/
  const onBaseInputUpdate = async (val: string) => {
    setBaseInput(val)
    onBaseAmountChanged(val)

    if (val !== '') {
      const [estimatedQuote] = await calcQuoteAmountGivenBase(val)
      setQuoteInput(estimatedQuote)
      onQuoteAmountChanged(estimatedQuote)
    } else {
      setQuoteInput('')
    }
  }

  /**
   * Update base amount upon entering quote amount
   **/
  const onQuoteInputUpdate = async (val: string) => {
    setQuoteInput(val)
    onQuoteAmountChanged(val)

    if (val !== '') {
      const [estimatedBase] = await calcBaseAmountGivenQuote(val)
      setBaseInput(estimatedBase)
      onBaseAmountChanged(estimatedBase)
    } else {
      setBaseInput('')
    }
  }

  /**
   * Logic for updating "Supply" button
   **/
  useEffect(() => {
    if (baseInput !== '' && quoteInput !== '') {
      const baseBalance = balances[0] ? Number(balances[0].toExact()) : 0
      const quoteBalance = balances[1] ? Number(balances[1]?.toExact()) : 0

      if (baseBalance < Number(baseInput) || quoteBalance < Number(quoteInput)) {
        setMainState(AddLiquidityState.InsufficientBalance)
      } else if (!baseApproved || !quoteApproved) {
        setMainState(AddLiquidityState.NotApproved)
      } else {
        setMainState(AddLiquidityState.Approved)
      }
    } else {
      setMainState(AddLiquidityState.NoAmount)
    }
  }, [baseInput, quoteInput, baseApproved, quoteApproved, balances])

  return (
    <>
      <div className="mt-2">
        <CurrencyInput
          canSelectToken={false}
          currency={pool.token0}
          value={baseInput}
          didChangeValue={val => onBaseInputUpdate(val)}
          showBalance={true}
          showMax={true}
        />
      </div>
      <div className="mt-4">
        <CurrencyInput
          canSelectToken={false}
          currency={pool.token1}
          value={quoteInput}
          didChangeValue={val => onQuoteInputUpdate(val)}
          showBalance={true}
          showMax={true}
        />
      </div>

      {(!baseApproved || !quoteApproved) && (
        <div className="mt-4 flex space-x-4">
          {!baseApproved && (
            <div className={!quoteApproved ? 'w-1/2' : 'flex-1'}>
              <ApproveButton
                title={
                  baseApproveState === ApprovalState.PENDING
                    ? `Approving ${pool.token0.symbol}`
                    : `Approve ${pool.token0.symbol}`
                }
                state={
                  baseApproveState === ApprovalState.PENDING
                    ? ApproveButtonState.Approving
                    : ApproveButtonState.NotApproved
                }
                onClick={baseApproveCallback}
              />
            </div>
          )}
          {!quoteApproved && (
            <div className={!baseApproved ? 'w-1/2' : 'flex-1'}>
              <ApproveButton
                title={
                  quoteApproveState === ApprovalState.PENDING
                    ? `Approving ${pool.token1.symbol}`
                    : `Approve ${pool.token1.symbol}`
                }
                state={
                  quoteApproveState === ApprovalState.PENDING
                    ? ApproveButtonState.Approving
                    : ApproveButtonState.NotApproved
                }
                onClick={quoteApproveCallback}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-2">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title={
            mainState === AddLiquidityState.NoAmount
              ? 'Enter an amount'
              : mainState === AddLiquidityState.InsufficientBalance
              ? 'Insufficient Balance'
              : 'Supply'
          }
          state={
            mainState === AddLiquidityState.Approved
              ? PrimaryButtonState.Enabled
              : mainState === AddLiquidityState.Depositing
              ? PrimaryButtonState.InProgress
              : PrimaryButtonState.Disabled
          }
          onClick={onDeposit}
        />
      </div>
    </>
  )
}

export default MultiSidedLiquidity
