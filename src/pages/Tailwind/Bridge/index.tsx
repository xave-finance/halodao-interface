import React, { useState } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import SwitchButton from 'components/Tailwind/Buttons/SwitchButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import WarningAlert from 'components/Tailwind/Alerts/WarningAlert'

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
            <div className="mt-2">
              <input
                readOnly
                className="rounded-md p-2 w-full bg-primary-lightest"
                value="0x3ADAb6e3EF2d9650DeA2bEA1cD556F6d3d97885F"
              />
            </div>
            <div className="mt-4 flex space-x-4">
              <div className="w-1/2">
                <ApproveButton
                  title="Approve"
                  state={ApproveButtonState.NotApproved}
                  onClick={() => console.log('clicked')}
                />
              </div>
              <div className="w-1/2">
                <PrimaryButton
                  title="Next"
                  state={PrimaryButtonState.Disabled}
                  onClick={() => console.log('clicked')}
                />
              </div>
            </div>
            <div className="mt-2">
              <PrimaryButton
                title="Connect to Wallet"
                state={PrimaryButtonState.Enabled}
                onClick={() => console.log('clicked')}
              />
            </div>
            <div className="mt-2">
              <PrimaryButton
                type={PrimaryButtonType.Gradient}
                title="Next"
                state={PrimaryButtonState.Enabled}
                onClick={() => console.log('clicked')}
              />
            </div>
            <div className="mt-2">
              <RetryButton title="Retry" isEnabled={true} onClick={() => console.log('clicked')} />
            </div>
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
