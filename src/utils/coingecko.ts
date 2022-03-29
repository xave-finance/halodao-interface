import { COINGECKO_API_URL } from '../constants'
import { getAddress } from 'ethers/lib/utils'

export enum GetPriceBy {
  id,
  address
}

export async function getTokensUSDPrice(by: GetPriceBy, addressesOrIds: string[]) {
  const uri = by === GetPriceBy.id ? 'price?ids=' : 'token_price/ethereum?contract_addresses='
  const concatString = addressesOrIds.join('%2C')
  const prices: { [adressOrId: string]: number } = {}

  try {
    const url = `${COINGECKO_API_URL}/simple/${uri}${concatString}&vs_currencies=usd`

    const response = await fetch(url)
    const data = await response.json()

    for (const key in data) {
      const price = data[key].usd
      const addressOrId = by === GetPriceBy.id ? key : getAddress(key)
      prices[addressOrId] = price
    }

    return prices
  } catch (err) {
    console.error('Error fetching usd price: ', err)
    return prices
  }
}

export async function getInitialTokenUSDPrice(symbol: string, date: string) {
  let price = 1
  try {
    const url = `${COINGECKO_API_URL}/coins/${symbol}/history?date=${date}`
    const response = await fetch(url)
    const data = await response.json()
    price = data.market_data.current_price.usd
    return price
  } catch (err) {
    console.error(`Error fetching usd price: ${symbol}`, err)
    return price
  }
}

export function getTxDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}
