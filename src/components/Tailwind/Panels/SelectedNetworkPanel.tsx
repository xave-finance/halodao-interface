import React from 'react'
import { ChainId } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from '../../../constants/networks'

const SelectedNetworkPanel = () => {
  return (
    <div className="mb-2 w-2/5 flex-col items-center p-4 rounded-card bg-primary-lightest">
      <div className="flex justify-end">
        <a href="#" className="text-link-primary text-sm">
          Change
        </a>
      </div>
      <div>
        <img src={NETWORK_ICON[ChainId.MAINNET]} alt="Switch Network" className="logo h-7 rounded-2xl" />
      </div>
      <div>{NETWORK_LABEL[ChainId.MAINNET]}</div>
    </div>
  )
}

export default SelectedNetworkPanel
