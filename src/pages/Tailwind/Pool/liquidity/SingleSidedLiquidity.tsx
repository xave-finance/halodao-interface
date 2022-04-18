import { TokenAmount, JSBI } from '@halodao/sdk'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonType, PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import { AMM_ZAP_ADDRESS } from '../../../../constants'
import { parseEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState } from 'hooks/useApproveCallback'
import React, { useEffect, useState } from 'react'
import { PoolData } from '../models/PoolData'
import { useZap } from 'halo-hooks/amm/useZap'
import { useSwap } from 'halo-hooks/amm/useSwap'
import useTokenAllowance from 'halo-hooks/tokens/useTokenAllowance'
import { MetamaskRPCErrorCode } from 'constants/errors'
import { useTranslation } from 'react-i18next'

enum AddLiquidityState {
  NoAmount,
  InsufficientBalance,
  NotConfigured,
  NotApproved,
  Approved,
  Depositing,
  Disabled
}

interface SingleSidedLiquidityProps {
  pool: PoolData
  balances: Array<TokenAmount | undefined>
  onZapAmountChanged: (amount: string) => void
  onIsGivenBaseChanged: (isGivenBase: boolean) => void
  onSlippageChanged: (slippage: string) => void
  onDeposit: () => void
  isAddLiquidityEnabled: boolean
}

const SingleSidedLiquidity = ({
  pool,
  balances,
  onZapAmountChanged,
  onIsGivenBaseChanged,
  onSlippageChanged,
  onDeposit,
  isAddLiquidityEnabled
}: SingleSidedLiquidityProps) => {
  const token0 = pool.tokens[0].token
  const token1 = pool.tokens[1].token

  const { t } = useTranslation()
  const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  const [selectedToken, setSelectedToken] = useState(token0)
  const [zapInput, setZapInput] = useState('')
  const [baseAmount, setBaseAmount] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [slippage, setSlippage] = useState('3')
  const [isGivenBase, setIsGivenBase] = useState(true)

  const { calcSwapAmountForZapFromBase, calcSwapAmountForZapFromQuote } = useZap(pool.address, token0, token1)
  const { viewOriginSwap, viewTargetSwap } = useSwap(pool)

  const { chainId } = useActiveWeb3React()
  const zapAddress = chainId ? AMM_ZAP_ADDRESS[chainId] : undefined

  const baseTokenAmount = new TokenAmount(token0, JSBI.BigInt(parseEther(baseAmount !== '' ? baseAmount : '0')))
  const quoteTokenAmount = new TokenAmount(token1, JSBI.BigInt(parseEther(quoteAmount !== '' ? quoteAmount : '0')))
  const [baseZapApproveState, baseZapApproveCallback] = useTokenAllowance(baseTokenAmount, zapAddress)
  const [quoteZapApproveState, quoteZapApproveCallback] = useTokenAllowance(quoteTokenAmount, zapAddress)
  const baseZapApproved = baseZapApproveState === ApprovalState.APPROVED
  const quoteZapApproved = quoteZapApproveState === ApprovalState.APPROVED
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const onBaseInputUpdate = async (val: string) => {
    setZapInput(val)
    onZapAmountChanged(val)
    setErrorMessage(undefined)
    console.log('errorMessage', errorMessage)
    if (val === '') return

    let calcBaseAmount = 0
    let calcQuoteAmount = 0
    const zapFromBase = selectedToken === token0

    if (zapFromBase) {
      try {
        const swapAmount = await calcSwapAmountForZapFromBase(val)
        calcQuoteAmount = Number(await viewOriginSwap(swapAmount))
        calcBaseAmount = Number(val) - Number(swapAmount)
      } catch (e) {
        console.log('error calculate', e)
        if ((e as any).code === MetamaskRPCErrorCode.reverted) {
          setErrorMessage(t('error-vm-exception'))
        } else {
          setErrorMessage((e as any).message)
        }
      }
    } else {
      try {
        const swapAmount = await calcSwapAmountForZapFromQuote(val)
        calcBaseAmount = Number(await viewTargetSwap(swapAmount))
        calcQuoteAmount = Number(val) - Number(swapAmount)
      } catch (e) {
        console.log('error calculate', e)
        setErrorMessage((e as any).message)
      }
    }

    setBaseAmount(calcBaseAmount.toString())
    setQuoteAmount(calcQuoteAmount.toString())
    console.log('errorMessageAfter', errorMessage)
  }

  /**
   * Logic for updating "Supply" button
   **/
  useEffect(() => {
    if (!isAddLiquidityEnabled) {
      setMainState(AddLiquidityState.Disabled)
    } else if (zapInput !== '') {
      const baseBalance = balances[0] ? Number(balances[0].toExact()) : 0
      const quoteBalance = balances[1] ? Number(balances[1]?.toExact()) : 0

      if ((isGivenBase && baseBalance < Number(baseAmount)) || (!isGivenBase && quoteBalance < Number(quoteAmount))) {
        setMainState(AddLiquidityState.InsufficientBalance)
      } else if (!baseZapApproved || !quoteZapApproved) {
        setMainState(AddLiquidityState.NotApproved)
      } else if (slippage === '') {
        setMainState(AddLiquidityState.NotConfigured)
      } else {
        setMainState(AddLiquidityState.Approved)
      }
    } else {
      setMainState(AddLiquidityState.NoAmount)
    }
  }, [
    isAddLiquidityEnabled,
    zapInput,
    baseZapApproved,
    quoteZapApproved,
    balances,
    baseAmount,
    quoteAmount,
    slippage,
    isGivenBase
  ])

  return (
    <>
      <div className="mt-2 text-right italic text-xs text-gray-400 md:hidden">Swaps will be carried out for you</div>

      <div className="mt-4">
        <CurrencyInput
          canSelectToken={true}
          currency={selectedToken}
          value={zapInput}
          didChangeValue={val => onBaseInputUpdate(val)}
          showBalance={true}
          showMax={true}
          tokenList={[token0, token1]}
          onSelectToken={token => {
            setSelectedToken(token)
            onBaseInputUpdate(zapInput)
            const isTokenBase = token === token0
            setIsGivenBase(isTokenBase)
            onIsGivenBaseChanged(isTokenBase)
          }}
        />
      </div>

      <div className="mt-4">
        <SlippageTolerance
          value={slippage}
          didChangeValue={(newSlippage: string) => {
            setSlippage(newSlippage)
            onSlippageChanged(newSlippage)
          }}
        />
      </div>

      {(!baseZapApproved || !quoteZapApproved) && isAddLiquidityEnabled && (
        <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
          {!baseZapApproved && (
            <div className={!quoteZapApproved ? 'w-1/2' : 'flex-1'}>
              <ApproveButton
                title={
                  baseZapApproveState === ApprovalState.PENDING
                    ? `Approving ${token0.symbol}`
                    : `Approve ${token0.symbol}`
                }
                state={
                  baseZapApproveState === ApprovalState.PENDING
                    ? ApproveButtonState.Approving
                    : ApproveButtonState.NotApproved
                }
                onClick={baseZapApproveCallback}
              />
            </div>
          )}
          {!quoteZapApproved && (
            <div className={!baseZapApproved ? 'w-1/2' : 'flex-1'}>
              <ApproveButton
                title={
                  quoteZapApproveState === ApprovalState.PENDING
                    ? `Approving ${token1.symbol}`
                    : `Approve ${token1.symbol}`
                }
                state={
                  quoteZapApproveState === ApprovalState.PENDING
                    ? ApproveButtonState.Approving
                    : ApproveButtonState.NotApproved
                }
                onClick={quoteZapApproveCallback}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title={
            mainState === AddLiquidityState.Disabled
              ? 'Add Liquidity Disabled'
              : mainState === AddLiquidityState.NoAmount
              ? 'Enter an amount'
              : mainState === AddLiquidityState.NotConfigured
              ? 'Configure slippage'
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
          onClick={() => onDeposit()}
        />
        {errorMessage && <div className="mt-4 text-red-600 text-center text-sm">{errorMessage}</div>}
      </div>
    </>
  )
}

export default SingleSidedLiquidity
