import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useTransactionAdder } from 'state/transactions/hooks'

export const useAddRemoveLiquidity = (address: string, token0: Token, token1: Token) => {
  const CurveContract = useContract(address, CURVE_ABI, true)
  const addTransaction = useTransactionAdder()

  const deposit = useCallback(
    async (amount: BigNumber, deadline: number) => {
      console.log(`CurveContract.deposit params: `, formatEther(amount), deadline)
      const tx = await CurveContract?.deposit(amount, deadline)
      console.log(`CurveContract.deposit(${amount.toString()}, ${deadline.toString()}): `, tx)
      addTransaction(tx, {
        summary: `Add Liquidity for ${token0.symbol}/${token1.symbol}`
      })
      return tx
    },
    [CurveContract, token0, token1, addTransaction]
  )

  const viewWithdraw = useCallback(
    async (amount: BigNumber) => {
      const res = await CurveContract?.viewWithdraw(amount)
      console.log(`CurveContract.viewWithdraw(${formatEther(amount)}): `, res)

      const [baseView, quoteView] = res
      console.log(`Token[0]: `, formatUnits(baseView, token0.decimals))
      console.log(`Token[1]: `, formatUnits(quoteView, token1.decimals))

      return [formatUnits(baseView, token0.decimals), formatUnits(quoteView, token1.decimals)]
    },
    [CurveContract, token0, token1]
  )

  const withdraw = useCallback(
    async (amount: BigNumber, deadline: number) => {
      console.log(`CurveContract.withdraw params: `, formatEther(amount), deadline)
      const tx = await CurveContract?.withdraw(amount, deadline)
      console.log(`CurveContract.withdraw(${amount.toString()}, ${deadline.toString()}): `, tx)
      addTransaction(tx, {
        summary: `Remove Liquidity from ${token0.symbol}/${token1.symbol}`
      })
      return tx
    },
    [CurveContract, token0, token1, addTransaction]
  )

  return { deposit, viewWithdraw, withdraw }
}
