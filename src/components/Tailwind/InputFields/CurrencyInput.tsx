import React from 'react'
import { Currency } from '@sushiswap/sdk'
import CurrencyLogo from 'components/CurrencyLogo'
import MaxButton from '../Buttons/MaxButton'
import NumericalInput from 'components/NumericalInput'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'

interface TokenInputProps {
  currency: Currency
  value: string
  didChangeValue: (newValue: string) => void
  showBalance: boolean
  showMax: boolean
}

const TokenInput = ({ currency, value, didChangeValue, showBalance, showMax }: TokenInputProps) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const onMax = () => {
    if (balance) {
      didChangeValue(balance.toExact())
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mb-2 md:mb-0 md:w-1/4 flex items-center">
        <CurrencyLogo currency={currency} />
        <div className="ml-2 font-semibold">{currency.symbol}</div>
      </div>
      <div className="mb-2 md:mb-0 md:w-3/4 flex items-center p-4 rounded-card bg-primary-lightest h-tokenInput">
        <div className="flex-auto">
          {showBalance && (
            <div className="text-xs text-secondary uppercase font-semibold tracking-widest">
              Balance: {balance ? balance.toSignificant(6) : '-'}
            </div>
          )}
          <NumericalInput
            className="text-2xl font-semibold bg-transparent w-full focus:outline-none"
            value={value}
            onUserInput={val => {
              console.log('did change value!')
              didChangeValue(val)
            }}
          />
        </div>
        <div className="ml-4">{showMax && <MaxButton title="Max" isEnabled={true} onClick={onMax} />}</div>
      </div>
    </div>
  )
}

export default TokenInput
