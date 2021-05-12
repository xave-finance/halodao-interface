import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { ChainId } from '@sushiswap/sdk'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { Box, Flex } from 'rebass'
import Row from '../Row'
import styled from 'styled-components'

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

const PARAMS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'], //['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
  },
  /*
  [ChainId.HECO]: {
    chainId: '0x80',
    chainName: 'Heco',
    nativeCurrency: {
      name: 'Heco Token',
      symbol: 'HT',
      decimals: 18
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com']
  },
  */
  [ChainId.XDAI]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai Token',
      symbol: 'xDai',
      decimals: 18
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai']
  }
  /*
    [ChainId.HARMONY]: {
        chainId: '0x63564C40',
        chainName: 'Harmony One',
        nativeCurrency: {
            name: 'One Token',
            symbol: 'ONE',
            decimals: 18
        },
        rpcUrls: ['https://api.s0.t.hmny.io'],
        blockExplorerUrls: ['https://explorer.harmony.one/']
    },
    [ChainId.AVALANCHE]: {
        chainId: '0xA86A',
        chainName: 'Avalanche',
        nativeCurrency: {
            name: 'Avalanche Token',
            symbol: 'AVAX',
            decimals: 18
        },
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://explorer.avax.network']
    },
    [ChainId.OKEX]: {
        chainId: '0x42',
        chainName: 'OKEx',
        nativeCurrency: {
            name: 'OKEx Token',
            symbol: 'OKT',
            decimals: 18
        },
        rpcUrls: ['https://exchainrpc.okex.org'],
        blockExplorerUrls: ['https://www.oklink.com/okexchain']
    }
    */
}

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
            ChainId.XDAI
            //ChainId.HARMONY,
            //ChainId.AVALANCHE,
            //ChainId.OKEX
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
                  const params = PARAMS[key]
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
