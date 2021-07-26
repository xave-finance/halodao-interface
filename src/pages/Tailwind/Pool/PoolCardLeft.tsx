import React, { useState } from 'react'
import TabsControl from '../../../components/Tailwind/SegmentControl/TabsControl'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

const PoolCardLeft = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <TabsControl
        tabs={['Add Liquidity', 'Remove Liquidity']}
        activeTab={activeTab}
        didChangeTab={i => setActiveTab(i)}
      />

      <div className="mt-2">
        {activeTab === 0 && <AddLiquidity />}
        {activeTab === 1 && <RemoveLiquidity />}
      </div>
    </div>
  )
}

export default PoolCardLeft
