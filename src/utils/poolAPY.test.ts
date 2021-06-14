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
  const chainId = ChainId.KOVAN
  const rewardTokenPerSecond = 0.00038580246913580245 // 1k rewards/mo
  const USDPrice = 1
  const totalAllocPoint = 100
  const allocPoint = 100
  const poolLiquidity = 100
  const _monthlyReward = 1000
  const _monthlyRewardUSD = 1000
  const _monthlyInterest = 10
  const _monthlyAPY = 1000
  const _apy = 12000

  it('monthly reward', () => {
    expect(monthlyReward(rewardTokenPerSecond)).toEqual(_monthlyReward)
  })

  it('monthly reward in USD', () => {
    expect(rewardMonthUSDValue(allocPoint, totalAllocPoint, monthlyReward(rewardTokenPerSecond), USDPrice)).toEqual(
      _monthlyRewardUSD
    )
  })

  it('monthly interest', () => {
    const _rewardMonthUSDValue = rewardMonthUSDValue(
      allocPoint,
      totalAllocPoint,
      monthlyReward(rewardTokenPerSecond),
      USDPrice
    )

    expect(monthlyInterest(_rewardMonthUSDValue, poolLiquidity)).toEqual(_monthlyInterest)
  })

  it('monthly percentage yield', () => {
    const _rewardMonthUSDValue = rewardMonthUSDValue(
      allocPoint,
      totalAllocPoint,
      monthlyReward(rewardTokenPerSecond),
      USDPrice
    )
    const _monthlyInterest = monthlyInterest(_rewardMonthUSDValue, poolLiquidity)

    expect(monthlyAPY(_monthlyInterest)).toEqual(_monthlyAPY)
  })

  it('annual percentage yield', () => {
    const _monthlyReward = monthlyReward(rewardTokenPerSecond)
    const USDPrice = { [HALO_TOKEN_ADDRESS[ChainId.KOVAN]]: 1 }

    const poolAPY = apy(chainId, _monthlyReward, totalAllocPoint, USDPrice, allocPoint, poolLiquidity)

    expect(poolAPY).toEqual(_apy)
  })
})
