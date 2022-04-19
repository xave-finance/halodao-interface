import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
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
  const fetchTVLInfo = useCallback(async () => {
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
        setTvlInfo({
          liquidityPools: data.data.tvls[0].liquidityPools,
          farm: data.data.tvls[0].farm,
          vestingBalance: data.data.tvls[0].vestingBalance
        })
      })
      .catch(err => {
        console.log('Error fetching data: ', err)
      })
  }, [])//eslint-disable-line

  useEffect(() => {
    fetchTVLInfo()
  }, [fetchTVLInfo, ChainId]) //eslint-disable-line

  return tvlInfo
}
export default useTVLInfo
