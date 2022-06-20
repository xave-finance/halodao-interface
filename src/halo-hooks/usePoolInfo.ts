import { ChainId, Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { groupByPoolProvider } from 'utils/poolInfo'
import { useBalancerPoolInfo } from './useBalancerPoolInfo'
import { useHaloPoolInfo } from './useHaloPoolInfo'
import { useSushiPoolInfo } from './useSushiPoolInfo'
import { useUniPoolInfo } from './useUniPoolInfo'
import { HALODAO_EXCHANGE_SUBGRAPH_STUDIO, HALODAO_EXCHANGE_SUBGRAPH_HOSTED } from '../constants'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

export enum PoolProvider {
  Balancer,
  Uni,
  Sushi,
  Halo
}

export type PoolInfo = {
  pid: number
  pair: string
  address: string
  addLiquidityUrl: string
  liquidity: number
  tokens: PoolTokenInfo[]
  asToken: Token
  allocPoint: number
  provider: PoolProvider
  rewarderAddress?: string
}

export type PoolTokenInfo = {
  address: string
  mainnetAddress: string
  balance: number
  weightPercentage: number
  asToken: Token
}

export const usePoolInfo = (lpTokenAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const { balancer, uni, sushi, halo } = groupByPoolProvider(lpTokenAddresses, chainId)
  const fetchBalancerPoolInfo = useBalancerPoolInfo(balancer)
  const fetchSushiPoolInfo = useSushiPoolInfo(sushi)
  const fetchUniPoolInfo = useUniPoolInfo(uni)
  const fetchHaloPoolInfo = useHaloPoolInfo(halo)

  return useCallback(async () => {
    let poolsInfo: PoolInfo[] = []
    let tokenAddresses: string[] = []

    if (balancer.length) {
      const balancerResult = await fetchBalancerPoolInfo()
      poolsInfo = [...poolsInfo, ...balancerResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...balancerResult.tokenAddresses]
    }

    if (sushi.length) {
      const sushiResult = await fetchSushiPoolInfo()
      poolsInfo = [...poolsInfo, ...sushiResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...sushiResult.tokenAddresses]
    }

    if (uni.length) {
      const uniResult = await fetchUniPoolInfo()
      poolsInfo = [...poolsInfo, ...uniResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...uniResult.tokenAddresses]
    }

    if (halo.length) {
      const haloResult = await fetchHaloPoolInfo()
      poolsInfo = [...poolsInfo, ...haloResult.poolsInfo]
      tokenAddresses = [...tokenAddresses, ...haloResult.tokenAddresses]
    }

    return { poolsInfo, tokenAddresses }
  }, [balancer, uni, sushi, halo, fetchBalancerPoolInfo, fetchSushiPoolInfo, fetchUniPoolInfo, fetchHaloPoolInfo])
}

interface PoolSubgraphInfo {
  id: string
  earnedFees: number
}

export const usePoolsEarnedFees = () => {
  const [info, setInfo] = useState<PoolSubgraphInfo[]>([])

  const poolQuery = `
      query{
        pools{
          id
          earnedFees
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
      query: gql(poolQuery)
    })
  }

  async function getHosted() {
    const APIURL = HALODAO_EXCHANGE_SUBGRAPH_HOSTED[ChainId.MAINNET]
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(poolQuery)
    })
  }

  async function setData(data: PoolSubgraphInfo[]) {
    setInfo(data)
  }

  useEffect(() => {
    try {
      getStudio()
        .then(data => {
          setData(data.data.pools)
        })
        .catch(err => {
          console.log('Error fetching data on Studio: ', err)
          console.log('Trying to get data in Hosted')
          getHosted().then(data => {
            setData(data.data.pools)
          })
        })
    } catch (e) {
      console.error('Error fetching data in Studio and Hosted')
    }
  }, [ChainId]) //eslint-disable-line

  return info
}
