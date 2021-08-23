import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { HALO, USDT, XSGD, USDC } from '../../../constants'
import { UserLendData } from './models/PoolData'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import CollateralModal from './modals/CollateralModal'
import BasicButton from 'components/Tailwind/Buttons/ BasicButton'

const Wrapper = styled.div`
  .col-1 {
    width: 22%;
  }
  .col-2 {
    width: 28%;
  }
  .col-3 {
    width: 20%;
  }
  .col-4 {
    width: 12%;
  }
  .col-5 {
    width: 18%;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    .col-1, .col-2, .col-3, .col-4, .col-5 {
      width: 100%;
    }
  `};
`
const CheckBoxWrapper = styled.div`
  position: relative;
`
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`

interface UserLendRowProps {
  lend: UserLendData
}

const UserLendRow = ({ lend }: UserLendRowProps) => {
  const [showModal, setShowModal] = useState(false)

  const userLends: UserLendData[] = [
    {
      asset: HALO[ChainId.MAINNET]!,
      balance: 1000,
      lendAPY: 40,
      collateral: false
    },
    {
      asset: USDT,
      balance: 100000,
      lendAPY: 40,
      collateral: true
    }
  ]

  return (
    <div
      className={`
        mb-4 p-4
        rounded shadow-lg
        bg-white
        md:mb-2 md:px-4 md:pt-2 md:-ml-4 md:-mr-4
        md:transition-colors
        md:hover:border-primary-hover
        md:bg-transparent
        md:shadow-none
        md:pb-2
        md:mr-2
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
          <span>{lend.asset.symbol}</span>
        </div>
        <div className="col-2 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Current Balance:</div>
          <div className="">{formatNumber(lend.balance, NumberFormat.usd)}</div>
        </div>
        <div className="col-3 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">APY:</div>
          <div className="">{lend.lendAPY}%</div>
        </div>
        <div className="col-4 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Collateral:</div>
          <div className="">
            <CheckBoxWrapper>
              <CheckBox
                id={lend.asset.symbol}
                type="checkbox"
                onChange={e => {
                  e.target.checked ? setShowModal(true) : setShowModal(false)
                  console.log('clicked', e.target.checked)
                }}
              />
              <CheckBoxLabel htmlFor={lend.asset.symbol} />
            </CheckBoxWrapper>
          </div>
        </div>
        <div className="col-5">
          <BasicButton
            title="Manage"
            isEnabled={true}
            onClick={() => console.log('clicked')}
            className="md:bg-primary-gray md:mr-4"
          />
        </div>
      </Wrapper>
      <CollateralModal isVisible={showModal} currency={HALO[ChainId.MAINNET]!} onDismiss={() => setShowModal(false)} />
    </div>
  )
}

export default UserLendRow
