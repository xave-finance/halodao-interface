import React, { useState } from 'react'
import AmountSlider from 'components/Tailwind/InputFields/AmountSlider'
import CurrencyLogo from 'components/CurrencyLogo'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import { PoolData } from '../models/PoolData'
import ReactGA from 'react-ga'
import ErrorModal from 'components/Tailwind/Modals/ErrorModal'
import { bigNumberToNumber } from 'utils/bigNumberHelper'
import JSBI from 'jsbi'
import { TokenAmount } from '@halodao/sdk'
import usePoolInvest from 'halo-hooks/amm-v2/usePoolInvest'
import usePoolCalculator from 'halo-hooks/amm-v2/usePoolCalculator'

interface RemoveLiquidityProps {
  pool: PoolData
}

const RemoveLiquidity = ({ pool }: RemoveLiquidityProps) => {
  const token0 = pool.tokens[0].token
  const token1 = pool.tokens[1].token

  const { calculateTokensOut } = usePoolCalculator(pool)
  const { withdraw } = usePoolInvest(pool.vaultPoolId, [token0, token1])
  const [amountPercentage, setAmountPercentage] = useState(0)
  const [token0Amount, setToken0Amount] = useState(new TokenAmount(token0, JSBI.BigInt(0)))
  const [token1Amount, setToken1Amount] = useState(new TokenAmount(token1, JSBI.BigInt(0)))
  const [removeButtonState, setRemoveButtonState] = useState(PrimaryButtonState.Disabled)
  const [errorObject, setErrorObject] = useState<any>(undefined)

  const updateAmountPercentage = async (percentage: number) => {
    setAmountPercentage(percentage)

    const withdrawAmount = pool.userInfo.held.mul(percentage).div(100)
    const tokenAmounts = calculateTokensOut(withdrawAmount)
    setToken0Amount(new TokenAmount(token0, tokenAmounts[0].toBigInt()))
    setToken1Amount(new TokenAmount(token1, tokenAmounts[1].toBigInt()))

    if (percentage > 0) {
      setRemoveButtonState(PrimaryButtonState.Enabled)
    } else {
      setRemoveButtonState(PrimaryButtonState.Disabled)
    }
  }

  const confirmWithdraw = async () => {
    setRemoveButtonState(PrimaryButtonState.InProgress)

    try {
      const withdrawAmount = pool.userInfo.held.mul(amountPercentage).div(100)
      const tx = await withdraw(withdrawAmount, [token0Amount.toExact(), token1Amount.toExact()])
      await tx.wait()

      setAmountPercentage(0)
      setToken0Amount(new TokenAmount(token0, JSBI.BigInt(0)))
      setToken1Amount(new TokenAmount(token0, JSBI.BigInt(0)))
      setRemoveButtonState(PrimaryButtonState.Disabled)

      ReactGA.event({
        category: 'Liquidity',
        action: 'Remove Liquidity',
        label: pool.name,
        value: bigNumberToNumber(withdrawAmount)
      })
    } catch (err) {
      console.error(err)
      setErrorObject(err)
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
          <div>{token0Amount.toFixed(2, { groupSeparator: ',' })}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={token0} />
            <span>{token0.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div>{token1Amount.toFixed(2, { groupSeparator: ',' })}</div>
          <div className="flex space-x-2">
            <CurrencyLogo currency={token1} />
            <span>{token1.symbol}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <PrimaryButton title="Remove Supply" state={removeButtonState} onClick={confirmWithdraw} />
      </div>
      {errorObject && (
        <ErrorModal
          isVisible={errorObject !== undefined}
          onDismiss={() => setErrorObject(undefined)}
          errorObject={errorObject}
        />
      )}
    </div>
  )
}

export default RemoveLiquidity
