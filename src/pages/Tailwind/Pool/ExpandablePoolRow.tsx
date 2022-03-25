import React, { useEffect, useState } from 'react'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { formatNumber } from 'utils/formatNumber'
import PoolExpandButton from '../../../components/Tailwind/Buttons/PoolExpandButton'
import styled from 'styled-components'
import PoolCardLeft from './PoolCardLeft'
import PoolCardRight from './PoolCardRight'
import { useLiquidityPool } from 'halo-hooks/amm/useLiquidityPool'
import { formatEther } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import { Token } from '@halodao/sdk'
import { PoolData } from './models/PoolData'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { updatePools } from 'state/pool/actions'
import { useActivePopups, useBlockNumber } from '../../../state/application/hooks'

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
  pid?: number
  isExpanded: boolean
  onClick: () => void
  isActivePool?: boolean
}

const ExpandablePoolRow = ({ poolAddress, pid, isExpanded, onClick, isActivePool = true }: ExpandablePoolRowProps) => {
  const [pool, setPool] = useState<PoolData | undefined>(undefined)
  const [reloader, setReloader] = useState(0)
  const { getTokens, getLiquidity, getBalance, getStakedLPToken, getPendingRewards, getTotalSupply } = useLiquidityPool(
    poolAddress,
    pid
  )
  const dispatch = useDispatch<AppDispatch>()

  const blockNumber = useBlockNumber()
  const activePopups = useActivePopups()

  useEffect(() => {
    setReloader((r: number) => r + 1)
    setTimeout(() => {
      setReloader((r: number) => r + 1)
    }, 5000)
  }, [activePopups]) //eslint-disable-line

  /**
   * Main logic: fetching pool info
   *
   * Triggers every:
   * - network changed
   **/
  useEffect(() => {
    const promises = [
      getTokens(),
      getLiquidity(),
      getBalance(),
      getStakedLPToken(),
      getPendingRewards(),
      getTotalSupply()
    ]

    Promise.all(promises)
      .then(results => {
        const tokens: Token[] = results[0]
        const liquidity: {
          total: BigNumber
          tokens: BigNumber[]
          weights: number[]
          rates: number[]
          assimilators: string[]
        } = results[1]
        const balance: BigNumber = results[2]
        const staked: BigNumber = results[3]
        const rewards: BigNumber = results[4]
        const totalSupply: BigNumber = results[5]

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
          held: Number(formatEther(balance)),
          heldBN: balance,
          staked: Number(formatEther(staked)),
          earned: Number(formatEther(rewards)),
          totalSupply: Number(formatEther(totalSupply)),
          assimilators: liquidity.assimilators
        })
      })
      .catch(e => {
        console.error(e)
      })
  }, [
    poolAddress,
    getTokens,
    getLiquidity,
    getBalance,
    getStakedLPToken,
    getPendingRewards,
    getTotalSupply,
    blockNumber,
    reloader
  ])

  /**
   * Update cached pool data in app cache
   **/
  useEffect(() => {
    if (!pool) return

    const poolData = {
      lpTokenAddress: pool.address,
      lpTokenBalance: pool.held,
      lpTokenStaked: pool.staked,
      lpTokenPrice: pool.totalSupply > 0 ? pool.pooled.total / pool.totalSupply : 0,
      pendingRewards: pool.earned
    }

    dispatch(updatePools([poolData]))
  }, [pool]) // eslint-disable-line

  // Return an empty component if failed to fetch pool info
  if (!pool) {
    return <div className="animate-pulse bg-primary-lighter h-7 rounded my-4"></div>
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
        onClick={onClick}
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
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Held HLP:</div>
          <div className="">{formatNumber(pool.held)}</div>
        </div>
        <div className="col-5 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Staked HLP:</div>
          <div className="">{formatNumber(pool.staked)}</div>
        </div>
        <div className="col-6 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Earned:</div>
          <div className="">{formatNumber(pool.earned)} xLPOP</div>
        </div>
        <div className="col-7 md:text-right">
          <PoolExpandButton title="Manage" expandedTitle="Close" isExpanded={isExpanded} onClick={onClick} />
        </div>
      </PoolRow>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-2">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="mb-4 md:w-1/2 md:mb-0">
              <PoolCardLeft pool={pool} isActivePool={isActivePool} />
            </div>
            <div className="md:w-1/2">
              <PoolCardRight pool={pool} />
            </div>
          </div>
          <div className="px-4 pb-4 text-right text-white bg-primary-hover rounded-br-card rounded-bl-card md:hidden">
            <button className="font-black" onClick={onClick}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpandablePoolRow
