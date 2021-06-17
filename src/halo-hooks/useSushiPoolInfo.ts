import { useCallback } from 'react'
import { ChainId, Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo } from './usePoolInfo'
import PAIR from '../constants/sushiAbis/pair.json'
import { useContract, useTokenContract } from 'hooks/useContract'
import { formatEther } from '@ethersproject/units'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'
import { useAllocPoints } from './useRewards'

// BSC Testnet
const BUSD_BNB_LPT_ADDRESS = '0x71e3c96C21D734bFA64D652EA99611Aa64F7D9F6'
const BUSD_XSGD_LPT_ADDRESS = '0x9A0eeceDA5c0203924484F5467cEE4321cf6A189'
const BUSD_TOKEN_ADDRESS = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'
const BNB_TOKEN_ADDRESS = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
const XSGD_TOKEN_ADDRESS = '0x979b00492a1cbf691b1fae867936c01bab0b8c4d'

// Matic Testnet
const SUSHI_xSGD_ADDRESS = '0xDbcc6EA9C5C2B62f6226a99B1E0EC089B0927a59'

export const useSushiPoolInfo = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const allocPoints = useAllocPoints(poolAddresses)

  // BSC Testnet Pairs
  const BUSD_BNB_SLP_Contract = useContract(BUSD_BNB_LPT_ADDRESS, PAIR)
  const BUSD_XSGD_SLP_Contract = useContract(BUSD_XSGD_LPT_ADDRESS, PAIR)

  // Matic Testnet Pairs

  const slpTokenContract = useTokenContract(SUSHI_xSGD_ADDRESS)

  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    // get token prices from main net
    const tokenPrice = await getTokensUSDPrice(GetPriceBy.id, ['busd', 'xsgd', 'binancecoin', 'sushi'])

    // get reserves from the contract

    let BUSD_BNB_RESERVES, BUSD_XSGD_RESERVES, SLP_BALANCE_VALUE

    if (chainId === ChainId.BSC_TESTNET) {
      BUSD_BNB_RESERVES = await BUSD_BNB_SLP_Contract?.getReserves()
      BUSD_XSGD_RESERVES = await BUSD_XSGD_SLP_Contract?.getReserves()
    }

    if (chainId === ChainId.MATIC_TESTNET) {
      SLP_BALANCE_VALUE = +formatEther(await slpTokenContract?.totalSupply())
    }

    if (!chainId) return { poolsInfo, tokenAddresses }

    /**
     * For now we'll hardcode the pool token addresses & other info
     * Total pool value is calculated as reserves * coingecko token price in USD
     */

    for (const [index, poolAddress] of poolAddresses.entries()) {
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
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'BUSD/BNB SLP'),
          allocPoint: allocPoints[index]
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
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'BUSD/xSGD SLP'),
          allocPoint: allocPoints[index]
        })
      } else if (poolAddress === SUSHI_xSGD_ADDRESS) {
        poolsInfo.push({
          pair: 'SUSHI/xSGD',
          address: getAddress(poolAddress),
          addLiquidityUrl: `https://app.sushi.com/`,
          liquidity: SLP_BALANCE_VALUE || 1 * (tokenPrice['sushi'] + tokenPrice['xsgd']),
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
          asToken: new Token(chainId, getAddress(poolAddress), 18, 'SLP', 'SUSHI/xSGD SLP'),
          allocPoint: allocPoints[index]
        })
      }
    }

    tokenAddresses.push(BUSD_TOKEN_ADDRESS)
    tokenAddresses.push(BNB_TOKEN_ADDRESS)
    tokenAddresses.push(XSGD_TOKEN_ADDRESS)

    return { poolsInfo, tokenAddresses }
  }, [poolAddresses, chainId, allocPoints, BUSD_BNB_SLP_Contract, BUSD_XSGD_SLP_Contract, slpTokenContract])

  return fetchPoolInfo
}
