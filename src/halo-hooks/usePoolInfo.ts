import { ChainId, Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useBalancerPoolInfo } from './useBalancerPoolInfo'
import { useSushiPoolInfo } from './useSushiPoolInfo'

export type PoolInfo = {
  pair: string
  address: string
  addLiquidityUrl: string
  liquidity: number
  tokens: PoolTokenInfo[]
  asToken: Token
}

export type PoolTokenInfo = {
  address: string
  balance: number
  weightPercentage: number
  asToken: Token
}

export const usePoolInfo = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()

  const fetchBalancerPoolInfo = useBalancerPoolInfo(
    chainId === ChainId.KOVAN || chainId === ChainId.MAINNET ? poolAddresses : []
  )
  const fetchSushiPoolInfo = useSushiPoolInfo(
    chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC || chainId === ChainId.MATIC_TESTNET ? poolAddresses : []
  )

  return useMemo(() => {
    if (chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC || chainId === ChainId.MATIC_TESTNET) {
      return fetchSushiPoolInfo
    } else {
      return fetchBalancerPoolInfo
    }
  }, [chainId, fetchBalancerPoolInfo, fetchSushiPoolInfo])
}
