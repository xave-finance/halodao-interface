import React, { useEffect, useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import NumericalInput from 'components/NumericalInput'
import OnOffToggle from 'components/Tailwind/Toggle/OnOffToggle'
import { HelpCircle as QuestionIcon } from 'react-feather'

enum SwapSettingsModalState {
  NotConfirmed,
  InProgress,
  Successful
}

interface SwapSettingsModalProps {
  txDeadline: string
  isVisible: boolean
  onSlippageChanged: (slippage: string) => void
  onDismiss: () => void
  didChangeTxDeadline: (newValue: string) => void
}

const SwapSettingsModal = ({
  txDeadline,
  isVisible,
  onSlippageChanged,
  onDismiss,
  didChangeTxDeadline
}: SwapSettingsModalProps) => {
  const [state, setState] = useState(SwapSettingsModalState.NotConfirmed)
  const [slippage, setSlippage] = useState('0.1')
  const [fromInputValue, setFromInputValue] = useState('')

  const dismissGracefully = () => {
    setState(SwapSettingsModalState.NotConfirmed)
    onDismiss()
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={dismissGracefully}>
      <div className="p-4">
        <div className="font-semibold text-lg">Transaction settings</div>
        <div className="mt-4">
          <SlippageTolerance
            value={slippage}
            didChangeValue={(newSlippage: string) => {
              setSlippage(newSlippage)
              onSlippageChanged(newSlippage)
            }}
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span>Transaction deadline</span>
          <QuestionIcon size={16} />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <div className="w-20">
            <NumericalInput
              className="text-sm font-bold text-primary-hover py-1 px-3 border border-solid border-primary rounded-button w-full"
              value={txDeadline}
              onUserInput={val => {
                didChangeTxDeadline(val)
              }}
            />
          </div>
          <span>minutes</span>
        </div>
        <div className="mt-4 font-semibold text-lg">Interface settings</div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <span>Transaction deadline</span>
            <QuestionIcon size={16} />
          </div>
          <OnOffToggle didChangeValue={val => setFromInputValue(val)} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2 mb-2">
            <span>Disable Multihops</span>
            <QuestionIcon size={16} />
          </div>
          <OnOffToggle didChangeValue={val => setFromInputValue(val)} />
        </div>
      </div>
    </BaseModal>
  )
}

export default SwapSettingsModal
