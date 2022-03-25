import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { UserLendData } from './models/PoolData'
import styled from 'styled-components'
import BasicButton, { BasicButtonVariant } from 'components/Tailwind/Buttons/BasicButton'
import { useHistory } from 'react-router-dom'

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
interface UserBorrowRowProps {
  lend: UserLendData
}

const UserBorrowRow = ({ lend }: UserBorrowRowProps) => {
  const history = useHistory()

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
          <div className="hidden md:block w-full">
            <BasicButton
              title="Manage"
              isEnabled={true}
              onClick={() => history.push('/lend-market/borrow')}
              variant={BasicButtonVariant.Light}
            />
          </div>
          <div className="md:hidden w-full mb-2">
            <BasicButton
              title="Manage"
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

export default UserBorrowRow
