import { useHALORewardsContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { ChainId } from '@sushiswap/sdk'

import { PoolInfo, TokenPrice } from './useBalancer'
import { getPoolLiquidity } from '../utils/balancer'
import { HALO_TOKEN_ADDRESS } from '../constants/index'

/**
 * Internal Methods
 */

const usePoolLength = () => {
  const rewardsContract = useHALORewardsContract()
  const data = useSingleCallResult(rewardsContract, 'poolLength')

  return useMemo<number>(() => {
    return data.result ? data.result[0].toNumber() : 0
  }, [data])
}

const useLpToken = (poolLength: number): string[] => {
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => {
    const pids: string[][] = []
    for (let i = 0; i < poolLength; i++) {
      pids.push([`${i}`])
    }
    return pids
  }, [poolLength])

  const results = useSingleContractMultipleData(rewardsContract, 'lpToken', args)

  return useMemo<string[]>(() => {
    const addresses: string[] = []
    for (let i = 0; i < poolLength; i++) {
      const address = results[i].result
      if (address) {
        addresses.push(`${address}`)
      }
    }
    return addresses
  }, [poolLength, results])
}

/**
 * Public Methods
 */

export const usePoolAddresses = () => {
  const length = usePoolLength()
  const addresses = useLpToken(length)
  return useMemo(() => addresses, [addresses])
}

export const useUnclaimedRewardsPerPool = (poolIds: number[]): { [poolId: number]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolIds.map(poolId => [`${poolId}`, account ?? '']), [poolIds, account])
  const results = useSingleContractMultipleData(rewardsContract, 'pendingRewardToken', args)

  return useMemo(
    () =>
      poolIds.length > 0
        ? poolIds.reduce<{ [poolId: number]: number }>((memo, poolId, i) => {
            if (!results[i]) return memo

            const reward = results[i].result
            if (reward) {
              memo[poolId] = parseFloat(formatEther(reward.toString()))
            }
            return memo
          }, {})
        : {},
    [poolIds, results]
  )
}

export const useStakedBPTPerPool = (poolIds: number[]): { [poolId: number]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolIds.map(poolId => [`${poolId}`, account ?? '']), [poolIds, account])
  const results = useSingleContractMultipleData(rewardsContract, 'userInfo', args)

  return useMemo(
    () =>
      poolIds.length > 0
        ? poolIds.reduce<{ [poolId: number]: number }>((memo, poolId, i) => {
            if (!results[i]) return memo

            const userInfo = results[i].result
            if (userInfo) {
              memo[poolId] = parseFloat(formatEther(userInfo.amount.toString()))
            }
            return memo
          }, {})
        : {},
    [poolIds, results]
  )
}

export const useDepositWithdrawHarvestCallback = () => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()
  const addTransaction = useTransactionAdder()

  const deposit = useCallback(
    async (poolId: number, amount: number) => {
      const tx = await rewardsContract?.deposit(poolId, parseEther(`${amount}`).toString(), account)
      addTransaction(tx, {
        summary: `Stake ${amount} BPT`
      })
      return tx
    },
    [rewardsContract, addTransaction, account]
  )

  const withdraw = useCallback(
    async (poolId: number, amount: number) => {
      const tx = await rewardsContract?.withdraw(poolId, parseEther(`${amount}`).toString(), account)
      addTransaction(tx, {
        summary: `Unstake ${amount} BPT`
      })
      return tx
    },
    [rewardsContract, addTransaction, account]
  )

  const harvest = useCallback(
    async (poolId: number) => {
      const tx = await rewardsContract?.harvest(poolId, account)
      addTransaction(tx, {
        summary: `Harvest rewards (RNBW)`
      })
      return tx
    },
    [rewardsContract, addTransaction, account]
  )

  return { deposit, withdraw, harvest }
}

export const useRewardTokenPerSecond = () => {
  const rewardsContract = useHALORewardsContract()
  const data = useSingleCallResult(rewardsContract, 'rewardTokenPerSecond')

  return useMemo<number>(() => {
    return data.result ? parseFloat(formatEther(data.result[0].toString())) : 0
  }, [data])
}

export const useTotalAllocPoint = () => {
  const rewardsContract = useHALORewardsContract()
  const data = useSingleCallResult(rewardsContract, 'totalAllocPoint')

  return useMemo<number>(() => {
    return data.result ? data.result[0].toNumber() : 0
  }, [data])
}

export const useAllocPoint = () => {
  const rewardsContract = useHALORewardsContract()
  const poolAddresses = usePoolAddresses()
  const args = poolAddresses.map((v, i) => [i])
  const results = useSingleContractMultipleData(rewardsContract, 'poolInfo', args)

  return useMemo(() => {
    return results.map((v, i) => (v.result ? parseFloat(v.result['allocPoint'].toString()) : 0))
  }, [results])
}

export const usePoolAPY = (tokenPrice: TokenPrice, poolInfo: PoolInfo) => {
  const poolLiquidity = getPoolLiquidity(poolInfo, tokenPrice);
  const rewardTokenPerSecond = useRewardTokenPerSecond();

  // (days * hrs * min * s) * reward token/s
  const monthlyReward = rewardTokenPerSecond ? (30 * 24 * 60 * 60) * rewardTokenPerSecond : 0;
  const totalAllocPoint = useTotalAllocPoint();
  const USDPrice = tokenPrice[HALO_TOKEN_ADDRESS[ChainId.KOVAN]!];
  const rewardMonthUSDValue = (poolInfo.allocPoint / totalAllocPoint) * (monthlyReward * USDPrice);
  // Not in percent so not APY yet
  const monthlyInterest = rewardMonthUSDValue / poolLiquidity;
  // Convert monthlyInterest to monthly APY before multiplying to get the APY
  const apy = monthlyInterest ? parseFloat(((monthlyInterest * 100) * 12).toFixed(2)) : 0;

  return useMemo<number>(() => {
    return apy
  }, [apy])
}