import NumericalInput from 'components/NumericalInput'
import React, { useState } from 'react'
import { HelpCircle as QuestionIcon } from 'react-feather'

const SlippageTolerance = () => {
  const [customSlippage, setCustomSlippage] = useState('')

  const Button = ({ title }: { title: string }) => (
    <button
      className={`
        text-sm font-bold text-primary-hover
        py-1 px-3
        bg-transparent border border-primary
        rounded-button
        cursor-pointer
        hover:bg-primary hover:text-white
        active:ring active:ring-purple-300
      `}
    >
      {title}
    </button>
  )

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span>Slippage tollerance:</span>
        <QuestionIcon size={16} />
      </div>
      <div className="flex space-x-4 mb-2">
        <Button title="0.1%" />
        <Button title="0.5%" />
        <Button title="1%" />
        <div className="w-20">
          <NumericalInput
            className="text-sm font-bold text-primary-hover py-1 px-3 border border-solid border-primary rounded-button w-full"
            value={customSlippage}
            onUserInput={val => setCustomSlippage(val)}
          />
        </div>
        <div className="flex-auto"></div>
      </div>
    </div>
  )
}

export default SlippageTolerance
