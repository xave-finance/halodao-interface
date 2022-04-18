export function calculateBaseApr(
  baseTokenValue: number,
  baseTokenUSDPrice: number,
  quoteTokenValue: number,
  quoteTokenUSDPrice: number,
  hlpMintedValue: number,
  totalCurveLiquidity: number,
  totalCurveSupply: number,
  noOfDaysSinceFirstDeposit: number
): number {
  // Calculate initial USD:HLP price during the first deposit tx of the pool
  const baseTokenInitialUsdPrice = baseTokenValue * baseTokenUSDPrice
  const quoteTokenInitialUsdPrice = quoteTokenValue * quoteTokenUSDPrice
  const initialUsdHlpPrice = (baseTokenInitialUsdPrice + quoteTokenInitialUsdPrice) / hlpMintedValue

  // Calculate current USD:HLP price
  const currentUsdHlpPrice = totalCurveLiquidity / totalCurveSupply

  // Calculate the Base APR
  return Math.abs(initialUsdHlpPrice / currentUsdHlpPrice - 1) * ((365 / noOfDaysSinceFirstDeposit) * 100)
}
