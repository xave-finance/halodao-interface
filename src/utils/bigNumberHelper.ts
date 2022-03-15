import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export const bigNumberToNumber = (bn: BigNumber, decimals = 18) => {
  return parseFloat(formatUnits(bn.toString(), decimals))
}
