import { ChainId } from '@sushiswap/sdk'
import { HALO_TOKEN_ADDRESS } from '../constants/index'

import { monthlyReward, rewardMonthUSDValue, monthlyInterest, monthlyAPY, apy } from 'utils/poolAPY'

describe('Percentage Yield', () => {
  /**
   * Based from the scenario given by Chris
   *
   * 100 USD staked in the pool by 1 wallet,
   * 1k HALO per month at 1 USD/HALO,
   * 100 pool alloc points and 100 total alloc points
   *
   * If theres 100 USD in a pool, then 1000 USD is rewarded to it in
   * a month then thats x10 which is 1000% in a month. then x12 is 12,000%
   *
   * So APY should be 12000
   */
  const rewardTokenPerSecond = 0.00038580246913580245 // 1k rewards/mo
  const USDPrice = 1
  const totalAllocPoint = 100
  const allocPoint = 100
  const poolLiquidity = 100
  const expectedMonthlyReward = 1000
  const monthlyRewardUSD = 1000
  const expectedMonthlyInterest = 10
  const expectedMonthlyAPY = 1000
  const expectedApy = 12000

  it('monthly reward', () => {
    expect(monthlyReward(rewardTokenPerSecond)).toEqual(expectedMonthlyReward)
  })

  it('monthly reward in USD', () => {
    expect(rewardMonthUSDValue(allocPoint, totalAllocPoint, monthlyReward(rewardTokenPerSecond), USDPrice)).toEqual(
      monthlyRewardUSD
    )
  })

  it('monthly interest', () => {
    const expectedRewardMonthUSDValue = rewardMonthUSDValue(
      allocPoint,
      totalAllocPoint,
      monthlyReward(rewardTokenPerSecond),
      USDPrice
    )

    expect(monthlyInterest(expectedRewardMonthUSDValue, poolLiquidity)).toEqual(expectedMonthlyInterest)
  })

  it('monthly percentage yield', () => {
    const expectedRewardMonthUSDValue = rewardMonthUSDValue(
      allocPoint,
      totalAllocPoint,
      monthlyReward(rewardTokenPerSecond),
      USDPrice
    )
    const expectedMonthlyInterest = monthlyInterest(expectedRewardMonthUSDValue, poolLiquidity)

    expect(monthlyAPY(expectedMonthlyInterest)).toEqual(expectedMonthlyAPY)
  })

  it('annual percentage yield', () => {
    const expectedMonthlyReward = monthlyReward(rewardTokenPerSecond)
    const USDPrice = { [HALO_TOKEN_ADDRESS[ChainId.MAINNET] ?? '']: 1 }

    const poolAPY = apy(expectedMonthlyReward, totalAllocPoint, USDPrice, allocPoint, poolLiquidity)

    expect(poolAPY).toEqual(expectedApy)
  })
})
