import VaultABI from '../../constants/haloAbis/Vault.json'
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
import FX_POOL_ABI from '../../constants/haloAbis/FxPool.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { bigNumberToNumber } from 'utils/bigNumberHelper'
import { consoleLog } from 'utils/simpleLogger'
import { BigNumber } from 'ethers'
import useHaloAddresses from 'halo-hooks/useHaloAddresses'

const getAmmRewardsContract = (chainId: ChainId, library: Web3Provider) => {
  const address = getAmmRewardsContractAddress(chainId, AmmRewardsVersion.Latest)
  return address ? getContract(address, HALO_REWARDS_ABI, library) : undefined
}

export const useGetPools = () => {
  const { chainId, library } = useActiveWeb3React()
  const rewardsPoolAddresses = useLPTokenAddresses()
  const haloAddresses = useHaloAddresses()

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

    consoleLog('[useLiquidityPool] fetching pools...')

    // const enabledPools = haloAddresses.ammV2.pools.enabled
    const enabledPools = [
      {
        assets: [haloAddresses.tokens.fxPHP, haloAddresses.tokens.USDC],
        address: '0xD2bf123f2f4ffCFfC33F28315998c73FAA977F46',
        poolId: '0xd2bf123f2f4ffcffc33f28315998c73faa977f460002000000000000000007b5'
      }
    ]
    const enabledPoolsExternalIdsMap: PoolExternalIdsMap = {}
    for (const pool of enabledPools) {
      enabledPoolsExternalIdsMap[pool.address] = {
        rewardsPoolId: undefined,
        vaultPoolId: pool.poolId
      }
    }

    const disabledPools = haloAddresses.ammV2.pools.disabled
    const disabledPoolsExternalIdsMap: PoolExternalIdsMap = {}
    for (const pool of disabledPools) {
      disabledPoolsExternalIdsMap[pool.address] = {
        rewardsPoolId: undefined,
        vaultPoolId: pool.poolId
      }
    }

    try {
      // Get Rewards poolId of each pool
      const rewardsPoolAddresses = await getAmmRewardsPools()
      const enabledPoolsAddresses = enabledPools.map(pool => pool.address)
      const disabledPoolsAddresses = disabledPools.map(pool => pool.address)

      for (const [i, address] of rewardsPoolAddresses.entries()) {
        if (enabledPoolsAddresses.includes(address)) {
          enabledPoolsExternalIdsMap[address].rewardsPoolId = i
        } else if (disabledPoolsAddresses.includes(address)) {
          disabledPoolsExternalIdsMap[address].rewardsPoolId = i
        }
      }

      consoleLog('[useLiquidityPool] Fools fetched!')
      consoleLog('[useLiquidityPool] Enabled pools: ', enabledPoolsExternalIdsMap)
      consoleLog('[useLiquidityPool] Disabled pools: ', disabledPoolsExternalIdsMap)

      return {
        enabled: enabledPoolsExternalIdsMap,
        disabled: disabledPoolsExternalIdsMap
      }
    } catch (err) {
      console.error('[useLiquidityPool] useGetPools() failed: ', err)
    }

    return undefined
  }, [library, rewardsPoolAddresses, haloAddresses]) // eslint-disable-line

  return getPools
}

export const useGetPoolData = () => {
  const { library, chainId, account } = useActiveWeb3React()
  const haloAddresses = useHaloAddresses()
  const VaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)

  const getPoolData = async (
    poolAddress: string,
    vaultPoolId: string,
    rewardsPoolId = -1
  ): Promise<PoolData | undefined> => {
    if (!VaultContract || !library || !chainId || !account) return undefined

    consoleLog(`[useLiquidityPool] fetching pool (${poolAddress}) data...`)

    const AmmRewardsContract = getAmmRewardsContract(chainId, library)
    if (!AmmRewardsContract) return undefined

    const poolTokens = await VaultContract.getPoolTokens(vaultPoolId)
    const token0Address = poolTokens.tokens[0]
    const token1Address = poolTokens.tokens[1]

    const FxPoolContract = getContract(poolAddress, FX_POOL_ABI, library)
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
      FxPoolContract?.totalSupply(),
      FxPoolContract?.balanceOf(account),
      rewardsPoolId >= 0
        ? AmmRewardsContract?.userInfo(rewardsPoolId, account)
        : Promise.resolve({ amount: BigNumber.from(0) }),
      rewardsPoolId >= 0
        ? AmmRewardsContract?.pendingRewardToken(rewardsPoolId, account)
        : Promise.resolve(BigNumber.from(0))
    ])

    const token0SymbolProper = getCustomTokenSymbol(chainId, token0Address) || token0Symbol
    const token1SymbolProper = getCustomTokenSymbol(chainId, token1Address) || token1Symbol
    const tokens = [
      new Token(chainId, token0Address, token0Decimals, token0SymbolProper, token0SymbolProper),
      new Token(chainId, token1Address, token1Decimals, token1SymbolProper, token1SymbolProper)
    ]

    const [assimialtor0Address, assimialtor1Address] = await Promise.all([
      FxPoolContract.assimilator(token0Address),
      FxPoolContract.assimilator(token1Address)
    ])
    const Assimilator0Contract = getContract(assimialtor0Address, ASSIMILATOR_ABI, library)
    const Assimilator1Contract = getContract(assimialtor1Address, ASSIMILATOR_ABI, library)
    const [token0Rate, token1Rate] = await Promise.all([Assimilator0Contract.getRate(), Assimilator1Contract.getRate()])
    // const token0Rate = parseUnits('0.02', 8) // @todo: get rates from token[0] assimilator contract
    // const token1Rate = parseUnits('1', 8) // @todo: get rates from token[1] assimilator contract
    consoleLog('token0Rate', formatUnits(token0Rate, 8))
    consoleLog('token1Rate', formatUnits(token1Rate, 8))

    const token0Numeraire = bigNumberToNumber(poolTokens.balances[0].div(1e8).mul(token0Rate), token0Decimals)
    const token1Numeraire = bigNumberToNumber(poolTokens.balances[1].div(1e8).mul(token1Rate), token1Decimals)
    const totalLiquidity = token0Numeraire + token1Numeraire
    const token0Weight = totalLiquidity ? token0Numeraire / totalLiquidity : 0.5
    const token1Weight = totalLiquidity ? token1Numeraire / totalLiquidity : 0.5

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
          weight: parseUnits(`${token0Weight}`),
          rate: token0Rate
        },
        {
          token: tokens[1],
          balance: poolTokens.balances[1],
          weight: parseUnits(`${token1Weight}`),
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
