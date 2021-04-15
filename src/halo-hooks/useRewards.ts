import { useActiveWeb3React } from 'hooks'
import { useHALORewardsContract } from 'hooks/useContract'
import { useEffect, useMemo, useState } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther } from 'ethers/lib/utils'

export const useWhitelistedPoolAddresses = () => {
  const rewardsContract = useHALORewardsContract()
  const data = useSingleCallResult(rewardsContract, 'getWhitelistedAMMPoolAddresses')

  return useMemo<string[]>(() => {
    return data.result ? data.result[0] : []
  }, [data])
}

export const useTotalClaimedHALO = (): number => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => (account ? [account] : []), [account])
  const data = useSingleCallResult(rewardsContract, 'getTotalRewardsClaimedByUser', args)

  return useMemo<number>(() => {
    return data.result ? parseFloat(formatEther(data.result.toString())) : 0
  }, [data])
}

export const useUnclaimedHALOPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  const results = useSingleContractMultipleData(rewardsContract, 'getUnclaimedPoolRewardsByUserByPool', args)

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            const unclaimed = results[i].result
            if (unclaimed) {
              memo[address] = parseFloat(formatEther(unclaimed.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, results]
  )
}

export const useStakedBPTPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { account } = useActiveWeb3React()
  const rewardsContract = useHALORewardsContract()

  const args = useMemo(() => poolAddresses.map(address => [address, account ?? '']), [poolAddresses, account])
  const results = useSingleContractMultipleData(rewardsContract, 'getDepositedPoolTokenBalanceByUser', args)

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            const bptStaked = results[i].result
            if (bptStaked) {
              memo[address] = parseFloat(formatEther(bptStaked.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, results]
  )
}
