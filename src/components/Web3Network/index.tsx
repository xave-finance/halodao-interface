import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_LABEL } from '../../constants/networks'
import NetworkModal from '../NetworkModal'

function Web3Network(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <div
      className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={toggleNetworkModal}
    >
      <div className="grid grid-flow-col auto-cols-max items-center rounded-lg bg-dark-1000 text-sm text-secondary py-2 px-3 pointer-events-auto">
        <div className="text-primary">{NETWORK_LABEL[chainId]}</div>
      </div>
      <NetworkModal />
    </div>
  )
}

export default Web3Network
