import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { PoolData } from 'pages/Tailwind/Pool/models/PoolData'

//const usePoolCalculator = ({ tokens, tokenBalances }: { tokens: Token[]; tokenBalances: BigNumber[] }) => {
const usePoolCalculator = (pool: PoolData) => {
  const tokens = [pool.tokens[0].token, pool.tokens[1].token]
  const tokenBalances = [pool.tokens[0].balance, pool.tokens[1].balance]

  const calculateOtherTokenIn = (tokenAmount: string, tokenIndex: number) => {
    if (tokenAmount.trim() === '') return BigNumber.from(0)

    const tokenDecimals = tokens[tokenIndex].decimals
    const tokenBalance = tokenBalances[tokenIndex]
    const tokenAmountBN = parseUnits(tokenAmount, tokenDecimals)
    const otherTokenIndex = tokenIndex === 0 ? 1 : 0
    const otherTokenBalance = tokenBalances[otherTokenIndex]

    return tokenAmountBN.mul(otherTokenBalance).div(tokenBalance)
  }

  const calculateLptOut = (token0Amount: string, token1Amount: string) => {
    if (token0Amount.trim() === '') return BigNumber.from(0)

    const token0AmountBN = parseUnits(token0Amount, tokens[0].decimals)
    const token1AmountBN = parseUnits(token1Amount, tokens[1].decimals)

    // @todo: call viewDeposit to get the actual LPT to receive value
    return pool.totalSupply
      .div(tokenBalances[0])
      .mul(token0AmountBN)
      .add(pool.totalSupply.div(tokenBalances[1]).mul(token1AmountBN))
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
