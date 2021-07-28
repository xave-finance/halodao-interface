import React from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderRight from './PageHeaderRight'
import PoolColumns from './PoolColumns'
import ExpandablePoolRow from './ExpandablePoolRow'
import { PoolData } from './models/PoolData'
import { ChainId } from '@sushiswap/sdk'
import { HALO, USDT, XSGD, USDC } from '../../../constants'

const Pool = () => {
  const pools: PoolData[] = [
    {
      name: 'RNBW/USDT',
      token0: HALO[ChainId.MAINNET]!,
      token1: USDT,
      pooled: {
        token0: 1800,
        token1: 650
      },
      held: 0,
      staked: 2000,
      earned: 0
    },
    {
      name: 'XSGD/USDT',
      token0: XSGD,
      token1: USDT,
      pooled: {
        token0: 3000,
        token1: 100
      },
      held: 100,
      staked: 0,
      earned: 10.12345
    },
    {
      name: 'XSGD/USDC',
      token0: XSGD,
      token1: USDC,
      pooled: {
        token0: 100,
        token1: 100
      },
      held: 0,
      staked: 100,
      earned: 0
    }
  ]

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-16 md:items-center">
        <div className="md:w-1/2">
          <PageHeaderLeft
            subtitle="Add/Remove Liquidity"
            title="Pools"
            caption="ERC721 token standard returns a immutable raiden network! VeChain should be a ERC20 token standard!"
            link={{ text: 'Learn about pool liquidity', url: 'https://docs.halodao.com' }}
          />
        </div>
        <div className="md:w-1/2">
          <PageHeaderRight />
        </div>
      </div>

      <div className="mt-6 md:mt-12">
        <PoolColumns />
      </div>

      {pools.map(pool => (
        <ExpandablePoolRow key={pool.name} pool={pool} />
      ))}
    </PageWrapper>
  )
}

export default Pool
