import React, { useState } from 'react'
import ExpandablePoolRow from './ExpandablePoolRow'
import { PoolExternalIdsMap } from './types'

interface PoolTableProps {
  poolMap: PoolExternalIdsMap
  isActivePools: boolean
}

const PoolTable = ({ poolMap, isActivePools }: PoolTableProps) => {
  const [activeRow, setActiveRow] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {Object.keys(poolMap).map((poolAddress, i) => (
        <ExpandablePoolRow
          key={poolAddress}
          poolAddress={poolAddress}
          rewardsPoolId={poolMap[poolAddress].rewardsPoolId}
          vaultPoolId={poolMap[poolAddress].vaultPoolId}
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
