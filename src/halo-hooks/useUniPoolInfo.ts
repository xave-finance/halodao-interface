import { useCallback } from 'react'
import { ChainId, Token, WETH } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { PoolInfo, PoolProvider } from './usePoolInfo'
import UNI_V2_ABI from '../constants/haloAbis/UniV2.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import { formatEther } from '@ethersproject/units'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'
import { PoolIdLpTokenMap } from 'utils/poolInfo'
import { getContract } from 'utils'

export const useUniPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const { chainId, library, account } = useActiveWeb3React()

  const UNI_WETH_ADDRESS = WETH[chainId || ChainId.MAINNET].address

  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId || !library) {
      return { poolsInfo, tokenAddresses }
    }

    for (const map of pidLpTokenMap) {
      const poolAddress = getAddress(map.lpToken)

      const PoolContract = getContract(poolAddress, UNI_V2_ABI, library, account ?? undefined)
      const token1Address = getAddress(await PoolContract?.token0())
      const token2Address = getAddress(await PoolContract?.token1())
      const totalReserves = await PoolContract?.getReserves()

      let token1Symbol = ''
      if (token1Address === UNI_WETH_ADDRESS) {
        token1Symbol = 'ETH'
      } else {
        const Token1Contract = getContract(token1Address, ERC20_ABI, library, account ?? undefined)
        token1Symbol = await Token1Contract?.symbol()
      }

      let token2Symbol = ''
      if (token2Address === UNI_WETH_ADDRESS) {
        token2Symbol = 'ETH'
      } else {
        const Token2Contract = getContract(token2Address, ERC20_ABI, library, account ?? undefined)
        token2Symbol = await Token2Contract?.symbol()
      }

      const tokenPrice = await getTokensUSDPrice(GetPriceBy.address, [token1Address, token2Address])

      const token1Param = token1Symbol === 'ETH' ? 'ETH' : token1Address
      const token2Param = token2Symbol === 'ETH' ? 'ETH' : token2Address

      poolsInfo.push({
        pid: map.pid,
        pair: `${token1Symbol}/${token2Symbol}`,
        address: getAddress(map.lpToken),
        addLiquidityUrl: `https://app.uniswap.org/#/add/v2/${token1Param}/${token2Param}`,
        liquidity:
          +formatEther(totalReserves[0]) * tokenPrice[token1Address] +
          +formatEther(totalReserves[1]) * tokenPrice[token2Address],
        tokens: [
          {
            address: token1Address,
            balance: +formatEther(totalReserves[0]),
            weightPercentage: 50,
            asToken: new Token(chainId, token1Address, 18, token1Symbol, token1Symbol)
          },
          {
            address: token2Address,
            balance: +formatEther(totalReserves[1]),
            weightPercentage: 50,
            asToken: new Token(chainId, token2Address, 18, token2Symbol, token2Symbol)
          }
        ],
        asToken: new Token(chainId, poolAddress, 18, 'UNI_V2', 'UNI_V2'),
        allocPoint: 0,
        provider: PoolProvider.Uni
      })

      tokenAddresses.push(token1Address)
      tokenAddresses.push(token2Address)
    }

    return { poolsInfo, tokenAddresses }
  }, [pidLpTokenMap, chainId, library, account])

  return fetchPoolInfo
}
