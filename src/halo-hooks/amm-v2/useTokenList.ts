import { Token } from '@halodao/sdk'
import useHaloAddresses from 'halo-hooks/useHaloAddresses'
import { useState, useCallback, useEffect } from 'react'
import { consoleLog } from 'utils/simpleLogger'
import useToken from '../tokens/useToken'

const useTokenList = () => {
  const haloAddresses = useHaloAddresses()
  const { addressesToTokens } = useToken()

  const [tokenList, setTokenList] = useState<Token[]>([])
  const [tokenListLoading, setTokenListLoading] = useState(false)
  const [tokenListError, setTokenListError] = useState<unknown | null>(null)

  const fetchTokenList = useCallback(async () => {
    consoleLog('[useTokenList] fetching token list...')
    setTokenListLoading(true)
    setTokenListError(null)

    try {
      // Get all token addresses from all pools
      // const allPools = [...haloAddresses.ammV2.pools.genesis, ...haloAddresses.ammV2.pools.enabled]
      const allPools = [...haloAddresses.ammV2.pools.enabled]
      const poolTokenAddresses: string[] = []
      for (const pool of allPools) {
        for (const asset of pool.assets) {
          if (!poolTokenAddresses.includes(asset)) {
            poolTokenAddresses.push(asset)
          }
        }
      }

      // Transform all token addresses to tokens
      const poolTokens = await addressesToTokens(poolTokenAddresses)

      consoleLog('[useTokenList] token list fetched!')
      setTokenList(poolTokens)
    } catch (error) {
      console.error('[useTokenList] fetchTokenList() throws an error: ', error)
      setTokenListError(error)
    } finally {
      setTokenListLoading(false)
    }
  }, [haloAddresses, addressesToTokens])

  useEffect(() => {
    fetchTokenList()
  }, [haloAddresses]) // eslint-disable-line

  return {
    tokenList,
    tokenListLoading,
    tokenListError,
    fetchTokenList
  }
}

export default useTokenList
