import { useCallback } from 'react'
import { PoolIdLpTokenMap } from 'utils/poolInfo'
import { PoolInfo, PoolProvider } from './usePoolInfo'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { formatEther } from 'ethers/lib/utils'
import { ERC20_ABI } from 'constants/abis/erc20'
import { getContract } from 'utils'

import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'

export const useHaloPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const { account, library, chainId } = useActiveWeb3React()
  const fetchPoolInfo = useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId || !library) {
      return { poolsInfo, tokenAddresses }
    }

    for (const map of pidLpTokenMap) {
      const poolAddress = getAddress(map.lpToken)
      const CurveContract = getContract(poolAddress, CURVE_ABI, library, account ?? undefined)

      const token0Address = await CurveContract?.derivatives(0)
      const token1Address = await CurveContract?.derivatives(1)
      const Token0Contract = getContract(token0Address, ERC20_ABI, library)
      const Token1Contract = getContract(token1Address, ERC20_ABI, library)
      const token0Symbol = await Token0Contract?.symbol()
      const token1Symbol = await Token1Contract?.symbol()
      const token0Decimals = await Token0Contract?.decimals()
      const token1Decimals = await Token1Contract?.decimals()
      const totalLiquidityValue = await CurveContract?.liquidity()
      const curveDecimals = await CurveContract?.decimals()

      poolsInfo.push({
        pid: map.pid,
        pair: `${token0Symbol}/${token1Symbol}`,
        address: poolAddress,
        addLiquidityUrl: `https://app.halodao.comm/#/pool`,
        liquidity: +formatEther(totalLiquidityValue.total_),
        tokens: [
          {
            address: token0Address,
            balance: +formatEther(totalLiquidityValue.individual_[0]),
            weightPercentage: 50,
            asToken: new Token(chainId, token0Address, token0Decimals, token0Symbol, token0Symbol)
          },
          {
            address: token1Address,
            balance: +formatEther(totalLiquidityValue.individual_[1]),
            weightPercentage: 50,
            asToken: new Token(chainId, token1Address, token1Decimals, token1Symbol, token1Symbol)
          }
        ],
        asToken: new Token(chainId, poolAddress, curveDecimals, 'HLP', 'HLP'),
        allocPoint: 0,
        provider: PoolProvider.Halo
      })

      tokenAddresses.push(token0Address)
      tokenAddresses.push(token1Address)
    }

    return { poolsInfo, tokenAddresses }
  }, [pidLpTokenMap, chainId, library, account])

  return fetchPoolInfo
}
