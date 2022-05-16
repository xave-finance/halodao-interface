import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useEffect, useState } from 'react'
import { HALO_TOKEN_ADDRESS, HALODAO_EXCHANGE_SUBGRAPH_HOSTED, HALODAO_EXCHANGE_SUBGRAPH_STUDIO } from '../constants'
import { ChainId } from '@halodao/sdk'
import { GetPriceBy, getTokensUSDPrice } from '../utils/coingecko'

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
  async function getStudio() {
    const APIURL = HALODAO_EXCHANGE_SUBGRAPH_STUDIO[ChainId.MAINNET]
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(tvlQuery)
    })
  }

  async function getHosted() {
    const APIURL = HALODAO_EXCHANGE_SUBGRAPH_HOSTED[ChainId.MAINNET]
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(tvlQuery)
    })
  }

  async function setData(data: any) {
    // Get Mainnet RNBW price
    const usdPrice = await getTokensUSDPrice(GetPriceBy.address, [HALO_TOKEN_ADDRESS[ChainId.MAINNET] ?? ''])

    setTvlInfo({
      liquidityPools: data.data.tvls[0].liquidityPools,
      farm: data.data.tvls[0].farm,
      vestingBalance: data.data.tvls[0].vestingBalance * usdPrice[HALO_TOKEN_ADDRESS[ChainId.MAINNET] ?? '']
    })
  }

  useEffect(() => {
    try {
      getStudio()
        .then(data => {
          setData(data)
        })
        .catch(err => {
          console.log('Error fetching data on Studio: ', err)
          console.log('Trying to get data in Hosted')
          getHosted().then(data => {
            setData(data)
          })
        })
    } catch (e) {
      console.error('Error fetching data in Studio and Hosted')
    }
  }, [ChainId]) //eslint-disable-line

  return tvlInfo
}
export default useTVLInfo
