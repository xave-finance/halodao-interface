import { useCallback } from 'react'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo } from './usePoolInfo'

export const useSushiPoolInfo = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()

  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId) return { poolsInfo, tokenAddresses }

    /**
     * For now we'll hardcode the pool token addresses & other info
     */
    for (const poolAddress of poolAddresses) {
      if (poolAddress === '0x71e3c96C21D734bFA64D652EA99611Aa64F7D9F6') {
        poolsInfo.push({
          pair: 'BUSD/BNB',
          address: getAddress(poolAddress),
          addLiquidityUrl: `https://app.sushi.com/add/${poolAddress}`,
          liquidity: 0,
          tokens: [
            {
              address: getAddress('0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(
                chainId,
                getAddress('0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'),
                18,
                'BUSD',
                'Binance USD'
              )
            },
            {
              address: getAddress('0xae13d989dac2f0debff460ac112a837c89baa7cd'),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(
                chainId,
                getAddress('0xae13d989dac2f0debff460ac112a837c89baa7cd'),
                18,
                'BNB',
                'Wrapped BNB'
              )
            }
          ],
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'BUSD/BNB SLP')
        })
      } else if (poolAddress === '0x9A0eeceDA5c0203924484F5467cEE4321cf6A189') {
        poolsInfo.push({
          pair: 'BUSD/xSGD',
          address: getAddress(poolAddress),
          addLiquidityUrl: `https://app.sushi.com/add/${poolAddress}`,
          liquidity: 0,
          tokens: [
            {
              address: getAddress('0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(
                chainId,
                getAddress('0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'),
                18,
                'BUSD',
                'Binance USD'
              )
            },
            {
              address: getAddress('0x979b00492a1cbf691b1fae867936c01bab0b8c4d'),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(
                chainId,
                getAddress('0x979b00492a1cbf691b1fae867936c01bab0b8c4d'),
                18,
                'xSGD',
                'Singapore Dollar'
              )
            }
          ],
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'BUSD/xSGD SLP')
        })
      }
    }

    tokenAddresses.push('0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee')
    tokenAddresses.push('0xae13d989dac2f0debff460ac112a837c89baa7cd')
    tokenAddresses.push('0x979b00492a1cbf691b1fae867936c01bab0b8c4d')

    return { poolsInfo, tokenAddresses }
  }, [poolAddresses, chainId])

  return fetchPoolInfo
}
