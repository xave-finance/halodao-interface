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
  const InactivePoolsParent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `
  const CustomTHHeader = styled(TYPE.thHeader)`
    font-family: Open Sans !important;
    justify-self: flex-start;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
    color: #838383;
  `
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
                padding: '2rem 0px 0px 0.7rem'
              }}
            >
              <AutoColumn>
                <RowBetween>
                  <RowFixed width="18%">
                    <CustomTHHeader>{t('pool')}</CustomTHHeader>
                  </RowFixed>
                  <RowFixed width="11%">
                    <CustomTHHeader>{t('apr')}</CustomTHHeader>
                  </RowFixed>
                  <RowFixed width="18%">
                    <CustomTHHeader>{t('totalPoolValue')}</CustomTHHeader>
                  </RowFixed>
                  <RowFixed width="13%">
                    <CustomTHHeader>{t('stakeable')}</CustomTHHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <CustomTHHeader>{t('valueStaked')}</CustomTHHeader>
                  </RowFixed>
                  <RowFixed width="16%">
                    <CustomTHHeader>{t('earned')}</CustomTHHeader>
                  </RowFixed>
                  <RowFixed width="8%"></RowFixed>
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
                <InactivePoolsParent>
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
                </InactivePoolsParent>
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
                <InactivePoolsParent>
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
                </InactivePoolsParent>
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
                <InactivePoolsParent>
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
                </InactivePoolsParent>
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
