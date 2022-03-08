import { Token } from '@halodao/sdk'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

const usePoolCalculator = ({ tokens, tokenBalances }: { tokens: Token[]; tokenBalances: BigNumber[] }) => {
  const calculateOtherTokenIn = (amount: string, tokenIndex: number) => {
    if (amount.trim() === '') {
      return BigNumber.from(0)
    }

    const tokenDecimals = tokens[tokenIndex].decimals
    const tokenBalance = tokenBalances[tokenIndex]
    const tokenAmount = parseUnits(amount, tokenDecimals)
    const otherTokenIndex = tokenIndex === 0 ? 1 : 0
    const otherTokenBalance = tokenBalances[otherTokenIndex]

    return tokenAmount.mul(otherTokenBalance).div(tokenBalance)
  }

  return {
    calculateOtherTokenIn
  }
}

export default usePoolCalculator
