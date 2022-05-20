import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useEffect, useState } from 'react'
import { HALO_TOKEN_ADDRESS, HALODAO_EXCHANGE_SUBGRAPH_HOSTED, HALODAO_EXCHANGE_SUBGRAPH_STUDIO } from '../constants'
import { ChainId } from '@halodao/sdk'
import { GetPriceBy, getTokensUSDPrice } from '../utils/coingecko'
import { useActiveWeb3React } from '../hooks'

interface TVL {
  liquidityPools: number
  farm: number
  vestingBalance: number
}

const useTVLInfo = () => {
  const { chainId } = useActiveWeb3React()
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
    const APIURL = chainId ? HALODAO_EXCHANGE_SUBGRAPH_STUDIO[chainId] : ''
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(tvlQuery)
    })
  }

  async function getHosted() {
    const APIURL = chainId ? HALODAO_EXCHANGE_SUBGRAPH_HOSTED[chainId] : ''
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(tvlQuery)
    })
  }

  async function setData(data: any) {
    // Get RNBW price
    const usdPrice = await getTokensUSDPrice(GetPriceBy.address, [HALO_TOKEN_ADDRESS[chainId as ChainId] ?? ''])

    setTvlInfo({
      liquidityPools: data.data.tvls[0].liquidityPools,
      farm: data.data.tvls[0].farm,
      vestingBalance: data.data.tvls[0].vestingBalance * usdPrice[HALO_TOKEN_ADDRESS[chainId as ChainId] ?? '']
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
  }, [chainId]) //eslint-disable-line

  return tvlInfo
}
export default useTVLInfo
