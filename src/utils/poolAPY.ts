import { ChainId } from '@sushiswap/sdk'
import { HALO_TOKEN_ADDRESS } from '../constants/index'
import { TokenPrice } from 'halo-hooks/useTokenPrice'

export const monthlyReward = (rewardTokenPerSecond: number) => {
  // (days * hrs * min * s) * reward token/s
  return rewardTokenPerSecond ? 30 * 24 * 60 * 60 * rewardTokenPerSecond : 0
}

export const rewardMonthUSDValue = (
  allocPoint: number,
  totalAllocPoint: number,
  monthlyReward: number,
  USDPrice: number
) => {
  return (allocPoint / totalAllocPoint) * (monthlyReward * +USDPrice)
}

export const monthlyInterest = (rewardMonthUSDValue: number, stakedLiquidity: number) => {
  return stakedLiquidity ? rewardMonthUSDValue / stakedLiquidity : 0
}

export const monthlyAPY = (monthlyInterest: number) => {
  return monthlyInterest * 100
}

export const apy = (
  monthlyReward: number,
  totalAllocPoint: number,
  tokenPrice: TokenPrice,
  allocPoint: number,
  stakedLiquidity: number
) => {
  const tokenAddr = HALO_TOKEN_ADDRESS[ChainId.MAINNET] ?? ''

  // Can accept number or token price address
  const USDPrice = tokenPrice[tokenAddr] ?? 0
  const expectedRewardMonthUSDValue = rewardMonthUSDValue(allocPoint, totalAllocPoint, monthlyReward, USDPrice)
  // Note that this is not a monthlyAPY
  const expectedMonthlyInterest = monthlyInterest(expectedRewardMonthUSDValue, stakedLiquidity)

  // APY
  return monthlyAPY(expectedMonthlyInterest) * 12
}
