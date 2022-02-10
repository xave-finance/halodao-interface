import { useCallback } from 'react'
import { PoolIdLpTokenMap } from 'utils/poolInfo'
import { PoolInfo, PoolProvider } from './usePoolInfo'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { formatEther } from 'ethers/lib/utils'
import { ERC20_ABI } from 'constants/abis/erc20'
import { getContract } from 'utils'

import { Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { getCustomTokenSymbol } from 'utils/tokens'
import { useHALORewardsContract } from '../hooks/useContract'
import { AmmRewardsVersion } from '../utils/ammRewards'

export const useHaloPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const { account, library, chainId } = useActiveWeb3React()
  const ammRewards = useHALORewardsContract(AmmRewardsVersion.Latest)

  return useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId || !library) {
      return { poolsInfo, tokenAddresses }
    }

    for (const map of pidLpTokenMap) {
      const poolAddress = getAddress(map.lpToken)
      const CurveContract = getContract(poolAddress, CURVE_ABI, library, account ?? undefined)

      const [token0Address, token1Address, rewardAddress] = await Promise.all([
        CurveContract?.derivatives(0),
        CurveContract?.derivatives(1),
        ammRewards?.rewarder(map.pid)
      ])
      const Token0Contract = getContract(token0Address, ERC20_ABI, library)
      const Token1Contract = getContract(token1Address, ERC20_ABI, library)

      const [
        token0Symbol,
        token1Symbol,
        token0Decimals,
        token1Decimals,
        totalLiquidityValue,
        curveDecimals
      ] = await Promise.all([
        Token0Contract?.symbol(),
        Token1Contract?.symbol(),
        Token0Contract?.decimals(),
        Token1Contract?.decimals(),
        CurveContract?.liquidity(),
        CurveContract?.decimals()
      ])

      const token0SymbolProper = getCustomTokenSymbol(chainId, token0Address) || token0Symbol
      const token1SymbolProper = getCustomTokenSymbol(chainId, token1Address) || token1Symbol

      poolsInfo.push({
        pid: map.pid,
        pair: `${token0SymbolProper}/${token1SymbolProper}`,
        address: poolAddress,
        addLiquidityUrl: `https://app.halodao.com/#/pool`,
        liquidity: +formatEther(totalLiquidityValue.total_),
        tokens: [
          {
            address: token0Address,
            mainnetAddress: token0Address,
            balance: +formatEther(totalLiquidityValue.individual_[0]),
            weightPercentage: 50,
            asToken: new Token(chainId, token0Address, token0Decimals, token0SymbolProper, token0SymbolProper)
          },
          {
            address: token1Address,
            mainnetAddress: token1Address,
            balance: +formatEther(totalLiquidityValue.individual_[1]),
            weightPercentage: 50,
            asToken: new Token(chainId, token1Address, token1Decimals, token1SymbolProper, token1SymbolProper)
          }
        ],
        asToken: new Token(chainId, poolAddress, curveDecimals, 'HLP', 'HLP'),
        allocPoint: 0,
        provider: PoolProvider.Halo,
        rewarderAddress: rewardAddress === undefined ? '' : rewardAddress
      })

      tokenAddresses.push(token0Address)
      tokenAddresses.push(token1Address)
    }
    return { poolsInfo, tokenAddresses }
  }, [pidLpTokenMap, chainId, library, account]) //eslint-disable-line
}
