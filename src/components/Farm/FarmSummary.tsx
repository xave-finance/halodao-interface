import { useTranslation } from 'react-i18next'
import React from 'react'
import useFarmSummary from 'halo-hooks/useFarmSummary'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import StakeCard from '../Tailwind/Cards/StakeCard'
import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@halodao/sdk'

interface FarmSummaryProps {
  poolsInfo: PoolInfo[]
  tokenPrice: TokenPrice
  farmTVL: string
}

const FarmSummary = ({ poolsInfo, tokenPrice, farmTVL }: FarmSummaryProps) => {
  const summary = useFarmSummary(poolsInfo, tokenPrice)
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  return (
    <div className="w-full flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 pb-2">
      <StakeCard title={t('totalValueLocked')} value={farmTVL} displayMainnetIndicator={chainId !== ChainId.MAINNET} />
      <StakeCard title={t('poolSummaryHaloEarned')} value={summary.haloEarned} />
      <StakeCard title={t('poolSummaryStaked')} value={summary.stakedValue} />
      <StakeCard title={t('poolSummaryStakeable')} value={summary.stakeableValue} />
    </div>
  )
}

export default FarmSummary
