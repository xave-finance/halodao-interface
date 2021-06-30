import React from 'react'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import FarmPoolCard from 'components/Farm/FarmPoolCard'
import Card from 'components/Card'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { useTokenPrice } from 'halo-hooks/useTokenPrice'

interface FarmPoolTableProps {
  poolsInfo: PoolInfo[]
  tokenAddresses: string[]
}

const FarmPoolTable = ({ poolsInfo, tokenAddresses }: FarmPoolTableProps) => {
  const { t } = useTranslation()
  const tokenPrice = useTokenPrice(tokenAddresses)

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
            return <FarmPoolCard key={poolInfo.address} poolInfo={poolInfo} tokenPrice={tokenPrice} />
          })}
        </AutoColumn>
      </>
    )
  } else {
    return <></>
  }
}

export default FarmPoolTable
