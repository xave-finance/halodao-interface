import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { useContract } from 'hooks/useContract'
import { PoolData } from 'pages/Tailwind/Pool/models/PoolData'
import { consoleLog } from 'utils/simpleLogger'
import FxPoolABI from '../../constants/haloAbis/FxPool.json'

const usePoolCalculator = (pool: PoolData) => {
  // const tokens = [pool.tokens[0].token, pool.tokens[1].token]
  const fxPoolContract = useContract(pool.address, FxPoolABI)

  const calculateOtherTokenIn = async (tokenAmount: string, tokenIndex: number) => {
    if (tokenAmount.trim() === '') return BigNumber.from(0)

    const amount = Number(tokenAmount)
    consoleLog('amount: ', amount)
    const rate = Number(formatUnits(pool.tokens[tokenIndex].rate, 8))
    consoleLog('rate: ', rate)
    const numeraire = amount * rate
    consoleLog('numeraire: ', numeraire)
    const weight = Number(formatEther(pool.tokens[tokenIndex].weight))
    consoleLog('weight: ', weight)
    const multiplier = weight > 0 ? 1 / weight : 2
    consoleLog('multiplier: ', multiplier)
    const depositNumeraire = numeraire * multiplier
    consoleLog('[usePoolCalculator] viewDeposit param: ', depositNumeraire)

    const res = await fxPoolContract?.viewDeposit(parseUnits(`${depositNumeraire}`))
    consoleLog('[usePoolCalculator] viewDeposit response >>', res.toString())

    return tokenIndex === 0 ? res[1][1] : res[1][0]
  }

  const calculateLptOut = async (token0Amount: string, token1Amount: string) => {
    if (token0Amount.trim() === '') return BigNumber.from(0)

    const amount0 = Number(token0Amount)
    const rate0 = Number(formatUnits(pool.tokens[0].rate, 8))
    const numeraire0 = amount0 * rate0
    consoleLog('[usePoolCalculator] numeraire0: ', numeraire0)

    const amount1 = Number(token1Amount)
    const rate1 = Number(formatUnits(pool.tokens[1].rate, 8))
    const numeraire1 = amount1 * rate1
    consoleLog('[usePoolCalculator] numeraire1: ', numeraire1)

    const depositNumeraire = numeraire0 + numeraire1
    consoleLog('[usePoolCalculator] viewDeposit param: ', depositNumeraire)

    const res = await fxPoolContract?.viewDeposit(parseUnits(`${depositNumeraire}`))
    consoleLog('[usePoolCalculator] viewDeposit response >>', res.toString())

    return res[0]
  }

  const calculateTokensOut = async (lptAmount: BigNumber): Promise<BigNumber[]> => {
    consoleLog('[usePoolCalculator] viewWithdraw param >>', formatUnits(lptAmount))
    const res = await fxPoolContract?.viewWithdraw(lptAmount)
    consoleLog('[usePoolCalculator] viewWithdraw response >>', res.toString())
    const [baseOut, quoteOut] = res
    consoleLog('[usePoolCalculator] viewWithdraw response >>', baseOut.toString(), quoteOut.toString())
    return [baseOut, quoteOut]
  }

  return {
    calculateOtherTokenIn,
    calculateLptOut,
    calculateTokensOut
  }
}

export default usePoolCalculator
