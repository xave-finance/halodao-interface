import React, { useState } from 'react'
import AmountSlider from 'components/Tailwind/InputFields/AmountSlider'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import CurrencyLogo from 'components/CurrencyLogo'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import { PoolData } from '../models/PoolData'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import { useTime } from 'halo-hooks/useTime'
import ReactGA from 'react-ga'
import ErrorModal from 'components/Tailwind/Modals/ErrorModal'

interface RemoveLiquidityProps {
  pool: PoolData
}

const RemoveLiquidity = ({ pool }: RemoveLiquidityProps) => {
  const [amountPercentage, setAmountPercentage] = useState(0)
  const [token0Amount, setToken0Amount] = useState(0)
  const [token1Amount, setToken1Amount] = useState(0)
  const { getFutureTime } = useTime()
  const [removeButtonState, setRemoveButtonState] = useState(PrimaryButtonState.Disabled)
  const [error, setError] = useState<any>(undefined)

  const { viewWithdraw, withdraw } = useAddRemoveLiquidity(pool.address, pool.token0, pool.token1)

  const updateAmountPercentage = async (percentage: number) => {
    setAmountPercentage(percentage)

    const lpAmount = pool.held * (percentage * 0.01)
    const withdrawAmount = percentage === 100 ? pool.heldBN : parseEther(`${lpAmount}`)
    const tokenAmounts = await viewWithdraw(withdrawAmount)
    setToken0Amount(Number(tokenAmounts[0]))
    setToken1Amount(Number(tokenAmounts[1]))

    if (percentage > 0) {
      setRemoveButtonState(PrimaryButtonState.Enabled)
    } else {
      setRemoveButtonState(PrimaryButtonState.Disabled)
    }
  }

  const confirmWithdraw = async () => {
    setRemoveButtonState(PrimaryButtonState.InProgress)

    try {
      const lpAmount = pool.held * (Number(amountPercentage) * 0.01)
      const withdrawAmount = amountPercentage === 100 ? pool.heldBN : parseEther(`${lpAmount}`)
      const deadline = getFutureTime()
      const tx = await withdraw(withdrawAmount, deadline)
      await tx.wait()

      setAmountPercentage(0)
      setToken0Amount(0)
      setToken1Amount(0)
      setRemoveButtonState(PrimaryButtonState.Disabled)

      ReactGA.event({
        category: 'Liquidity',
        action: 'Remove Liquidity',
        label: pool.name,
        value: lpAmount
      })
    } catch (err) {
      console.error(err)
      setError(err)
      setRemoveButtonState(PrimaryButtonState.Enabled)
    }
  }

  return (
    <div className="mt-2">
      <div className="">Amount</div>
      <div className="my-4 md:mx-8">
        <AmountSlider amount={amountPercentage} didChangeAmount={updateAmountPercentage} />
      </div>
      <div className="mt-4">You will receive</div>
      <div className="mt-2 py-2 md:px-8 border-t border-b border-gray-200">
        <div className="flex justify-between">
          <div>{formatNumber(token0Amount, NumberFormat.long)}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={pool.token0} />
            <span>{pool.token0.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div>{formatNumber(token1Amount, NumberFormat.long)}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={pool.token1} />
            <span>{pool.token1.symbol}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <PrimaryButton title="Remove Supply" state={removeButtonState} onClick={confirmWithdraw} />
      </div>
      {error && <ErrorModal isVisible={error !== undefined} onDismiss={() => setError(undefined)} error={error} />}
    </div>
  )
}

export default RemoveLiquidity
