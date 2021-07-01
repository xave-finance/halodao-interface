import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'

import { TYPE, HideSmall } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import FarmPoolCard from 'components/Farm/FarmPoolCard'
import Card from 'components/Card'
import { PoolInfo, usePoolInfo } from 'halo-hooks/usePoolInfo'
import { usePoolAddresses } from 'halo-hooks/useRewards'
import { useTokenPrice } from 'halo-hooks/useTokenPrice'

const FarmPoolTable = () => {
  const poolAddresses = usePoolAddresses()
  const fetchPoolInfo = usePoolInfo(poolAddresses)
  const { t } = useTranslation()
  const [poolsInfo, setPoolsInfo] = useState<PoolInfo[]>([])
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([])
  const tokenPrice = useTokenPrice(tokenAddresses)

  useEffect(() => {
    fetchPoolInfo().then(result => {
      setPoolsInfo(result.poolsInfo)
      setTokenAddresses(result.tokenAddresses)
    })
  }, [fetchPoolInfo])

  const { account } = useWeb3React()
  if (account) {
    return (
      <>
        <AutoColumn
          gap="sm"
          style={{
            width: '100%'
          }}
        >
          <HideSmall>
            <Card
              style={{
                padding: '2rem 0 0.5rem'
              }}
            >
              <AutoColumn>
                <RowBetween>
                  <RowFixed width="18%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('pool')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('apy')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="18%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('totalPoolValue')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('stakeable')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('valueStaked')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="14%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('earned')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="8%"></RowFixed>
                </RowBetween>
              </AutoColumn>
            </Card>
          </HideSmall>
          {poolsInfo.map((poolInfo, index) => {
            return <FarmPoolCard key={poolInfo.address} poolId={index} poolInfo={poolInfo} tokenPrice={tokenPrice} />
          })}
        </AutoColumn>
      </>
    )
  } else {
    return <></>
  }
}

export default FarmPoolTable
