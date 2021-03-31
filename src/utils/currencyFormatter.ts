import { CurrencyAmount, JSBI } from '@sushiswap/sdk'
import { parseEther } from 'ethers/lib/utils'

export const toFormattedCurrency = (
  amount: number,
  decimals: number = 2,
  symbol: string = '$',
  separator: string = ','
) => {
  const currencyAmount = CurrencyAmount.ether(JSBI.BigInt(parseEther('' + amount)))
  const formattedAmount = currencyAmount.toFixed(decimals, { groupSeparator: separator })
  return `${symbol} ${formattedAmount}`
}
