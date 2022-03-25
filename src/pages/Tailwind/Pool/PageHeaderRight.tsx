import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { CachedPool } from 'state/pool/reducer'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import xRNBWLogo from '../../../assets/svg/xlpop-token.svg'

const PageHeaderRight = () => {
  const [stakeableValue, setStakeableValue] = useState(0)
  const [stakedValue, setStakedValue] = useState(0)
  const [rewardsEarned, setRewardsEarned] = useState(0)
  const cachedPools = useSelector<AppState, CachedPool[]>(state => state.pool.pools)

  useEffect(() => {
    let totalStakeable = 0
    let totalStaked = 0
    let totalRewardsEarned = 0

    for (const pool of cachedPools) {
      const lpTokenPrice = pool.lpTokenPrice ?? 1
      if (pool.lpTokenBalance) {
        totalStakeable += pool.lpTokenBalance * lpTokenPrice
      }
      if (pool.lpTokenStaked) {
        totalStaked += pool.lpTokenStaked * lpTokenPrice
      }
      if (pool.pendingRewards) {
        totalRewardsEarned += pool.pendingRewards
      }
    }

    setStakeableValue(totalStakeable)
    setStakedValue(totalStaked)
    setRewardsEarned(totalRewardsEarned)
  }, [cachedPools])

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex-auto flex flex-col space-y-2">
        <div className="flex-auto bg-primary-light py-4 px-6 rounded-card">
          <div className="text-xs font-extrabold tracking-widest text-primary uppercase">My Stakeable HLP value</div>
          <div className="text-2xl font-semibold">{formatNumber(stakeableValue, NumberFormat.usd)}</div>
        </div>
        <div className="flex-auto bg-primary-light py-4 px-6 rounded-card">
          <div className="text-xs font-extrabold tracking-widest text-primary uppercase">My Staked HLP value</div>
          <div className="text-2xl font-semibold">{formatNumber(stakedValue, NumberFormat.usd)}</div>
        </div>
      </div>
      <div className="flex-auto bg-primary-light py-4 px-6 rounded-card flex flex-col">
        <div className="mb-2">
          <img width={'85px'} src={xRNBWLogo} alt="xRNBW" />
        </div>
        <div className="text-xs font-extrabold tracking-widest text-primary uppercase">Unclaimed xLPOP Earned</div>
        <div className="text-2xl font-semibold">{formatNumber(rewardsEarned)}</div>
      </div>
    </div>
  )
}

export default PageHeaderRight
