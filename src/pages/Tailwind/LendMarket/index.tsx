import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderCenter from './PageHeaderCenter'
import PageHeaderRight from './PageHeaaderRight'
import PoolColumns from './PoolColumns'
import PoolRow from './PoolRow'
import UserLendColumn from './UserLendColumn'
import UserLendRow from './UserLendRow'
import UserBorrowColumn from './UserBorrowColumn'
import UserBorrowRow from './UserBorrowRow'
import { HALO, USDT, XSGD } from '../../../constants'
import { PoolData, UserLendData, UserBorrowData } from './models/PoolData'
import { ArrowUpCircle, ArrowDownCircle } from 'react-feather'

const LendMarket = () => {
  const { account, error } = useWeb3React()
  const [showModal, setShowModal] = useState(false)
  const [showUserReserves, setShowUserReserves] = useState(true)

  const pools: PoolData[] = [
    {
      asset: HALO[ChainId.MAINNET]!,
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

  const userLends: UserLendData[] = [
    {
      asset: HALO[ChainId.MAINNET]!,
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

  const userBorrows: UserBorrowData[] = [
    {
      asset: HALO[ChainId.MAINNET]!,
      borrowed: 1000,
      borrowAPY: 40
    },
    {
      asset: USDT,
      borrowed: 1000,
      borrowAPY: 40
    }
  ]

  return (
    <PageWrapper className="mb-8">
      <div className="flex flex-col md:flex-row md:space-x-4 pb-2">
        <div className="w-full md:w-3/6">
          <PageHeaderLeft
            subtitle="Overview"
            title="Lending Markets"
            caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim potenti faucibus adipiscing sed tempor diam, ipsum porta."
          />
        </div>
        <div className="hidden md:block md:w-3/6">
          <PageHeaderCenter />
        </div>
        <div className="hidden md:block md:w-2/6">
          <PageHeaderRight />
        </div>
      </div>
      {!showUserReserves && (
        <div className="bg-white rounded-lg filter drop-shadow p-4 mt-2 md:p-8">
          <div
            className="flex flex-row w-full justify-end cursor-pointer"
            onClick={() => setShowUserReserves(!showUserReserves)}
          >
            <span className="mr-2"> Hide </span> <ArrowDownCircle />{' '}
          </div>
        </div>
      )}
      {showUserReserves && (
        <div className="bg-white rounded-lg filter drop-shadow p-4 mt-2 md:p-8">
          <div className="flex flex-row w-full cursor-pointer">
            <span className="flex justify-start w-3/4 text-gray-600 text-sm uppercase"> Your Deposits </span>
            <div className="flex justify-end w-1/4" onClick={() => setShowUserReserves(!showUserReserves)}>
              {' '}
              <span className="mr-2"> Hide </span> <ArrowUpCircle />{' '}
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-6">
            <div className="md:w-3/5">
              <UserLendColumn />
            </div>
            <div className="md:w-2/5">
              <UserBorrowColumn />
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-x-4">
            <div className="md:w-3/5">
              {userLends.map(userLends => (
                <UserLendRow key={userLends.asset.name} lend={userLends} />
              ))}
            </div>
            <div className="md:w-2/5">
              {userLends.map(userLends => (
                <UserBorrowRow key={userLends.asset.name} lend={userLends} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 md:mt-12">
        <PoolColumns />
      </div>

      {pools.map(pool => (
        <PoolRow key={pool.asset.name} pool={pool} />
      ))}
    </PageWrapper>
  )
}

export default LendMarket
