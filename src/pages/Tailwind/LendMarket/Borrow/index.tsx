import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import StatsCard from '../StatsCard'
import RewardsCard from '../RewardsCard'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import { HALO, USDT, XSGD, USDC } from '../../../../constants'
import { PoolData, UserLendData, UserBorrowData } from '../models/PoolData'
import Stepper, { StepperMode } from '../modals/Stepper'

const DepositContent = () => {
  return (
    <>
      <Stepper mode={StepperMode.Deposit} />
    </>
  )
}

const WithdrawContent = () => {
  return (
    <>
      <Stepper mode={StepperMode.Withdraw} />
    </>
  )
}

const Borrow = () => {
  const { account, error } = useWeb3React()
  const [showModal, setShowModal] = useState(false)
  const [activeSegment, setActiveSegment] = useState(0)

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
    <PageWrapper className="mb-8 md:space-x-8 flex flex-col md:flex-row">
      <div className="md:w-1/2">
        <PageHeaderLeft subtitle="Borrow" title="RNBW" caption="" />
        <StatsCard
          currency={HALO[ChainId.MAINNET]}
          label1="Your balance"
          value1={100.89}
          label2="Supply APY"
          value2={100.89}
          label3="Asset Price"
          value3={100.89}
          label4="Collateral Factor"
          value4={100.89}
          label5="Amount Supplied"
          value5={100.89}
          label6="Amount earned"
          value6={100.89}
          label7="Total Market size"
          value7={123456789.89}
        />
        <div className="mt-6">
          <RewardsCard />
        </div>
      </div>
      <div className="md:w-1/2">
        <div className="px-8">
          <SegmentControl
            segments={['Borrow', 'Repay']}
            activeSegment={activeSegment}
            didChangeSegment={i => setActiveSegment(i)}
            className="py-4 px-6 text-base uppercase"
          />
          {activeSegment === 0 ? <DepositContent /> : <WithdrawContent />}
        </div>
      </div>
    </PageWrapper>
  )
}

export default Borrow
