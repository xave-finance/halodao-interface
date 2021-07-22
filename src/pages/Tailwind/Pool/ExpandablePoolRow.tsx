import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { HALO, USDC } from '../../../constants'
import { formatNumber } from 'utils/formatNumber'
import PoolExpandButton from '../../../components/Tailwind/Buttons/PoolExpandButton'
import styled from 'styled-components'
import PoolCardLeft from './PoolCardLeft'
import PoolCardRight from './PoolCardRight'
import { PoolData } from './models/PoolData'

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
  pool: PoolData
}

const ExpandablePoolRow = ({ pool }: ExpandablePoolRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`
        mb-4 p-4
        rounded shadow-lg
        border border-primary-hover
        bg-white
        md:mb-2 md:px-4 md:pt-2 md:-ml-4 md:-mr-4
        md:transition-colors
        md:hover:border-primary-hover
        ${isExpanded ? 'md:bg-white' : 'md:bg-transparent'}
        ${isExpanded ? 'md:border-primary-hover' : 'md:border-transparent'}
        ${isExpanded ? 'md:shadow-lg' : 'md:shadow-none'}
        ${isExpanded ? 'md:pb-4' : 'md:pb-2'}
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
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Pooled (A) Tokens:</div>
          <div className="">{formatNumber(pool.tokenA.bal)}</div>
        </div>
        <div className="col-3 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Pooled (B) Tokens:</div>
          <div className="">{formatNumber(pool.tokenA.bal)}</div>
        </div>
        <div className="col-4 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Held LPT:</div>
          <div className="">{formatNumber(pool.held)}</div>
        </div>
        <div className="col-5 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Staked LPT:</div>
          <div className="">{formatNumber(pool.staked)}</div>
        </div>
        <div className="col-6 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Fees Earned:</div>
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
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="mb-4 md:w-1/2 md:mb-0">
              <PoolCardLeft />
            </div>
            <div className="md:w-1/2">
              <PoolCardRight pool={pool} />
            </div>
          </div>
          <div className="px-4 pb-4 text-right text-white bg-primary-hover rounded-br-card rounded-bl-card md:hidden">
            <button className="font-black" onClick={() => setIsExpanded(!isExpanded)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpandablePoolRow
