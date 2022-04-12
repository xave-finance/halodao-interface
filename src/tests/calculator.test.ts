describe('Base APR Test', () => {
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
  // const rewardTokenPerSecond = 0.00038580246913580245 // 1k rewards/mo
  // const USDPrice = 1
  // const totalAllocPoint = 100
  // const allocPoint = 100
  // const stakedLiquidity = 100
  // const expectedMonthlyReward = 1000
  // const monthlyRewardUSD = 1000
  // const expectedMonthlyInterest = 10
  // const expectedMonthlyAPY = 1000
  // const expectedApy = 12000

  it('xSGD:USDC Mainnet', () => {
    // prepare your input params
    // pass to calculateBaseApr
    // expectedxSGDUSDCBaseAPR = the value we manually calculated in jira
    // actualxSGDUSDCBaseAPR = the value we get from calculateBaseApr
    // expect(expectedxSGDUSDCBaseAPR).toEqual(actualxSGDUSDCBaseAPR)
  })

  it('TCAD:USDC Mainnet', () => {
    // prepare your input params
    // pass to calculateBaseApr
    // expectedTCADUSDCBaseAPR = the value we manually calculated in PR page
    // actualTCADUSDCBaseAPR = the value we get from calculateBaseApr
    // expect(expectedTCADDUSDCBaseAPR).toEqual(actualTCADUSDCBaseAPR)
  })

  it('TGBP:USDC Mainnet', () => {
    // prepare your input params
    // pass to calculateBaseApr
    // expectedTGBPUSDCBaseAPR = the value we manually calculated in PR page
    // actualTGBPUSDCBaseAPR = the value we get from calculateBaseApr
    // expect(expectedTGBPUSDCBaseAPR).toEqual(actualxSGDUSDCBaseAPR)
  })

  it('UST:USDC', () => {})
})
