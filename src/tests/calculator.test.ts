import { calculateBaseApr } from '../utils/calculator'

describe('Base APR Test', () => {
  it('xSGD:USDC Mainnet', () => {
    const baseTokenValue = 183024
    const baseTokenUSDPrice = 0.7493828582908841
    const quoteTokenValue = 136382.862482
    const quoteTokenUSDPrice = 1.0031171595081583
    const hlpMintedValue = 272801.664576
    const totalCurveLiquidity = 273053.958493
    const totalCurveSupply = 274825.51481808303
    const noOfDaysSinceFirstDeposit = 209
    const expectedBaseApr = 1.881367696394045
    const actualBaseApr = calculateBaseApr(
      baseTokenValue,
      baseTokenUSDPrice,
      quoteTokenValue,
      quoteTokenUSDPrice,
      hlpMintedValue,
      totalCurveLiquidity,
      totalCurveSupply,
      noOfDaysSinceFirstDeposit
    )
    expect(actualBaseApr).toEqual(expectedBaseApr)
  })

  it('TCAD:USDC Mainnet', () => {
    const baseTokenValue = 120
    const baseTokenUSDPrice = 0.790864
    const quoteTokenValue = 94.739517
    const quoteTokenUSDPrice = 1.0031171595081583
    const hlpMintedValue = 189.504
    const totalCurveLiquidity = 108881.00936770294
    const totalCurveSupply = 108713.20562479919
    const noOfDaysSinceFirstDeposit = 209
    const expectedBaseApr = 0.13066784692511885
    const actualBaseApr = calculateBaseApr(
      baseTokenValue,
      baseTokenUSDPrice,
      quoteTokenValue,
      quoteTokenUSDPrice,
      hlpMintedValue,
      totalCurveLiquidity,
      totalCurveSupply,
      noOfDaysSinceFirstDeposit
    )
    expect(expectedBaseApr).toEqual(actualBaseApr)
  })

  it('TGBP:USDC Mainnet', () => {
    const baseTokenValue = 634.4908624191117
    const baseTokenUSDPrice = 1.5192000576653424
    const quoteTokenValue = 880.182994
    const quoteTokenUSDPrice = 1.0031171595081583
    const hlpMintedValue = 1760.5979348577996
    const totalCurveLiquidity = 87251.54257865633
    const totalCurveSupply = 89487.66543379429
    const noOfDaysSinceFirstDeposit = 209
    const expectedBaseApr = 13.250274107746945
    const actualBaseApr = calculateBaseApr(
      baseTokenValue,
      baseTokenUSDPrice,
      quoteTokenValue,
      quoteTokenUSDPrice,
      hlpMintedValue,
      totalCurveLiquidity,
      totalCurveSupply,
      noOfDaysSinceFirstDeposit
    )
    expect(expectedBaseApr).toEqual(actualBaseApr)
  })

  it('fxPHP:USDC Mainnet', () => {
    const baseTokenValue = 1003343.8102085856
    const baseTokenUSDPrice = 0.019202
    const quoteTokenValue = 20000
    const quoteTokenUSDPrice = 1.0028818674055455
    const hlpMintedValue = 40005.324400636724
    const totalCurveLiquidity = 1965.1239031812595
    const totalCurveSupply = 2002.259820031829
    const noOfDaysSinceFirstDeposit = 146
    const expectedBaseApr = 0.38521693178455996
    const actualBaseApr = calculateBaseApr(
      baseTokenValue,
      baseTokenUSDPrice,
      quoteTokenValue,
      quoteTokenUSDPrice,
      hlpMintedValue,
      totalCurveLiquidity,
      totalCurveSupply,
      noOfDaysSinceFirstDeposit
    )
    expect(expectedBaseApr).toEqual(actualBaseApr)
  })

  it('UST:USDC Mainnet', () => {
    const baseTokenValue = 9481.037924
    const baseTokenUSDPrice = 1.00071036
    const quoteTokenValue = 9500.011115
    const quoteTokenUSDPrice = 1.0002616763821996
    const hlpMintedValue = 19000
    const totalCurveLiquidity = 19004.028242
    const totalCurveSupply = 19017.278472530183
    const noOfDaysSinceFirstDeposit = 17
    const expectedBaseApr = 0.3967036305131726
    const actualBaseApr = calculateBaseApr(
      baseTokenValue,
      baseTokenUSDPrice,
      quoteTokenValue,
      quoteTokenUSDPrice,
      hlpMintedValue,
      totalCurveLiquidity,
      totalCurveSupply,
      noOfDaysSinceFirstDeposit
    )
    expect(expectedBaseApr).toEqual(actualBaseApr)
  })
})
