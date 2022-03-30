import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useState } from 'react'
import { HALODAO_EXCHANGE_SUBGRAPH } from '../constants'
import { ChainId } from '@halodao/sdk'

interface TVL {
  liquidityPools: number
  farm: number
  vestingBalance: number
}

const useTVLInfo = () => {
  const [tvlInfo, setTvlInfo] = useState<TVL>({
    liquidityPools: 0,
    farm: 0,
    vestingBalance: 0
  })
  const APIURL = HALODAO_EXCHANGE_SUBGRAPH[ChainId.MAINNET]

  const tvlQuery = `
    query {
      tvls(first: 1) {
        id
        liquidityPools
        farm
        vestingBalance
      }
    }
  `
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  })
  client
    .query({
      query: gql(tvlQuery)
    })
    .then(data => {
      setTvlInfo(data.data)
    })
    .catch(err => {
      console.log('Error fetching data: ', err)
    })

  return tvlInfo
}

export default useTVLInfo
