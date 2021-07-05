import { BALANCER_LPTOKEN_POOL_MAP } from 'constants/pools'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

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

export const getBalancerPoolAddress = (lpTokenAddress: string) => {
  const matchingKeys = Object.keys(BALANCER_LPTOKEN_POOL_MAP).filter(a => a === lpTokenAddress.toLowerCase())
  if (matchingKeys.length) {
    return BALANCER_LPTOKEN_POOL_MAP[matchingKeys[0]]
  } else {
    // if balancer pool address is not found, return lpTokenAddress
    return lpTokenAddress
  }
}

export const getBalancerLPTokenAddress = (poolAddress: string) => {
  let lpTokenAddress: string | undefined = undefined
  const lpTokens = Object.keys(BALANCER_LPTOKEN_POOL_MAP)
  for (const lpToken of lpTokens) {
    if (BALANCER_LPTOKEN_POOL_MAP[lpToken] === poolAddress.toLowerCase()) {
      lpTokenAddress = lpToken
      break
    }
  }
  // if lpTokenAddress is not found, return poolAddress
  return lpTokenAddress ?? poolAddress
}
