import { useHALORewardsContract } from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther } from 'ethers/lib/utils'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { tokenSymbolForPool } from 'utils/poolInfo'
import { AmmRewardsVersion } from 'utils/ammRewards'
import { ZERO_ADDRESS } from '../constants'
import { BigNumber } from 'ethers'
import { PENDING_REWARD_FAILED } from 'constants/pools'

export const useLPTokenAddresses = (rewardsVersion = AmmRewardsVersion.Latest) => {
  const rewardsContract = useHALORewardsContract(rewardsVersion)
  const [poolLength, setPoolLength] = useState(0)
  const [lpTokenAddresses, setLpTokenAddresses] = useState<string[]>([])

  const fetchPoolLength = useCallback(async () => {
    if (!rewardsContract) {
      setPoolLength(0)
      return
    }

    try {
      const result = await rewardsContract.poolLength()
      setPoolLength(result ? result.toNumber() : 0)
    } catch (err) {
      console.error(`Error fetching poolLength: `, err)
    }
  }, [rewardsContract])

  const fetchLpToken = useCallback(async () => {
    if (!rewardsContract) {
      setLpTokenAddresses([])
      return
    }

    const promises = []
    for (let pid = 0; pid < poolLength; pid++) {
      promises.push(rewardsContract.lpToken(`${pid}`))
    }

    try {
      const results = await Promise.all(promises)
      const addresses: string[] = []
      for (const result of results) {
        addresses.push(result)
      }
      setLpTokenAddresses(addresses)
    } catch (err) {
      console.error(`Error fetching lpToken: `, err)
    }
  }, [rewardsContract, poolLength])

  useEffect(() => {
    fetchPoolLength()
  }, [rewardsContract, fetchPoolLength])

  useEffect(() => {
    fetchLpToken()
  }, [poolLength, fetchLpToken])

  return lpTokenAddresses
}

export const useUnclaimedRewardsPerPool = (
  poolIds: number[],
  rewardsVersion = AmmRewardsVersion.Latest
): { [poolId: number]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract(rewardsVersion)

  const [unclaimedRewards, setUnclaimedRewards] = useState(() => {
    const rewards: { [poolId: number]: number } = {}
    for (const pid of poolIds) {
      rewards[pid] = 0
    }
    return rewards
  })

  const fetchPendingRewards = useCallback(async () => {
    const newUnclaimedRewards = unclaimedRewards
    for (const pid of poolIds) {
      try {
        const result = await rewardsContract?.pendingRewardToken(`${pid}`, account)
        newUnclaimedRewards[pid] = result ? parseFloat(formatEther(result.toString())) : 0
      } catch (err) {
        console.error(`Error fetching pending rewards for pid[${pid}]: `, err)
        newUnclaimedRewards[pid] = PENDING_REWARD_FAILED
      }
    }
    setUnclaimedRewards(newUnclaimedRewards)
  }, [poolIds, account, rewardsContract, unclaimedRewards])

  useEffect(() => {
    if (!account) return
    fetchPendingRewards()
  }, [poolIds, account, fetchPendingRewards])

  return unclaimedRewards
}

export const useStakedBPTPerPool = (
  poolIds: number[],
  rewardsVersion = AmmRewardsVersion.Latest
): { [poolId: number]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract(rewardsVersion)

  const args = useMemo(() => poolIds.map(poolId => [`${poolId}`, account ?? ZERO_ADDRESS]), [poolIds, account])
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

export const useDepositWithdrawHarvestCallback = (rewardsVersion = AmmRewardsVersion.Latest) => {
  const { account, chainId } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract(rewardsVersion)
  const addTransaction = useTransactionAdder()

  const deposit = useCallback(
    async (poolId: number, amount: BigNumber, poolAddress: string) => {
      const tx = await rewardsContract?.deposit(poolId, amount, account)
      addTransaction(tx, {
        summary: `Stake ${formatEther(amount)} ` + tokenSymbolForPool(poolAddress, chainId)
      })
      return tx
    },
    [rewardsContract, addTransaction, account, chainId]
  )

  const withdraw = useCallback(
    async (poolId: number, amount: BigNumber, poolAddress: string) => {
      const tx = await rewardsContract?.withdraw(poolId, amount, account)
      addTransaction(tx, {
        summary: `Unstake ${formatEther(amount)} ` + tokenSymbolForPool(poolAddress, chainId)
      })
      return tx
    },
    [rewardsContract, addTransaction, account, chainId]
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

export const useRewardTokenPerSecond = (rewardsVersion = AmmRewardsVersion.Latest) => {
  const rewardsContract = useHALORewardsContract(rewardsVersion)
  const data = useSingleCallResult(rewardsContract, 'rewardTokenPerSecond')

  return useMemo<number>(() => {
    return data.result ? parseFloat(formatEther(data.result[0].toString())) : 0
  }, [data])
}

export const useTotalAllocPoint = (rewardsVersion = AmmRewardsVersion.Latest) => {
  const rewardsContract = useHALORewardsContract(rewardsVersion)
  const data = useSingleCallResult(rewardsContract, 'totalAllocPoint')

  return useMemo<number>(() => {
    return data.result ? data.result[0].toNumber() : 0
  }, [data])
}

export const useAllocPoints = (poolAddresses: string[], rewardsVersion = AmmRewardsVersion.Latest) => {
  const rewardsContract = useHALORewardsContract(rewardsVersion)

  const [allocPoint, setAllocPoint] = useState(() => {
    const initialPoints: { [pid: number]: number } = {}
    for (let i = 0; i < poolAddresses.length; i++) {
      initialPoints[i] = 0
    }
    return initialPoints
  })

  const fetchAllocPoint = useCallback(async () => {
    if (!rewardsContract || poolAddresses.length === 0) return

    const promises = []
    for (let pid = 0; pid < poolAddresses.length; pid++) {
      promises.push(rewardsContract.poolInfo(`${pid}`))
    }

    try {
      const results = await Promise.all(promises)
      const newPoints: { [pid: number]: number } = {}
      for (const [pid, result] of results.entries()) {
        newPoints[pid] = result ? result['allocPoint'].toNumber() : 0
      }
      setAllocPoint(newPoints)
    } catch (err) {
      console.error(`Error fetching lpToken: `, err)
    }
  }, [poolAddresses, rewardsContract])

  useEffect(() => {
    fetchAllocPoint()
  }, [poolAddresses, fetchAllocPoint])

  return allocPoint
}
