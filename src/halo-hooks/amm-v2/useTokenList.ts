import { Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { useState, useCallback, useEffect } from 'react'
import { getContract } from 'utils'
import { getHaloAddresses } from 'utils/haloAddresses'
import CustomPoolABI from '../../constants/haloAbis/CustomPool.json'
import VaultABI from '../../constants/haloAbis/Vault.json'
import useToken from '../tokens/useToken'

const useTokenList = () => {
  const { chainId, library } = useActiveWeb3React()
  const haloAddresses = getHaloAddresses(chainId)
  const VaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)
  const { addressesToTokens } = useToken()

  const [tokenList, setTokenList] = useState<Token[]>([])
  const [tokenListLoading, setTokenListLoading] = useState(false)
  const [tokenListError, setTokenListError] = useState<unknown | null>(null)

  const getVaultPoolIds = useCallback(
    async (poolAddresses: string[]) => {
      if (!library) return []

      const promises: Promise<string>[] = []
      for (const poolAddress of poolAddresses) {
        const CustomPoolContract = getContract(poolAddress, CustomPoolABI, library)
        promises.push(CustomPoolContract.getPoolId())
      }
      return await Promise.all(promises)
    },
    [library]
  )

  const getAllTokenAddresses = useCallback(
    async (poolIds: string[]) => {
      if (!VaultContract) return []

      const promises: Promise<any>[] = []
      for (const poolId of poolIds) {
        promises.push(VaultContract.getPoolTokens(poolId))
      }
      const poolTokens = await Promise.all(promises)

      const tokenAddresses: string[] = []
      for (const poolToken of poolTokens) {
        for (const tokenAddress of poolToken.tokens) {
          if (!tokenAddresses.includes(tokenAddress)) {
            tokenAddresses.push(tokenAddress)
          }
        }
      }

      return tokenAddresses
    },
    [VaultContract]
  )

  const fetchTokenList = useCallback(async () => {
    console.log('fetching token list...')
    setTokenListLoading(true)
    setTokenListError(null)

    try {
      // Get vault pool ids of each pool
      const vaultPoolIds = await getVaultPoolIds(haloAddresses.ammV2.pools.enabled)

      // Get all token addresses from all pools
      const tokenAddresses = await getAllTokenAddresses(vaultPoolIds)

      // Transform all token addresses to tokens
      const allTokens = await addressesToTokens(tokenAddresses)
      console.log('Done fetching token list!')
      console.log('allTokens: ', allTokens)

      setTokenList(allTokens)
    } catch (error) {
      console.log('Error fetching token list!')
      console.error('fetchTokenList() throw an error: ', error)
      setTokenListError(error)
    } finally {
      setTokenListLoading(false)
    }
  }, [haloAddresses, getVaultPoolIds, getAllTokenAddresses, addressesToTokens])

  useEffect(() => {
    fetchTokenList()
  }, [chainId]) // eslint-disable-line

  return {
    tokenList,
    tokenListLoading,
    tokenListError,
    fetchTokenList
  }
}

export default useTokenList
