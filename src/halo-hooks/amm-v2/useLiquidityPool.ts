import { BigNumber } from 'ethers'
import VaultABI from '../../constants/haloAbis/Vault.json'
import CustomPoolABI from '../../constants/haloAbis/CustomPool.json'
import ERC20ABI from '../../constants/abis/erc20.json'
import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { getContract } from 'utils'
import { useLPTokenAddresses } from 'halo-hooks/useRewards'
import { PoolExternalIdsMap } from 'pages/Tailwind/Pool/types'
import { getCustomTokenSymbol } from 'utils/tokens'
import { ChainId, Token } from '@halodao/sdk'
import { PoolData } from 'pages/Tailwind/Pool/models/PoolData'
import { AmmRewardsVersion, getAmmRewardsContractAddress } from 'utils/ammRewards'
import { Web3Provider } from '@ethersproject/providers'
import HALO_REWARDS_ABI from '../../constants/haloAbis/Rewards.json'
import { getHaloAddresses } from 'utils/haloAddresses'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import { bigNumberToNumber } from 'utils/bigNumberHelper'

const getAmmRewardsContract = (chainId: ChainId, library: Web3Provider) => {
  const address = getAmmRewardsContractAddress(chainId, AmmRewardsVersion.Latest)
  return address ? getContract(address, HALO_REWARDS_ABI, library) : undefined
}

export const useGetPools = () => {
  const { chainId, library } = useActiveWeb3React()
  const rewardsPoolAddresses = useLPTokenAddresses()
  const haloAddresses = getHaloAddresses(chainId)

  const getAmmRewardsPools = async () => {
    if (!chainId || !library) return []
    const AmmRewardsContract = getAmmRewardsContract(chainId, library)

    try {
      const poolLengthResponse = await AmmRewardsContract?.poolLength()
      const poolLength = poolLengthResponse.toNumber()

      const promises: Promise<string>[] = []
      for (let pid = 0; pid < poolLength; pid++) {
        promises.push(AmmRewardsContract?.lpToken(`${pid}`))
      }
      const addresses = await Promise.all(promises)
      return addresses
    } catch (e) {
      console.error('useLiquidityPool(v2) failed to get AmmRewards lpTokens', e)
      return []
    }
  }

  const getPools = useCallback(async () => {
    if (!library) return undefined

    const enabledPoolAddresses = haloAddresses.ammV2.pools.enabled
    const enabledPoolExternalIdsMap: PoolExternalIdsMap = {}
    for (const addr of enabledPoolAddresses) {
      enabledPoolExternalIdsMap[addr] = {
        rewardsPoolId: undefined,
        vaultPoolId: undefined
      }
    }

    const disabledPoolAddresses = haloAddresses.ammV2.pools.disabled
    const disabledPoolExternalIdsMap: PoolExternalIdsMap = {}
    for (const addr of disabledPoolAddresses) {
      disabledPoolExternalIdsMap[addr] = {
        rewardsPoolId: undefined,
        vaultPoolId: undefined
      }
    }

    try {
      // Get Vault poolId of each pool
      const promises: Promise<string>[] = []
      const poolAddresses = [...enabledPoolAddresses, ...disabledPoolAddresses]
      for (const poolAddress of poolAddresses) {
        const CustomPoolContract = getContract(poolAddress, CustomPoolABI, library)
        promises.push(CustomPoolContract.getPoolId())
      }

      const vaultPoolIds = await Promise.all(promises)
      for (const [i, poolId] of vaultPoolIds.entries()) {
        if (i < enabledPoolAddresses.length) {
          const addr = enabledPoolAddresses[i]
          enabledPoolExternalIdsMap[addr].vaultPoolId = poolId
        } else {
          const addr = disabledPoolAddresses[i]
          disabledPoolExternalIdsMap[addr].vaultPoolId = poolId
        }
      }

      // Get Rewards poolId of each pool
      const rewardsPoolAddresses = await getAmmRewardsPools()
      for (const [i, address] of rewardsPoolAddresses.entries()) {
        if (enabledPoolAddresses.includes(address)) {
          const addr = enabledPoolAddresses[i]
          enabledPoolExternalIdsMap[addr].rewardsPoolId = i
        } else {
          const addr = disabledPoolAddresses[i]
          disabledPoolExternalIdsMap[addr].rewardsPoolId = i
        }
      }

      return {
        enabled: enabledPoolExternalIdsMap,
        disabled: disabledPoolExternalIdsMap
      }
    } catch (err) {
      console.error('useLiquidityPool(v2) failed to get vault pool ids: ', err)
    }

    return undefined
  }, [library, rewardsPoolAddresses, haloAddresses]) // eslint-disable-line

  return getPools
}

export const useGetPoolData = () => {
  const { library, chainId, account } = useActiveWeb3React()
  const haloAddresses = getHaloAddresses(chainId)
  const VaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)

  const getPoolData = async (
    poolAddress: string,
    vaultPoolId: string,
    rewardsPoolId: number
  ): Promise<PoolData | undefined> => {
    if (!VaultContract || !library || !chainId || !account) return undefined

    const AmmRewardsContract = getAmmRewardsContract(chainId, library)
    if (!AmmRewardsContract) return undefined

    const poolTokens = await VaultContract.getPoolTokens(vaultPoolId)
    const token0Address = poolTokens.tokens[0]
    const token1Address = poolTokens.tokens[1]

    const LpTokenContract = getContract(poolAddress, ERC20ABI, library)
    const Token0Contract = getContract(token0Address, ERC20ABI, library)
    const Token1Contract = getContract(token1Address, ERC20ABI, library)

    const [
      token0Symbol,
      token1Symbol,
      token0Decimals,
      token1Decimals,
      totalSupply,
      userBalance,
      userStaked,
      userEarned
    ] = await Promise.all([
      Token0Contract?.symbol(),
      Token1Contract?.symbol(),
      Token0Contract?.decimals(),
      Token1Contract?.decimals(),
      LpTokenContract?.totalSupply(),
      LpTokenContract?.balanceOf(account),
      AmmRewardsContract?.userInfo(rewardsPoolId, account),
      AmmRewardsContract?.pendingRewardToken(rewardsPoolId, account)
    ])

    const token0SymbolProper = getCustomTokenSymbol(chainId, token0Address) || token0Symbol
    const token1SymbolProper = getCustomTokenSymbol(chainId, token1Address) || token1Symbol
    const tokens = [
      new Token(chainId, token0Address, token0Decimals, token0SymbolProper, token0SymbolProper),
      new Token(chainId, token1Address, token1Decimals, token1SymbolProper, token1SymbolProper)
    ]

    const token0Rate = parseUnits('0.02', 8) // @todo: get rates from token[0] assimilator contract
    const token1Rate = parseUnits('1', 8) // @todo: get rates from token[1] assimilator contract
    const token0Numeraire = bigNumberToNumber(poolTokens.balances[0].div(1e8).mul(token0Rate), token0Decimals)
    const token1Numeraire = bigNumberToNumber(poolTokens.balances[1].div(1e8).mul(token1Rate), token1Decimals)
    const totalLiquidity = token0Numeraire + token1Numeraire
    const token0Weight = token0Numeraire / totalLiquidity
    const token1Weight = token1Numeraire / totalLiquidity

    const poolData = {
      vaultPoolId,
      rewardsPoolId,
      address: poolAddress,
      name: `${tokens[0].symbol}/${tokens[1].symbol}`,
      totalSupply: totalSupply,
      totalLiquidity: parseUnits(`${totalLiquidity}`),
      tokens: [
        {
          token: tokens[0],
          balance: poolTokens.balances[0],
          weight: parseUnits(`${token0Weight}`), // @todo: calculate token 0 weight: totalLiquidityNumeraire / totalToken0Numeraire
          rate: token0Rate
        },
        {
          token: tokens[1],
          balance: poolTokens.balances[1],
          weight: parseUnits(`${token1Weight}`), // @todo: calculate token 0 weight: totalLiquidityNumeraire / totalToken0Numeraire
          rate: token1Rate
        }
      ],
      userInfo: {
        held: userBalance,
        staked: userStaked.amount,
        earned: userEarned
      }
    }

    return poolData
  }

  return getPoolData
}
