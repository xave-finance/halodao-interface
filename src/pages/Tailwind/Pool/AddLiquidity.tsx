import React, { useEffect, useState } from 'react'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import { Token } from '@sushiswap/sdk'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import AddLiquityModal from './modals/AddLiquityModal'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'

interface AddLiquidityProps {
  poolAddress: string
  token0: Token
  token1: Token
}

const AddLiquidity = ({ poolAddress, token0, token1 }: AddLiquidityProps) => {
  const [activeSegment, setActiveSegment] = useState(0)
  const [input0Value, setInput0Value] = useState('')
  const [input1Value, setInput1Value] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { viewDeposit } = useAddRemoveLiquidity(poolAddress, token0, token1)

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
                viewDeposit(parseEther(val))
              }}
              showBalance={true}
              showMax={true}
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <div className="w-1/2">
              <ApproveButton
                title="Approve"
                state={ApproveButtonState.NotApproved}
                onClick={() => console.log('clicked')}
              />
            </div>
            <div className="w-1/2">
              <ApproveButton
                title="Approve"
                state={ApproveButtonState.NotApproved}
                onClick={() => console.log('clicked')}
              />
            </div>
          </div>
          <div className="mt-2">
            {/* <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Enter an amount"
          state={PrimaryButtonState.Disabled}
          onClick={() => console.log('clicked')}
        /> */}
            <PrimaryButton
              type={PrimaryButtonType.Gradient}
              title="Supply"
              state={PrimaryButtonState.Enabled}
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
            <SlippageTolerance />
          </div>
          <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
            <div className="mb-2 md:w-1/2 md:mb-0">
              <ApproveButton
                title="Approve"
                state={ApproveButtonState.NotApproved}
                onClick={() => console.log('clicked')}
              />
            </div>
            <div className="md:w-1/2">
              {/* <PrimaryButton
            type={PrimaryButtonType.Gradient}
            title="Enter an amount"
            state={PrimaryButtonState.Disabled}
            onClick={() => console.log('clicked')}
          /> */}
              <PrimaryButton
                type={PrimaryButtonType.Gradient}
                title="Supply"
                state={PrimaryButtonState.Enabled}
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
