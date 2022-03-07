import PoolBigButton from 'components/Tailwind/Buttons/PoolBigButton'
import { BigNumber } from 'ethers'
import React from 'react'
import Chart from 'react-google-charts'
import { useHistory } from 'react-router'
import { bigNumberToNumber } from 'utils/bigNumberHelper'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { PoolData } from './models/PoolData'

interface PoolCardRightProps {
  pool: PoolData
}

const PoolCardRight = ({ pool }: PoolCardRightProps) => {
  const history = useHistory()
  const token0 = pool.tokens[0].token
  const token1 = pool.tokens[1].token

  const stake = () => {
    history.push(`/farm/${pool.address}`)
  }

  const token0Price = bigNumberToNumber(pool.tokens[0].weight.mul(BigNumber.from(1).div(pool.tokens[0].rate)))
  const token1Price = bigNumberToNumber(pool.tokens[1].weight.mul(BigNumber.from(1).div(pool.tokens[1].rate)))

  return (
    <div className="p-4 text-white bg-primary-hover rounded-tr-card rounded-tl-card md:rounded-br-card md:rounded-bl-card">
      <div className="text-xs font-extrabold tracking-widest text-white opacity-60 uppercase">Pool Overview</div>
      <div className="text-2xl font-semibold">
        {formatNumber(bigNumberToNumber(pool.totalLiquidity), NumberFormat.usdLong)}
      </div>
      <div className="pb-4 text-center border-b border-white">
        <Chart
          width={'100%'}
          height={'150px'}
          chartType="PieChart"
          data={[
            ['Token', 'Distribution'],
            [token0.symbol, bigNumberToNumber(pool.tokens[0].weight)],
            [token1.symbol, bigNumberToNumber(pool.tokens[1].weight)]
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
          {formatNumber(bigNumberToNumber(pool.tokens[0].weight), NumberFormat.percentShort)} {token0.symbol} •{' '}
          {formatNumber(bigNumberToNumber(pool.tokens[1].weight), NumberFormat.percentShort)} {token1.symbol}
        </div>
        <div className="mt-4 font-bold">
          1LP = {formatNumber(token0Price)} {token0.symbol} + {formatNumber(token1Price)} {token1.symbol}
        </div>
      </div>
      <div className="pt-4 flex flex-col md:flex-row">
        <div className="mb-4 flex-1 md:mb-0">
          <div className="font-bold">LP tokens for this pool</div>
          <div className="font-fredoka text-4xl">{formatNumber(bigNumberToNumber(pool.userInfo.held))} HLP</div>
        </div>
        <div className="flex items-end">
          <PoolBigButton title="Stake it" isEnabled={pool.userInfo.held.gt(BigNumber.from(0))} onClick={stake} />
        </div>
      </div>
    </div>
  )
}

export default PoolCardRight
