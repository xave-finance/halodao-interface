import React, { useEffect, useState } from 'react'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { JSBI, Token, TokenAmount } from '@sushiswap/sdk'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import AddLiquityModal from './AddLiquityModal'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { PoolData } from '../models/PoolData'
import { useTokenBalance, useTokenBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { BigNumber } from 'ethers'
import { useZap } from 'halo-hooks/amm/useZap'
import { useSwap } from 'halo-hooks/amm/useSwap'
import { AMM_ZAP_ADDRESS } from '../../../../constants'
import MultiSidedLiquidity from './MultiSidedLiquidity'
import SingleSidedLiquidity from './SingleSidedLiquidity'

interface AddLiquidityProps {
  pool: PoolData
}

enum AddLiquidityState {
  NoAmount,
  InsufficientBalance,
  NotApproved,
  NotConfigured,
  Ready,
  Depositing
}

const AddLiquidity = ({ pool }: AddLiquidityProps) => {
  const [activeSegment, setActiveSegment] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [baseAmount, setBaseAmount] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [zapAmount, setZapAmount] = useState('')
  const [zapFromBase, setZapFromBase] = useState(false)
  const [slippage, setSlippage] = useState('')

  // const [input0Value, setInput0Value] = useState('')
  // const [input1Value, setInput1Value] = useState('')

  // const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  // const [slippage, setSlippage] = useState('0.1')
  // const [lpAmount, setLpAmount] = useState('')
  // const [selectedToken, setSelectedToken] = useState<Token>(pool.token0)

  // const { viewDeposit } = useAddRemoveLiquidity(pool.address, pool.token0, pool.token1)
  // const {
  //   calcSwapAmountForZapFromBase,
  //   calcSwapAmountForZapFromQuote,
  //   calcQuoteAmountGivenBase,
  //   calcBaseAmountGivenQuote
  // } = useZap(pool.address, pool.token0, pool.token1)
  // const { viewOriginSwap, viewTargetSwap } = useSwap(pool)

  // const token0Amount = new TokenAmount(pool.token0, JSBI.BigInt(parseEther(input0Value !== '' ? input0Value : '0')))
  // const [token0ApproveState, token0ApproveCallback] = useApproveCallback(token0Amount, pool.address)
  // const token1Amount = new TokenAmount(pool.token1, JSBI.BigInt(parseEther(input1Value !== '' ? input1Value : '0')))
  // const [token1ApproveState, token1ApproveCallback] = useApproveCallback(token1Amount, pool.address)

  // const { chainId } = useActiveWeb3React()
  // const zapAddress = chainId ? AMM_ZAP_ADDRESS[chainId] : undefined
  // const zapBaseTokenAmount = new TokenAmount(
  //   pool.token0,
  //   JSBI.BigInt(parseEther(input0Value !== '' ? input0Value : '0'))
  // )
  // const [zapBaseApproveState, zapBaseApproveCallback] = useApproveCallback(zapBaseTokenAmount, zapAddress)
  // const zapQuoteTokenAmount = new TokenAmount(
  //   pool.token1,
  //   JSBI.BigInt(parseEther(input0Value !== '' ? input0Value : '0'))
  // )
  // const [zapQuoteApproveState, zapQuoteApproveCallback] = useApproveCallback(zapQuoteTokenAmount, zapAddress)

  // const showApproveToken0 =
  //   activeSegment === 0
  //     ? input0Value !== '' && token0ApproveState !== ApprovalState.APPROVED
  //     : input0Value !== '' &&
  //       (selectedToken === pool.token0
  //         ? zapBaseApproveState !== ApprovalState.APPROVED
  //         : zapQuoteApproveState !== ApprovalState.APPROVED)
  // const showApproveToken1 = input1Value !== '' && token1ApproveState !== ApprovalState.APPROVED

  const { account } = useActiveWeb3React()
  const tokenBalances = useTokenBalances(account ?? undefined, [pool.token0, pool.token1])
  const balances = [tokenBalances[pool.token0.address], tokenBalances[pool.token1.address]]

  // /**
  //  * Logic for updating "Supply" button
  //  **/
  // useEffect(() => {
  //   if (input0Value !== '' && (activeSegment === 1 || (activeSegment === 0 && input1Value !== ''))) {
  //     const bal0 = Number(balances[pool.token0.address]?.toExact())
  //     const bal1 = Number(balances[pool.token1.address]?.toExact())

  //     if (bal0 < Number(input0Value) || (activeSegment === 0 && bal1 < Number(input1Value))) {
  //       setMainState(AddLiquidityState.InsufficientBalance)
  //     } else if (token0ApproveState !== ApprovalState.APPROVED) {
  //       setMainState(AddLiquidityState.NotApproved)
  //     } else {
  //       if (activeSegment === 1 && slippage === '') {
  //         setMainState(AddLiquidityState.NotConfigured)
  //       } else {
  //         setMainState(AddLiquidityState.Ready)
  //       }
  //     }
  //   } else {
  //     setMainState(AddLiquidityState.NoAmount)
  //   }
  // }, [activeSegment, slippage, input0Value, input1Value, token0ApproveState, token1ApproveState])

  // /**
  //  * Updating token1 amount, upon entering token0 amount
  //  **/
  // const updateInput0 = async (val: string) => {
  //   setInput0Value(val)

  //   if (activeSegment === 0) {
  //     if (val === '') {
  //       setInput1Value('')
  //       return
  //     }

  //     const quoteDeposit = await calcQuoteAmountGivenBase(val)
  //     setInput1Value(quoteDeposit[0])

  //     // const input0 = Number(val)
  //     // const input1 = (input0 / pool.rates.token1) * pool.rates.token0 * (pool.weights.token1 / pool.weights.token0)
  //     // setInput1Value(`${input1}`)
  //   } else if (activeSegment === 1) {
  //     if (val === '') return
  //     // previewZap(val)
  //   }
  // }

  // /**
  //  * Updating token0 amount, upon entering token1 amount
  //  **/
  // const updateInput1 = async (val: string) => {
  //   setInput1Value(val)
  //   if (val === '') {
  //     setInput0Value('')
  //     return
  //   }

  //   const baseDeposit = await calcBaseAmountGivenQuote(val)
  //   setInput0Value(baseDeposit[0])

  //   // const input1 = Number(val)
  //   // const input0 = (input1 / pool.rates.token0) * pool.rates.token1 * (pool.weights.token0 / pool.weights.token1)
  //   // setInput0Value(`${input0}`)
  //   //previewDeposit(input0, input1)
  // }

  // useEffect(() => {
  //   const isMultiSided = activeSegment === 0
  //   if (isMultiSided && (input0Value === '' || input1Value === '')) return
  //   if (!isMultiSided && input0Value === '') return

  //   if (isMultiSided) {
  //     // previewDeposit()
  //   } else {
  //     previewZap()
  //   }
  // }, [input0Value, input1Value, selectedToken, activeSegment])

  // // useEffect(() => {
  // //   previewDeposit()
  // // }, [input1Value, activeSegment])

  // const previewDeposit = async () => {
  //   const input0 = Number(input0Value)
  //   const input1 = Number(input1Value)

  //   const totalNumeraire =
  //     input0 * (pool.rates.token0 * 100) * (pool.weights.token0 / pool.weights.token1) +
  //     input1 * (pool.rates.token1 * 100) * (pool.weights.token1 / pool.weights.token0)

  //   const amount = await viewDeposit(parseEther(`${totalNumeraire}`))
  //   setLpAmount(amount.toString())
  // }

  // const previewZap = async () => {
  //   // await calcQuoteAmountGivenBase(val)
  //   // await calcBaseAmountGivenQuote(val)
  //   // await calcMaxQuoteForDeposit(val)

  //   let baseAmount = 0
  //   let quoteAmount = 0
  //   const zapFromBase = selectedToken === pool.token0

  //   if (zapFromBase) {
  //     const swapAmount = await calcSwapAmountForZapFromBase(input0Value)
  //     quoteAmount = Number(await viewOriginSwap(swapAmount))
  //     baseAmount = Number(input0Value) - Number(swapAmount)
  //   } else {
  //     const swapAmount = await calcSwapAmountForZapFromQuote(input0Value)
  //     baseAmount = Number(await viewTargetSwap(swapAmount))
  //     quoteAmount = Number(input0Value) - Number(swapAmount)
  //   }

  //   console.log('Base, quote: ', baseAmount, quoteAmount)
  //   const totalNumeraire =
  //     baseAmount * (pool.rates.token0 * 100) * (pool.weights.token0 / pool.weights.token1) +
  //     quoteAmount * (pool.rates.token1 * 100) * (pool.weights.token1 / pool.weights.token0)
  //   const depositAmount = await viewDeposit(parseEther(`${totalNumeraire}`))
  // }

  return (
    <div>
      <div className="flex items-center justify-end">
        {activeSegment === 1 && (
          <div className="italic text-xs text-gray-400 hidden mr-2 md:block">Swaps will be carried out for you</div>
        )}
        <SegmentControl
          segments={['Two-sided', 'Single-sided']}
          activeSegment={activeSegment}
          didChangeSegment={i => setActiveSegment(i)}
        />
      </div>

      {activeSegment === 0 ? (
        <MultiSidedLiquidity
          pool={pool}
          balances={balances}
          onBaseAmountChanged={setBaseAmount}
          onQuoteAmountChanged={setQuoteAmount}
          onDeposit={() => setShowModal(true)}
        />
      ) : (
        <SingleSidedLiquidity
          pool={pool}
          balances={balances}
          onZapAmountChanged={setZapAmount}
          onZapFromBaseChanged={setZapFromBase}
          onSlippageChanged={setSlippage}
          onDeposit={() => setShowModal(true)}
        />
      )}

      <AddLiquityModal
        isVisible={showModal}
        onDismiss={() => setShowModal(false)}
        pool={pool}
        baseAmount={baseAmount}
        quoteAmount={quoteAmount}
        zapAmount={zapAmount}
        slippage={slippage}
        isMultisided={activeSegment === 0}
        isZappingFromBase={zapFromBase}
      />
    </div>
  )
}

export default AddLiquidity
