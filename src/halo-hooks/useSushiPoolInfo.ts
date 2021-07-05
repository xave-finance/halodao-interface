import { useCallback } from 'react'
import { ChainId, Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo, PoolProvider } from './usePoolInfo'
import PAIR from '../constants/sushiAbis/pair.json'
import { useContract, useTokenContract } from 'hooks/useContract'
import { formatEther } from '@ethersproject/units'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'
import { PoolIdLpTokenMap } from 'utils/poolInfo'
import {
  BNB_TOKEN_ADDRESS,
  SUSHI_BUSD_BNB_ADDRESS,
  BUSD_TOKEN_ADDRESS,
  SUSHI_BUSD_XSGD_ADDRESS,
  SUSHI_XSGD_ADDRESS,
  XSGD_TOKEN_ADDRESS
} from '../constants/pools'

export const useSushiPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const { chainId } = useActiveWeb3React()

  // BSC Testnet Pairs
  const BusdBnbSLPContract = useContract(SUSHI_BUSD_BNB_ADDRESS, PAIR)
  const BusdXsgdSLPContract = useContract(SUSHI_BUSD_XSGD_ADDRESS, PAIR)

  // Matic Testnet Pairs
  const SLPTokenContract = useTokenContract(SUSHI_XSGD_ADDRESS)

  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    // get token prices from main net
    const tokenPrice = await getTokensUSDPrice(GetPriceBy.id, ['busd', 'xsgd', 'binancecoin', 'sushi'])

    // get reserves from the contract
    let busdBnbReserves: any
    let busdXsgdReserves: any
    let slpTotalSupply = 0

    if (chainId === ChainId.BSC_TESTNET) {
      busdBnbReserves = await BusdBnbSLPContract?.getReserves()
      busdXsgdReserves = await BusdXsgdSLPContract?.getReserves()
    }

    if (chainId === ChainId.MATIC_TESTNET) {
      slpTotalSupply = +formatEther(await SLPTokenContract?.totalSupply())
    }

    if (!chainId) return { poolsInfo, tokenAddresses }

    /**
     * For now we'll hardcode the pool token addresses & other info
     * Total pool value is calculated as reserves * coingecko token price in USD
     */
    pidLpTokenMap.forEach(map => {
      if (map.lpToken === SUSHI_BUSD_BNB_ADDRESS) {
        poolsInfo.push({
          pid: map.pid,
          pair: 'BUSD/BNB',
          address: getAddress(map.lpToken),
          addLiquidityUrl: `https://app.sushi.com/add/${BNB_TOKEN_ADDRESS}/${BUSD_TOKEN_ADDRESS}`,
          liquidity:
            +formatEther(busdBnbReserves[0]) * tokenPrice['binancecoin'] +
            +formatEther(busdBnbReserves[1]) * tokenPrice['busd'],
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
          asToken: new Token(chainId, getAddress(map.lpToken), 18, 'SLP', 'BUSD/BNB SLP'),
          allocPoint: 0,
          provider: PoolProvider.Sushi
        })
      } else if (map.lpToken === SUSHI_BUSD_XSGD_ADDRESS) {
        poolsInfo.push({
          pid: map.pid,
          pair: 'xSGD/BUSD',
          address: getAddress(map.lpToken),
          addLiquidityUrl: `https://app.sushi.com/add/${BUSD_TOKEN_ADDRESS}/${XSGD_TOKEN_ADDRESS}`,
          liquidity:
            +formatEther(busdXsgdReserves[0]) * tokenPrice['xsgd'] +
            +formatEther(busdXsgdReserves[1]) * tokenPrice['busd'],
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
          asToken: new Token(chainId, getAddress(map.lpToken), 18, 'SLP', 'BUSD/xSGD SLP'),
          allocPoint: 0,
          provider: PoolProvider.Sushi
        })
      } else if (map.lpToken === SUSHI_XSGD_ADDRESS) {
        poolsInfo.push({
          pid: map.pid,
          pair: 'SUSHI/xSGD',
          address: getAddress(map.lpToken),
          addLiquidityUrl: `https://app.sushi.com/`,
          liquidity: slpTotalSupply || 1 * (tokenPrice['sushi'] + tokenPrice['xsgd']),
          tokens: [
            {
              address: '',
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(chainId, getAddress(BUSD_TOKEN_ADDRESS), 18, 'SUSHI', 'Sushi Token')
            },
            {
              address: '',
              balance: 0,
              weightPercentage: 0.5,
              asToken: new Token(chainId, getAddress(XSGD_TOKEN_ADDRESS), 18, 'xSGD', 'Singapore Dollar')
            }
          ],
          asToken: new Token(chainId, getAddress(map.lpToken), 18, 'SLP', 'SUSHI/xSGD SLP'),
          allocPoint: 0,
          provider: PoolProvider.Sushi
        })
      }
    })

    tokenAddresses.push(BUSD_TOKEN_ADDRESS)
    tokenAddresses.push(BNB_TOKEN_ADDRESS)
    tokenAddresses.push(XSGD_TOKEN_ADDRESS)

    return { poolsInfo, tokenAddresses }
  }, [pidLpTokenMap, chainId, BusdBnbSLPContract, BusdXsgdSLPContract, SLPTokenContract])

  return fetchPoolInfo
}
