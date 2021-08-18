import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderRight from './PageHeaaderRight'
import PageHeaderCenter from './PageHeaderCenter'
import { shortenAddress } from '../../../utils'
import { HALO, USDT, XSGD, USDC } from '../../../constants'
import { PoolData } from './models/PoolData'

const PoolRow = () => {
  const { account, error } = useWeb3React()
  const [showModal, setShowModal] = useState(false)

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
    <PageWrapper className="mb-8 border border-black">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="w-full md:w-2/6 border border-black">
          <PageHeaderLeft
            subtitle="Overview"
            title="Lend"
            caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim potenti faucibus adipiscing sed tempor diam, ipsum porta."
          />
        </div>
        <div className="invisible md:visible md:w-4/6 border border-black">
          <PageHeaderCenter />
        </div>
        <div className="invisible md:visible md:w-2/6 border border-black">
          <PageHeaderRight />
        </div>
      </div>
    </PageWrapper>
  )
}

export default PoolRow
