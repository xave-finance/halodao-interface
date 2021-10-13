import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { HALO, USDT, XSGD, USDC } from '../../../constants'
import { UserLendData } from './models/PoolData'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import PoolExpandButton from 'components/Tailwind/Buttons/PoolExpandButton'
import BasicButton from 'components/Tailwind/Buttons/BasicButton'

const Wrapper = styled.div`
  .col-1 {
    width: 30%;
  }
  .col-2 {
    width: 25%;
  }
  .col-3 {
    width: 20%;
  }
  .col-4 {
    width: 25%;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    .col-1, .col-2, .col-3, .col-4 {
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

interface UserBorrowRowProps {
  lend: UserLendData
}

const UserBorrowRow = ({ lend }: UserBorrowRowProps) => {
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
        <div className="col-1 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Your Borrows:</div>
          <div className="">{formatNumber(lend.balance, NumberFormat.usd)}</div>
        </div>
        <div className="col-2 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">Borrowed:</div>
          <div className="">{formatNumber(lend.balance, NumberFormat.usd)}</div>
        </div>
        <div className="col-3 mb-4 md:mb-0">
          <div className="text-xs font-semibold tracking-widest uppercase md:hidden">APY:</div>
          <div className="">{lend.lendAPY}%</div>
        </div>
        <div className="col-4">
          <BasicButton
            title="Manage"
            isEnabled={true}
            onClick={() => console.log('clicked')}
            className="md:text-primary md:bg-transparent md:mr-4"
          />
        </div>
      </Wrapper>
    </div>
  )
}

export default UserBorrowRow
