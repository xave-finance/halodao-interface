import React from 'react'

interface OnOffToggleProps {
  didChangeValue: (newValue: string) => void
}

const OnOffToggle = ({ didChangeValue }: OnOffToggleProps) => {
  return (
    <>
      <div>
        <div className="w-16 h-8 flex items-center bg-primary bg-opacity-50 rounded-md duration-300 ease-in-out">
          <div className="bg-white w-8 h-8 rounded-md bg-primary transform duration-300 ease-in-out font-bold text-sm text-white p-1.5">On</div>
        </div>
      </div>
    </>
  )
}

export default OnOffToggle
