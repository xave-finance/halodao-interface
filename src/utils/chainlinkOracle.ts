import { getContract } from './index'
import CHAINLINK_ABI from '../constants/abis/chainlinkOracle.json'
import { formatUnits } from 'ethers/lib/utils'

export async function getTokenUSDPriceOracle(address: string, library: any) {
  const tokenContract = getContract(address, CHAINLINK_ABI, library)
  const [latestAnswer, decimal] = await Promise.all([tokenContract.latestAnswer(), tokenContract.decimals()])
  return Number(formatUnits(latestAnswer, decimal))
}
