import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { Token } from '@sushiswap/sdk'
import { useTransactionAdder } from 'state/transactions/hooks'

export const useAddRemoveLiquidity = (address: string, token0: Token, token1: Token) => {
  const { library } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)
  const addTransaction = useTransactionAdder()

  const viewDeposit = useCallback(
    async (amount: BigNumber) => {
      if (!library) return BigNumber.from(0)

      const res = await CurveContract?.viewDeposit(amount)
      console.log(`CurveContract.viewDeposit(${formatEther(amount)}): `, res)

      const [lpAmount, [baseView, quoteView]] = res
      console.log(`LP token: `, formatEther(lpAmount))
      console.log(`Token[0]: `, formatUnits(baseView, token0.decimals))
      console.log(`Token[1]: `, formatUnits(quoteView, token1.decimals))

      return lpAmount
    },
    [CurveContract, library]
  )

  const deposit = useCallback(
    async (amount: BigNumber, deadline: BigNumber) => {
      console.log(`CurveContract.deposit params: `, formatEther(amount), formatEther(deadline))
      const tx = await CurveContract?.deposit(amount, deadline)
      console.log(`CurveContract.deposit(${amount.toString()}, ${deadline.toString()}): `, tx)
      addTransaction(tx, {
        summary: `Add Liquidity for ${token0.symbol}/${token1.symbol}`
      })
      return tx
    },
    [CurveContract]
  )

  const viewWithdraw = useCallback(
    async (amount: BigNumber) => {
      if (!library) return ['0', '0']

      const res = await CurveContract?.viewWithdraw(amount)
      console.log(`CurveContract.viewWithdraw(${formatEther(amount)}): `, res)

      const [baseView, quoteView] = res
      console.log(`Token[0]: `, formatUnits(baseView, token0.decimals))
      console.log(`Token[1]: `, formatUnits(quoteView, token1.decimals))

      return [formatUnits(baseView, token0.decimals), formatUnits(quoteView, token1.decimals)]
    },
    [CurveContract, library]
  )

  const withdraw = useCallback(
    async (amount: BigNumber, deadline: BigNumber) => {
      console.log(`CurveContract.withdraw params: `, formatEther(amount), formatEther(deadline))
      const tx = await CurveContract?.withdraw(amount, deadline)
      console.log(`CurveContract.withdraw(${amount.toString()}, ${deadline.toString()}): `, tx)
      addTransaction(tx, {
        summary: `Remove Liquidity from ${token0.symbol}/${token1.symbol}`
      })
      return tx
    },
    [CurveContract]
  )

  return { viewDeposit, deposit, viewWithdraw, withdraw }
}
