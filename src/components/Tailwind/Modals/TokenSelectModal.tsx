import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@sushiswap/sdk'
import { HALO, TRUE_AUD, TRUE_CAD, TRUE_GBP } from '../../../constants'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import CurrencyLogo from 'components/CurrencyLogo'
import { Search } from 'react-feather'

interface TokenSelectModalProps {
  isVisible: boolean
  onDismiss: () => void
  onSelect?: (token: any | undefined) => void
}

interface TokenListProps {
  chainId: number
  onSelect?: (token: any | undefined) => void
}

const TOKENS = [HALO, TRUE_AUD, TRUE_CAD, TRUE_GBP]

const TokenList = ({ chainId, onSelect }: TokenListProps) => {
  return (
    <div className="p-4">
      {TOKENS.map(token => (
        <div
          key={token[chainId as ChainId]?.name}
          className="flex flex-row items-center cursor-pointer p-4 hover:bg-secondary"
          onClick={() => {
            console.log('on select token')
            if (onSelect) onSelect(token)
          }}
        >
          <CurrencyLogo currency={token[chainId as ChainId]} size={'30px'} />
          <div className="flex flex-col pl-2 focus:bg-primary">
            <div className="ml-2 font-semibold">{token[chainId as ChainId]?.symbol}</div>
            <div className="ml-2 text-xs text-gray-500">{token[chainId as ChainId]?.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const TokenSelectModal = ({ isVisible, onSelect, onDismiss }: TokenSelectModalProps) => {
  const { chainId } = useWeb3React()
  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      <div className="bg-primary-lightest p-4 border-b">
        <div className="flex flex-col">
          <p className="font-bold text-lg">Select Asset</p>
          <div className="flex flex-row items-center mt-4 bg-white border border-gray-300 rounded-lg">
            <Search className="ml-2 h-5 w-5" />
            <input
              className="rounded-md p-2 w-full focus-within:border-gray-800"
              placeholder="Search name or select asset"
            />
          </div>
        </div>
      </div>
      <TokenList chainId={chainId as number} onSelect={onSelect} />
    </BaseModal>
  )
}

export default TokenSelectModal
