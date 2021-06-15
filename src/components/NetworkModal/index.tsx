import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { ChainId } from '@sushiswap/sdk'
import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { Box } from 'rebass'
import Row from '../Row'
import styled from 'styled-components'
import { NETWORK_PARAMS } from '../../constants/networks'
import HaloModal from 'components/Modal/HaloModal'
import ConnectedIndicator from 'components/Modal/ConnectedIndicator'

const StyledDescription = styled.div`
  font-size: 14px;
  margin-bottom: 15px;

  .halodao {
    background: ${({ theme }) => theme.haloGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .current-network {
    color: ${({ theme }) => theme.text4};
  }
`

const NetworkButton = styled.button`
  width: 100%;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin: 9px 0;
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  justify-content: space-evenly;

  :focus,
  :active {
    border: 1px solid #e0e0e0;
  }

  :hover {
    border-color: ${({ theme }) => theme.text4};
  }

  .logo {
    width: 42px;
    margin: 0 20px 0 10px;
  }
`

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <HaloModal isOpen={networkModalOpen} onDismiss={toggleNetworkModal} title="Select a Network">
      <>
        <StyledDescription>
          You are currently browsing <span className="halodao">HALODAO</span> on the{' '}
          <span className="current-network">{NETWORK_LABEL[chainId]}</span> network
        </StyledDescription>
        {[
          ChainId.MAINNET,
          //ChainId.FANTOM,
          ChainId.BSC,
          ChainId.MATIC
          //ChainId.HECO,
          //ChainId.XDAI,
          //ChainId.HARMONY,
          //ChainId.AVALANCHE,
          //ChainId.OKEX
          //ChainId.MOONBASE
        ].map((key: ChainId, i: number) => {
          if (chainId === key) {
            return (
              <NetworkButton key={i}>
                <Row>
                  <Box>
                    <img src={NETWORK_ICON[key]} alt="Switch Network" className="logo" />
                  </Box>
                  <Box>{NETWORK_LABEL[key]}</Box>
                  <ConnectedIndicator />
                </Row>
              </NetworkButton>
            )
          }
          return (
            <NetworkButton
              key={i}
              onClick={() => {
                toggleNetworkModal()
                const params = NETWORK_PARAMS[key]
                library?.send('wallet_addEthereumChain', [params, account])
              }}
            >
              <Row>
                <Box>
                  <img src={NETWORK_ICON[key]} alt="Switch Network" className="logo" />
                </Box>
                <Box>
                  <div className="text-primary font-bold">{NETWORK_LABEL[key]}</div>
                </Box>
              </Row>{' '}
            </NetworkButton>
          )
        })}
      </>
    </HaloModal>
  )
}
