import React from 'react'
import { ChainId } from '@sushiswap/sdk'
import { ORIGINAL_TOKEN_CHAIN_ID } from 'constants/bridge'
import { NETWORK_ICON, NETWORK_LABEL, NETWORK_PARAMS } from '../../../constants/networks'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import ConnectedIndicator from 'components/Modal/ConnectedIndicator'

import { useActiveWeb3React } from 'hooks/useActiveWeb3React'

export enum NetworkModalMode {
  Default,
  PrimaryBridge,
  SecondaryBridge
}

interface NetworkModalProps {
  isVisible: boolean
  mode: NetworkModalMode
  onDismiss: () => void
  onChangeNetwork?: (chainId: number) => void
  tokenAddress?: string
}

const showDescription = (chainId: ChainId, mode: NetworkModalMode) => {
  switch (mode) {
    case NetworkModalMode.PrimaryBridge:
    case NetworkModalMode.SecondaryBridge:
      return <p className="text-sm">Select a network to use for the bridge.</p>
    default:
      return (
        <p className="text-sm">
          You are currently browsing{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-tr from-primary-hover via-primary-gradientVia to-primary-gradientTo">
            HALODAO
          </span>{' '}
          on the <span>{NETWORK_LABEL[chainId]}</span> network
        </p>
      )
  }
}

const showConnected = (mode: NetworkModalMode) => {
  if (mode === NetworkModalMode.Default) {
    return <ConnectedIndicator />
  }
  return <> </>
}

const pickClass = (mode: NetworkModalMode) => {
  switch (mode) {
    case NetworkModalMode.PrimaryBridge:
    case NetworkModalMode.SecondaryBridge:
      return 'flex flex-row items-center pt-2 pb-2 cursor-pointer hover:bg-secondary'
    default:
      return 'flex flex-row items-center mb-4 pt-4 cursor-pointer pb-4 border border-gray-300 p-4 rounded-lg hover:border-primary-dark'
  }
}

const NetworkModal = ({ isVisible, mode, onDismiss, onChangeNetwork, tokenAddress }: NetworkModalProps) => {
  const { chainId, library, account } = useActiveWeb3React()

  if (!chainId) return null

  if (mode === NetworkModalMode.SecondaryBridge && chainId !== ORIGINAL_TOKEN_CHAIN_ID[tokenAddress as string]) {
    return (
      <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
        <div className="bg-primary-lightest p-4 border-b border-gray-700">
          <div className="flex flex-col">
            <p className="font-bold text-lg mb-2">Select Network</p>
            {showDescription(chainId, mode)}
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col">
            <div className={pickClass(mode)} onClick={onDismiss}>
              <div>
                <img
                  src={NETWORK_ICON[ORIGINAL_TOKEN_CHAIN_ID[tokenAddress as string]]}
                  alt="Switch Network"
                  className="logo h-7 rounded-2xl mr-4"
                />
              </div>
              <div>{NETWORK_LABEL[ORIGINAL_TOKEN_CHAIN_ID[tokenAddress as string]]}</div>
              {showConnected(mode)}
            </div>
          </div>
        </div>
      </BaseModal>
    )
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      <div className="bg-primary-lightest p-4 border-b border-gray-700">
        <div className="flex flex-col">
          <p className="font-bold text-lg mb-2">Select Network</p>
          {showDescription(chainId, mode)}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col">
          {[
            ChainId.MAINNET,
            //ChainId.FANTOM,
            ChainId.BSC,
            ChainId.MATIC,
            //ChainId.HECO,
            ChainId.XDAI
            //ChainId.HARMONY,
            //ChainId.AVALANCHE,
            //ChainId.OKEX
            //ChainId.MOONBASE
          ].map((key: ChainId, i: number) => {
            if (chainId === key && mode !== NetworkModalMode.PrimaryBridge) {
              return (
                <div
                  key={i}
                  className="mt-2"
                  onClick={() => {
                    if (mode !== NetworkModalMode.Default) {
                      onDismiss()
                    }
                  }}
                >
                  <div className={pickClass(mode)}>
                    <div>
                      <img src={NETWORK_ICON[key]} alt="Switch Network" className="logo h-7 rounded-2xl mr-4" />
                    </div>
                    <div>{NETWORK_LABEL[key]}</div>
                    {showConnected(mode)}
                  </div>
                </div>
              )
            }
            if (mode === NetworkModalMode.SecondaryBridge && chainId === key) {
              return (
                <div key={i} className="mt-2" onClick={() => onDismiss()}>
                  <div className={pickClass(mode)}>
                    <div>
                      <img src={NETWORK_ICON[key]} alt="Switch Network" className="logo h-7 rounded-2xl mr-4" />
                    </div>
                    <div>{NETWORK_LABEL[key]}</div>
                    {showConnected(mode)}
                  </div>
                </div>
              )
            }
            return (
              <div
                key={i}
                onClick={() => {
                  onDismiss()
                  if (mode !== NetworkModalMode.SecondaryBridge) {
                    console.log('mode', mode)
                    const params = NETWORK_PARAMS[key]
                    library?.send('wallet_addEthereumChain', [params, account])
                  } else if (mode === NetworkModalMode.SecondaryBridge) {
                    if (onChangeNetwork) onChangeNetwork(key)
                  }
                }}
              >
                <div className={pickClass(mode)}>
                  <div>
                    <img src={NETWORK_ICON[key]} alt="Switch Network" className="logo h-7 rounded-2xl mr-4" />
                  </div>
                  <div>
                    <div className="text-primary font-bold">{NETWORK_LABEL[key]}</div>
                  </div>
                </div>{' '}
              </div>
            )
          })}
        </div>
      </div>
    </BaseModal>
  )
}

export default NetworkModal
