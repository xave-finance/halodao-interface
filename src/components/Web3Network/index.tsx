import React, { useState } from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { NETWORK_LABEL } from '../../constants/networks'
import NetworkModal, { NetworkModalMode } from '../Tailwind/Modals/NetworkModal'
import { SUPPORTED_WALLETS } from '../../constants'
import { injected } from '../../connectors'
import styled from 'styled-components'
import { YellowCard } from '../Card'
import { ChainId } from '@halodao/sdk'

const StyledWrapper = styled(YellowCard)`
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 8px 12px;
  white-space: nowrap;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};

  :hover {
    opacity: 0.8;
  }
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  [ChainId.MATIC]: 'Matic',
  [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  [ChainId.XDAI]: 'xDai',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.MOONBASE]: 'Moonbase',
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.ARBITRUM_TESTNET]: 'Arbitrum Testnet'
}

function Web3Network(): JSX.Element | null {
  const { chainId, connector } = useActiveWeb3React()
  const [showModal, setShowModal] = useState(false)

  // Hide if wallet is not connected
  if (!chainId) return null

  const isConnectedToMetamask = () => {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return name === SUPPORTED_WALLETS['METAMASK'].name
  }

  // Hide if connected wallet is not Metamask
  if (!isConnectedToMetamask()) return null

  return (
    <>
      <StyledWrapper title={NETWORK_LABELS[chainId]} onClick={() => setShowModal(true)}>
        <div>
          <div className="text-primary">{NETWORK_LABEL[chainId]}</div>
        </div>
      </StyledWrapper>
      <NetworkModal isVisible={showModal} mode={NetworkModalMode.Default} onDismiss={() => setShowModal(false)} />
    </>
  )
}

export default Web3Network
