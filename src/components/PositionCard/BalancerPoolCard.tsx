import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import { ButtonEmpty, ButtonPrimaryNormal, ButtonSecondary } from '../Button'
import { AutoColumn } from '../Column'
import Row, { RowFixed, AutoRow, RowBetween } from '../Row'
import { FixedHeightRow, StyledPositionCard } from '.'
import { ExternalLink } from 'theme'
import NumericalInput from 'components/NumericalInput'
import { CardSection, DataCard } from 'components/earn/styled'
import styled from 'styled-components'
import { transparentize } from 'polished'

const BalanceCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.text4};
  overflow: hidden;
  text-align: center;
  margin-top: 10px;
`

export interface BalancerPoolInfo {
  pair: string
  address: string
  balancerUrl: string
}

interface BalancerPoolCardProps {
  account: string | null | undefined
  poolInfo: BalancerPoolInfo
}

export default function BalancerPoolCard({ account, poolInfo }: BalancerPoolCardProps) {
  const [showMore, setShowMore] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const backgroundColor = '#FFFFFF'
  const bptBalance = 0
  const bptStaked = 0
  const haloBalance = 0

  return (
    <StyledPositionCard bgColor={backgroundColor}>
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <Text fontWeight={500} fontSize={20}>
              {poolInfo.pair}
            </Text>
          </AutoRow>
          {account && (
            <RowFixed gap="8px">
              <ButtonEmpty
                padding="6px 8px"
                borderRadius="20px"
                width="fit-content"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (
                  <>
                    Manage
                    <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                  </>
                ) : (
                  <>
                    Manage
                    <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                  </>
                )}
              </ButtonEmpty>
            </RowFixed>
          )}
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <ButtonSecondary padding="8px" borderRadius="8px">
              <ExternalLink style={{ width: '100%', textAlign: 'center' }} href={poolInfo.balancerUrl}>
                To stake, get BPT tokens here <span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
            </ButtonSecondary>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Balance: {bptBalance} BPT
              </Text>
              <Text fontSize={16} fontWeight={500}>
                Staked: {bptStaked} BPT
              </Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <NumericalInput value={stakeAmount} onUserInput={amount => setStakeAmount(amount)} />
              <NumericalInput value={unstakeAmount} onUserInput={amount => setUnstakeAmount(amount)} />
            </RowBetween>

            <RowBetween marginTop="10px">
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(parseInt(stakeAmount) > 0 && parseInt(stakeAmount) <= bptBalance)}
              >
                Stake
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(parseInt(unstakeAmount) > 0 && parseInt(unstakeAmount) <= bptStaked)}
              >
                Unstake
              </ButtonPrimaryNormal>
            </RowBetween>

            <Row justify="center">
              <BalanceCard>
                <CardSection>
                  <Text fontSize={16} fontWeight={500}>
                    Rewards earned: {haloBalance} HALO
                  </Text>
                </CardSection>
              </BalanceCard>
            </Row>

            <RowBetween marginTop="10px">
              <ButtonPrimaryNormal padding="8px" borderRadius="8px" width="48%" disabled={!(haloBalance > 0)}>
                Claim rewards
              </ButtonPrimaryNormal>
              <ButtonPrimaryNormal
                padding="8px"
                borderRadius="8px"
                width="48%"
                disabled={!(haloBalance > 0 && bptStaked > 0)}
              >
                Unstake and claim rewards
              </ButtonPrimaryNormal>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
