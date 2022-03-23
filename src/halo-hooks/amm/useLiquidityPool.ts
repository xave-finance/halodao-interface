import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useContract, useHALORewardsContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { formatUnits } from 'ethers/lib/utils'
import { ERC20_ABI } from 'constants/abis/erc20'
import { getContract } from 'utils'
import { Token } from '@halodao/sdk'
import { BigNumber } from 'ethers'
import Fraction from 'constants/Fraction'
import { getCustomTokenSymbol } from 'utils/tokens'

export const useLiquidityPool = (address: string, pid: number | undefined) => {
  const { account, library, chainId } = useActiveWeb3React()
  const CurveContract = useContract(address, CURVE_ABI, true)
  const RewardsContract = useHALORewardsContract()

  const getTokens = useCallback(async () => {
    if (!chainId || !library) return []

    const [token0Address, token1Address] = await Promise.all([
      CurveContract?.derivatives(0),
      CurveContract?.derivatives(1)
    ])

    const Token0Contract = getContract(token0Address, ERC20_ABI, library)
    const Token1Contract = getContract(token1Address, ERC20_ABI, library)

    const [token0Symbol, token1Symbol, token0Decimals, token1Decimals] = await Promise.all([
      Token0Contract?.symbol(),
      Token1Contract?.symbol(),
      Token0Contract?.decimals(),
      Token1Contract?.decimals()
    ])

    const token0SymbolProper = getCustomTokenSymbol(chainId, token0Address) || token0Symbol
    const token1SymbolProper = getCustomTokenSymbol(chainId, token1Address) || token1Symbol

    return [
      new Token(chainId, token0Address, token0Decimals, token0SymbolProper, token0SymbolProper),
      new Token(chainId, token1Address, token1Decimals, token1SymbolProper, token1SymbolProper)
    ]
  }, [CurveContract, chainId, library])

  const getLiquidity = useCallback(async () => {
    if (!library) return { total: 0, tokens: [0, 0], weights: [0, 0], rates: [0, 0] }

    const [derivatives0, derivatives1] = await Promise.all([
      CurveContract?.derivatives(0),
      CurveContract?.derivatives(1)
    ])

    const [assimialtor0Address, assimialtor1Address] = await Promise.all([
      CurveContract?.assimilator(derivatives0),
      CurveContract?.assimilator(derivatives1)
    ])

    const Assimilator0Contract = getContract(assimialtor0Address, ASSIMILATOR_ABI, library)
    const Assimilator1Contract = getContract(assimialtor1Address, ASSIMILATOR_ABI, library)

    const [liquidity, rate0, rate1] = await Promise.all([
      CurveContract?.liquidity(),
      Assimilator0Contract.getRate(),
      Assimilator1Contract.getRate()
    ])

    const token0Numeraire = liquidity.individual_[0]
    const token0Value = token0Numeraire.mul(1e8).div(rate0)
    const token1Numeraire = liquidity.individual_[1]
    const token1Value = token1Numeraire.mul(1e8).div(rate1)

    const token0Weight = Fraction.from(token0Numeraire, liquidity.total_).toString()
    const token1Weight = Fraction.from(token1Numeraire, liquidity.total_).toString()

    const token0Rate = Number(formatUnits(rate0, 8))
    const token1Rate = Number(formatUnits(rate1, 8))

    return {
      total: liquidity.total_,
      tokens: [token0Value, token1Value],
      weights: [Number(token0Weight), Number(token1Weight)],
      rates: [token0Rate, token1Rate],
      assimilators: [assimialtor0Address, assimialtor1Address]
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
    if (pid === undefined) return BigNumber.from(0)

    const res = await RewardsContract?.userInfo(pid, account)
    return res.amount
  }, [RewardsContract, account, pid])

  const getPendingRewards = useCallback(async () => {
    if (pid === undefined) return BigNumber.from(0)

    const res = await RewardsContract?.pendingRewardToken(pid, account)
    return res
  }, [RewardsContract, account, pid])

  return { getTokens, getLiquidity, getBalance, getTotalSupply, getStakedLPToken, getPendingRewards }
}
