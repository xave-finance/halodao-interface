import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'

export async function subgraphRequest(url: string, query: {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: jsonToGraphQLQuery({ query }) })
  })
  const { data } = await res.json()
  return data || {}
}

export const getPoolLiquidity = (poolInfo: PoolInfo, tokenPrice: TokenPrice) => {
  let sumWeight = 0
  let sumValue = 0
  // console.log(`Calculating liquidity for: ${poolInfo.pair}...`)
  // console.log('PoolInfo: ', poolInfo)
  for (const tokenInfo of poolInfo.tokens) {
    const price = tokenPrice[tokenInfo.address]
    if (!price) {
      continue
    }
    sumWeight += tokenInfo.weightPercentage / 100
    sumValue += price * tokenInfo.balance
    // console.log('SUM weight, value: ', sumWeight, sumValue)
  }
  // console.log('FINAL SUM weight, value: ', sumWeight, sumValue)
  if (sumWeight > 0) {
    // console.log('Returned calculated value: ', sumValue / sumWeight)
    return sumValue / sumWeight
  } else {
    // console.log('Returned balancer data: ', poolInfo.liquidity)
    return poolInfo.liquidity
  }
}
