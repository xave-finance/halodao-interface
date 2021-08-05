import React from 'react'
import { ChainId } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import CurrencyLogo from 'components/CurrencyLogo'

interface TokenSelectModalProps {
  isVisible: boolean
  onDismiss: () => void
}

const TokenSelectModal = ({ isVisible, onDismiss }: TokenSelectModalProps) => {
  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      <div className="bg-primary-lightest p-4 border-b">
        <div className="flex flex-col">
          <p className="font-bold text-lg">Select Asset</p>
          <div className="pt-2">
            <input
              className="rounded-md p-2 w-full bg-white border border-gray-200 focus:border-gray-800"
              placeholder="Search name or select asset"
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-row items-center">
          <CurrencyLogo currency={HALO[ChainId.MAINNET]!} />
          <div className="flex flex-col pl-2 focus:bg-primary">
            <div className="ml-2 font-semibold">{HALO[ChainId.MAINNET]!.symbol}</div>
            <div className="ml-2 text-xs text-gray-500">{HALO[ChainId.MAINNET]!.name}</div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default TokenSelectModal
