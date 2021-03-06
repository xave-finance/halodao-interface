import React, { useEffect, useState } from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageHeaderRight from './PageHeaderRight'
import PoolColumns from './PoolColumns'
import {
  LIQUIDITY_POOLS_ADDRESSES,
  LIQUIDITY_POOLS_ADDRESSES_ARB,
  LIQUIDITY_POOLS_ADDRESSES_ARB_RINKEBY,
  LIQUIDITY_POOLS_ADDRESSES_KOVAN,
  LIQUIDITY_POOLS_ADDRESSES_MATIC
} from 'constants/pools'
import { useLPTokenAddresses } from 'halo-hooks/useRewards'
import { updatePools } from 'state/pool/actions'
import { CachedPool } from 'state/pool/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { useActiveWeb3React } from 'hooks'
import { ChainId } from '@halodao/sdk'
import { useTranslation } from 'react-i18next'
import PoolTable from './PoolTable'
import { isInactivePool } from 'utils/poolInfo'
import { TYPE } from '../../../theme'
import { Maximize2, Minimize2 } from 'react-feather'
import useTheme from '../../../hooks/useTheme'
import styled from 'styled-components'

const InactivePools = styled.div`
  margin-top: 1rem;

  .tbHeader {
    margin-bottom: 0.5rem;
  }
`
export interface PoolAddressPidMap {
  address: string
  pid: number | undefined
}

enum PoolFilter {
  active,
  inactive,
  all
}

const Pool = () => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const rewardPoolAddresses = useLPTokenAddresses()

  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const defaultPoolMap = (filter: PoolFilter) => {
    const addresses =
      chainId === ChainId.MATIC
        ? LIQUIDITY_POOLS_ADDRESSES_MATIC
        : chainId === ChainId.KOVAN
        ? LIQUIDITY_POOLS_ADDRESSES_KOVAN
        : chainId === ChainId.ARBITRUM
        ? LIQUIDITY_POOLS_ADDRESSES_ARB
        : chainId === ChainId.ARBITRUM_TESTNET
        ? LIQUIDITY_POOLS_ADDRESSES_ARB_RINKEBY
        : LIQUIDITY_POOLS_ADDRESSES

    const whitelisted = addresses.filter(address => {
      if (filter === PoolFilter.all) return address
      const isInactive = isInactivePool(address, chainId)
      return filter === PoolFilter.active ? !isInactive : isInactive
    })

    return whitelisted.map<PoolAddressPidMap>(address => {
      return {
        address,
        pid: undefined
      }
    })
  }

  const [poolMap, setPoolMap] = useState<PoolAddressPidMap[]>(defaultPoolMap(PoolFilter.active))
  const [inactivePoolMap, setInactivePoolMap] = useState<PoolAddressPidMap[]>(defaultPoolMap(PoolFilter.inactive))
  const [showInactiveSection, setShowInactiveSection] = useState(false)

  useEffect(() => {
    const pools: CachedPool[] = []
    const allMap = defaultPoolMap(PoolFilter.all)
    const activeMap = defaultPoolMap(PoolFilter.active)
    const inactiveMap = defaultPoolMap(PoolFilter.inactive)

    for (const [i, address] of rewardPoolAddresses.entries()) {
      pools.push({
        pid: i,
        lpTokenAddress: address
      })
      const filteredAll = allMap.filter(m => m.address.toLowerCase() === address.toLowerCase())
      if (filteredAll.length > 0) {
        filteredAll[0].pid = i
      }
      const filteredActive = activeMap.filter(m => m.address.toLowerCase() === address.toLowerCase())
      if (filteredActive.length > 0) {
        filteredActive[0].pid = i
      }
      const filteredInactive = inactiveMap.filter(m => m.address.toLowerCase() === address.toLowerCase())
      if (filteredInactive.length > 0) {
        filteredInactive[0].pid = i
      }
    }

    if (pools.length > 0) {
      dispatch(updatePools(pools))
    }

    setPoolMap(activeMap)
    setInactivePoolMap(inactiveMap)
  }, [rewardPoolAddresses, chainId]) //eslint-disable-line

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center">
        <div className="md:w-1/3 md:pr-16">
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
        <div className="md:w-2/3">
          <PageHeaderRight />
        </div>
      </div>

      <div className="mt-6 md:mt-12">
        <PoolColumns />
      </div>

      <PoolTable poolMap={poolMap} isActivePools={true} />

      {inactivePoolMap.length > 0 && (
        <InactivePools>
          <TYPE.thHeader
            className="tbHeader flex items-center cursor-pointer"
            onClick={() => setShowInactiveSection(!showInactiveSection)}
          >
            <div className="text-primary">{t('inactive pools')}</div>
            <div className="ml-2">
              {showInactiveSection ? (
                <Minimize2 size={16} color={theme.primary1} />
              ) : (
                <Maximize2 size={14} color={theme.primary1} />
              )}
            </div>
          </TYPE.thHeader>
          {showInactiveSection && (
            <>
              <PoolTable poolMap={inactivePoolMap} isActivePools={false} />
            </>
          )}
        </InactivePools>
      )}
    </PageWrapper>
  )
}

export default Pool
