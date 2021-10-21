import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import ZAP_ABI from 'constants/haloAbis/Zap.json'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { AMM_ZAP_ADDRESS } from '../../constants'
import { BigNumber } from 'ethers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { consoleLog } from 'utils/simpleLogger'

export const useZap = (curveAddress: string, token0: Token, token1: Token) => {
  const { chainId } = useActiveWeb3React()
  const zapAddress = chainId ? AMM_ZAP_ADDRESS[chainId] : undefined
  const ZapContract = useContract(zapAddress, ZAP_ABI, true)
  const addTransaction = useTransactionAdder()

  /**
   * Given a base amount, calculate the max quote amount to be deposited
   */
  const calcSwapAmountForZapFromBase = useCallback(
    async (amount: string) => {
      const baseAmount = parseUnits(amount, token0.decimals)
      consoleLog('calcSwapAmountForZapFromBase params: ', curveAddress, formatUnits(baseAmount, token0.decimals))
      const swapAmount = await ZapContract?.calcSwapAmountForZapFromBase(curveAddress, baseAmount)
      consoleLog('calcSwapAmountForZapFromBase result: ', formatUnits(swapAmount, token0.decimals))
      return formatUnits(swapAmount, token0.decimals)
    },
    [ZapContract, curveAddress, token0]
  )

  /**
   * Given a quote amount, calculate the max base amount to be deposited
   */
  const calcSwapAmountForZapFromQuote = useCallback(
    async (amount: string) => {
      const quoteAmount = parseUnits(amount, token1.decimals)
      consoleLog('calcSwapAmountForZapFromQuote params: ', curveAddress, formatUnits(quoteAmount, token1.decimals))
      const swapAmount = await ZapContract?.calcSwapAmountForZapFromQuote(curveAddress, quoteAmount)
      consoleLog('calcSwapAmountForZapFromQuote result: ', formatUnits(swapAmount, token1.decimals))
      return formatUnits(swapAmount, token1.decimals)
    },
    [ZapContract, curveAddress, token1]
  )

  const zapFromBase = useCallback(
    async (amount: string, deadline: number, minLp: BigNumber) => {
      const zapAmount = parseUnits(amount, token0.decimals)
      consoleLog(
        'zapFromBase params: ',
        curveAddress,
        formatUnits(zapAmount, token0.decimals),
        deadline,
        formatEther(minLp)
      )
      const tx = await ZapContract?.zapFromBase(curveAddress, zapAmount, deadline, minLp)

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
      consoleLog(
        'zapFromQuote params: ',
        curveAddress,
        formatUnits(zapAmount, token1.decimals),
        deadline,
        formatEther(minLp)
      )
      const tx = await ZapContract?.zapFromQuote(curveAddress, zapAmount, deadline, minLp)

      addTransaction(tx, {
        summary: `Add Liquidity for ${token0.symbol}/${token1.symbol}`
      })

      return tx
    },
    [ZapContract, curveAddress, token0, token1, addTransaction]
  )

  return {
    calcSwapAmountForZapFromBase,
    calcSwapAmountForZapFromQuote,
    zapFromBase,
    zapFromQuote
  }
}
