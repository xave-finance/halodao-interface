import React, { useState } from 'react'
import { Currency, Token } from '@halodao/sdk'
import CurrencyLogo from 'components/CurrencyLogo'
import MaxButton from '../Buttons/MaxButton'
import SelectButton from '../Buttons/SelectButton'
import NumericalInput from 'components/NumericalInput'
import TokenSelectModal from 'components/Tailwind/Modals/TokenSelectModal'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { useActiveWeb3React } from 'hooks'
import { MouseoverTooltip } from '../../Tooltip'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import { formatUnits } from 'ethers/lib/utils'
import { bigNumberToNumber } from 'utils/bigNumberHelper'

interface TokenInputProps {
  currency: Currency
  value: string
  canSelectToken: boolean
  didChangeValue: (newValue: string) => void
  showBalance: boolean
  showMax: boolean
  onSelectToken?: (token: Token) => void
  tokenList?: Token[]
  balance?: string
}

const TokenInput = ({
  currency,
  value,
  canSelectToken,
  didChangeValue,
  showBalance,
  showMax,
  onSelectToken,
  tokenList,
  balance
}: TokenInputProps) => {
  const [showModal, setShowModal] = useState(false)
  const { account } = useActiveWeb3React()

  const currencyBalance = useTokenBalance(
    currency instanceof Token ? (currency as Token).address : undefined,
    account ?? undefined
  )

  const onMax = () => {
    const _balance = balance ? balance : formatUnits(currencyBalance.value, currencyBalance.decimals)
    if (_balance && Number(_balance) > 0) {
      didChangeValue(_balance)
    }
  }

  const showSelectedCurrency = () => {
    if (canSelectToken) {
      return (
        <div className="mb-2 md:mb-0 md:w-1/4 flex items-center cursor-pointer" onClick={() => setShowModal(true)}>
          <CurrencyLogo currency={currency} />
          <div className="ml-2 font-semibold pr-2">{currency ? currency.symbol : ''}</div>
          <SelectButton onClick={() => setShowModal(true)} />
        </div>
      )
    } else {
      return (
        <div className="mb-2 md:mb-0 md:w-1/4 flex items-center">
          <CurrencyLogo currency={currency} />
          <div className="ml-2 font-semibold">{currency.symbol}</div>
        </div>
      )
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row">
        {showSelectedCurrency()}
        <div className="mb-2 md:mb-0 md:ml-4 md:w-3/4 flex items-center p-4 rounded-card bg-primary-lightest h-tokenInput">
          <div className="flex-auto">
            {showBalance && (
              <div className="text-xs text-secondary-alternate uppercase font-semibold tracking-widest">
                <MouseoverTooltip
                  text={'These are the tokens in your wallet, not the tokens in the pool.'}
                  placement={'top'}
                >
                  Wallet Balance:&nbsp;{' '}
                </MouseoverTooltip>
                {balance
                  ? formatNumber(Number(balance), NumberFormat.long)
                  : currencyBalance
                  ? formatNumber(bigNumberToNumber(currencyBalance.value, currencyBalance.decimals), NumberFormat.long)
                  : '-'}
              </div>
            )}
            <NumericalInput
              className="text-2xl font-semibold bg-transparent w-full focus:outline-none"
              value={value}
              onUserInput={val => {
                didChangeValue(val)
              }}
            />
          </div>
          <div className="ml-4">{showMax && <MaxButton title="Max" isEnabled={true} onClick={onMax} />}</div>
        </div>
      </div>

      <TokenSelectModal
        isVisible={showModal}
        onDismiss={() => setShowModal(false)}
        onSelect={token => {
          if (onSelectToken) onSelectToken(token)
          setShowModal(false)
        }}
        tokenList={tokenList}
      />
    </>
  )
}

export default TokenInput
