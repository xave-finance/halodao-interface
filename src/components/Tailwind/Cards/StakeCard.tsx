import React from 'react'

interface StakeCardProps {
  title: string
  value: string
}

const StakeCard = ({ title, value }: StakeCardProps) => {
  return (
    <div>
      <div className="w-auto md:w-44 h-20 md:h-28 grid grid-cols-1 content-between border-2 border-link-alternate rounded-card bg-stakeCard">
        <div className="md:bg-link-alternate font-extrabold tracking-widest uppercase text-xl md:text-9px text-link-alternate md:text-white md:text-center pl-3 md:pl-0 py-2 rounded-t-md">
          {title}
        </div>
        <div className="text-base text-24px px-3 pb-2">{value}</div>
      </div>
    </div>
  )
}

export default StakeCard
