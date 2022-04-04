import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { useContract } from 'hooks/useContract'
import { PoolData } from 'pages/Tailwind/Pool/models/PoolData'
import { consoleLog } from 'utils/simpleLogger'
import FxPoolABI from '../../constants/haloAbis/FxPool.json'

const usePoolCalculator = (pool: PoolData) => {
  const tokens = [pool.tokens[0].token, pool.tokens[1].token]
  const tokenBalances = [pool.tokens[0].balance, pool.tokens[1].balance]
  const fxPoolContract = useContract(pool.address, FxPoolABI)

  const calculateOtherTokenIn = async (tokenAmount: string, tokenIndex: number) => {
    if (tokenAmount.trim() === '') return BigNumber.from(0)

    const tokenDecimals = tokens[tokenIndex].decimals
    let depositNumeraire = 0

    if (tokenIndex === 0) {
      // base given
      const amount = Number(tokenAmount)
      const rate = Number(formatUnits(pool.tokens[0].rate, 8))
      consoleLog('rate: ', rate)
      const numeraire = amount * rate
      consoleLog('numeraire: ', numeraire)
      const weight = Number(formatEther(pool.tokens[0].weight))
      consoleLog('weight: ', weight)
      const multiplier = weight > 0 ? 1 / weight : 2
      consoleLog('multiplier: ', multiplier)
      depositNumeraire = numeraire * multiplier
      consoleLog('depositNumeraire: ', depositNumeraire)

      const res = await fxPoolContract?.viewDeposit(parseUnits(`${depositNumeraire}`))
      console.log('viewDeposit response >>', res)
      return res[1][1]
    } else {
      const amount = Number(tokenAmount)
      const rate = Number(formatUnits(pool.tokens[1].rate, 8))
      consoleLog('rate: ', rate)
      const numeraire = amount * rate
      consoleLog('numeraire: ', numeraire)
      const weight = Number(formatEther(pool.tokens[1].weight))
      consoleLog('weight: ', weight)
      const multiplier = weight > 0 ? 1 / weight : 2
      consoleLog('multiplier: ', multiplier)
      depositNumeraire = numeraire * multiplier
      consoleLog('depositNumeraire: ', depositNumeraire)

      const res = await fxPoolContract?.viewDeposit(parseUnits(`${depositNumeraire}`))
      console.log('viewDeposit response >>', res)
      return res[1][0]
    }

    return parseUnits('0')

    // const tokenDecimals = tokens[tokenIndex].decimals
    // const tokenBalance = tokenBalances[tokenIndex]
    // const tokenAmountBN = parseUnits(tokenAmount, tokenDecimals)
    // const otherTokenIndex = tokenIndex === 0 ? 1 : 0
    // const otherTokenBalance = tokenBalances[otherTokenIndex]

    // return tokenAmountBN.mul(otherTokenBalance).div(tokenBalance)
  }

  const calculateLptOut = async (token0Amount: string, token1Amount: string) => {
    if (token0Amount.trim() === '') return BigNumber.from(0)

    const amount = Number(token0Amount)
    const rate = Number(formatUnits(pool.tokens[0].rate, 8))
    consoleLog('rate: ', rate)
    const numeraire = amount * rate
    consoleLog('numeraire: ', numeraire)
    const weight = Number(formatEther(pool.tokens[0].weight))
    consoleLog('weight: ', weight)
    const multiplier = weight > 0 ? 1 / weight : 2
    consoleLog('multiplier: ', multiplier)
    const depositNumeraire = numeraire * multiplier
    consoleLog('depositNumeraire: ', depositNumeraire)

    const res = await fxPoolContract?.viewDeposit(parseUnits(`${depositNumeraire}`))
    return res[0]

    // const token0AmountBN = parseUnits(token0Amount, tokens[0].decimals)
    // const token1AmountBN = parseUnits(token1Amount, tokens[1].decimals)

    // // @todo: call viewDeposit to get the actual LPT to receive value
    // return pool.totalSupply
    //   .div(tokenBalances[0])
    //   .mul(token0AmountBN)
    //   .add(pool.totalSupply.div(tokenBalances[1]).mul(token1AmountBN))
  }

  const calculateTokensOut = (lptAmount: BigNumber) => {
    // formula taken from balancer frontend:
    // amount.mul(poolTokenBalances[i]).div(poolTotalSupply)
    return [
      lptAmount.mul(pool.tokens[0].balance).div(pool.totalSupply),
      lptAmount.mul(pool.tokens[1].balance).div(pool.totalSupply)
    ]
  }

  return {
    calculateOtherTokenIn,
    calculateLptOut,
    calculateTokensOut
  }
}

export default usePoolCalculator
