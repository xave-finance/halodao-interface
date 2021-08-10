import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import RNBWToken from '../../../assets/svg/rnbw-token.svg'

const PageHeaderRight = () => {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex-auto flex flex-col space-y-2">
        <div className="flex-auto bg-primary-light py-4 px-6 rounded-card">
          <div className="text-xs font-extrabold tracking-widest text-primary uppercase">My Stakeable LPT value</div>
          <div className="text-2xl font-semibold">{formatNumber(123.456, NumberFormat.usd)}</div>
        </div>
        <div className="flex-auto bg-primary-light py-4 px-6 rounded-card">
          <div className="text-xs font-extrabold tracking-widest text-primary uppercase">My Staked LPT value</div>
          <div className="text-2xl font-semibold">{formatNumber(987.654, NumberFormat.usd)}</div>
        </div>
      </div>
      <div className="flex-auto bg-primary-light py-4 px-6 rounded-card flex flex-col">
        <div className="hidden md:block md:mb-2">
          <img src={RNBWToken} width="80" alt="RNBW token" />
        </div>
        <div className="text-xs font-extrabold tracking-widest text-primary uppercase">Total Fees Earned</div>
        <div className="text-2xl font-semibold">{formatNumber(10.123)} RNBW</div>
      </div>
    </div>
  )
}

export default PageHeaderRight
