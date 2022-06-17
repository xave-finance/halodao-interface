import React, { useEffect, useState } from 'react'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { ApprovalState } from 'hooks/useApproveCallback'
import { PoolData } from '../models/PoolData'
import { JSBI, TokenAmount } from '@halodao/sdk'
import { parseEther } from 'ethers/lib/utils'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { useTranslation } from 'react-i18next'
import useTokenAllowance from 'halo-hooks/tokens/useTokenAllowance'
import { MetamaskErrorCode } from 'constants/errors'
import InlineErrorContent from 'components/Tailwind/ErrorContent/InlineErrorContent'
import { useActiveWeb3React } from '../../../../hooks'
import { useCurrencyBalance } from '../../../../state/wallet/hooks'
import { HaloError } from 'utils/errors/HaloError'

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
  const [error, setError] = useState<any | undefined>(undefined)
  const { account } = useActiveWeb3React()
  const currencyBalance0 = useCurrencyBalance(account ?? undefined, pool.token0)?.toSignificant(6)
  const currencyBalance1 = useCurrencyBalance(account ?? undefined, pool.token1)?.toSignificant(6)

  const { previewDepositGivenBase, previewDepositGivenQuote } = useAddRemoveLiquidity(
    pool.address,
    pool.token0,
    pool.token1
  )

  const baseTokenAmount = new TokenAmount(pool.token0, JSBI.BigInt(parseEther(baseInput !== '' ? baseInput : '0')))
  const [baseApproveState, baseApproveCallback] = useTokenAllowance(baseTokenAmount, pool.address)
  const quoteTokenAmount = new TokenAmount(pool.token1, JSBI.BigInt(parseEther(quoteInput !== '' ? quoteInput : '0')))
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
    setError(undefined)

    if (val !== '') {
      try {
        const { base, quote } = await previewDepositGivenBase(val, pool.rates.token0, pool.weights.token0)
        setQuoteInput(quote)
        onQuoteAmountChanged(quote)

        if (parseEther(base).gt(parseEther(val))) {
          console.error('estimate > base')
          setError(new HaloError(t('error-liquidity-estimates-changed')))
        }
      } catch (e) {
        if ((e as any).code === MetamaskErrorCode.Reverted) {
          setError(new HaloError(t('error-vm-exception')))
        } else {
          setError(e)
        }
      }
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
    setError(undefined)

    if (val !== '') {
      try {
        const { base, quote } = await previewDepositGivenQuote(val)
        setBaseInput(base)
        onBaseAmountChanged(base)

        if (parseEther(quote).gt(parseEther(val))) {
          console.error('estimate > quote')
          setError(new HaloError(t('error-liquidity-estimates-changed')))
        }
      } catch (e) {
        if ((e as any).code === MetamaskErrorCode.Reverted) {
          setError(new HaloError(t('error-vm-exception')))
        } else {
          setError(e)
        }
      }
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

      {(!baseApproved || !quoteApproved) && isAddLiquidityEnabled && (
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
                  currencyBalance0 === '0'
                    ? ApproveButtonState.Disabled
                    : baseApproveState === ApprovalState.PENDING
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
                  currencyBalance1 === '0'
                    ? ApproveButtonState.Disabled
                    : quoteApproveState === ApprovalState.PENDING
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
            error !== undefined
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

      {error && (
        <div className="mt-2">
          <InlineErrorContent error={error} />
        </div>
      )}
    </>
  )
}

export default MultiSidedLiquidity
