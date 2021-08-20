import React, { useState } from 'react'
import AmountSlider from 'components/Tailwind/InputFields/AmountSlider'
import { formatNumber } from 'utils/formatNumber'
import CurrencyLogo from 'components/CurrencyLogo'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import { PoolData } from '../models/PoolData'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { BigNumber } from '@ethersproject/bignumber'

interface RemoveLiquidityProps {
  pool: PoolData
}

const RemoveLiquidity = ({ pool }: RemoveLiquidityProps) => {
  const [amount, setAmount] = useState(0)
  const [token0Amount, setToken0Amount] = useState(0)
  const [token1Amount, setToken1Amount] = useState(0)
  const currentBlockTime = useCurrentBlockTimestamp()
  const [removeButtonState, setRemoveButtonState] = useState(PrimaryButtonState.Disabled)

  const { viewWithdraw, withdraw } = useAddRemoveLiquidity(pool.address, pool.token0, pool.token1)

  const futureTime = () => {
    if (currentBlockTime) {
      return currentBlockTime.add(60).toNumber()
    } else {
      return new Date().getTime() + 60
    }
  }

  const updateAmount = async (amt: number) => {
    setAmount(amt)

    const lpAmount = pool.held * (amt * 0.01)
    console.log('lpAmount: ', lpAmount)
    const tokenAmounts = await viewWithdraw(parseEther(`${lpAmount}`))
    setToken0Amount(Number(tokenAmounts[0]))
    setToken1Amount(Number(tokenAmounts[1]))

    if (amt > 0) {
      setRemoveButtonState(PrimaryButtonState.Enabled)
    } else {
      setRemoveButtonState(PrimaryButtonState.Disabled)
    }
  }

  const confirmWithdraw = async () => {
    setRemoveButtonState(PrimaryButtonState.InProgress)

    try {
      const lpAmount = pool.held * (Number(amount) * 0.01)
      const deadline = futureTime()
      const tx = await withdraw(parseEther(`${lpAmount}`), deadline)
      await tx.wait()

      setAmount(0)
      setToken0Amount(0)
      setToken1Amount(0)
      setRemoveButtonState(PrimaryButtonState.Disabled)
    } catch (err) {
      console.error(err)
      setRemoveButtonState(PrimaryButtonState.Enabled)
    }
  }

  return (
    <div className="mt-2">
      <div className="">Amount</div>
      <div className="my-4 md:mx-8">
        <AmountSlider amount={amount} didChangeAmount={updateAmount} />
      </div>
      <div className="mt-4">You will receive</div>
      <div className="mt-2 py-2 md:px-8 border-t border-b border-gray-200">
        <div className="flex justify-between">
          <div>{formatNumber(token0Amount)}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={pool.token0} />
            <span>{pool.token0.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div>{formatNumber(token1Amount)}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={pool.token1} />
            <span>{pool.token1.symbol}</span>
          </div>
        </div>
      </div>
      {/* <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
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
      </div> */}
      <div className="mt-4">
        <PrimaryButton title="Remove Supply" state={removeButtonState} onClick={confirmWithdraw} />
      </div>
    </div>
  )
}

export default RemoveLiquidity
