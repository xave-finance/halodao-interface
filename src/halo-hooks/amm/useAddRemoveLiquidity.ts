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

const THRESHOLD = 0.00001

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

  const adjustViewDeposit = useCallback(
    async (inputAmount: number, estimatedAmount: number, totalNumeraire: number) => {
      const rateOfError = inputAmount / estimatedAmount
      const adjustedNumeraire = totalNumeraire * rateOfError
      const { lpToken, base, quote } = await viewDeposit(parseEther(`${adjustedNumeraire}`))
      return {
        deposit: adjustedNumeraire,
        lpToken,
        base,
        quote
      }
    },
    [viewDeposit]
  )

  const previewDepositGivenQuote = useCallback(
    async (quoteAmount: string) => {
      const quoteAmountVal = Number(quoteAmount)
      const quoteNumeraire = quoteAmountVal // no need to convert, quote (USDC) is numeraire
      const multiplier = isDoubleEstimatePool(address, chainId) ? 1 : 2
      const totalNumeraire = quoteNumeraire * multiplier
      const estimate = await viewDeposit(parseEther(`${totalNumeraire}`))

      let depositPreview = {
        deposit: totalNumeraire,
        lpToken: estimate.lpToken,
        base: estimate.base,
        quote: estimate.quote
      }

      let estimatedQuoteVal = Number(estimate.quote)
      if (estimatedQuoteVal < quoteAmountVal) {
        while (estimatedQuoteVal - quoteAmountVal < -THRESHOLD) {
          depositPreview = await adjustViewDeposit(quoteAmountVal, estimatedQuoteVal, totalNumeraire)
          estimatedQuoteVal = Number(depositPreview.quote)
        }
      } else {
        while (estimatedQuoteVal - quoteAmountVal > THRESHOLD) {
          depositPreview = await adjustViewDeposit(quoteAmountVal, estimatedQuoteVal, totalNumeraire)
          estimatedQuoteVal = Number(depositPreview.quote)
        }
      }

      return depositPreview
    },
    [viewDeposit, address, chainId, adjustViewDeposit]
  )

  const previewDepositGivenBase = useCallback(
    async (baseAmount: string, baseRate: number, baseWeight: number) => {
      const baseAmountVal = Number(baseAmount)
      const baseNumeraire = baseAmountVal * baseRate
      const multiplier = isDoubleEstimatePool(address, chainId) ? 1 : baseWeight > 0 ? 1 / baseWeight : 2
      const totalNumeraire = baseNumeraire * multiplier
      const estimate = await viewDeposit(parseEther(`${totalNumeraire}`))

      let depositPreview = {
        deposit: totalNumeraire,
        lpToken: estimate.lpToken,
        base: estimate.base,
        quote: estimate.quote
      }

      let estimatedBaseVal = Number(estimate.base)
      if (estimatedBaseVal < baseAmountVal) {
        while (estimatedBaseVal - baseAmountVal < -THRESHOLD) {
          depositPreview = await adjustViewDeposit(baseAmountVal, estimatedBaseVal, totalNumeraire)
          estimatedBaseVal = Number(depositPreview.base)
        }
      } else {
        while (estimatedBaseVal - baseAmountVal > THRESHOLD) {
          depositPreview = await adjustViewDeposit(baseAmountVal, estimatedBaseVal, totalNumeraire)
          estimatedBaseVal = Number(depositPreview.base)
        }
      }

      return depositPreview
    },
    [viewDeposit, address, chainId, adjustViewDeposit]
  )

  return { viewDeposit, deposit, viewWithdraw, withdraw, previewDepositGivenBase, previewDepositGivenQuote }
}
