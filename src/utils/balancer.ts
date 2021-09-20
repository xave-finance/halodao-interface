import { ChainId } from '@sushiswap/sdk'
import { BALANCER_LPTOKEN_POOL_MAP, BALANCER_LPTOKEN_POOL_MAP_KOVAN } from 'constants/pools'
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

export const getBalancerPoolAddress = (lpTokenAddress: string, chainId: ChainId | undefined) => {
  const lpTokenPoolMap = chainId === ChainId.KOVAN ? BALANCER_LPTOKEN_POOL_MAP_KOVAN : BALANCER_LPTOKEN_POOL_MAP
  const matchingKeys = Object.keys(lpTokenPoolMap).filter(a => a === lpTokenAddress.toLowerCase())
  if (matchingKeys.length) {
    return lpTokenPoolMap[matchingKeys[0]]
  } else {
    // if balancer pool address is not found, return lpTokenAddress
    return lpTokenAddress
  }
}

export const getBalancerLPTokenAddress = (poolAddress: string, chainId: ChainId | undefined) => {
  let lpTokenAddress: string | undefined = undefined
  const lpTokenPoolMap = chainId === ChainId.KOVAN ? BALANCER_LPTOKEN_POOL_MAP_KOVAN : BALANCER_LPTOKEN_POOL_MAP
  const lpTokens = Object.keys(lpTokenPoolMap)
  for (const lpToken of lpTokens) {
    if (lpTokenPoolMap[lpToken] === poolAddress.toLowerCase()) {
      lpTokenAddress = lpToken
      break
    }
  }
  // if lpTokenAddress is not found, return poolAddress
  return lpTokenAddress ?? poolAddress
}
