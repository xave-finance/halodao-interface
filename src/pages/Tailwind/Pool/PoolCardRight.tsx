import PoolBigButton from 'components/Tailwind/Buttons/PoolBigButton'
import React from 'react'
import Chart from 'react-google-charts'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { PoolData } from './models/PoolData'

interface PoolCardRightProps {
  pool: PoolData
}

const PoolCardRight = ({ pool }: PoolCardRightProps) => {
  const stake = () => {
    console.log('stake')
  }

  return (
    <div className="p-4 text-white bg-primary-hover rounded-tr-card rounded-tl-card md:rounded-br-card md:rounded-bl-card">
      <div className="text-xs font-extrabold tracking-widest text-white opacity-60 uppercase">Pool Overview</div>
      <div className="text-2xl font-semibold">{formatNumber(547400.945, NumberFormat.usdLong)}</div>
      <div className="pb-4 text-center border-b border-white">
        <Chart
          width={'100%'}
          height={'150px'}
          chartType="PieChart"
          data={[
            ['Token', 'Distribution'],
            [pool.token0.symbol, 399602.6935],
            [pool.token1.symbol, 147798.2565]
          ]}
          options={{
            legend: 'none',
            backgroundColor: 'transparent',
            colors: ['#C4C4C4', '#FBFAFF'],
            pieSliceText: 'none'
          }}
        />
        <div className="font-bold">
          {formatNumber(0.73, NumberFormat.percentShort)} {pool.token0.symbol} •{' '}
          {formatNumber(0.26, NumberFormat.percentShort)} {pool.token1.symbol}
        </div>
        <div className="mt-4 font-bold">
          1LP = {formatNumber(0.73892)} {pool.token0.symbol} + {formatNumber(0.26123)} {pool.token1.symbol}
        </div>
      </div>
      <div className="pt-4 flex flex-col md:flex-row">
        <div className="mb-4 flex-1 md:mb-0">
          <div className="font-bold">LP tokens for this pool</div>
          <div className="font-fredoka text-4xl">{formatNumber(pool.staked)} LPT</div>
        </div>
        <div className="flex items-end">
          <PoolBigButton title="Stake it" isEnabled={pool.staked > 0} onClick={stake} />
        </div>
      </div>
    </div>
  )
}

export default PoolCardRight
