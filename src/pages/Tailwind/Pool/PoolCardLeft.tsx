import React, { useState } from 'react'
import { Token } from '@sushiswap/sdk'
import TabsControl from '../../../components/Tailwind/SegmentControl/TabsControl'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

interface PoolCardLeftProps {
  token0: Token
  token1: Token
}

const PoolCardLeft = ({ token0, token1 }: PoolCardLeftProps) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <TabsControl
        tabs={['Add Liquidity', 'Remove Liquidity']}
        activeTab={activeTab}
        didChangeTab={i => setActiveTab(i)}
      />

      <div className="mt-2">
        {activeTab === 0 && <AddLiquidity token0={token0} token1={token1} />}
        {activeTab === 1 && <RemoveLiquidity />}
      </div>
    </div>
  )
}

export default PoolCardLeft
