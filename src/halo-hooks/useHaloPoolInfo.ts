import { useCallback } from 'react'
import { PoolIdLpTokenMap } from 'utils/poolInfo'
import { PoolInfo, PoolProvider } from './usePoolInfo'
import { ERC20_ABI } from 'constants/abis/erc20'
import { getContract } from 'utils'
import { Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { getCustomTokenSymbol } from 'utils/tokens'
import { useContract, useHALORewardsContract } from '../hooks/useContract'
import { AmmRewardsVersion } from '../utils/ammRewards'
import VaultABI from 'constants/haloAbis/Vault.json'
import CustomPoolABI from 'constants/haloAbis/CustomPool.json'
import { BigNumber } from 'ethers'
import { getHaloAddresses } from 'utils/haloAddresses'

export const useHaloPoolInfo = (pidLpTokenMap: PoolIdLpTokenMap[]) => {
  const { account, library, chainId } = useActiveWeb3React()
  const haloAddresses = getHaloAddresses(chainId)
  const ammRewards = useHALORewardsContract(AmmRewardsVersion.Latest)
  const VaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)

  return useCallback(async () => {
    const poolsInfo: PoolInfo[] = []
    const tokenAddresses: string[] = []

    if (!chainId || !library || !VaultContract) {
      return { poolsInfo, tokenAddresses }
    }

    const promises: Promise<string>[] = []
    for (const map of pidLpTokenMap) {
      const CustomPoolContract = getContract(map.lpToken, CustomPoolABI, library)
      promises.push(CustomPoolContract.getPoolId())
    }
    const vaultPoolIds = await Promise.all(promises)

    for (const [i, map] of pidLpTokenMap.entries()) {
      const poolAddress = getAddress(map.lpToken)
      const [poolTokens, rewardAddress] = await Promise.all([
        VaultContract.getPoolTokens(vaultPoolIds[i]),
        ammRewards?.rewarder(map.pid)
      ])
      const [token0Address, token1Address] = poolTokens.tokens
      const Token0Contract = getContract(token0Address, ERC20_ABI, library)
      const Token1Contract = getContract(token1Address, ERC20_ABI, library)
      const CustomPoolContract = getContract(map.lpToken, CustomPoolABI, library)

      const [token0Symbol, token1Symbol, token0Decimals, token1Decimals, poolDecimals] = await Promise.all([
        Token0Contract?.symbol(),
        Token1Contract?.symbol(),
        Token0Contract?.decimals(),
        Token1Contract?.decimals(),
        CustomPoolContract?.decimals()
      ])

      const token0SymbolProper = getCustomTokenSymbol(chainId, token0Address) || token0Symbol
      const token1SymbolProper = getCustomTokenSymbol(chainId, token1Address) || token1Symbol
      const token0Denom = BigNumber.from(10).pow(token0Decimals)
      const token1Denom = BigNumber.from(10).pow(token1Decimals)

      poolsInfo.push({
        pid: map.pid,
        pair: `${token0SymbolProper}/${token1SymbolProper}`,
        address: poolAddress,
        addLiquidityUrl: `https://app.halodao.com/#/pool`,
        liquidity: 0, // @todo: calculate total liquidity in USD value
        tokens: [
          {
            address: token0Address,
            mainnetAddress: token0Address,
            balance: poolTokens.balances[0].div(token0Denom).toNumber(),
            weightPercentage: 50,
            asToken: new Token(chainId, token0Address, token0Decimals, token0SymbolProper, token0SymbolProper)
          },
          {
            address: token1Address,
            mainnetAddress: token1Address,
            balance: poolTokens.balances[1].div(token1Denom).toNumber(),
            weightPercentage: 50,
            asToken: new Token(chainId, token1Address, token1Decimals, token1SymbolProper, token1SymbolProper)
          }
        ],
        asToken: new Token(chainId, poolAddress, poolDecimals, 'HLP', 'HLP'),
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
