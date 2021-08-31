import useHaloHalo from 'halo-hooks/useHaloHalo'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { CachedPool } from 'state/pool/reducer'
import { formatNumber, NumberFormat } from 'utils/formatNumber'

const PageHeaderRight = () => {
  const [stakeableValue, setStakeableValue] = useState(0)
  const [stakedValue, setStakedValue] = useState(0)
  const [haloEarned, setHaloEarned] = useState(0)
  const cachedPools = useSelector<AppState, CachedPool[]>(state => state.pool.pools)
  const { haloHaloPrice } = useHaloHalo()
  const rewardTokenPrice = Number(haloHaloPrice)

  useEffect(() => {
    let totalStakeable = 0
    let totalStaked = 0
    let totalHaloEarned = 0

    // @TODO: get LPT price
    const lpTokenPrice = 1

    for (const pool of cachedPools) {
      if (pool.lpTokenBalance) {
        totalStakeable += pool.lpTokenBalance * lpTokenPrice
      }
      if (pool.lpTokenStaked) {
        totalStaked += pool.lpTokenStaked * lpTokenPrice
      }
      if (pool.pendingRewards) {
        totalHaloEarned += pool.pendingRewards * rewardTokenPrice
      }
    }

    setStakeableValue(totalStakeable)
    setStakedValue(totalStaked)
    setHaloEarned(totalHaloEarned)
  }, [cachedPools, rewardTokenPrice])

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex-auto flex flex-col space-y-2">
        <div className="flex-auto bg-primary-light py-4 px-6 rounded-card">
          <div className="text-xs font-extrabold tracking-widest text-primary uppercase">My Stakeable LPT value</div>
          <div className="text-2xl font-semibold">{formatNumber(stakeableValue, NumberFormat.usd)}</div>
        </div>
        <div className="flex-auto bg-primary-light py-4 px-6 rounded-card">
          <div className="text-xs font-extrabold tracking-widest text-primary uppercase">My Staked LPT value</div>
          <div className="text-2xl font-semibold">{formatNumber(stakedValue, NumberFormat.usd)}</div>
        </div>
      </div>
      <div className="flex-auto bg-primary-light py-4 px-6 rounded-card flex flex-col">
        <div className="flex-1"></div>
        <div className="text-xs font-extrabold tracking-widest text-primary uppercase">Total HALO Earned</div>
        <div className="text-2xl font-semibold">{formatNumber(haloEarned, NumberFormat.usd)}</div>
      </div>
    </div>
  )
}

export default PageHeaderRight
