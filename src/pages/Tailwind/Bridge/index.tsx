import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import SwitchButton from 'components/Tailwind/Buttons/SwitchButton'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import WarningAlert from 'components/Tailwind/Alerts/WarningAlert'
import ButtonGroup from './ButtonGroup'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { shortenAddress } from '../../../utils'

interface WalletStatusProp {
  amount: string
}

const WalletStatus = ({ amount }: WalletStatusProp) => {
  const { account, error } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const balance = useCurrencyBalance(account ?? undefined, HALO[ChainId.MAINNET])

  if (!account && !error) {
    return (
      <div className="mt-2">
        <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
      </div>
    )
  } else {
    return (
      <>
        <div className="mt-2">
          <p className="rounded-md p-2 w-full bg-primary-lightest"> {account && shortenAddress(account)}</p>
        </div>
        <ButtonGroup amount={amount} balance={balance} />
      </>
    )
  }
}

const Bridge = () => {
  const [inputValue, setInputValue] = useState('')

  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Bridge"
          caption="Move your ERC-20 token from EVM bridge to EVM bridge."
          link={{ text: 'Learn about bridge', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-dark shadow-md rounded-card">
          <div>
            <div className="flex space-x-4 mt-2">
              <div className="mb-2 w-2/5">
                <p className="text-secondary font-semibold">From</p>
              </div>
              <div className="mb-2 w-1/5"></div>
              <div className="mb-2 w-2/5">
                <p className="text-secondary font-semibold">To</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <SelectedNetworkPanel />
              <div className="mb-2 w-1/5 flex items-center justify-center">
                <SwitchButton onClick={() => console.log('clicked')} />
              </div>
              <SelectedNetworkPanel />
            </div>
            <p className="mt-2 font-semibold text-secondary">Amount</p>
            <div className="mt-2">
              <CurrencyInput
                currency={HALO[ChainId.MAINNET]!}
                value={inputValue}
                canSelectToken={true}
                didChangeValue={val => setInputValue(val)}
                showBalance={true}
                showMax={true}
              />
            </div>
            <p className="mt-2 font-semibold text-secondary">Destination Address</p>
            <WalletStatus amount={inputValue} />
            <div className="mt-2">
              <WarningAlert message="Don’t use exchange address for cross-chain transfers" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start md:w-1/2">
        <InfoCard
          title="Some Extra Info"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Parturient id vitae morbi ipsum est maecenas tellus at. Consequat in justo"
        />
      </div>
    </PageWrapper>
  )
}

export default Bridge
