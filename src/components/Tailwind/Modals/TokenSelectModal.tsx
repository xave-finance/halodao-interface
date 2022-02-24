import React, { useEffect, useState } from 'react'
import { Currency, Token } from '@halodao/sdk'
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
  currency: Currency
}

interface TokenRowProps {
  token: Token
  onSelect: (token: Token) => void
  selected: boolean
}

const TokenRow = ({ token, onSelect, selected }: TokenRowProps) => {
  return (
    <div
      style={{
        pointerEvents: selected ? 'none' : 'unset',
        opacity: selected ? '0.5' : 'unset'
      }}
      key={token.name}
      className="flex flex-row items-center cursor-pointer p-4 hover:bg-secondary"
      onClick={() => onSelect(token)}
    >
      <CurrencyLogo currency={token} size={'30px'} />
      <div className="flex flex-col pl-2 focus:bg-primary">
        <div className="ml-2 font-semibold">{token.symbol}</div>
        <div className="ml-2 text-xs text-gray-500">{token.name}</div>
        {selected && <small className="ml-2 text-xs text-green-600 font-bold">Selected</small>}
      </div>
    </div>
  )
}

const TokenSelectModal = ({ isVisible, onSelect, onDismiss, tokenList, currency }: TokenSelectModalProps) => {
  const { chainId } = useActiveWeb3React()
  const [tokens, setTokens] = useState(tokenList ?? [])
  const [searchTerm, setsearchTerm] = useState('')
  useEffect(() => {
    if (tokenList) {
      setTokens(tokenList)
      return
    }
    if (!chainId) return

    const hardCodedTokens: Token[] = []
    const haloToken = HALO[chainId]
    if (haloToken) hardCodedTokens.push(haloToken)
    const haloHaloToken = HALOHALO[chainId]
    if (haloHaloToken) hardCodedTokens.push(haloHaloToken)
    const audToken = TRUE_AUD[chainId]
    if (audToken) hardCodedTokens.push(audToken)
    const cadToken = TRUE_CAD[chainId]
    if (cadToken) hardCodedTokens.push(cadToken)
    const gbpToken = TRUE_GBP[chainId]
    if (gbpToken) hardCodedTokens.push(gbpToken)
    setTokens(hardCodedTokens)
  }, [chainId, tokenList])

  const SearchList = tokens
    .filter(val => {
      if (searchTerm == '') {
        return val
      } else if (val.symbol?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val
      }
      return
    })
    .map(token => (
      <TokenRow
        key={token.address}
        token={token}
        onSelect={() => onSelect(token)}
        selected={currency.symbol === token.symbol}
      />
    ))
  return (
    <BaseModal isVisible={isVisible} onDismiss={onDismiss}>
      <div className="bg-primary-lightest p-4 border-b">
        <div className="flex flex-col">
          <p className="font-bold text-lg">Select Asset</p>
          <div className="container mt-4 w-full">
            <div className="relative">
              <div className="absolute top-4 left-3">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                style={{ width: '100%' }}
                className="h-14 pr-8 pl-10 rounded z-0 focus:shadow focus-within:border-gray-800"
                placeholder="Search name or select asset"
                onChange={e => {
                  setsearchTerm(e.target.value)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {SearchList.length < 1 ? (
        <div className="flex flex-row items-center p-4">
          <div className="flex flex-col pl-2 text-red-700">No Search Result Found</div>
        </div>
      ) : (
        SearchList
      )}
    </BaseModal>
  )
}

export default TokenSelectModal
