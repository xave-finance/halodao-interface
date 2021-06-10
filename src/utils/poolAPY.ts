import { ChainId } from "@sushiswap/sdk"
import { HALO_TOKEN_ADDRESS } from "../constants/index"
import { TokenPrice } from "halo-hooks/useBalancer"

export const monthlyReward = (rewardTokenPerSecond: number) => {
    // (days * hrs * min * s) * reward token/s
    return rewardTokenPerSecond ? (30 * 24 * 60 * 60) * rewardTokenPerSecond : 0
}

export const rewardMonthUSDValue = (
    allocPoint: number,
    totalAllocPoint: number,
    monthlyReward: number,
    USDPrice: number
) => {
    return (allocPoint / totalAllocPoint) * (monthlyReward * +USDPrice)
}

export const monthlyInterest = (rewardMonthUSDValue: number, poolLiquidity: number) => {
    return rewardMonthUSDValue / poolLiquidity
}

export const monthlyAPY = (monthlyInterest: number) => {
    return monthlyInterest * 100
}

export const apy = (
    chainId: ChainId,
    monthlyReward: number,
    totalAllocPoint: number,
    tokenPrice: TokenPrice | number,
    allocPoint: number,
    poolLiquidity: number
) => {
    const tokenAddr = HALO_TOKEN_ADDRESS[chainId] ?? ''

    // Can accept number or token price address
    const USDPrice = typeof tokenPrice === 'object' && tokenAddr !== undefined ? tokenPrice[tokenAddr] : tokenPrice
    const _rewardMonthUSDValue = rewardMonthUSDValue(allocPoint, totalAllocPoint, monthlyReward, +USDPrice)
    // Note that this is not a monthlyAPY
    const _monthlyInterest = monthlyInterest(_rewardMonthUSDValue, poolLiquidity)
    const _monthlyAPY = monthlyAPY(_monthlyInterest)

    // APY
    return _monthlyAPY ? parseFloat((_monthlyAPY * 12).toFixed(2)) : 0
}
