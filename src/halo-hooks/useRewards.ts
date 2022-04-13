import { useHALORewardsContract, useHALORewarderContract, useTokenContract } from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { formatEther } from 'ethers/lib/utils'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { tokenSymbolForPool } from 'utils/poolInfo'
import { AmmRewardsVersion } from 'utils/ammRewards'
import { ZERO_ADDRESS } from '../constants'
import { BigNumber, ethers } from 'ethers'
import { DEPOSIT_TXHASH, PENDING_REWARD_FAILED, TRANSFER_EVENT_HASH } from 'constants/pools'
import { useTokenPrice } from './useTokenPrice'
import useCurrentBlockTimestamp from '../hooks/useCurrentBlockTimestamp'
import { calculateBaseApr } from '../utils/calculator'
import { getContract } from '../utils'
import CURVE_ABI from '../constants/haloAbis/Curve.json'
import { getTokenUSDPriceAtDate, getTxDate } from '../utils/coingecko'
import {
  CHAINLINK_ORACLE,
  ChainLinkAddressMap,
  haloTokenList,
  TOKEN_COINGECKO_NAME,
  TokenSymbol
} from '../constants/tokenLists/halo-tokenlist'
import { ChainId, Token } from '@halodao/sdk'
import CHAINLINK_ABI from '../constants/abis/chainlinkOracle.json'
import { formatUnits } from 'ethers/lib/utils'

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

interface RewarderToken {
  amount: number
  tokenName: string
  tokenAddress: string
  multiplier: number
  balance: number
}

export const useUnclaimedRewarderRewardsPerPool = (poolID: number[], rewarderAddress: string | undefined) => {
  const currentBlockTimestamp = useCurrentBlockTimestamp()
  const { account } = useActiveWeb3React()
  const ammRewards = useHALORewardsContract(AmmRewardsVersion.Latest)
  const rewarderContract = useHALORewarderContract(rewarderAddress !== ZERO_ADDRESS ? rewarderAddress : undefined)
  const [rewardTokenAddress, setRewardTokenAddress] = useState<string>()
  const rewardTokenContract = useTokenContract(rewardTokenAddress)
  const [unclaimedRewards, setUnclaimedRewards] = useState<RewarderToken>()

  const fetchUnclaimedRewards = useCallback(async () => {
    if (!ammRewards || !rewarderContract || !rewardTokenContract || !account || !rewarderAddress) return

    try {
      console.log('fetchUnclaimedRewards() in progress...')
      const pendingXRNBW = await ammRewards.pendingRewardToken(poolID, account)
      const [pendingRewarderTokens, multiplier, symbol, balance] = await Promise.all([
        rewarderContract.viewPendingTokens(poolID, account, pendingXRNBW),
        rewarderContract.rewardMultiplier(),
        rewardTokenContract.symbol(),
        rewardTokenContract.balanceOf(rewarderAddress)
      ])

      setUnclaimedRewards({
        amount: parseFloat(formatEther(pendingRewarderTokens.rewardAmounts[0])),
        tokenName: symbol,
        tokenAddress: pendingRewarderTokens.rewardTokens[0],
        multiplier: parseFloat(formatEther(multiplier.toString())) / 1000,
        balance: parseFloat(formatEther(balance))
      })
    } catch (e) {
      console.error('fetchUnclaimedRewards() error: ', e)
    }
  }, [rewardTokenContract, ammRewards, rewarderContract, poolID, account]) //eslint-disable-line

  useEffect(() => {
    if (!rewarderContract) return

    rewarderContract
      .rewardToken()
      .then(setRewardTokenAddress)
      .catch((e: Error) => {
        console.error('Rewarder.rewardToken() failed', e)
      })
  }, [rewarderContract])

  useEffect(() => {
    fetchUnclaimedRewards()
  }, [rewardTokenContract, currentBlockTimestamp]) //eslint-disable-line

  return unclaimedRewards
}

export const useRewarderUSDPrice = (rewarderAddress: string | undefined) => {
  const rewarder = useHALORewarderContract(rewarderAddress !== ZERO_ADDRESS ? rewarderAddress : undefined)
  const [rewarderTokenAddress, setRewarderTokenAddress] = useState<string[]>([])
  const rewarderTokenUsdPrice = useTokenPrice(rewarderTokenAddress)

  const fetchTokenAddress = useCallback(async () => {
    try {
      if (!rewarder) return
      const tokenAddress = await rewarder.rewardToken()
      setRewarderTokenAddress([tokenAddress])
    } catch (err) {
      console.error(`Error fetching token address: `, err)
    }
  }, [rewarderAddress]) //eslint-disable-line

  useEffect(() => {
    fetchTokenAddress()
  }, [fetchTokenAddress])

  return rewarderTokenUsdPrice[rewarderTokenAddress[0]]
}

export const useGetBaseApr = (poolAddress: string, tokenPair: string): number => {
  const { account, library, chainId } = useActiveWeb3React()
  const [baseAPR, setBaseApr] = useState(0)
  const poolsWithBaseAPR = Object.keys(DEPOSIT_TXHASH[chainId as ChainId] as Record<string, string>)

  const fetchBaseUsdHlpPrice = useCallback(async () => {
    if (!library || !poolsWithBaseAPR.includes(poolAddress) || poolAddress === ethers.constants.AddressZero) return

    try {
      // get the first deposit transaction of the curve
      const txReceipt = await library.getTransactionReceipt(DEPOSIT_TXHASH[chainId as ChainId]?.[poolAddress] as string)

      // get the liquidity and total supply of the curve
      const curveContract = await getContract(poolAddress, CURVE_ABI, library, account ?? undefined)
      const [curveLiquidity, curveTotalSupply] = await Promise.all([
        curveContract.liquidity(),
        curveContract.totalSupply()
      ])
      const totalCurveLiquidity = parseFloat(formatEther(curveLiquidity.total_))
      const totalCurveSupply = parseFloat(formatEther(curveTotalSupply))

      // get the date of the deposit transaction and the number of days since the tx
      const dateNow = new Date().getTime()
      const txTimestamp = txReceipt ? (await library.getBlock(txReceipt.blockNumber)).timestamp : dateNow
      const date = getTxDate(txTimestamp)
      const noOfDaysSinceFirstDeposit = Math.floor((dateNow - txTimestamp * 1000) / (1000 * 60 * 60 * 24))

      // get the base token symbol and decimals
      const baseTokenSymbol = tokenPair.split('/')[0]
      const { decimals } = (haloTokenList[chainId as ChainId] as Token[]).filter(
        token => token.symbol === baseTokenSymbol
      )[0]

      // get the transfer logs
      const logs = txReceipt.logs.filter((value: any) => value.topics[0] === TRANSFER_EVENT_HASH)
      const baseTokenValue = parseFloat(ethers.utils.formatUnits(logs[0].data, decimals))
      const quoteTokenValue = parseFloat(ethers.utils.formatUnits(logs[1].data, 6))

      let baseTokenUSDPrice: number
      // Check if the token price is available in coingecko else get it in chainlink
      if (TOKEN_COINGECKO_NAME[baseTokenSymbol]) {
        baseTokenUSDPrice = await getTokenUSDPriceAtDate(TOKEN_COINGECKO_NAME[baseTokenSymbol], date)
      } else {
        const tokenContract = getContract(
          (CHAINLINK_ORACLE[chainId as ChainId] as ChainLinkAddressMap)[baseTokenSymbol as TokenSymbol],
          CHAINLINK_ABI,
          library
        )
        const [latestAnswer, decimals] = await Promise.all([tokenContract?.latestAnswer(), tokenContract?.decimals()])
        baseTokenUSDPrice = Number(formatUnits(latestAnswer, decimals))
      }
      const quoteTokenUSDPrice = await getTokenUSDPriceAtDate(TOKEN_COINGECKO_NAME['USDC'], date)
      const hlpMintedValue = parseFloat(ethers.utils.formatUnits(logs[2].data, 18))

      setBaseApr(
        calculateBaseApr(
          baseTokenValue,
          baseTokenUSDPrice,
          quoteTokenValue,
          quoteTokenUSDPrice,
          hlpMintedValue,
          totalCurveLiquidity,
          totalCurveSupply,
          noOfDaysSinceFirstDeposit
        )
      )
    } catch (e) {
      console.log('Error fetching base APR.', e)
    }
  }, [poolAddress, library, chainId]) //eslint-disable-line

  useEffect(() => {
    fetchBaseUsdHlpPrice()
  }, [fetchBaseUsdHlpPrice]) //eslint-disable-line

  return baseAPR
}
