import React, { useState } from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'

const LendInfo = () => {
  return (
    <div className="flex flex-col border flex-auto mt-4">
      <div className="flex flex-row">
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">You Lent</div>
          <div className="text-2xl font-semibold">{formatNumber(10.123, NumberFormat.usd)}</div>
        </div>
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Info 3</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
      </div>
      <div className="flex flex-row pt-6">
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Info 2</div>
          <div className="text-2xl font-semibold">{formatNumber(10.123, NumberFormat.usd)}</div>
        </div>
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Info 4</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
      </div>
    </div>
  )
}

const BorrowInfo = () => {
  return (
    <div className="flex flex-col border flex-auto mt-4">
      <div className="flex flex-row">
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest ext-black uppercase">You Borrowed</div>
          <div className="text-2xl font-semibold">{formatNumber(10.123, NumberFormat.usd)}</div>
        </div>
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Borrowing Power</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
      </div>
      <div className="flex flex-row pt-6">
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Your Collateral</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
        <div className="flex flex-col flex-auto justify-between items-start w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Current LTV</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
      </div>
    </div>
  )
}

const PageHeaderCenter = () => {
  const [activeSegment, setActiveSegment] = useState(0)

  return (
    <div className="flex flex-col space-y-2 h-full md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex-auto bg-primary-dark bg-opacity-10 py-6 px-6 rounded-card flex flex-col">
        <div className="flex-initial w-1/2 ">
          <SegmentControl
            segments={['Lend Info', 'Borrow Info']}
            activeSegment={activeSegment}
            didChangeSegment={i => setActiveSegment(i)}
          />
        </div>
        {activeSegment === 0 ? <LendInfo /> : <BorrowInfo />}
      </div>
    </div>
  )
}

export default PageHeaderCenter
