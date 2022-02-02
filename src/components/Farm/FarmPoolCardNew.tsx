import React from 'react'
import { PoolInfo } from '../../halo-hooks/usePoolInfo'
import { TokenPrice } from '../../halo-hooks/useTokenPrice'
import styled from 'styled-components'

interface FarmPoolCardNewProps {
  // poolsInfo: PoolInfo[]
  // tokenPrice: TokenPrice
  title: string
  tokenPrice: string
  header: boolean
}

const FarmCard = styled.div`
  max-width: 175px;
  width: 100%;
  background: white;
  background-size: 50% auto;
  border: 1.5px solid #472edb;
  border-radius: 5px;
  height: 118px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: none;
    width: 100%;
    margin-bottom: 5px;
    height: 64px;
  `};
`
const FarmPoolCardNew = ({ title, tokenPrice, header }: FarmPoolCardNewProps) => {
  // @ts-ignore
  return (
    <>
      <FarmCard>
        <div
          style={{
            width: '100%',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            background: '#471bb2',
            boxSizing: 'border-box',
            height: '28px',
            paddingTop: '7px'
          }}
        >
          <p
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            {title}
          </p>
        </div>
        <div style={{ padding: '8px' }}>
          <p
            style={{
              textTransform: 'uppercase',
              color: 'black',
              fontSize: '24px',
              marginTop: '40px',
              fontWeight: 'bold'
            }}
          >
            5000.03
          </p>
        </div>
      </FarmCard>
    </>
  )
}

export default FarmPoolCardNew
