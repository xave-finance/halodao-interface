import React, { useEffect, useState } from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderRight from './PageHeaderRight'
import PoolColumns from './PoolColumns'
import ExpandablePoolRow from './ExpandablePoolRow'
import { LIQUIDITY_POOLS_ADDRESSES } from 'constants/pools'
import { useLPTokenAddresses } from 'halo-hooks/useRewards'
import { updatePools } from 'state/pool/actions'
import { CachedPool } from 'state/pool/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'

const Pool = () => {
  const dispatch = useDispatch<AppDispatch>()
  const rewardPoolAddresses = useLPTokenAddresses()
  const [activeRow, setActiveRow] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const pools: CachedPool[] = []
    for (const [i, address] of rewardPoolAddresses.entries()) {
      pools.push({
        pid: i,
        lpTokenAddress: address
      })
    }
    dispatch(updatePools(pools))
  }, [rewardPoolAddresses]) //eslint-disable-line

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

      {LIQUIDITY_POOLS_ADDRESSES.map((poolAddress, i) => (
        <ExpandablePoolRow
          key={poolAddress}
          poolAddress={poolAddress}
          isExpanded={activeRow === i ? isExpanded : false}
          onClick={() => {
            if (activeRow === i) {
              setIsExpanded(!isExpanded)
            } else {
              setIsExpanded(true)
              setActiveRow(i)
            }
          }}
        />
      ))}
    </PageWrapper>
  )
}

export default Pool
