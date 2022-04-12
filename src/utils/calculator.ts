import { DEPOSIT_TXHASH } from '../constants/pools'
import { getContract } from './index'
import CURVE_ABI from '../constants/haloAbis/Curve.json'
import { getTokenUSDPriceAtDate, getTxDate } from './coingecko'
import { haloTokenList, TOKEN_COINGECKO_NAME, CHAINLINK_ORACLE } from '../constants/tokenLists/halo-tokenlist'
import { ChainId, Token } from '@halodao/sdk'
import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { getTokenUSDPriceOracle } from './chainlinkOracle'

export async function calculateBaseApr(
  poolAddress: string,
  tokenPair: string,
  account: any,
  library: any,
  chainId: any
): Promise<number> {
  const poolsWithBaseAPR = Object.keys(DEPOSIT_TXHASH)
  let initialUsdHlpPrice = 0
  let currentUsdHlpPrice = 0
  let quoteTokenInitialUsdPrice = 0
  let baseTokenInitialUsdPrice = 0
  let hlpMintedValue = 0
  let noOfDaysSinceFirstDeposit = 0

  if (!library || !poolsWithBaseAPR.includes(poolAddress.toLowerCase())) return 0

  const txReceipt = await library.getTransactionReceipt(DEPOSIT_TXHASH[poolAddress.toLowerCase()])
  const curveContract = getContract(poolAddress, CURVE_ABI, library, account ?? undefined)
  const txTimestamp = (await library.getBlock(txReceipt.blockNumber)).timestamp
  const date = getTxDate(txTimestamp)
  // get the transfer logs
  const logs = txReceipt.logs.filter(
    (value: any) => value.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  )

  //compute the number of days since the first deposit
  const dateNow = new Date().getTime()
  noOfDaysSinceFirstDeposit = Math.floor((dateNow - txTimestamp * 1000) / (1000 * 60 * 60 * 24))

  // get the base token symbol and info
  const baseToken = tokenPair.split('/')[0]
  const baseTokenInfo = (haloTokenList[chainId as ChainId] as Token[]).filter(token => token.symbol === baseToken)[0]

  // Calculate initial USD:HLP price during the first deposit tx of the pool
  let baseTokenUSDPrice: number
  // Check if the token price is available in coingecko else get it in chainlink
  if (TOKEN_COINGECKO_NAME[baseToken]) {
    baseTokenUSDPrice = await getTokenUSDPriceAtDate(TOKEN_COINGECKO_NAME[baseToken], date)
  } else {
    baseTokenUSDPrice = await getTokenUSDPriceOracle(CHAINLINK_ORACLE[baseToken], library)
  }
  baseTokenInitialUsdPrice =
    parseFloat(ethers.utils.formatUnits(logs[0].data, baseTokenInfo.decimals)) * baseTokenUSDPrice
  quoteTokenInitialUsdPrice =
    parseFloat(ethers.utils.formatUnits(logs[1].data, 6)) *
    (await getTokenUSDPriceAtDate(TOKEN_COINGECKO_NAME['USDC'], date))
  hlpMintedValue = parseFloat(ethers.utils.formatUnits(logs[2].data, 18))

  initialUsdHlpPrice = (baseTokenInitialUsdPrice + quoteTokenInitialUsdPrice) / hlpMintedValue

  // Calculate current USD:HLP price
  const [curveLiquidity, curveTotalSupply] = await Promise.all([curveContract.liquidity(), curveContract.totalSupply()])
  currentUsdHlpPrice = parseFloat(formatEther(curveLiquidity.total_)) / parseFloat(formatEther(curveTotalSupply))

  // Calculate the Base APR
  return (initialUsdHlpPrice / currentUsdHlpPrice - 1) * ((365 / noOfDaysSinceFirstDeposit) * 100)
}
