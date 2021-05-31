import { useActiveWeb3React } from 'hooks'
import { useHALORewardsContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useTransactionAdder } from 'state/transactions/hooks'

export const usePoolAddresses = () => {
  const length = usePoolLength()
  const addresses = useLpToken(length)
  return addresses
}

export const useUnclaimedRewardsPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  return {}
  // const { account } = useActiveWeb3React()
  // const rewardsContract = useHALORewardsContract()

  // const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  // const results = useSingleContractMultipleData(rewardsContract, 'getUnclaimedPoolRewardsByUserByPool', args)

  // return useMemo(
  //   () =>
  //     poolAddresses.length > 0
  //       ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
  //           if (!results[i]) return memo

  //           const unclaimed = results[i].result
  //           if (unclaimed) {
  //             memo[address] = parseFloat(formatEther(unclaimed.toString()))
  //           }
  //           return memo
  //         }, {})
  //       : {},
  //   [poolAddresses, results]
  // )
}

// eslint-disable-next-line
export const useClaimedRewardsPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  return {}
  // const { account } = useActiveWeb3React()
  // const rewardsContract = useHALORewardsContract()

  // const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  // const results = useSingleContractMultipleData(rewardsContract, 'getClaimedPoolRewardsByUserByPool', args)

  // return useMemo(
  //   () =>
  //     poolAddresses.length > 0
  //       ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
  //           if (!results[i]) return memo

  //           const claimedUnclaimed = results[i].result
  //           if (claimedUnclaimed) {
  //             memo[address] = parseFloat(formatEther(claimedUnclaimed.toString()))
  //           }
  //           return memo
  //         }, {})
  //       : {},
  //   [poolAddresses, results]
  // )
}

export const useStakedBPTPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  return {}
  // const { account } = useActiveWeb3React()
  // const rewardsContract = useHALORewardsContract()

  // const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  // const results = useSingleContractMultipleData(rewardsContract, 'getDepositedPoolTokenBalanceByUser', args)

  // return useMemo(
  //   () =>
  //     poolAddresses.length > 0
  //       ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
  //           if (!results[i]) return memo

  //           const bptStaked = results[i].result
  //           if (bptStaked) {
  //             memo[address] = parseFloat(formatEther(bptStaked.toString()))
  //           }
  //           return memo
  //         }, {})
  //       : {},
  //   [poolAddresses, results]
  // )
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
    console.log('length: ', data.result ? data.result[0].toString() : 'ewan')
    return data.result ? parseInt(`${data.result[0]}`) : 0
  }, [data])
}

const useLpToken = (poolLength: number): string[] => {
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => {
    console.log('poolLength:', poolLength)
    var pids: string[][] = []
    for (var i = 0; i < poolLength; i++) {
      pids.push([`${i}`])
    }
    console.log('pids:', pids)
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
