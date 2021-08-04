import React, { useState } from 'react'
import { Token } from '@sushiswap/sdk'
import TabsControl from '../../../components/Tailwind/SegmentControl/TabsControl'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

interface PoolCardLeftProps {
  poolAddress: string
  token0: Token
  token1: Token
}

const PoolCardLeft = ({ poolAddress, token0, token1 }: PoolCardLeftProps) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <TabsControl
        tabs={['Add Liquidity', 'Remove Liquidity']}
        activeTab={activeTab}
        didChangeTab={i => setActiveTab(i)}
      />

      <div className="mt-2">
        {activeTab === 0 && <AddLiquidity poolAddress={poolAddress} token0={token0} token1={token1} />}
        {activeTab === 1 && <RemoveLiquidity token0={token0} token1={token1} />}
      </div>
    </div>
  )
}

export default PoolCardLeft
