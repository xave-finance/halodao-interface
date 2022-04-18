import { calculateBaseApr } from '../utils/calculator'

describe('Base APR Test', () => {
  it('xSGD:USDC Mainnet', () => {
    // Link of the first deposit tx : https://etherscan.io/tx/0xead0a9717cb13feff2ee58d78786b7b2eac68eafe61809d7bfecf67986222ba8
    // First Transfer event data of Transaction Receipt Event Logs
    const baseTokenValue = 183024
    // From coingecko or chainlink oracle
    const baseTokenUSDPrice = 0.7493828582908841
    // Second Transfer event data of Transaction Receipt Event Logs
    const quoteTokenValue = 136382.862482
    // From coingecko
    const quoteTokenUSDPrice = 1.0031171595081583
    // Third Transfer event data of Transaction Receipt Event Logs
    const hlpMintedValue = 272801.664576
    // From curve's liquidity() and totalSupply()
    const totalCurveLiquidity = 273053.958493
    const totalCurveSupply = 274825.51481808303
    // Math.floor((dateNow - <Timestamp from Transaction Receipt> * 1000) / (1000 * 60 * 60 * 24))
    const noOfDaysSinceFirstDeposit = 209
    // Value from manual computation
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
    // Link of the first deposit tx : https://etherscan.io/tx/0x6038346288968a18c766987b8a7811a2df17a25316edeb23800bb2125ba5902f
    // First Transfer event data of Transaction Receipt Event Logs
    const baseTokenValue = 120
    // From coingecko or chainlink oracle
    const baseTokenUSDPrice = 0.790864
    // Second Transfer event data of Transaction Receipt Event Logs
    const quoteTokenValue = 94.739517
    // From coingecko
    const quoteTokenUSDPrice = 1.0031171595081583
    // Third Transfer event data of Transaction Receipt Event Logs
    const hlpMintedValue = 189.504
    // From curve's liquidity() and totalSupply()
    const totalCurveLiquidity = 108881.00936770294
    const totalCurveSupply = 108713.20562479919
    // Math.floor((dateNow - <Timestamp from Transaction Receipt> * 1000) / (1000 * 60 * 60 * 24))
    const noOfDaysSinceFirstDeposit = 209
    // Value from manual computation
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
    // Link of the first deposit tx : https://etherscan.io/tx/0xe1ba04f32987d607980ad89260942e16642ea74b23f1175a06dbc90ad0a30f28
    // First Transfer event data of Transaction Receipt Event Logs
    const baseTokenValue = 634.4908624191117
    // From coingecko or chainlink oracle
    const baseTokenUSDPrice = 1.5192000576653424
    // Second Transfer event data of Transaction Receipt Event Logs
    const quoteTokenValue = 880.182994
    // From coingecko
    const quoteTokenUSDPrice = 1.0031171595081583
    // Third Transfer event data of Transaction Receipt Event Logs
    const hlpMintedValue = 1760.5979348577996
    // From curve's liquidity() and totalSupply()
    const totalCurveLiquidity = 87251.54257865633
    const totalCurveSupply = 89487.66543379429
    // Math.floor((dateNow - <Timestamp from Transaction Receipt> * 1000) / (1000 * 60 * 60 * 24))
    const noOfDaysSinceFirstDeposit = 209
    // Value from manual computation
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
    // Link of the first deposit tx : https://etherscan.io/tx/0x6dc4b1c61c00004c85ec953a0d00bd680bb42109977fb19bf4f4cfa7382910dc
    // First Transfer event data of Transaction Receipt Event Logs
    const baseTokenValue = 1003343.8102085856
    // From coingecko or chainlink oracle
    const baseTokenUSDPrice = 0.019202
    // Second Transfer event data of Transaction Receipt Event Logs
    const quoteTokenValue = 20000
    // From coingecko
    const quoteTokenUSDPrice = 1.0028818674055455
    // Third Transfer event data of Transaction Receipt Event Logs
    const hlpMintedValue = 40005.324400636724
    // From curve's liquidity() and totalSupply()
    const totalCurveLiquidity = 1965.1239031812595
    const totalCurveSupply = 2002.259820031829
    // Math.floor((dateNow - <Timestamp from Transaction Receipt> * 1000) / (1000 * 60 * 60 * 24))
    const noOfDaysSinceFirstDeposit = 146
    // Value from manual computation
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
    // Link of the first deposit tx : https://etherscan.io/tx/0xa605e6a3bf8c64b1a9f3e835dda1e61a77027789a6bde64dab43f91657d29081
    // First Transfer event data of Transaction Receipt Event Logs
    const baseTokenValue = 9481.037924
    // From coingecko or chainlink oracle
    const baseTokenUSDPrice = 1.00071036
    // Second Transfer event data of Transaction Receipt Event Logs
    const quoteTokenValue = 9500.011115
    // From coingecko
    const quoteTokenUSDPrice = 1.0002616763821996
    // Third Transfer event data of Transaction Receipt Event Logs
    const hlpMintedValue = 19000
    // From curve's liquidity() and totalSupply()
    const totalCurveLiquidity = 19004.028242
    const totalCurveSupply = 19017.278472530183
    // Math.floor((dateNow - <Timestamp from Transaction Receipt> * 1000) / (1000 * 60 * 60 * 24))
    const noOfDaysSinceFirstDeposit = 17
    // Value from manual computation
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
