import React, { useState } from 'react'
import { PoolAddressPidMap } from '.'
import ExpandablePoolRow from './ExpandablePoolRow'

interface PoolTableProps {
  poolMap: PoolAddressPidMap[]
  isActivePools: boolean
}

const PoolTable = ({ poolMap, isActivePools }: PoolTableProps) => {
  const [activeRow, setActiveRow] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {poolMap.map((pool, i) => (
        <ExpandablePoolRow
          key={pool.address}
          poolAddress={pool.address}
          pid={pool.pid}
          isExpanded={activeRow === i ? isExpanded : false}
          onClick={() => {
            if (activeRow === i) {
              setIsExpanded(!isExpanded)
            } else {
              setIsExpanded(true)
              setActiveRow(i)
            }
          }}
          isActivePool={isActivePools}
        />
      ))}
    </>
  )
}

export default PoolTable
