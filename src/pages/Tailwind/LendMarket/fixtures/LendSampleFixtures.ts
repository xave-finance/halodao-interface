import { ChainId } from '@halodao/sdk'
import { PoolData, UserLendData } from '../models/PoolData'
import { HALO, USDT, XSGD } from '../../../../constants'

export const pools: PoolData[] = [
  {
    asset: HALO[ChainId.MAINNET]!,//eslint-disable-line
    marketSize: 1000,
    borrowed: 100,
    depositAPY: 40,
    borrowAPY: 10,
    earned: 0
  },
  {
    asset: USDT,
    marketSize: 1000,
    borrowed: 100,
    depositAPY: 40,
    borrowAPY: 10,
    earned: 0
  },
  {
    asset: XSGD,
    marketSize: 1000,
    borrowed: 100,
    depositAPY: 40,
    borrowAPY: 10,
    earned: 0
  }
]

export const userLends: UserLendData[] = [
  {
    asset: HALO[ChainId.MAINNET]!,//eslint-disable-line
    balance: 1000,
    lendAPY: 40,
    collateral: false
  },
  {
    asset: USDT,
    balance: 100000,
    lendAPY: 40,
    collateral: true
  }
]
