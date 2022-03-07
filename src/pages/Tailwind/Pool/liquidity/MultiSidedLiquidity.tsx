import React, { useEffect, useState } from 'react'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonType, PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { ApprovalState } from 'hooks/useApproveCallback'
import { PoolData } from '../models/PoolData'
import { TokenAmount, JSBI } from '@halodao/sdk'
import { formatUnits, parseEther } from 'ethers/lib/utils'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { useTranslation } from 'react-i18next'
import useTokenAllowance from 'halo-hooks/tokens/useTokenAllowance'
import usePoolCalculator from 'halo-hooks/amm-v2/usePoolCalculator'

enum AddLiquidityState {
  NoAmount,
  InsufficientBalance,
  NotApproved,
  Approved,
  Depositing,
  Disabled
}

interface MultiSidedLiquidityProps {
  pool: PoolData
  balances: Array<TokenAmount | undefined>
  onBaseAmountChanged: (baseAmount: string) => void
  onQuoteAmountChanged: (quoteAmount: string) => void
  onDeposit: () => void
  onIsGivenBaseChanged: (isGivenBase: boolean) => void
  isAddLiquidityEnabled: boolean
}

const MultiSidedLiquidity = ({
  pool,
  balances,
  onBaseAmountChanged,
  onQuoteAmountChanged,
  onDeposit,
  onIsGivenBaseChanged,
  isAddLiquidityEnabled
}: MultiSidedLiquidityProps) => {
  const { t } = useTranslation()
  const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  const [baseInput, setBaseInput] = useState('')
  const [quoteInput, setQuoteInput] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const token0 = pool.tokens[0].token
  const token1 = pool.tokens[1].token
  const { calculateOtherTokenIn } = usePoolCalculator({
    tokens: [token0, token1],
    tokenBalances: [pool.tokens[0].balance, pool.tokens[1].balance]
  })

  const { previewDepositGivenBase, previewDepositGivenQuote } = useAddRemoveLiquidity(pool.address, token0, token1)

  const baseTokenAmount = new TokenAmount(token0, JSBI.BigInt(parseEther(baseInput !== '' ? baseInput : '0')))
  const [baseApproveState, baseApproveCallback] = useTokenAllowance(baseTokenAmount, pool.address)
  const quoteTokenAmount = new TokenAmount(token1, JSBI.BigInt(parseEther(quoteInput !== '' ? quoteInput : '0')))
  const [quoteApproveState, quoteApproveCallback] = useTokenAllowance(quoteTokenAmount, pool.address)
  const baseApproved = baseApproveState === ApprovalState.APPROVED
  const quoteApproved = quoteApproveState === ApprovalState.APPROVED

  /**
   * Update quote amount upon entering base amount
   **/
  const onBaseInputUpdate = async (val: string) => {
    setBaseInput(val)
    onBaseAmountChanged(val)
    onIsGivenBaseChanged(true)
    setErrorMessage(undefined)

    if (val !== '') {
      const quoteAmount = await calculateOtherTokenIn(val, 0)
      const quote = formatUnits(quoteAmount, token1.decimals)
      setQuoteInput(quote)
      onQuoteAmountChanged(quote)

      // const { base, quote } = await previewDepositGivenBase(val, pool.tokens[0].rate, pool.tokens[0].weight)
      // setQuoteInput(quote)
      // onQuoteAmountChanged(quote)

      // if (Number(base) > Number(val)) {
      //   setErrorMessage(t('error-liquidity-estimates-changed'))
      // }
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
    setErrorMessage(undefined)

    if (val !== '') {
      const baseAmount = await calculateOtherTokenIn(val, 1)
      const base = formatUnits(baseAmount, token0.decimals)
      setBaseInput(base)
      onBaseAmountChanged(base)

      // const { base, quote } = await previewDepositGivenQuote(val)
      // setBaseInput(base)
      // onBaseAmountChanged(base)

      // if (Number(quote) > Number(val)) {
      //   setErrorMessage(t('error-liquidity-estimates-changed'))
      // }
    } else {
      setBaseInput('')
    }
  }

  /**
   * Logic for updating "Supply" button
   **/
  useEffect(() => {
    if (!isAddLiquidityEnabled) {
      setMainState(AddLiquidityState.Disabled)
    } else if (baseInput !== '' && quoteInput !== '') {
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
  }, [isAddLiquidityEnabled, baseInput, quoteInput, baseApproved, quoteApproved, balances])

  return (
    <>
      <div className="mt-2">
        <CurrencyInput
          canSelectToken={false}
          currency={token0}
          value={baseInput}
          didChangeValue={val => onBaseInputUpdate(val)}
          showBalance={true}
          showMax={true}
        />
      </div>
      <div className="mt-4">
        <CurrencyInput
          canSelectToken={false}
          currency={token1}
          value={quoteInput}
          didChangeValue={val => onQuoteInputUpdate(val)}
          showBalance={true}
          showMax={true}
        />
      </div>

      {(!baseApproved || !quoteApproved) && isAddLiquidityEnabled && (
        <div className="mt-4 flex space-x-4">
          {!baseApproved && (
            <div className={!quoteApproved ? 'w-1/2' : 'flex-1'}>
              <ApproveButton
                title={
                  baseApproveState === ApprovalState.PENDING ? `Approving ${token0.symbol}` : `Approve ${token1.symbol}`
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
                    ? `Approving ${token0.symbol}`
                    : `Approve ${token1.symbol}`
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
            mainState === AddLiquidityState.Disabled
              ? 'Add Liquidity Disabled'
              : mainState === AddLiquidityState.NoAmount
              ? 'Enter an amount'
              : mainState === AddLiquidityState.InsufficientBalance
              ? 'Insufficient Balance'
              : 'Supply'
          }
          state={
            errorMessage !== undefined
              ? PrimaryButtonState.Disabled
              : mainState === AddLiquidityState.Disabled
              ? PrimaryButtonState.Disabled
              : mainState === AddLiquidityState.Approved
              ? PrimaryButtonState.Enabled
              : mainState === AddLiquidityState.Depositing
              ? PrimaryButtonState.InProgress
              : PrimaryButtonState.Disabled
          }
          onClick={onDeposit}
        />
      </div>

      {errorMessage && <div className="mt-2 text-red-600 text-center text-sm">{errorMessage}</div>}
    </>
  )
}

export default MultiSidedLiquidity
