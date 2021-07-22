import PoolBigButton from 'components/Tailwind/Buttons/PoolBigButton'
import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { PoolData } from './models/PoolData'

interface PoolCardRightProps {
  pool: PoolData
}

const PoolCardRight = ({ pool }: PoolCardRightProps) => {
  return (
    <div className="p-4 text-white bg-primary-hover rounded-tr-card rounded-tl-card md:rounded-br-card md:rounded-bl-card">
      <div className="text-xs font-extrabold tracking-widest text-white opacity-60 uppercase">Pool Overview</div>
      <div className="text-2xl font-semibold">{formatNumber(547400.945, NumberFormat.usdLong)}</div>
      <div className="py-4 text-center border-b border-white">
        <div className="mt-4 font-bold">
          {formatNumber(0.73, NumberFormat.percentShort)} XSGD • {formatNumber(0.26, NumberFormat.percentShort)} USDT
        </div>
        <div className="mt-4 font-bold">
          1LP = {formatNumber(0.73892)} XSGT + {formatNumber(0.26123)} USDT
        </div>
      </div>
      <div className="pt-4 flex flex-col md:flex-row">
        <div className="mb-4 flex-1 md:mb-0">
          <div className="font-bold">LP tokens for this pool</div>
          <div className="font-fredoka text-4xl">{formatNumber(pool.staked)} LPT</div>
        </div>
        <div className="flex items-end">
          <PoolBigButton title="Stake it" isEnabled={pool.staked > 0} onClick={() => {}} />
        </div>
      </div>
    </div>
  )
}

export default PoolCardRight
