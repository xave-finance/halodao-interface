import { BigNumber } from 'ethers'

export const bigNumberToNumber = (bn: BigNumber, denomDecimals = 18) => {
  const denom = BigNumber.from(10).pow(denomDecimals)
  return bn.div(denom).toNumber()
}
