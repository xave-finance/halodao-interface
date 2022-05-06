import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { CachedPool } from 'state/pool/reducer'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import StakeCard from '../../../components/Tailwind/Cards/StakeCard'
import { useTranslation } from 'react-i18next'
import useTVLInfo from '../../../halo-hooks/useTVLInfo'
import { useActiveWeb3React } from '../../../hooks'
import { ChainId } from '@halodao/sdk'

const PageHeaderRight = () => {
  const [stakeableValue, setStakeableValue] = useState(0)
  const [stakedValue, setStakedValue] = useState(0)
  const [rewardsEarned, setRewardsEarned] = useState(0)
  const cachedPools = useSelector<AppState, CachedPool[]>(state => state.pool.pools)
  const { t } = useTranslation()
  const { liquidityPools } = useTVLInfo()
  const { chainId } = useActiveWeb3React()

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
    <div className="w-full flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 pb-2">
      <StakeCard
        title={t('totalPoolValue')}
        value={formatNumber(liquidityPools, NumberFormat.usd)}
        displayMainnetIndicator={chainId !== ChainId.MAINNET}
      />
      <StakeCard title={t('poolSummaryHaloEarned')} value={formatNumber(rewardsEarned)} />
      <StakeCard title={t('poolSummaryStaked')} value={formatNumber(stakedValue, NumberFormat.usd)} />
      <StakeCard title={t('poolSummaryStakeable')} value={formatNumber(stakeableValue, NumberFormat.usd)} />
    </div>
  )
}

export default PageHeaderRight
