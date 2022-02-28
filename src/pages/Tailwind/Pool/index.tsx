import React, { useEffect, useState } from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderRight from './PageHeaderRight'
import PoolColumns from './PoolColumns'
import PoolTable from './PoolTable'
import { useGetPools } from 'halo-hooks/amm-v2/useLiquidityPool'
import { PoolExternalIdsMap } from './types'
import { useTranslation } from 'react-i18next'

interface Pool {
  enabled: PoolExternalIdsMap
  disabled: PoolExternalIdsMap
}

const Pool = () => {
  const [pools, setPools] = useState<Pool>({ enabled: {}, disabled: {} })
  const getPools = useGetPools()
  const { t } = useTranslation()

  useEffect(() => {
    getPools().then(_pools => {
      if (_pools !== undefined) {
        setPools(_pools)
      }
    })
  }, [])

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center">
        <div className="md:w-1/2 md:pr-16">
          <PageHeaderLeft
            subtitle="Add/Remove Liquidity"
            title="Pools"
            caption="Provide liquidity to pools to get HLP tokens. Deposit your HLP tokens to the Farm to begin earning Rainbow Candies (RNBW). Each RNBW you earn is automatically staked as xRNBW in the Rainbow Pool to begin earning vesting rewards!"
            link={{
              text: 'Learn about pool liquidity',
              url: 'https://docs.halodao.com/get-started/how-to-supply-liquidity'
            }}
          />
        </div>
        <div className="md:w-1/2">
          <PageHeaderRight />
        </div>
      </div>

      <div className="mt-6 md:mt-12">
        <PoolColumns />
      </div>

      <PoolTable poolMap={pools.enabled} isActivePools={true} />

      {Object.keys(pools.disabled).length > 0 && (
        <>
          <div className="mt-8 mb-4">{t('inactive pools')}</div>
          <PoolTable poolMap={pools.disabled} isActivePools={false} />
        </>
      )}
    </PageWrapper>
  )
}

export default Pool
