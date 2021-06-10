import { monthlyReward, rewardMonthUSDValue, monthlyInterest, monthlyAPY, apy } from 'utils/poolAPY'

describe('Percentage Yield', () => {
  const chainId = 42
  const rewardTokenPerSecond = 0.00038580246913580245 // 1k rewards/mo
  const USDPrice = 1
  const totalAllocPoint = 100
  const allocPoint = 100
  const poolLiquidity = 100
  const _monthlyReward = 1000
  const _monthlyRewardUSD = 1000
  const _monthlyInterest = 10
  const _monthlyAPY = 1000
  const _apy = _monthlyAPY * 12

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
    const poolAPY = apy(chainId, _monthlyReward, totalAllocPoint, USDPrice, allocPoint, poolLiquidity)

    expect(poolAPY).toEqual(_apy)
  })
})
