import React from 'react'
import Slider from 'components/Slider'

interface AmountSliderProps {
  amount: number
  didChangeAmount: (amt: number) => void
}

const AmountSlider = ({ amount, didChangeAmount }: AmountSliderProps) => {
  const Button = ({ title, onClick }: { title: string; onClick: () => void }) => (
    <button
      className={`
        text-sm font-bold text-primary-hover uppercase
        flex-1 py-1 px-3
        bg-transparent border border-primary
        rounded-button
        cursor-pointer
        hover:bg-primary hover:text-white
        active:ring active:ring-purple-300
      `}
      onClick={onClick}
    >
      {title}
    </button>
  )

  return (
    <div>
      <div className="text-4xl font-semibold mb-2">{amount} %</div>
      <Slider value={amount} min={0} max={100} onChange={amt => didChangeAmount(amt)} />
      <div className="mt-4 flex space-x-4">
        <Button title="25%" onClick={() => didChangeAmount(25)} />
        <Button title="50%" onClick={() => didChangeAmount(50)} />
        <Button title="75%" onClick={() => didChangeAmount(75)} />
        <Button title="Max" onClick={() => didChangeAmount(100)} />
      </div>
    </div>
  )
}

export default AmountSlider
