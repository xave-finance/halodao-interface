import React, { useEffect, useState } from 'react'
import { bigNumberToNumber } from 'utils/bigNumberHelper'
import TabsControl from '../../../components/Tailwind/SegmentControl/TabsControl'
import AddLiquidity from './liquidity/AddLiquidity'
import RemoveLiquidity from './liquidity/RemoveLiquidity'
import { PoolData } from './models/PoolData'

interface PoolCardLeftProps {
  pool: PoolData
  isActivePool: boolean
}

const PoolCardLeft = ({ pool, isActivePool }: PoolCardLeftProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [disabledTabs, setDisabledTabs] = useState<number[]>([])

  useEffect(() => {
    if (bigNumberToNumber(pool.userInfo.held) > 0.00001) {
      setDisabledTabs([])
    } else {
      // Disable Remove Liquidity tab if user has no HLP
      setDisabledTabs([1])

      // Switch back to Add Liquidity tab if user has no more HLP
      if (activeTab === 1) {
        setActiveTab(0)
      }
    }
  }, [pool, activeTab])

  return (
    <div>
      <TabsControl
        tabs={['Add Liquidity', 'Remove Liquidity']}
        activeTab={activeTab}
        disabledTabs={disabledTabs}
        didChangeTab={i => setActiveTab(i)}
      />

      <div className="mt-2">
        {activeTab === 0 && <AddLiquidity pool={pool} isEnabled={isActivePool} />}
        {activeTab === 1 && <RemoveLiquidity pool={pool} />}
      </div>
    </div>
  )
}

export default PoolCardLeft
