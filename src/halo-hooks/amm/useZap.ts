import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import ZAP_ABI from 'constants/haloAbis/Zap.json'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { AMM_ZAP_ADDRESS } from '../../constants'
import { BigNumber } from 'ethers'
import { useTransactionAdder } from 'state/transactions/hooks'

export const useZap = (curveAddress: string, token0: Token, token1: Token) => {
  const { chainId } = useActiveWeb3React()
  const zapAddress = chainId ? AMM_ZAP_ADDRESS[chainId] : undefined
  const ZapContract = useContract(zapAddress, ZAP_ABI, true)
  const addTransaction = useTransactionAdder()

  /**
   * Given a base amount, calculate the maximum deposit amount, along with the
   * the number of LP tokens that will be generated, along with the maximized
   * base/quote amounts
   **/
  const calcMaxDepositAmountGivenBase = useCallback(
    async (amount: string) => {
      console.log('params: ', amount, token0.decimals)
      const baseAmount = parseUnits(amount, token0.decimals)
      console.log(`ZapContract?.calcMaxDepositAmountGivenBase params: `, curveAddress, formatEther(baseAmount))
      const res = await ZapContract?.calcMaxDepositAmountGivenBase(curveAddress, baseAmount)
      console.log(`ZapContract?.calcMaxDepositAmountGivenBase(${formatEther(baseAmount)}): `, res)

      console.log('deposit amount: ', formatEther(res[0]))
      console.log('LPT amount: ', formatEther(res[1]))
      console.log('token0 amount: ', formatUnits(res[2][0], token0.decimals))
      console.log('token1 amount: ', formatUnits(res[2][1], token1.decimals))
      return {
        maxDeposit: formatEther(res[0]),
        lpAmount: formatEther(res[1]),
        quoteAmount: formatUnits(res[2][1], token1.decimals)
      }
    },
    [ZapContract, curveAddress, token0, token1]
  )

  /**
   * Given a quote amount, calculate the maximum deposit amount, along with the
   * the number of LP tokens that will be generated, along with the maximized
   * base/quote amounts
   *
   * Returns an array with 3 elements:
   * 0 - max deposit amount
   * 1 - LPT amount
   * 2 - base amount
   **/
  const calcMaxDepositAmountGivenQuote = useCallback(
    async (amount: string) => {
      console.log('params: ', amount, token1.decimals)
      const quoteAmount = parseUnits(amount, token1.decimals)
      console.log(`ZapContract?.calcMaxDepositAmountGivenQuote params: `, curveAddress, formatEther(quoteAmount))
      const res = await ZapContract?.calcMaxDepositAmountGivenQuote(curveAddress, quoteAmount)
      console.log(`ZapContract?.calcMaxDepositAmountGivenQuote(${formatEther(quoteAmount)}): `, res)

      console.log('deposit amount: ', formatEther(res[0]))
      console.log('LPT amount: ', formatEther(res[1]))
      console.log('token0 amount: ', formatUnits(res[2][0], token0.decimals))
      console.log('token1 amount: ', formatUnits(res[2][1], token1.decimals))
      return {
        maxDeposit: formatEther(res[0]),
        lpAmount: formatEther(res[1]),
        baseAmount: formatUnits(res[2][0], token0.decimals)
      }
    },
    [ZapContract, curveAddress, token0, token1]
  )

  /**
   * Given a base amount, calculate the max quote amount to be deposited
   */
  const calcSwapAmountForZapFromBase = useCallback(
    async (amount: string) => {
      console.log('params: ', amount, token0.decimals)
      const baseAmount = parseUnits(amount, token0.decimals)
      console.log(`ZapContract?.calcSwapAmountForZapFromBase params: `, curveAddress, formatEther(baseAmount))
      const swapAmount = await ZapContract?.calcSwapAmountForZapFromBase(curveAddress, baseAmount)
      console.log(`ZapContract?.calcSwapAmountForZapFromBase(${formatEther(baseAmount)}): `, swapAmount)
      console.log('swap amount: ', formatUnits(swapAmount, token0.decimals))
      return formatUnits(swapAmount, token0.decimals)
    },
    [ZapContract, curveAddress, token0]
  )

  /**
   * Given a quote amount, calculate the max base amount to be deposited
   */
  const calcSwapAmountForZapFromQuote = useCallback(
    async (amount: string) => {
      console.log('params: ', amount, token1.decimals)
      const quoteAmount = parseUnits(amount, token1.decimals)
      console.log(`ZapContract?.calcSwapAmountForZapFromQuote params: `, curveAddress, formatEther(quoteAmount))
      const swapAmount = await ZapContract?.calcSwapAmountForZapFromQuote(curveAddress, quoteAmount)
      console.log(`ZapContract?.calcSwapAmountForZapFromQuote(${formatEther(quoteAmount)}): `, swapAmount)
      console.log('swap amount: ', formatUnits(swapAmount, token1.decimals))
      return formatUnits(swapAmount, token1.decimals)
    },
    [ZapContract, curveAddress, token1]
  )

  const zapFromBase = useCallback(
    async (amount: string, deadline: number, minLp: BigNumber) => {
      const zapAmount = parseUnits(amount, token0.decimals)
      console.log(
        'ZapContract?.zapFromBase() params:',
        curveAddress,
        formatUnits(zapAmount, token0.decimals),
        deadline,
        formatEther(minLp)
      )
      const tx = await ZapContract?.zapFromBase(curveAddress, zapAmount, deadline, minLp)
      console.log('ZapContract?.zapFromBase() tx: ', tx)

      addTransaction(tx, {
        summary: `Add Liquidity for ${token0.symbol}/${token1.symbol}`
      })

      return tx
    },
    [ZapContract, curveAddress, token0, token1, addTransaction]
  )

  const zapFromQuote = useCallback(
    async (amount: string, deadline: number, minLp: BigNumber) => {
      const zapAmount = parseUnits(amount, token1.decimals)
      console.log(
        'ZapContract?.zapFromQuote() params:',
        curveAddress,
        formatUnits(zapAmount, token1.decimals),
        deadline,
        formatEther(minLp)
      )
      const tx = await ZapContract?.zapFromQuote(curveAddress, zapAmount, deadline, minLp)
      console.log('ZapContract?.zapFromQuote() tx: ', tx)

      addTransaction(tx, {
        summary: `Add Liquidity for ${token0.symbol}/${token1.symbol}`
      })

      return tx
    },
    [ZapContract, curveAddress, token0, token1, addTransaction]
  )

  return {
    calcMaxDepositAmountGivenBase,
    calcMaxDepositAmountGivenQuote,
    calcSwapAmountForZapFromBase,
    calcSwapAmountForZapFromQuote,
    zapFromBase,
    zapFromQuote
  }
}
