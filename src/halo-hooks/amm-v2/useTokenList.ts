import { ChainId, Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { useState, useCallback, useEffect } from 'react'
import { getContract } from 'utils'
import { getHaloAddresses } from 'utils/haloAddresses'
import CustomPoolABI from '../../constants/haloAbis/CustomPool.json'
import VaultABI from '../../constants/haloAbis/Vault.json'
import useToken from '../tokens/useToken'

const ETH: { [key in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 18, 'ETH', 'Ether')
}

const WETH: { [key in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    18,
    'WETH',
    'Wrapped ETH'
  ),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped ETH'),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped ETH'
  )
}

const WBTC: { [key in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    8,
    'WBTC',
    'Wrapped BTC'
  )
}

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

  const commonTokens = useCallback(() => {
    const commonTokens: Token[] = []
    if (!chainId) return commonTokens

    if (ETH[chainId]) {
      commonTokens.push(ETH[chainId]!)
    }
    if (WETH[chainId]) {
      commonTokens.push(WETH[chainId]!)
    }
    if (WBTC[chainId]) {
      commonTokens.push(WBTC[chainId]!)
    }

    return commonTokens
  }, [chainId])

  const fetchTokenList = useCallback(async () => {
    if (!chainId) return

    setTokenListLoading(true)
    setTokenListError(null)

    try {
      // Get vault pool ids of each pool
      const vaultPoolIds = await getVaultPoolIds(haloAddresses.ammV2.pools.enabled)

      // Get all token addresses from all pools
      const poolTokenAddresses = await getAllTokenAddresses(vaultPoolIds)

      // Transform all token addresses to tokens
      const poolTokens = await addressesToTokens(poolTokenAddresses)

      // Add commonly used tokens
      const allTokens = [...commonTokens(), ...poolTokens]

      setTokenList(allTokens)
    } catch (error) {
      console.error('fetchTokenList() throw an error: ', error)
      setTokenListError(error)
    } finally {
      setTokenListLoading(false)
    }
  }, [chainId, haloAddresses, getVaultPoolIds, getAllTokenAddresses, addressesToTokens, commonTokens])

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
