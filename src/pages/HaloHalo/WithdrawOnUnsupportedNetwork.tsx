import React from 'react'
import { ExternalLink } from 'react-feather'
import { ChainId } from '@halodao/sdk'

interface WithdrawOnUnsupportedNetworkProps {
  chainId: ChainId
}
const WithdrawOnUnsupportedNetwork = ({ chainId }: WithdrawOnUnsupportedNetworkProps) => {
  return (
    <div className="flex flex-col justify-center mt-4">
      <p className="font-semibold text-center mb-2">
        Do you want to claim your RNBW? Swap your vested xRNBW into RNBW.{' '}
      </p>
      <button
        className={`
        flex items-center justify-center
        font-bold text-white
        py-2 w-full
        rounded
        text-primary font-bold
        bg-white
        border-2 border-primary
      `}
        onClick={() => {
          if (chainId === ChainId.MATIC || chainId === ChainId.ARBITRUM || chainId === ChainId.ARBITRUM_TESTNET) {
            window.location.href =
              'https://app.sushi.com/swap?inputCurrency=0xc104e54803aba12f7a171a49ddc333da39f47193&outputCurrency=0x18e7bdb379928a651f093ef1bc328889b33a560c'
          }
        }}
      >
        Claim RNBW <span className="mr-2" /> <ExternalLink />
      </button>
    </div>
  )
}

export default WithdrawOnUnsupportedNetwork
