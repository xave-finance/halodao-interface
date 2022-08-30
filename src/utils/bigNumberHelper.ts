import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export const bigNumberToNumber = (bn: BigNumber, decimals = 18) => {
  const strValue = formatUnits(bn.toString(), decimals)
  const parts = strValue.split('.')
  const decimalDigits = parts[1] ?? ''
  if (decimalDigits.length > 15) {
    return parseFloat(parts[0] + '.' + decimalDigits.slice(0, 15))
  } else {
    return parseFloat(strValue)
  }
}

export const numberToBigNumber = (n: number, decimals = 18) => {
  return parseUnits(`${n.toFixed(decimals)}`, decimals)
}

export const scale = (input: BigNumber | string, decimalPlaces: number) => {
  const unscaled = typeof input === 'string' ? BigNumber.from(input) : input
  const scalePow = BigNumber.from(decimalPlaces.toString())
  const scaleMul = BigNumber.from(10).pow(scalePow)
  return unscaled.mul(scaleMul)
}
