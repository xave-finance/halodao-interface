import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

export const useAddRemoveLiquidity = (address: string) => {
  const CurveContract = useContract(address, CURVE_ABI, true)

  const viewDeposit = useCallback(
    async (amount: BigNumber) => {
      const res = await CurveContract?.viewDeposit(amount)
      console.log(`CurveContract.viewDeposit(${amount.toString()}): `, res)
      console.log(`LP token: `, formatEther(res[0]))
      console.log(`Token[0]: `, formatEther(res[1][0]))
      console.log(`Token[1]: `, formatEther(res[1][1]))
      return res.amount
    },
    [CurveContract]
  )

  const deposit = useCallback(
    async (amount: BigNumber, deadline: BigNumber) => {
      const res = await CurveContract?.deposit(amount, deadline)
      console.log(`CurveContract.deposit(${amount.toString()}, ${deadline.toString()}): `, res)
      return res.amount
    },
    [CurveContract]
  )

  return { viewDeposit, deposit }
}
