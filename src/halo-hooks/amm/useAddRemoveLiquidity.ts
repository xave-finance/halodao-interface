import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useTransactionAdder } from 'state/transactions/hooks'
import { isDoubleEstimatePool } from 'utils/poolInfo'
import { useActiveWeb3React } from 'hooks'

export const useAddRemoveLiquidity = (address: string, token0: Token, token1: Token) => {
  const { chainId } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)
  const addTransaction = useTransactionAdder()

  const viewDeposit = useCallback(
    async (amount: BigNumber) => {
      const res = await CurveContract?.viewDeposit(amount)
      // console.log('-----------')
      // console.log(`viewDeposit response: (amount: ${amount})`)
      // console.log('lp tokens:', formatEther(res[0]))
      // console.log('token 0:', formatUnits(res[1][0], token0.decimals))
      // console.log('token 1:', formatUnits(res[1][1], token1.decimals))
      return {
        lpToken: formatEther(res[0]),
        base: formatUnits(res[1][0], token0.decimals),
        quote: formatUnits(res[1][1], token1.decimals)
      }
    },
    [CurveContract, token0, token1]
  )

  const deposit = useCallback(
    async (amount: BigNumber, deadline: number) => {
      const tx = await CurveContract?.deposit(amount, deadline)
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
      const [baseView, quoteView] = res
      return [formatUnits(baseView, token0.decimals), formatUnits(quoteView, token1.decimals)]
    },
    [CurveContract, token0, token1]
  )

  const withdraw = useCallback(
    async (amount: BigNumber, deadline: number) => {
      const tx = await CurveContract?.withdraw(amount, deadline)
      addTransaction(tx, {
        summary: `Remove Liquidity from ${token0.symbol}/${token1.symbol}`
      })
      return tx
    },
    [CurveContract, token0, token1, addTransaction]
  )

  // const previewDepositGivenQuote = useCallback(
  //   async (quoteAmount: string, quoteRate: number, quoteWeight: number) => {
  //     const quoteNumeraire = Number(quoteAmount) * quoteRate
  //     const totalNumeraire = quoteNumeraire * (1 / quoteWeight)
  //     const { base, quote } = await viewDeposit(parseEther(`${totalNumeraire}`))
  //     return {
  //       deposit: totalNumeraire,
  //       base,
  //       quote
  //     }
  //   },
  //   [CurveContract, token0, token1]
  // )

  const previewDepositGivenQuote = useCallback(
    async (quoteAmount: string) => {
      const quoteNumeraire = Number(quoteAmount)
      const multiplier = isDoubleEstimatePool(address, chainId) ? 1 : 2
      const totalNumeraire = quoteNumeraire * multiplier
      const { lpToken, base, quote } = await viewDeposit(parseEther(`${totalNumeraire}`))
      return {
        deposit: totalNumeraire,
        lpToken,
        base,
        quote
      }
    },
    [viewDeposit, address, chainId]
  )

  const previewDepositGivenBase = useCallback(
    async (baseAmount: string, baseRate: number, baseWeight: number) => {
      const baseNumeraire = Number(baseAmount) * baseRate
      const multiplier = isDoubleEstimatePool(address, chainId) ? 1 : baseWeight > 0 ? 1 / baseWeight : 2
      const totalNumeraire = baseNumeraire * multiplier
      const { lpToken, base, quote } = await viewDeposit(parseEther(`${totalNumeraire}`))
      return {
        deposit: totalNumeraire,
        lpToken,
        base,
        quote
      }
    },
    [viewDeposit, address, chainId]
  )

  return { viewDeposit, deposit, viewWithdraw, withdraw, previewDepositGivenBase, previewDepositGivenQuote }
}
