import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ChainId, Token } from '@sushiswap/sdk'
import { HALO, HALOHALO, TRUE_AUD, TRUE_CAD, TRUE_GBP } from '../../../constants'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import CurrencyLogo from 'components/CurrencyLogo'
import { Search } from 'react-feather'
import { useActiveWeb3React } from 'hooks'

interface TokenSelectModalProps {
  isVisible: boolean
  onDismiss: () => void
  onSelect: (token: Token) => void
  tokenList?: Token[]
}

interface TokenRowProps {
  token: Token
  onSelect: (token: Token) => void
}

const TokenRow = ({ token, onSelect }: TokenRowProps) => {
  return (
    <div
      key={token.name}
      className="flex flex-row items-center cursor-pointer p-4 hover:bg-secondary"
      onClick={() => onSelect(token)}
    >
      <CurrencyLogo currency={token} size={'30px'} />
      <div className="flex flex-col pl-2 focus:bg-primary">
        <div className="ml-2 font-semibold">{token.symbol}</div>
        <div className="ml-2 text-xs text-gray-500">{token.name}</div>
      </div>
    </div>
  )
}

const TokenSelectModal = ({ isVisible, onSelect, onDismiss, tokenList }: TokenSelectModalProps) => {
  const { chainId } = useActiveWeb3React()
  const [tokens, setTokens] = useState(tokenList ?? [])

  useEffect(() => {
    if (tokenList) {
      setTokens(tokenList)
      return
    }

    if (!chainId) return

    const hardCodedTokens: Token[] = []
    if (HALO[chainId]) hardCodedTokens.push(HALO[chainId]!)
    if (HALOHALO[chainId]) hardCodedTokens.push(HALOHALO[chainId]!)
    if (TRUE_AUD[chainId]) hardCodedTokens.push(TRUE_AUD[chainId]!)
    if (TRUE_CAD[chainId]) hardCodedTokens.push(TRUE_CAD[chainId]!)
    if (TRUE_GBP[chainId]) hardCodedTokens.push(TRUE_GBP[chainId]!)
    setTokens(hardCodedTokens)
  }, [chainId, tokenList])

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

      {tokens.map(token => (
        <TokenRow key={token.address} token={token} onSelect={() => onSelect(token)} />
      ))}
    </BaseModal>
  )
}

export default TokenSelectModal
