import React, { useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import NumericalInput from 'components/NumericalInput'
import { HelpCircle as QuestionIcon } from 'react-feather'
import styled from 'styled-components'
import { MouseoverTooltip } from '../../../../components/Tooltip'

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
  const [slippage, setSlippage] = useState(0.03)

  const dismissGracefully = () => {
    onDismiss()
  }
  const TooltipContainer = styled.div`
    cursor: pointer;
  `
  const Description = 'Your transaction will revert if it is pending for more than this period of time.'

  return (
    <BaseModal isVisible={isVisible} onDismiss={dismissGracefully}>
      <div className="p-4">
        <div className="font-semibold text-lg">Transaction settings</div>
        <div className="mt-4">
          <SlippageTolerance
            value={String(slippage * 100)}
            didChangeValue={(newSlippage: string) => {
              const convertedNewSlippage = Number(newSlippage) / 100
              setSlippage(convertedNewSlippage)
              onSlippageChanged(convertedNewSlippage)
            }}
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span>Transaction deadline: </span>
          <MouseoverTooltip placement={'top'} text={Description}>
            <TooltipContainer>
              <QuestionIcon size={16} />
            </TooltipContainer>
          </MouseoverTooltip>
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
