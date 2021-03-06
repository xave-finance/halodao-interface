import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useEffect, useState } from 'react'
import { HALO_TOKEN_ADDRESS, HALODAO_EXCHANGE_SUBGRAPH_HOSTED, HALODAO_EXCHANGE_SUBGRAPH_STUDIO } from '../constants'
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
  async function getMainnetHaloBalance(url: any) {
    const client = new ApolloClient({
      uri: url,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(tvlQuery)
    })
  }

  async function getStudio() {
    const APIURL = chainId ? HALODAO_EXCHANGE_SUBGRAPH_STUDIO[chainId] : ''
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    const { data } = await client.query({
      query: gql(tvlQuery)
    })

    const tvlData = { ...data.tvls[0] }

    if (chainId !== 1) {
      const haloBalance = await getMainnetHaloBalance(HALODAO_EXCHANGE_SUBGRAPH_STUDIO[1])
      tvlData.vestingBalance = haloBalance.data.tvls[0].vestingBalance
    }

    return tvlData
  }

  async function getHosted() {
    const APIURL = chainId ? HALODAO_EXCHANGE_SUBGRAPH_HOSTED[chainId] : ''
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    const { data } = await client.query({
      query: gql(tvlQuery)
    })

    const tvlData = { ...data.tvls[0] }

    if (chainId !== 1) {
      const haloBalance = await getMainnetHaloBalance(HALODAO_EXCHANGE_SUBGRAPH_HOSTED[1])
      tvlData.vestingBalance = haloBalance.data.tvls[0].vestingBalance
    }

    return tvlData
  }

  async function setData(data: any) {
    // Get RNBW price
    const usdPrice = await getTokensUSDPrice(GetPriceBy.address, [HALO_TOKEN_ADDRESS[1] ?? ''])

    setTvlInfo({
      liquidityPools: data.liquidityPools,
      farm: data.farm,
      vestingBalance: Number(data.vestingBalance) * usdPrice[HALO_TOKEN_ADDRESS[1] ?? '']
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
          getHosted()
            .then(data => {
              setData(data)
            })
            .catch(e => {
              console.log('Error fetching data on either Studio or Hosted: ', e)
            })
        })
    } catch (e) {
      console.error('Error fetching data in Studio and Hosted')
    }
  }, [chainId]) //eslint-disable-line

  return tvlInfo
}
export default useTVLInfo
