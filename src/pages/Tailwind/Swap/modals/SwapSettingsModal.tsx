import React, { useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import NumericalInput from 'components/NumericalInput'
import { HelpCircle as QuestionIcon } from 'react-feather'

interface SwapSettingsModalProps {
  txDeadline: number
  isVisible: boolean
  onSlippageChanged: (slippage: number) => void
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
  const [slippage, setSlippage] = useState(0.0001)

  const dismissGracefully = () => {
    onDismiss()
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={dismissGracefully}>
      <div className="p-4">
        <div className="font-semibold text-lg">Transaction settings</div>
        <div className="mt-4">
          <SlippageTolerance
            value={String(slippage)}
            didChangeValue={(newSlippage: string) => {
              setSlippage(Number(newSlippage))
              onSlippageChanged(Number(newSlippage))
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
      </div>
    </BaseModal>
  )
}

export default SwapSettingsModal
