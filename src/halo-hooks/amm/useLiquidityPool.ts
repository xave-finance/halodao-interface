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
import { HALO_REWARDS_V1_ADDRESS } from '../../constants'
import { BigNumber } from 'ethers'
import Fraction from 'constants/Fraction'

export const useLiquidityPool = (address: string, pid: number | undefined) => {
  const { account, library, chainId } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)
  console.log('CurveContract', CurveContract)
  const RewardsContract = useContract(chainId ? HALO_REWARDS_V1_ADDRESS[chainId] : undefined, REWARDS_ABI, true)
  console.log('RewardsContract', RewardsContract)
  const getTokens = useCallback(async () => {
    if (!chainId || !library) return []

    const token0Address = await CurveContract?.derivatives(0)
    const token1Address = await CurveContract?.derivatives(1)
    const Token0Contract = getContract(token0Address, ERC20_ABI, library)
    const Token1Contract = getContract(token1Address, ERC20_ABI, library)
    const token0Symbol = await Token0Contract?.symbol()
    const token1Symbol = await Token1Contract?.symbol()
    const token0Decimals = await Token0Contract?.decimals()
    const token1Decimals = await Token1Contract?.decimals()

    return [
      new Token(chainId, token0Address, token0Decimals, token0Symbol, token0Symbol),
      new Token(chainId, token1Address, token1Decimals, token1Symbol, token1Symbol)
    ]
  }, [CurveContract, chainId, library])

  const getLiquidity = useCallback(async () => {
    if (!library) return { total: 0, tokens: [0, 0] }

    const res = await CurveContract?.liquidity()

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

    const token1Numeraire = res.individual_[1]
    const token1Value = token1Numeraire.mul(1e8).div(rate1)

    const token0Weight = Fraction.from(token0Numeraire, res.total_).toString()
    const token1Weight = Fraction.from(token1Numeraire, res.total_).toString()

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
    return res
  }, [CurveContract, account])

  const getTotalSupply = useCallback(async () => {
    const res = await CurveContract?.totalSupply()
    return res
  }, [CurveContract])

  const getStakedLPToken = useCallback(async () => {
    if (!pid) return BigNumber.from(0)

    const res = await RewardsContract?.userInfo(pid, account)
    return res.amount
  }, [RewardsContract, account, pid])

  const getPendingRewards = useCallback(async () => {
    if (!pid) return BigNumber.from(0)

    const res = await RewardsContract?.pendingRewardToken(pid, account)
    return res
  }, [RewardsContract, account, pid])

  return { getTokens, getLiquidity, getBalance, getTotalSupply, getStakedLPToken, getPendingRewards }
}
