import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from '../../../constants/networks'
import NetworkModal, { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'

const SelectedNetworkPanel = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div
      className="mb-2 w-2/5 flex-col items-center p-4 rounded-card bg-primary-lightest cursor-pointer"
      onClick={() => setShowModal(true)}
    >
      <div className="flex justify-end">
        <a className="text-link-primary text-sm">Change</a>
      </div>
      <div>
        <img src={NETWORK_ICON[ChainId.MAINNET]} alt="Switch Network" className="logo h-7 rounded-2xl" />
      </div>
      <div>{NETWORK_LABEL[ChainId.MAINNET]}</div>
      <NetworkModal isVisible={showModal} mode={NetworkModalMode.Bridge} onDismiss={() => setShowModal(false)} />
    </div>
  )
}

export default SelectedNetworkPanel
