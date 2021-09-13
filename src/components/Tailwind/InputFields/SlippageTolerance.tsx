import NumericalInput from 'components/NumericalInput'
import React, { useState } from 'react'
import { HelpCircle as QuestionIcon } from 'react-feather'

interface SlippageButtonProps {
  title: string
  onClick: () => void
  highlighted: boolean
}

const SlippageButton = ({ title, onClick, highlighted }: SlippageButtonProps) => (
  <button
    className={`
      text-sm font-bold 
      py-1 px-3
      rounded-button
      cursor-pointer
      hover:bg-primary hover:text-white
      active:ring active:ring-purple-300
      ${highlighted ? 'text-white bg-primary' : 'text-primary-hover bg-transparent border border-primary'}
    `}
    onClick={onClick}
  >
    {title}
  </button>
)

interface SlippageToleranceProps {
  value: string
  didChangeValue: (val: string) => void
}

const SlippageTolerance = ({ value, didChangeValue }: SlippageToleranceProps) => {
  const [customSlippage, setCustomSlippage] = useState('')

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span>Slippage tolerance:</span>
        <QuestionIcon size={16} />
      </div>
      <div className="flex space-x-4 mb-2">
        <SlippageButton title="0.5%" onClick={() => didChangeValue('0.5')} highlighted={value === '0.5'} />
        <SlippageButton title="1%" onClick={() => didChangeValue('1')} highlighted={value === '1'} />
        <div className="w-20">
          <NumericalInput
            className="text-sm font-bold text-primary-hover py-1 px-3 border border-solid border-primary rounded-button w-full"
            value={customSlippage}
            onUserInput={val => {
              setCustomSlippage(val)
              didChangeValue(val)
            }}
          />
        </div>
        <div className="flex-auto"></div>
      </div>
    </div>
  )
}

export default SlippageTolerance
