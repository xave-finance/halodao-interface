import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { HALO, USDC } from '../../../constants'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import PoolExpandButton from '../Buttons/PoolExpandButton'

interface ExpandablePoolRowProps {
  pool: {
    name: string
    tokenA: {
      bal: number
      symbol: string
    }
    tokenB: {
      bal: number
      symbol: string
    }
    held: number
    staked: number
    earned: number
  }
}

const ExpandablePoolRow = ({ pool }: ExpandablePoolRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`
        mb-4 p-4
        bg-haloGray
        rounded
        md:mb-2 md:px-4 md:py-2 md:-ml-4 md:-mr-4
        md:bg-transparent
        md:transition-colors
        md:border md:hover:border-primary-hover
        ${isExpanded ? 'md:border-primary-hover' : 'md:border-transparent'}
      `}
    >
      <div
        className={`
          md:flex md:flex-row md:justify-between md:cursor-pointer
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={`
            flex flex-row space-x-2 items-center justify-center
            font-semibold
            mb-4
            md:mb-0 md:w-5/12
            md:justify-start
            md:font-normal 
          `}
        >
          <div className="">
            <DoubleCurrencyLogo currency0={HALO[ChainId.MAINNET]} currency1={USDC} size={16} />
          </div>
          <div className="">{pool.name}</div>
        </div>
        <div className="mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Pooled (A) Tokens:</div>
          <div className="">{formatNumber(pool.tokenA.bal, NumberFormat.percent)}</div>
        </div>
        <div className="mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Pooled (B) Tokens:</div>
          <div className="">{formatNumber(pool.tokenA.bal, NumberFormat.percent)}</div>
        </div>
        <div className="mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Held LPT:</div>
          <div className="">{formatNumber(pool.held, NumberFormat.percent)}</div>
        </div>
        <div className="mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Staked LPT:</div>
          <div className="">{formatNumber(pool.staked, NumberFormat.percent)}</div>
        </div>
        <div className="mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Fees Earned:</div>
          <div className="">{formatNumber(pool.earned)} RNBW</div>
        </div>
        <div className="md:text-right">
          <PoolExpandButton
            title="Manage"
            expandedTitle="Close"
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="p-4 bg-yellow-50">Expandable content</div>
          <div className="mt-4 text-right md:hidden">
            <button onClick={() => setIsExpanded(!isExpanded)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpandablePoolRow
