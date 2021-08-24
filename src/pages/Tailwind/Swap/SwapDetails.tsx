import React from 'react'

const SwapDetails = () => {
  return (
    <>
      <div className="flex flex-row justify-start mt-6 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Price</div>
        <div className="w-1/2 flex justify-end">88.2412 DAI/ETH</div>
      </div>
      <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Minimum Received</div>
        <div className="w-1/2 flex justify-end">8.78 DAI</div>
      </div>
      <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Price Impact</div>
        <div className="w-1/2 flex justify-end text-success-alternate">{`<0.01%`}</div>
      </div>
      <div className="flex flex-row justify-start mt-2 px-8 w-container text-sm font-bold">
        <div className="w-1/2 text-secondary-alternate">Liquidity Provider Fee</div>
        <div className="w-1/2 flex justify-end">Price</div>
      </div>
    </>
  )
}

export default SwapDetails
