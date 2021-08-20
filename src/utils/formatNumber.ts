import numeral from 'numeral'
import ethers from 'ethers'

export enum NumberFormat {
  long,
  usd,
  usdLong,
  percent,
  percentShort,
  short
}

export function formatNumber(number: number, key?: NumberFormat) {
  if (number < 0.0001) number = 0

  let format = '0.[000]'
  if (number > 1000) format = '0.[0]a'
  if (number < 1) format = '0.[0000]'

  if (key === NumberFormat.long) {
    format = '0,000.[00]'
    if (number < 1) format = '0.[0000]'
  }

  if (key === NumberFormat.short) {
    format = '0.[00]'
    if (number > 1000) format = '0.[0]a'
  }

  if (key === NumberFormat.usd) {
    format = '$(0.[00])'
    if (number > 1000) format = '$(0.[0]a)'
    if (number < 1) format = '$(0.[0000])'
  }

  if (key === NumberFormat.usdLong) {
    format = '$(0,000.[00])'
    if (number < 1) format = '$(0.[0000])'
  }

  if (key === NumberFormat.percent) format = '(0.[00])%'
  if (key === NumberFormat.percentShort) format = '(0)%'

  return numeral(number)
    .format(format)
    .toUpperCase()
}

export function toFixed(num: number, fixed: number) {
  if (num > 0.00001) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
    const matches = num.toString().match(re)
    return matches ? matches[0] : num.toString()
  } else {
    return '0.0'
  }
}

export function toNumber(num: ethers.BigNumber): number {
  return parseFloat(ethers.utils.formatEther(num.toString()))
}
