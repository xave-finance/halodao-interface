import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import ZAP_ABI from 'constants/haloAbis/Zap.json'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { AMM_ZAP_ADDRESS } from '../../constants'

export const useZap = (curveAddress: string, token0: Token, token1: Token) => {
  const { chainId } = useActiveWeb3React()
  const zapAddress = chainId ? AMM_ZAP_ADDRESS[chainId] : undefined
  const ZapContract = useContract(zapAddress, ZAP_ABI, true)

  const calcSwapAmountForZapFromBase = useCallback(
    async (amount: string) => {
      console.log('params: ', amount, token0.decimals)
      const baseAmount = parseUnits(amount, token0.decimals)
      console.log(`ZapContract?.calcSwapAmountForZapFromBase params: `, curveAddress, formatEther(baseAmount))
      const swapAmount = await ZapContract?.calcSwapAmountForZapFromBase(curveAddress, baseAmount)
      console.log(`ZapContract?.calcSwapAmountForZapFromBase(${formatEther(baseAmount)}): `, swapAmount)
      console.log('swap amount: ', formatUnits(swapAmount, token0.decimals))
    },
    [ZapContract, curveAddress]
  )

  /**
   * Given a base amount, calculate the max quote amount to be deposited
   */
  const calcMaxQuoteForDeposit = useCallback(
    async (amount: string) => {
      console.log('params: ', amount, token0.decimals)
      const baseAmount = parseUnits(amount, token0.decimals)
      console.log(`ZapContract?.calcMaxQuoteForDeposit params: `, curveAddress, formatEther(baseAmount))
      const quoteAmount = await ZapContract?.calcMaxQuoteForDeposit(curveAddress, baseAmount)
      console.log(`ZapContract?.calcMaxQuoteForDeposit(${formatEther(baseAmount)}): `, quoteAmount)
      console.log('quote amount: ', formatUnits(quoteAmount, token1.decimals))
    },
    [ZapContract, curveAddress]
  )

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
    },
    [ZapContract, curveAddress]
  )

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
    },
    [ZapContract, curveAddress]
  )

  const calcMaxDepositAmount = useCallback(() => {}, [ZapContract])

  const zapFromBase = useCallback(() => {}, [ZapContract])

  const zapFromQuote = useCallback(() => {}, [ZapContract])

  return {
    calcSwapAmountForZapFromBase,
    calcMaxQuoteForDeposit,
    calcMaxDepositAmountGivenBase,
    calcMaxDepositAmountGivenQuote,
    calcMaxDepositAmount,
    zapFromBase,
    zapFromQuote
  }
}
