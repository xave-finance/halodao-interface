import React, { useEffect, useState } from 'react'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonType, PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { PoolData } from '../models/PoolData'
import { useZap } from 'halo-hooks/amm/useZap'
import { TokenAmount, JSBI } from '@sushiswap/sdk'
import { parseEther } from 'ethers/lib/utils'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'

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
  onIsGivenBaseChanged: (isGivenBase: boolean) => void
}

const MultiSidedLiquidity = ({
  pool,
  balances,
  onBaseAmountChanged,
  onQuoteAmountChanged,
  onDeposit,
  onIsGivenBaseChanged
}: MultiSidedLiquidityProps) => {
  const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  const [baseInput, setBaseInput] = useState('')
  const [quoteInput, setQuoteInput] = useState('')

  const { calcMaxDepositAmountGivenBase } = useZap(pool.address, pool.token0, pool.token1)
  const { previewDepositGivenBase, previewDepositGivenQuote } = useAddRemoveLiquidity(
    pool.address,
    pool.token0,
    pool.token1
  )

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
    console.log('onBaseInputUpdate ', val)
    setBaseInput(val)
    onBaseAmountChanged(val)
    onIsGivenBaseChanged(true)

    let zeroStr = 0,
      valIsZero = false
    try {
      zeroStr = parseFloat(val)
      console.log('zeroStr ', zeroStr)
      if (zeroStr == 0) valIsZero = true
    } catch (err) {
      console.log('zero check failed')
    }

    if (val !== '' && !valIsZero) {
      let estimatedQuote = ''
      if (pool.pooled.total <= 1) {
        console.log('liquidity is < 1')
        const { quoteAmount } = await calcMaxDepositAmountGivenBase(val)
        estimatedQuote = quoteAmount
      } else {
        console.log('liquidity is > 1')
        const { base, quote } = await previewDepositGivenBase(val, pool.rates.token0, pool.weights.token0)
        try {
          const numberVal = parseFloat(val)
          console.log('numberVal ', numberVal)
          const numberBase = parseFloat(base)
          console.log('numberBase ', numberBase)
          const numberQuote = parseFloat(quote)
          const rateOfErr = numberVal / numberBase
          console.log('rateOfErr ', rateOfErr)
          const quoteAdjustedForErr = numberQuote * rateOfErr
          console.log('quoteAdjustedForErr ', quoteAdjustedForErr)
          estimatedQuote = quoteAdjustedForErr.toString()
          console.log('estimatedQuote adjusted for err ', estimatedQuote)
        } catch (err) {
          console.log('onBaseInputUpdate: quote normalization failed, not changing quote returned by viewDeposit')
          estimatedQuote = quote
          console.log('estimatedQuote NOT adjusted for err ', estimatedQuote)
        }
      }
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
    onIsGivenBaseChanged(false)

    let zeroStr = 0,
      valIsZero = false
    try {
      zeroStr = parseFloat(val)
      console.log('zeroStr ', zeroStr)
      if (zeroStr == 0) valIsZero = true
    } catch (err) {
      console.log('zero check failed')
    }

    if (val !== '' && !valIsZero) {
      // const { baseAmount } = await calcMaxDepositAmountGivenQuote(val)
      // setBaseInput(baseAmount)
      // onBaseAmountChanged(baseAmount)

      const { base, quote } = await previewDepositGivenQuote(val)

      let estimatedBase = ''

      try {
        const numberVal = parseFloat(val)
        console.log('numberVal ', numberVal)
        const numberQuote = parseFloat(quote)
        console.log('numberQuote ', numberQuote)
        const numberBase = parseFloat(base)
        const rateOfErr = numberVal / numberQuote
        console.log('rateOfErr ', rateOfErr)
        const baseAdjustedForErr = numberBase * rateOfErr
        console.log('baseAdjustedForErr ', baseAdjustedForErr)
        estimatedBase = baseAdjustedForErr.toString()
        console.log('estimatedBase adjusted for err ', estimatedBase)
      } catch (err) {
        console.log('onBaseInputUpdate: quote normalization failed, not changing quote returned by viewDeposit')
        estimatedBase = base
        console.log('estimatedBase NOT adjusted for err ', estimatedBase)
      }

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
