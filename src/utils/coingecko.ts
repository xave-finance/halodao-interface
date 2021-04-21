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
