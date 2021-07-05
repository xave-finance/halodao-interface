import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_LABEL } from '../../constants/networks'
import NetworkModal from '../NetworkModal'
import { SUPPORTED_WALLETS } from '../../constants'
import { injected } from '../../connectors'
import styled from 'styled-components'
import { YellowCard } from '../Card'
import { ChainId } from '@sushiswap/sdk'

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
  [ChainId.MOONBASE]: 'Moonbase'
}

function Web3Network(): JSX.Element | null {
  const { chainId, connector } = useActiveWeb3React()
  const toggleNetworkModal = useNetworkModalToggle()

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
    <StyledWrapper
      title={NETWORK_LABELS[chainId]}
      className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={toggleNetworkModal}
    >
      <div className="grid grid-flow-col auto-cols-max items-center rounded-lg bg-dark-1000 text-sm text-secondary py-2 px-3 pointer-events-auto">
        <div className="text-primary">{NETWORK_LABEL[chainId]}</div>
      </div>
      <NetworkModal />
    </StyledWrapper>
  )
}

export default Web3Network
