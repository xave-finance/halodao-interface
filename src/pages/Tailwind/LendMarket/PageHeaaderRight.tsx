import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'

const PageHeaderRight = () => {
  return (
    <div className="flex flex-col space-y-2 h-full md:flex-row md:space-y-0 md:space-x-2">
      <div className="flex-auto bg-primary-dark bg-opacity-10 py-6 px-6 rounded-card flex flex-col">
        <div className="flex-auto">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Health Factor</div>
          <div className="text-2xl font-semibold">-</div>
        </div>
        <div className="flex-auto">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">Total Market Size</div>
          <div className="text-2xl font-semibold">{formatNumber(10.123, NumberFormat.usd)}</div>
        </div>
      </div>
    </div>
  )
}

export default PageHeaderRight
