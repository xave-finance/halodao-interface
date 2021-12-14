import React, { useState } from 'react'
import { ChainId } from '@halodao/sdk'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import StatsCard from '../StatsCard'
import RewardsCard from '../RewardsCard'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import { HALO } from '../../../../constants'
import Stepper, { StepperMode } from '../modals/Stepper'

const BorrowContent = () => {
  return (
    <>
      <Stepper mode={StepperMode.Borrow} />
    </>
  )
}

const RepayContent = () => {
  return (
    <>
      <Stepper mode={StepperMode.Repay} />
    </>
  )
}

const Borrow = () => {
  const [activeSegment, setActiveSegment] = useState(0)

  return (
    <PageWrapper className="mb-8 md:space-x-8 flex flex-col md:flex-row">
      <div className="md:w-1/2">
        <PageHeaderLeft subtitle="Borrow" title="RNBW" caption="" />
        <StatsCard
          currency={HALO[ChainId.MAINNET]}
          label1="Total Borrowed"
          value1={100.89}
          label2="Borrow APY"
          value2={100.89}
          label3="Asset Price"
          value3={100.89}
          label4="Collateral Factor"
          value4={100.89}
          label5="Amount Supplied"
          value5={100.89}
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
          {activeSegment === 0 ? <BorrowContent /> : <RepayContent />}
        </div>
      </div>
    </PageWrapper>
  )
}

export default Borrow
