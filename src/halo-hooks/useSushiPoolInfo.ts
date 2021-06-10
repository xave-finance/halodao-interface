import { useCallback } from 'react'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo } from './usePoolInfo'
import PAIR from '../constants/sushiAbis/pair.json'
import { useContract } from 'hooks/useContract'
import { formatEther } from '@ethersproject/units'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'

// BSC Testnet
const BUSD_BNB_LPT_ADDRESS = '0x71e3c96C21D734bFA64D652EA99611Aa64F7D9F6'
const BUSD_XSGD_LPT_ADDRESS = '0x9A0eeceDA5c0203924484F5467cEE4321cf6A189'
const BUSD_TOKEN_ADDRESS = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'
const BNB_TOKEN_ADDRESS = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
const XSGD_TOKEN_ADDRESS = '0x979b00492a1cbf691b1fae867936c01bab0b8c4d'

// Matic Testnet

export const useSushiPoolInfo = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const BUSD_BNB_SLP_Contract = useContract(BUSD_BNB_LPT_ADDRESS, PAIR)
  const BUSD_XSGD_SLP_Contract = useContract(BUSD_XSGD_LPT_ADDRESS, PAIR)

  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []
    /**
     * tokenPrice[0] BUSD
     * tokenPrice[1] xSGD
     * tokenPrice[2] BNB
     */
    const tokenPrice = await getTokensUSDPrice(GetPriceBy.id, ['busd', 'xsgd', 'binancecoin'])

    // ? - Add reserves in liqudity and
    const BUSD_BNB_RESERVES = await BUSD_BNB_SLP_Contract?.getReserves()
    const BUSD_XSGD_RESERVES = await BUSD_XSGD_SLP_Contract?.getReserves()

    //console.log(tokenPrices)

    if (!chainId) return { poolsInfo, tokenAddresses }

    /**
     * For now we'll hardcode the pool token addresses & other info
     */
    for (const poolAddress of poolAddresses) {
      if (poolAddress === BUSD_BNB_LPT_ADDRESS) {
        poolsInfo.push({
          pair: 'BUSD/BNB',
          address: getAddress(poolAddress),
          addLiquidityUrl: `https://app.sushi.com/add/${BNB_TOKEN_ADDRESS}/${BUSD_TOKEN_ADDRESS}`,
          liquidity:
            +formatEther(BUSD_BNB_RESERVES[0]) * tokenPrice['binancecoin'] +
            +formatEther(BUSD_BNB_RESERVES[1]) * tokenPrice['busd'],
          tokens: [
            {
              address: getAddress(BUSD_TOKEN_ADDRESS),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(chainId, getAddress(BUSD_TOKEN_ADDRESS), 18, 'BUSD', 'Binance USD')
            },
            {
              address: getAddress(BNB_TOKEN_ADDRESS),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(chainId, getAddress(BNB_TOKEN_ADDRESS), 18, 'BNB', 'Wrapped BNB')
            }
          ],
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'BUSD/BNB SLP')
        })
      } else if (poolAddress === BUSD_XSGD_LPT_ADDRESS) {
        poolsInfo.push({
          pair: 'xSGD/BUSD',
          address: getAddress(poolAddress),
          addLiquidityUrl: `https://app.sushi.com/add/${BUSD_TOKEN_ADDRESS}/${XSGD_TOKEN_ADDRESS}`,
          liquidity:
            +formatEther(BUSD_XSGD_RESERVES[0]) * tokenPrice['xsgd'] +
            +formatEther(BUSD_XSGD_RESERVES[1]) * tokenPrice['busd'],
          tokens: [
            {
              address: getAddress(BUSD_TOKEN_ADDRESS),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(chainId, getAddress(BUSD_TOKEN_ADDRESS), 18, 'BUSD', 'Binance USD')
            },
            {
              address: getAddress(XSGD_TOKEN_ADDRESS),
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(chainId, getAddress(XSGD_TOKEN_ADDRESS), 18, 'xSGD', 'Singapore Dollar')
            }
          ],
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'BUSD/xSGD SLP')
        })
      }
    }

    tokenAddresses.push(BUSD_TOKEN_ADDRESS)
    tokenAddresses.push(BNB_TOKEN_ADDRESS)
    tokenAddresses.push(XSGD_TOKEN_ADDRESS)

    return { poolsInfo, tokenAddresses }
  }, [poolAddresses, chainId, BUSD_BNB_SLP_Contract, BUSD_XSGD_SLP_Contract])

  return fetchPoolInfo
}
