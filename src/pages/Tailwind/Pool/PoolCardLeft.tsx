import React, { useEffect, useState } from 'react'
import TabsControl from '../../../components/Tailwind/SegmentControl/TabsControl'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'
import { PoolData } from './models/PoolData'

interface PoolCardLeftProps {
  pool: PoolData
}

const PoolCardLeft = ({ pool }: PoolCardLeftProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [disabledTabs, setDisabledTabs] = useState<number[]>([])

  useEffect(() => {
    if (pool.held > 0) {
      setDisabledTabs([])
    } else {
      setDisabledTabs([1])
    }
  }, [pool])

  return (
    <div>
      <TabsControl
        tabs={['Add Liquidity', 'Remove Liquidity']}
        activeTab={activeTab}
        disabledTabs={disabledTabs}
        didChangeTab={i => setActiveTab(i)}
      />

      <div className="mt-2">
        {activeTab === 0 && <AddLiquidity pool={pool} />}
        {activeTab === 1 && <RemoveLiquidity pool={pool} />}
      </div>
    </div>
  )
}

export default PoolCardLeft
