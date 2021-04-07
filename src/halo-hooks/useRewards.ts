import { HALO_REWARDS_ADDRESS } from '../constants'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { useEffect, useMemo, useState } from 'react'
import HALO_REWARDS_ABI from '../constants/haloAbis/Rewards.json'
import { toCallState, useCallsData, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther } from 'ethers/lib/utils'
import { Call } from 'state/multicall/actions'
import { useBlockNumber } from 'state/application/hooks'

export const useWhitelistedPoolAddresses = () => {
  const { chainId } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)
  const [poolAddresses, setPoolAddresses] = useState<string[]>([])

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!rewardsContract) return
      try {
        const addresses = await rewardsContract.getWhitelistedAMMPoolAddresses()
        setPoolAddresses(addresses)
      } catch (err) {
        console.error('Error fetching AMM pools: ', err)
      }
    }

    if (rewardsContract) {
      fetchAddresses()
    } else {
      setPoolAddresses([])
    }
  }, [rewardsContract])

  return { poolAddresses }
}

export const useTotalClaimedHALO = (): number => {
  const { chainId, account } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)

  const args = useMemo(() => [account ? [account] : []], [account])
  const data = useSingleContractMultipleData(rewardsContract, 'getTotalRewardsClaimedByUser', args)

  return useMemo<number>(() => {
    if (data.length) {
      return data[0].result ? parseFloat(formatEther(data[0].result.toString())) : 0
    } else {
      return 0
    }
  }, [data])
}

export const useUnclaimedHALOPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { chainId, account } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)

  const methodName = 'getUnclaimedPoolRewardsByUserByPool'
  const callInputs = useMemo(() => poolAddresses.map(address => [address, account]), [poolAddresses, account])
  const fragment = useMemo(() => rewardsContract?.interface?.getFunction(methodName), [rewardsContract, methodName])

  const calls = useMemo(
    () =>
      rewardsContract && fragment && callInputs && callInputs.length > 0
        ? callInputs.map<Call>(inputs => {
            return {
              address: rewardsContract.address,
              callData: rewardsContract.interface.encodeFunctionData(fragment, inputs)
            }
          })
        : [],
    [callInputs, rewardsContract, fragment]
  )

  const results = useCallsData(calls)
  const latestBlockNumber = useBlockNumber()

  const unclaimedHALOs = useMemo(() => {
    return results.map(result => toCallState(result, rewardsContract?.interface, fragment, latestBlockNumber))
  }, [fragment, rewardsContract, results, latestBlockNumber])

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            const unclaimed = unclaimedHALOs[i].result
            if (unclaimed) {
              memo[address] = parseFloat(formatEther(unclaimed.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, unclaimedHALOs]
  )
}

export const useStakedBPTPerPool = (poolAddresses: string[]): { [poolAddress: string]: number } => {
  const { chainId, account } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)

  const methodName = 'getDepositedPoolTokenBalanceByUser'
  const callInputs = useMemo(() => poolAddresses.map(address => [address, account]), [poolAddresses, account])
  const fragment = useMemo(() => rewardsContract?.interface?.getFunction(methodName), [rewardsContract, methodName])

  const calls = useMemo(
    () =>
      rewardsContract && fragment && callInputs && callInputs.length > 0
        ? callInputs.map<Call>(inputs => {
            return {
              address: rewardsContract.address,
              callData: rewardsContract.interface.encodeFunctionData(fragment, inputs)
            }
          })
        : [],
    [callInputs, rewardsContract, fragment]
  )

  const results = useCallsData(calls)
  const latestBlockNumber = useBlockNumber()

  const stakedBPTs = useMemo(() => {
    return results.map(result => toCallState(result, rewardsContract?.interface, fragment, latestBlockNumber))
  }, [fragment, rewardsContract, results, latestBlockNumber])

  return useMemo(
    () =>
      poolAddresses.length > 0
        ? poolAddresses.reduce<{ [poolAddress: string]: number }>((memo, address, i) => {
            const staked = stakedBPTs[i].result
            if (staked) {
              memo[address] = parseFloat(formatEther(staked.toString()))
            }
            return memo
          }, {})
        : {},
    [poolAddresses, stakedBPTs]
  )
}
