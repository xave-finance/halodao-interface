import { Token } from '@sushiswap/sdk'
import { BigNumber } from 'ethers'

export interface PoolData {
  asset: Token
  marketSize: number
  borrowed: number
  depositAPY: number
  borrowAPY: number
  earned: number
}

export interface UserLendData {
  asset: Token
  balance: number
  lendAPY: number
  collateral: boolean
}

export interface UserBorrowData {
  asset: Token
  borrowed: number
  borrowAPY: number
}
