import React from 'react'
import CurrencyLogo from 'components/CurrencyLogo'

import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { Currency } from '@halodao/sdk'

// StatCardProps
interface StatCardProps {
  label1: string
  value1: number
  label2?: string
  value2?: number
  label3?: string
  value3?: number
  label4?: string
  value4?: number
  label5?: string
  value5?: number
  label6?: string
  value6?: number
  label7?: string
  value7?: number
  currency?: Currency
}

const StatCard = ({
  label1,
  value1,
  label2,
  value2,
  label3,
  value3,
  label4,
  value4,
  label5,
  value5,
  label6,
  value6,
  label7,
  value7,
  currency
}: StatCardProps) => {
  return (
    <div className="flex-auto bg-primary-lightGray bg-opacity-10 py-6 rounded-card flex flex-col">
      <div className="flex flex-col md:flex-row px-6">
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label1}</div>
          <div className="text-2xl font-semibold">{formatNumber(value1, NumberFormat.usd)}</div>
        </div>
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label2}</div>
          <div className="text-2xl font-semibold">{value2 ? formatNumber(value2, NumberFormat.usd) : ''}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-6 mt-2">
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label3}</div>
          <div className="text-2xl font-semibold">{value3 ? formatNumber(value3, NumberFormat.usd) : ''}</div>
        </div>
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label4}</div>
          <div className="text-2xl font-semibold">{value4 ? formatNumber(value4, NumberFormat.usd) : ''}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-6 mt-2">
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label5}</div>
          <div className="text-2xl font-semibold">{value5 ? formatNumber(value5, NumberFormat.usd) : ''}</div>
        </div>
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label6}</div>
          <div className="text-2xl font-semibold">{value6 ? formatNumber(value6, NumberFormat.usd) : ''}</div>
        </div>
      </div>

      <div className="w-container border-b border-gray-800 mt-6 mb-6"></div>

      <div className="flex flex-col md:flex-row px-6 mt-2">
        <div className="flex-auto md:w-1/2">
          <div className="text-xs font-extrabold tracking-widest text-black uppercase">{label7}</div>
          <div className="text-2xl font-semibold">{value7 ? formatNumber(value7, NumberFormat.usd) : ''}</div>
        </div>
        <div className="flex flex-auto md:w-1/2 md:justify-end mr-4">
          <CurrencyLogo currency={currency} size="78px" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
