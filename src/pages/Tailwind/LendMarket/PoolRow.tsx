import React from 'react'
import { ChainId } from '@halodao/sdk'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { HALO } from '../../../constants'
import { PoolData } from './models/PoolData'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import BasicButton, { BasicButtonVariant } from 'components/Tailwind/Buttons/BasicButton'
import { useHistory } from 'react-router-dom'

const Wrapper = styled.div`
  .col-1 {
    width: 16%;
  }
  .col-2 {
    width: 15%;
  }
  .col-3 {
    width: 15%;
  }
  .col-4 {
    width: 11%;
  }
  .col-5 {
    width: 13%;
  }
  .col-6 {
    width: 13%;
  }
  .col-7 {
    width: 17%;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7 {
      width: 100%;
    }
  `};
`
interface PoolRowProps {
  pool: PoolData
}

const PoolRow = ({ pool }: PoolRowProps) => {
  const history = useHistory()

  return (
    <div
      className={`
        mb-4 p-4
        rounded shadow-lg
        border border-primary-hover
        md:mb-2 md:px-4 md:pt-2 md:-ml-4 md:-mr-4
        md:transition-colors
        md:hover:border-primary-hover
        md:bg-transparent
        ${
          pool.asset.symbol === 'RNBW'
            ? 'md:border border-gradient-to-tr from-primary-hover via-primary-gradientVia to-primary-gradientTo'
            : 'md:border-transparent'
        }
        md:shadow-none
        md:pb-2'
      `}
    >
      <Wrapper
        className={`
          md:flex md:flex-row md:justify-between md:cursor-pointer md:items-start
        `}
      >
        <div
          className={`
            col-1
            flex flex-row space-x-2 items-center justify-center
            font-semibold
            mb-4
            md:mb-0
            md:justify-start
            md:font-normal 
          `}
        >
          <CurrencyLogo currency={HALO[ChainId.MAINNET]} />
          <span>{pool.asset.symbol}</span>
        </div>
        <div className="col-2 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Market Size:</div>
          <div className="">{formatNumber(pool.marketSize, NumberFormat.usd)}</div>
        </div>
        <div className="col-3 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Total Borrowed:</div>
          <div className="">{formatNumber(pool.borrowed, NumberFormat.usd)}</div>
        </div>
        <div className="col-4 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Deposit APY:</div>
          <div className="">{formatNumber(pool.depositAPY)}</div>
        </div>
        <div className="col-5 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Borrow APY:</div>
          <div className="">{formatNumber(pool.borrowAPY)}</div>
        </div>
        <div className="col-6 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Total Earned:</div>
          <div className="">{formatNumber(pool.earned, NumberFormat.usd)}</div>
        </div>
        <div className="col-7 flex flex-col md:flex-row items-center">
          <div className="hidden md:block w-full md:mr-4">
            <BasicButton
              title="Lend"
              isEnabled={true}
              onClick={() => history.push('/lend-market/lend')}
              variant={BasicButtonVariant.Dark}
            />
          </div>
          <div className="md:hidden w-full mb-2">
            <BasicButton
              title="Lend"
              isEnabled={true}
              onClick={() => history.push('/lend-market/lend')}
              variant={BasicButtonVariant.Default}
            />
          </div>
          <div className="hidden md:block w-full">
            <BasicButton
              title="Borrow"
              isEnabled={true}
              onClick={() => history.push('/lend-market/borrow')}
              variant={BasicButtonVariant.Default}
            />
          </div>
          <div className="md:hidden w-full mb-2">
            <BasicButton
              title="Borrow"
              isEnabled={true}
              onClick={() => history.push('/lend-market/borrow')}
              variant={BasicButtonVariant.Outline}
            />
          </div>
        </div>
      </Wrapper>
    </div>
  )
}

export default PoolRow
