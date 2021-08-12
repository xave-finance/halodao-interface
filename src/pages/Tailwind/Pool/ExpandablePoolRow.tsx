import React, { useEffect, useState } from 'react'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import PoolExpandButton from '../../../components/Tailwind/Buttons/PoolExpandButton'
import styled from 'styled-components'
import PoolCardLeft from './PoolCardLeft'
import PoolCardRight from './PoolCardRight'
import { useLiquidityPool } from 'halo-hooks/amm/useLiquidityPool'
import { formatEther } from 'ethers/lib/utils'
import { XSGD, USDT } from '../../../constants'
import { BigNumber } from 'ethers'
import { Token } from '@sushiswap/sdk'
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
  poolAddress: string
}

const ExpandablePoolRow = ({ poolAddress }: ExpandablePoolRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [pool, setPool] = useState<PoolData | undefined>(undefined)
  const { getTokens, getLiquidity, getBalance, getStakedLPToken, getPendingRewards } = useLiquidityPool(poolAddress)

  /**
   * Main logic: fetching pool info
   *
   * Triggers every:
   * - network changed
   **/
  useEffect(() => {
    const promises = [getTokens(), getLiquidity(), getBalance(), getStakedLPToken(), getPendingRewards()]

    Promise.all(promises)
      .then(results => {
        const tokens: Token[] = results[0]
        const liquidity: { total: BigNumber; tokens: BigNumber[]; weights: number[]; rates: number[] } = results[1]
        const balance: BigNumber = results[2]
        const staked: BigNumber = results[3]
        const rewards: BigNumber = results[4]

        console.log('liquidity: ', liquidity)

        setPool({
          address: poolAddress,
          name: `${tokens[0].symbol}/${tokens[1].symbol}`,
          token0: tokens[0],
          token1: tokens[1],
          pooled: {
            total: parseFloat(formatEther(liquidity.total)),
            token0: parseFloat(formatEther(liquidity.tokens[0])),
            token1: parseFloat(formatEther(liquidity.tokens[1]))
          },
          weights: {
            token0: liquidity.weights[0],
            token1: liquidity.weights[1]
          },
          rates: {
            token0: liquidity.rates[0],
            token1: liquidity.rates[1]
          },
          held: parseFloat(formatEther(balance)),
          staked: parseFloat(formatEther(staked)),
          earned: parseFloat(formatEther(rewards))
        })
      })
      .catch(e => {
        console.error(e)
      })
  }, [getTokens, getLiquidity, getBalance, getStakedLPToken, getPendingRewards])

  // Return an empty component if failed to fetch pool info
  if (!pool) {
    return <></>
  }

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
          <DoubleCurrencyLogo currency0={pool.token0} currency1={pool.token1} size={16} />
          <span>{pool.name}</span>
        </div>
        <div className="col-2 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Pooled (A) Tokens:</div>
          <div className="">
            {formatNumber(pool.pooled.token0)} {pool.token0.symbol}
          </div>
        </div>
        <div className="col-3 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Pooled (B) Tokens:</div>
          <div className="">
            {formatNumber(pool.pooled.token1)} {pool.token1.symbol}
          </div>
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
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">HALO Earned:</div>
          <div className="">{formatNumber(pool.earned, NumberFormat.usd)}</div>
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
              <PoolCardLeft pool={pool} />
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
