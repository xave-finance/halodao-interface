import React from 'react'
import { ChainId } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { HALO, USDC } from '../../../constants'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import PoolExpandButton from '../Buttons/PoolExpandButton'

interface ExpandablePoolRowProps {
  pool: {
    name: string
    apy: number
    earned: number
  }
}

const ExpandablePoolRow = ({ pool }: ExpandablePoolRowProps) => {
  return (
    <div className="mb-4 p-4 bg-haloGray rounded md:flex md:flex-row md:space-x-4 md:mb-2 md:px-4 md:py-2 md:-ml-4 md:-mr-4 md:bg-transparent md:transition-colors md:border md:border-transparent md:hover:border-primary-hover md:cursor-pointer">
      <div className="flex flex-row space-x-2 items-center justify-center font-semibold mb-4 md:w-5/12 md:justify-start md:font-normal md:mb-0">
        <div className="">
          <DoubleCurrencyLogo currency0={HALO[ChainId.MAINNET]} currency1={USDC} size={16} />
        </div>
        <div className="">{pool.name}</div>
      </div>
      <div className="mb-4 md:w-3/12 md:mb-0">
        <div className="text-sm tracking-widest md:hidden">APY:</div>
        <div className="">{formatNumber(pool.apy, NumberFormat.percent)}</div>
      </div>
      <div className="mb-4 md:w-3/12 md:mb-0">
        <div className="text-sm tracking-widest md:hidden">Earned:</div>
        <div className="">{formatNumber(pool.earned)} RNBW</div>
      </div>
      <div className="md:w-1/12 md:text-right">
        <PoolExpandButton title="Manage" onClick={() => console.log('clicked')} />
      </div>
    </div>
  )
}

export default ExpandablePoolRow
