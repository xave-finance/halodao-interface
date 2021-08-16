import React, { useEffect, useState } from 'react'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { JSBI, TokenAmount } from '@sushiswap/sdk'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import AddLiquityModal, { AddLiquidityMode } from './modals/AddLiquityModal'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { PoolData } from './models/PoolData'
import { useTokenBalance, useTokenBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { BigNumber } from 'ethers'

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
  const [input0Value, setInput0Value] = useState('')
  const [input1Value, setInput1Value] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  const [slippage, setSlippage] = useState('0.1')
  const [lpAmount, setLpAmount] = useState('')

  const { viewDeposit } = useAddRemoveLiquidity(pool.address, pool.token0, pool.token1)

  const token0Amount = new TokenAmount(pool.token0, JSBI.BigInt(parseEther(input0Value !== '' ? input0Value : '0')))
  const [token0ApproveState, token0ApproveCallback] = useApproveCallback(token0Amount, pool.address)
  const token1Amount = new TokenAmount(pool.token1, JSBI.BigInt(parseEther(input1Value !== '' ? input1Value : '0')))
  const [token1ApproveState, token1ApproveCallback] = useApproveCallback(token1Amount, pool.address)

  const showApproveToken0 = input0Value !== '' && token0ApproveState !== ApprovalState.APPROVED
  const showApproveToken1 = input1Value !== '' && token1ApproveState !== ApprovalState.APPROVED

  const { account } = useActiveWeb3React()
  const balances = useTokenBalances(account ?? undefined, [pool.token0, pool.token1])

  /**
   * Logic for updating "Supply" button
   **/
  useEffect(() => {
    if (input0Value !== '') {
      const bal0 = Number(balances[pool.token0.address]?.toExact())
      const bal1 = Number(balances[pool.token1.address]?.toExact())

      if (bal0 < Number(input0Value) || (activeSegment === 0 && bal1 < Number(input1Value))) {
        setMainState(AddLiquidityState.InsufficientBalance)
      } else if (token0ApproveState !== ApprovalState.APPROVED) {
        setMainState(AddLiquidityState.NotApproved)
      } else {
        if (activeSegment === 1 && slippage === '') {
          setMainState(AddLiquidityState.NotConfigured)
        } else {
          setMainState(AddLiquidityState.Ready)
        }
      }
    } else {
      setMainState(AddLiquidityState.NoAmount)
    }
  }, [activeSegment, slippage, input0Value, input1Value, token0ApproveState, token1ApproveState])

  /**
   * Updating token1 amount, upon entering token0 amount
   **/
  const updateInput0 = (val: string) => {
    setInput0Value(val)

    if (activeSegment === 0) {
      if (val === '') {
        setInput1Value('')
        return
      }

      const input0 = Number(val)
      const input1 = (input0 / pool.rates.token1) * pool.rates.token0 * (pool.weights.token1 / pool.weights.token0)
      setInput1Value(`${input1}`)
      //previewDeposit(input0, input1)
    }
  }

  /**
   * Updating token0 amount, upon entering token1 amount
   **/
  const updateInput1 = (val: string) => {
    setInput1Value(val)
    if (val === '') {
      setInput0Value('')
      return
    }

    const input1 = Number(val)
    const input0 = (input1 / pool.rates.token0) * pool.rates.token1 * (pool.weights.token0 / pool.weights.token1)
    console.log('updateInput1 inputs[]: ', input1, input0)
    setInput0Value(`${input0}`)
    //previewDeposit(input0, input1)
  }

  const previewDeposit = async (input0: number, input1: number) => {
    console.log('poolData: ', pool)
    const totalNumeraire =
      input0 * (pool.rates.token0 * 100) * (pool.weights.token0 / pool.weights.token1) +
      input1 * (pool.rates.token1 * 100) * (pool.weights.token1 / pool.weights.token0)
    console.log('totalNumeraire:', totalNumeraire)

    const amount = await viewDeposit(parseEther(`${totalNumeraire}`))
    setLpAmount(amount.toString())
  }

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
        <>
          <div className="mt-2">
            <CurrencyInput
              currency={pool.token0}
              value={input0Value}
              didChangeValue={val => updateInput0(val)}
              showBalance={true}
              showMax={true}
            />
          </div>
          <div className="mt-4">
            <CurrencyInput
              currency={pool.token1}
              value={input1Value}
              didChangeValue={val => {
                updateInput1(val)
              }}
              showBalance={true}
              showMax={true}
            />
          </div>

          {(showApproveToken0 || showApproveToken1) && (
            <div className="mt-4 flex space-x-4">
              {showApproveToken0 && (
                <div className={showApproveToken1 ? 'w-1/2' : 'flex-1'}>
                  <ApproveButton
                    title={
                      token0ApproveState === ApprovalState.PENDING
                        ? `Approving ${pool.token0.symbol}`
                        : `Approve ${pool.token0.symbol}`
                    }
                    state={
                      token0ApproveState === ApprovalState.PENDING
                        ? ApproveButtonState.Approving
                        : ApproveButtonState.NotApproved
                    }
                    onClick={token0ApproveCallback}
                  />
                </div>
              )}
              {showApproveToken1 && (
                <div className={showApproveToken0 ? 'w-1/2' : 'flex-1'}>
                  <ApproveButton
                    title={
                      token1ApproveState === ApprovalState.PENDING
                        ? `Approving ${pool.token1.symbol}`
                        : `Approve ${pool.token1.symbol}`
                    }
                    state={
                      token1ApproveState === ApprovalState.PENDING
                        ? ApproveButtonState.Approving
                        : ApproveButtonState.NotApproved
                    }
                    onClick={token1ApproveCallback}
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
                mainState === AddLiquidityState.Ready
                  ? PrimaryButtonState.Enabled
                  : mainState === AddLiquidityState.Depositing
                  ? PrimaryButtonState.InProgress
                  : PrimaryButtonState.Disabled
              }
              onClick={() => setShowModal(true)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-2 text-right italic text-xs text-gray-400 md:hidden">
            Swaps will be carried out for you
          </div>
          <div className="mt-4">
            <CurrencyInput
              currency={pool.token0}
              value={input0Value}
              didChangeValue={val => updateInput0(val)}
              showBalance={true}
              showMax={true}
            />
          </div>
          <div className="mt-4">
            <SlippageTolerance
              value={slippage}
              didChangeValue={(newSlippage: string) => {
                setSlippage(newSlippage)
              }}
            />
          </div>
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            {showApproveToken0 && (
              <div className="mb-2 md:w-1/2 md:mb-0">
                <ApproveButton
                  title={
                    token0ApproveState === ApprovalState.PENDING
                      ? `Approving ${pool.token0.symbol}`
                      : `Approve ${pool.token0.symbol}`
                  }
                  state={
                    token0ApproveState === ApprovalState.PENDING
                      ? ApproveButtonState.Approving
                      : ApproveButtonState.NotApproved
                  }
                  onClick={token0ApproveCallback}
                />
              </div>
            )}
            <div className={showApproveToken0 ? 'md:w-1/2' : 'flex-1'}>
              <PrimaryButton
                type={PrimaryButtonType.Gradient}
                title={
                  mainState === AddLiquidityState.NoAmount
                    ? 'Enter an amount'
                    : mainState === AddLiquidityState.NotConfigured
                    ? 'Configure slippage'
                    : mainState === AddLiquidityState.InsufficientBalance
                    ? 'Insufficient Balance'
                    : 'Supply'
                }
                state={
                  mainState === AddLiquidityState.Ready
                    ? PrimaryButtonState.Enabled
                    : mainState === AddLiquidityState.Depositing
                    ? PrimaryButtonState.InProgress
                    : PrimaryButtonState.Disabled
                }
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
        </>
      )}

      <AddLiquityModal
        mode={activeSegment === 0 ? AddLiquidityMode.MultiSided : AddLiquidityMode.SingleSided}
        isVisible={showModal}
        onDismiss={() => setShowModal(false)}
        pool={pool}
        token0Amount={input0Value}
        token1Amount={input1Value}
        slippage={slippage}
      />
    </div>
  )
}

export default AddLiquidity
