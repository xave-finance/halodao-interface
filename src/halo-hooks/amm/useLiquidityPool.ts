import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import REWARDS_ABI from 'constants/haloAbis/Rewards.json'
import { formatEther } from 'ethers/lib/utils'
import { ERC20_ABI } from 'constants/abis/erc20'
import { getContract } from 'utils'
import { Token } from '@sushiswap/sdk'
import { CachedPool } from 'state/pool/reducer'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { HALO_REWARDS_ADDRESS } from '../../constants'
import { BigNumber } from 'ethers'
import Fraction from 'constants/Fraction'

export const useLiquidityPool = (address: string) => {
  const { account, library, chainId } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)
  const RewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, REWARDS_ABI, true)

  const cachedPools = useSelector<AppState, CachedPool[]>(state => state.pool.pools)
  const filtered = cachedPools.filter(p => p.lpTokenAddress.toLowerCase() === address.toLowerCase())
  const pid = filtered.length ? filtered[0].pid : undefined

  const getTokens = useCallback(async () => {
    if (!chainId || !library) return []

    const token0Address = await CurveContract?.derivatives(0)
    const token1Address = await CurveContract?.derivatives(1)
    console.log('Curve.derivatives(0):', token0Address)
    console.log('Curve.derivatives(1):', token1Address)
    const Token0Contract = getContract(token0Address, ERC20_ABI, library)
    const Token1Contract = getContract(token1Address, ERC20_ABI, library)
    const token0Symbol = await Token0Contract?.symbol()
    const token1Symbol = await Token1Contract?.symbol()
    console.log('Token0Contract.symbol():', token0Symbol)
    console.log('Token1Contract.symbol(1):', token1Symbol)
    const token0Decimals = await Token0Contract?.decimals()
    const token1Decimals = await Token1Contract?.decimals()
    console.log('Token0Contract.decimals():', token0Decimals)
    console.log('Token1Contract.decimals(1):', token1Decimals)

    return [
      new Token(chainId, token0Address, token0Decimals, token0Symbol, token0Symbol),
      new Token(chainId, token1Address, token1Decimals, token1Symbol, token1Symbol)
    ]
  }, [CurveContract, chainId, library])

  const getLiquidity = useCallback(async () => {
    if (!library) return { total: 0, tokens: [0, 0] }

    const res = await CurveContract?.liquidity()
    console.log(`Curve.liquidity(): `, res)
    console.log('Total value:', formatEther(res.total_))
    console.log('Total token[0] value:', formatEther(res.individual_[0]))
    console.log('Total token[1] value:', formatEther(res.individual_[1]))

    const derivatives0 = await CurveContract?.derivatives(0)
    const derivatives1 = await CurveContract?.derivatives(1)
    const assimialtor0Address = await CurveContract?.assimilator(derivatives0)
    const assimialtor1Address = await CurveContract?.assimilator(derivatives1)
    const Assimilator0Contract = getContract(assimialtor0Address, ASSIMILATOR_ABI, library)
    const Assimilator1Contract = getContract(assimialtor1Address, ASSIMILATOR_ABI, library)
    const rate0 = await Assimilator0Contract.getRate()
    const rate1 = await Assimilator1Contract.getRate()

    const token0Numeraire = res.individual_[0]
    const token0Value = token0Numeraire.mul(1e8).div(rate0) // based on Assimilator's viewRawAmount()
    console.log('token0Numeraire:', formatEther(token0Numeraire))
    console.log('rate0:', formatEther(rate0))
    console.log('token0Value:', formatEther(token0Value))

    const token1Numeraire = res.individual_[1]
    const token1Value = token1Numeraire.mul(1e8).div(rate1)
    console.log('token1Numeraire:', formatEther(token1Numeraire))
    console.log('rate1:', formatEther(rate1))
    console.log('token1Value:', formatEther(token1Value))

    const token0Weight = Fraction.from(token0Numeraire, res.total_).toString()
    const token1Weight = Fraction.from(token1Numeraire, res.total_).toString()
    // console.log('token0Weight: ', token0Weight)
    // console.log('token1Weight: ', token1Weight)

    // console.log('rate0.mul(1e8): ', formatEther(rate0.mul(1e8)))
    // console.log('rate1.mul(1e8): ', formatEther(rate1.mul(1e8)))

    // const token0Price = Number(token0Weight) * (1 / (Number(formatEther(rate0.mul(1e8))) * 100))
    // const token1Price = Number(token1Weight) * (1 / (Number(formatEther(rate1.mul(1e8))) * 100))
    // console.log('token0Price: ', token0Price)
    // console.log('token1Price: ', token1Price)

    const token0Rate = Number(formatEther(rate0.mul(1e8)))
    const token1Rate = Number(formatEther(rate1.mul(1e8)))

    return {
      total: res.total_,
      tokens: [token0Value, token1Value],
      weights: [Number(token0Weight), Number(token1Weight)],
      rates: [token0Rate, token1Rate]
    }
  }, [CurveContract, library])

  const getBalance = useCallback(async () => {
    const res = await CurveContract?.balanceOf(account)
    console.log(`Curve.balanceOf(${account}): `, res)
    return res
  }, [CurveContract, account])

  const getStakedLPToken = useCallback(async () => {
    if (!pid) return BigNumber.from(0)

    const res = await RewardsContract?.userInfo(pid, account)
    console.log(`RewardsContract.userInfo(${account}): `, res)
    return res.amount
  }, [RewardsContract, account, pid])

  const getPendingRewards = useCallback(async () => {
    if (!pid) return BigNumber.from(0)

    const res = await RewardsContract?.pendingRewardToken(pid, account)
    console.log(`RewardsContract.pendingRewardToken(${account}): `, res)
    return res
  }, [RewardsContract, account, pid])

  return { getTokens, getLiquidity, getBalance, getStakedLPToken, getPendingRewards }
}
