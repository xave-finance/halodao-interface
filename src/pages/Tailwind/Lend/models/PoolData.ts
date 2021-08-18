import { Token } from '@sushiswap/sdk'
import { BigNumber } from 'ethers'

export interface PoolData {
  name: string
  token0: Token
  token1: Token
  pooled: {
    token0: number
    token1: number
  }
  held: number
  staked: number
  earned: number
}
