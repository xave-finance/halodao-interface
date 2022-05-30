import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TYPE, HideSmall } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import FarmPoolCard from 'components/Farm/FarmPoolCard'
import Card from 'components/Card'
import { PoolInfo } from 'halo-hooks/usePoolInfo'
import { TokenPrice } from 'halo-hooks/useTokenPrice'
import { groupPoolsInfo } from 'utils/poolInfo'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useActiveWeb3React } from 'hooks'
import { AmmRewardsVersion } from 'utils/ammRewards'
import { Maximize2, Minimize2 } from 'react-feather'

const InactivePools = styled.div`
  margin-top: 1rem;

  .tbHeader {
    margin-bottom: 0.5rem;
  }
`

interface FarmPoolTableProps {
  poolsInfo: PoolInfo[]
  v0PoolsInfo: PoolInfo[]
  v1PoolsInfo: PoolInfo[]
  tokenPrice: TokenPrice
  selectedPool?: string
}

const FarmPoolTable = ({ poolsInfo, v0PoolsInfo, v1PoolsInfo, tokenPrice, selectedPool }: FarmPoolTableProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const { activePools, inactivePools } = groupPoolsInfo(poolsInfo, chainId)
  const [showInactiveSection, setShowInactiveSection] = useState(false)
  const [showInactiveV0Section, setShowInactiveV0Section] = useState(false)
  const [showInactiveV1Section, setShowInactiveV1Section] = useState(false)

  /**
   * Automatically scroll to a pool card if address is provided
   * @TODO: not currently working because the pool cards takes a long time to fully load
   */
  useEffect(() => {
    if (selectedPool) {
      document.getElementById(`pool-${selectedPool}`)?.scrollIntoView()
    }
  }, [selectedPool])

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
                  <RowFixed width="16%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('pool')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('baseApr')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('apr')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('totalValueStaked')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('stakeable')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('valueStaked')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <TYPE.thHeader style={{ justifySelf: 'flex-start' }}>{t('earned')}</TYPE.thHeader>
                  </RowFixed>
                  <RowFixed width="6%"></RowFixed>
                </RowBetween>
              </AutoColumn>
            </Card>
          </HideSmall>

          {activePools.map(poolInfo => {
            return (
              <FarmPoolCard
                key={poolInfo.address}
                poolInfo={poolInfo}
                tokenPrice={tokenPrice}
                isActivePool={true}
                preselected={poolInfo.address.toLowerCase() === selectedPool?.toLowerCase()}
              />
            )
          })}

          {activePools.length === 0 && (
            <div>
              <div className="animate-pulse bg-primary-lighter h-7 rounded my-4"></div>
              <div className="animate-pulse bg-primary-lighter h-7 rounded my-4"></div>
              <div className="animate-pulse bg-primary-lighter h-7 rounded my-4"></div>
              <div className="animate-pulse bg-primary-lighter h-7 rounded my-4"></div>
            </div>
          )}

          {inactivePools.length > 0 && (
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
                </>
              )}
            </InactivePools>
          )}

          {v1PoolsInfo.length > 0 && (
            <InactivePools>
              <TYPE.thHeader
                className="tbHeader flex items-center cursor-pointer"
                onClick={() => setShowInactiveV1Section(!showInactiveV1Section)}
              >
                <div className="text-primary">{t('inactive pools')} v1</div>
                <div className="ml-2">
                  {showInactiveV1Section ? (
                    <Minimize2 size={16} color={theme.primary1} />
                  ) : (
                    <Maximize2 size={14} color={theme.primary1} />
                  )}
                </div>
              </TYPE.thHeader>
              {showInactiveV1Section && (
                <>
                  {v1PoolsInfo.map(poolInfo => {
                    return (
                      <FarmPoolCard
                        key={poolInfo.address}
                        poolInfo={poolInfo}
                        tokenPrice={tokenPrice}
                        isActivePool={false}
                        rewardsVersion={AmmRewardsVersion.V1}
                      />
                    )
                  })}
                </>
              )}
            </InactivePools>
          )}

          {v0PoolsInfo.length > 0 && (
            <InactivePools>
              <TYPE.thHeader
                className="tbHeader flex items-center cursor-pointer"
                onClick={() => setShowInactiveV0Section(!showInactiveV0Section)}
              >
                <div className="text-primary">{t('inactive pools')} v0</div>
                <div className="ml-2">
                  {showInactiveV0Section ? (
                    <Minimize2 size={16} color={theme.primary1} />
                  ) : (
                    <Maximize2 size={14} color={theme.primary1} />
                  )}
                </div>
              </TYPE.thHeader>
              {showInactiveV0Section && (
                <>
                  {v0PoolsInfo.map(poolInfo => {
                    return (
                      <FarmPoolCard
                        key={poolInfo.address}
                        poolInfo={poolInfo}
                        tokenPrice={tokenPrice}
                        isActivePool={false}
                        rewardsVersion={AmmRewardsVersion.V0}
                      />
                    )
                  })}
                </>
              )}
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
