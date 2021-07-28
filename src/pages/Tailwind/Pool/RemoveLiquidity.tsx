import React, { useState } from 'react'
import AmountSlider from 'components/Tailwind/InputFields/AmountSlider'
import { formatNumber } from 'utils/formatNumber'
import { Token } from '@sushiswap/sdk'
import CurrencyLogo from 'components/CurrencyLogo'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonType, PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'

interface RemoveLiquidityProps {
  token0: Token
  token1: Token
}

const RemoveLiquidity = ({ token0, token1 }: RemoveLiquidityProps) => {
  const [amount, setAmount] = useState(0)

  return (
    <div className="mt-2">
      <div className="">Amount</div>
      <div className="my-4 md:mx-8">
        <AmountSlider amount={amount} didChangeAmount={amt => setAmount(amt)} />
      </div>
      <div className="mt-4">You will receive</div>
      <div className="mt-2 py-2 md:px-8 border-t border-b border-gray-200">
        <div className="flex justify-between">
          <div>{formatNumber(12345)}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={token0} />
            <span>{token0.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div>{formatNumber(56789)}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={token1} />
            <span>{token1.symbol}</span>
          </div>
        </div>
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
          <PrimaryButton
            title="Remove Supply"
            state={PrimaryButtonState.Disabled}
            onClick={() => console.log('clicked')}
          />
        </div>
      </div>
    </div>
  )
}

export default RemoveLiquidity
