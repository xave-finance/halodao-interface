import { Token } from '@sushiswap/sdk'
export interface PoolData {
  pid?: string
  address: string
  name: string
  token0: Token
  token1: Token
  pooled: {
    total: number
    token0: number
    token1: number
  }
  weights: {
    token0: number
    token1: number
  }
  rates: {
    token0: number
    token1: number
  }
  held: number
  staked: number
  earned: number
  totalSupply: number
}
