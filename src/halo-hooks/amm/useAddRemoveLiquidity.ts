import { useCallback, useEffect, useState } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { ERC20_ABI } from 'constants/abis/erc20'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { OracleCurrency, useOracle } from './useOracle'
import { getContract } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { Token } from '@sushiswap/sdk'

export const useAddRemoveLiquidity = (address: string, token0: Token, token1: Token) => {
  const { library } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)

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
      const res = await CurveContract?.deposit(amount, deadline)
      console.log(`CurveContract.deposit(${amount.toString()}, ${deadline.toString()}): `, res)
      return res.amount
    },
    [CurveContract]
  )

  return { viewDeposit, deposit }
}
