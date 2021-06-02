import { useHALORewardsContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'

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

export const useDepositWithdrawPoolTokensCallback = () => {
  const rewardsContract = useHALORewardsContract()
  const addTransaction = useTransactionAdder()

  const depositPoolTokens = useCallback(
    async (poolTokenAddress: string, amount: number) => {
      if (!rewardsContract) return

      const tx = await rewardsContract.depositPoolTokens(poolTokenAddress, parseEther(`${amount}`).toString())
      addTransaction(tx, {
        summary: `Stake ${amount} BPT`
      })

      return tx
    },
    [rewardsContract, addTransaction]
  )

  const withdrawPoolTokens = useCallback(
    async (poolTokenAddress: string, amount: number) => {
      if (!rewardsContract) return

      const tx = await rewardsContract.withdrawPoolTokens(poolTokenAddress, parseEther(`${amount}`).toString())
      addTransaction(tx, {
        summary: `Unstake ${amount} BPT`
      })

      return tx
    },
    [rewardsContract, addTransaction]
  )

  return [depositPoolTokens, withdrawPoolTokens]
}

export const useClaimRewardsCallback = () => {
  const rewardsContract = useHALORewardsContract()
  const addTransaction = useTransactionAdder()

  const claimRewards = useCallback(
    async (poolTokenAddress: string) => {
      if (!rewardsContract) return

      const tx = await rewardsContract.withdrawUnclaimedPoolRewards(poolTokenAddress)
      addTransaction(tx, {
        summary: `Claim rewards (RNBW)`
      })

      return tx
    },
    [rewardsContract, addTransaction]
  )

  return [claimRewards]
}

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
    var pids: string[][] = []
    for (var i = 0; i < poolLength; i++) {
      pids.push([`${i}`])
    }
    return pids
  }, [poolLength])

  const results = useSingleContractMultipleData(rewardsContract, 'lpToken', args)

  return useMemo<string[]>(() => {
    var addresses: string[] = []
    for (var i = 0; i < poolLength; i++) {
      const address = results[i].result
      if (address) {
        addresses.push(`${address}`)
      }
    }
    return addresses
  }, [poolLength, results])
}
