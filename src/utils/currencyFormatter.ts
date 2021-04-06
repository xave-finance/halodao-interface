import { CurrencyAmount, JSBI } from '@sushiswap/sdk'
import { parseEther } from 'ethers/lib/utils'

export const toFormattedCurrency = (amount: number, decimals = 2, symbol = '$', separator = ',') => {
  const currencyAmount = CurrencyAmount.ether(JSBI.BigInt(parseEther('' + amount)))
  const formattedAmount = currencyAmount.toFixed(decimals, { groupSeparator: separator })
  return `${symbol} ${formattedAmount}`
}
