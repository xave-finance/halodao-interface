import React from 'react'

const GradientCard = ({ children }: any) => {
  return (
    <div>
      <div className="w-full h-auto bg-epochTimer text-white p-5 rounded-2xl">{children}</div>
    </div>
  )
}

export default GradientCard
