import React from 'react'
import { formatNumber, NumberFormat } from 'utils/formatNumber'

interface SwapDetailsProps {
  price?: number
  toCurrency?: string
  fromCurrency?: string
  minimumReceived?: string
  priceImpact?: string
  liqProviderFee?: string
}

export default function SwapDetails({
  price,
  toCurrency,
  fromCurrency,
  minimumReceived
}: /*
  priceImpact,
  liqProviderFee
  */
SwapDetailsProps) {
  return (
    <>
      <div className="flex flex-row justify-start mt-6 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Price</div>
        <div
          className={`
            ${!price && 'animate-pulse bg-primary h-4 w-36 rounded'} w-1/2 flex justify-end
          `}
        >
          {price ? `${formatNumber(price, NumberFormat.long)} ${toCurrency}/${fromCurrency}` : ''}
        </div>
      </div>
      <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Minimum Received</div>
        <div
          className={`
            ${!minimumReceived && 'animate-pulse bg-primary h-4 w-36 rounded'} w-1/2 flex justify-end
          `}
        >
          {minimumReceived ? `${minimumReceived} ${toCurrency}` : ' '}
        </div>
      </div>

      {/*

      // Leaving this for now since we might need this for future calculations. 
      // The math behind this is from the one that I showed you before.
      
      <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Price Impact</div>
        <div className="w-1/2 flex justify-end text-success-alternate">{`<0.01%`}</div>
      </div>
      <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Liquidity Provider Fee</div>
        <div className="w-1/2 flex justify-end">Price</div>
      </div>
      
      */}
    </>
  )
}
