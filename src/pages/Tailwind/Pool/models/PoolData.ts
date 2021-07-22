export interface PoolData {
  name: string
  tokenA: {
    bal: number
    symbol: string
  }
  tokenB: {
    bal: number
    symbol: string
  }
  held: number
  staked: number
  earned: number
}
