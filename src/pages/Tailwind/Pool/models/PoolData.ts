import { BigNumber } from '@ethersproject/bignumber'
import { Token } from '@halodao/sdk'

export interface PoolData {
  vaultPoolId: string
  rewardsPoolId: number
  address: string
  name: string
  totalSupply: BigNumber
  totalLiquidity: BigNumber
  tokens: {
    token: Token
    balance: BigNumber
    weight: BigNumber
    rate: BigNumber
  }[]
  userInfo: {
    held: BigNumber
    staked: BigNumber
    earned: BigNumber
  }
}
