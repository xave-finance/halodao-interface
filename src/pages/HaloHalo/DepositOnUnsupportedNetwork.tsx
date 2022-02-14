import React from 'react'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import { ExternalLink } from 'react-feather'
import { ChainId } from '@halodao/sdk'

interface DepositOnUnsupportedNetworkProps {
  chainId: ChainId
}
const DepositOnUnsupportedNetwork = ({ chainId }: DepositOnUnsupportedNetworkProps) => {
  return (
    <div className="flex flex-col justify-center mt-4">
      <p className="font-semibold text-center mb-2">Got extra RNBW? Earn more rewards on our next rewards epoch. </p>
      <PrimaryButton
        title="Deposit"
        icon={<ExternalLink />}
        state={PrimaryButtonState.Enabled}
        onClick={() => {
          if (chainId === ChainId.MATIC) {
            window.location.href =
              'https://app.sushi.com/swap?inputCurrency=0x18e7bdb379928a651f093ef1bc328889b33a560c&outputCurrency=0xc104e54803aba12f7a171a49ddc333da39f47193'
          } else if (chainId === ChainId.ARBITRUM) {
            window.location.href =
              'https://app.sushi.com/swap?inputCurrency=0xA4b7999A1456A481FB0F2fa7E431b9B641A00770&outputCurrency=0x323C11843DEaEa9f13126FE33B86f6C5086DE138'
          }
        }}
      />
    </div>
  )
}

export default DepositOnUnsupportedNetwork
