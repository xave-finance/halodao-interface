import React from 'react'

interface InfoCardProps {
  title: string
  description: string
}

const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <div>
      <div className="flex-auto bg-primary-light mt-8 md:mr-6 py-6 px-8 rounded-card shadow">
        <div className="text-xs font-extrabold tracking-widest text-primary uppercase">{title}</div>
        <div className="text-base pt-4">{description}</div>
      </div>
    </div>
  )
}

export default InfoCard
