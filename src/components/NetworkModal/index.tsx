import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { ChainId } from '@sushiswap/sdk'
import Modal from '../Modal'
import ModalHeader from './ModalHeader'
import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { Box, Flex } from 'rebass'
import Row from '../Row'
import styled from 'styled-components'
import { NETWORK_PARAMS } from '../../constants/index'

const NetworkButton = styled.button`
  width: 80%;
  backgroundcolor: #471bb2;
  background: rgba(71, 27, 178, 0.1);
  border: none;
  cursor: pointer;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;

  :hover {
    opacity: 0.7;
  }
`
const ModalBody = styled(Box)`
  padding-left: 45px;
  padding-top: 10px;
  padding-bottom: 20px;
`

const ModalBodyDescription = styled.div`
  padding-left: 10px;
`

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <Flex>
        <ModalBody>
          <ModalBodyDescription>
            <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />
            <div style={{ width: '90%' }}>You are currently browsing HALO on the {NETWORK_LABEL[chainId]} network</div>
          </ModalBodyDescription>
          {[
            ChainId.MAINNET,
            ChainId.FANTOM,
            ChainId.BSC,
            ChainId.MATIC,
            //ChainId.HECO,
            ChainId.XDAI,
            //ChainId.HARMONY,
            //ChainId.AVALANCHE,
            //ChainId.OKEX
            ChainId.MOONBASE
          ].map((key: ChainId, i: number) => {
            if (chainId === key) {
              return (
                <NetworkButton key={i}>
                  <Row>
                    <Box width={1 / 4}>
                      <img width="30%" src={NETWORK_ICON[key]} alt="Switch Network" className="" />
                    </Box>
                    <Box>{NETWORK_LABEL[key]}</Box>
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
                  <Box width={1 / 4}>
                    <img width="30%" src={NETWORK_ICON[key]} alt="Switch Network" className="" />
                  </Box>
                  <Box>
                    <div className="text-primary font-bold">{NETWORK_LABEL[key]}</div>
                  </Box>
                </Row>{' '}
              </NetworkButton>
            )
          })}
        </ModalBody>
      </Flex>
    </Modal>
  )
}
