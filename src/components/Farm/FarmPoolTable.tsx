import React from 'react'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import FarmPoolCard from 'components/Farm/FarmPoolCard'
import Card from 'components/Card'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import { groupPoolsInfo } from 'utils/poolInfo'
import styled from 'styled-components'

const InactivePools = styled.div`
  margin-top: 1rem;

  .tbHeader {
    margin-bottom: 0.5rem;
  }
`

interface FarmPoolTableProps {
  poolsInfo: PoolInfo[]
  tokenPrice: TokenPrice
}

const FarmPoolTable = ({ poolsInfo, tokenPrice }: FarmPoolTableProps) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { inactivePools, activePools } = groupPoolsInfo(poolsInfo)

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

          {activePools.map(poolInfo => {
            return (
              <FarmPoolCard key={poolInfo.address} poolInfo={poolInfo} tokenPrice={tokenPrice} isActivePool={true} />
            )
          })}

          {inactivePools.length > 0 && (
            <InactivePools>
              <TYPE.thHeader className="tbHeader">{t('inactive pools')}</TYPE.thHeader>
              {inactivePools.map(poolInfo => {
                return (
                  <FarmPoolCard
                    key={poolInfo.address}
                    poolInfo={poolInfo}
                    tokenPrice={tokenPrice}
                    isActivePool={false}
                  />
                )
              })}
            </InactivePools>
          )}
        </AutoColumn>
      </>
    )
  } else {
    return <></>
  }
}

export default FarmPoolTable
