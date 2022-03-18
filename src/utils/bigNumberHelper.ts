import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export const bigNumberToNumber = (bn: BigNumber, decimals = 18) => {
  return parseFloat(formatUnits(bn.toString(), decimals))
}

export const scale = (input: BigNumber | string, decimalPlaces: number) => {
  const unscaled = typeof input === 'string' ? BigNumber.from(input) : input
  const scalePow = BigNumber.from(decimalPlaces.toString())
  const scaleMul = BigNumber.from(10).pow(scalePow)
  return unscaled.mul(scaleMul)
}
