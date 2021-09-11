import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { Token } from '@sushiswap/sdk'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { AMM_ZAP_ADDRESS } from '../../constants'
import ZAP_ABI from 'constants/haloAbis/Zap.json'

export const useAddRemoveLiquidity = (address: string, token0: Token, token1: Token) => {
  const CurveContract = useContract(address, CURVE_ABI, true)
  const addTransaction = useTransactionAdder()

  const { chainId } = useActiveWeb3React()
  const zapAddress = chainId ? AMM_ZAP_ADDRESS[chainId] : undefined
  const ZapContract = useContract(zapAddress, ZAP_ABI, true)

  const viewDeposit = useCallback(
    async (amount: BigNumber) => {
      const res = await CurveContract?.viewDeposit(amount)
      // console.log('res:', res)
      console.log('-----------')
      console.log(`viewDeposit response: (amount: ${amount})`)
      console.log('lp tokens:', formatEther(res[0]))
      console.log('token 0:', formatUnits(res[1][0], token0.decimals))
      console.log('token 1:', formatUnits(res[1][1], token1.decimals))
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
    async (quoteAmount: string, quoteRate: number, baseRate: number) => {
      // const baseAmount = await ZapContract?.calcMaxBaseForDeposit(address, parseUnits(quoteAmount, token1.decimals))
      // console.log('calcMaxBaseForDeposit: ', baseAmount.toString())

      // const baseNumeraire = Number(formatUnits(baseAmount, token0.decimals)) * (100 * baseRate)
      // const quoteNumeraire = Number(quoteAmount) * (100 * quoteRate)
      // const totalNumeraire = baseNumeraire + quoteNumeraire
      // console.log('numeraires: ', baseNumeraire, quoteNumeraire, totalNumeraire)
      // await viewDeposit(parseEther(`${totalNumeraire}`))

      // const depositAmount0 = Number(quoteAmount) * (100 * quoteRate) * 2
      // await viewDeposit(parseEther(`${depositAmount0}`))

      const depositAmount = Number(quoteAmount) * 2
      const { base, quote } = await viewDeposit(parseEther(`${depositAmount}`))
      return {
        deposit: depositAmount,
        base,
        quote
      }
    },
    [CurveContract, token0, token1]
  )

  const previewDepositGivenBase = useCallback(
    async (baseAmount: string, baseRate: number) => {
      const depositAmount = Number(baseAmount) * (100 * baseRate) * 2
      const { base, quote } = await viewDeposit(parseEther(`${depositAmount}`))
      return {
        deposit: depositAmount,
        base,
        quote
      }
    },
    [CurveContract, token0, token1]
  )

  return { viewDeposit, deposit, viewWithdraw, withdraw, previewDepositGivenQuote, previewDepositGivenBase }
}
