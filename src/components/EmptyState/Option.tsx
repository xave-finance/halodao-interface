import React from 'react'

import Row from '../Row'
import Card from '../Card'
import { RowBetween } from 'components/Row'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { ExternalLink } from '../../theme'

const WalletCard = styled(Card)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    width: 100%;
    flex: 0 1 auto;
    margin: 0rem;
    margin-bottom: 1rem;
  `};
  flex: 1 0 25%;
  background: #ffffff;
  border-radius: 5px;
  margin: 1rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1.5rem;
  width: 170px;
  height: 147px;
  :hover {
    cursor: pointer;
    background: #ffffff;
    box-shadow: 0px 4px 6px rgba(122, 122, 122, 0.3);
    border-radius: 3px;
  }
`
const InfoTitleRow = styled(RowBetween)`
  color: #333333;
  margin-bottom: 0.5rem;
`

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick: () => void
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <WalletCard id={id} onClick={onClick}>
      <Row>
        <img style={{ marginBottom: '0.5rem' }} width={'44px'} src={icon} alt="logo" />
      </Row>
      <InfoTitleRow>
        <TYPE.subHeader
          style={{
            fontWeight: 700,
            fontSize: '0.90rem',
            justifySelf: 'flex-start',
            lineHeight: '130%'
          }}
        >
          {header}
        </TYPE.subHeader>
      </InfoTitleRow>
      <Row>
        <TYPE.body
          style={{
            marginTop: '0.1rem',
            fontWeight: 400,
            fontSize: '0.75rem',
            justifySelf: 'flex-start',
            lineHeight: '130%'
          }}
          id="text-stakeable-value"
        >
          Use {header} to connect to HaloDAO
        </TYPE.body>
      </Row>
    </WalletCard>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
