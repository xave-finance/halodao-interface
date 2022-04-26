import PoolBigButton from 'components/Tailwind/Buttons/PoolBigButton'
import React from 'react'
import Chart from 'react-google-charts'
import { useHistory } from 'react-router'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { PoolData } from './models/PoolData'

interface PoolCardRightProps {
  pool: PoolData
  isActivePool?: boolean
}

const PoolCardRight = ({ pool, isActivePool }: PoolCardRightProps) => {
  const history = useHistory()

  const stake = () => {
    return isActivePool && pool.held > 0
      ? history.push(`/farm/${pool.address}`)
      : () => {
          // silent
        }
  }

  const lpToken0Price = pool.weights.token0 * (1 / pool.rates.token0)
  const lpToken1Price = pool.weights.token1 * (1 / pool.rates.token1)

  return (
    <div className="p-4 text-white bg-primary-hover rounded-tr-card rounded-tl-card md:rounded-br-card md:rounded-bl-card">
      <div className="text-xs font-extrabold tracking-widest text-white opacity-60 uppercase">Pool Overview</div>
      <div className="text-2xl font-semibold">{formatNumber(pool.pooled.total, NumberFormat.usdLong)}</div>
      <div className="pb-4 text-center border-b border-white">
        <Chart
          width={'100%'}
          height={'150px'}
          chartType="PieChart"
          data={[
            ['Token', 'Distribution'],
            [pool.token0.symbol, pool.weights.token0],
            [pool.token1.symbol, pool.weights.token1]
          ]}
          options={{
            legend: 'none',
            backgroundColor: 'transparent',
            colors: ['#C4C4C4', '#FBFAFF'],
            pieSliceText: 'none',
            is3D: true,
            tooltip: {
              text: 'percentage'
            }
          }}
        />
        <div className="font-bold">
          {formatNumber(pool.weights.token0, NumberFormat.percentShort)} {pool.token0.symbol} •{' '}
          {formatNumber(pool.weights.token1, NumberFormat.percentShort)} {pool.token1.symbol}
        </div>
        <div className="mt-4 font-bold">
          1LP = {formatNumber(lpToken0Price)} {pool.token0.symbol} + {formatNumber(lpToken1Price)} {pool.token1.symbol}
        </div>
      </div>
      <div className="pt-4 flex flex-col md:flex-row">
        <div className="mb-4 flex-1 md:mb-0">
          <div className="font-bold">LP tokens for this pool</div>
          <div className="font-fredoka text-4xl">{formatNumber(pool.held)} HLP</div>
        </div>
        <div className="flex items-end">
          <PoolBigButton title="Stake it" isEnabled={pool.held > 0} onClick={stake} />
        </div>
      </div>
    </div>
  )
}

export default PoolCardRight
