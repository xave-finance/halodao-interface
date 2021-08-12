import React, { useEffect, useState } from 'react'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { JSBI, Token, TokenAmount } from '@sushiswap/sdk'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import AddLiquityModal from './modals/AddLiquityModal'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import { useTokenAllowance } from 'data/Allowances'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { BigNumber } from 'ethers'

interface AddLiquidityProps {
  poolAddress: string
  token0: Token
  token1: Token
}

enum AddLiquidityState {
  NoAmount,
  NotApproved,
  NotConfigured,
  Ready
}

const AddLiquidity = ({ poolAddress, token0, token1 }: AddLiquidityProps) => {
  const [activeSegment, setActiveSegment] = useState(0)
  const [input0Value, setInput0Value] = useState('')
  const [input1Value, setInput1Value] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [mainState, setMainState] = useState<AddLiquidityState>(AddLiquidityState.NoAmount)
  const [slippage, setSlippage] = useState('0.1')

  const { viewDeposit } = useAddRemoveLiquidity(poolAddress, token0, token1)

  const token0Amount = new TokenAmount(token0, JSBI.BigInt(parseEther(input0Value !== '' ? input0Value : '0')))
  const [token0ApproveState, token0ApproveCallback] = useApproveCallback(token0Amount, poolAddress)
  const token1Amount = new TokenAmount(token1, JSBI.BigInt(parseEther(input1Value !== '' ? input1Value : '0')))
  const [token1ApproveState, token1ApproveCallback] = useApproveCallback(token1Amount, poolAddress)

  console.log('token0ApproveState: ', token0ApproveState)
  console.log('token1ApproveState: ', token1ApproveState)
  const showApproveToken0 = input0Value !== '' && token0ApproveState !== ApprovalState.APPROVED
  const showApproveToken1 = input1Value !== '' && token1ApproveState !== ApprovalState.APPROVED

  /**
   * Logic for updating "Supply" button
   **/
  useEffect(() => {
    if (input0Value !== '') {
      if (token0ApproveState !== ApprovalState.APPROVED) {
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
  useEffect(() => {
    if (activeSegment === 0) {
      setInput1Value(input0Value)
    }
  }, [input0Value])

  /**
   * Updating token0 amount, upon entering token1 amount
   **/
  useEffect(() => {
    setInput0Value(input1Value)
  }, [input1Value])

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
              currency={token0}
              value={input0Value}
              didChangeValue={val => setInput0Value(val)}
              showBalance={true}
              showMax={true}
            />
          </div>
          <div className="mt-4">
            <CurrencyInput
              currency={token1}
              value={input1Value}
              didChangeValue={val => {
                setInput1Value(val)
                // viewDeposit(parseEther(val))
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
                        ? `Approving ${token0.symbol}`
                        : `Approve ${token0.symbol}`
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
                        ? `Approving ${token1.symbol}`
                        : `Approve ${token1.symbol}`
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
              title={mainState === AddLiquidityState.NoAmount ? 'Enter an amount' : 'Supply'}
              state={mainState === AddLiquidityState.Ready ? PrimaryButtonState.Enabled : PrimaryButtonState.Disabled}
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
              currency={token0}
              value={input0Value}
              didChangeValue={val => setInput0Value(val)}
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
                      ? `Approving ${token0.symbol}`
                      : `Approve ${token0.symbol}`
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
                    : 'Supply'
                }
                state={mainState === AddLiquidityState.Ready ? PrimaryButtonState.Enabled : PrimaryButtonState.Disabled}
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
        </>
      )}

      <AddLiquityModal isVisible={showModal} onDismiss={() => setShowModal(false)} />
    </div>
  )
}

export default AddLiquidity
