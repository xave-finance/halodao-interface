import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { HALO, USDC } from '../../../constants'
import { formatNumber } from 'utils/formatNumber'
import PoolExpandButton from '../Buttons/PoolExpandButton'
import styled from 'styled-components'

const PoolRow = styled.div`
  .col-1 {
    width: 19%;
  }
  .col-2 {
    width: 18%;
  }
  .col-3 {
    width: 18%;
  }
  .col-4 {
    width: 11%;
  }
  .col-5 {
    width: 13%;
  }
  .col-6 {
    width: 13%;
  }
  .col-7 {
    width: 8%;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7 {
      width: 100%;
    }
  `};
`

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
        bg-white
        rounded
        md:mb-2 md:px-4 md:py-2 md:-ml-4 md:-mr-4
        md:bg-transparent
        md:transition-colors
        md:border md:hover:border-primary-hover
        ${isExpanded ? 'md:border-primary-hover' : 'md:border-transparent'}
      `}
    >
      <PoolRow
        className={`
          md:flex md:flex-row md:justify-between md:cursor-pointer md:items-start
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={`
            col-1
            flex flex-row space-x-2 items-center justify-center
            font-semibold
            mb-4
            md:mb-0
            md:justify-start
            md:font-normal 
          `}
        >
          <DoubleCurrencyLogo currency0={HALO[ChainId.MAINNET]} currency1={USDC} size={16} />
          <span>{pool.name}</span>
        </div>
        <div className="col-2 mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Pooled (A) Tokens:</div>
          <div className="">{formatNumber(pool.tokenA.bal)}</div>
        </div>
        <div className="col-3 mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Pooled (B) Tokens:</div>
          <div className="">{formatNumber(pool.tokenA.bal)}</div>
        </div>
        <div className="col-4 mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Held HLP:</div>
          <div className="">{formatNumber(pool.held)}</div>
        </div>
        <div className="col-5 mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Staked HLP:</div>
          <div className="">{formatNumber(pool.staked)}</div>
        </div>
        <div className="col-6 mb-4 md:mb-0">
          <div className="text-sm tracking-widest md:hidden">Fees Earned:</div>
          <div className="">{formatNumber(pool.earned)} RNBW</div>
        </div>
        <div className="col-7 md:text-right">
          <PoolExpandButton
            title="Manage"
            expandedTitle="Close"
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </PoolRow>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-2">
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
