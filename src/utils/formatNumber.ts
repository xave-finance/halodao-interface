import numeral from 'numeral'

export enum NumberFormat {
  long,
  usd,
  usdLong,
  percent,
  percentShort
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
    return num.toString().match(re)![0]
  } else {
    return '0.0'
  }
}
