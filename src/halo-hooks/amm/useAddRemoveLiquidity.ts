import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useTransactionAdder } from 'state/transactions/hooks'
import { isDoubleEstimatePool } from 'utils/poolInfo'
import { useActiveWeb3React } from 'hooks'
import { consoleLog } from 'utils/simpleLogger'

export const useAddRemoveLiquidity = (address: string, token0: Token, token1: Token) => {
  const { chainId } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)
  const addTransaction = useTransactionAdder()

  const viewDeposit = useCallback(
    async (amount: BigNumber) => {
      consoleLog('-----------')
      consoleLog('viewDeposit params: ', formatEther(amount))
      const res = await CurveContract?.viewDeposit(amount)
      consoleLog('viewDeposit response >>')
      consoleLog('lp tokens:', formatEther(res[0]))
      consoleLog('token 0:', formatUnits(res[1][0], token0.decimals))
      consoleLog('token 1:', formatUnits(res[1][1], token1.decimals))
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

  const previewDepositGivenQuote = useCallback(
    async (quoteAmount: string) => {
      const quoteAmountVal = Number(quoteAmount)
      const quoteNumeraire = Number(quoteAmount)
      const multiplier = isDoubleEstimatePool(address, chainId) ? 1 : 2
      const totalNumeraire = quoteNumeraire * multiplier
      const preview = await viewDeposit(parseEther(`${totalNumeraire}`))

      // Get "input base/estimated base" rate of error to determine if we need to adjust total numeraire
      const quoteVal = Number(preview.quote)
      const rateOfError = quoteAmountVal < quoteVal ? quoteAmountVal / quoteVal : quoteVal / quoteAmountVal
      consoleLog('rateOfError: ', rateOfError)

      // Adjust total numeraire & call viewDeposit again
      const adjustedNumeraire = totalNumeraire * rateOfError
      const { lpToken, base, quote } = await viewDeposit(parseEther(`${adjustedNumeraire}`))

      return {
        deposit: adjustedNumeraire,
        lpToken,
        base,
        quote
      }
    },
    [viewDeposit, address, chainId]
  )

  const previewDepositGivenBase = useCallback(
    async (baseAmount: string, baseRate: number, baseWeight: number) => {
      const baseAmountVal = Number(baseAmount)
      const baseNumeraire = baseAmountVal * baseRate
      const multiplier = isDoubleEstimatePool(address, chainId) ? 1 : baseWeight > 0 ? 1 / baseWeight : 2
      const totalNumeraire = baseNumeraire * multiplier
      const preview = await viewDeposit(parseEther(`${totalNumeraire}`))

      // Get "input base/estimated base" rate of error to determine if we need to adjust total numeraire
      const baseVal = Number(preview.base)
      const rateOfError = baseAmountVal < baseVal ? baseAmountVal / baseVal : baseVal / baseAmountVal
      consoleLog('rateOfError: ', rateOfError)

      // Adjust total numeraire & call viewDeposit again
      const adjustedNumeraire = totalNumeraire * rateOfError
      const { lpToken, base, quote } = await viewDeposit(parseEther(`${adjustedNumeraire}`))

      return {
        deposit: adjustedNumeraire,
        lpToken,
        base,
        quote
      }
    },
    [viewDeposit, address, chainId]
  )

  return { viewDeposit, deposit, viewWithdraw, withdraw, previewDepositGivenBase, previewDepositGivenQuote }
}
