import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { NETWORK_ICON, NETWORK_LABEL } from '../../../constants/networks'
import NetworkModal, { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'

interface SelectedNetworkPanelProps {
  mode: NetworkModalMode
  chainId: ChainId
  onChangeNetwork: (chainId: ChainId) => void
  destinationChainId?: any
  tokenAddress?: string
}

const SelectedNetworkPanel = ({
  mode,
  chainId,
  onChangeNetwork,
  destinationChainId,
  tokenAddress
}: SelectedNetworkPanelProps) => {
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
        <img src={NETWORK_ICON[chainId]} alt="Switch Network" className="logo h-7 rounded-2xl" />
      </div>
      <div className="mt-1">{NETWORK_LABEL[ChainId.MAINNET]}</div>
      <NetworkModal isVisible={showModal} mode={mode} onDismiss={() => setShowModal(false)} />
      <div>{NETWORK_LABEL[chainId as ChainId]}</div>
      <NetworkModal
        isVisible={showModal}
        mode={destinationChainId ? NetworkModalMode.PrimaryBridge : NetworkModalMode.Default}
        onDismiss={() => setShowModal(false)}
        onChangeNetwork={(chainId: number) => onChangeNetwork(chainId)}
        tokenAddress={tokenAddress}
      />
    </div>
  )
}

export default SelectedNetworkPanel
